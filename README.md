# Engineering Flow Radar — n8n Proof-of-Work Demo

A small, importable n8n workflow that turns fictional issue/PR activity into a weekly engineering flow report.

It demonstrates a lightweight engineering operating system: collect delivery data, compute flow metrics, detect bottlenecks, and produce one concrete management action for the next week.

## What is included

```text
engineering-flow-radar-n8n/
├── README.md
├── workflow/
│   └── Engineering-Flow-Radar-n8n-Proof-of-Work.json
├── examples/
│   ├── sample-data.json
│   └── slack-output-example.md
├── src/
│   ├── generate-sample-data.js
│   ├── calculate-flow-metrics.js
│   ├── prepare-executive-summary.js
│   └── test-locally.js
├── docs/
│   ├── workflow-architecture.md
│   ├── live-integration-guide.md
│   └── loom-demo-script.md
├── screenshots/
│   ├── n8n-workflow.png
│   └── n8n-workflow-metrics-output.png
└── output/
    └── weekly leadership summary.pdf
```

## What the workflow does

The demo workflow has four executable nodes plus one explanatory sticky note:

1. **Manual Trigger** — run the workflow on demand.
2. **Generate Sample Engineering Data** — creates fictional Jira/Linear + GitHub-style records.
3. **Calculate Flow Metrics** — computes delivery and review metrics.
4. **Generate Engineering Leadership Summary** — creates a Markdown report and Slack-ready summary.

## Metrics generated

- Throughput
- Median cycle time
- P95 cycle time
- Average PR review time
- Open review queue
- Blocked items
- Total blocked days
- Aging WIP
- Bottleneck findings
- Recommended management actions

## How to import into n8n

1. Open n8n.
2. Create or open a workflow.
3. Use **Import from File** and select `workflow/Engineering-Flow-Radar-n8n-Proof-of-Work.json`.
4. Click **Execute Workflow**.
5. Open the final node, `Generate Engineering Leadership Summary`.
6. Copy either:
   - `reportMarkdown` for a full report, or
   - `slackBlock` for a Slack-ready message.

## How to run locally as a sanity check

If you have Node.js installed:

```bash
node src/test-locally.js
```

This prints the same report that the n8n workflow generates.

## Example output

```markdown
# Weekly Engineering Flow Radar

Throughput: 6 completed items
Median cycle time: 5.7d
P95 cycle time: 10.3d
Avg PR review time: 60.3h
Blocked items: 5
Aging WIP: 3 of 4 active items

Main signal: Review time is above the 24h target.
Recommended action: Introduce a rotating review owner for platform-related PRs next week.
```

See `output/weekly leadership summary.pdf` for a full generated report (I used AI to create a pdf from the actual report so you dont have to study the raw markdown)

## How to make it live

For live use, swap `Generate Sample Engineering Data` for live sources:

- Jira / Linear for issue state transitions
- GitHub / GitLab for pull requests
- Slack for output
- Google Sheets / Notion for archiving
- Optional narrative summary or output formatting node

Keep the normalized schema described in `docs/live-integration-guide.md`, then the metric and summary nodes can remain largely unchanged.

## Why this is useful for an n8n application

It shows three things at once:

1. You understand n8n as a product because the proof itself is built in n8n.
2. You can translate engineering leadership practice into a working automation.
3. Your leadership story is measurable: flow, cycle time, blockers, review time, and management action.

## Notes

- No credentials are included.
- All issue/PR data is fictional.
- The summary is deterministic and credential-free.
- The workflow is intentionally small so it can be understood in minutes during a hiring conversation.
