const express = require('express');
const router = express.Router();


// Importar Controladores
const HomeController = require('../controllers/HomeController');
const TiendaController = require('../controllers/TiendaController');
const NosotrosController = require('../controllers/NosotrosController');
const ContactoController = require('../controllers/ContactoController');
const UsuariosControler = require('../controllers/UsuariosController');
const checkoutController = require('../controllers/checkoutController');
const authController = require('../controllers/authController');
const AdministracionController = require('../controllers/AdministracionController');


module.exports = () => {
    router.get('/', HomeController.MostrarTartas);



    /*********** Seccion De Cuentas  ************/
    // CrearUsuario
    router.get('/crear-cuenta',UsuariosControler.FormCrearUsuario);
    router.post('/crear-cuenta',
    UsuariosControler.validarRegistro, 
    UsuariosControler.CrearUsuario);

    // Autenticar Usuario
    router.get('/iniciar-sesion', UsuariosControler.formIniciarSesion)
    router.post('/iniciar-sesion',
    authController.autenticarUsuario
    );

    // Cerrar Sesion
    router.get('/cerrar-sesion',
        authController.usuarioAutenticado,
        authController.cerrarSesion
    )


    // Resetear Password 
    router.get('/reestablecer', authController.formRestPassword);

    // Enviar Token
    router.post('/restablecer', authController.EnviarToken);
    router.get('/restablecer-password/:Token', authController.ValidarToken);
    router.post('/restablecer-password/:Token', authController.ActualizarContraseña)

    // Mi Cuenta
    router.get('/Mi-cuenta',
    authController.usuarioAutenticado,
    AdministracionController.MiCuenta
    );
    router.get('/Mis-Datos',
    authController.usuarioAutenticado, 
    AdministracionController.MisDatos
    );
    router.post('/Mis-Datos',
    authController.usuarioAutenticado,
    AdministracionController.ActualizarDatos
    );

    // Mis Direcciones
    router.get('/Direcciones',
    authController.usuarioAutenticado,
    AdministracionController.Direcciones
    );
    router.get('/Direcciones/Agregar',
    authController.usuarioAutenticado,
    AdministracionController.FormAgregarDireccion
    );
    router.post('/Direcciones/Agregar', AdministracionController.AgregarDireccion);

    //Editar Direccion
    router.get('/Direcciones/Editar/:Id',
    authController.usuarioAutenticado,
    AdministracionController.FormEditarDireccion
    );
    router.post('/Direcciones/Editar/:Id',
    authController.usuarioAutenticado,
    AdministracionController.EditarDireccion
    );

    //Eliminar Direccion 
    router.delete('/Direcciones/Eliminar/:Id',
    authController.usuarioAutenticado,
    AdministracionController.EliminarDireccion
    );

    // Mis Tarjetas
    router.get('/Mis-Tarjetas',
    authController.usuarioAutenticado,
    AdministracionController.MisTarjetas
    );


    // Tienda
    router.get('/Tienda', TiendaController.CrearTienda);
    router.get('/Tienda/:Url', TiendaController.ProductoUrl);

    // Sobre Nosotros
    router.get('/SobreNosotros', NosotrosController.SobreNosotros);

    // Contacto 
    router.get('/Contacto', ContactoController.Contacto);



    //********* Seccion de Compra  ********/

    // Carrito
    router.get('/carrito', checkoutController.mostrarCarrito);



    // Checkout
    router.post('/checkout',
        authController.usuarioAutenticado,
        checkoutController.mostrarCheckoutMp
    );

    router.get('/TomarDirecciones',
        authController.usuarioAutenticado,
        checkoutController.TomarDirecciones
    )

    router.get('/DatosCompra',
        authController.usuarioAutenticado,
        checkoutController.DatosdeCompra
    );


    //**** Tipo de Envio ****/
    router.get('/Tipo-Envio',
    authController.usuarioAutenticado,
    checkoutController.TipoEnvio
    );


    //**** Pasarela de pago ****/
    router.get('/pasarela',
    authController.usuarioAutenticado,
    checkoutController.PasaraledaPago
    );


    // Tipos de valores de pagos
    router.get('/success',
        authController.usuarioAutenticado,
        checkoutController.FinalizarCompra
    );
    router.get('/rejected',
        authController.usuarioAutenticado,
        checkoutController.FinalizarCompra
    );

    return router;
}