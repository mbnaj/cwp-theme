@echo off
rem Local preview of the CWP7 themes. Needs PHP 8+ (adjust the path below) and "composer install" run once in this folder.
set PHP=D:\wamp\bin\php\php8.4.21\php.exe
if not exist vendor\autoload.php (
  echo Run: composer install
  exit /b 1
)
echo Preview: http://127.0.0.1:8088/   (all pages: /__pages, switch theme: /?theme=original)
"%PHP%" -S 127.0.0.1:8088 "%~dp0router.php"
