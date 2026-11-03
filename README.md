# CWP7 modern user-panel theme

A redesign of the CentOS Web Panel 7 (CWP7) **user panel** theme: dark indigo sidebar, white top bar with search,
collapsible cards, accent `#d9480f`. Every feature of the stock theme is kept; only markup and CSS change.

```
modern/     the new theme (deploy this)
original/   the stock theme downloaded from the server (reference + rollback source)
preview/    local Twig preview tool (not deployed)
TODO.md     page-by-page progress and rules
```

> **Status: not tested on a real CWP7 server yet.** Everything was checked only in the local preview. Try it on a
> staging server or a snapshot first, never straight on production.

## Before you install

1. **Back up the server's current theme folder** (the one `original/` came from). This is your rollback.
2. **Re-sync `original/` from the server** if the panel was updated since it was downloaded. `modern/` is behind the
   server's copy for files that are not redesigned yet, so uploading it as is can revert server-side changes. Affected
   files are listed in `TODO.md` under "Sync issue found": `js/modules/{Dashboard,addons,addons_dp,addons_jl,addons_ps,
   addons_wp,backups,email_accounts,mysql_manager,reseller,statistics}.js.twig`, `js/filemanager.php`,
   `mod_email_filters.html`, `mod_fix_acc_perm.html`, `mod_statistics.html`, `top_notifications.html`,
   `locked.html`, `menu_locked.html`. Diff each against the server copy and keep the server version.
3. Note the CWP7 version (`Server Info` in the admin panel). Theme templates are tied to the panel's Twig variables
   and JS, so a theme built against one version can break on another after a CWP update.

## Install

User-panel themes live in `/usr/local/cwpsrv/var/services/users/cwp_theme/`, one folder per theme. The stock theme is
`original/`; the new one goes next to it as `modern/`. Confirm on your server that `original/` there contains
`index.html`, `menu_left.html` and `mod_dashboard.html`.

```bash
THEMES=/usr/local/cwpsrv/var/services/users/cwp_theme

# 1. back up the whole themes folder
cp -a $THEMES $THEMES.bak-$(date +%F)

# 2. upload the new theme next to the original (do NOT replace original/)
rsync -av modern/ root@your-server:$THEMES/modern/    # or scp -r / SFTP
```

Keep `original/` in place: the login, 404 and locked pages load their images from it.

Then select the theme the way your CWP7 version does it (user panel theme setting, or the theme name in the panel
config). If you cannot find the setting, check the CWP forum for your version before editing panel files by hand.

Hard refresh the browser (Ctrl+F5) after switching; `css/cwp-modern.css` and `css/cwp-login.css` are cached hard.

## Rollback

Switch the theme setting back to the stock theme, or restore the backup from step 1. Because `original/` is never
modified, rollback does not need anything else.

## Important notes

- **Keep `original/` on the server.** The login, lost-password, 404 and locked pages hardcode
  `/login/cwp_theme/original/...` for images.
- **Do not rename IDs, `name=` attributes, `data-*`, `onclick` handlers, Twig variables or permission checks**
  (`rmenu`, `extra_rmenu`, `swmenu`, `mod.*`). The panel's JS in `js/modules/*.js.twig` and `js/cwp.js.twig` binds to
  them. See "Rules for every page" in `TODO.md`.
- **Stack is unchanged**: Bootstrap 3, jQuery, metisMenu, DataTables, iCheck, Switchery, select2, Ladda, toastr.
- **Redesign is partial.** Rebuilt: shell (sidebar, top bar), dashboard, login pages and many module pages. The rest
  only inherit the global CSS. `TODO.md` lists which is which.
- **Dark style**: `css/style_dark.css` is the existing dark option; `cwp-modern.css` is disabled for it.
- **AJAX-filled views** (tables, charts, logs) could not be checked visually in the preview because they need live
  server data. Check them on staging.
- **RTL** (`ar`, `fa`, `he`, `ur`) is offered by the login; check pages with `dir="rtl"` after install.
- New UI strings should go through `langene` / `langmod` language keys, not hardcoded English.
- After a CWP7 update, diff the server's theme files against `original/` again before re-uploading `modern/`.

## Preview locally (optional)

```
cd preview
composer install     # once
serve.cmd            # http://127.0.0.1:8088/   (PHP 8+, edit serve.cmd if your PHP path differs)
```

Switch themes with the dropdown on the page or `?theme=original`; list all pages at `/__pages`. Details in
`preview/README.md`.
