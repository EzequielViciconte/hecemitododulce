const mercadopago = require("mercadopago");
const Orden = require("../Models/Orden");
const DetallesOrden = require("../Models/OrdenDetalles");
const Usuarios = require("../Models/Usuarios");
const ProductosBD = require('../Models/Productos');
const DireccionesBD = require('../Models/Direcciones');
const enviarEmail = require('../handlers/email');
const PDF = require('pdfkit-construct');
const Crypto = require('crypto');
const fs = require('fs');


var preference = {
    items: [],
    back_urls: {},
    payer: {},
    shipments: {
        "cost": 0,
        "mode": "not_specified"
    },
    auto_return: "approved",
    payment_methods: {
        "installments": 1
    },
    statement_descriptor: "HecemiTodoDulce"

}

exports.mostrarCarrito = (req, res) => {
    res.render('Carrito', {
        NombrePagina: 'Carrito',
    });
}



exports.DatosdeCompra = async(req, res, next) => {
    const UsuarioId = req.user.id;
    const Direcciones = await DireccionesBD.findAll({
        where: {
            UsuarioId
        }
    })

    const { Nombre, Email } = req.user;


    res.render('DatosEntrega', {
        NombrePagina: 'Datos del Cliente',
        Direcciones,
        Nombre,
        Email
    })
}

exports.TomarDirecciones = async(req, res) => {
    const Direccion = await DireccionesBD.findAll();
    res.send(Direccion)
}


//***** Pasarela de Pago *****/

exports.PasaraledaPago = (req, res) => {
    res.render('PasarelaDepago', {
        NombrePagina: 'Datos del Cliente',
    })
}

exports.mostrarCheckoutMp = async(req, res, next) => {
    const Productos = req.body.Productos;
    const Direccion = req.body.Direccion;
    



    const Email = req.session.passport.user.Email
    const usuario = await Usuarios.findOne({ Email });
    const ProductossBD = await ProductosBD.findAll()

    for (let i = 0; i < Productos.length; i++) {
        const id = Productos[i].id
        let Precio;
        ProductossBD.forEach(productoBD => {
            if (id == productoBD.Id) {
                Precio = productoBD.Precio;
            }
        });

        preference.items.push({
            title: Productos[i].Nombre,
            unit_price: Number(Precio),
            currency_id: 'ARS',
            quantity: Number(Productos[i].Cantidad),
        });

        preference.payer = {
            "name": usuario.Nombre,
            "email": usuario.Email,
            "phone": {
                "area_code": "11",
                "number": Number(Direccion.Telefono)
            },
            "address": {
                "street_name": Direccion.Calle,
                "zip_code": Direccion.CP
            }
        }
    }

    const UrlLocal = req.protocol
    preference.back_urls = {
        "success":  `${UrlLocal}://hecemitododulce.herokuapp.com/success`,
        "failure":  `${UrlLocal}://hecemitododulce.herokuapp.com/rejected`,
        "pending":  `${UrlLocal}://hecemitododulce.herokuapp.com/feedback`
    }

    if (preference.items.length == 0) {
        res.redirect('/')
        return next();
    }

    const response = await mercadopago.preferences.create(preference);
    const Url = response.response.init_point
    res.json(Url);
}




exports.FinalizarCompra = async(req, res, next) => {
    const Datos = req.query;
    const Comprador = req.user;




    if (Datos.status == 'null') {
        res.redirect('/');
        return next();
    }


    let order = ({
        Nombre: Comprador.Nombre,
        email: Comprador.Email,
        Payment_id: Datos.payment_id,
        Status: Datos.status,
        FechaCompra: new Date(),
        Payment_type: Datos.payment_type
    })

    try {
        await Orden.create(order);
    } catch (error) {}

    

    //Insertar Detalles de Ventas
    const OrderBus = await Orden.findOne({
        where: {
            Payment_id: Datos.payment_id
        }
    });


    var options = {weekday: "long", year: "numeric", month: "long", day: "numeric"};
    const Productos = preference.items;
    const Direccion = preference.payer.address.street_name
    let Total= 0;
    let TotalFinal=0;

    Productos.forEach(Producto =>{
        const Precio = Number(Producto.unit_price)
        const Cantidad = Number(Producto.quantity);

        Total = Precio * Cantidad;
        TotalFinal = TotalFinal + Precio * Cantidad;

    });

    //******* Crear PDF Factura *******/
    const doc = new PDF();


    doc.setDocumentHeader({
        height: '20'
    }, () => {
        doc.fontSize(14).text('HECEMITODODULCE FACTURA', {
            width: 420,
            align: 'center'
        });

        doc.fontSize(12);

        doc.text(`Nombre:${Comprador.Nombre}`, {
            width: 420,
            align: 'left'
        });

        doc.text(`Email:${Comprador.Email}`, {
            width: 420,
            align: 'left'
        });


        doc.text(`Direccion: ${Direccion}`, {
            width: 420,
            align: 'left'
        });
        doc.text(`Fecha de Compra: ${new Date().toLocaleDateString("es-ES", options)}`, {
            width: 420,
            align: 'left'
        });


    })
    doc.addTable([
        { key: 'title', label: 'Producto', align: 'left' },
        { key: 'unit_price', label: 'Precio Unit', align: 'left' },
        { key: 'quantity', label: 'Cantidad', align: 'left' },
    ], Productos, {
        border: null,
        width: "fill_body",
        striped: true,
        stripedColors: ["#f6f6f6", "#d6c4dd"],
        cellsPadding: 10,
        marginLeft: 45,
        marginRight: 45,
        headAlign: 'center'
    });


    doc.setDocumentFooter({
        height:'30'
    },()=>{
        doc.fontSize(15).text(`Total:$${TotalFinal}`,doc.footer.x +50,doc.footer.y +1)
    })

    doc.render();

    const NombrePDF = `Factura${Crypto.randomBytes(5).toString('hex')}`;
    
    console.log(`${__dirname}/../../public/Facturas/${NombrePDF}.pdf`);
    doc.pipe(fs.createWriteStream(`./public/Facturas/${NombrePDF}.pdf`));

    doc.end();



    //******* Crear el detalle de la Orden  *******/
    Productos.forEach(async Producto => {
        const ProductosReq = await ProductosBD.findOne({
            where: {
                Titulo: Producto.title
            }
        })

          
    return;
    
let DetalleOrden = ({
            Cantidad: Producto.quantity,
            Precio: ProductosReq.Precio * Producto.quantity,
            ProductoId: ProductosReq.Id,
            OrdenId: OrderBus.id
        });

        try {
            await DetallesOrden.create(DetalleOrden);
            preference.items = [];
        } catch (error) {
            console.log(error);
        }
    })




    // Enviar Notificaion Por Email
    await enviarEmail.EnviarFactura({
        usuario: Comprador,
        subject: 'Orden de Compra',
        NombrePDF,
        Archivo: 'OrdendeCompra'
    });


    req.flash('correcto', 'Compra Realizada correctamente,le enviaremos un email la factura De su compra');

    res.render('Orden', {
        NombrePagina: 'Orden',
        mensajes: req.flash(),
        order
    })

}

