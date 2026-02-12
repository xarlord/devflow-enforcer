# /devflow-start

## Slash Command

**Name:** /devflow-start
**Description:** Start a new DevFlow Enforcer project - asks for application name and initializes git

## Behavior

Per requirement #5: "Always start with asking user for name of the application and initiate a git"

## Execution Flow

```
1. PROMPT user: "What is the name of the application?"
2. STORE application name
3. INITIALIZE git repository (if not exists)
4. CREATE planning files:
   - task_plan.md
   - findings.md
   - progress.md
5. SPAWN Project Lead Agent
6. BEGIN workflow at Phase 1: Requirements Generation
```

## Example Session

```
USER: /devflow-start

DEVFLOW: Welcome to DevFlow Enforcer!

         Before we begin, I need some information.

         What is the name of the application?

USER: My Awesome App

DEVFLOW: Great! Initializing "My Awesome App" project...

         [Initializing git repository]
         [Creating planning files]
         [Spawning Project Lead Agent]

         Let's begin with Phase 1: Requirements Generation.

         [System/Software Architect Agent spawned]

         Please describe the requirements for your application...
```

## Implementation Notes

- Check if git repo already exists
- If exists, verify with user before proceeding
- Create .devflow directory for project metadata
- Set up initial planning files with application name
- Pass control to Project Lead Agent
