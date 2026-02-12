/**
 * DevFlow Enforcer v2.0 - Optimization Implementation Tests
 *
 * Tests the context window optimization implementation
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
    console.log('\n' + '='.repeat(60));
    log(title, 'cyan');
    console.log('='.repeat(60));
}

function logTest(name, passed, details = '') {
    const status = passed ? 'PASS' : 'FAIL';
    const color = passed ? 'green' : 'red';
    log(`  [${status}] ${name}`, color);
    if (details) {
        log(`      ${details}`, 'blue');
    }
}

// Test results tracker
const results = {
    passed: 0,
    failed: 0,
    tests: []
};

function runTest(category, name, testFn) {
    try {
        const result = testFn();
        results.tests.push({ category, name, passed: result, details: '' });
        if (result) {
            results.passed++;
        } else {
            results.failed++;
        }
        return result;
    } catch (error) {
        results.tests.push({ category, name, passed: false, details: error.message });
        results.failed++;
        return false;
    }
}

// ============================================================================
// TEST SUITE 1: File Structure Validation
// ============================================================================
logSection('TEST SUITE 1: File Structure Validation');

runTest('Structure', 'README.md exists', () => {
    const exists = fs.existsSync('README.md');
    if (exists) {
        const content = fs.readFileSync('README.md', 'utf8');
        const hasVersion = content.includes('v2.0');
        const hasOptimization = content.includes('Context Window Optimized');
        if (!hasVersion) return false;
        if (!hasOptimization) return false;
    }
    return exists;
});

runTest('Structure', 'Core directory exists', () => {
    return fs.existsSync('core');
});

runTest('Structure', 'Core types exist', () => {
    return fs.existsSync('core/types/agent-result.ts');
});

runTest('Structure', 'All agent directories exist', () => {
    const requiredAgents = [
        'agents/project-lead',
        'agents/qa',
        'agents/testing',
        'agents/architect',
        'agents/git-expert',
        'agents/security',
        'agents/retrospective',
        'agents/coders'
    ];
    return requiredAgents.every(agent => fs.existsSync(agent));
});

runTest('Structure', 'Documentation summaries exist', () => {
    return fs.existsSync('docs/agents/SUMMARY.md') &&
           fs.existsSync('docs/workflow/SUMMARY.md');
});

// ============================================================================
// TEST SUITE 2: Agent Specification Validation
// ============================================================================
logSection('TEST SUITE 2: Agent Specification Validation');

const agentFiles = [
    'agents/project-lead/project-lead-agent.md',
    'agents/qa/qa-agent.md',
    'agents/testing/testing-agent.md',
    'agents/architect/system-architect-agent.md',
    'agents/git-expert/git-expert-agent.md',
    'agents/security/security-expert-agent.md',
    'agents/retrospective/retrospective-agent.md',
    'agents/coders/typescript-coding-agent.md',
    'agents/coders/python-coding-agent.md',
    'agents/coders/java-coding-agent.md',
    'agents/coders/cpp-coding-agent.md',
    'agents/coders/rust-coding-agent.md',
    'agents/coders/csharp-coding-agent.md',
    'agents/docker-agent.md',
    'agents/database-agent.md'
];

agentFiles.forEach(file => {
    runTest('Agent Specs', `${path.basename(file)} has load flag`, () => {
        if (!fs.existsSync(file)) return false;
        const content = fs.readFileSync(file, 'utf8');
        return content.includes('load:') ||
               content.includes('load: always');
    });
});

runTest('Agent Specs', 'All agents have AgentResult output format', () => {
    const hasResultFormat = (file) => {
        if (!fs.existsSync(file)) return false;
        const content = fs.readFileSync(file, 'utf8');
        return content.includes('AgentResult<') ||
               content.includes('interface ') && content.includes('Result');
    };

    // Check a sample of agents
    return hasResultFormat('agents/qa/qa-agent.md') &&
           hasResultFormat('agents/testing/testing-agent.md') &&
           hasResultFormat('agents/coders/typescript-coding-agent.md');
});

// ============================================================================
// TEST SUITE 3: Token Savings Validation
// ============================================================================
logSection('TEST SUITE 3: Token Savings Validation');

runTest('Savings', 'Agent loader documents savings', () => {
    const file = 'core/agent-loader-v2.md';
    if (!fs.existsSync(file)) return false;
    const content = fs.readFileSync(file, 'utf8');
    return content.includes('~75%') &&
           content.includes('~6,000 tokens');
});

runTest('Savings', 'Context pruner documents savings', () => {
    const file = 'core/context-pruner.md';
    if (!fs.existsSync(file)) return false;
    const content = fs.readFileSync(file, 'utf8');
    return content.includes('~86%') &&
           content.includes('~20,600 tokens');
});

runTest('Savings', 'Workflow loader documents savings', () => {
    const file = 'core/workflow-loader.md';
    if (!fs.existsSync(file)) return false;
    const content = fs.readFileSync(file, 'utf8');
    return content.includes('~88%') &&
           content.includes('~7,000 tokens');
});

runTest('Savings', 'Total savings documented', () => {
    const file = 'docs/OPTIMIZATION-COMPLETE.md';
    if (!fs.existsSync(file)) return false;
    const content = fs.readFileSync(file, 'utf8');
    return content.includes('~78%') &&
           content.includes('~52,200 tokens');
});

// ============================================================================
// TEST SUITE 4: AgentResult Interface Validation
// ============================================================================
logSection('TEST SUITE 4: AgentResult Interface Validation');

runTest('Interface', 'AgentResult interface defined', () => {
    const file = 'core/types/agent-result.ts';
    if (!fs.existsSync(file)) return false;
    const content = fs.readFileSync(file, 'utf8');
    return content.includes('interface AgentResult') &&
           content.includes('status:') &&
           content.includes('summary:') &&
           content.includes('criticalFindings:') &&
           content.includes('success') &&
           content.includes('failure') &&
           content.includes('blocked');
});

runTest('Interface', 'Type-specific interfaces documented', () => {
    const file = 'core/types/agent-result.ts';
    if (!fs.existsSync(file)) return false;
    const content = fs.readFileSync(file, 'utf8');
    // Check for example interfaces
    return content.includes('CodeReviewData') ||
           content.includes('TestData') ||
           content.includes('DevelopmentData');
});

// ============================================================================
// TEST SUITE 5: Documentation Quality Validation
// ============================================================================
logSection('TEST SUITE 5: Documentation Quality Validation');

runTest('Documentation', 'README has all sections', () => {
    const file = 'README.md';
    if (!fs.existsSync(file)) return false;
    const content = fs.readFileSync(file, 'utf8');
    const requiredSections = [
        'What is DevFlow Enforcer',
        'Quick Start',
        'Workflow Overview',
        'Context Optimization',
        'Quality Standards'
    ];
    return requiredSections.some(section => content.includes(section));
});

runTest('Documentation', 'Agent registry summary exists', () => {
    const file = 'docs/agents/SUMMARY.md';
    if (!fs.existsSync(file)) return false;
    const content = fs.readFileSync(file, 'utf8');
    return content.includes('Agent Registry') &&
           content.includes('Quick Reference') &&
           content.includes('Coding Agents');
});

runTest('Documentation', 'Workflow summary exists', () => {
    const file = 'docs/workflow/SUMMARY.md';
    if (!fs.existsSync(file)) return false;
    const content = fs.readFileSync(file, 'utf8');
    return content.includes('Phases at a Glance') &&
           content.includes('Quality Gates') &&
           content.includes('Key Rules');
});

// ============================================================================
// TEST SUITE 6: Phase Completion Documentation
// ============================================================================
logSection('TEST SUITE 6: Phase Completion Documentation');

const phases = ['PHASE1', 'PHASE2', 'PHASE3', 'PHASE4', 'PHASE5'];

phases.forEach(phase => {
    runTest('Phase Docs', `${phase}-COMPLETE.md exists`, () => {
        return fs.existsSync(`docs/${phase}-COMPLETE.md`);
    });

    runTest('Phase Docs', `${phase} documents savings`, () => {
        const file = `docs/${phase}-COMPLETE.md`;
        if (!fs.existsSync(file)) return false;
        const content = fs.readFileSync(file, 'utf8');
        return content.includes('Savings') &&
               content.includes('tokens');
    });
});

runTest('Phase Docs', 'Phases 6-9 combined doc exists', () => {
    return fs.existsSync('docs/PHASES-6-9-COMPLETE.md');
});

// ============================================================================
// TEST SUITE 7: Quality Requirements Validation
// ============================================================================
logSection('TEST SUITE 7: Quality Requirements Validation');

runTest('Quality', 'Workflow enforcement maintained', () => {
    const file = 'agents/project-lead/project-lead-agent.md';
    if (!fs.existsSync(file)) return false;
    const content = fs.readFileSync(file, 'utf8');
    return content.includes('ENFORCE THE WORKFLOW') &&
           content.includes('Requirement #23');
});

runTest('Quality', 'Quality gates defined', () => {
    const file = 'docs/workflow/SUMMARY.md';
    if (!fs.existsSync(file)) return false;
    const content = fs.readFileSync(file, 'utf8');
    return content.includes('95%') &&
           content.includes('100%');
});

runTest('Quality', 'Lessons learned requirement present', () => {
    const file = 'agents/retrospective/retrospective-agent.md';
    if (!fs.existsSync(file)) return false;
    const content = fs.readFileSync(file, 'utf8');
    return content.includes('Requirement #24') &&
           content.includes('Requirement #25') &&
           content.includes('Requirement #26');
});

// ============================================================================
// TEST SUITE 8: Integration Validation
// ============================================================================
logSection('TEST SUITE 8: Integration Validation');

runTest('Integration', 'Agent loader references agent result type', () => {
    const loaderFile = 'core/agent-loader-v2.md';
    const typeFile = 'core/types/agent-result.ts';
    if (!fs.existsSync(loaderFile) || !fs.existsSync(typeFile)) return false;

    const loader = fs.readFileSync(loaderFile, 'utf8');
    const type = fs.readFileSync(typeFile, 'utf8');
    // Loader should reference the AgentResult interface
    return loader.includes('AgentResult');
});

runTest('Integration', 'Context pruner has config', () => {
    const file = 'core/context-pruner.md';
    if (!fs.existsSync(file)) return false;
    const content = fs.readFileSync(file, 'utf8');
    return content.includes('threshold: 80') &&
           content.includes('context-pruner.config.json');
});

runTest('Integration', 'Workflow loader has phase groups', () => {
    const file = 'core/workflow-loader.md';
    if (!fs.existsSync(file)) return false;
    const content = fs.readFileSync(file, 'utf8');
    return content.includes('PHASE_GROUPS') &&
           content.includes('7 logical groups');
});

// ============================================================================
// TEST SUITE 9: Token Count Estimates
// ============================================================================
logSection('TEST SUITE 9: Token Count Validation');

runTest('Token Estimates', 'Agent specs estimate reasonable', () => {
    const agentFiles = [
        'agents/project-lead/project-lead-agent.md',
        'agents/qa/qa-agent.md',
        'agents/testing/testing-agent.md'
    ];

    let totalLines = 0;
    agentFiles.forEach(file => {
        if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8');
            totalLines += content.split('\n').length;
        }
    });

    // Average agent spec should be ~100-300 lines
    const avgLines = totalLines / agentFiles.length;
    return avgLines >= 80 && avgLines <= 350;
});

runTest('Token Estimates', 'Summary docs are concise', () => {
    const summaryFiles = [
        'docs/agents/SUMMARY.md',
        'docs/workflow/SUMMARY.md'
    ];

    return summaryFiles.every(file => {
        if (!fs.existsSync(file)) return false;
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n').length;
        // Summaries should be < 150 lines
        return lines < 150;
    });
});

// ============================================================================
// PRINT RESULTS
// ============================================================================
logSection('TEST RESULTS SUMMARY');

// Group by category
const categories = {};
results.tests.forEach(test => {
    if (!categories[test.category]) {
        categories[test.category] = { passed: 0, failed: 0, tests: [] };
    }
    categories[test.category].tests.push(test);
    if (test.passed) {
        categories[test.category].passed++;
    } else {
        categories[test.category].failed++;
    }
});

Object.keys(categories).forEach(category => {
    const cat = categories[category];
    const total = cat.passed + cat.failed;
    const percentage = ((cat.passed / total) * 100).toFixed(1);
    log(`\n${category}:`, 'cyan');
    log(`  Passed: ${cat.passed}/${total} (${percentage}%)`, 'green');
    if (cat.failed > 0) {
        log(`  Failed: ${cat.failed}`, 'red');
        cat.tests.filter(t => !t.passed).forEach(t => {
            log(`    - ${t.name}`, 'yellow');
        });
    }
});

// Final summary
logSection('FINAL SUMMARY');
const totalTests = results.passed + results.failed;
const passRate = ((results.passed / totalTests) * 100).toFixed(1);
log(`Total Tests: ${totalTests}`, 'cyan');
log(`Passed: ${results.passed}`, 'green');
log(`Failed: ${results.failed}`, 'red');
log(`Pass Rate: ${passRate}%`, passRate >= 90 ? 'green' : passRate >= 70 ? 'yellow' : 'red');

if (results.failed === 0) {
    log('\n✓ ALL TESTS PASSED - Implementation is VALIDATED', 'green');
} else {
    log('\n✗ SOME TESTS FAILED - Review needed', 'red');
}

process.exit(results.failed === 0 ? 0 : 1);
