@echo off
echo ================================================
echo RoadGuard Backend Setup Script
echo ================================================
echo.

echo Checking for PostgreSQL installation...
echo.

:: Check if PostgreSQL is installed
where psql >nul 2>nul
if %ERRORLEVEL% == 0 (
    echo PostgreSQL found in PATH!
    psql --version
    echo.
    goto :check_service
) else (
    echo PostgreSQL not found in PATH.
    echo Checking common installation directories...
    
    if exist "C:\Program Files\PostgreSQL" (
        echo PostgreSQL installation directory found!
        dir "C:\Program Files\PostgreSQL"
        echo.
        echo You may need to add PostgreSQL to your PATH.
        echo Common PostgreSQL bin directory: C:\Program Files\PostgreSQL\[version]\bin
        goto :check_service
    ) else (
        echo PostgreSQL not found.
        goto :install_postgres
    )
)

:check_service
echo Checking PostgreSQL service...
sc query postgresql-x64-15 >nul 2>nul
if %ERRORLEVEL% == 0 (
    echo PostgreSQL service found!
    sc query postgresql-x64-15
    echo.
    echo Starting PostgreSQL service...
    net start postgresql-x64-15
    goto :setup_database
) else (
    echo PostgreSQL service not found. Checking alternative service names...
    sc query postgresql >nul 2>nul
    if %ERRORLEVEL% == 0 (
        echo PostgreSQL service found with different name!
        sc query postgresql
        echo.
        echo Starting PostgreSQL service...
        net start postgresql
        goto :setup_database
    ) else (
        echo PostgreSQL service not found.
        goto :install_postgres
    )
)

:install_postgres
echo.
echo ================================================
echo PostgreSQL Installation Required
echo ================================================
echo.
echo PostgreSQL is not installed on your system.
echo.
echo Please choose an installation method:
echo.
echo 1. Download from official website (Recommended)
echo 2. Install via Chocolatey (if available)
echo 3. Install via Scoop (if available)
echo 4. Skip installation (I'll install manually)
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto :download_postgres
if "%choice%"=="2" goto :choco_install
if "%choice%"=="3" goto :scoop_install
if "%choice%"=="4" goto :manual_setup
echo Invalid choice. Please run the script again.
pause
exit /b 1

:download_postgres
echo.
echo Opening PostgreSQL download page...
start https://www.postgresql.org/download/windows/
echo.
echo Please download and install PostgreSQL, then run this script again.
echo.
echo Installation tips:
echo - Remember the password you set for the 'postgres' user
echo - Default port is 5432
echo - Add PostgreSQL to your PATH during installation
echo.
pause
exit /b 0

:choco_install
echo.
echo Checking for Chocolatey...
where choco >nul 2>nul
if %ERRORLEVEL% == 0 (
    echo Chocolatey found! Installing PostgreSQL...
    choco install postgresql
    goto :setup_database
) else (
    echo Chocolatey not found. Please install PostgreSQL manually.
    goto :download_postgres
)

:scoop_install
echo.
echo Checking for Scoop...
where scoop >nul 2>nul
if %ERRORLEVEL% == 0 (
    echo Scoop found! Installing PostgreSQL...
    scoop install postgresql
    goto :setup_database
) else (
    echo Scoop not found. Please install PostgreSQL manually.
    goto :download_postgres
)

:setup_database
echo.
echo ================================================
echo Database Setup
echo ================================================
echo.
echo Setting up RoadGuard database...
echo.
echo This will create a database named 'roadguard_db'
echo.
set /p proceed="Do you want to proceed? (y/n): "
if /i not "%proceed%"=="y" goto :manual_setup

echo.
echo Creating database setup SQL file...
echo CREATE DATABASE roadguard_db; > temp_setup.sql
echo GRANT ALL PRIVILEGES ON DATABASE roadguard_db TO postgres; >> temp_setup.sql

echo.
echo Please enter your PostgreSQL password when prompted...
psql -U postgres -h localhost -f temp_setup.sql

if %ERRORLEVEL% == 0 (
    echo Database created successfully!
    del temp_setup.sql
) else (
    echo Failed to create database. Please check your PostgreSQL installation.
    del temp_setup.sql
    goto :manual_setup
)

echo.
echo ================================================
echo Starting RoadGuard Backend
echo ================================================
echo.
echo Installing Node.js dependencies...
call npm install

echo.
echo Starting the server...
call npm run dev

goto :end

:manual_setup
echo.
echo ================================================
echo Manual Setup Instructions
echo ================================================
echo.
echo Please follow these steps manually:
echo.
echo 1. Install PostgreSQL from: https://www.postgresql.org/download/windows/
echo 2. Create a database named 'roadguard_db'
echo 3. Update the .env file with your database credentials
echo 4. Run: npm install
echo 5. Run: npm run dev
echo.
echo For detailed instructions, see DATABASE_SETUP.md
echo.

:end
echo.
echo Setup complete! Check the output above for any errors.
pause
