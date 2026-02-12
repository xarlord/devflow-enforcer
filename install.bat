@echo off
setlocal enabledelayedexpansion
set "PLUGIN_NAME=devflow-enforcer"
set "CLAUDE_PLUGINS=%USERPROFILE%\.claude\plugins"

echo ============================================================
echo DevFlow Enforcer v2.0 - Installation
echo ============================================================
echo.

echo Plugin Name: %PLUGIN_NAME%
echo Claude Plugins Directory: %CLAUDE_PLUGINS%
echo Destination: %CLAUDE_PLUGINS%\%PLUGIN_NAME%
echo.

:: Check if already installed
if exist "%CLAUDE_PLUGINS%\%PLUGIN_NAME%" (
    echo [!] Plugin already installed. Removing old version...
    rmdir /s /q "%CLAUDE_PLUGINS%\%PLUGIN_NAME%"
)

:: Create destination directory
echo [*] Creating plugin directory...
mkdir "%CLAUDE_PLUGINS%\%PLUGIN_NAME%"
if errorlevel 1 (
    echo [X] Failed to create directory
    pause
    exit /b 1
)
echo [√] Created: %CLAUDE_PLUGINS%\%PLUGIN_NAME%

:: Copy files
echo.
echo [*] Copying files...
echo.

:: Copy agents
xcopy /e /i /y "agents" "%CLAUDE_PLUGINS%\%PLUGIN_NAME%\agents" >nul 2^&1
if errorlevel 1 (
    echo [X] Failed to copy agents
    pause
    exit /b 1
)
echo [√] Copied: Agent specifications

:: Copy core
xcopy /e /i /y "core" "%CLAUDE_PLUGINS%\%PLUGIN_NAME%\core" >nul 2^&1
if errorlevel 1 (
    echo [X] Failed to copy core
    pause
    exit /b 1
)
echo [√] Copied: Core infrastructure

:: Copy docs
xcopy /e /i /y "docs" "%CLAUDE_PLUGINS%\%PLUGIN_NAME%\docs" >nul 2^&1
if errorlevel 1 (
    echo [X] Failed to copy docs
    pause
    exit /b 1
)
echo [√] Copied: Documentation

:: Copy root files
copy /y "README.md" "%CLAUDE_PLUGINS%\%PLUGIN_NAME%\" >nul 2^&1
if errorlevel 1 (
    echo [X] Failed to copy README.md
    pause
    exit /b 1
)
echo [√] Copied: Main readme

copy /y "LICENSE" "%CLAUDE_PLUGINS%\%PLUGIN_NAME%\" >nul 2^&1
if errorlevel 1 (
    echo [X] Failed to copy LICENSE
    pause
    exit /b 1
)
echo [√] Copied: License file

echo.
echo ============================================================
echo Installation Complete!
echo ============================================================
echo.
echo DevFlow Enforcer has been installed to:
echo   %CLAUDE_PLUGINS%\%PLUGIN_NAME%
echo.
echo Next steps:
echo   1. Restart Claude Code
echo   2. Plugin will auto-activate on software tasks
echo.
pause
