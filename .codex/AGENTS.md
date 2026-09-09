# Local Codex Policy for codex-lab-aidp

This file supplements the global `~/.codex/AGENTS.md`.

Keep this file repo-specific. Do not duplicate universal rules that already live in the global policy.

## Project Identity

- Repo root: `D:\dev\codex-lab-aidp`
- Purpose: Spanish Oracle LiveLabs workshop for OCI AI Data Platform and Autonomous Database.
- Technical audience: workshop authors and reviewers.
- Primary surfaces: `manifest.json`, its referenced Markdown labs, and their local media.

## Repo Operating Defaults

- Preferred validation commands: `py -3.11 scripts/check_site.py` and `py -3.11 scripts/check_site.py --self-test`.
- Preferred search and inspection tools: `rg` for manifest, Markdown, and asset references.
- Default runtime or environment assumptions: preview with `scripts/start-preview.ps1`; Oracle LiveLabs assets load from the network.

## Local Validation Policy

- Required checks beyond global Graphify and Sentrux: run the site validator before every pull request.
- Safe shortcuts for docs-only work: do not run a local OCI lab to validate editorial changes.
- Release, deploy, or approval gates: merge an approved, passing pull request into `main`; GitHub Pages then deploys it.

## Repo-Specific Friction

- Sensitive paths or fragile areas:
- Credentials, external systems, or approval boundaries:
- Noisy, slow, or expensive commands to avoid by default:

## Continuous Improvement Triggers

- Promote a repeated friction to this local file after 2 recurrences in the same repo.
- Promote a repeated manual sequence to a script or skill after 3 recurrences or when it is safety-critical.
- Promote a rule to the global policy only when it is cross-repo or clearly universal.
- Review `.codex/improvement-log.md` before large tasks and record only meaningful signal after non-trivial work.

## Future Delegation Hooks

- Candidate explorer roles:
- Candidate reviewer roles:
- Candidate repo-specific skills or MCPs:
