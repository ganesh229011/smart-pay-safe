git add .

$changes = git status --porcelain

if ($changes) {
    $message = "Auto update - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    git commit -m $message
    git push origin main
    Write-Host ""
    Write-Host "GitHub update successful!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "No changes to upload." -ForegroundColor Yellow
}

Read-Host "Press Enter to close"