# Cinegold

Sistema web académico para cartelera, catálogo, reservaciones y administración de cine. Incluye una interfaz React y una API Node.js/Express conectada a SQL Server.

## Tecnologías

- React, Vite y Tailwind CSS
- Node.js, Express y API REST
- SQL Server, autenticación JWT y carga de imágenes

## Requisitos para Windows

- Node.js y pnpm
- SQL Server con la base `CinegoldDB`
- Microsoft ODBC Driver 17 for SQL Server
- Una cuenta de Windows con permisos en la base de datos

La API usa autenticación integrada de Windows por defecto. La cuenta de Windows que ejecuta Node debe tener un login de SQL Server y un usuario mapeado en `CinegoldDB`. No se necesita configurar usuario ni contraseña SQL.

## Preparación

1. Copia `backend/.env.example` a `backend/.env`.
2. Confirma `DB_AUTH=windows`, `DB_SERVER=localhost\\CINEGOLD`, `DB_INSTANCE_NAME=CINEGOLD` y `DB_ODBC_DRIVER=ODBC Driver 17 for SQL Server`; ajusta el servidor y el nombre de instancia a tu equipo.
3. Instala las dependencias desde `frontend` y `backend` con `pnpm install`.
4. Inicia la API desde `backend` con `pnpm start` y el frontend desde `frontend` con `pnpm dev`.

El repositorio no incluye volcados ni scripts de instalación de base de datos. Usa un esquema SQL propio y revisa la configuración de seguridad antes de desplegar el proyecto.
