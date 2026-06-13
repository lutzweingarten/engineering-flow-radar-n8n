> Example Slack-ready output produced by the demo workflow using sample GitHub/Jira/Linear-style engineering flow data.

# Weekly Engineering Flow Radar

**Window:** 2026-06-08 to 2026-06-15  
**Input records:** 15

## Scorecard

| Metric | Current | Trend |
|---|---:|---:|
| Throughput | 6 completed items | +20% |
| Median cycle time | 5.7d | +39% |
| P95 cycle time | 10.3d | — |
| Avg PR review time | 60.3h | +96% |
| Open review queue | 2 PR(s) | — |
| Blocked items | 5 | 11 blocked days |
| Aging WIP | 3 of 4 active items | — |

## Main signal

**Review time is above the 24h target.** Platform/backend review capacity is the current constraint.

## Recommended management action

Introduce a rotating review owner for platform-related PRs next week.

## Secondary risks

- **Medium:** 5 items show blocker time this week. Action: Create an explicit dependency board and review it twice weekly until blocker count drops below three.
- **Medium:** 3 active item(s) have been in progress for five or more days. Action: Swarm on the oldest WIP item before pulling new work.

## Blocked work

- ENG-241: Waiting for platform review (1d, Done)
- ENG-243: Telemetry schema decision (2.5d, Done)
- ENG-246: Cross-team API contract (1.5d, Done)
- ENG-249: Breaking test fixture (2d, In Progress)

## Aging WIP

- ENG-249: Stabilize node package dependency updates (9.3d, In Progress)
- ENG-250: Improve execution-list rendering performance (8.3d, In Review)
- ENG-251: Document platform API compatibility guarantees (10.3d, Blocked)
