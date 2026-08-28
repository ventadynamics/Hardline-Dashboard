<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# UI Skills (ui-skills.com)

This repo is wired to the [UI Skills](https://www.ui-skills.com) registry two ways. Prefer MCP; the CLI is the fallback for environments without MCP.

## MCP (preferred)

`.mcp.json` registers the `ui-skills` server (`https://www.ui-skills.com/mcp`, streamable HTTP, no auth). Tools:

- `list_skills` — list the registry; optional `query` filters by pathSlug, name, or description.
- `get_skill` — full skill markdown by name, slug, or pathSlug (e.g. `baseline-ui` or `ibelick/baseline-ui`).

## CLI

```bash
npx ui-skills start                    # routing skill: pick the smallest useful skill
npx ui-skills categories               # list categories
npx ui-skills list --category motion   # skills in one category
npx ui-skills get baseline-ui          # full markdown for one skill
```

## Routing protocol

Before UI work, follow the `ui-skills-root` skill (installed locally, also `get_skill: ibelick/ui-skills-root`): identify the category, load the smallest useful skill set (prefer 1, never more than 3), then implement with that context.

## Locally pinned skills

The `ibelick/ui-skills` set (`ui-skills-root`, `baseline-ui`, `improve-ui`, `create-design-md`, `fixing-accessibility`, `fixing-metadata`, `fixing-motion-performance`) is pinned in `skills-lock.json` alongside the other design skills and installs to the gitignored `.agents/skills/` + `.claude/skills/` via the `skills` CLI. Everything else in the registry is fetched on demand through MCP or the CLI.
