let checkout;
const axios = require('axios');
const TipoEnvioSelect =  document.querySelectorAll('.Radio');
const UrlLocal = window.location.origin;
const path = window.location.pathname
const Url = `${UrlLocal}${path}`;
if (Url == 'https://hecemitododulce.click/success') {
    const Header = document.querySelector('.Header');
    Header.remove();
    localStorage.removeItem('direccion');
    const PanelResumenBody = document.querySelector('.PanelResumenBody');
    const Productos = JSON.parse(localStorage.getItem('productoCarrito'));

    Productos.forEach(Producto => {
        const ProductoRes = document.createElement('DIV');
        ProductoRes.classList.add('ProductoResumen')
        const PrecioCompleto = Producto.Precio
        const Precio = PrecioCompleto.split('$')[1];
        ProductoRes.innerHTML = `
            <p class="Nombre">${Producto.Nombre}</p> 
            <p class="Cantidad">${Producto.Cantidad} Unidades</p>
            <p class="PrecioRes">$ ${Precio}</p>
        `
        PanelResumenBody.append(ProductoRes);
    });

    localStorage.removeItem('productoCarrito');
}


if(TipoEnvioSelect){
TipoEnvioSelect.forEach(Radio => {
    Radio.addEventListener('click', e => {
        const Datos = e.target.value;
        let Entrega = {
            'TipoEntrega': Datos
        }
        añadirLocalStorage('TipoEntrega', Entrega);
        VerificarTipoEnvio();
    });
});
}



/********* Direcciones  **********/
const BotonPagar = document.querySelector('#BtnPagar')
    // Seleccionar todos los Input.
const Nombre = document.querySelector('.Nombre');
const Apellido = document.querySelector('.Apellido');
const Telefono = document.querySelector('.Telefono');
const Calle = document.querySelector('.Calle');
const Numeracion = document.querySelector('.Numeracion');
const Ciudad = document.querySelector('.Ciudad');
const Provincia = document.querySelector('.Provincia');
const CP = document.querySelector('.CP');
const Direccion = document.querySelector('.DireccionValor');


if (Direccion) {
    VerificarDatos()
    Direccion.addEventListener('change', function() {
        const Seleccionado = this.options[Direccion.selectedIndex];
        LlenarCamposDireccion(Seleccionado);
        VerificarDatos();
    })
}



// Funciones

function LlenarCamposDireccion(Seleccionado) {
    axios.get('/TomarDirecciones')
        .then(response => {
            const Direcciones = response.data
            Direcciones.forEach(Direccios => {
                if (Direccios.id == Seleccionado.value) {
                    let Direccion = {
                        'Nombre': Direccios.Nombre,
                        'Apellido': Direccios.Apellido,
                        'Telefono': Direccios.Telefono,
                        'Calle': Direccios.Direccion,
                        'Numeracion': Direccios.Numeracion,
                        'Ciudad': Direccios.Ciudad,
                        'Provincia': Direccios.Provincia,
                        'CP': Direccios.CodigoPostal
                    };

                    Nombre.value = Direccios.Nombre;
                    Apellido.value = Direccios.Apellido;
                    Telefono.value = Direccios.Telefono;
                    Calle.value = Direccios.Direccion;
                    Numeracion.value = Direccios.Numeracion;
                    Ciudad.value = Direccios.Ciudad;
                    Provincia.value = Direccios.Provincia;
                    CP.value = Direccios.CodigoPostal;
                    VerificarDatos();
                    añadirLocalStorage('direccion', Direccion);
                }  
            });
        })

        if(Seleccionado.value == "Agregar"){
            location.href =`${UrlLocal}/Direcciones/Agregar`;
        }

}

// Verificar que esten todos los datos completados
function VerificarDatos() {
    const BtnSiguiente = document.querySelector('#BtnSiguiente');
    if (Nombre.value == '' || Apellido.value == '' || Telefono.value == '' || Calle.value == '' || Numeracion.value == '' || Ciudad.value == '' || Provincia.value == '' || CP.value == '') {
        BtnSiguiente.href = '';
    } else {
        BtnSiguiente.href = '/Tipo-Envio';
    }
}

function VerificarTipoEnvio() {
    if(TipoEnvioSelect[0].checked || TipoEnvioSelect[1].checked ){
        const BtnCaja = document.querySelector('#BtnCaja');
        BtnCaja.href = '/pasarela';
    }
}


function añadirLocalStorage(key, productos) {
    return localStorage.setItem(key, JSON.stringify(productos));
}




export default checkout;