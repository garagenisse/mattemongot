@ECHO OFF

ECHO Building release version of mattemongot...
CALL cordova build --release android
IF ERRORLEVEL 1 GOTO FAILURE

ECHO Removing old apk release if any...
CALL del ..\..\platforms\android\build\outputs\apk\mattemongot.apk
IF ERRORLEVEL 1 GOTO FAILURE

ECHO Signing mattemongot.apk
CALL "C:\Program Files\Java\jdk1.8.0_65\bin\jarsigner.exe" -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore mattemongot.keystore ..\..\platforms\android\build\outputs\apk\android-release-unsigned.apk mattemongot
IF ERRORLEVEL 1 GOTO FAILURE

ECHO Zipalign of mattemongot.apk
CALL "zipalign.exe" -v 4 ..\..\platforms\android\build\outputs\apk\android-release-unsigned.apk ..\..\platforms\android\build\outputs\apk\mattemongot.apk
IF ERRORLEVEL 1 GOTO FAILURE

ECHO Build Success!
GOTO DONE

:FAILURE
ECHO The build failed

:DONE
PAUSE
