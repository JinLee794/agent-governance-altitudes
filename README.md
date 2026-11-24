# Agent governance at every altitude

An interactive, single-file brief on how Microsoft governs AI agents at enterprise scale. It zooms from the tenant (Microsoft Agent 365, Entra, Purview, Defender) down through Azure Policy scope and built-in policies, Foundry resources and agent-level controls, to a single request.

**View it:** https://jinlee794.github.io/agent-governance-altitudes/

## What's inside

- **30,000 ft:** Agent 365 as the control plane, plus screenshots of the Microsoft 365 admin center with GA, Preview and Frontier labels for every Ignite 2026 update
- **20,000 ft:** pick a build plane (Microsoft Foundry, Copilot Studio, Microsoft 365 Copilot or GitHub Copilot) and see where its controls act and what Ignite 2026 added. The choice carries down every altitude below
- **10,000 ft → Ground:** for Foundry, management-group scope, the Azure Policy built-ins for Foundry, and how each AI resource is built. For the other planes, the same five views (scope, policy catalog, resource, agent controls, a single request) show what's available today, with real product screenshots
- **500 ft:** agent-level controls, where each one is set (outside Foundry, inside Foundry, or both), and which cover only hosted agents
- **Guardrail map, ground level, operating model and discussion prompts**

Every claim carries a source chip linking to Microsoft Learn, GitHub Docs or an Ignite 2026 announcement. Press **S** for all sources and **N** for speaker notes.

Status labels reflect public documentation as of November 24, 2026. Screenshots come from Microsoft Learn, GitHub Docs and public Microsoft and GitHub blogs, and show demo or sample tenants only.

## Layout

- `index.html`: the built brief, self-contained and works offline
- `src/agent-governance.template.html`: the source
- `src/build-agent-governance.mjs`: inlines icons and screenshots into the template (`node src/build-agent-governance.mjs`)
- `src/shots/`: compressed screenshots

This is a personal project, not an official Microsoft publication.
