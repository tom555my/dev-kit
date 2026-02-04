#!/bin/bash
# Get the latest ticket number from .dev-kit/tickets directory
# Outputs the highest ticket number found, or "000" if no tickets exist

ls .dev-kit/tickets 2>/dev/null | grep -E '^[A-Z0-9]+-[0-9]{3}-' | cut -d'-' -f2 | sort -n | tail -1
