#!/usr/bin/env bash
# Initialize the git repo and make the first commit (run from the repo root).
set -e
git init
git add -A
git commit -m "v0.1.0 — MVP: QuotaQuest (monitor + Rainmeter skin + docs + marketing)"
echo "Now set your remote and push:"
echo "  git branch -M main"
echo "  git remote add origin https://github.com/ mentoce0-gif/quotaquest.git"
echo "  git push -u origin main"
