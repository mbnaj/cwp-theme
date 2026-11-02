# CWP7 theme preview

Renders the real Twig templates of a CWP7 theme locally, with mock data, so you can see every page and switch between
themes without touching the server.

## Folder layout
```
cwp7/
  modern/      theme folder (has index.html)
  original/    theme folder (the stock theme downloaded from the server)
  preview/     this tool
```
Every sibling folder of `preview/` that contains an `index.html` is a theme. Drop in another folder and it shows up in
the switcher on the next refresh.

## Run
```
cd preview
composer install        # once
serve.cmd               # http://127.0.0.1:8088/
```
Edit `serve.cmd` if your PHP is not at `D:\wamp\bin\php\php8.4.21` (PHP 8+ required).

## Switching themes
- Use the **Theme** dropdown in the dark box at the bottom right of every page, or add `?theme=original` to any URL.
- The choice is stored in a cookie (`preview_theme`) and kept until you change it. The default is `modern`.
- The theme's own CSS, JS, images and fonts are served from the selected folder.
- The server hardcodes `/login/cwp_theme/original/...` in the login, 404 and locked pages. The preview maps that URL to
  the `original/` folder, as the real server does, so those pages need `original/` to exist for their images.

## URLs
| URL | Shows |
|---|---|
| `/` | dashboard |
| `/?module=email_accounts` | any `mod_<name>.html` |
| `/?theme=original` | switch theme (combine with any other URL) |
| `/?style=dark` | dark stylesheet |
| `/__pages` | index of every page for the current theme |
| `/__tpl/login.html` | login, `lost-password.html`, `404.html`, `locked.html` ... |

## Files
| File | Purpose |
|---|---|
| `serve.cmd` | starts PHP's built-in server on port 8088 with `router.php` |
| `router.php` | picks the theme, serves static files, renders Twig, adds the theme switcher |
| `mock.php` | fake data (`mod`, `rmenu`, quotas, language strings) |
| `composer.json` | pulls in Twig |

## Notes
- Templates are re-rendered on every request: edit, save, refresh.
- Missing language keys print as the key name. Add them to `preview_lang()` in `mock.php`.
- Module tables that the panel fills through AJAX stay in their loading state: AJAX calls return `{}`.
- `js/modules/*.js.twig` files that ship with CWP (not with the theme) are stubbed as empty.
- PHP's built-in server handles one request at a time, so a page with many assets can take a moment.
- The switcher box is injected by `router.php` only. It is not part of any theme.
- This is a layout preview, not the panel: nothing here has been tested against a real CWP7 server.
