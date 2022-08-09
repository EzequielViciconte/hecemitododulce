let General;
let Alerta = document.querySelector('.alerta');

if(Alerta){
    LimpiarAlertas();
}


function LimpiarAlertas(){
    const Alertas = document.querySelector('.alertas')
    const Interval = setInterval(() => {
        if(Alertas.children.length > 0 ){
            Alertas.removeChild(Alertas.children[0]);
        }else if(Alertas.children.length == 0)
        {
            Alertas.parentElement.removeChild(Alertas);
            clearInterval(Interval);
        }
    }, 1000);
}


export default General;