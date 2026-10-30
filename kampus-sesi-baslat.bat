@echo off
chcp 65001 >nul
title Kampüs Sesi — Sunucu Başlatıcı
cls

echo ======================================================================
echo   Kampüs Sesi — Üniversite Değerlendirme Platformu
echo ======================================================================
echo.
echo [1/2] Tarayıcı http://localhost:8000 adresinde açılıyor...
timeout /t 2 >nul
start "" "http://localhost:8000"

echo [2/2] FastAPI backend sunucusu ve MySQL veritabanı başlatılıyor...
echo Sunucu adresi: http://localhost:8000
echo.
echo Sunucuyu durdurmak için bu pencerede CTRL+C tuşlarına basabilirsiniz.
echo ======================================================================
echo.

python backend/server.py

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ======================================================================
    echo [HATA] Sunucu başlatılamadı!
    echo Olası Sebepler:
    echo 1. Python kurulu değil veya PATH'e eklenmemiş olabilir.
    echo 2. XAMPP / MySQL servisinin (port 3306) açık olduğundan emin olun.
    echo 3. 'pip install -r requirements.txt' paketlerinin yüklü olduğunu kontrol edin.
    echo ======================================================================
    echo.
    pause
)

