# Workflow architecture

```text
Manual Trigger
  ↓
Generate Sample Engineering Data
  ↓
Calculate Flow Metrics
  ↓
Prepare Executive Summary
```

## Node 1 — Manual Trigger

Runs the workflow on demand. This keeps the proof-of-work simple: no credentials, no schedule, no production side effects.

## Node 2 — Generate Sample Engineering Data

Creates fictional issue and pull-request records in a normalized schema:

```json
{
  "id": "ENG-241",
  "title": "Harden workflow execution retry logic",
  "team": "Core Platform",
  "status": "Done",
  "createdAt": "2026-06-01T09:10:00Z",
  "startedAt": "2026-06-03T09:30:00Z",
  "completedAt": "2026-06-09T15:20:00Z",
  "prOpenedAt": "2026-06-06T13:40:00Z",
  "prMergedAt": "2026-06-09T14:55:00Z",
  "blockedDays": 1.0,
  "blockerReason": "Waiting for platform review"
}
```

For live use, swap this node for Jira, Linear, GitHub, or GitLab sources.

## Node 3 — Calculate Flow Metrics

Computes:

- Throughput
- Median cycle time
- P95 cycle time
- Average PR review time
- Open review queue
- Blocked items
- Total blocked days
- Aging WIP
- Bottleneck findings
- Recommended actions

## Node 4 — Prepare Executive Summary

Creates:

- `reportMarkdown`: a full weekly report
- `slackBlock`: a concise Slack-ready message
- `headline`: the main signal
- `recommendedAction`: the main management action
- `metrics`: all computed metrics
- `findings`: bottleneck detections

## Why this works as proof-of-work

It demonstrates the operating system behind KPI-driven engineering management: connect delivery data, make flow visible, detect bottlenecks, then turn the signal into a concrete management action. It also shows n8n product understanding because the proof itself is built as an n8n workflow.
