/**
 * WORDPRESS MANAGER - UI IMPROVEMENTS
 * CRITICAL FEATURES (PRIORIDAD 1)
 * Compatible con CWP Standard
 */

// ============================================
// CRITICAL #1: TOAST NOTIFICATIONS
// ============================================

const wpmNotify = {
    show: function(message, type = 'info', duration = 4000) {
        // Remove existing notifications
        $('.wpm-notification').remove();

        // Create notification
        const notif = $('<div>', {
            'class': 'wpm-notification wpm-notification-' + type,
            'html': `
                <i class="fa fa-${this.getIcon(type)}"></i>
                <span>${message}</span>
                <button class="close" onclick="$(this).parent().remove()">&times;</button>
            `
        });

        // Add to page (fixed to top-right)
        notif.css({
            'position': 'fixed',
            'top': '20px',
            'right': '20px',
            'z-index': '99999',
            'min-width': '300px',
            'padding': '15px 20px',
            'border-radius': '4px',
            'box-shadow': '0 4px 12px rgba(0,0,0,0.15)',
            'animation': 'wpmSlideIn 0.3s ease-out',
            'border-left': '5px solid'
        });

        // Set colors based on type
        switch(type) {
            case 'success':
                notif.css('border-left-color', '#27ae60');
                notif.find('i').css('color', '#27ae60');
                break;
            case 'error':
                notif.css('border-left-color', '#e74c3c');
                notif.find('i').css('color', '#e74c3c');
                break;
            case 'warning':
                notif.css('border-left-color', '#f39c12');
                notif.find('i').css('color', '#f39c12');
                break;
            case 'info':
                notif.css('border-left-color', '#3498db');
                notif.find('i').css('color', '#3498db');
                break;
        }

        // Add styles if not exists
        if (!$('#wpm-notify-styles').length) {
            $('<style>', {
                'id': 'wpm-notify-styles',
                'html': `
                    @keyframes wpmSlideIn {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                    @keyframes wpmSlideOut {
                        from {
                            transform: translateX(0);
                            opacity: 1;
                        }
                        to {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                    }
                `
            }).appendTo('head');
        }

        $('body').append(notif);

        // Auto remove
        setTimeout(function() {
            notif.css('animation', 'wpmSlideOut 0.3s ease-in');
            setTimeout(function() {
                notif.remove();
            }, 300);
        }, duration);
    },

    getIcon: function(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'times-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    },

    success: function(message) {
        this.show(message, 'success');
    },

    error: function(message) {
        this.show(message, 'error');
    },

    warning: function(message) {
        this.show(message, 'warning');
    },

    info: function(message) {
        this.show(message, 'info');
    }
};

// ============================================
// CRITICAL #2: CONFIRMATION MODAL
// ============================================

const wpmConfirmUI = {
    title: '',
    message: '',
    icon: 'question-circle',
    onConfirm: null,

    show: function(title, message, icon = 'question-circle', onConfirm) {
        this.title = title;
        this.message = message;
        this.icon = icon;
        this.onConfirm = onConfirm;

        // Set content
        $('#wpmConfirmTitle').text(title);
        $('#wpmConfirmMessage').text(message);
        $('#wpmConfirmIcon').attr('class', 'fa fa-' + icon);

        // Show modal
        $('#wpmConfirmModal').modal('show');
    },

    ok: function() {
        if (this.onConfirm) {
            this.onConfirm();
        }
        this.close();
    },

    close: function() {
        $('#wpmConfirmModal').modal('hide');
    }
};

// ============================================
// CRITICAL #3: ENHANCED EMPTY STATE
// ============================================

function wpmEnhanceEmptyState() {
    // Check if there are installations
    const installations = wpm_installations;
    const emptyState = $('#wpm-empty-state');

    if (installations && installations.length > 0) {
        // Hide empty state
        emptyState.hide();
        return;
    }

    // Show empty state
    emptyState.fadeIn(300);
}

// ============================================
// CRITICAL #4: SEARCH WITH DEBOUNCE
// ============================================

let wpmSearchTimeout = null;

function wpmSearchInstallations(query) {
    // Debounce the search
    clearTimeout(wpmSearchTimeout);

    wpmSearchTimeout = setTimeout(function() {
        wpmSearchInstallationsDebounced(query);
    }, 300);
}

function wpmSearchInstallationsDebounced(query) {
    if (!query) {
        // Show all installations
        $('.wpm-card').show();
        return;
    }

    const lowerQuery = query.toLowerCase();
    let foundCount = 0;

    // Search in each card
    $('.wpm-card').each(function() {
        const card = $(this);
        const name = card.data('name') || '';
        const domain = card.data('domain') || '';
        const tags = card.data('tags') || '';
        const path = card.data('path') || '';

        const matchName = name.toLowerCase().includes(lowerQuery);
        const matchDomain = domain.toLowerCase().includes(lowerQuery);
        const matchTags = tags.toLowerCase().includes(lowerQuery);
        const matchPath = path.toLowerCase().includes(lowerQuery);

        if (matchName || matchDomain || matchTags || matchPath) {
            card.show();
            foundCount++;
        } else {
            card.hide();
        }
    });

    // Show empty message if no results
    const grid = $('#wpm-installations-grid');
    if (foundCount === 0) {
        grid.html(`
            <div class="col-12 text-center" style="padding: 60px 20px;">
                <i class="fa fa-search" style="font-size: 64px; color: #bdc3c7;"></i>
                <h3>No results found</h3>
                <p class="text-muted">Try different keywords</p>
            </div>
        `);
    } else {
        // Restore original content
        wpmPopulateInstallations();
    }
}

// ============================================
// CRITICAL #4b: FILTER BY STATUS
// ============================================

function wpmFilterByStatus(status) {
    $('.wpm-card').each(function() {
        const card = $(this);
        const cardStatus = card.data('status') || 'healthy';

        if (status === 'all') {
            card.show();
        } else if (status === 'vulnerable') {
            card.toggle(cardStatus === 'vulnerable');
        } else if (status === 'updates') {
            const hasUpdate = card.data('has-update') === 'true';
            card.toggle(hasUpdate);
        } else if (status === 'broken') {
            card.toggle(cardStatus === 'broken');
        } else if (status === 'healthy') {
            card.toggle(cardStatus === 'healthy');
        }
    });
}

// ============================================
// CRITICAL #4c: FILTER BY BACKUP STATUS
// ============================================

function wpmFilterByBackup(status) {
    $('.wpm-card').each(function() {
        const card = $(this);
        const backupStatus = card.data('backup-status') || 'unknown';

        if (status === 'all') {
            card.show();
        } else if (status === 'backed-up') {
            card.toggle(backupStatus === 'success');
        } else if (status === 'not-backed') {
            card.toggle(backupStatus === 'pending');
        } else if (status === 'failed') {
            card.toggle(backupStatus === 'failed');
        }
    });
}

// ============================================
// CRITICAL #4d: FILTER BY TAG
// ============================================

function wpmFilterByTag(tag) {
    $('.wpm-card').each(function() {
        const card = $(this);
        const cardTags = card.data('tags') || '';

        if (tag === 'all') {
            card.show();
        } else {
            card.toggle(cardTags.includes(tag));
        }
    });
}

// ============================================
// CRITICAL #4e: UPDATE ALL INSTALLATIONS
// ============================================

function wpmUpdateAll() {
    let updatedCount = 0;
    let failedCount = 0;

    $('.wpm-card').each(function() {
        const card = $(this);
        const name = card.data('name') || '';
        const path = card.data('path') || '';

        wpmCheckUpdates(path, null, function() {
            updatedCount++;
            if (updatedCount + failedCount >= wpm_installations.length) {
                // All updates complete
                wpmNotify.success('Updates completed: ' + updatedCount + ' installed, ' + failedCount + ' failed');
            }
        }, function() {
            failedCount++;
            if (updatedCount + failedCount >= wpm_installations.length) {
                // All updates complete
                wpmNotify.error('Updates completed: ' + updatedCount + ' installed, ' + failedCount + ' failed');
            }
        });
    });
}

// ============================================
// CRITICAL #4f: POPULATE INSTALLATIONS GRID
// ============================================

function wpmPopulateInstallations() {
    const grid = $('#wpm-installations-grid');
    grid.empty();

    if (wpm_installations.length === 0) {
        wpmEnhanceEmptyState();
        return;
    }

    // Populate grid with installations
    wpm_installations.forEach(function(inst) {
        grid.append(wpmCreateInstallationCard(inst));
    });

    // Show grid
    grid.show();
}

// ============================================
// CRITICAL #4g: CREATE INSTALLATION CARD
// ============================================

function wpmCreateInstallationCard(inst) {
    const hasUpdate = inst.core_update || inst.plugin_updates > 0 || inst.theme_updates > 0;
    const encodedUrl = encodeURIComponent(inst.url || '');
    const previewSrc = inst.url ? 'https://s0.wp.com/mshots/v1/' + encodedUrl + '?w=320&h=240' : '';
    const statusClass = inst.status || 'active';
    const name = inst.name || inst.domain || 'WordPress';
    const tags = inst.tags ? inst.tags.join(', ') : '';

    let badgesHtml = '';
    if (inst.core_update) {
        badgesHtml += `<span class="badge badge-warning"><i class="fa fa-arrow-up"></i> WP</span>`;
    }
    if (inst.plugin_updates > 0) {
        badgesHtml += `<span class="badge badge-warning" onclick="wpmOpenPlugins('${inst.path}')"><i class="fa fa-plug"></i> ${inst.plugin_updates}</span>`;
    }
    if (inst.theme_updates > 0) {
        badgesHtml += `<span class="badge badge-warning" onclick="wpmOpenThemes('${inst.path}')"><i class="fa fa-paint-brush"></i> ${inst.theme_updates}</span>`;
    }
    if (inst.vulnerabilities > 0) {
        badgesHtml += `<span class="badge badge-danger" onclick="wpmOpenVulnerabilities('${inst.path}')" style="cursor:pointer;"><i class="fa fa-bug"></i> ${inst.vulnerabilities}</span>`;
    }

    return `
        <div class="wpm-install-col" data-path="${inst.path}" data-domain="${inst.domain}" data-tags="${tags}">
            <div class="wpm-card wpm-card-${statusClass}" data-path="${inst.path}" data-domain="${inst.domain}" data-wpbd="${inst.wpbd || ''}">

                <!-- Preview Thumbnail -->
                <div class="wpm-card-preview">
                    ${previewSrc
                        ? `<img src="${previewSrc}" alt="${inst.domain} preview" class="wpm-preview-loading"
                               onload="this.classList.remove('wpm-preview-loading');this.classList.add('wpm-preview-loaded');"
                               onerror="this.parentElement.innerHTML='<div class=\\'wpm-card-preview-placeholder\\'><i class=\\'fa fa-globe\\'></i><span>Preview</span></div>';"
                               loading="lazy">`
                        : `<div class="wpm-card-preview-placeholder"><i class="fa fa-globe"></i><span>Preview</span></div>`
                    }
                </div>

                <!-- Identity -->
                <div class="wpm-card-identity">
                    <div class="wpm-identity-top">
                        <div class="wpm-card-icon">
                            <i class="fa fa-wordpress wpm-icon-wordpress"></i>
                            ${statusClass === 'broken' ? '<i class="fa fa-exclamation-triangle wpm-icon-broken" title="Broken"></i>' : ''}
                        </div>
                        <div class="wpm-card-title">
                            <h4 class="wpm-card-name">${name}</h4>
                            <a href="${inst.url}" target="_blank" class="wpm-card-domain" title="${inst.url}">${inst.domain}</a>
                            ${inst.path ? `<span class="wpm-card-path" title="${inst.path}">${inst.path}</span>` : ''}
                        </div>
                    </div>
                    <div class="wpm-identity-meta">
                        <span class="wpm-meta-item"><strong>Version</strong> ${inst.version}</span>
                        <span class="wpm-meta-sep">&middot;</span>
                        <span class="wpm-meta-item"><strong>PHP</strong> ${inst.php_version}</span>
                    </div>
                    ${badgesHtml ? `<div class="wpm-identity-badges">${badgesHtml}</div>` : ''}
                </div>

                <!-- Stats -->
                <div class="wpm-card-stats">
                    <div class="wpm-stat-mini" onclick="wpmOpenPlugins('${inst.path}')" title="Plugins">
                        <span class="wpm-stat-mini-num">${inst.plugins_count || 0}</span>
                        <span class="wpm-stat-mini-label">Plugins</span>
                    </div>
                    <div class="wpm-stat-mini" onclick="wpmOpenThemes('${inst.path}')" title="Themes">
                        <span class="wpm-stat-mini-num">${inst.themes_count || 0}</span>
                        <span class="wpm-stat-mini-label">Themes</span>
                    </div>
                </div>

                <!-- Toolbar -->
                <div class="wpm-card-toolbar">
                    <button class="wpm-btn-icon" onclick="wpmOpenPreview('${inst.url}', '${inst.domain}', '${inst.path}')" title="Preview">
                        <i class="fa fa-eye"></i>
                    </button>
                    <button class="wpm-btn-icon" onclick="wpmOpenLogin('${inst.url}', '${inst.domain}', '${inst.path}')" title="Login">
                        <i class="fa fa-sign-in"></i>
                    </button>
                    <button class="wpm-btn-icon" onclick="wpmCheckUpdates('${inst.path}', this)" title="Check Updates">
                        <i class="fa fa-refresh"></i>
                    </button>
                    <button class="wpm-btn-icon" onclick="wpmOpenSecurity('${inst.path}')" title="Security">
                        <i class="fa fa-shield"></i>
                    </button>
                    <button class="wpm-btn-icon" onclick="wpmBackup('${inst.path}')" title="Backup">
                        <i class="fa fa-download"></i>
                    </button>
                    <div class="wpm-toolbar-separator"></div>
                    <div class="wpm-toolbar-dropdown" data-path="${inst.path}" data-domain="${inst.domain}" data-wpbd="${inst.wpbd || ''}" data-url="${inst.url}">
                        <button class="wpm-btn-icon" onclick="wpmToggleDropdown(this)" title="More Actions">
                            <i class="fa fa-ellipsis-v"></i>
                        </button>
                        <ul class="wpm-dropdown-menu">
                            <li><a onclick="wpmOpenFiles('${inst.path}')"><i class="fa fa-file-code-o"></i> Files</a></li>
                            <li><a onclick="wpmOpenDbTools('${inst.path}')"><i class="fa fa-database"></i> Database</a></li>
                            <li><a onclick="wpmOpenProtection('${inst.path}')"><i class="fa fa-lock"></i> Protection</a></li>
                            <li><a onclick="wpmOpenVulnerabilities('${inst.path}')"><i class="fa fa-bug"></i> Vulnerabilities</a></li>
                            <li><a onclick="wpmOpenClone('${inst.path}','${inst.domain}','${inst.wpbd || ''}')"><i class="fa fa-copy"></i> Clone</a></li>
                            <li class="wpm-dropdown-divider"></li>
                            <li><a class="wpm-dropdown-danger" onclick="wpmConfirmRemove(this)"><i class="fa fa-trash"></i> Remove</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// INITIALIZATION
// ============================================

$(document).ready(function() {
    // Enhance empty state
    wpmEnhanceEmptyState();

    // Show modal on load if needed
    if ($('#wpmConfirmModal').length) {
        $('#wpmConfirmModal').on('hidden.bs.modal', function() {
            // Reset on close
            wpmConfirmUI.close();
        });
    }
});
