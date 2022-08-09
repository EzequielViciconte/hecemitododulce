const Galeria = document.querySelector('.Galeria');
const DivImgGrande = document.querySelector('.fullImg');
const btnCerrarGaleria = document.querySelector('.CerrarGaleria');

if(Galeria){
btnCerrarGaleria.addEventListener('click',CerrarGaleria);
}

 document.querySelectorAll('.ImagenGal').forEach(ImgGaleria => {
    ImgGaleria.addEventListener('click',function(e){
        const ImagenSola = e.target;
        const ImagenGrande = document.querySelector('.ImagenGrande');
        ImagenGrande.src = ImagenSola.src
        DivImgGrande.classList.remove('Invisible')
    })
 });



 //Funcion para Cerrar la galeria
 function CerrarGaleria(){
    DivImgGrande.classList.add('Invisible')
 }


export default Galeria;


