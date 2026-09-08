const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const packageJson = readJson("package.json");
const codexManifest = readJson(".codex-plugin/plugin.json");
const claudeManifest = readJson(".claude-plugin/plugin.json");
const skill = fs.readFileSync(path.join(root, "skills/neon/SKILL.md"), "utf8");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

test("dual-client manifests and package metadata stay aligned", () => {
  assert.equal(codexManifest.name, "neon");
  assert.equal(claudeManifest.name, codexManifest.name);
  assert.equal(claudeManifest.version, codexManifest.version);
  assert.equal(packageJson.version, codexManifest.version);
  assert.equal(claudeManifest.description, codexManifest.description);
  assert.equal(codexManifest.skills, "./skills/");
  assert.equal(claudeManifest.skills, codexManifest.skills);
});

test("Codex presentation metadata uses the official Neon mark", () => {
  assert.equal(codexManifest.interface.brandColor, "#34D59A");
  assert.equal(codexManifest.interface.composerIcon, "./assets/neon-icon.svg");
  assert.equal(codexManifest.interface.logo, "./assets/neon-icon.svg");
  assert.equal(fs.existsSync(path.join(root, "assets/neon-icon.svg")), true);
});

test("plugin remains skill-only with no custom provisioning executable", () => {
  assert.equal(packageJson.bin, undefined);
  assert.equal(fs.existsSync(path.join(root, "bin")), false);
  assert.equal(fs.existsSync(path.join(root, "scripts")), false);
});

test("skill requires deliberate 72-hour branches and guarded deletion", () => {
  assert.match(skill, /exactly 72 hours after creation/);
  assert.match(skill, /expires_at/);
  assert.match(skill, /Never modify, reset, or delete `main`, `production`, `vercel-dev`/);
  assert.match(skill, /Read the exact branch from Neon again/);
});
