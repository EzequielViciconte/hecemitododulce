const express = require("express");
const path = require("path");
const cors = require("cors");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mercadopago = require("mercadopago");
const router = require("./Routes");
const passport = require("./config/passport");
const expressValidator = require("express-validator");

require("dotenv").config({ path: "variables.env" });

//Helpers con algunas funciones
const Helpers = require("./helpers");

// Crear a conexion con DB
const db = require("./config/db");

// Importar el modelos
require("./Models/Productos");
require("./Models/Usuarios");
require("./Models/Orden");
require("./Models/OrdenDetalles");
require("./Models/Direcciones");

db.sync()
  .then(() => console.log("Conectado con Exito"))
  .catch((error) => console.log(`No se pudo conectar ${error}`));

// Variables de Desarrollo
require("dotenv").config({ path: "variables.env" });

// Crear La app
const app = express();

mercadopago.configure({
  access_token: process.env.ACCESSTOKEN,
});

// Habilitar BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Validar Campos
app.use(expressValidator());

//Habilitar Pug
app.set("view engine", "pug");

//Static Files
app.use(express.static(path.join(__dirname, "public")));

// Habilitar cookie parser
app.use(cookieParser());

// Crear Sesion
app.use(
  session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
  })
);

//Habilitar Cors
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

// Agregar Flash Msg
app.use(flash());

// Middleware Propio (Usuario logueado,flash message,fecha actual)
app.use((req, res, next) => {
  res.locals.usuario = { ...req.user } || null;
  res.locals.mensajes = req.flash();
  res.locals.Año = new Date().getFullYear();
  res.locals.Protocol = req.protocol;
  res.locals.vardump = Helpers.vardump;
  next();
});

app.use("/", router());

const host = "0.0.0.0";
const port = process.env.PORT;
app.listen(port, host, () => {
  console.log("el servidor esta funcionando");
});
