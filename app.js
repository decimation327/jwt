const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:4200' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const secretKey = 'tu_secreto_secreto'; // Cambia esto por una clave secreta segura en un entorno de producción

// Middleware de autenticación con JWT
function authenticateJWT(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó el token de autenticación.' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido.' });
    }
    req.user = user;
    next();
  });
}

// Ruta de inicio de sesión (para demostración)
app.post('/login', function (req, res) {
  // Aquí verificarías las credenciales del usuario, por ejemplo, en una base de datos
  // Para esta demo, simplemente asumimos que el inicio de sesión es exitoso

  const userData = {
    id: 123,
    username: 'usuario123',
    role: 'admin' // Cambia esto dependiendo de los roles del usuario
  };

  const token = jwt.sign(userData, secretKey, { expiresIn: '1h' }); // Token válido por 1 hora
  return res.status(200).json({ token });
});

// Ruta protegida con autenticación JWT
app.get('/protected', authenticateJWT, function (req, res) {
  // Si se llega aquí, el token es válido y el usuario está autenticado
  // Puedes acceder a los datos del usuario en req.user

  return res.status(200).json({
    message: 'Ruta protegida con JWT.',
    user: req.user
  });
});

app.listen(10101, function () {
  console.log('servidor en port 10101');
});
