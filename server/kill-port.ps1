# PowerShell script to kill process on port 5000
Write-Host "Checking for processes on port 5000..." -ForegroundColor Yellow

$process = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($process) {
    Write-Host "Found process $process using port 5000" -ForegroundColor Red
    Stop-Process -Id $process -Force
    Write-Host "Process $process terminated successfully" -ForegroundColor Green
} else {
    Write-Host "No process found using port 5000" -ForegroundColor Green
}

Write-Host "Done! Port 5000 should now be free." -ForegroundColor Cyan

