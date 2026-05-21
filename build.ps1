param (
    [string]$ProjectPath,
    [string]$OutputPath
)

if (-not $ProjectPath -or -not $OutputPath) {
    Write-Host "Используйте так: .\$PSCommandName <путь_к_проекту> <путь_к_выходной_директории>"
    exit 1
}

# Change to the project directory
Set-Location -Path $ProjectPath -ErrorAction Stop

# Create output directory if it doesn't exist
if (-not (Test-Path -Path $OutputPath)) {
    New-Item -ItemType Directory -Path $OutputPath | Out-Null
}

Write-Host "Установка зависимостей"
# Uncomment the line below if you want to install dependencies
# pnpm install

Write-Host "Сборка проекта..."
pnpm build

Write-Host "Копирование папок standalone, static и public..."

$StandalonePath = Join-Path -Path $ProjectPath -ChildPath ".next\standalone"
$StaticPath = Join-Path -Path $ProjectPath -ChildPath ".next\static"
$PublicPath = Join-Path -Path $ProjectPath -ChildPath "public"
$OutputStandalonePath = Join-Path -Path $OutputPath -ChildPath "standalone"

if (Test-Path -Path $StandalonePath) {
    Copy-Item -Recurse -Path $StandalonePath -Destination $OutputPath
    Write-Host "Папка standalone скопирована."
} else {
    Write-Host "Папка standalone не найдена."
}

if (Test-Path -Path $StaticPath) {
    Copy-Item -Recurse -Path $StaticPath -Destination (Join-Path -Path $OutputStandalonePath -ChildPath ".next")
    Write-Host "Папка static скопирована."
} else {
    Write-Host "Папка static не найдена."
}

if (Test-Path -Path $PublicPath) {
    Copy-Item -Recurse -Path $PublicPath -Destination $OutputStandalonePath
    Write-Host "Папка public скопирована."
} else {
    Write-Host "Папка public не найдена."
}

Write-Host "Сборка завершена успешно!"
