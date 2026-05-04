@echo off
setlocal
set "ROOT=%~dp0"
pushd "%ROOT%"
"%ROOT%.tools\node-v22.22.2-win-x64\node.exe" "%ROOT%node_modules\react-native\cli.js" run-android %*
set "EXIT_CODE=%ERRORLEVEL%"
popd
exit /b %EXIT_CODE%
