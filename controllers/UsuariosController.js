const Usuarios = require('../Models/Usuarios');


exports.validarRegistro = (req,res,next)=>{
    

    req.sanitizeBody('Nombre').escape();
    req.sanitizeBody('Email').escape();
    req.sanitizeBody('Contraseña').escape();
    req.sanitizeBody('Confirmar').escape();


    req.checkBody('Nombre', 'El Nombre Es Obligatorio').notEmpty();
    req.checkBody('Email', 'El Email no puede ir vacio').isEmail();
    req.checkBody('Contraseña', 'La Contraseña no puede ir vacio').notEmpty();
    req.checkBody('Confirmar', 'Confirmar Contraseña  no puede ir vacio').notEmpty();
    req.checkBody('Confirmar','La contraseña es diferente').equals(req.body.Contraseña);

    const errores = req.validationErrors();

    if(errores){
        req.flash('error',errores.map(error => error.msg));
        res.redirect('/crear-cuenta')
    }else{
        next();
    }

    return;
}


exports.FormCrearUsuario = (req, res) => {
    res.render('crear-cuenta', {
        NombrePagina: 'Crea Tu Cuenta'
    });
};


exports.CrearUsuario = async (req,res)=>{
    const usuario = req.body
    try {
        await Usuarios.create(usuario);
        // Url Confirmacion 
        const Url = `http://${req.header.host}/confirmar-cuenta/:Url`;

        // Flash Message y Redireccionar 
        req.flash('correcto','Usuario Creado Correctamente')
        res.redirect('/iniciar-sesion')
    } catch (error) {
        // Errores de Sequelize
        const erroresSequelize = error.errors.map(err => err.message);
        
        // Redireccionar y mostrar errores en pantalla
        req.flash('error',erroresSequelize);
        res.redirect('/crear-cuenta');
    }
}

exports.formIniciarSesion =  (req,res)=>{
    res.render('iniciar-sesion',{
         NombrePagina: 'Iniciar Sesion'
    })
}

