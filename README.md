
# APP MÉDICA UCV

Aplicación web para el registro, monitoreo y gestión de alertas médicas y usuarios en un entorno universitario. Diseñada con PHP, MySQL, HTML, JavaScript y CSS, esta herramienta permite la administración eficiente de recerva de canchas dentro de la comunidad universitaria.

---

## 🖥️ Requisitos para ejecutar el proyecto

### 🔧 Software necesario

- **[XAMPP](https://www.apachefriends.org/es/index.html)** (versión recomendada: PHP 8.0+)
- **[Visual Studio Code](https://code.visualstudio.com/)** con extensiones:
  - PHP Extension Pack
  - Live Server (opcional)
  - MySQL o PHPMyAdmin (para la base de datos)
- **Git** (opcional, para clonar y trabajar en el repositorio)

---

## ⚙️ Pasos para levantar el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/elvis-v12/FutCamp.git
cd APP-Medica-UCV
```

### 2. Configurar entorno local

- Inicia **XAMPP** y activa los módulos `Apache` y `MySQL`.
- Copia la carpeta del proyecto a la ruta:
  `C:\xampp\htdocs\APP-Medica-UCV`

### 3. Importar la base de datos

- Abre **phpMyAdmin** desde `http://localhost/phpmyadmin`
- Crea una base de datos llamada `futcamp`
- Importa el archivo `.sql` ubicado en la carpeta `/BaseDatos` del proyecto

### 4. Ejecutar la aplicación

Abre el navegador y dirígete a:

```
http://localhost/FutCamp/Servidor/Vista/index.html
```

---

## 🛠️ Comandos útiles de Git

### Clonar el repositorio

```bash
git clone https://github.com/elvis-v12/FutCamp.git
```

### Crear una nueva rama

```bash
git checkout -b nombre-de-rama
```

### Ver todas las ramas disponibles

```bash
git branch -a
```

### Hacer cambios y subirlos

```bash
git add .
git commit -m "Mensaje claro y conciso sobre el cambio"
git push origin nombre-de-rama
```

### Combinar cambios (merge)

```bash
git checkout main
git pull origin main
git merge nombre-de-rama
```

---

## 📁 Estructura del proyecto

```
FutCamp/
│
├── BaseDatos/              → Archivos .sql para importar en phpMyAdmin
├── Cliente/                → Lógica del cliente (formularios, vistas, js)
├── Servidor/
│   ├── Controlador/        → Archivos PHP que gestionan la lógica de negocio
│   ├── Modelo/             → Conexión a base de datos y consultas SQL
│   └── Vista/              → Interfaces HTML, JS y CSS
└── README.md               → Documentación del proyecto
```

---

## 👨‍💻 Buenas prácticas

- Usar **nombres descriptivos** para ramas y commits.
- Validar **cambios localmente** antes de hacer `push`.
- Mantener el código **modular y organizado** en carpetas (MVC).
- Hacer `pull` regularmente para mantener el repositorio actualizado.
