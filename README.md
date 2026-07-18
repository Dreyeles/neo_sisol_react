# SISOL - Sistema de Citas Médicas

[**Ver Aplicación en Vivo (Modo Demo)**](https://neo-sisol-react.vercel.app)

Este proyecto es un sistema integral de gestión de citas médicas desarrollado con React (Frontend) y Node.js/Express (Backend).

---

## ⚡ Vista Previa y Modo Demo

Para facilitar la evaluación del proyecto sin necesidad de configurar una base de datos local, se ha habilitado una **[Demo en Vivo](https://neo-sisol-react.vercel.app)**.

Al abrir el modal de **Iniciar Sesión**, puedes usar los botones de **Acceso Rápido Demo** para ingresar instantáneamente con datos simulados y persistentes bajo tres roles:
*   👤 **Paciente**: Permite ver citas pasadas y futuras, agendar nuevas citas (con simulación de pasarela de pagos) y descargar PDFs.
*   🩺 **Médico**: Permite gestionar la agenda del día, registrar diagnósticos, recetas médicas, signos vitales de triaje y subir archivos.
*   ⚙️ **Administrador**: Permite gestionar y editar el catálogo de médicos, especialidades y servicios de la clínica.

---

## Guía de Instalación Local

Si deseas ejecutar el proyecto de forma local con la base de datos conectada, sigue estos pasos:

### 1. Requisitos Previos

*   **Node.js** (v18 o superior)
*   **MySQL** (Workbench recomendado para la gestión de la BD)

### 2. Clonar e Instalar

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/Dreyeles/neo_sisol_react.git
    cd neo_sisol_react
    ```

2.  **Instalar todas las dependencias (Frontend y Backend):**
    Ejecuta el siguiente comando en la raíz del proyecto. Este instalará también los paquetes del backend de forma automática:
    ```bash
    npm install
    ```

### 3. Configuración de la Base de Datos

Como la base de datos es local, debes ejecutar los scripts en tu propio Workbench en el siguiente orden:

1.  **Crear la base de datos:** Ejecuta el archivo `init-database.sql` que está en la raíz del proyecto.
2.  **Crear el esquema:** Ejecuta el archivo `database/schema.sql`.
3.  **Cargar datos iniciales (Seeds):** Ejecuta los scripts en la carpeta `database/` en este orden:
    *   `populate-especialidades.sql`
    *   `seed_medicos.sql`
    *   `seed_disponibilidades.sql`
    *   `create_admin.sql` (para tener acceso de administrador)

### 4. Variables de Entorno

En la carpeta `backend/`, crea un archivo llamado `.env` basándote en el archivo `.env.example`:

1.  Copia `backend/.env.example` y renómbralo a `backend/.env`.
2.  Edita `backend/.env` con tus credenciales locales de MySQL:
    ```env
    DB_PASSWORD=tu_contraseña_de_mysql
    ```

### 5. Ejecutar el Proyecto

Desde la **carpeta raíz**, ejecuta:

```bash
npm run dev:all
```

Esto iniciará simultáneamente el servidor de desarrollo del frontend (`http://localhost:3000`) y el servidor del backend (`http://localhost:5000`).

---

## Tecnologías Utilizadas

- **Frontend:** React 18, Vite, Lucide React, jspdf.
- **Backend:** Node.js, Express, MySQL2.
- **Herramientas:** Concurrently (para ejecución simultánea).

## Verificación de Conexión

Una vez iniciado el servidor, puedes probar la conexión a la base de datos en:
`http://localhost:5000/api/test-db`

---

## Autor / Desarrollador

Este sitio web fue diseñado, desarrollado y optimizado de forma integral por:

*   **Nombre:** Drey E. Aymituma Julca
*   **Rol Profesional:** Desarrollador Full Stack (Frontend, Backend & Bases de Datos)
*   **LinkedIn:** [drey-aymituma-b2320a207](https://www.linkedin.com/in/drey-aymituma-b2320a207)
*   **GitHub:** [@Dreyeles](https://github.com/Dreyeles)
*   **Contacto:** drewgamer681@gmail.com

