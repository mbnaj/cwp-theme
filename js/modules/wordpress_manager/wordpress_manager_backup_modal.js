/**
 * WORDPRESS MANAGER - BACKUP MODAL FUNCTIONALITY
 * IMPORTANT #5: Complete Backup Modal
 */

// ============================================
// BACKUP MODAL - FUNCTIONALITY
// ============================================

let wpmCurrentBackupPath = '';
let wpmCurrentBackupDate = '';

// ============================================
// OPEN BACKUP MODAL
// ============================================

function wpmOpenBackupModal(path, domain) {
    wpmCurrentBackupPath = path;
    wpmCurrentBackupDate = '';

    // Update modal title with domain
    $('#wpm-modal-backup .modal-title').html(
        '<i class="fa fa-cloud-download-alt"></i> Backup WordPress: ' + domain
    );

    // Reset UI
    $('#wpm-backup-progress-section').hide();
    $('#wpm-backup-start-btn').prop('disabled', false).html(
        '<i class="fa fa-download"></i> Start Backup'
    );
    $('#wpm-backup-percent').text('0%');
    $('#wpm-backup-progress-bar').css('width', '0%');

    // Load backup list
    wpmLoadBackupList(path);

    // Show modal
    $('#wpm-modal-backup').modal('show');
}

// ============================================
// LOAD BACKUP LIST
// ============================================

function wpmLoadBackupList(path) {
    $('#wpm-backup-list').html('<tr><td colspan="4" class="text-center"><i class="fa fa-circle-o-notch fa-spin"></i> Loading backups...</td></tr>');

    wpmAjax('list_backups', {
        path: path
    }, function(res) {
        if (res.success && res.backups) {
            const backups = res.backups;
            const tbody = $('#wpm-backup-list');

            if (backups.length === 0) {
                tbody.html(`
                    <tr>
                        <td colspan="4" class="text-center">
                            <div class="alert alert-info">
                                <i class="fa fa-info-circle"></i> No backups found. Click "Start Backup" to create one.
                            </div>
                        </td>
                    </tr>
                `);
            } else {
                let html = '';
                backups.forEach(function(backup) {
                    const typeClass = backup.type === 'full' ? 'badge-success' : 'badge-info';
                    html += `
                        <tr>
                            <td>${backup.date}</td>
                            <td><span class="badge ${typeClass}">${backup.type}</span></td>
                            <td>${backup.size}</td>
                            <td>
                                <button class="btn btn-xs btn-primary" onclick="wpmRestoreBackup('${path}', '${backup.type}', '${backup.date}')">
                                    <i class="fa fa-undo"></i> Restore
                                </button>
                                <button class="btn btn-xs btn-danger" onclick="wpmConfirmDeleteBackup('${backup.date}')">
                                    <i class="fa fa-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                    `;
                });
                tbody.html(html);
            }
        } else {
            $('#wpm-backup-list').html(`
                <tr>
                    <td colspan="4" class="text-center">
                        <div class="alert alert-danger">
                            <i class="fa fa-exclamation-triangle"></i> Error loading backups: ${res.message || 'Unknown error'}
                        </div>
                    </td>
                </tr>
            `);
        }
    });
}

// ============================================
// START BACKUP
// ============================================

function wpmStartBackup() {
    // Show progress section
    $('#wpm-backup-progress-section').show();

    // Disable start button
    $('#wpm-backup-start-btn').prop('disabled', true).html(
        '<i class="fa fa-spinner fa-spin"></i> Starting...'
    );

    // Update timestamp
    const now = new Date();
    const timestamp = now.toLocaleString();
    $('#wpm-backup-timestamp').text('Started: ' + timestamp);

    // Start backup
    wpmAjax('create_backup', {
        path: wpmCurrentBackupPath
    }, function(res) {
        if (res.success) {
            wpmNotify.success('Backup started successfully');

            // Poll for backup progress
            wpmPollBackupProgress(wpmCurrentBackupPath);

            // Refresh backup list every 30 seconds
            wpmBackupRefreshInterval = setInterval(function() {
                wpmLoadBackupList(wpmCurrentBackupPath);
            }, 30000);

        } else {
            wpmNotify.error('Failed to start backup: ' + (res.message || 'Unknown error'));

            // Reset UI
            $('#wpm-backup-start-btn').prop('disabled', false).html(
                '<i class="fa fa-download"></i> Start Backup'
            );

            $('#wpm-backup-progress-section').hide();
        }
    }, function(res) {
        wpmNotify.error('Error starting backup: ' + (res.message || 'Unknown error'));

        // Reset UI
        $('#wpm-backup-start-btn').prop('disabled', false).html(
            '<i class="fa fa-download"></i> Start Backup'
        );

        $('#wpm-backup-progress-section').hide();
    });
}

// ============================================
// POLL BACKUP PROGRESS
// ============================================

let wpmBackupPollInterval = null;
let wpmBackupRefreshInterval = null;

function wpmPollBackupProgress(path) {
    if (wpmBackupPollInterval) {
        clearInterval(wpmBackupPollInterval);
    }

    wpmBackupPollInterval = setInterval(function() {
        wpmAjax('backup_progress', {
            path: path
        }, function(res) {
            if (res.success && res.progress) {
                const progress = res.progress;
                $('#wpm-backup-percent').text(progress.percent + '%');
                $('#wpm-backup-progress-bar').css('width', progress.percent + '%');
                $('#wpm-backup-status').text(progress.status);

                if (progress.percent >= 100) {
                    // Backup complete
                    clearInterval(wpmBackupPollInterval);
                    clearInterval(wpmBackupRefreshInterval);

                    wpmNotify.success('Backup completed successfully!');

                    // Refresh backup list
                    wpmLoadBackupList(path);
                }
            }
        });
    }, 1000); // Poll every 1 second
}

// ============================================
// RESTORE BACKUP
// ============================================

function wpmRestoreBackup(path, type, date) {
    wpmConfirmUI.show(
        'Restore WordPress Backup?',
        'This will restore WordPress from backup "' + type + ' - ' + date + '". All current data will be overwritten.',
        'undo',
        function() {
            // Confirm restoration
            wpmNotify.warning('Restoring backup: ' + type + ' - ' + date);

            wpmAjax('restore_backup', {
                path: path,
                type: type,
                date: date
            }, function(res) {
                if (res.success) {
                    wpmNotify.success('Backup restored successfully!');
                    $('#wpm-modal-backup').modal('hide');
                } else {
                    wpmNotify.error('Failed to restore backup: ' + (res.message || 'Unknown error'));
                }
            });
        }
    );
}

// ============================================
// CONFIRM DELETE BACKUP
// ============================================

function wpmConfirmDeleteBackup(date) {
    wpmConfirmUI.show(
        'Delete Backup?',
        'Are you sure you want to delete backup "' + date + '"? This action cannot be undone.',
        'trash',
        function() {
            // Delete backup
            wpmNotify.warning('Deleting backup: ' + date);

            wpmAjax('delete_backup', {
                date: date
            }, function(res) {
                if (res.success) {
                    wpmNotify.success('Backup deleted successfully!');
                    wpmLoadBackupList(wpmCurrentBackupPath);
                } else {
                    wpmNotify.error('Failed to delete backup: ' + (res.message || 'Unknown error'));
                }
            });
        }
    );
}

// ============================================
// CLOSE BACKUP MODAL
// ============================================

function wpmCloseModal(modalId) {
    // Clear intervals
    if (wpmBackupPollInterval) {
        clearInterval(wpmBackupPollInterval);
    }
    if (wpmBackupRefreshInterval) {
        clearInterval(wpmBackupRefreshInterval);
    }

    // Close modal
    $('#' + modalId).modal('hide');
}

// ============================================
// WPM BACKUP STATUS FUNCTIONALITY
// ============================================

function wpmBackupStatus(path) {
    wpmAjax('backup_status', {
        path: path
    }, function(res) {
        if (res.success) {
            // Update last backup info
            if (res.last_backup) {
                $('#wpm-last-backup').text(res.last_backup);
            }

            // Update backup status badge
            const statusBadge = $('#wpm-backup-status');
            if (res.status === 'success') {
                statusBadge.removeClass('badge-danger')
                           .addClass('badge-success')
                           .html('<i class="fa fa-check"></i> OK');
            } else {
                statusBadge.removeClass('badge-success')
                           .addClass('badge-danger')
                           .html('<i class="fa fa-times"></i> Failed');
            }
        }
    });
}

// ============================================
// INITIALIZE BACKUP MODAL
// ============================================

$(document).ready(function() {
    // Initialize backup modal on click
    $(document).on('click', '.wpm-backup-btn', function() {
        const path = $(this).data('path');
        const domain = $(this).data('domain');
        wpmOpenBackupModal(path, domain);
    });

    // Update backup status on modal close
    $('#wpm-modal-backup').on('hidden.bs.modal', function() {
        if (wpmCurrentBackupPath) {
            wpmBackupStatus(wpmCurrentBackupPath);
        }
    });
});

// ============================================
// BACKUP MODAL HELPER FUNCTIONS
// ============================================

/**
 * Get file size in human readable format
 */
function wpmFormatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get backup type icon
 */
function wpmGetBackupTypeIcon(type) {
    if (type === 'full') {
        return 'fa-check-circle';
    } else {
        return 'fa-clock';
    }
}

/**
 * Get backup type color
 */
function wpmGetBackupTypeColor(type) {
    if (type === 'full') {
        return '#27ae60';
    } else {
        return '#3498db';
    }
}
