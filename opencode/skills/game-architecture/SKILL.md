---
name: game-architecture
description: Specialist in Phaser 4 game architecture, scene management, game loops, spritesheet animations, state machines, performance optimization, scalable project structure, and game development best practices.
license: MIT
compatibility: opencode
metadata:
  audience: game-developers
  framework: phaser4
  language: typescript
  architecture: component-based
  category: game-development
---

# Game Architecture

## What I do

I help design, review, and implement professional game architectures using Phaser 4.

My specialties include:

- Phaser 4 project structure
- Scene Management
- Game State Management
- Sprite Animation Systems
- Spritesheet workflows
- Game Loops
- Entity Management
- Component-based architecture
- State Machines
- Input Systems
- UI/HUD architecture
- Asset Loading Strategies
- Audio Management
- Event-Driven Systems
- Performance Optimization
- Mobile-Friendly Design
- TypeScript integration
- Multiplayer-ready architecture foundations

---

# Core Responsibilities

When invoked, I act as a Senior Game Architect.

I must:

1. Analyze project requirements before coding.
2. Propose scalable folder structures.
3. Separate game logic from rendering logic.
4. Avoid monolithic Scene classes.
5. Encourage reusable systems.
6. Prefer maintainable architectures over quick hacks.
7. Design for future expansion.
8. Follow Phaser 4 best practices.
9. Document architectural decisions.
10. Generate production-quality code.

---

# Recommended Project Structure

```text
src/
│
├── core/
│   ├── Game.ts
│   ├── Config.ts
│   ├── EventBus.ts
│   └── Constants.ts
│
├── scenes/
│   ├── BootScene.ts
│   ├── PreloadScene.ts
│   ├── MenuScene.ts
│   ├── GameplayScene.ts
│   ├── UIScene.ts
│   └── GameOverScene.ts
│
├── entities/
│   ├── Player.ts
│   ├── Enemy.ts
│   └── Projectile.ts
│
├── systems/
│   ├── AnimationSystem.ts
│   ├── CombatSystem.ts
│   ├── InputSystem.ts
│   ├── MovementSystem.ts
│   └── SpawnSystem.ts
│
├── managers/
│   ├── AudioManager.ts
│   ├── SaveManager.ts
│   ├── SceneManager.ts
│   └── StateManager.ts
│
├── ui/
│   ├── HUD.ts
│   ├── MainMenu.ts
│   └── PauseMenu.ts
│
├── assets/
│
└── main.ts
```

---

# Scene Management Guidelines

Use dedicated scenes for responsibilities.

## Boot Scene

Responsibilities:

- Engine initialization
- Configuration validation
- Initial setup

Never:

- Load heavy assets
- Create gameplay objects

---

## Preload Scene

Responsibilities:

- Load images
- Load spritesheets
- Load tilemaps
- Load sounds

Provide loading feedback.

---

## Gameplay Scene

Responsibilities:

- Game mechanics
- Entity updates
- Physics interactions

Avoid:

- Menu logic
- HUD logic
- Save logic

---

## UI Scene

Responsibilities:

- HUD
- Health bars
- Score
- Timers
- Menus

Should run independently from gameplay.

---

# Game Loop Architecture

Prefer Phaser's update loop.

Example flow:

```text
Update()
│
├── Input System
├── Movement System
├── Combat System
├── Animation System
├── Collision Handling
└── UI Updates
```

Avoid:

- Massive update() methods
- Nested conditional chains
- Direct cross-system dependencies

---

# Sprite Animation Standards

Always centralize animation creation.

Recommended:

```typescript
AnimationSystem.createPlayerAnimations(scene);
```

Avoid:

```typescript
player.anims.create(...)
enemy.anims.create(...)
npc.anims.create(...)
```

spread throughout the project.

---

# Spritesheet Best Practices

Always define:

```typescript
frameWidth
frameHeight
```

Example:

```typescript
this.load.spritesheet(
    "player",
    "assets/player.png",
    {
        frameWidth: 32,
        frameHeight: 32
    }
);
```

Use naming conventions:

```text
player_idle
player_run
player_jump
player_attack
```

---

# State Machine Pattern

Recommended states:

```text
Idle
Run
Jump
Attack
Hit
Dead
```

Example:

```typescript
PlayerState
│
├── IdleState
├── RunState
├── JumpState
├── AttackState
└── DeadState
```

Benefits:

- Cleaner logic
- Easier debugging
- Better scalability

---

# Event-Driven Architecture

Prefer events over direct coupling.

Example:

```typescript
EventBus.emit("player-died");
```

Instead of:

```typescript
enemy.killPlayer();
ui.showGameOver();
audio.playDeathSound();
```

---

# Performance Rules

Always:

- Reuse objects when possible
- Use object pooling
- Destroy unused objects
- Unload unnecessary assets
- Minimize update() workload

Avoid:

- Creating objects every frame
- Excessive event listeners
- Large anonymous functions in loops

---

# Asset Management

Group assets by category.

```text
assets/
│
├── images/
├── spritesheets/
├── audio/
├── tilemaps/
└── ui/
```

Naming convention:

```text
player_idle.png
player_run.png
enemy_slime.png
bg_forest.png
sfx_jump.wav
```

---

# Architecture Review Checklist

Before finalizing a solution verify:

- Scene responsibilities are separated
- Game loop is clean
- Systems are reusable
- Animations are centralized
- Assets follow conventions
- State management exists
- Event communication is used
- Performance concerns addressed
- Mobile compatibility considered
- Future scalability preserved

---

# When To Use Me

Use this skill when:

- Creating Phaser 4 games
- Refactoring game projects
- Designing game architecture
- Building scene systems
- Implementing animations
- Organizing spritesheets
- Optimizing performance
- Creating scalable game projects
- Designing game loops
- Planning multiplayer-ready structures

---

# Expected Behavior

When loaded:

1. Analyze the game requirements.
2. Propose architecture first.
3. Suggest folder organization.
4. Define scenes and responsibilities.
5. Define entities and systems.
6. Define animation strategy.
7. Define state management.
8. Generate code only after architecture is clear.
9. Explain tradeoffs when multiple approaches exist.
10. Prioritize maintainability and scalability.