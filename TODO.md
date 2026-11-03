# CWP7 theme redesign: TODO

Goal: rebuild **every page** of the CWP7 user-panel theme (`modern/`; the stock theme is kept in `original/` for comparison) with a modern, cPanel-style UI that is
easier to use, while keeping every feature that exists today.

Look is defined by the approved mockup: dark indigo sidebar with the customer menu on the left, white top bar with
search, collapsible cards, tool grids, widgets in a right-hand column, accent `#d9480f`, link blue `#2a5db0`,
Open Sans, Font Awesome icons.

Preview: `preview/serve.cmd` then http://127.0.0.1:8088/ (`/__pages` lists everything). Switch themes with the dropdown on the page or `?theme=original`. See `preview/README.md`.

---

## 0. Status

| Area | State |
|---|---|
| Shared shell restyle (`css/cwp-modern.css`: sidebar, top bar, cards, forms, tables, tabs, modals, buttons) | done (first pass, needs per-page polish) |
| Dashboard `mod_dashboard.html` | rebuilt |
| Login, lost password, locked, 404 (`css/cwp-login.css`) | restyled (login markup unchanged) |
| Left menu `menu_left.html` | restyled by CSS only; markup unchanged |
| Preview tool (Twig render + mock data) | working, 68/68 templates render |
| All other module pages (about 60) | **only inherit the global CSS: NOT redesigned yet** |

Nothing has been tested on a real CWP7 server yet.

---

## 1. Rules for every page

- [ ] **Keep all hooks.** Do not rename or remove element IDs, classes that JS binds to, `name=` attributes, `data-*`
      attributes, `onclick` handlers, Twig variables or `{% if %}` permission checks (`rmenu`, `extra_rmenu`,
      `swmenu`, `mod.*`). Check `js/modules/<module>.js.twig` and `js/cwp.js.twig` before touching a page.
- [ ] **Keep the Bootstrap 3 / jQuery stack.** The panel's JS (metisMenu, DataTables, iCheck, Switchery, select2,
      Ladda, toastr, Morris, Chart.js) depends on it. Redesign with markup + `cwp-modern.css`, not a framework swap.
- [ ] Every page uses the same skeleton: **page header** (title, breadcrumb, primary action, quota/usage badge) then
      **cards** (`.ibox`) then optional **right column** for help and usage.
- [ ] One primary action per page, top right of the page header. Destructive actions are red and confirm first.
- [ ] Tables: sticky header, row hover, compact action icons with tooltips, search box and page size at the top,
      sensible empty state ("No domains yet" with an Add button) and a loading skeleton instead of a bare spinner.
- [ ] Forms: labels above inputs, help text under inputs, one column on phones, inline validation messages.
- [ ] Modals: title, body, footer with Cancel (left) and primary button (right); same width scale (sm / md / lg).
- [ ] Mobile: usable from 360px wide; tables scroll horizontally inside their card; sidebar collapses.
- [ ] Accessibility: real `<button>` / `<a>`, visible focus ring, labels for icon-only buttons, text contrast 4.5:1.
- [ ] RTL: the login offers `ar`, `fa`, `he`, `ur`. Pages must not break with `dir="rtl"` (use logical spacing).
- [ ] Dark style: `css/style_dark.css` is the existing dark option; `cwp-modern.css` is disabled for it today.
      Decide: ship a proper dark variant of the new look, or keep the old dark as is.
- [ ] No hard-coded English in templates: new strings go through `langene` / `langmod` keys. The strings I added on
      the dashboard ("Favorites", "Quick actions", "NEW") are still plain English and need keys.
- [ ] Remove inline `<style>` blocks from templates by moving shared rules into `css/cwp-modern.css`
      (page-specific rules may stay in a scoped block).
- [ ] After each page: render in preview with `?module=<name>`, check desktop and 375px, check the browser console,
      then tick the box.

### Definition of done for a page
Renders with no Twig error; no console errors; every original feature and button still present and working with its
original JS; empty / loading / error states designed; works at 375px; strings translatable; ticked below.

---

## 2. Foundation work (do before or alongside the pages)

- [ ] **Component library in `cwp-modern.css`** (documented in a `/__components` preview page): page header, stat
      badge / quota bar, card, data table, toolbar (search + filters + actions), empty state, loading skeleton,
      status pills (active / suspended / error), key-value list, tabs, wizard / stepper, switch row, code / log
      viewer, alert, modal sizes, form grid, file-upload drop area.
- [ ] **Icons**: Font Awesome 4.7 (`font-awesome.css`) and 5 (`fontawesome-all.css`, dashboard only) are both
      loaded. Pick one icon set per page, verify every icon exists in it, drop duplicates (many dashboard icons repeat).
- [ ] **Page header partial** `partials/page_header.html` (title, breadcrumb, quota badge, action slot) to replace
      the copy-pasted header block in each page (currently different in every module).
- [ ] **Right-column partial** for per-page help and usage.
- [ ] **Left menu** (`menu_left.html`): keep structure for metisMenu; add active-state for the current module,
      collapsed state memory, badge counts (e.g. notifications), tidy the Usage and Applications boxes.
- [ ] **Top bar** (`index.html`): group the status labels (Reseller, File System Lock, 2FA, New), simplify the
      language and theme dropdowns, make the tool search show results (today `#top-search` only filters the menu).
- [ ] **Dark variant** decision (see rules).
- [ ] **Preview mock data**: extend `preview/mock.php` and the router so AJAX endpoints return realistic JSON per
      module. Without this most list pages (email, domains, ftp, subdomains ...) stay on their loading spinner in the
      preview. See section 6.
- [ ] **Language keys**: the preview prints unknown keys as the key name. Collect the keys each redesigned page needs
      so a translator can add them.
- [ ] Decide what to do with legacy files: `login_old.html` (363 lines, unused?), `without columns.html` (empty),
      `css/style_OLD.css`, `css/bootstrap_OLD.css`, `css/original.css`.

---

## 3. Shared templates

| File | Lines | What it is | Redesign |
|---|---|---|---|
| [ ] `index.html` | 560 | HTML shell: loads CSS/JS per module, sidebar, top bar, includes `mod.html` and `modal_tools.html`, global scripts (password strength, style switch) | Cleaner top bar, move inline `<style>` blocks (notifications, pass changer, language dropdown) to CSS, keep all `<link>`/`<script>` conditionals per `mod.name`. Decide on loading Google Fonts vs bundling Open Sans locally. |
| [ ] `menu_left.html` | 435 | Customer menu (CWP Settings, File Management, Domains, SQL Services, Email, DNS, Addons, Script Installers, Reseller, Streaming), quota box, Apache/PHP/MySQL box | Active/hover states, icon per group, memory of open group, nicer quota card, keep `.searchmenu` / `.search` classes (menu filter JS). |
| [ ] `menu_locked.html` | 329 | Reduced menu shown on the locked/update screen | Same look as `menu_left`. |
| [ ] `top_notifications.html` | 100 | Bell dropdown with notifications (`cwp-notifications`) | Card-style dropdown, unread dot, mark-all-read, link to Notification Center. Check `js/top_notifications.js.twig`. |
| [ ] `footer.html` | 9 | Footer included at the end of most pages | Slim footer: version, docs, support. |
| [ ] `modal_tools.html` | 2685 | **All global modals** (see 3.1) | Biggest single redesign item, split into partials per modal group. |
| [ ] `locked.html`, `locked_update.html` | 56 / 10 | Account locked / update in progress | Restyled card exists; add icon, clear message, contact link. |
| [ ] `404.html` | 41 | Not found | Restyled card exists; add search + "back to dashboard". |
| [ ] `login.html` | 621 | Login, 2FA step, "logging in" message, "recover password sent" message, lost password form (all in one file, IDs drive the inline JS) | Restyled. Still to do: show/hide password toggle, remember-me styling, clearer 2FA step (6 separate digit boxes keeping `#f2acode`), language select, error states, loading state on the button. |
| [ ] `lost-password.html` | 398 | Set a new password page (strength bar, retype) | Restyled. Still to do: rules checklist next to the strength bar, success state. |

### 3.1 `modal_tools.html` (global modals, ids found)
Change password (`modal-changepass`), panel settings (`modal-settings`), file system lock (`modal-fsl`), process list
(`modalprocesslist`), please-wait (`modal-pleasewait`), info (`modalinfo`), FTP (`modal-changepassftp`,
`modal-addfaccountftp`), email (`modal-changepassemail`, `modal-updquotemail`), MySQL/PostgreSQL
(`modal-newusermysql`, `modal-changepassusermysql`, `modal-createbdanduser`, `modal-onlymysql`, `modal-onlypg`,
`modal-newuserpg`), and one modal **per DNS record type** (A, AAAA, CNAME, MX, TXT, CAA, AFSDB, DNAME, HINFO, PTR,
NS, RP, TLSA, SRV ...).
- [ ] Unify modal header / footer / width, consistent form layout.
- [ ] DNS record modals: one shared layout with record-type specific fields; add TTL presets and per-type help text.
- [ ] Password modals: strength meter + generator button + show/hide.
- [ ] Panel settings modal: group into tabs (Account, Notifications, Sounds, Display).
- [ ] Process list modal: sortable table with kill action and auto-refresh.

---

## 4. Pages (`mod_*.html`)

Legend: lines = size of template; "data via JS" = the table/list is filled by AJAX from `js/modules/<name>.js.twig`
(needs mock data in the preview).

### 4.1 Dashboard and settings group
- [x] `mod_dashboard.html` (418): done. Remaining polish: favourites/quick-action strings need language keys; verify
      on a server; replace repeated icons; empty state when a group has no permitted tools.
- [x] `mod_crontab.html` (done, see notes below). Original plan: table with human-readable
      schedule ("Every day at 02:00"), schedule builder (presets + custom fields) in the modal, enable/disable
      toggle, "next run" column, link to cron help. Data via JS.
      Done: shared page header and section styles (`.cwp-page*`, `.cwp-section*`, `.cwp-form-actions` in
      `cwp-modern.css`), form with numbered sections and labels above inputs, 5 time pickers generated by one Twig
      loop (same ids and handlers), table/states styled in CSS (paused jobs now muted grey instead of solid red),
      inline `<style>` moved to CSS, `Home` uses `langene.GENLABLANG1`. `js/modules/crontab.js.twig` is untouched.
      Not done: "next run" column and human-readable schedule text need server-side data / JS changes; enable-switch
      instead of the status button; new strings still use the existing `langmod` keys only. Checked in preview at
      desktop and 375px; not tested on a real server.
- [x] `mod_phpini_editor.html` (done, see notes below). Original plan: two modes,
      "Basic" (common directives as form controls: memory_limit, upload_max_filesize, max_execution_time, display_errors...)
      and "Advanced" (CodeMirror editor), reset-to-default, show effective PHP version.
      Done: the page already had Basic and Advanced tabs, so it keeps them. New page header, domain/file toolbar,
      cleaner settings table (monospace directive names, uniform action buttons), tidy save/add side panels,
      editor bars, inline `<style>` moved to CSS, footer fixed to flow after content (`.cwp-page .footer`, helps every
      redesigned page), phone layout (table scrolls inside its card, tabs stay in a row), stray `';` after the
      domain `<option>` removed, dead commented HTML removed. `js/modules/phpini_editor.js.twig` untouched.
      Not done: common directives as typed controls (needs JS), reset-to-default, effective PHP version; "Actions"
      and "Save your changes" are still plain English (need language keys). Advanced tab (CodeMirror) not checked
      visually. Checked in preview at desktop and 375px; not tested on a real server.
- [x] `mod_phpselector.html` and `mod_php_selector.html` (done, see notes below). Original plan: check which one the panel
      actually uses (menu uses `phpselector`; the dashboard link to `php_selector` is commented out). Plan: version
      cards (current highlighted), extensions list with toggles, options editor. Merge or delete the duplicate.
      Done: `phpselector` is the live page (the `php_selector` menu link is commented out; that page is a CloudLinux-only
      stub, restyled with the same skeleton, not deleted: your call). Rebuilt on the **server's** version of the
      template (it adds the `mod.api_error` message, the `#updateversionfpm` id the JS uses, the Default/CGI/FPM
      legend and the big version display). Two-column layout, form row, key-value details card, directory explorer
      styled in CSS, inline `<style>` moved out. JS untouched. Not done: version cards, extensions list, options editor
      (the extension/options features do not exist in this page's JS). Checked in preview at desktop and 375px; the
      explorer is only visible with real AJAX data.

### Sync issue found (read before uploading `modern/`)
`modern/` is behind the server's copy in `original/` for files not redesigned yet: `js/modules/{Dashboard,addons,
addons_dp,addons_jl,addons_ps,addons_wp,backups,email_accounts,mysql_manager,reseller,statistics}.js.twig`,
`js/filemanager.php`, `mod_email_filters.html`, `mod_fix_acc_perm.html`, `mod_statistics.html`,
`top_notifications.html`, `locked.html`, `menu_locked.html`. Uploading `modern/` as is would revert whatever the
server changed there. Before each page below, diff it against `original/` and build on the server version.
- [x] `mod_notification_center.html` (done, see notes below). Original plan: grouped list of
      notification types with one switch row each (email / panel / sound), "select all", save bar that appears on change.
      Done: shared page header, two grouped columns (notification types, delivery channels) with one switch row each,
      switch markup generated by a Twig macro (same ids, names and `changestnot` handlers), disabled state when the master
      switch is off now done in CSS (replaces the white overlay hack), bandwidth and email settings popovers anchored to
      their row (same ids and `openConfig` hook), labels linked to inputs, duplicate `btn_email_config` id renamed,
      inline `<style>` moved to CSS, `Home` uses `langene.GENLABLANG1`. `notification_center.js.twig` untouched.
      Not done: "select all", save bar, per-type email / panel / sound columns (needs JS and server data). Rendered in
      preview (HTTP 200, no Twig errors); not yet checked visually at 375px; not tested on a real server.
- [x] `mod_mod_security.html` (done, see notes below). Original plan: status card with
      on/off, rules editor in CodeMirror, whitelist table, explanatory help.
      Done: shared page header and two-column layout, inline `<style>` (about 170 lines) moved to CSS, `Home` uses
      `langene.GENLABLANG1`, undefined `stflalert` use removed, dead commented tabs block removed, footer added. The
      JS-toggled panels (`.mod-security-wrapper/-logs/-ipchecker/-rules`) and all ids are unchanged. Not done: the domain
      table, log and rules views are filled by AJAX so they are not yet checked visually (needs mock data); rules
      editor/CodeMirror tab was already disabled in the original. Not tested on a real server.
- [x] `mod_statistics.html` (151): usage / traffic stats. Done: rebuilt on the server version (with the live log card), shared page header, form row with labels, live-log toolbar and viewer styled in CSS, inline styles and the `<style>` block moved out, ids unchanged; not done: stat tiles/charts (need JS), not tested on a real server. Original plan: Plan: summary stat tiles, charts (Chart.js already loaded),
      date range, export.
- [ ] `mod_themely.html` (153, style block): theme chooser used by the WordPress addon. Plan: theme cards grid with
      preview image and Install button.

### 4.2 File management group
- [ ] `mod_clam.html` (957, 5 modals, DataTable, ibox): antivirus (ClamAV) scan. Plan: scan status card (last scan,
      signatures date), "Scan now" with progress, results table with quarantine / delete / restore, scheduled scan
      settings, split the 5 modals into the shared modal style.
- [ ] `mod_ftp_accounts.html` (492, table + 5 DataTable refs, footer): FTP accounts and quota bar. Plan: table with
      user, directory, quota, status; add-account drawer; change-password modal (global) ; connection info card
      (host, port, protocol) with copy buttons. Data via JS.
- [ ] `mod_backups.html` (473, tabs, modal, DataTable, flot): backups. Includes `mod_backups_auto.html` (187) and
      `modules/backups/backups_restore.html`. Plan: tabs "Backups", "Automatic", "Restore"; storage usage bar;
      backup list with download / restore / delete; wizard-style restore (choose what: files, databases, email);
      auto-backup settings as a switch + schedule + retention form.
- [ ] `mod_backups_auto.html` (187): automatic backup settings tab (see above).
- [x] `mod_disk_usage.html`: done (shared page header, two-column layout, inline style moved to CSS, duplicate `list_wrapper` id renamed to `total_wrapper`, JS untouched; list is AJAX-filled so not checked visually). Original plan: disk usage per folder. Plan: treemap or bar breakdown (home, mail,
      MySQL, backups) plus top folders table.
- [ ] `mod_protected_directory.html` (223, ibox, 3 tables): password-protect directories (Apache only). Plan: directory
      picker, protected list, users list per directory, add-user form.
- [x] `mod_error_log.html` (90, ibox): error log viewer. Plan: log viewer with monospace, line numbers, level colouring,
      filter, tail/refresh, download.
- [x] `mod_fix_acc_perm.html`: done (shared page header, switch rows with descriptions, one card with the Run button, inline style removed, built on the server version with the `{{users}}` substitution in FIXACCPERM3; ids and JS untouched; no confirmation or result log yet). Original plan: fix permissions. Plan: warning card explaining the effect, options
      as switch rows, big "Run" button with confirmation, result log.
- [ ] `mod_filemanager.html` (0 lines): opens `fileManager_v2.php` (separate page, `css/filemanager.css`,
      `js/filemanager.php`). Decide separately: restyle `filemanager.css` to match.
- [ ] Files system lock: modal `modal-fsl` + `js/modules/files_system_lock.js.twig` (see 3.1).

### 4.3 Domains group
- [ ] `mod_domains.html` (388, style block, footer): domains list with quota bar, add domain. Data via JS. Plan: card
      per domain or table with document root, PHP version, SSL status pill, actions menu (manage DNS, SSL, redirect,
      delete); add-domain modal with type (addon / parked) and doc-root auto-fill.
- [ ] `mod_subdomains.html` (414, 2 style blocks, DataTable): same pattern as domains. Plan: reuse the domains table.
- [ ] `mod_letsencrypt.html` (233, 1 modal): AutoSSL. Plan: per-domain certificate table (issued, expires in N days,
      status pill), "Issue / Renew" buttons, expiry warning colours.
- [ ] `mod_sslwizard.html` (796, 2 modals, steps wizard, select2, tagsinput): SSL generator (CSR / certificate).
      Plan: proper stepper (Details, Domains, Review, Result), validation per step, copy / download buttons for the
      outputs, keep the wizard JS hooks.
- [ ] `mod_cloudflare.html` (146, select2): Cloudflare integration. Plan: connection card (API key / email), domain
      select, DNS record table, purge-cache action.
- [x] `mod_redirect.html`: done (shared page header, labels above inputs, two-column form with help alerts, responsive table, inline style moved to CSS, ids and handlers unchanged; not tested on a real server). Original plan: redirects (Apache without Nginx). Plan: form row (from, to, type
      301/302, wildcard) plus table with test link.
- [x] `mod_vdomaincache.html` (81, table): Varnish cache per domain. Plan: table with on/off switch per domain and
      "purge" action.
- [ ] `mod_nodejs_manager.html` (738, 3 iboxes, 4 modals, select2, DataTable): Node.js apps. Plan: app cards with
      status, start/stop/restart, logs, env variables, quota bar; create-app wizard.
- [ ] `mod_tomcat_manager.html` (102, 2 iboxes) + `modules/tomcat_manager/` (`app_deployment_form.html`, `modals.html`,
      `styles.css`): Tomcat apps. Plan: same card pattern as Node.js; WAR upload drop area.
- [ ] `mod_dns_zone_editor.html` (138, table): DNS zone editor. Plan: domain selector, record table with type
      filter and colour pills, "Add record" menu opening the per-type modals (3.1), inline TTL edit.

### 4.4 SQL services group
- [ ] `mod_mysql_manager.html` (623, tabs, DataTable, select2, 2 style blocks): MySQL databases, users, privileges,
      remote access, quota bar. Plan: tabs "Databases", "Users", "Remote access"; database table with size and
      user count; create DB + user wizard (modal-createbdanduser); privilege matrix as checkboxes.
- [ ] `mod_postgresql_manager.html` (41) + `modules/postgresql_manager/` (`dashboard.html`, `databases.html`,
      `modals.html`, `not_available.html`, `styles.css`): same layout as MySQL manager.
- [ ] `mod_mongodb_manager.html` (30) + `modules/mongodb_manager/` (same file set): same layout as MySQL manager.
      Note: the old dashboard linked MongoDB to `nodejs_manager`; fixed in the new dashboard.
- [ ] `mod_pma.html` (0): redirect to phpMyAdmin (`?module=pma`, new tab). Nothing to redesign; check the link.
- [ ] MySQL process list: modal `#mysql_processes` handler (see 3.1).

### 4.5 Email group
- [ ] `mod_email_accounts.html` (212, 1 ibox, 2 tables, 4 DataTable refs, 2 style blocks): email accounts with usage
      bar; add account; "Manual settings for common mail clients" cards (SSL and non-SSL). Data via JS. Plan: table
      with usage bar per mailbox, webmail login button, change password / quota actions; manual settings as one card
      with Secure (recommended) and Insecure tabs, copy buttons.
- [ ] `mod_forwarders_email.html` (466, 3 tables, tabs, 5 DataTable refs): forwarders + quota bars. Plan: tabs
      "Forwarders" and "Domain forwarders"; add-forwarder form with destination chips.
- [ ] `mod_mail_autoreply.html` (538, date/clock pickers, summernote): autoresponders. Plan: list + editor drawer
      with schedule (from / to), rich-text editor, enable switch.
- [ ] `mod_email_filters.html` (1264, tabs, 2 DataTable refs, switch): the largest page. Plan: tabs "Filters",
      "Spam", "Blacklist/Whitelist" (verify tabs when opening); rule builder rows (If [field] [contains] [value] then
      [action]); drag to reorder priority; split into partials.
- [ ] `mod_mail_routing.html` (156, table): mail routing (local / remote per domain). Plan: radio cards
      (Local / Remote / Backup MX) per domain.
- [ ] `mod_email_importer.html` (604, form, select2, dropzone): import mail from another server. Plan: 3-step
      wizard (source server credentials, select mailboxes, run), progress and log.
- [ ] `mod_spamexperts.html` (68, form, table, 5 DataTable refs): SpamExperts login and domains. Plan: connection
      card + domain table.
- [ ] Spam Annihilator (`spam_annihilator` in the menu): **no template file found** in the theme; handled by the
      server. Confirm before redesigning.
- [ ] Roundcube link: external (`mod.roundcube`), nothing to redesign.

### 4.6 Addons and script installers
- [ ] `mod_addons.html` (157, tabs, style block) + `modules/addons/` (`dashboard.html`, `installed.html`, 13 app
      pages: laravel, symfony, whcms, smf, magento, osticket, phpbb, nextcloud, owncloud, moodle, livehelper,
      suitecrm + `styles.css`) and `mod_addons_wp.html` (233), `mod_addons_ps.html` (216), `mod_addons_jl.html`
      (127), `mod_addons_dp.html` (197), `mod_addons_fm.html` (68): one-click app installers. Plan: app gallery
      grid with logo, category filters, search; install form (domain, path, admin user) as a single shared layout;
      "Installed" tab with version, update and uninstall. The 13 app pages are near-duplicates: replace with one
      generic app page driven by data.
- [ ] `mod_wordpress_manager.html` (16) + `modules/wordpress_manager/` (`dashboard.html`, `modals.html`,
      `modals.js`, `not_available.html`, `styles.css`, `ajax_wordpress_manager.php`): WordPress manager. Plan:
      site cards with version, update status, staging/clone, backup, auto-login, plugin/theme update lists.
- [ ] `mod_git_manager.html` (9) + `modules/git_manager/` (`dashboard.html`, `modals.html`, `not_available.html`,
      `styles.css`): Git repos. Plan: repo cards with branch, last commit, deploy key copy, pull/deploy button.
- [ ] `mod_siteprobuilder.html` (49, form): SiteProBuilder launcher. Plan: simple card with login button.
- [ ] `mod_softaculous.html` (0): external script (Softaculous). Nothing in the theme to redesign; check the
      surrounding page.

### 4.7 Reseller area (shown if `mod.reseller == 1`)
Tabs are included by `mod_reseller_gentab.html` (82) inside `mod_reseller.html` (451, form, tabs, wizard, dualListbox,
dropzone).
- [ ] `mod_reseller.html` + `mod_reseller_gentab.html`: tab container. Plan: left vertical tab nav (Stats, Accounts,
      Packages, Features, Nameservers, Branding, API Manager, ModSecurity, Firewall) instead of 9 horizontal tabs.
- [ ] `mod_reseller_statstab.html` (129): stats. Plan: tiles + charts.
- [ ] `mod_reseller_accounts.html` (252, table): customer accounts. Plan: table with search, status pills,
      impersonate/login, suspend, delete, create-account wizard.
- [ ] `mod_reseller_packages.html` (322, table): hosting packages. Plan: package cards or table, limits form in
      grouped sections (disk, bandwidth, email, domains, DB, FTP, features).
- [ ] `mod_reseller_features.html` (80, steps): feature sets. Plan: switch matrix per feature.
- [ ] `mod_reseller_nameservers.html` (114): nameserver defaults. Plan: simple form card.
- [ ] `mod_reseller_branding.html` (59, form): logo / name branding. Plan: preview of the logo with upload.
- [ ] `mod_reseller_apimanager.html` (698, 5 tables): API keys and allowed IPs. Plan: split into sections with
      copy-key buttons and an access log table.
- [x] `mod_reseller_modsecurity.html` (161, 2 iboxes, table): ModSecurity rules for the reseller. Done: inline styles and
      dead commented block removed, label typos fixed (Domian, Tipo); reuses the ModSecurity page CSS, ids and handlers
      unchanged. Not checked visually (AJAX-filled).
- [x] `mod_reseller_firewall.html` (30): firewall. Plan: rule table + add-rule form.

### 4.8 Streaming and misc
- [ ] `mod_servercast.html` (29) + `modules/servercast/` (18 files: `Conf_autodj`, `Conf_general`, `Conf_limites`,
      `Conf_plugins`, `Conf_rele`, `autodjdetails`, `autodjlist`, `conf_menu`, `config`, `dashboard`, `dj_anager`,
      `menuTable`, `modals`, `mounting`, `not_available`, `overvier`, `shoustcast_tab`, `styles.css`): ServerCast
      (Shoutcast / Icecast). Plan: overview card with listeners, status and start/stop; vertical config menu;
      auto DJ playlist manager with drag-and-drop; same card patterns as the rest.
- [ ] `mod_pipemail.html` (0): no template content; check the server side.

---

## 5. Known issues found while reading the originals

- [x] Dashboard linked MongoDB to `?module=nodejs_manager` (fixed to `mongodb_manager`).
- [x] Dashboard showed ModSecurity under the `statistics` permission (fixed to `mod_security`).
- [x] DNS menu used the same envelope icon as Email (fixed, `fa-sitemap`).
- [ ] `mod_php_selector.html` vs `mod_phpselector.html`: two near-identical pages; decide which is live.
- [ ] `mod_dashboard` / menu: `fant3menu` item links to `#` on the dashboard but to `?module=fantastico_f3` in the menu.
- [ ] `mod_email_filters.html` opens in a new tab from the old dashboard (`target="_blank"`), probably unintended
      (new dashboard opens it in the same tab; confirm).
- [ ] Mixed Font Awesome 4 and 5 class names (`fa`, `fab`) on one page.
- [ ] Inline `<style>` blocks in about 25 templates duplicate the same rules.
- [ ] Many templates carry unused vendor scripts (flot, peity, sparkline, morris) loaded on every page from `index.html`;
      trim only after checking each module.

---

## 6. Preview tool backlog (`preview/`)

- [ ] Mock AJAX responses per module so list pages render (domains, subdomains, email accounts, forwarders, FTP,
      MySQL, crontab, backups, DNS records, notifications...). Plan: `preview/mock_ajax.php` mapping
      `module=<name>&acc=<action>` to JSON files in `preview/mock/`.
- [ ] Use real English strings: import the CWP language file if available, so pages stop showing `DTITLE`-style keys.
- [ ] `/__components` page showing every UI component from section 2.
- [ ] Screenshot script (`preview/shoot.cmd`) that captures all pages at 1440 px and 375 px into `preview/shots/`
      for before/after review.
- [ ] RTL and dark toggles in the preview (`?dir=rtl`, `?style=dark`).
- [ ] Optional `--watch` reload.

---

## 7. Suggested order

1. **Foundation** (section 2): component library, page header partial, mock AJAX for the preview.
2. **Most used pages**: Email accounts, Domains, Subdomains, MySQL manager, FTP accounts, Backups, File manager styling.
3. **Security and SSL**: Let's Encrypt, SSL generator, ModSecurity, Protected directories, Fix permissions.
4. **Everything with modals**: `modal_tools.html` rewrite (DNS record modals, password modals, settings).
5. **Email extras**: forwarders, autoresponders, filters (largest), routing, importer, SpamExperts.
6. **Dev tools and addons**: Node.js, Tomcat, Git, WordPress, addon gallery and the 13 app pages, PHP pages.
7. **Reseller area** (9 tabs).
8. **ServerCast** and remaining small pages.
9. **Login polish**, dark variant, RTL pass, accessibility pass, real-server test.

Estimate: foundation plus the first group is the bulk of the design decisions; the rest reuse the same components.
