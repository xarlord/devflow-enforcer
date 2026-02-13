/**
 * TOON (Token Oriented Object Notation) Type Definitions
 *
 * Defines TypeScript interfaces for all TOON objects used in DevFlow Enforcer
 * @version 2.1.0
 */

/**
 * Base Document Object
 * All TOON documents must inherit from this interface
 */
export interface TOONDocument {
  /** Unique identifier for the document */
  name: string;

  /** Human-readable description of what this document contains */
  description: string;

  /** Document version following semantic versioning */
  version: string;

  /** Current status of the document */
  status: "draft" | "active" | "deprecated" | "superseded";

  /** ISO 8601 creation timestamp */
  created_at: string;

  /** Last update timestamp */
  updated_at: string;

  /** Optional tags for categorization and search */
  tags: string[];
}

/**
 * Phase Object
 * Represents a phase in DevFlow workflow or a roadmap phase
 * Phases have timelines and dependencies
 */
export interface TOONPhase {
  /** Unique identifier - typically "phase1", "phase2", etc. */
  name: string;

  /** Human-readable description */
  description: string;

  /** Phase version */
  version: string;

  /** Timeline information */
  timeline: string;

  /** Priority level */
  priority: "high" | "medium" | "low";

  /** Start date (ISO 8601) */
  start_date: string;

  /** Target end date (ISO 8601) */
  target_date: string;

  /** References to features that belong to this phase */
  features: string[];

  /** Success criteria for this phase */
  success_criteria?: TOONSuccessCriteria;
}

/**
 * Feature Object
 * Represents a feature or deliverable within a phase
 */
export interface TOONFeature {
  /** Unique identifier */
  name: string;

  /** Human-readable description */
  description: string;

  /** Priority level */
  priority: "high" | "medium" | "low";

  /** Estimated effort (could be time, story points, etc.) */
  effort: string;

  /** Team size required (1=small, 2=medium, 3=large) */
  team: string;

  /** Current status */
  status: "planned" | "in-progress" | "completed" | "blocked" | "cancelled";

  /** Which phase this feature belongs to */
  phase: string;

  /** References to user stories */
  user_stories: string[];

  /** References to acceptance criteria */
  acceptance_criteria: string[];

  /** Technical specifications reference */
  technical_specs?: string;

  /** When this feature was created */
  created_at: string;
}

/**
 * User Story Object
 * Represents a user story in BDD format (Given/When/Then)
 */
export interface TOONUserStory {
  /** Unique identifier */
  name: string;

  /** Role from whose perspective this story is written */
  role: string;

  /** BDD-style acceptance criteria */
  given: string;
  when: string;
  then: string;

  /** Additional acceptance conditions */
  and?: string[];

  /** Benefit/description of what this enables */
  benefit: string;

  /** Priority level */
  priority: "high" | "medium" | "low";

  /** When this story was created */
  created_at: string;
}

/**
 * Acceptance Criteria Object
 * Defines acceptance criteria for user stories
 */
export interface TOONAcceptanceCriteria {
  /** Unique identifier */
  name: string;

  /** The criteria being checked */
  criteria: {
    /** The condition being tested */
    given: string;

    /** The expected outcome */
    then: string;

    /** Any additional conditions */
    and?: string[];
  }[];

  /** When this criteria was defined */
  created_at: string;
}

/**
 * Change Log Object
 * Tracks changes to TOON documents over time
 */
export interface TOONChangeLog {
  /** Unique identifier */
  name: string;

  /** Type of change */
  type: "created" | "updated" | "deleted" | "restored";

  /** What changed */
  description: string;

  /** Who made the change */
  author: string;

  /** When the change occurred */
  timestamp: string;

  /** References to related objects */
  related_objects: string[];

  /** Version number after this change */
  version: string;
}

/**
 * Success Criteria Object
 * Defines measurable success criteria for phases or features
 */
export interface TOONSuccessCriteria {
  /** Unique identifier */
  name: string;

  /** The criteria being measured */
  criteria: string;

  /** Target value to achieve */
  target: string;

  /** How success is measured */
  measurement: string;

  /** Current value */
  current: string;

  /** Whether target has been achieved */
  achieved: boolean;

  /** When this criteria was defined */
  created_at: string;
}

// Re-export all interfaces as a type for convenience
export type {
  TOONDocument,
  TOONPhase,
  TOONFeature,
  TOONUserStory,
  TOONAcceptanceCriteria,
  TOONChangeLog,
  TOONSuccessCriteria,
};
