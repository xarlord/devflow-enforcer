/**
 * DevFlow Enforcer - Verification Script
 *
 * Verifies that the plugin is correctly installed
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

// Get the project root (where package.json is located)
function getProjectRoot() {
    // In verify (running from node_modules), go up two levels
    return path.resolve(__dirname, '..', '..');
}

// Check if a file/directory exists
function checkExists(filePath, label, required = true) {
    const exists = fs.existsSync(filePath);
    const status = exists ? 'exists' : 'MISSING';
    const color = exists ? 'green' : (required ? 'red' : 'yellow');
    log(`  [${status}] ${label}: ${filePath}`, color);
    return exists;
}

// Count files in directory
function countFiles(dir, pattern) {
    try {
        const files = fs.readdirSync(dir);
        const matched = files.filter(f => f.match(pattern));
        return matched.length;
    } catch {
        return 0;
    }
}

// Verification checks
const checks = {
    passed: 0,
    failed: 0,
    warnings: 0
};

function recordCheck(passed, required = true) {
    if (passed) {
        checks.passed++;
    } else if (required) {
        checks.failed++;
    } else {
        checks.warnings++;
    }
}

// Main verification process
function verify() {
    logStep(1, 'Verifying installation...');
    const claudePluginsDir = getClaudePluginsDir();
    const pluginDir = path.join(claudePluginsDir, 'devflow-enforcer');

    logInfo(`Plugin directory: ${pluginDir}`);

    if (!fs.existsSync(pluginDir)) {
        logError('DevFlow Enforcer is NOT installed!');
        logInfo('Run: npm install @xarlord/devflow-enforcer');
        process.exit(1);
    }

    logSuccess('Plugin directory exists');

    logStep(2, 'Verifying core components...');

    // Check installation marker
    log('');
    log('Installation Status:', 'cyan');
    const markerPath = path.join(pluginDir, '.installed');
    if (checkExists(markerPath, 'Installation marker')) {
        const installedDate = fs.readFileSync(markerPath, 'utf8');
        log(`  Installed: ${new Date(installedDate).toLocaleString()}`, 'green');
        recordCheck(true);
    } else {
        recordCheck(false);
    }

    // Check agents directory
    log('');
    log('Agent Specifications:', 'cyan');
    const agentsDir = path.join(pluginDir, 'agents');
    if (checkExists(agentsDir, 'agents/ directory')) {
        const agentCount = countFiles(agentsDir, /.*-agent\.md$/);
        log(`  Agents found: ${agentCount} agent specs`, 'green');
        recordCheck(agentCount >= 15);
    }

    // Check core directory
    log('');
    log('Core Infrastructure:', 'cyan');
    const coreDir = path.join(pluginDir, 'core');
    if (checkExists(coreDir, 'core/ directory')) {
        const coreFiles = ['agent-loader-v2.md', 'context-pruner.md', 'workflow-loader.md'];
        let allPresent = true;
        coreFiles.forEach(file => {
            const filePath = path.join(coreDir, file);
            if (checkExists(filePath, `  core/${file}`, false)) {
                allPresent = allPresent && false;
            }
        });
        recordCheck(allPresent);

        // Check for types directory
        const typesDir = path.join(coreDir, 'types');
        if (checkExists(typesDir, '  core/types/')) {
            const agentResultFile = path.join(typesDir, 'agent-result.ts');
            checkExists(agentResultFile, '    agent-result.ts', false);
        }
    }

    // Check documentation
    log('');
    log('Documentation:', 'cyan');
    const docsDir = path.join(pluginDir, 'docs');
    if (checkExists(docsDir, 'docs/ directory')) {
        const docFiles = ['agents/SUMMARY.md', 'workflow/SUMMARY.md', 'OPTIMIZATION-COMPLETE.md'];
        docFiles.forEach(file => {
            const filePath = path.join(docsDir, file);
            checkExists(filePath, `  docs/${file}`, false);
        });
    }

    // Check main files
    log('');
    log('Root Files:', 'cyan');
    const rootFiles = ['README.md', 'LICENSE', 'INSTALL-WORKFLOW.md'];
    rootFiles.forEach(file => {
        const filePath = path.join(pluginDir, file);
        checkExists(filePath, `  ${file}`, false);
    });

    // Summary
    logStep(3, 'Verification summary...');
    const total = checks.passed + checks.failed + checks.warnings;
    const passRate = ((checks.passed / total) * 100).toFixed(1);

    log('');
    log('Results:', 'cyan');
    log(`  Total checks: ${total}`, 'blue');
    log(`  Passed: ${checks.passed}`, 'green');
    if (checks.failed > 0) {
        log(`  Failed: ${checks.failed}`, 'red');
    }
    if (checks.warnings > 0) {
        log(`  Warnings: ${checks.warnings}`, 'yellow');
    }
    log(`  Pass rate: ${passRate}%`, 'green');

    // Test execution
    log('');
    log('Running test suite...', 'cyan');
    const projectRoot = getProjectRoot();
    const testScript = path.join(projectRoot, 'tests', 'test-optimization.js');

    if (fs.existsSync(testScript)) {
        logInfo('Executing: node tests/test-optimization.js');
        const { execSync } = require('child_process');
        try {
            execSync('node "' + testScript + '"', { stdio: 'inherit' });
            logSuccess('All tests passed!');
        } catch (error) {
            logError('Tests failed!');
            recordCheck(false);
        }
    } else {
        log('  Test script not found, skipping...', 'yellow');
        recordCheck(false, false);
    }

    // Final result
    logStep(4, 'Final verdict...');
    log('');

    if (checks.failed === 0) {
        logSuccess('Installation verified successfully!');
        log('');
        logInfo('DevFlow Enforcer v2.0 is ready to use.');
        logInfo('Restart Claude Code to activate the plugin.');
        process.exit(0);
    } else {
        logError('Verification failed - some components are missing!');
        logInfo('Please reinstall: npm install @xarlord/devflow-enforcer --force');
        process.exit(1);
    }
}

// Run verification
try {
    verify();
} catch (error) {
    logError(`Verification failed: ${error.message}`);
    console.error(error);
    process.exit(1);
}
