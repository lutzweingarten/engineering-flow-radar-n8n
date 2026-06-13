# Live integration guide

The demo workflow is credential-free. To make it live, swap `Generate Sample Engineering Data` for real data source nodes and preserve the normalized schema expected by `Calculate Flow Metrics`.

## Option A — GitHub + Jira

Suggested live source nodes:

1. Schedule Trigger — weekly on Friday afternoon
2. Jira node or HTTP Request — fetch issues updated/completed during the report window
3. GitHub node or HTTP Request — fetch PRs opened/merged during the report window
4. Code node — normalize Jira issues and GitHub PRs into the demo schema
5. Calculate Flow Metrics
6. Prepare Executive Summary
7. Slack / Email / Notion / Google Sheets output

## Option B — GitHub + Linear

Suggested live source nodes:

1. Schedule Trigger
2. Linear API via HTTP Request
3. GitHub node or HTTP Request
4. Code node — normalize Linear issues and GitHub PRs
5. Calculate Flow Metrics
6. Prepare Executive Summary
7. Slack / Email / Notion / Google Sheets output

## Minimum schema for each item

```json
{
  "id": "string",
  "title": "string",
  "team": "string",
  "owner": "string",
  "type": "string",
  "priority": "string",
  "status": "Done | In Progress | In Review | Blocked | Backlog",
  "createdAt": "ISO timestamp",
  "startedAt": "ISO timestamp or null",
  "completedAt": "ISO timestamp or null",
  "prOpenedAt": "ISO timestamp or null",
  "prMergedAt": "ISO timestamp or null",
  "blockedDays": 0,
  "blockerReason": "string",
  "storyPoints": 0
}
```

## Data mapping notes

- If your issue tracker does not have `startedAt`, use the first transition into `In Progress`.
- If your issue tracker does not track blocker duration, set `blockedDays` to `0` and use labels/status to infer blockers later.
- If PRs are not linked to issues, start with PR metrics separately and merge later.
- Keep the first live version intentionally imperfect. The value is in the management loop, not perfect data modeling.
