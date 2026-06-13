// n8n Code node: Run Once for All Items
// Calculates engineering flow metrics from normalized issue/PR records.

const inputItems = $input.all();
const records = inputItems.map(item => item.json);

const reportStart = new Date('2026-06-08T00:00:00Z');
const reportEnd = new Date('2026-06-15T00:00:00Z');
const previousStart = new Date(reportStart.getTime() - 7 * 24 * 60 * 60 * 1000);
const now = new Date('2026-06-13T17:00:00Z');

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

function parseDate(value) {
  return value ? new Date(value) : null;
}

function daysBetween(start, end) {
  if (!start || !end) return null;
  return Math.round(((end - start) / DAY_MS) * 10) / 10;
}

function hoursBetween(start, end) {
  if (!start || !end) return null;
  return Math.round(((end - start) / HOUR_MS) * 10) / 10;
}

function inRange(date, start, end) {
  return date && date >= start && date < end;
}

function percentile(values, p) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
  return sorted[idx];
}

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2) return sorted[mid];
  return Math.round(((sorted[mid - 1] + sorted[mid]) / 2) * 10) / 10;
}

function average(values) {
  if (!values.length) return null;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}

function pctChange(current, previous) {
  if (previous === null || previous === undefined || previous === 0 || current === null || current === undefined) return null;
  return Math.round(((current - previous) / previous) * 100);
}

function formatTrend(value) {
  if (value === null || value === undefined) return 'n/a';
  if (value > 0) return `+${value}%`;
  return `${value}%`;
}

const enriched = records.map(record => {
  const startedAt = parseDate(record.startedAt) || parseDate(record.createdAt);
  const completedAt = parseDate(record.completedAt);
  const prOpenedAt = parseDate(record.prOpenedAt);
  const prMergedAt = parseDate(record.prMergedAt);
  const cycleTimeDays = completedAt ? daysBetween(startedAt, completedAt) : null;
  const reviewTimeHours = prMergedAt ? hoursBetween(prOpenedAt, prMergedAt) : (prOpenedAt ? hoursBetween(prOpenedAt, now) : null);
  const ageDays = !completedAt && startedAt ? daysBetween(startedAt, now) : null;
  return { ...record, cycleTimeDays, reviewTimeHours, ageDays };
});

const completedThisWeek = enriched.filter(record => inRange(parseDate(record.completedAt), reportStart, reportEnd));
const completedPreviousWeek = enriched.filter(record => inRange(parseDate(record.completedAt), previousStart, reportStart));
const activeItems = enriched.filter(record => record.status !== 'Done');

const thisCycleTimes = completedThisWeek.map(record => record.cycleTimeDays).filter(value => value !== null);
const prevCycleTimes = completedPreviousWeek.map(record => record.cycleTimeDays).filter(value => value !== null);
const thisReviewTimes = completedThisWeek.map(record => record.reviewTimeHours).filter(value => value !== null);
const prevReviewTimes = completedPreviousWeek.map(record => record.reviewTimeHours).filter(value => value !== null);

const blockedItems = enriched.filter(record => (record.blockedDays || 0) > 0 && (record.status !== 'Done' || inRange(parseDate(record.completedAt), reportStart, reportEnd)));
const agingWip = activeItems.filter(record => (record.ageDays || 0) >= 5);
const reviewQueue = activeItems.filter(record => record.prOpenedAt && !record.prMergedAt);

const metrics = {
  reportWindow: {
    start: reportStart.toISOString().slice(0, 10),
    endExclusive: reportEnd.toISOString().slice(0, 10)
  },
  throughput: {
    current: completedThisWeek.length,
    previous: completedPreviousWeek.length,
    trend: formatTrend(pctChange(completedThisWeek.length, completedPreviousWeek.length))
  },
  cycleTimeDays: {
    median: median(thisCycleTimes),
    p95: percentile(thisCycleTimes, 95),
    previousMedian: median(prevCycleTimes),
    medianTrend: formatTrend(pctChange(median(thisCycleTimes), median(prevCycleTimes))),
    samples: thisCycleTimes
  },
  reviewTimeHours: {
    average: average(thisReviewTimes),
    p95: percentile(thisReviewTimes, 95),
    previousAverage: average(prevReviewTimes),
    averageTrend: formatTrend(pctChange(average(thisReviewTimes), average(prevReviewTimes))),
    openReviewQueue: reviewQueue.length
  },
  blocked: {
    count: blockedItems.length,
    totalBlockedDays: Math.round(blockedItems.reduce((sum, record) => sum + (record.blockedDays || 0), 0) * 10) / 10,
    items: blockedItems.map(record => ({ id: record.id, title: record.title, reason: record.blockerReason, blockedDays: record.blockedDays, status: record.status }))
  },
  wip: {
    active: activeItems.length,
    aging: agingWip.length,
    agingItems: agingWip.map(record => ({ id: record.id, title: record.title, ageDays: record.ageDays, status: record.status }))
  }
};

const findings = [];

if ((metrics.reviewTimeHours.average || 0) > 24) {
  findings.push({
    severity: 'High',
    signal: 'Review time is above the 24h target',
    likelyCause: 'Platform/backend review capacity is the current constraint.',
    action: 'Introduce a rotating review owner for platform-related PRs next week.'
  });
}

if ((metrics.cycleTimeDays.p95 || 0) > (metrics.cycleTimeDays.median || 0) * 2.5) {
  findings.push({
    severity: 'Medium',
    signal: 'P95 cycle time is much higher than median cycle time',
    likelyCause: 'A few large or dependency-heavy items are creating a long tail.',
    action: 'Split high-complexity items earlier and review blocked work in the weekly planning check.'
  });
}

if (metrics.blocked.count >= 3) {
  findings.push({
    severity: 'Medium',
    signal: `${metrics.blocked.count} items show blocker time this week`,
    likelyCause: 'Cross-team dependencies and unresolved platform decisions are slowing flow.',
    action: 'Create an explicit dependency board and review it twice weekly until blocker count drops below three.'
  });
}

if (metrics.wip.aging > 0) {
  findings.push({
    severity: 'Medium',
    signal: `${metrics.wip.aging} active item(s) have been in progress for five or more days`,
    likelyCause: 'Work is aging in the system before reaching Done.',
    action: 'Swarm on the oldest WIP item before pulling new work.'
  });
}

if (!findings.length) {
  findings.push({
    severity: 'Low',
    signal: 'No major flow risk detected',
    likelyCause: 'Throughput, cycle time, and WIP are within expected range.',
    action: 'Keep monitoring review time and blocked work for early warning signals.'
  });
}

return [{
  json: {
    generatedAt: now.toISOString(),
    inputRecords: records.length,
    metrics,
    findings,
    completedThisWeek: completedThisWeek.map(record => ({ id: record.id, title: record.title, cycleTimeDays: record.cycleTimeDays, reviewTimeHours: record.reviewTimeHours, blockedDays: record.blockedDays })),
    activeItems: activeItems.map(record => ({ id: record.id, title: record.title, status: record.status, ageDays: record.ageDays, reviewTimeHours: record.reviewTimeHours, blockedDays: record.blockedDays }))
  }
}];
