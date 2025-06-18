# Car Registry App (Laravel + React)

Este proyecto es una aplicación de ejemplo para registrar coches utilizando un backend en **Laravel 10** y un frontend en **React + Vite**. Incluye funcionalidades de CRUD completo con un `modal` para editar, paginación y select de colores predefinidos.

---

## 🌐 Requisitos

* PHP >= 8.1
* Composer
* Node.js y npm
* Laravel 10
* XAMPP o similar (MySQL y Apache)

---

## ⚙️ Instalación del Backend

1. Clonar el repositorio:

   ```bash
   git clone <repo-url> cars-app && cd cars-app
   ```

2. Instalar dependencias:

   ```bash
   composer install
   ```

3. Configurar entorno:

   ```bash
   cp .env.example .env
   php artisan key:generate
   # Editar .env con la configuración de la base de datos
   ```

4. Migrar la base de datos:

   ```bash
   php artisan migrate
   ```

5. Insertar colores:

   ```bash
   php artisan tinker
   >>> \App\Models\Color::insert([
         ['name' => 'Red'],
         ['name' => 'Blue'],
         ['name' => 'Black'],
         ['name' => 'White'],
       ]);
   >>> exit
   ```

6. Iniciar el servidor:

   ```bash
   php artisan serve
   ```

---

## 🚀 Instalación del Frontend (React)

1. Desde la carpeta `cars-app`, crear proyecto React:

   ```bash
   npm create vite@latest cars-frontend --template react
   cd cars-frontend
   npm install axios
   ```

2. Copiar el contenido del componente `CarList.jsx` en `src/CarList.jsx`.

3. En `src/App.jsx`, importar el componente:

   ```jsx
   import CarList from './CarList';

   function App() {
     return <CarList />;
   }

   export default App;
   ```

4. Iniciar servidor de desarrollo:

   ```bash
   npm run dev
   ```

---

## 📒 Estructura del Backend

* `routes/api.php`: rutas de la API (`/api/cars`, `/api/colors`)
* `app/Models/Car.php`: modelo con relación `color`
* `app/Models/Color.php`: modelo de colores
* `app/Http/Controllers/CarController.php`: CRUD
* `app/Http/Controllers/ColorController.php`: listado de colores

---

## ✅ Funcionalidades

* Agregar, editar (en modal) y eliminar coches
* Paginación automática desde Laravel
* Validación del lado del servidor
* Select de colores cargado desde la base de datos
* Estilizado completo con TailwindCSS

---

## 📅 Roadmap (opcional)

* Autenticación JWT
* Filtro por color o marca
* Exportar en CSV/PDF

---

## 🚫 Posibles Errores

* 422: Validaciones fallidas. Verifica si el campo `color_id` está presente.
* 500: Asegúrate de que la relación `color()` esté en el modelo Car.
* Pantalla en blanco: Verifica que `npm run dev` esté corriendo y que React esté bien enlazado.

---

## ✉️ Contacto

Para dudas técnicas o mejoras, contacta con David (creador del proyecto).
