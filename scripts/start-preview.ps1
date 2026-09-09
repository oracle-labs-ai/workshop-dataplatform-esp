[CmdletBinding()]
param(
    [ValidateRange(1, 65535)]
    [int]$Port = 5501
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
try {
    $listener.Start()
} catch {
    throw "Port $Port is already in use. Choose another port with -Port, without stopping the existing process."
} finally {
    $listener.Stop()
}

$pythonPath = & py -3.11 -c "import sys; print(sys.executable)"
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($pythonPath)) {
    throw 'Python 3.11 is required to start the local preview.'
}

$previewProcess = Start-Process -FilePath $pythonPath.Trim() -ArgumentList @('-m', 'http.server', $Port, '--bind', '127.0.0.1', '--directory', $repoRoot) -WindowStyle Hidden -PassThru
Write-Host "Preview running at http://127.0.0.1:$Port/ (PID $($previewProcess.Id))."
Write-Host "Stop it with: Stop-Process -Id $($previewProcess.Id)"
