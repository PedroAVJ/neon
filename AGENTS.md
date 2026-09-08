# Repository Instructions

- Treat this repository as the canonical source for the `neon` plugin in both Codex and Claude Code.
- Keep `package.json`, `.codex-plugin/plugin.json`, and `.claude-plugin/plugin.json` versions aligned.
- Keep this a skill-only plugin. Do not add a custom provisioning CLI, background service, global credential injection, or repository-specific configuration.
- Never commit API keys, database URLs, generated environment files, or ephemeral branch state.
- Temporary branches must be clearly scoped to the repository and worktree/task and must expire exactly 72 hours after creation.
- Never modify or delete protected branches. Inspect the exact project, branch ID, name, parent, and expiration before deleting a temporary branch.
- Run `npm test` and both plugin and skill validators before release.
