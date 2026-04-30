@echo off
REM Download face-api.js models for FaceScanPage
setlocal
set MODELS_DIR=public\models
if not exist %MODELS_DIR% mkdir %MODELS_DIR%

REM Download URLs
set "BASE_URL=https://github.com/justadudewhohacks/face-api.js-models/raw/master/weights"
set "FILES=face_expression_model-weights_manifest.json face_expression_model-shard1 face_landmark_68_model-weights_manifest.json face_landmark_68_model-shard1 tiny_face_detector_model-weights_manifest.json tiny_face_detector_model-shard1"

echo Downloading face-api.js models to "%MODELS_DIR%"

for %%F in (%FILES%) do (
    echo.
    echo Downloading %%F ...
    powershell -NoProfile -Command "try { Invoke-WebRequest -Uri '%BASE_URL%/%%F' -OutFile '%MODELS_DIR%\\%%F' -UseBasicParsing; Write-Host 'Saved: %MODELS_DIR%\\%%F' } catch { try { Invoke-WebRequest -Uri '%BASE_URL%/%%F.bin' -OutFile '%MODELS_DIR%\\%%F.bin' -UseBasicParsing; Write-Host 'Saved: %MODELS_DIR%\\%%F.bin' } catch { Write-Host 'Failed to download %%F or %%F.bin' } }"
)

echo All face-api.js model files attempted to download to "%MODELS_DIR%".
echo Please verify files exist in "%MODELS_DIR%" and restart your dev server.
pause
