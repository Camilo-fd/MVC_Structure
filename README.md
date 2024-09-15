# **Gestión de Usuarios y Login**

Este proyecto es una aplicación web que permite a los usuarios registrarse, iniciar sesión, y gestionar usuarios mediante la creación, actualización, búsqueda y eliminación de registros. Se basa en un sistema de autenticación utilizando **JSON Web Tokens (JWT)** para la protección de rutas y **bcrypt** para la seguridad de las contraseñas. Además, se manejan sesiones utilizando **express-session**.

## **Características**

- Registro de usuarios con contraseñas cifradas.
- Autenticación de usuarios mediante JWT.
- Creación, búsqueda, actualización y eliminación de usuarios en una base de datos.
- Validación de datos de entrada mediante **express-validator**.
- Protección de rutas y sesiones para usuarios autenticados.

## **Estructura del Proyecto**

La estructura de carpetas del proyecto sigue un patrón MVC (Modelo-Vista-Controlador) para facilitar la organización del código. 

```
projectMVC/
├── public/
│   ├── css/
│   │   ├── index.css
│   │   └── menu.css
│   ├── js/
│   │   ├── index.js
│   │   └── menu.js
│   └── views/
│       ├── menu.html
│       └── index.html
├── server/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── database/
│   │   ├── connection/
│   │   │   ├── mongoDB.js
│   │   │   └── sql.js
│   │   └── dto/
│   │       └── userDto.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── session.js
│   │   ├── sessionExpiration.js
│   │   └── version.js
│   ├── models/
│   │   ├── JWT.js
│   │   ├── SQL.js
│   │   └── userModel.js
│   ├── routes/
│   │   └── userRoutes.js
│   └── validators/
│       └── userValidator.js
├── .env
├── .gitignore
├── app.js
├── package-lock.json
├── package.json
└── README.md
```


## **Dependencias**

### 1. **bcrypt** (`^5.1.1`)
   - **Descripción:** Se usa para cifrar las contraseñas de los usuarios antes de almacenarlas y para compararlas durante el proceso de login.
   - **Uso:** Al registrar un usuario, la contraseña es cifrada antes de ser guardada en la base de datos. Al iniciar sesión, la contraseña ingresada es comparada con la cifrada almacenada.

### 2. **cookie-parser** (`^1.4.6`)
   - **Descripción:** Permite analizar las cookies enviadas con las solicitudes del cliente.
   - **Uso:** Se utiliza para manejar las cookies de sesión y JWT, lo que permite realizar operaciones como recordar usuarios que hayan iniciado sesión previamente.

### 3. **dotenv** (`^16.4.5`)
   - **Descripción:** Carga las variables de entorno desde un archivo `.env` en `process.env`.
   - **Uso:** Se utiliza para manejar configuraciones sensibles como claves secretas de JWT, contraseñas de bases de datos, y otros valores que no deben estar expuestos en el código.

### 4. **express** (`^4.19.2`)
   - **Descripción:** Framework de Node.js que se utiliza para manejar las solicitudes HTTP, definir rutas, y servir archivos estáticos.
   - **Uso:** Es la base del servidor web del proyecto. Todas las rutas de autenticación y gestión de usuarios se definen mediante Express.

### 5. **express-session** (`^1.18.0`)
   - **Descripción:** Middleware que permite manejar sesiones en Express, almacenando información en el lado del servidor.
   - **Uso:** Se utiliza para mantener la sesión del usuario, lo que permite implementar funciones como "mantenerme conectado" y controlar el acceso a rutas protegidas.

### 6. **express-validator** (`^7.2.0`)
   - **Descripción:** Librería para validar y desinfectar datos de entrada, como formularios de registro y login.
   - **Uso:** Se emplea en el proceso de registro y login para asegurarse de que los datos ingresados cumplan con ciertos criterios, como formato de email válido y contraseñas seguras.

### 7. **jsonwebtoken** (`^9.0.2`)
   - **Descripción:** Implementa JSON Web Tokens (JWT) para autenticar y proteger rutas.
   - **Uso:** Después de que un usuario inicia sesión, se genera un JWT que es enviado al cliente. Este token se utiliza para verificar la autenticidad del usuario en cada solicitud a rutas protegidas.

### 8. **jwt-decode** (`^4.0.0`)
   - **Descripción:** Decodifica JWTs para obtener información del payload.
   - **Uso:** Se utiliza en el frontend o en middlewares para obtener los datos del token y verificar la información del usuario.

### 9. **mongoose** (`^8.6.0`)
   - **Descripción:** ODM (Object Data Modeling) para MongoDB que permite interactuar con la base de datos de una forma más sencilla.
   - **Uso:** Define el esquema de los usuarios y proporciona métodos para realizar operaciones CRUD (crear, leer, actualizar y eliminar) en la base de datos.

### 10. **semver** (`^7.6.3`)
   - **Descripción:** Librería para manejar versiones semánticas.
   - **Uso:** Aunque no es esencial para el flujo principal, se puede usar para manejar y validar versiones de paquetes o configuraciones.

### 11. **sequelize** (`^6.37.3`)
   - **Descripción:** ORM (Object Relational Mapping) para bases de datos SQL. 
   - **Uso:** Se utiliza para conectar y realizar operaciones CRUD en bases de datos SQL. En este caso, es posible que se utilice si hay otra base de datos SQL involucrada en la gestión de usuarios, además de MongoDB.

## **Explicación del Código Relevante**

### **1. Autenticación con JWT**

En este proyecto, JWT se usa para manejar la autenticación. Después de un login exitoso, se genera un token y se envía al cliente, donde puede almacenarse en las cookies.

**Ejemplo de generación de JWT en `authController.js`:**

```js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: 'Usuario no encontrado' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Contraseña incorrecta' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true });

  res.status(200).json({ message: 'Login exitoso', token });
};
```

### **2. Middleware de Autenticación**

El middleware authMiddleware.js verifica que el usuario esté autenticado antes de permitir el acceso a ciertas rutas.

```js
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token inválido' });
  }
};

```

### **3. Manejo de Usuarios**

El controlador userController.js maneja las operaciones CRUD para los usuarios, incluyendo la creación, búsqueda, actualización y eliminación de usuarios.

```js
exports.createUser = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  res.status(201).json({ message: 'Usuario creado exitosamente' });
};

```

## **Como Ejecutar el Proyecto**

### 1. Clona este repositorio:

```bash
git clone https://github.com/Camilo-fd/projectMVC
```

### 2. Instala las dependencias:

```bash
npm install bcrypt cookie-parser dotenv express express-session express-validator jsonwebtoken jwt-decode mongoose semver sequelize
```

### 3. Crea un archivo .env en la raíz del proyecto con las siguientes variables:

```env
EXPRESS_PORT=
EXPRESS_STATIC=""

CONECTION_MONGODB=""
CONECTION_SQL=""

PASSPORD_SECRET=""
TIME_EXPIRATION=
```

### 4. Ejecuta el servidor:

```bash
npm run dev
```