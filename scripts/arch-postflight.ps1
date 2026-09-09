[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (Get-Command graphify -ErrorAction SilentlyContinue) {
    & graphify update .
    if ($LASTEXITCODE -ne 0) { throw 'graphify update failed.' }
} else {
    Write-Warning 'graphify is unavailable; the project graph was not updated.'
}

if (Get-Command sentrux -ErrorAction SilentlyContinue) {
    & sentrux check .
    $checkExitCode = $LASTEXITCODE
    if ($checkExitCode -ne 0 -and (Test-Path -LiteralPath '.sentrux/rules.toml')) {
        throw 'sentrux check failed.'
    }
    if ($checkExitCode -ne 0) {
        Write-Warning 'No .sentrux/rules.toml is configured; sentrux check has no rules to evaluate.'
    }

    & sentrux gate .
    if ($LASTEXITCODE -ne 0) { throw 'sentrux gate failed.' }
} else {
    Write-Warning 'sentrux is unavailable; architecture regression checks were not run.'
}
