# Git Hooks Configuration

This project uses Husky for automated Git workflow management.

## Features

✅ **Pre-commit hooks**: ESLint + Prettier on staged files
✅ **Commit message validation**: Conventional Commits format
✅ **Lint-staged**: Only process staged files for efficiency

## Commit Message Format

```
<type>: <description>
```

**Types**: feat, fix, docs, style, refactor, perf, test, chore, ci, build, revert

**Examples**:

- `feat: add dark mode toggle component`
- `fix: resolve memory leak in claude session`
- `docs: update installation instructions`

## Configuration Files

- `.husky/`: Git hooks
- `commitlint.config.mjs`: Commit message rules
- `.lintstagedrc.json`: Staged files processing

Hooks are automatically installed via `pnpm install` (prepare script).
