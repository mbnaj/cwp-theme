/**
 * WORDPRESS MANAGER - MODAL FUNCTIONS
 * JavaScript functions to open all WPM modals
 * For user panel
 */

// ============================================================
// AJAX FUNCTION
// ============================================================

function wpmAjax(action, data, successCallback, errorCallback) {
    // Prepare data
    data.acc = action;

    // Create XMLHttpRequest
    const xhr = new XMLHttpRequest();
    // Use the AJAX handler in user panel modules
    xhr.open('POST', 'ajax_wordpress_manager.php', true);

    // Build query string
    const params = new URLSearchParams();
    for (const key in data) {
        params.append(key, data[key]);
    }

    // Handle response
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);

                // Call success callback
                if (successCallback) {
                    successCallback(response);
                }
            } catch (e) {
                console.error('Error parsing JSON response:', e);
                if (errorCallback) {
                    errorCallback({ result: 'error', message: 'Invalid JSON response' });
                }
            }
        } else {
            console.error('AJAX request failed with status:', xhr.status);
            if (errorCallback) {
                errorCallback({ result: 'error', message: 'HTTP Error ' + xhr.status });
            }
        }
    };

    xhr.onerror = function() {
        console.error('AJAX request failed');
        if (errorCallback) {
            errorCallback({ result: 'error', message: 'Network Error' });
        }
    };

    xhr.send(params);
}

// ============================================================
// LOGIN
// ============================================================

function wpmOpenLogin(url, domain, path) {
    if (url) {
        window.open(url, '_blank');
        noti_bubble('Opening WordPress login...', 'Success', 'success', true, false, '3000', true);
    } else {
        noti_bubble('URL not available for this installation', 'Error', 'error', true, false, '3000', true);
    }
}

function wpmOpenPreview(url, domain, path) {
    if (url) {
        window.open(url, '_blank');
        noti_bubble('Opening WordPress preview...', 'Success', 'success', true, false, '3000', true);
    } else {
        noti_bubble('URL not available for this installation', 'Error', 'error', true, false, '3000', true);
    }
}

// ============================================================
// PLUGINS & THEMES
// ============================================================

function wpmOpenPlugins(path) {
    wpmCurrentPath = path;
    $('#wpm-modal-plugins').modal('show');
    $('.wpm-modal-tabs a[href="#wpm-tab-plugins"]').tab('show');
    wpmLoadPlugins(path);
    wpmLoadThemes(path);
}

function wpmOpenThemes(path) {
    wpmCurrentPath = path;
    $('#wpm-modal-plugins').modal('show');
    $('.wpm-modal-tabs a[href="#wpm-tab-themes"]').tab('show');
    wpmLoadPlugins(path);
    wpmLoadThemes(path);
}

function wpmLoadPlugins(path) {
    $('#wpm-plugins-body').html('<div style="text-align:center;padding:20px;"><i class="fa fa-circle-o-notch fa-spin" style="font-size:24px;color:#cbd5e0;"></i><p style="margin-top:10px;color:#718096;">Loading plugins...</p></div>');

    wpmAjax('list_plugins', { path: path }, function(res) {
        if (res.result === 'success' && res.plugins) {
            displayPlugins(res.plugins, path);
        } else {
            noti_bubble(res.message || 'Error loading plugins', 'Error', 'error', true, false, '3000', true);
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
        // Convertir status a booleano (status: 'active'/'inactive')
        const isActive = (plugin.status === 'active' || plugin.status === 1 || plugin.active === true);
        const statusClass = isActive ? 'wpm-item-active' : '';
        const statusIcon = isActive ? '<i class="fa fa-check-circle" style="color:#27ae60;"></i>' : '<i class="fa fa-times-circle" style="color:#e74c3c;"></i>';

        html += `
            <div class="wpm-item-card ${statusClass}">
                <div class="wpm-item-info">
                    <div class="wpm-item-name">
                        ${plugin.name}
                        <span class="label ${isActive ? 'label-success' : 'label-default'}">${isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div class="wpm-item-meta">
                        <span class="label"><i class="fa fa-info-circle"></i> Version: ${plugin.version || 'Unknown'}</span>
                        <span class="label"><i class="fa fa-download"></i> Author: ${plugin.author || 'Unknown'}</span>
                    </div>
                </div>
                <div class="wpm-item-actions">
                    <button class="btn btn-xs btn-${isActive ? 'warning' : 'success'}" onclick="wpmTogglePlugin('${path}', '${plugin.slug}', ${!isActive})">
                        <i class="fa fa-${isActive ? 'power-off' : 'play'}"></i> ${isActive ? 'Deactivate' : 'Activate'}
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

function wpmSearchPlugins(query) {
    wpmAjax('search_plugins', { path: wpmCurrentPath, query: query }, function(res) {
        if (res.result === 'success' && res.plugins) {
            displayPlugins(res.plugins, wpmCurrentPath);
        } else {
            noti_bubble(res.message || 'Error searching plugins', 'Error', 'error', true, false, '3000', true);
        }
    });
}

function wpmTogglePlugin(path, slug, activate) {
    const action = activate ? 'activate_plugin' : 'deactivate_plugin';
    const message = activate ? 'Activating...' : 'Deactivating...';
    noti_bubble(message, 'Info', 'info', true, false, '3000', true);

    wpmAjax(action, {
        path: path,
        slug: slug
    }, function(res) {
        if (res.result === 'success') {
            noti_bubble('Plugin ' + (activate ? 'activated' : 'deactivated') + ' successfully', 'Success', 'success', true, false, '3000', true);
            wpmLoadPlugins(path);
        } else {
            noti_bubble(res.message || 'Failed to activate plugin', 'Error', 'error', true, false, '3000', true);
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

function wpmLoadThemes(path) {
    $('#wpm-themes-body').html('<div style="text-align:center;padding:20px;"><i class="fa fa-circle-o-notch fa-spin" style="font-size:24px;color:#cbd5e0;"></i><p style="margin-top:10px;color:#718096;">Loading themes...</p></div>');

    wpmAjax('list_themes', { path: path }, function(res) {
        if (res.result === 'success' && res.themes) {
            displayThemes(res.themes, path);
        } else {
            noti_bubble(res.message || 'Error loading themes', 'Error', 'error', true, false, '3000', true);
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
        // Convertir status a booleano (status: 'active'/'inactive')
        const isActive = (theme.status === 'active' || theme.status === 1 || theme.active === true);
        const statusClass = isActive ? 'wpm-item-active' : '';
        const statusIcon = isActive ? '<i class="fa fa-check-circle" style="color:#27ae60;"></i>' : '<i class="fa fa-times-circle" style="color:#e74c3c;"></i>';

        html += `
            <div class="wpm-item-card ${statusClass}">
                <div class="wpm-item-info">
                    <div class="wpm-item-name">
                        ${theme.name}
                        <span class="label ${isActive ? 'label-success' : 'label-default'}">${isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div class="wpm-item-meta">
                        <span class="label"><i class="fa fa-info-circle"></i> Version: ${theme.version || 'Unknown'}</span>
                        <span class="label"><i class="fa fa-download"></i> Author: ${theme.author || 'Unknown'}</span>
                    </div>
                </div>
                <div class="wpm-item-actions">
                    <button class="btn btn-xs btn-${isActive ? 'warning' : 'success'}" onclick="wpmToggleTheme('${path}', '${theme.name}', ${!isActive})">
                        <i class="fa fa-${isActive ? 'power-off' : 'play'}"></i> ${isActive ? 'Deactivate' : 'Activate'}
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
    wpmAjax('search_themes', { path: wpmCurrentPath, query: query }, function(res) {
        if (res.result === 'success' && res.themes) {
            displayThemes(res.themes, wpmCurrentPath);
        } else {
            noti_bubble(res.message || 'Error searching themes', 'Error', 'error', true, false, '3000', true);
        }
    });
}

function wpmToggleTheme(path, name, activate) {
    const action = activate ? 'activate_theme' : 'deactivate_theme';
    const message = activate ? 'Activating...' : 'Deactivating...';
    noti_bubble(message, 'Info', 'info', true, false, '3000', true);

    wpmAjax(action, {
        path: path,
        slug: name,
        name: name,
        theme: name
    }, function(res) {
        if (res.result === 'success') {
            noti_bubble('Theme ' + (activate ? 'activated' : 'deactivated') + ' successfully', 'Success', 'success', true, false, '3000', true);
            wpmLoadThemes(path);
        } else {
            noti_bubble(res.message || 'Failed to activate theme', 'Error', 'error', true, false, '3000', true);
        }
    });
}

function wpmShowThemeDetails(path, name) {
    noti_bubble('Showing theme details for: ' + name, 'Info', 'info', true, false, '3000', true);
    // TODO: Implement theme details view
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

    wpmAjax('get_db_info', { path: path }, function(res) {
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

            $('#wpm-db-info').html(html);
        } else {
            noti_bubble(res.message || 'Error loading database info', 'Error', 'error', true, false, '3000', true);
        }
    });
}

function wpmOptimizeDb() {
    noti_bubble('Optimizing database...', 'Info', 'info', true, false, '3000', true);

    wpmAjax('optimize_db', { path: wpmCurrentPath }, function(res) {
        if (res.result === 'success') {
            noti_bubble('Database optimized successfully', 'Success', 'success', true, false, '3000', true);
        } else {
            noti_bubble(res.message || 'Failed to optimize database', 'Error', 'error', true, false, '3000', true);
        }
    });
}

function wpmRepairDb() {
    noti_bubble('Repairing database...', 'Info', 'info', true, false, '3000', true);

    wpmAjax('repair_db', { path: wpmCurrentPath }, function(res) {
        if (res.result === 'success') {
            noti_bubble('Database repaired successfully', 'Success', 'success', true, false, '3000', true);
        } else {
            noti_bubble(res.message || 'Failed to repair database', 'Error', 'error', true, false, '3000', true);
        }
    });
}

function wpmDoSearchReplace() {
    const search = $('#wpm-sr-from').val();
    const replace = $('#wpm-sr-to').val();

    if (!search || !replace) {
        noti_bubble('Please provide both search and replace values', 'Error', 'error', true, false, '3000', true);
        return;
    }

    noti_bubble('Running search and replace...', 'Info', 'info', true, false, '3000', true);

    wpmAjax('search_replace_db', {
        path: wpmCurrentPath,
        search: search,
        replace: replace
    }, function(res) {
        if (res.result === 'success') {
            noti_bubble('Search and replace completed', 'Success', 'success', true, false, '3000', true);
        } else {
            noti_bubble(res.message || 'Failed to run search and replace', 'Error', 'error', true, false, '3000', true);
        }
    });
}

// ============================================================
// SECURITY
// ============================================================

function wpmOpenSecurity(path) {
    wpmCurrentPath = path;
    $('#wpm-modal-security').modal('show');
    wpmLoadSecurity(path);
}

function wpmLoadSecurity(path) {
    $('#wpm-security-content').html('<p class="text-muted"><i class="fa fa-circle-o-notch fa-spin"></i> Loading security settings...</p>');

    wpmAjax('security_status', { path: path }, function(res) {
        if (res.result === 'success') {
            const security = res.security;
            let html = '';

            if (security.search_engine_visibility !== null) {
                const isVisible = security.search_engine_visibility === '1';
                const label = isVisible ? 'Visible to search engines' : 'Not visible to search engines';
                html += `
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h4 class="panel-title"><i class="fa fa-search"></i> Search Engine Visibility</h4>
                        </div>
                        <div class="panel-body">
                            <div class="wpm-checkbox-row">
                                <input type="checkbox" id="wpm-seo-check" ${isVisible ? 'checked' : ''}>
                                <label for="wpm-seo-check">${label}</label>
                            </div>
                            <button class="btn btn-xs btn-primary" onclick="wpmToggleSearchEngine('${path}', this)">
                                <i class="fa fa-refresh"></i> Update
                            </button>
                        </div>
                    </div>
                `;
            }

            html += `
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h4 class="panel-title"><i class="fa fa-clock"></i> System Cron</h4>
                    </div>
                    <div class="panel-body">
                        <div class="wpm-checkbox-row">
                            <input type="checkbox" id="wpm-cron-check" ${security.system_cron ? 'checked' : ''}>
                            <label for="wpm-cron-check">System cron is active (${security.cron_status || 'Unknown'})</label>
                        </div>
                        <button class="btn btn-xs btn-primary" onclick="wpmToggleSystemCron('${path}', this)">
                            <i class="fa fa-refresh"></i> Check Status
                        </button>
                    </div>
                </div>
            `;

            $('#wpm-security-content').html(html);
        } else {
            noti_bubble(res.message || 'Error loading security settings', 'Error', 'error', true, false, '3000', true);
        }
    });
}

function wpmToggleSearchEngine(path, btn) {
    const isChecked = $('#wpm-seo-check').is(':checked');
    const status = isChecked ? '1' : '0';
    const label = isChecked ? 'Visible' : 'Not visible';

    $(btn).prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Updating...');

    wpmAjax('toggle_search_engine', {
        path: path,
        enabled: status
    }, function(res) {
        if (res.result === 'success') {
            noti_bubble('Search engine visibility updated to: ' + label, 'Success', 'success', true, false, '3000', true);
            wpmLoadSecurity(path);
        } else {
            noti_bubble(res.message || 'Failed to update search engine visibility', 'Error', 'error', true, false, '3000', true);
        }
    });
}

function wpmToggleSystemCron(path, btn) {
    $(btn).prop('disabled', true).html('<i class="fa fa-spinner fa-spin"></i> Checking...');

    wpmAjax('toggle_system_cron', {
        path: path
    }, function(res) {
        if (res.result === 'success') {
            noti_bubble('System cron updated to: ' + res.cron_status, 'Success', 'success', true, false, '3000', true);
            wpmLoadSecurity(path);
        } else {
            noti_bubble(res.message || 'Failed to update system cron', 'Error', 'error', true, false, '3000', true);
        }
    });
}

// ============================================================
// CACHE
// ============================================================

function wpmOpenCache(path) {
    wpmCurrentPath = path;
    $('#wpm-modal-cache').modal('show');
    wpmLoadCacheStatus(path);
}

function wpmLoadCacheStatus(path) {
    $('#wpm-cache-status').html('<p class="text-muted"><i class="fa fa-circle-o-notch fa-spin"></i> Loading cache status...</p>');

    wpmAjax('get_cache_status', { path: path }, function(res) {
        if (res.result === 'success' && res.status) {
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
            noti_bubble(res.message || 'Error loading cache status', 'Error', 'error', true, false, '3000', true);
        }
    });
}

function wpmFlushCache() {
    noti_bubble('Flushing cache...', 'Info', 'info', true, false, '3000', true);

    wpmAjax('flush_cache', { path: wpmCurrentPath }, function(res) {
        if (res.result === 'success') {
            noti_bubble('Cache flushed successfully', 'Success', 'success', true, false, '3000', true);
            wpmLoadCacheStatus(wpmCurrentPath);
        } else {
            noti_bubble(res.message || 'Failed to flush cache', 'Error', 'error', true, false, '3000', true);
        }
    });
}

// ============================================================
// FILES
// ============================================================

function wpmOpenFiles(path) {
    wpmCurrentPath = path;
    $('#wpm-modal-files').modal('show');
    wpmLoadConfig(path);
}

function wpmLoadConfig(path) {
    $('#wpm-config-content').html('<p class="text-muted"><i class="fa fa-circle-o-notch fa-spin"></i> Loading wp-config.php...</p>');

    wpmAjax('get_config', { path: path }, function(res) {
        if (res.result === 'success' && res.content) {
            $('#wpm-config-content').html(`
                <textarea class="form-control" rows="20" readonly>${res.content}</textarea>
                <div class="wpm-modal-actions" style="margin-top:15px;">
                    <button class="btn btn-primary" onclick="wpmCopyConfig('${path}')">
                        <i class="fa fa-copy"></i> Copy to Clipboard
                    </button>
                </div>
            `);
        } else {
            noti_bubble(res.message || 'Error loading config file', 'Error', 'error', true, false, '3000', true);
        }
    });
}

function wpmCopyConfig(path) {
    // Copy configuration to clipboard
    const configContent = $('#wpm-config-content textarea').val();
    navigator.clipboard.writeText(configContent).then(function() {
        noti_bubble('Configuration copied to clipboard', 'Success', 'success', true, false, '3000', true);
    }).catch(function(err) {
        noti_bubble('Failed to copy configuration', 'Error', 'error', true, false, '3000', true);
    });
}

// ============================================================
// PROTECTION
// ============================================================

function wpmOpenProtection(path) {
    wpmCurrentPath = path;
    $('#wpm-modal-protection').modal('show');
    wpmLoadPasswordProtection(path);
}

function wpmLoadPasswordProtection(path) {
    $('#wpm-protect-creds').hide();

    wpmAjax('get_password_protection', { path: path }, function(res) {
        if (res.result === 'success') {
            const protection = res.protection;
            $('#wpm-protect-enabled').prop('checked', protection.enabled === '1');

            if (protection.enabled === '1') {
                $('#wpm-protect-creds').show();
                $('#wpm-protect-user').val(protection.user || '');
                $('#wpm-protect-pass').val(protection.pass || '');
            }
        } else {
            noti_bubble(res.message || 'Error loading protection settings', 'Error', 'error', true, false, '3000', true);
        }
    });
}

// Protection toggle handler
$('#wpm-protect-enabled').change(function() {
    if ($(this).is(':checked')) {
        $('#wpm-protect-creds').show();
    } else {
        $('#wpm-protect-creds').hide();
    }
});

// ============================================================
// VULNERABILITIES
// ============================================================

function wpmOpenVulnerabilities(path) {
    wpmCurrentPath = path;
    $('#wpm-modal-vulnerabilities').modal('show');
    wpmLoadVulnerabilities(path);
}

function wpmLoadVulnerabilities(path) {
    $('#wpm-vuln-content').html('<p class="text-muted"><i class="fa fa-circle-o-notch fa-spin"></i> Loading vulnerabilities...</p>');

    wpmAjax('get_vulnerabilities', { path: path }, function(res) {
        if (res.result === 'success' && res.vulnerabilities) {
            const vulns = res.vulnerabilities;
            if (vulns.length === 0) {
                $('#wpm-vuln-content').html('<div class="alert alert-success"><i class="fa fa-check-circle"></i> No vulnerabilities detected</div>');
            } else {
                let html = '<div class="wpm-item-list">';
                vulns.forEach(function(vuln) {
                    html += `
                        <div class="wpm-item-card">
                            <div class="wpm-item-name">
                                <i class="fa fa-bug" style="color:#e74c3c;"></i> ${vuln.plugin} (${vuln.severity})
                            </div>
                            <div class="wpm-item-meta">
                                <span class="label"><i class="fa fa-calendar"></i> ${vuln.date}</span>
                                <span class="label"><i class="fa fa-tag"></i> ${vuln.cve || 'N/A'}</span>
                            </div>
                        </div>
                    `;
                });
                html += '</div>';
                $('#wpm-vuln-content').html(html);
            }
        } else {
            noti_bubble(res.message || 'Error loading vulnerabilities', 'Error', 'error', true, false, '3000', true);
        }
    });
}

// ============================================================
// BACKUP
// ============================================================

function wpmBackup(path) {
    // Backup will be handled via direct link to /user_files module
    noti_bubble('Backup functionality is in development', 'Info', 'info', true, false, '3000', true);
}

// ============================================================
// CLONE
// ============================================================

function wpmOpenClone(path, domain, wpbd) {
    wpmCurrentPath = path;
    $('#wpm-modal-clone').modal('show');
    $('#wpm-clone-source').val(domain);
    wpmLoadDomains(path, domain, wpbd);
}

function wpmLoadDomains(path, currentDomain, currentWpbd) {
    $('#wpm-clone-domain').html('<option value="">' + (typeof langmod !== 'undefined' && langmod.WPM_CLONE_SELECT_DOMAIN) + '</option>');

    wpmAjax('list_domains', {}, function(res) {
        if (res.result === 'success' && res.domains) {
            res.domains.forEach(function(d) {
                const selected = d === currentDomain ? 'selected' : '';
                $('#wpm-clone-domain').append('<option value="' + d + '" ' + selected + '>' + d + '</option>');
            });
        } else {
            $('#wpm-clone-domain').html('<option value="">No domains available</option>');
        }
    });
}

// End of file
