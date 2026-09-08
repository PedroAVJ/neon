# Neon

Dual-client, skill-only plugin for deciding when repository work warrants an isolated Neon Postgres branch and managing that branch through official Neon tooling.

The plugin intentionally ships no provisioning executable, background service, credential helper, or repository-specific configuration. Agents choose whether a temporary branch materially improves safety for the current task. When one is warranted, they use the official Neon integration, Neon CLI, or Neon API interactively.

Every temporary branch must:

- be named for the repository and worktree or task;
- expire exactly 72 hours after creation;
- leave protected branches untouched; and
- be read back and verified before use or deletion.

Credentials and connection strings remain under the authentication and local-environment mechanisms of the selected official Neon tool. They must never be committed or printed.

## Validation

```bash
npm test
```
