<?php
/**
 * Local preview server for the CWP7 themes (renders the real Twig templates).
 *
 *   php -S 127.0.0.1:8088 router.php      (see serve.cmd)
 *
 * Themes are the sibling folders of preview/ that contain an index.html (modern, original ...).
 *
 * Routes
 *   /                       dashboard            /?module=email_accounts   a module page
 *   /?theme=original        switch theme (remembered in a cookie)
 *   /?style=dark            use the dark stylesheet
 *   /__pages                index of every page  /__tpl/login.html         standalone templates
 */
require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/mock.php';

$root = realpath(__DIR__ . '/..');
$path = rawurldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

/** Theme folders next to preview/ (anything with an index.html). */
function preview_themes(string $root): array
{
    $themes = [];
    foreach (glob($root . '/*', GLOB_ONLYDIR) as $dir) {
        if (is_file($dir . '/index.html')) {
            $themes[] = basename($dir);
        }
    }
    return $themes;
}

$themes = preview_themes($root);
if (!$themes) {
    exit('No theme folder found next to preview/ (a folder with an index.html).');
}
$current = preg_replace('/[^\w\-]/', '', $_GET['theme'] ?? $_COOKIE['preview_theme'] ?? '');
if (!in_array($current, $themes, true)) {
    $current = in_array('modern', $themes, true) ? 'modern' : $themes[0];
}
if (($_GET['theme'] ?? '') === $current) {
    setcookie('preview_theme', $current, ['expires' => time() + 86400 * 365, 'path' => '/', 'samesite' => 'Lax']);
}
$theme = $root . '/' . $current;

$mime = [
    'css' => 'text/css', 'js' => 'application/javascript', 'json' => 'application/json', 'map' => 'application/json',
    'png' => 'image/png', 'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'gif' => 'image/gif', 'svg' => 'image/svg+xml',
    'ico' => 'image/x-icon', 'woff2' => 'font/woff2', 'woff' => 'font/woff', 'ttf' => 'font/ttf', 'eot' => 'application/vnd.ms-fontobject',
];

/** Send a static file from inside $base, if it exists there. */
function send_static(string $base, string $rel, array $mime): bool
{
    $base = realpath($base);
    $real = realpath($base . $rel);
    if (!$base || !$real || !str_starts_with($real, $base . DIRECTORY_SEPARATOR) || !is_file($real) || preg_match('/\.(html|twig|php)$/i', $real)) {
        return false;
    }
    header('Content-Type: ' . ($mime[strtolower(pathinfo($real, PATHINFO_EXTENSION))] ?? 'application/octet-stream'));
    readfile($real);
    return true;
}

// The server serves the login assets from the original theme under /login/cwp_theme/original/ (the templates hardcode that URL).
$loginPrefix = '/login/cwp_theme/original/';
if (str_starts_with($path, $loginPrefix) && is_dir($root . '/original')
    && send_static($root . '/original', '/' . substr($path, strlen($loginPrefix)), $mime)) {
    return true;
}

// Static assets (css, js, img, fonts ...) come from the selected theme folder.
if ($path !== '/' && send_static($theme, $path, $mime)) {
    return true;
}

// Some module scripts (js/modules/*.js.twig) ship with CWP itself, not with the theme: stub them as empty.
$stubLoader = new class implements \Twig\Loader\LoaderInterface {
    public function getSourceContext(string $name): \Twig\Source { return new \Twig\Source('/* stub */', $name); }
    public function exists(string $name): bool { return (bool) preg_match('#^/?js/modules/[\w\-]+\.js\.twig$#', $name); }
    public function getCacheKey(string $name): string { return 'stub:' . $name; }
    public function isFresh(string $name, int $time): bool { return true; }
};
$twig = new \Twig\Environment(new \Twig\Loader\ChainLoader([new \Twig\Loader\FilesystemLoader($theme), $stubLoader]), [
    'autoescape' => false, 'strict_variables' => false, 'cache' => false,
]);

/** Floating theme picker added to every preview page (not part of the theme). */
function theme_switcher(array $themes, string $current): string
{
    $opts = '';
    foreach ($themes as $t) {
        $opts .= '<option value="' . $t . '"' . ($t === $current ? ' selected' : '') . '>' . $t . '</option>';
    }
    $keep = '';
    foreach ($_GET as $k => $v) {
        if ($k !== 'theme' && is_string($v)) {
            $keep .= '<input type="hidden" name="' . htmlspecialchars($k) . '" value="' . htmlspecialchars($v) . '">';
        }
    }
    return '<form method="get" style="position:fixed;right:12px;bottom:12px;z-index:2147483647;margin:0;padding:6px 10px;'
        . 'background:#222;color:#fff;font:12px system-ui;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,.4)">'
        . 'Theme <select name="theme" onchange="this.form.submit()" style="font:inherit;color:#000;background:#fff">' . $opts . '</select>'
        . ' <a href="/__pages" style="color:#9cf;margin-left:6px">pages</a>' . $keep . '</form>';
}

function render(\Twig\Environment $twig, string $tpl, array $ctx): void
{
    global $themes, $current;
    try {
        header('Content-Type: text/html; charset=utf-8');
        $html = $twig->render($tpl, $ctx);
        $bar  = theme_switcher($themes, $current);
        echo stripos($html, '</body>') !== false ? preg_replace('~</body>~i', $bar . '</body>', $html, 1) : $html . $bar;
    } catch (\Throwable $e) {
        http_response_code(500);
        echo '<pre style="padding:20px;color:#b00;white-space:pre-wrap"><b>Twig error in ' . htmlspecialchars($tpl) . "</b>\n\n"
            . htmlspecialchars($e->getMessage()) . '</pre>';
    }
}

// Index of all pages
if ($path === '/__pages') {
    $files = array_map('basename', glob($theme . '/mod_*.html'));
    sort($files);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><meta charset="utf-8"><title>Preview pages</title><body style="font:14px system-ui;margin:30px;line-height:1.9">';
    echo '<h2>CWP7 theme preview: ' . $current . '</h2><p>Theme: ';
    foreach ($themes as $t) {
        echo $t === $current ? "<b>$t</b> &nbsp;" : '<a href="/__pages?theme=' . $t . '">' . $t . '</a> &nbsp;';
    }
    echo '</p><p><a href="/">Dashboard</a> &middot; <a href="/?style=dark">Dashboard (dark)</a></p><h3>Modules</h3>';
    foreach ($files as $f) {
        $m = substr($f, 4, -5);
        echo '<a href="/?module=' . $m . '" style="display:inline-block;margin:0 14px 0 0">' . $m . '</a>';
    }
    echo '<h3>Standalone</h3>';
    foreach (['login.html', 'lost-password.html', '404.html', 'locked.html', 'locked_update.html', 'login_old.html'] as $f) {
        if (is_file($theme . '/' . $f)) {
            echo '<a href="/__tpl/' . $f . '" style="margin-right:14px">' . $f . '</a>';
        }
    }
    return true;
}

// Standalone templates (login, 404 ...)
if (preg_match('#^/__tpl/([a-z_\-]+\.html)$#i', $path, $m) && is_file($theme . '/' . $m[1])) {
    $tpl = $m[1];
    $isShell = $tpl === 'locked_update.html';
    render($twig, $isShell ? 'index.html' : $tpl, preview_context($isShell ? 'locked' : '', $tpl, 'style'));
    return true;
}

// Pages inside the panel shell
if ($path === '/' || $path === '/index.php') {
    $module = preg_replace('/[^a-z0-9_]/i', '', $_GET['module'] ?? '');
    $style  = ($_GET['style'] ?? '') === 'dark' ? 'dark' : 'style';
    $name   = $module === '' ? 'Dashboard' : $module;
    $html   = $module === '' ? 'mod_dashboard.html' : "mod_$module.html";
    if (!is_file($theme . '/' . $html)) {
        http_response_code(404);
        echo "No template $html for module '$module' in theme '$current'. <a href=\"/__pages\">All pages</a>";
        return true;
    }
    render($twig, 'index.html', preview_context($name, $html, $style));
    return true;
}

// Panel AJAX calls: realistic answers from mock_ajax.php where we have a shape, empty JSON otherwise.
require_once __DIR__ . '/mock_ajax.php';
$ajax = mock_ajax(preg_replace('/[^\w]/', '', $_GET['module'] ?? ''), preg_replace('/[^\w]/', '', $_GET['acc'] ?? ''));
if ($ajax !== null) {
    if (is_string($ajax)) {
        header('Content-Type: text/html; charset=utf-8');
        echo $ajax;
    } else {
        header('Content-Type: application/json');
        echo json_encode($ajax);
    }
    return true;
}

// Anything else is treated as a panel AJAX call: answer with empty JSON so pages do not error.
header('Content-Type: application/json');
echo '{}';
return true;
