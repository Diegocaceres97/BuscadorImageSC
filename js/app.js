const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const numero = document.querySelector('#numero');
const paginacionDiv = document.querySelector('#paginacion');
let totalPaginas;
let iterador;
let paginaActual=1;
window.onload = () =>{
    formulario.addEventListener('submit',validarFormulario);
}
function validarFormulario(e){
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;
    if(terminoBusqueda==''){
       mostrarAlerta("AGREGA ALGO");
        return;
    }
buscarImagen();
}

function mostrarAlerta(mensaje){
    const existe = document.querySelector('.bg-red-100');
    if (!existe) {
        const alerta = document.createElement('p');
    alerta.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3','rounded','max-w-lg','mx-auto','mt-6','text-center');

    alerta.innerHTML = `
    <strong class="font-bold">Error!</strong>
    <span class="block sm:inline">${mensaje}</span>
    `;

    formulario.appendChild(alerta);

    setTimeout(() => {
        alerta.remove();
    }, 3000);
    }
    
}
function buscarImagen(){
    const termino = document.querySelector('#termino').value;
    const cantidad = numero.value;
    if (cantidad < 3) {
        alert("la cantidad de imagenes no puede ser menor a 3");
        return;
    }
const key = '18325287-10587b6ec09283a22f4722e3d';
const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${cantidad}&page=${paginaActual}`;
fetch(url).then(respuesta=>respuesta.json()).then(resultado=>{
   totalPaginas= calcularPaginas(resultado.totalHits);
    mostrarimagenes(resultado.hits);
})
}
//generador que va registrar la cantidad de paginas de acuerdo a estas
function * crearPaginados(total){//este tipo de funciones se llama generador    
    for(i=1;i<=total;i++){
       yield i;
    }
}
function mostrarimagenes(imagenes){
    while(resultado.firstChild){
    resultado.removeChild(resultado.firstChild);
}
//Iterar sobre el arreglo de imagenes y construimos sobre el html
imagenes.forEach(element => {
    const {previewURL,likes,views,largeImageURL}= element;
    resultado.innerHTML += `
    <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
        <div class="bg-white">
            <img class="w-full"  style="height:200px" src="${previewURL}" >

            <div class="p-4">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAA9klEQVRIS9WV4RHBQBCFv1SACtCBEuhACZSgAyqgA5SgAjowOqADKmBeJsmcw+wl7A/3M7n73r7dy0uG88qc+dQVmABLYAZsUoqrIyD4OoD2gbMlkioQw8X9mcAAOEaVngA9N5flQJA90I5ImsHKpIM55CvQegNKao/OhQ6GxRB7wfN7SpXRHg1+ChxiAb3oFptL4SYCQogll08OQti3AhU7bNFfCVwAzdKtRRpyHiUeLboV1euKuwgsgHl5dT0cdIC8eg8HW0DBWK1fO3iJkFAgzJ0mH9oOGMfREmeRrpbioonAqMyfTy1qkGv2Eet/YBOMHe4CD5cBMxn/4QbGAAAAAElFTkSuQmCC"/><p class="font-bold"> ${likes} <span class="font-light"> Me Gusta </span> </p>
                <p class="font-bold"> ${views} <span class="font-light"> Veces Vista </span> </p>

                <a 
                    class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                    href="${largeImageURL}" target="_blank" rel="noopener noreferrer" 
                >
                    Ver Imagen HD
                </a>
            </div>
        </div>
    </div>
`;
});
//limpiar el paginador previo
while(paginacionDiv.firstChild){
    paginacionDiv.removeChild(paginacionDiv.firstChild);
}
imprimirIterador();
}
function calcularPaginas(total){
    console.log(total);
    return parseInt(Math.ceil(total/numero.value));
}
function imprimirIterador(){
    iterador = crearPaginados(totalPaginas);
    while (true) {
        const {value,done}=iterador.next();
        if(done)return;

        //caso contrario genera un boton para cada generador
        const boton = document.createElement('a');
        boton.href='#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente','bg-yellow-400','px-4','py-1','mr-2','font-bold','mb-10',
        'rounded');
        boton.onclick=()=>{
            paginaActual=value;
            buscarImagen();
        }
        paginacionDiv.appendChild(boton);
    }
}

