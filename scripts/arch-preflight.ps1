[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (Test-Path -LiteralPath 'graphify-out/GRAPH_REPORT.md') {
    Get-Content -LiteralPath 'graphify-out/GRAPH_REPORT.md' -Raw | Out-Null
    Write-Host 'Read graphify-out/GRAPH_REPORT.md.'
}

if (Get-Command sentrux -ErrorAction SilentlyContinue) {
    & sentrux gate --save .
    if ($LASTEXITCODE -ne 0) { throw 'sentrux gate --save failed.' }

    & sentrux check .
    $checkExitCode = $LASTEXITCODE
    if ($checkExitCode -ne 0 -and (Test-Path -LiteralPath '.sentrux/rules.toml')) {
        throw 'sentrux check failed.'
    }
    if ($checkExitCode -ne 0) {
        Write-Warning 'No .sentrux/rules.toml is configured; sentrux check has no rules to evaluate.'
    }
} else {
    Write-Warning 'sentrux is unavailable; architecture baseline was not recorded.'
}
