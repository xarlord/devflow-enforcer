/**
 * DevFlow Enforcer - Pre Uninstall Script
 *
 * Removes the plugin from Claude Code plugins directory
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
    log(`✓ ${message}`, 'green');
}

function logError(message) {
    log(`✗ ${message}`, 'red');
}

function logInfo(message) {
    log(`→ ${message}`, 'cyan');
}

function logStep(num, message) {
    console.log(`\n${colors.bold}${colors.blue}[${num}] ${message}${colors.reset}`);
}

// Get Claude Code plugins directory
function getClaudePluginsDir() {
    const platform = os.platform();
    const homeDir = os.homedir();

    if (platform === 'win32') {
        return path.join(homeDir, '.claude', 'plugins');
    } else {
        return path.join(homeDir, '.claude', 'plugins');
    }
}

// Remove directory recursively
function removeDirectory(dir) {
    if (fs.existsSync(dir)) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        entries.forEach(entry => {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                removeDirectory(fullPath);
            } else {
                fs.unlinkSync(fullPath);
            }
        });

        fs.rmdirSync(dir);
        return true;
    }
    return false;
}

// Main uninstallation process
function uninstall() {
    logStep(1, 'Detecting Claude Code plugins directory...');
    const claudePluginsDir = getClaudePluginsDir();
    log(`   Plugins directory: ${claudePluginsDir}`, 'blue');

    const pluginName = 'devflow-enforcer';
    const destDir = path.join(claudePluginsDir, pluginName);

    logStep(2, 'Checking if DevFlow Enforcer is installed...');
    if (!fs.existsSync(destDir)) {
        logError('DevFlow Enforcer is not installed!');
        log('');
        log('Nothing to uninstall.', 'yellow');
        process.exit(0);
    }

    logInfo(`Found installation at: ${destDir}`);

    logStep(3, 'Removing plugin files...');
    const removed = removeDirectory(destDir);

    if (removed) {
        logSuccess('Removed all plugin files');
    } else {
        logError('Failed to remove plugin files');
        process.exit(1);
    }

    log('');
    logSuccess('Uninstallation complete!');
    log('');
    logInfo('DevFlow Enforcer has been removed from Claude Code.');
    log('');
    log('You can now reinstall by running:', 'yellow');
    log('   npm install @xarlord/devflow-enforcer');
}

// Run uninstallation
try {
    uninstall();
} catch (error) {
    logError(`Uninstallation failed: ${error.message}`);
    console.error(error);
    process.exit(1);
}
