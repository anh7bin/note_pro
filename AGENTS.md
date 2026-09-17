# Codex Repository Instructions

These instructions apply to the entire repository. Explicit user instructions always take precedence when they conflict with this file.

## Core Principles

- Solve the root cause with the smallest complete change.
- Prefer the most reliable and maintainable solution that fits the existing architecture and conventions.
- Handle relevant edge cases, error states, accessibility, and data integrity instead of applying temporary workarounds.
- Keep the task narrowly scoped. Do not refactor unrelated code or modify unrelated user changes.
- Do not install dependencies, change lockfiles, start long-running services, or perform destructive operations unless the task requires it and the user has authorized it.

## Required Workflow

1. Understand the requested outcome and identify the root cause before editing.
2. Inspect only the minimum relevant code and existing patterns.
3. Implement the smallest complete solution.
4. Regenerate GraphQL artifacts when required, before final validation.
5. Format changed files with the package-local Prettier installation.
6. Run TypeScript type-checking for every affected package.
7. Run only focused tests that cover the changed behavior, when such tests exist.
8. Run `git diff --check` and review the final diff for accidental changes.
9. Report the result, validations run, and any remaining issue concisely.

## Build Commands

- Do not run `npm run build`, `npm run build:*`, `next build`, or equivalent production build commands unless the user explicitly requests a build.
- A build must not be used as the default validation step. Use type-checking, formatting, focused tests, and generated-code validation instead.

## GraphQL Code Generation

Run the following command from `client/` whenever a change affects generated GraphQL types or hooks:

```bash
npm run gql-gen
```

This is required after changing any of the following:

- `client/src/**/*.graphql`
- `client/graphql.config.ts`
- Hasura migrations, metadata, actions, or schema definitions that change the GraphQL schema consumed by the client
- GraphQL scalar mappings, operation names, variables, fragments, fields, or generated output configuration

GraphQL rules:

- Never manually edit `*.generated.tsx`, `client/src/types/generated/graphql.ts`, or `client/src/types/generated/apollo-helpers.ts`.
- Edit the source operation, schema, metadata, migration, or codegen configuration, then regenerate.
- Run `npm run gql-gen` before the final client type-check so generated artifacts are included in validation.
- The generator requires a reachable Hasura endpoint and the required environment variables. If generation fails because the endpoint or credentials are unavailable, report the exact blocker; do not hand-edit generated files.
- Do not run GraphQL generation when no GraphQL source, schema, or codegen input changed.

## Required Validation

Run checks only for affected packages.

### Client

From `client/`:

```bash
npx prettier --write <changed-files>
npm run tsc
```

If GraphQL inputs changed, use this order:

```bash
npm run gql-gen
npx prettier --write <changed-and-generated-files>
npm run tsc
```

### Server

From `server/`:

```bash
npx prettier --write <changed-files>
npx tsc --noEmit -p tsconfig.json
```

### Documentation or Configuration Only

- Run package-local Prettier only on the changed files when their format is supported.
- Type-checking is not required when no TypeScript, JavaScript, GraphQL, generated code, or type-relevant configuration changed.

### Final Repository Check

From the repository root:

```bash
git diff --check
```

Do not claim a check passed unless the command completed successfully. Do not fix unrelated pre-existing failures unless the user asks.

## Token and Time Efficiency

- If `.codegraph/` exists, use CodeGraph before grep, file discovery, or broad file reads. Otherwise prefer `rg` and `rg --files`.
- Search for specific symbols, filenames, and call sites before opening files.
- Read targeted line ranges instead of entire large files. Avoid reading generated files, lockfiles, build output, or dependency directories unless directly relevant.
- Batch independent read-only inspections and validation commands when doing so keeps the output clear.
- Do not repeat searches, file reads, or successful checks unless relevant inputs changed.
- Avoid dumping long command output. Use narrow queries and bounded output.
- Prefer existing utilities, types, components, and patterns over creating parallel abstractions.
- Ask a question only when missing information would materially change the implementation; otherwise make a safe, scoped assumption and continue.
- Keep progress updates and final responses concise. Report outcomes instead of narrating routine steps.
- Do not browse the web unless the task requires current or external information.
- Do not run broad test suites when a focused test or type-check provides sufficient confidence.

## Change Safety

- Preserve all unrelated working-tree changes.
- Do not use destructive Git commands or delete user files.
- Do not expose secrets or print environment-variable values.
- Do not modify generated files, vendored code, or dependencies directly.
- Before finishing, verify that only intended files changed and that the implementation still follows repository conventions.
