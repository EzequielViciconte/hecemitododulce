const Productos = require('../Models/Productos');


exports.CrearTienda = async(req, res, next) => {
    const productos = await Productos.findAll()

    if (!productos) return next();

    res.render('Tienda', {
        NombrePagina: 'Tienda Hecemi',
        productos
    })
};


// Entrar a productos segun su Url
exports.ProductoUrl = async(req, res, next) => {
    let Admin = false;
    const Producto = await Productos.findOne({
        where: {
            Imagen: req.params.Url
        }
    });

    const productos = await Productos.findAll();
    if (!Producto) return next();

    if(req.user){
        if(req.user.Nombre == 'Emilse Natalia Amposta'){
            Admin = true;
        }
    }

    //Render a la Vista
    res.render('Producto', {
        NombrePagina: Producto.Titulo,
        Producto,
        productos,
        Admin
    })
}


// Editar Producto
exports.FormEditarProducto = async (req,res,next) =>{
    const Producto = await Productos.findOne({
        where: {
            Id: req.params.Id
        }
    });

    if (!Producto) return next();

    //Render a la Vista
    res.render('EditarProducto', {
        NombrePagina: Producto.Titulo,
        Producto
    })
}

exports.EditarProducto = async (req,res) => {
    const Producto = await Productos.findOne({
        where: {
            Id: req.params.Id
        }
    });
    try {
        await Producto.update({
            Titulo:req.body.NombreTarta,
            Precio:req.body.Precio,
            Descripcion:req.body.Descripcion
        })
        // Notificacion
        req.flash('correcto', 'Cambios Guardados Correctamente');
        // Redirect
        res.redirect(`/Tienda/${Producto.Imagen}`);
    } catch (error) {
        console.log(error);
    }
}