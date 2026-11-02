/**
 * WORDPRESS MANAGER - MODAL FUNCTIONS
 * JavaScript functions to open all WPM modals
 */



// ============================================================
// LOGIN
// ============================================================
function wpmOpenLogin(url, domain, path) {
    if (url) {
        // Open in new tab
        window.open(url, '_blank');
        wpmNotify.success('Opening WordPress login in new tab...');
    } else {
        wpmNotify.error('URL not available for this installation');
    }
}

// ============================================================
// PREVIEW
// ============================================================

function wpmOpenPreview(url, domain, path) {
    if (url) {
        // Open in a new tab
        window.open(url, '_blank');
        wpmNotify.success('Opening WordPress preview in new tab...');
    } else {
        wpmNotify.error('URL not available for this installation');
    }
}

// ============================================================
// SECURITY
// ============================================================
var wpmCurrentPath = '';

function wpmOpenSecurity(path) {
    wpmCurrentPath = path;
    $('#wpm-modal-security').modal('show');
    wpmLoadSecurity(path);
}

// ============================================================
// PLUGINS & THEMES
// ============================================================
function wpmOpenPlugins(path) {
    wpmCurrentPath = path;
    $('#wpm-modal-plugins').modal('show');
    wpmLoadPlugins(path);
    $('#wpm-plugin-search-input').val('');
    $('#wpm-plugin-search-input').focus();
    wpmSearchPlugins('');
}

function wpmOpenThemes(path) {
    wpmCurrentPath = path;
    $('#wpm-modal-themes').modal('show');
    wpmLoadThemes(path);
    $('#wpm-theme-search-input').val('');
    $('#wpm-theme-search-input').focus();
    wpmSearchThemes('');
}

function wpmLoadPlugins(path) {
    // Clear existing content
    $('#wpm-plugins-body').html('<div style="text-align:center;padding:20px;"><i class="fa fa-circle-o-notch fa-spin" style="font-size:24px;color:#cbd5e0;"></i><p style="margin-top:10px;color:#718096;">Loading plugins...</p></div>');

    // Load plugins list
    wpmAjax('list_plugins', {
        path: path
    }, function(res) {
        if (res.success && res.plugins) {
            displayPlugins(res.plugins, path);
        } else {
            $('#wpm-plugins-body').html('<div class="alert alert-danger"><i class="fa fa-exclamation-circle"></i> Error loading plugins: ' + (res.message || 'Unknown error') + '</div>');
        }
    });
}

function displayPlugins(plugins, path) {
    if (plugins.length === 0) {
        $('#wpm-plugins-body').html('<div class="alert alert-info"><i class="fa fa-info-circle"></i> No plugins installed</div>');
        return;
    }

    let html = '<div class="wpm-item-list">';
    plugins.forEach(function(plugin) {
        const isActive = plugin.active ? 'wpm-item-active' : '';
        const statusIcon = plugin.active ? '<i class="fa fa-check-circle" style="color:#27ae60;"></i>' : '<i class="fa fa-times-circle" style="color:#e74c3c;"></i>';

        html += `
            <div class="wpm-item-card ${isActive}">
                <div class="wpm-item-info">
                    <div class="wpm-item-name">
                        ${plugin.name}
                        <span class="label ${plugin.active ? 'label-success' : 'label-default'}">${plugin.active ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div class="wpm-item-meta">
                        <span class="label"><i class="fa fa-info-circle"></i> Version: ${plugin.version || 'Unknown'}</span>
                        <span class="label"><i class="fa fa-download"></i> Author: ${plugin.author || 'Unknown'}</span>
                    </div>
                </div>
                <div class="wpm-item-actions">
                    <button class="btn btn-xs btn-${plugin.active ? 'warning' : 'success'}" onclick="wpmTogglePlugin('${path}', '${plugin.slug}', ${!plugin.active})">
                        <i class="fa fa-${plugin.active ? 'power-off' : 'play'}"></i> ${plugin.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button class="btn btn-xs btn-default" onclick="wpmShowPluginDetails('${path}', '${plugin.slug}')">
                        <i class="fa fa-eye"></i> Details
                    </button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    $('#wpm-plugins-body').html(html);
}

function wpmLoadThemes(path) {
    // Clear existing content
    $('#wpm-themes-body').html('<div style="text-align:center;padding:20px;"><i class="fa fa-circle-o-notch fa-spin" style="font-size:24px;color:#cbd5e0;"></i><p style="margin-top:10px;color:#718096;">Loading themes...</p></div>');

    // Load themes list
    wpmAjax('list_themes', {
        path: path
    }, function(res) {
        if (res.success && res.themes) {
            displayThemes(res.themes, path);
        } else {
            $('#wpm-themes-body').html('<div class="alert alert-danger"><i class="fa fa-exclamation-circle"></i> Error loading themes: ' + (res.message || 'Unknown error') + '</div>');
        }
    });
}

function displayThemes(themes, path) {
    if (themes.length === 0) {
        $('#wpm-themes-body').html('<div class="alert alert-info"><i class="fa fa-info-circle"></i> No themes installed</div>');
        return;
    }

    let html = '<div class="wpm-item-list">';
    themes.forEach(function(theme) {
        const isActive = theme.active ? 'wpm-item-active' : '';
        const statusIcon = theme.active ? '<i class="fa fa-check-circle" style="color:#27ae60;"></i>' : '<i class="fa fa-times-circle" style="color:#e74c3c;"></i>';

        html += `
            <div class="wpm-item-card ${isActive}">
                <div class="wpm-item-info">
                    <div class="wpm-item-name">
                        ${theme.name}
                        <span class="label ${theme.active ? 'label-success' : 'label-default'}">${theme.active ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div class="wpm-item-meta">
                        <span class="label"><i class="fa fa-info-circle"></i> Version: ${theme.version || 'Unknown'}</span>
                        <span class="label"><i class="fa fa-download"></i> Author: ${theme.author || 'Unknown'}</span>
                    </div>
                </div>
                <div class="wpm-item-actions">
                    <button class="btn btn-xs btn-${theme.active ? 'warning' : 'success'}" onclick="wpmToggleTheme('${path}', '${theme.name}', ${!theme.active})">
                        <i class="fa fa-${theme.active ? 'power-off' : 'play'}"></i> ${theme.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button class="btn btn-xs btn-default" onclick="wpmShowThemeDetails('${path}', '${theme.name}')">
                        <i class="fa fa-eye"></i> Details
                    </button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    $('#wpm-themes-body').html(html);
}

function wpmSearchThemes(query) {
    wpmAjax('search_themes', {
        path: wpmCurrentPath,
        query: query
    }, function(res) {
        if (res.success && res.themes) {
            displayThemes(res.themes, wpmCurrentPath);
        } else {
            $('#wpm-themes-body').html('<div class="alert alert-danger"><i class="fa fa-exclamation-circle"></i> Error searching themes: ' + (res.message || 'Unknown error') + '</div>');
        }
    });
}

function wpmToggleTheme(path, name, activate) {
    const action = activate ? 'activate_theme' : 'deactivate_theme';
    const message = activate ? 'Activating...' : 'Deactivating...';

    wpmNotify.info(message);

    wpmAjax(action, {
        path: path,
        name: name
    }, function(res) {
        if (res.success) {
            wpmNotify.success('Theme ' + (activate ? 'activated' : 'deactivated') + ' successfully');
            wpmLoadThemes(path);
        } else {
            wpmNotify.error('Failed to ' + (activate ? 'activate' : 'deactivate') + ' theme: ' + (res.message || 'Unknown error'));
        }
    });
}

function wpmShowThemeDetails(path, name) {
    wpmNotify.info('Showing theme details for: ' + name);
    // TODO: Implement theme details view
}

function wpmSearchPlugins(query) {
    wpmAjax('search_plugins', {
        path: wpmCurrentPath,
        query: query
    }, function(res) {
        if (res.success && res.plugins) {
            displayPlugins(res.plugins, wpmCurrentPath);
        } else {
            $('#wpm-plugins-body').html('<div class="alert alert-danger"><i class="fa fa-exclamation-circle"></i> Error searching plugins: ' + (res.message || 'Unknown error') + '</div>');
        }
    });
}

function wpmTogglePlugin(path, slug, activate) {
    const action = activate ? 'activate_plugin' : 'deactivate_plugin';
    const message = activate ? 'Activating...' : 'Deactivating...';

    wpmNotify.info(message);

    wpmAjax(action, {
        path: path,
        slug: slug
    }, function(res) {
        if (res.success) {
            wpmNotify.success('Plugin ' + (activate ? 'activated' : 'deactivated') + ' successfully');
            wpmLoadPlugins(path);
        } else {
            wpmNotify.error('Failed to ' + (activate ? 'activate' : 'deactivate') + ' plugin: ' + (res.message || 'Unknown error'));
        }
    });
}

function wpmShowPluginDetails(path, slug) {
    wpmCurrentPath = path;
    $('#wpm-modal-plugin-details').modal('show');
    $('#wpm-plugin-details-body').html('<div style="text-align:center;padding:30px;"><i class="fa fa-circle-o-notch fa-spin"></i> Loading...</div>');

    wpmAjax('plugin_details', {path: path, slug: slug}, function(res) {
        var p = res.plugin || {};
        var isActive = p.active;
        var statusLabel = isActive
            ? '<span class="label label-success">Active</span>'
            : '<span class="label label-default">Inactive</span>';

        function row(label, value) {
            if (value === undefined || value === null || value === '') return '';
            return '<tr><th style="width:35%;text-align:right;color:#7f8c8d;">' + label + '</th>'
                 + '<td>' + value + '</td></tr>';
        }

        var updateBadge = p.update_available
            ? ' <span class="label label-warning">Update ' + (p.update_version || '') + '</span>'
            : '';
        var autoUpdateBadge = p.auto_update
            ? ' <span class="label label-info">Auto-update ON</span>'
            : '';
        var networkBadge = p.network_active
            ? ' <span class="label label-primary">Network</span>'
            : '';

        var html = '<div style="padding:10px;">';
        html += '<h4 style="margin-top:0;">' + (p.title || p.name || slug) + ' '
              + statusLabel + updateBadge + autoUpdateBadge + networkBadge + '</h4>';
        html += '<table class="table table-condensed" style="margin-top:15px;">';
        html += row('Slug', p.slug);
        html += row('Version', p.version);
        html += row('Author', p.author);
        html += row('Status', p.status);
        html += row('Path', p.path ? '<code>' + p.path + '</code>' : '');
        html += '</table>';
        if (p.description) {
            html += '<div style="margin-top:15px;"><strong style="color:#7f8c8d;">Description</strong>'
                  + '<p style="margin-top:5px;color:#34495e;">' + p.description + '</p></div>';
        }
        html += '<div class="wpm-modal-actions" style="margin-top:20px;text-align:right;">';
        html += '<button class="btn btn-xs btn-' + (isActive ? 'warning' : 'success') + '" onclick="wpmTogglePlugin(\'' + path + '\',\'' + slug + '\',' + !isActive + ');$(\'#wpm-modal-plugin-details\').modal(\'hide\');">'
              + '<i class="fa fa-' + (isActive ? 'power-off' : 'play') + '"></i> '
              + (isActive ? 'Deactivate' : 'Activate') + '</button> ';
        html += '<button class="btn btn-xs btn-default" data-dismiss="modal">Close</button>';
        html += '</div>';
        html += '</div>';

        $('#wpm-plugin-details-body').html(html);
    }, function(err) {
        $('#wpm-plugin-details-body').html('<div class="alert alert-danger"><i class="fa fa-exclamation-circle"></i> '
            + (err.message || 'Error loading plugin details') + '</div>');
    });
}

// ============================================================
// CACHE MANAGEMENT
// ============================================================
function wpmOpenCache(path) {
    wpmCurrentPath = path;
    $('#wpm-modal-cache').modal('show');
    wpmLoadCacheStatus(path);
}

function wpmLoadCacheStatus(path) {
    $('#wpm-cache-status').html('<p class="text-muted"><i class="fa fa-circle-o-notch fa-spin"></i> Loading cache status...</p>');

    // Check if cache is enabled
    wpmAjax('get_cache_status', {
        path: path
    }, function(res) {
        if (res.success && res.status) {
            const status = res.status;
            let html = '';

            if (status.object_cache) {
                html += `
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h4 class="panel-title">
                                <i class="fa fa-database"></i> Object Cache (${status.object_cache_type})
                            </h4>
                        </div>
                        <div class="panel-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <small class="text-muted">Status: <strong>Enabled</strong></small>
                                </div>
                                <div class="col-md-6 text-right">
                                    <button class="btn btn-warning btn-sm" onclick="wpmFlushCache()">
                                        <i class="fa fa-eraser"></i> Flush Cache
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }

            if (status.page_cache) {
                html += `
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h4 class="panel-title">
                                <i class="fa fa-file-text-o"></i> Page Cache (${status.page_cache_plugin})
                            </h4>
                        </div>
                        <div class="panel-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <small class="text-muted">Status: <strong>Enabled</strong></small>
                                </div>
                                <div class="col-md-6 text-right">
                                    <button class="btn btn-warning btn-sm" onclick="wpmFlushCache()">
                                        <i class="fa fa-eraser"></i> Flush Cache
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }

            if (html === '') {
                html = '<div class="alert alert-info"><i class="fa fa-info-circle"></i> No cache enabled</div>';
            }

            $('#wpm-cache-status').html(html);
        } else {
            $('#wpm-cache-status').html('<div class="alert alert-danger"><i class="fa fa-exclamation-circle"></i> Error loading cache status: ' + (res.message || 'Unknown error') + '</div>');
        }
    });
}

function wpmFlushCache() {
    wpmNotify.info('Flushing cache...');

    wpmAjax('flush_cache', { path: wpmCurrentPath }, function(res) {
        if (res.success) {
            wpmNotify.success('Cache flushed successfully');
            wpmLoadCacheStatus(wpmCurrentPath);
        } else {
            wpmNotify.error('Failed to flush cache: ' + (res.message || 'Unknown error'));
        }
    });
}

// ============================================================
// DATABASE TOOLS
// ============================================================
function wpmOpenDbTools(path) {
    wpmCurrentPath = path;
    $('#wpm-modal-dbtools').modal('show');
    wpmLoadDbInfo(path);
}

function wpmLoadDbInfo(path) {
    $('#wpm-db-info').html('<p class="text-muted"><i class="fa fa-circle-o-notch fa-spin"></i> Loading database info...</p>');

    // Get database info
    wpmAjax('get_db_info', {
        path: path
    }, function(res) {
        if (res.result === 'success' && res) {
            const info = res;
            let html = `
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h4 class="panel-title"><i class="fa fa-database"></i> Database Information</h4>
                    </div>
                    <div class="panel-body">
                        <div class="row">
                            <div class="col-md-6">
                                <small class="text-muted">Database Name:</small>
                                <p class="statistic-box" style="margin-bottom:5px;"><strong>${info.db_name || 'Unknown'}</strong></p>
                            </div>
                            <div class="col-md-6">
                                <small class="text-muted">Tables:</small>
                                <p class="statistic-box" style="margin-bottom:5px;"><strong>${info.table_count || 0}</strong></p>
                            </div>
                            <div class="col-md-6">
                                <small class="text-muted">Total Size:</small>
                                <p class="statistic-box" style="margin-bottom:5px;"><strong>${info.total_size || 'Unknown'}</strong></p>
                            </div>
                            <div class="col-md-6">
                                <small class="text-muted">Overhead:</small>
                                <p class="statistic-box" style="margin-bottom:5px;"><strong>${info.total_overhead || '0 B'}</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            html += `
                <div class="wpm-modal-actions" style="display:flex;gap:6px;flex-wrap:wrap;">
                    <button class="btn btn-primary" onclick="wpmOptimizeDb()">
                        <i class="fa fa-magic"></i> Optimize
                    </button>
                    <button class="btn btn-success" onclick="wpmRepairDb()">
                        <i class="fa fa-wrench"></i> Repair
                    </button>
                </div>
            `;

            html += `<hr>`;
            html += `<h5><i class="fa fa-exchange"></i> Search & Replace</h5>`;
            html += `<p class="text-muted" style="font-size:12px;margin-bottom:10px;">Useful for migrations. Replaces URLs or text in the database.</p>`;
            html += `<div class="form-group">`;
            html += `<input type="text" class="form-control" id="wpm-sr-from" placeholder="Find (e.g. old-domain.com)" style="margin-bottom:8px;">`;
            html += `<input type="text" class="form-control" id="wpm-sr-to" placeholder="Replace with (e.g. new-domain.com)" style="margin-bottom:8px;">`;
            html += `<button class="btn btn-danger" onclick="wpmDoSearchReplace()">`;
            html += `<i class="fa fa-exchange"></i> Run`;
            html += `</button>`;
            html += `</div>`;

            $('#wpm-db-info').html(html);
        } else {
            $('#wpm-db-info').html('<div class="alert alert-danger"><i class="fa fa-exclamation-circle"></i> Error loading database info: ' + (res.message || 'Unknown error') + '</div>');
        }
    });
}

function wpmOptimizeDb() {
    wpmNotify.info('Optimizing database...');

    wpmAjax('optimize_db', {
        path: wpmCurrentPath
    }, function(res) {
        if (res.success) {
            wpmNotify.success('Database optimized successfully');
        } else {
            wpmNotify.error('Failed to optimize database: ' + (res.message || 'Unknown error'));
        }
    });
}

function wpmRepairDb() {
    wpmNotify.info('Repairing database...');

    wpmAjax('repair_db', {
        path: wpmCurrentPath
    }, function(res) {
        if (res.success) {
            wpmNotify.success('Database repaired successfully');
        } else {
            wpmNotify.error('Failed to repair database: ' + (res.message || 'Unknown error'));
        }
    });
}

function wpmDoSearchReplace() {
    const from = $('#wpm-sr-from').val();
    const to = $('#wpm-sr-to').val();

    if (!from || !to) {
        wpmNotify.error('Please enter both find and replace values');
        return;
    }

    wpmNotify.info('Running search and replace...');

    wpmAjax('search_replace_db', {
        path: wpmCurrentPath,
        search: from,
        replace: to
    }, function(res) {
        if (res.success) {
            wpmNotify.success('Search and replace completed successfully');
        } else {
            wpmNotify.error('Failed to run search and replace: ' + (res.message || 'Unknown error'));
        }
    });
}

// ============================================================
// PASSWORD PROTECTION
// ============================================================
function wpmOpenProtection(path) {
    wpmCurrentPath = path;
    $('#wpm-modal-protection').modal('show');
    wpmLoadProtection(path);
}

function wpmLoadProtection(path) {
    $('#wpm-users-list').html('<p class="text-muted"><i class="fa fa-circle-o-notch fa-spin"></i> Loading users...</p>');

    // Get password protection status
    wpmAjax('get_password_protection', {
        path: path
    }, function(res) {
        if (res.success && res.status) {
            const status = res.status;
            const enabled = status.enabled || false;

            // Update checkbox
            $('#wpm-protect-enabled').prop('checked', enabled);

            // Show/hide credentials section
            if (enabled) {
                $('#wpm-protect-creds').show();
                $('#wpm-protect-user').val(status.user || '');
                $('#wpm-protect-pass').val('');
            } else {
                $('#wpm-protect-creds').hide();
            }

            // List WordPress users
            wpmAjax('list_users', {
                path: path
            }, function(res) {
                if (res.success && res.users) {
                    let html = '';
                    res.users.forEach(function(user) {
                        html += `
                            <div style="margin-bottom:8px;padding:8px;border-bottom:1px solid #f0f0f0;">
                                <strong>${user.login}</strong> (${user.email || 'No email'})
                            </div>
                        `;
                    });
                    html += `<small class="text-muted">Total users: ${res.users.length}</small>`;
                    $('#wpm-users-list').html(html);
                } else {
                    $('#wpm-users-list').html('<p class="text-muted">No users found</p>');
                }
            });
        } else {
            wpmNotify.error('Failed to load password protection status: ' + (res.message || 'Unknown error'));
        }
    });
}

function wpmSaveProtection() {
    const enabled = $('#wpm-protect-enabled').prop('checked');
    const user = $('#wpm-protect-user').val();
    const pass = $('#wpm-protect-pass').val();

    wpmNotify.info('Saving password protection settings...');

    wpmAjax('toggle_password_protection', {
        path: wpmCurrentPath,
        enabled: enabled ? '1' : '0',
        auth_user: user,
        auth_pass: pass
    }, function(res) {
        if (res.success) {
            wpmNotify.success('Password protection settings saved successfully');
            wpmLoadProtection(wpmCurrentPath);
        } else {
            wpmNotify.error('Failed to save password protection settings: ' + (res.message || 'Unknown error'));
        }
    });
}

// ============================================================
// FILES MANAGER
// ============================================================
function wpmOpenFiles(path) {
    wpmCurrentPath = path;
    $('#wpm-modal-files').modal('show');
    wpmLoadFiles(path);
}

function wpmLoadFiles(path) {
    // Load configuration
    wpmAjax('get_config', {
        path: path
    }, function(res) {
        if (res.success && res.content) {
            $('#wpm-config-editor').val(res.content);
        }
    });

    // Load .htaccess
    wpmAjax('get_htaccess', {
        path: path
    }, function(res) {
        if (res.success && res.content) {
            $('#wpm-htaccess-editor').val(res.content);
        }
    });

    // Load error log
    wpmAjax('get_error_log', {
        path: path
    }, function(res) {
        if (res.success && res.content) {
            $('#wpm-error-log').text(res.content);
        } else {
            $('#wpm-error-log').html('<div class="text-center text-muted">No errors in log</div>');
        }
    });
}

function wpmSaveConfig() {
    const content = $('#wpm-config-editor').val();

    wpmNotify.info('Saving wp-config.php...');

    wpmAjax('save_config', {
        path: wpmCurrentPath,
        content: content
    }, function(res) {
        if (res.success) {
            wpmNotify.success('wp-config.php saved successfully');
        } else {
            wpmNotify.error('Failed to save wp-config.php: ' + (res.message || 'Unknown error'));
        }
    });
}

function wpmSaveHtaccess() {
    const content = $('#wpm-htaccess-editor').val();

    wpmNotify.info('Saving .htaccess...');

    wpmAjax('save_htaccess', {
        path: wpmCurrentPath,
        content: content
    }, function(res) {
        if (res.success) {
            wpmNotify.success('.htaccess saved successfully');
        } else {
            wpmNotify.error('Failed to save .htaccess: ' + (res.message || 'Unknown error'));
        }
    });
}

function wpmClearErrorLog() {
    wpmNotify.info('Clearing error log...');

    wpmAjax('clear_error_log', {
        path: wpmCurrentPath
    }, function(res) {
        if (res.success) {
            wpmNotify.success('Error log cleared successfully');
            $('#wpm-error-log').html('<div class="text-center text-muted">Log cleared</div>');
        } else {
            wpmNotify.error('Failed to clear error log: ' + (res.message || 'Unknown error'));
        }
    });
}

// ============================================================
// VULNERABILITIES
// ============================================================
function wpmOpenVulnerabilities(path) {
    wpmCurrentPath = path;
    $('#wpm-modal-vulnerabilities').modal('show');
    wpmLoadVulnerabilities(path);
}

function wpmLoadVulnerabilities(path) {
    $('#wpm-vulnerabilities-body').html('<div style="text-align:center;padding:20px;"><i class="fa fa-circle-o-notch fa-spin" style="font-size:24px;color:#cbd5e0;"></i><p style="margin-top:10px;color:#718096;">Scanning for vulnerabilities...</p></div>');

    wpmAjax('scan_vulnerabilities', {
        path: path
    }, function(res) {
        if (res.success && res.vulnerabilities) {
            displayVulnerabilities(res.vulnerabilities);
        } else {
            $('#wpm-vulnerabilities-body').html('<div class="alert alert-info"><i class="fa fa-info-circle"></i> No vulnerabilities found</div>');
        }
    });
}

function displayVulnerabilities(vulnerabilities) {
    if (vulnerabilities.length === 0) {
        $('#wpm-vulnerabilities-body').html('<div class="alert alert-success"><i class="fa fa-check-circle"></i> No vulnerabilities found</div>');
        return;
    }

    let html = '';
    vulnerabilities.forEach(function(vuln) {
        const severityClass = 'wpm-vuln-sev-' + vuln.severity;
        html += `
            <div class="${severityClass}">
                <div style="display:flex;justify-content:space-between;padding:10px;border-bottom:1px solid #e8e8e8;">
                    <strong>${vuln.name}</strong>
                    <span class="wpm-vuln-count wpm-vuln-${vuln.severity}">${vuln.severity.toUpperCase()}</span>
                </div>
                <div style="padding:10px;">
                    <small style="color:#718096;">${vuln.description}</small>
                    <br>
                    <small style="color:#718096;">Package: ${vuln.package}</small>
                    <br>
                    <small style="color:#718096;">Affected Version: ${vuln.version}</small>
                    ${vuln.fix_version ? '<br><small style="color:#1ab394;">Fixed in: ' + vuln.fix_version + '</small>' : ''}
                </div>
            </div>
        `;
    });

    $('#wpm-vulnerabilities-body').html(html);
}

// ============================================================
// DEV/SEO
// ============================================================
function wpmOpenDevSeo(path) {
    $('#wpm-modal-devseo').modal('show');
    wpmLoadDevSeo(path);
}

function wpmLoadDevSeo(path) {
    wpmAjax('get_devseo_status', { path: path }, function(res) {
        if (res.success && res.status) {
            const status = res.status;
            
            // Unbind previous change events to prevent multiple calls
            $('#wpm-devseo-cron').off('change');
            $('#wpm-devseo-debug').off('change');
            $('#wpm-devseo-seo').off('change');

            // Set checkboxes based on status
            $('#wpm-devseo-cron').prop('checked', status.cron || false);
            $('#wpm-devseo-debug').prop('checked', status.debug || false);
            $('#wpm-devseo-seo').prop('checked', status.seo !== false);

            // Bind new change events to trigger AJAX updates immediately
            $('#wpm-devseo-cron').on('change', function() {
                wpmToggleSystemCron(path, $(this).is(':checked'));
            });
            $('#wpm-devseo-debug').on('change', function() {
                wpmToggleDebugMode(path, $(this).is(':checked'));
            });
            $('#wpm-devseo-seo').on('change', function() {
                wpmToggleSearchEngine(path, $(this).is(':checked'));
            });
        } else {
            noti_bubble(res.message || 'Error loading Dev/SEO settings', 'Error', 'error', true, false, '3000', true);
        }
    });
}

// ============================================================
// CLONE
// ============================================================
function wpmOpenClone(path, domain, wpbd) {
    $('#wpm-modal-clone').modal('show');
    $('#wpm-clone-source').val(domain);
    wpmLoadDomains(path, domain, wpbd);
}

function wpmLoadDomains(path, currentDomain, currentWpbd) {
    $('#wpm-clone-domain').html('<option value="">' + (typeof langmod !== 'undefined' && langmod.WPM_CLONE_SELECT_DOMAIN) + '</option>');

    wpmAjax('list_domains', {}, function(res) {
        if (res.success && res.domains) {
            res.domains.forEach(function(d) {
                const selected = d === currentDomain ? 'selected' : '';
                $('#wpm-clone-domain').append('<option value="' + d + '" ' + selected + '>' + d + '</option>');
            });
        } else {
            $('#wpm-clone-domain').html('<option value="">No domains available</option>');
        }
    });
}
