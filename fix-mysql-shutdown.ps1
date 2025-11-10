# MySQL Shutdown Error Diagnostic Script
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "MySQL Shutdown Error Diagnostic Tool" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Port 3306
Write-Host "[1/6] Checking if port 3306 is in use..." -ForegroundColor Yellow
$portCheck = netstat -ano | findstr :3306
if ($portCheck) {
    Write-Host "WARNING: Port 3306 is in use!" -ForegroundColor Red
    Write-Host $portCheck
    Write-Host ""
    Write-Host "To kill the process, find the PID (last column) and run:" -ForegroundColor Yellow
    Write-Host "taskkill /F /PID [PID_NUMBER]" -ForegroundColor White
} else {
    Write-Host "Port 3306 is free - OK" -ForegroundColor Green
}
Write-Host ""

# Step 2: Check MySQL Services
Write-Host "[2/6] Checking MySQL services..." -ForegroundColor Yellow
$mysqlServices = Get-Service | Where-Object {$_.DisplayName -like "*MySQL*" -or $_.Name -like "*mysql*"}
if ($mysqlServices) {
    $mysqlServices | Format-Table -AutoSize
} else {
    Write-Host "No MySQL services found (this is normal for XAMPP)" -ForegroundColor Yellow
}
Write-Host ""

# Step 3: Test Port Connection
Write-Host "[3/6] Testing MySQL port connection..." -ForegroundColor Yellow
$testConnection = Test-NetConnection -ComputerName localhost -Port 3306 -WarningAction SilentlyContinue
if ($testConnection.TcpTestSucceeded) {
    Write-Host "Port 3306 is accessible - OK" -ForegroundColor Green
} else {
    Write-Host "Port 3306 is not accessible" -ForegroundColor Red
}
Write-Host ""

# Step 4: Check XAMPP MySQL Installation
Write-Host "[4/6] Checking XAMPP MySQL installation..." -ForegroundColor Yellow
if (Test-Path "C:\xampp\mysql\bin\mysqld.exe") {
    Write-Host "MySQL executable found - OK" -ForegroundColor Green
} else {
    Write-Host "ERROR: MySQL not found in C:\xampp\mysql\bin\" -ForegroundColor Red
    Write-Host "Please check your XAMPP installation" -ForegroundColor Yellow
}
Write-Host ""

# Step 5: Check MySQL Data Directory
Write-Host "[5/6] Checking MySQL data directory..." -ForegroundColor Yellow
if (Test-Path "C:\xampp\mysql\data") {
    Write-Host "MySQL data directory exists - OK" -ForegroundColor Green
    $dataFiles = Get-ChildItem "C:\xampp\mysql\data" -ErrorAction SilentlyContinue
    if ($dataFiles) {
        Write-Host "Found $($dataFiles.Count) files in data directory" -ForegroundColor Green
    }
} else {
    Write-Host "ERROR: MySQL data directory not found" -ForegroundColor Red
}
Write-Host ""

# Step 6: Check MySQL Error Log
Write-Host "[6/6] Checking MySQL error log..." -ForegroundColor Yellow
$errorLogs = Get-ChildItem "C:\xampp\mysql\data\*.err" -ErrorAction SilentlyContinue
if ($errorLogs) {
    Write-Host "MySQL error log found:" -ForegroundColor Yellow
    $errorLogs | ForEach-Object {
        Write-Host "  - $($_.FullName)" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "To view the latest error, run:" -ForegroundColor Yellow
    Write-Host "Get-Content '$($errorLogs[0].FullName)' -Tail 50" -ForegroundColor White
} else {
    Write-Host "No error log found (this is normal if MySQL hasn't started)" -ForegroundColor Yellow
}
Write-Host ""

# Summary and Recommendations
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Recommendations:" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Open XAMPP Control Panel" -ForegroundColor White
Write-Host "2. Try starting MySQL" -ForegroundColor White
Write-Host "3. If it fails, check the Logs button" -ForegroundColor White
Write-Host "4. Review the diagnostic results above" -ForegroundColor White
Write-Host ""
Write-Host "Common Solutions:" -ForegroundColor Yellow
Write-Host "- Stop Skype (often uses port 3306)" -ForegroundColor White
Write-Host "- Stop other MySQL services" -ForegroundColor White
Write-Host "- Run XAMPP as Administrator" -ForegroundColor White
Write-Host "- Check Windows Event Viewer for errors" -ForegroundColor White
Write-Host ""
Write-Host "For detailed solutions, see: FIX_MYSQL_SHUTDOWN_ERROR.md" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to exit"

