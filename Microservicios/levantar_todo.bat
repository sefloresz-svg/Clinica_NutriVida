@echo off
REM Levanta todo el backend en orden, cada servicio en su propia ventana.
REM Antes: Laragon encendido (MySQL) y las 3 bases creadas con crear_bases.sql

REM JDK a usar (el proyecto es Java 17, el JDK 21 lo compila sin problema)
set JAVA_HOME=C:\Users\sebas\.jdks\ms-21.0.12.1
set RAIZ=%~dp0

echo 1) Eureka...
start "eureka-server :8761" cmd /k "cd /d %RAIZ%eureka-server && mvnw.cmd spring-boot:run"
timeout /t 25 /nobreak

echo 2) Microservicios...
start "usuarios :8081" cmd /k "cd /d %RAIZ%usuarios && mvnw.cmd spring-boot:run"
start "contenido :8082" cmd /k "cd /d %RAIZ%contenido && mvnw.cmd spring-boot:run"
start "atenciones :8083" cmd /k "cd /d %RAIZ%atenciones && mvnw.cmd spring-boot:run"
timeout /t 40 /nobreak

echo 3) Gateway...
start "api-gateway :8080" cmd /k "cd /d %RAIZ%api-gateway && mvnw.cmd spring-boot:run"

echo.
echo Listo. Revisa http://localhost:8761 (deben aparecer USUARIOS, CONTENIDO, ATENCIONES y API-GATEWAY)
echo Luego en otra terminal: cd Clinica_Nutrivida_React  y  npm run dev
pause
