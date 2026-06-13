# Two-minute demo script

Use this for a short screen recording or live interview walkthrough.

## 0:00–0:20 — Context

“I built a small n8n proof-of-work around the engineering operating system I use in leadership roles. The goal is to turn issue and PR activity into a weekly flow report that highlights bottlenecks and suggests one concrete management action.”

## 0:20–0:45 — Workflow overview

“The workflow is intentionally simple: trigger, sample engineering data, metric calculation, and executive summary. The sample node can later be replaced by Jira/Linear/GitHub input without changing the downstream logic.”

## 0:45–1:20 — Metrics

“The metrics are the ones I care about operationally: throughput, median cycle time, P95 cycle time, review time, blocked work, and aging WIP. Median tells me normal flow; P95 tells me where the tail risk lives.”

## 1:20–1:45 — Bottleneck detection

“In this run, review time crosses the 24-hour target and blocker count is elevated. The workflow therefore recommends a rotating platform review owner and a dependency review loop.”

## 1:45–2:00 — Why it matters

“This is not meant to be a polished BI dashboard. It is a lightweight management loop: make flow visible, detect the constraint, and take one action next week.”
