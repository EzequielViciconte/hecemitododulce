const Direcciones = require('../Models/Direcciones')
const Usuarios = require('../Models/Usuarios')

exports.MiCuenta = (req, res) => {
    res.render("Mi-Cuenta", {
        NombrePagina: "Mi Cuenta",
    });
};


exports.MisDatos =async (req, res) => {
    const Usuario = await Usuarios.findOne({where:{
        id:req.user.id
    }});
    res.render("Mis-Datos", {
        NombrePagina: "Mis Datos",
        Usuario
    });
};

exports.ActualizarDatos = async (req,res) => {
    const Usuario = await Usuarios.findOne({where:{
        id:req.user.id
    }});


    try {
        await Usuario.update({
            Nombre:req.body.Nombre,
            Email:req.body.Email
        });
    // Notificacion
    req.flash('correcto', 'Cambios Guardados Correctamente');
    // Redirect
    res.redirect('/Mi-Cuenta');
    } catch (error) {
        req.flash('error','Todos los Campos Son Obligatorios');
        res.redirect(`/Mis-Datos`);
        
    }



    
}




//********** Direcciones  ***********/

exports.Direcciones = async(req, res) => {
    const UsuarioId = req.user.id;
    const direcciones = await Direcciones.findAll({
        where: {
            UsuarioId
        }
    });

    res.render("Direcciones", {
        NombrePagina: "Direcciones",
        direcciones
    });
};

exports.FormAgregarDireccion = (req, res) => {
    const usuarioId = req.user.id;

    res.render("AgregarDireccion", {
        NombrePagina: "Agregar Direcciones",
        usuarioId
    });
}

exports.AgregarDireccion = async(req, res) => {
    const Direccion = req.body;
    try {
        await Direcciones.create(Direccion);
        // Flash Message y Redireccionar 
        req.flash('correcto', 'Direccion Guardada Correctamente')
        res.redirect('/Direcciones')
    } catch (error) {
        req.flash('error','Todos los Campos son Obligatorios');
        res.redirect('/Direcciones/Agregar')
    }
}


exports.FormEditarDireccion = async(req, res) => {
    const id = req.params.Id;
    const usuarioId = req.user.id;
    const Direccion = await Direcciones.findOne({
        where: {
            id
        }
    });
    res.render('EditarDireccion', {
        NombrePagina: 'Editar Direccion',
        Direccion,
        usuarioId
    })
}

exports.EditarDireccion = async(req, res) => {
    const Datos = req.body;
    const id = req.params.Id;
try {
    await Direcciones.update({
        Nombre: Datos.Nombre,
        Apellido: Datos.Apellido,
        Telefono: Datos.Telefono,
        Direccion: Datos.Direccion,
        Numeracion: Datos.Numeracion,
        Ciudad: Datos.Ciudad,
        Provincia: Datos.Provincia,
        CodigoPostal: Datos.CodigoPostal
    }, { where: { id } });
    req.flash('correcto','Editado Correctamente');
    res.redirect('/Direcciones');
} catch (error) {
    req.flash('error','Todos Los campos son Obligatorios')
    res.redirect(`/Direcciones/Editar/${id}`);
}
}


exports.EliminarDireccion = async (req,res)=>{
    const {Id} = req.params
    const Resultado = await Direcciones.destroy({where: {id:Id}});
    res.json(Resultado);

}




//********** Mis tarjetas   ***********/

exports.MisTarjetas = (req, res) => {
    res.render("Mis-Tarjetas", {
        NombrePagina: "Mis tarjetas",
    });
};