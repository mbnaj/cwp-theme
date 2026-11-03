<?php
/**
 * Mock data for the local theme preview.
 * Edit freely: every template variable that is missing simply renders empty.
 */

/** Language bag: known keys -> English text, unknown keys -> the key itself. */
class LangBag implements ArrayAccess
{
    public function __construct(private array $d) {}
    public function offsetExists(mixed $k): bool { return true; }
    public function offsetGet(mixed $k): mixed { return $this->d[$k] ?? (string) $k; }
    public function offsetSet(mixed $k, mixed $v): void {}
    public function offsetUnset(mixed $k): void {}
}

function preview_lang(): array
{
    return [
        'TITLE' => 'Dashboard', 'TITLETAG' => ' - CWP', 'CWPSETTING' => 'Settings', 'CRON' => 'Cron Jobs',
        'PROCESSLIST' => 'Process List', 'PHPINI' => 'PHP.ini Editor', 'GNLABEL50' => 'PHP Selector',
        'BTNOTITITLE' => 'Notification Center', 'MODSECURITY' => 'ModSecurity', 'GNLABEL51' => 'Statistics',
        'FILEM' => 'File Management', 'FILESYST' => 'File System Lock', 'ANTIVI' => 'Antivirus (ClamAV)',
        'FTPFILE' => 'File Manager', 'FTPACC' => 'FTP Accounts', 'BACKUP' => 'Backups', 'MENUDISKUSAGE' => 'Disk Usage',
        'DIRPROTE' => 'Protected Directories', 'GNLABEL52' => 'Error Log', 'ADDFIXPERM' => 'Fix Account Permissions',
        'DOMAINS' => 'Domains', 'SUBDOMAIN' => 'Subdomains', 'AUTOSSL' => "Let's Encrypt (AutoSSL)",
        'GEN002' => 'SSL Generator', 'CLOUDFLARE' => 'Cloudflare', 'NODEJSAPPS' => 'Node.js Apps',
        'CACHE1' => 'Varnish Cache', 'GNLABEL53' => 'Redirects', 'TOMCATMANAGER' => 'Tomcat Manager',
        'SQLSERV' => 'SQL Services', 'PHPMYADMIN' => 'phpMyAdmin', 'MANAGERMYSQL' => 'MySQL Manager',
        'SHOWMYSQL' => 'Show MySQL Processes', 'MANAGERPOSGRE' => 'PostgreSQL Manager', 'MONGODB' => 'MongoDB Manager',
        'MAILACCOUNT' => 'Email Accounts', 'MENUEMFOR' => 'Forwarders', 'AUTORESPONDER' => 'Autoresponder',
        'MENUEMFILTERS' => 'Email Filters', 'ROUNDCUBE' => 'Roundcube Webmail', 'DASWER' => 'Mail Routing',
        'GNLABEL45' => 'SpamExperts', 'GEN001' => 'Email Importer', 'SPAMANNIHILATOR' => 'Spam Annihilator',
        'DNS' => 'DNS', 'DNSZONEEDITOR' => 'DNS Zone Editor', 'ADDONS' => 'Addons', 'ADDSCRIPTS' => 'Scripts',
        'ADDEFMBTNON' => 'Installed Scripts', 'SITEPROBUILDER' => 'SiteProBuilder', 'WORDPRESSMANAGER' => 'WordPress Manager',
        'GITMANAGER' => 'Git Manager', 'SCRIPTINST' => 'Script Installers', 'SOFTAC' => 'Softaculous',
        'GNLABEL46' => 'SitePad', 'FANTASTICO' => 'Fantastico', 'GNLABEL37' => 'Reseller', 'GNLABEL43' => 'Reseller Area',
        'STREAMING' => 'Streaming', 'USERDD' => 'Usage', 'GNLABEL47' => 'Disk quota', 'GNLABEL48' => 'Bandwidth',
        'GNLABEL49' => 'Storage details', 'GENLABLANG1' => 'Home', 'SHMYSQL' => 'MySQL', 'APPLI' => 'Applications',
        'GNLABEL44' => 'Search tools', 'CHANGEPASS' => 'Change password', 'GNLABLE10' => 'Settings',
        'BTN_LOGOUT' => 'Logout', 'FSL_UNLOCKED' => 'Unlocked', 'FSL_LOCKED' => 'Locked',
        'GRAPHTITLE' => 'Bandwidth', 'GRAPHCMONTH' => 'Current month', 'GRAPHLMONTH' => 'Last month',
        'GNLABLE7' => 'Last accesses', 'PLANSTATUS' => 'Plan status', 'PGMYSQL' => 'MySQL', 'PGEMAIL' => 'Email',
        'PGDOMAINS' => 'Domains', 'PGSUBDOMAIN' => 'Subdomains', 'PGFTP' => 'FTP', 'SERVERSTATUS' => 'Server status',
        'GNLABEL21' => 'Server time', 'GNLABEL22' => 'Package', 'GNLABEL23' => 'Server IP', 'GNLABEL24' => 'Nameservers',
        'GNLABEL27' => 'Main domain', 'PNSETTING' => 'Panel settings',
        ...preview_lang_cron(),
        ...preview_lang_phpini(),
        ...preview_lang_phpselector(), 'PGCHANGTHEME' => 'Save theme',
    ];
}

/** All user-panel module keys (what $rmenu would contain for a full-featured account). */
function preview_modules(): array
{
    return [
        'crontab', 'process_list', 'phpini_editor', 'phpselector', 'notification_center', 'mod_security', 'statistics',
        'files_system_lock', 'clam', 'file_manager', 'ftp_accounts', 'backups', 'disk_usage', 'protected_directory',
        'error_log', 'fix_acc_perm', 'domains', 'subdomains', 'letsencrypt', 'sslwizard', 'cloudflare', 'redirect',
        'vdomaincache', 'pma', 'mysql_manager', 'process_list_my', 'postgresql_manager', 'mongodb_manager',
        'email_accounts', 'forwarders_email', 'mail_autoreply', 'email_filters', 'roundcube', 'mail_routing',
        'email_importer', 'spam_annihilator', 'dns_zone_editor', 'scripts', 'siteprobuilder', 'wordpress_manager',
        'git_manager', 'softaculous', 'sitepad', 'servercast',
    ];
}

function preview_context(string $moduleName, string $html, string $style): array
{
    $now = date('Y-m-d H:i:s');
    return [
        'url' => '', 'users' => 'john_doe', 'lang' => 'en', 'theme' => 'cwp_theme',
        'array_lang' => ['en', 'es', 'fr', 'de', 'pt'], 'array_theme' => [],
        'settings' => ['timerdate' => $now, 'ipserver' => '203.0.113.10'],
        'dnsname' => ['ns1' => 'ns1.example.com', 'ns2' => 'ns2.example.com'],
        'rmenu' => preview_modules(),
        'extra_rmenu' => ['cloudflare', 'nodejs', 'tomcat_manager', 'postgresql_manager', 'mongodb_manager'],
        'swmenu' => 1, 'softmenu' => 1, 'fant3menu' => 1, 'sitepad' => 1, 'streaming' => 1,
        'menu' => ['cloudlinux' => 0], 'tokenajax' => 'preview-token', 'confi' => ['SOUNDALERT' => 0],
        'langene' => new LangBag(preview_lang()),
        'langmod' => new LangBag(['NAMEMOD' => ['phpini_editor' => 'PHP.ini Editor', 'phpselector' => 'PHP Selector'][$moduleName] ?? $moduleName] + preview_lang()),
        'mod' => [
            'name' => $moduleName, 'html' => $html, 'style' => $style,
            'license' => 1, 'custom_title' => 'CWP7', 'fa2' => 0, 'fsl' => 0, 'reseller' => 1, 'viewtheme' => 1,
            'styles' => [['name' => 'dark', 'pic' => 'darkpic.png']], 'imglogo' => '0', 'logoreseller' => '',
            'apache' => 1, 'nginx' => 0, 'varnish' => 1, 'spamexperts' => 1,
            'roundcube' => '#', 'pma' => '#', 'linkhelpmod' => '#',
            'packquota' => 10240, 'packquotaused' => 2450, 'sizehome' => 1820, 'sizemail' => 320, 'sizemysql' => 110,
            'backup_quota' => 200, 'pack_bandwidth' => 100000, 'bandwidth' => 18200,
            'infoserver' => ['apache' => '2.4.62', 'php' => '8.3.12', 'mysql' => '10.11.9'],
            'uname' => 'john_doe', 'bwstats' => preview_bwstats(),
            ...preview_cron(),
            ...preview_phpini(),
            'phpver' => ['8.3'], 'phpcgi' => ['7.4', '8.1'], 'phpfpm' => ['8.2'],
            'compbandw' => 0, 'view_band_graph' => 'true',
            'mysqlpack' => ['package' => 20, 'used' => 3],
            'email_pack' => 50, 'email_accounts' => 6, 'domain_pack' => 5, 'domain_accounts' => 1,
            'subdomain_pack' => 20, 'subdomain_accounts' => 2, 'ftp_pack' => '-1', 'ftp_accounts' => 1,
            'emaccounts_stats' => ['pack' => 50, 'account' => 6], 'fordwars_stats' => ['pack' => 50, 'account' => 3],
            'email_pack_mailauto' => 50, 'email_accounts_mailauto' => 6, 'apps_quota' => 10, 'apps_qty' => 2,
            'package_username' => 'Standard', 'domain_username' => 'example.com',
            'lastaccess' => [
                ['ip' => '198.51.100.24', 'flag' => '', 'city' => '', 'country' => '', 'os' => 'windows', 'date' => '2026-11-02 09:14:00'],
                ['ip' => '198.51.100.24', 'flag' => '', 'city' => '', 'country' => '', 'os' => 'linux', 'date' => '2026-11-01 18:02:00'],
                ['ip' => '203.0.113.77', 'flag' => '', 'city' => '', 'country' => '', 'os' => 'apple', 'date' => '2026-10-30 07:41:00'],
            ],
        ],
    ];
}

/** Bandwidth graph data in the shape Dashboard.js.twig expects. */
function preview_bwstats(): string
{
    $data = []; $acc = 0;
    for ($i = 0; $i < 12; $i++) {
        $u = 120 + (($i * 53) % 260);
        $acc += $u;
        $data[] = ["date" => date("Y-m-d", strtotime("first day of this month +$i day")), "usage" => $u, "accum" => $acc];
    }
    return json_encode(["numdays" => 30, "bwpackage" => 100000, "data" => $data]);
}


/** Mock data for the Cron Jobs page (shapes follow js/modules/crontab.js.twig). */
function preview_cron(): array
{
    $list = fn(array $opts, array $items) => ['options' => $opts, 'items' => $items];
    $o = fn(string $label, string $value) => ['label' => $label, 'value' => $value];
    $range = fn(int $a, int $b) => array_map('strval', range($a, $b));
    return [
        'php_versions' => [['path' => '/opt/alt/php83/usr/bin/php', 'version' => '8.3.12'], ['path' => '/opt/alt/php74/usr/bin/php', 'version' => '7.4.33']],
        'simple_settings' => [
            ['value' => 'hourly', 'label' => 'Once an hour', 'pattern' => '0 * * * *'],
            ['value' => 'daily', 'label' => 'Once a day', 'pattern' => '0 0 * * *'],
            ['value' => 'weekly', 'label' => 'Once a week', 'pattern' => '0 0 * * 0'],
            ['value' => 'monthly', 'label' => 'Once a month', 'pattern' => '0 0 1 * *'],
        ],
        'minutes_list' => $list([$o('Every minute (*)', '*'), $o('Every 5 minutes (*/5)', '*/5')], $range(0, 59)),
        'hours_list'   => $list([$o('Every hour (*)', '*'), $o('Every 2 hours (*/2)', '*/2')], $range(0, 23)),
        'days_list'    => $list([$o('Every day (*)', '*')], $range(1, 31)),
        'months_list'  => $list([$o('Every month (*)', '*')], $range(1, 12)),
        'days_week'    => $list([$o('Every weekday (*)', '*')], $range(0, 6)),
        'cron_list' => [
            ['line' => 1, 'command' => '/usr/bin/php /home/john_doe/public_html/cron.php', 'status' => true,
                'time' => ['type' => 'simple', 'data' => ['label' => 'Once an hour', 'pattern' => '0 * * * *']]],
            ['line' => 2, 'command' => 'rsync -a /home/john_doe/data /home/john_doe/backup', 'status' => true,
                'time' => ['type' => 'advance', 'data' => ['minutes' => '30', 'hours' => '2', 'days' => '*', 'months' => '*', 'weekdays' => '*']]],
            ['line' => 3, 'command' => 'wget -q -O /dev/null https://example.com/ping', 'status' => false,
                'time' => ['type' => 'simple', 'data' => ['label' => 'Once a day', 'pattern' => '0 0 * * *']]],
        ],
    ];
}

/** Language strings for the Cron Jobs page. */
function preview_lang_cron(): array
{
    return [
        'cronuser' => 'Cron Jobs', 'CRHEADTITLE' => 'Scheduled cron jobs', 'CRADDBTN' => 'Add cron job', 'CRCREATE' => 'Create cron job',
        'CRGENSETTINGS' => 'What to run', 'command' => 'Command', 'CRDESCRIPTION' => 'Description', 'CRWHENRUN' => 'When should it run',
        'CRSIMPLESC' => 'Common schedules', 'CRSHOWADVOPT' => 'Show advanced options', 'CRSHOWSIMPLE' => 'Back to common schedules',
        'CRTIMEUNIT1' => 'Minutes', 'CRTIMEUNIT2' => 'Hours', 'CRTIMEUNIT3' => 'Days', 'CRTIMEUNIT4' => 'Months', 'CRTIMEUNIT5' => 'Weekdays',
        'CRCHANGESEL' => 'Change selection', 'CRSAVEBTN' => 'Save', 'CRCANCELBTN' => 'Cancel', 'CRNONECREATED' => 'No cron jobs yet',
        'cron_job' => 'Cron job', 'action' => 'Actions', 'CRPHPINFO' => 'Show the PHP binaries available for your commands',
        'CRPHPAVAIL' => 'Available PHP versions', 'CRPHPPATH' => 'Path', 'CRPHPVER' => 'Version', 'CRPHPCOPY' => 'Copy path',
        'CRLABEL9' => 'Could not load the cron jobs.',
    ];
}

/** Mock data for the PHP.ini editor (shapes follow js/modules/phpini_editor.js.twig). */
function preview_phpini(): array
{
    $row = fn(int $line, string $name, string $value, int $st = 1) => ['line' => $line, 'name' => $name, 'name2' => $name, 'value' => $value, 'st' => $st];
    $tab = [
        $row(1, 'memory_limit', '256M'), $row(2, 'upload_max_filesize', '64M'), $row(3, 'post_max_size', '64M'),
        $row(4, 'max_execution_time', '300'), $row(5, 'display_errors', 'Off', 0), $row(6, 'date__timezone', 'Europe/Paris'),
    ];
    return [
        'domain' => ['example.com', 'shop.example.com'], 'path' => '/home/john_doe/public_html/', 'php' => 'php-fpm', 'valuehidden' => '',
        'tab' => $tab, 'confs_php' => [], 'timezone_data' => ['Europe/Paris', 'UTC', 'America/New_York'], 'isie' => 0,
        'phpini' => "; php.ini for example.com\nmemory_limit = 256M\nupload_max_filesize = 64M\npost_max_size = 64M\nmax_execution_time = 300\n;display_errors = Off\ndate.timezone = Europe/Paris\n",
    ];
}

function preview_lang_phpini(): array
{
    return [
        'NAMEMOD' => 'PHP.ini Editor', 'PHPLABEL7' => 'Domain', 'PHPLABEL8' => 'File', 'PHPINICONFFOR' => 'settings for', 'PHPLABEL5' => 'Basic mode',
        'PHPELABEL' => 'Advanced mode', 'PHPLABEL4' => 'Edit the whole file. Invalid directives can break your site.', 'SETTING' => 'Setting', 'VALUE' => 'Value',
        'BTN_ENABLE' => 'Enabled (click to disable)', 'BTN_DISABLE' => 'Disabled (click to enable)', 'BTN_DELETE' => 'Delete', 'PHPUPDATECHG' => 'Update',
        'BTNADDNRED' => 'Add a setting', 'CHOOSE' => 'Choose...', 'PHPINICUSTC1' => 'directive name', 'PHPINICUSTCONF' => 'Custom setting', 'PHPELABEL2' => 'Value',
        'PHPINICONFVAL' => 'value', 'BTN_ADD' => 'Add', 'BTN_CANCEL' => 'Cancel', 'PHPINISVBTN' => 'Save file', 'PHPELABEL3' => 'Select timezone',
    ];
}

function preview_lang_phpselector(): array
{
    return [
        'SPHPLABELSELECT' => 'Select the PHP version', 'SPHPLABEL39' => 'Domain', 'SPHPLABEL40' => 'Choose...', 'SPHPLABEL22' => 'PHP version',
        'SPHPLABEL21' => 'Apply', 'SPHPLABELDETAILS' => 'Current setup', 'SPHPLABEL26' => 'Version', 'SPHPLABEL27' => 'Apache', 'SPHPLABEL29' => 'Nginx',
        'SPHPLABEL1' => 'Enabled', 'SPHPLABEL35' => 'Disabled', 'SPHPLABEL38' => 'A license is required to change the PHP version.',
    ];
}