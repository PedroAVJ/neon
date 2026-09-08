---
name: neon
description: Decide when repository work warrants a short-lived Neon Postgres branch, then create, inspect, connect to, or delete it through official Neon tooling. Use for isolated schema changes, destructive database tests, seed or reset workflows, and production-like validation. Every temporary branch must expire exactly 72 hours after creation.
---

# Neon

This plugin provides decision and safety guidance only. It does not bundle a provisioning command, background service, credential injector, or repository configuration.

## Decide before provisioning

Do not create infrastructure merely because a worktree exists. First inspect the task and the repository's database workflow.

Create a temporary branch when isolation materially reduces risk, such as for:

- schema or migration work;
- destructive database commands, seed/reset flows, or fixture-heavy tests;
- DB-backed regression tests that must write production-like data; or
- concurrent work that must not share mutable database state.

Skip provisioning for documentation, static analysis, unit tests, UI-only work, or any task that does not need an isolated database.

## Provision through official Neon tooling

1. Prefer the official Neon integration exposed by the current client. Otherwise use the official Neon CLI (`neon` or `neonctl`, according to the installed version) or Neon API interactively. Check the current tool's help or schema before writing; do not recreate a wrapper.
2. Inspect the target project and its existing branches. Confirm the intended parent rather than assuming it from a local URL or stale config.
3. Name the branch `codex/<repository>/<worktree-or-task>` using short, recognizable, sanitized segments. The name must identify both the repository and the isolated unit of work.
4. Create the branch with `expires_at` set to an RFC 3339 timestamp exactly 72 hours after creation. With a CLI version that supports it, pass the equivalent `--expires-at` value during `branches create`.
5. Read the created branch back and verify its project, ID, name, parent, and expiration. If expiration is absent or not 72 hours after creation, fix it before using the branch.
6. Obtain only the connection strings the repository requires and write them only to the worktree's ignored local environment file. Never print them, commit them, or add them to shared deployment configuration.
7. Run the repository's normal baseline, migration, or test steps only after confirming the application points at the temporary branch.

If a create request times out or returns no response, list matching branches before retrying. Branch creation is not idempotent and a blind retry can create duplicates.

If the current interface offers only preset expiration periods that cannot express 72 hours, use the official CLI or API with an explicit RFC 3339 `expires_at` value instead.

## Protected branches and deletion

Never modify, reset, or delete `main`, `production`, `vercel-dev`, a default/root branch, or any branch Neon marks as protected. A protected branch may be selected as the parent only when the repository workflow explicitly requires it and the operation creates a new isolated child.

Automatic expiration is the default cleanup mechanism. Before any early deletion:

1. Read the exact branch from Neon again.
2. Match its project ID, branch ID, scoped name, parent, and expiration to the current repository and worktree/task.
3. Confirm it is not protected and is not being used by another environment.
4. Delete by exact branch ID, never by a broad prefix or bulk-prune command.

If ownership is ambiguous, leave the branch alone and let its verified 72-hour expiration remove it.

## Authentication

Use the official tool's existing authentication mechanism. Never inspect, migrate, inject globally, or echo credentials. Do not place API keys, connection strings, or database passwords in commands, logs, task text, or Git.
