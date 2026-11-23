# Agent governance at every altitude

An interactive, single-file brief on how Microsoft governs AI agents at enterprise scale. It zooms from the tenant (Microsoft Agent 365, Entra, Purview, Defender) down through Azure Policy scope and built-in policies, Foundry resources and agent-level controls, to a single request.

**View it:** https://jinlee794.github.io/agent-governance-altitudes/

## What's inside

- **30,000 ft:** Agent 365 as the control plane, plus screenshots of the Microsoft 365 admin center with GA, Preview and Frontier labels for every Ignite 2026 update
- **10,000 ft → 1,000 ft:** management-group scope, the Azure Policy built-ins for Foundry, and how each AI resource is built
- **500 ft:** agent-level controls, where each one is set (outside Foundry, inside Foundry, or both), and which cover only hosted agents
- **Guardrail map, ground level, operating model and discussion prompts**

Every claim carries a source chip linking to Microsoft Learn or an Ignite 2026 announcement. Press **S** for all sources and **N** for speaker notes.

Status labels reflect public documentation as of November 23, 2026. Screenshots come from Microsoft Learn and the Microsoft Tech Community Agent 365 blog, and show demo data.

## Layout

- `index.html`: the built brief, self-contained and works offline
- `src/agent-governance.template.html`: the source
- `src/build-agent-governance.mjs`: inlines icons and screenshots into the template (`node src/build-agent-governance.mjs`)
- `src/shots/`: compressed screenshots

This is a personal project, not an official Microsoft publication.
