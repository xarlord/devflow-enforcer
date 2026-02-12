/**
 * DevFlow Enforcer - Post Install Script
 *
 * Installs the plugin to Claude Code plugins directory
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

// Get Claude Code plugins directory based on OS
function getClaudePluginsDir() {
    const platform = os.platform();
    const homeDir = os.homedir();

    if (platform === 'win32') {
        // Windows: %USERPROFILE%\.claude\plugins\
        return path.join(homeDir, '.claude', 'plugins');
    } else {
        // macOS/Linux: ~/.claude/plugins/
        return path.join(homeDir, '.claude', 'plugins');
    }
}

// Get the project root (where package.json is located)
function getProjectRoot() {
    // In postinstall, __dirname will be in node_modules/package-name
    return path.resolve(__dirname, '..');
}

// Copy directory recursively
function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    entries.forEach(entry => {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

// Main installation process
function install() {
    logStep(1, 'Detecting Claude Code plugins directory...');
    const claudePluginsDir = getClaudePluginsDir();
    log(`   Plugins directory: ${claudePluginsDir}`, 'blue');

    logStep(2, 'Locating DevFlow Enforcer files...');
    const projectRoot = getProjectRoot();
    log(`   Project root: ${projectRoot}`, 'blue');

    const pluginName = 'devflow-enforcer';
    const destDir = path.join(claudePluginsDir, pluginName);

    // Check if plugin is already installed
    if (fs.existsSync(destDir)) {
        logError('DevFlow Enforcer is already installed!');
        log('');
        log('To reinstall, first uninstall:', 'yellow');
        log(`   npm uninstall @xarlord/devflow-enforcer`);
        log(`   npm install @xarlord/devflow-enforcer`);
        process.exit(1);
    }

    logStep(3, 'Creating plugin directory...');
    fs.mkdirSync(destDir, { recursive: true });
    logSuccess(`Created: ${destDir}`);

    logStep(4, 'Copying plugin files...');
    const itemsToCopy = [
        { src: 'agents', desc: 'Agent specifications' },
        { src: 'core', desc: 'Core infrastructure' },
        { src: 'docs', desc: 'Documentation' },
        { src: 'README.md', desc: 'Main readme' },
        { src: 'LICENSE', desc: 'License file' }
    ];

    itemsToCopy.forEach(item => {
        const srcPath = path.join(projectRoot, item.src);
        const destPath = path.join(destDir, item.src);

        if (fs.existsSync(srcPath)) {
            copyDirectory(srcPath, destPath);
            logSuccess(`Copied: ${item.desc} (${item.src})`);
        } else {
            log(`Warning: ${item.src} not found, skipping...`, 'yellow');
        }
    });

    logStep(5, 'Creating installation marker...');
    const markerPath = path.join(destDir, '.installed');
    fs.writeFileSync(markerPath, new Date().toISOString());
    logSuccess('Created installation marker');

    log('');
    logSuccess('Installation complete!');
    log('');
    logInfo('DevFlow Enforcer has been installed to Claude Code plugins directory.');
    log('');
    log('To verify installation:', 'yellow');
    log('   1. Restart Claude Code');
    log('   2. Run: npm run verify');
    log('');
    log('Plugin will activate automatically on next software development task.');
}

// Run installation
try {
    install();
} catch (error) {
    logError(`Installation failed: ${error.message}`);
    console.error(error);
    process.exit(1);
}
