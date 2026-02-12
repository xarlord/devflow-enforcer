/**
 * DevFlow Enforcer - Main Entry Point
 * Claude Code Marketplace Plugin
 *
 * This is the main entry point for the Claude Code plugin system.
 * It handles plugin activation and context initialization.
 */

const fs = require('fs');
const path = require('path');

// Load plugin manifest
const manifest = require('./claude.json');

class DevFlowPlugin {
    constructor() {
        this.manifest = manifest;
        this.context = {
            currentPhase: null,
            activeAgents: new Set(['project-lead']),
            loadedDocs: new Set(),
            contextUsage: 0
        };
    }

    /**
     * Activate the plugin for Claude Code
     */
    activate() {
        console.log('='.repeat(60));
        console.log(`DevFlow Enforcer v${this.manifest.version} Activated`);
        console.log(`Context Optimization: ~${this.manifest.capabilities.contextOptimization.savingsPercentage}% token savings`);
        console.log('='.repeat(60));

        // Notify user about activation
        console.log('');
        console.log('Plugin Capabilities:');
        console.log(`  - 14-Phase Workflow Enforcement`);
        console.log(`  - ${this.manifest.capabilities.agentSystem.totalAgents} Specialized Agents`);
        console.log(`  - Quality Gates: ${this.manifest.settings.qualityRequirements.coverageThreshold}% coverage, ${this.manifest.settings.qualityRequirements.passRateThreshold}% pass rate`);
        console.log(`  - Auto Context Pruning at ${this.manifest.settings.contextThreshold}% threshold`);
        console.log('');
        console.log('Plugin will auto-activate on software development tasks.');
    }

    /**
     * Handle context monitoring
     */
    monitorContext(usagePercentage) {
        const threshold = this.manifest.settings.contextThreshold;

        if (usagePercentage >= threshold) {
            console.warn(`⚠️  Context at ${usagePercentage}% - Pruning recommended`);
            return { shouldPrune: true, message: `Context usage at ${usagePercentage}% exceeds ${threshold}% threshold` };
        }

        return { shouldPrune: false, message: `Context at ${usagePercentage}% (threshold: ${threshold}%)` };
    }

    /**
     * Get plugin info for Claude Code
     */
    getInfo() {
        return {
            name: this.manifest.name,
            version: this.manifest.version,
            description: this.manifest.description,
            capabilities: this.manifest.capabilities,
            isActive: true
        };
    }
}

// Export for Claude Code plugin system
module.exports = {
    // Main plugin instance
    plugin: new DevFlowPlugin(),

    // Factory function
    create: function() {
        return new DevFlowPlugin();
    },

    // Manifest reference
    getManifest: function() {
        return manifest;
    }
};
