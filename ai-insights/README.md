# Athlete Risk Intelligence Platform — Standalone AI Insights Service (Python)

This directory contains the Phase 2 local AI Insights reporting service. It runs decoupled from the main Next.js web application so that report generation can happen locally or on a scheduled server without affecting core application reliability.

## Features

Instead of generating only a single basic report, this service supports 5 distinct report types stored in `AIInsightReport`:
- **Weekly reports** (`--type weekly`)
- **Monthly reports** (`--type monthly`)
- **Athlete summaries** (`--type athlete_summary`)
- **Coach summaries** (`--type coach_summary`)
- **Department summaries** (`--type department_summary`)

## Strict Rule & Medical Compliance
- This AI layer **NEVER** replaces the deterministic rule-based risk scoring engine.
- It **CANNOT** predict injuries, invent statistics, or offer personalized medical advice.
- It summarizes already computed metrics (check-ins, sleep, soreness, mood, active physio notes, coach observations) into actionable plain-language narratives.

## Installation

```bash
pip install -r requirements.txt
```

## Usage

Run the CLI tool locally to generate and inspect reports:

```bash
# Generate a weekly team report
python main.py --type weekly --team "Stanford Track & Field"

# Generate a monthly report
python main.py --type monthly

# Generate a coach executive summary
python main.py --type coach_summary

# Generate an athlete summary
python main.py --type athlete_summary

# Generate a department summary
python main.py --type department_summary

# Export generated report as JSON
python main.py --type weekly --output report.json
```
