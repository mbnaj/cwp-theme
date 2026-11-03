<?php
/**
 * Mock answers for panel AJAX calls, keyed by "module/acc".
 * A value is an array (sent as JSON), a string (sent as is) or a callable returning either.
 * Unknown calls still answer {} (see router.php). Add shapes here when a page stays on its spinner.
 */
function mock_ajax(string $module, string $acc)
{
    $mb = 1048576;
    $map = [
        // DataTables server-side list of mailboxes (email_accounts, forwarders_email)
        'email_accounts/listemail' => function () use ($mb) {
            $rows = [];
            foreach ([['info', 'example.com', 120, 1024, 1], ['sales', 'example.com', 700, 1024, 1], ['john', 'shop.example.org', 1000, 1000, 1], ['old', 'example.com', 0, 512, 0]] as $i => $r) {
                $rows[] = ['index' => $i + 1, 'email' => "$r[0]@$r[1]", 'domain' => $r[1], 'lastaccess' => $i === 3 ? null : '2026-10-2' . $i . ' 09:1' . $i,
                    'usade' => $r[2] * $mb, 'quota' => $r[3] * $mb, 'active' => $r[4], 'token' => 'tok' . $i];
            }
            return ['draw' => (int) ($_POST['draw'] ?? 1), 'recordsTotal' => count($rows), 'recordsFiltered' => count($rows), 'data' => $rows];
        },
        'email_accounts/updatelistemail' => ['result' => 'success'],
        'backups/listfilestargz' => [
            ['name' => 'public_html', 'link' => 'home/public_html', 'directory' => 1],
            ['name' => 'mail', 'link' => 'home/mail', 'directory' => 1],
            ['name' => 'notes.txt', 'link' => 'home/notes.txt', 'directory' => 0],
        ],
        'disk_usage/load_total' => ['result' => 'success', 'usage' => [
            'home' => ['limit' => 10 * 1024 * $mb, 'home' => 3.2 * 1024 * $mb], 'mysql' => 400 * $mb, 'email' => 850 * $mb]],
        'disk_usage/load_directory' => ['result' => 'success', 'directory' => [
            ['ismain' => true, 'path' => '', 'size' => 3300000, 'keypath' => 'root', 'haschild' => true],
            ['path' => 'public_html', 'size' => 2100000, 'keypath' => 'a', 'haschild' => true],
            ['path' => 'mail', 'size' => 850000, 'keypath' => 'b', 'haschild' => false],
            ['path' => 'backup', 'size' => 300000, 'keypath' => 'c', 'haschild' => false]]],
        'protected_directory/list' => '<tr><td>/home/user/public_html/private</td><td>admin</td><td><button class="btn btn-danger btn-xs">Delete</button></td></tr>',
        'domains/dirlist' => ['result' => 'success', 'dirs' => ['public_html', 'public_html/blog', 'mail']],
        'error_log/listdomains' => [['domain' => 'example.com'], ['domain' => 'shop.example.org']],
        'error_log/select' => "[Mon Nov 02 10:11:12 2026] [error] [client 203.0.113.9] File does not exist: /home/user/public_html/favicon.ico\n[Mon Nov 02 10:12:40 2026] [warn] PHP Notice: Undefined variable in index.php",
        'mysql_manager/getconsumption' => ['result' => 'success', 'quota' => 5 * 1024, 'used' => 640],
    ];
    $v = $map["$module/$acc"] ?? null;
    return is_callable($v) ? $v() : $v;
}
