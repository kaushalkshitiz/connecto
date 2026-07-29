#!/usr/bin/env python3
"""
Athlete Risk Intelligence Platform — AI Insights Service CLI Runner
====================================================================

Usage:
    python main.py --type weekly
    python main.py --type monthly
    python main.py --type athlete_summary
    python main.py --type coach_summary
    python main.py --type department_summary
    python main.py --type weekly --output report.json
"""

import argparse
import json
import sys
from ai_service import (
    generate_weekly_report,
    generate_monthly_report,
    generate_athlete_summary,
    generate_coach_summary,
    generate_department_summary,
)

# Sample demo input dataset mirroring Stanford Track & Field seed data
DEMO_DATA = {
    "team_id": "11111111-1111-4111-8111-111111111111",
    "team_name": "Stanford Track & Field",
    "athletes": [
        {"id": "33333333-3333-4333-8333-333333333301", "name": "Maya Lin"},
        {"id": "33333333-3333-4333-8333-333333333302", "name": "Jordan Thorne"},
        {"id": "33333333-3333-4333-8333-333333333303", "name": "Liam Carter"},
        {"id": "33333333-3333-4333-8333-333333333304", "name": "Chloe Ramirez"},
        {"id": "33333333-3333-4333-8333-333333333305", "name": "Darius Vance"},
        {"id": "33333333-3333-4333-8333-333333333306", "name": "Sienna Brooks"},
    ],
    "risk_flags": [
        {"athlete_id": "33333333-3333-4333-8333-333333333301", "level": "high", "reason": "Sleep < 6h & Active injury note"},
        {"athlete_id": "33333333-3333-4333-8333-333333333302", "level": "watch", "reason": "Soreness >= 4.0/5.0"},
        {"athlete_id": "33333333-3333-4333-8333-333333333303", "level": "watch", "reason": "Missing check-in for 4+ days"},
        {"athlete_id": "33333333-3333-4333-8333-333333333304", "level": "low", "reason": "Normal metrics"},
        {"athlete_id": "33333333-3333-4333-8333-333333333305", "level": "low", "reason": "Normal metrics"},
        {"athlete_id": "33333333-3333-4333-8333-333333333306", "level": "high", "reason": "Sleep < 6h & Soreness >= 4.0"},
    ],
    "check_ins": [
        {"athlete_id": "33333333-3333-4333-8333-333333333301", "sleep_hours": 5.1, "soreness": 4},
        {"athlete_id": "33333333-3333-4333-8333-333333333302", "sleep_hours": 7.3, "soreness": 4},
        {"athlete_id": "33333333-3333-4333-8333-333333333304", "sleep_hours": 8.2, "soreness": 2},
        {"athlete_id": "33333333-3333-4333-8333-333333333305", "sleep_hours": 7.6, "soreness": 2},
        {"athlete_id": "33333333-3333-4333-8333-333333333306", "sleep_hours": 5.2, "soreness": 4},
    ],
}


def main():
    parser = argparse.ArgumentParser(description="Athlete Risk Platform — Python AI Insights Service CLI")
    parser.add_argument(
        "--type",
        type=str,
        default="weekly",
        choices=["weekly", "monthly", "athlete_summary", "coach_summary", "department_summary"],
        help="Type of AI report to generate",
    )
    parser.add_argument(
        "--output",
        type=str,
        default=None,
        help="Optional path to write generated AIInsightReport JSON",
    )
    args = parser.parse_args()

    report_type = args.type
    if report_type == "weekly":
        report = generate_weekly_report(DEMO_DATA)
    elif report_type == "monthly":
        report = generate_monthly_report(DEMO_DATA)
    elif report_type == "athlete_summary":
        report = generate_athlete_summary(DEMO_DATA)
    elif report_type == "coach_summary":
        report = generate_coach_summary(DEMO_DATA)
    elif report_type == "department_summary":
        report = generate_department_summary(DEMO_DATA)
    else:
        print(f"Unknown report type: {report_type}", file=sys.stderr)
        sys.exit(1)

    formatted_json = json.dumps(report, indent=2)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(formatted_json)
        print(f"Successfully generated {report_type} report -> {args.output}")
    else:
        print(formatted_json)


if __name__ == "__main__":
    main()
