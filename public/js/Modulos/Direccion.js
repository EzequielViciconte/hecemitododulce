let Direccion;
import axios from 'axios';
import Swal from 'sweetalert2'
const BotonesBorrar = document.querySelectorAll('#BtnEliminar');
const BotonesMenu = document.querySelectorAll('.BotonMenDireccion');

BotonesMenu.forEach(BtnMenu=>{
  BtnMenu.addEventListener('click',MostrarMenuDireccion);
})




BotonesBorrar.forEach(BtnBorrar=>{
    BtnBorrar.addEventListener('click',e =>{
        const Direccion = e.target.parentElement.parentElement.parentElement.parentElement.parentElement;
        const DireccionId = e.target.parentElement.dataset.id

        Swal.fire({
            title: 'Estas seguro de eliminar?',
            text: "Una ves eliminado No se podra recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminalo!'
          }).then((result) => {
            if (result.value) {
                const url = `${location.origin}/Direcciones/Eliminar/${DireccionId}`;
                axios.delete(url,{params:{DireccionId}})
                    .then(function(respuesta){
                        Swal.fire(
                            'Eliminado!',
                            'Su direccion se elimino correctamente.',
                            'success'
                          )
                          
                          Direccion.remove();

                    })
            }
          })

    });
})


//Funciones
function MostrarMenuDireccion(e){
 const ElementoPadre =e.target.parentElement;
 const BotonesDireccion = ElementoPadre.lastElementChild;
 BotonesDireccion.classList.toggle('Invisible');
 CerrarMenuDirAfu(ElementoPadre,BotonesDireccion);
}


function CerrarMenuDirAfu (ElementoPadre,BotonesDireccion) {
  window.addEventListener('click', function(e){
    if(!ElementoPadre.contains(e.target.parentElement)){
      BotonesDireccion.classList.add('Invisible')
    }
  })
}


export default Direccion;