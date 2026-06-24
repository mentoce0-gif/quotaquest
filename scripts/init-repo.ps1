# Initialize the git repo and make the first commit (run from the repo root).
git init
git add -A
git commit -m "v0.1.0 — MVP: QuotaQuest (monitor + Rainmeter skin + docs + marketing)"
Write-Host "Now set your remote and push:" -ForegroundColor Green
Write-Host "  git branch -M main"
Write-Host "  git remote add origin https://github.com/<you>/quotaquest.git"
Write-Host "  git push -u origin main"
