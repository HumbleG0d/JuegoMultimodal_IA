# Juego Educativo Generado mediante IA

Una plataforma web completa para la gestión y realización de quizzes educativos, diseñada para facilitar el aprendizaje interactivo entre estudiantes y profesores.

## 🎯 Características Principales

- **Sistema de Autenticación**: Registro e inicio de sesión seguro para estudiantes y profesores
- **Gestión de Quizzes**: Creación, edición y eliminación de quizzes por parte de los profesores
- **Asignación de Tareas**: Los profesores pueden asignar quizzes específicos a estudiantes
- **Interfaz Intuitiva**: Diseño moderno y responsivo con navegación clara
- **Roles de Usuario**: Diferenciación entre estudiantes y profesores con funcionalidades específicas
- **Reportes y Seguimiento**: Visualización de resultados y progreso

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React** con TypeScript
- **Tailwind CSS** para estilos
- **React Router** para navegación
- **Lucide React** para iconografía

### Backend
- **Node.js** con Express
- **PostgresSQL** como base de datos
- **JWT** para autenticación
- **bcryptjs** para encriptación de contraseñas


## Instalación
- Clonar el repositorio
- **Frontend**: Acceder a la carpeta frontend  y en la terminal colocar los siguientes comandos.
    ```bash
    npm install 
    npm run dev
    ``` 
-  **Backend**: Acceder a la carpeta backend y en la terminal colocar los siguientes comandos.
    ```bash
    docker-compose up --build -d 
    ``` 
    y ejecutar el script **api.py**


## 👥 Roles de Usuario

### Profesor
- Crear nuevos quizzes con preguntas de opción múltiple
- Ver y gestionar todos los quizzes creados
- Asignar quizzes específicos a estudiantes
- Eliminar quizzes existentes
- Acceso a dashboard de gestión

### Estudiante
- Ver quizzes asignados
- Realizar quizzes interactivos
- Ver resultados y calificaciones
- Acceso a dashboard personalizado

## 🔧 Funcionalidades Técnicas

### Gestión de Estado
- Estado local con React hooks (useState, useEffect)
- Manejo de formularios controlados
- Gestión de autenticación con contexto

## 🎨 Interfaz de Usuario

- **Diseño Responsivo**: Adaptable a diferentes tamaños de pantalla
- **Navegación Intuitiva**: Barra de navegación con opciones contextuales
- **Formularios Dinámicos**: Creación de quizzes con múltiples preguntas
- **Feedback Visual**: Indicadores de estado y mensajes de confirmación

## 🔄 Actualizaciones Automáticas

- Recarga automática de listas después de operaciones CRUD
- Sincronización en tiempo real de datos
- Manejo eficiente de estados de carga

## 🚦 Estado del Proyecto

El proyecto está en desarrollo activo con las siguientes funcionalidades implementadas:

- ✅ Sistema de autenticación completo
- ✅ Creación y gestión de quizzes
- ✅ Dashboard para profesores y estudiantes
- ✅ Asignación de quizzes
- ✅ Interfaz responsiva
- 🔄 Sistema de calificaciones (en desarrollo)
- 🔄 Reportes avanzados (planeado)


## 👨‍💻 Autor

Desarrollado como proyecto educativo para el aprendizaje de tecnologías web modernas.
