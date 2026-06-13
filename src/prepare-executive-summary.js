// n8n Code node: Run Once for All Items
// Creates a deterministic, rule-based weekly leadership summary.

const data = $input.all()[0].json;
const { metrics, findings } = data;
const topFinding = findings[0];

function valueOrNA(value, suffix = '') {
  return value === null || value === undefined ? 'n/a' : `${value}${suffix}`;
}

const blockedList = metrics.blocked.items.length
  ? metrics.blocked.items
      .slice(0, 4)
      .map(item => `- ${item.id}: ${item.reason || 'No reason captured'} (${item.blockedDays}d, ${item.status})`)
      .join('\n')
  : '- None';

const agingList = metrics.wip.agingItems.length
  ? metrics.wip.agingItems
      .map(item => `- ${item.id}: ${item.title} (${item.ageDays}d, ${item.status})`)
      .join('\n')
  : '- None';

const reportMarkdown = `# Weekly Engineering Flow Radar

**Window:** ${metrics.reportWindow.start} to ${metrics.reportWindow.endExclusive}  
**Input records:** ${data.inputRecords}

## Scorecard

| Metric | Current | Trend |
|---|---:|---:|
| Throughput | ${metrics.throughput.current} completed items | ${metrics.throughput.trend} |
| Median cycle time | ${valueOrNA(metrics.cycleTimeDays.median, 'd')} | ${metrics.cycleTimeDays.medianTrend} |
| P95 cycle time | ${valueOrNA(metrics.cycleTimeDays.p95, 'd')} | — |
| Avg PR review time | ${valueOrNA(metrics.reviewTimeHours.average, 'h')} | ${metrics.reviewTimeHours.averageTrend} |
| Open review queue | ${metrics.reviewTimeHours.openReviewQueue} PR(s) | — |
| Blocked items | ${metrics.blocked.count} | ${metrics.blocked.totalBlockedDays} blocked days |
| Aging WIP | ${metrics.wip.aging} of ${metrics.wip.active} active items | — |

## Main signal

**${topFinding.signal}.** ${topFinding.likelyCause}

## Recommended management action

${topFinding.action}

## Secondary risks

${findings.slice(1).map(finding => `- **${finding.severity}:** ${finding.signal}. Action: ${finding.action}`).join('\n') || '- No secondary risks detected.'}

## Blocked work

${blockedList}

## Aging WIP

${agingList}

---
Demo report produced by the n8n workflow in this repository using sample GitHub/Jira/Linear-style engineering flow data.`;

const slackBlock = `*Weekly Engineering Flow Radar*\n\n*Window:* ${metrics.reportWindow.start} to ${metrics.reportWindow.endExclusive}\n*Throughput:* ${metrics.throughput.current} completed items (${metrics.throughput.trend})\n*Median cycle time:* ${valueOrNA(metrics.cycleTimeDays.median, 'd')} (${metrics.cycleTimeDays.medianTrend})\n*P95 cycle time:* ${valueOrNA(metrics.cycleTimeDays.p95, 'd')}\n*Avg PR review time:* ${valueOrNA(metrics.reviewTimeHours.average, 'h')} (${metrics.reviewTimeHours.averageTrend})\n*Blocked items:* ${metrics.blocked.count}\n*Aging WIP:* ${metrics.wip.aging}\n\n*Main signal:* ${topFinding.signal}.\n*Likely cause:* ${topFinding.likelyCause}\n*Recommended action:* ${topFinding.action}`;

return [{
  json: {
    reportMarkdown,
    slackBlock,
    headline: topFinding.signal,
    recommendedAction: topFinding.action,
    metrics,
    findings
  }
}];
