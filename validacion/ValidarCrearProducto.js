export default  function validarCrearProducto(valores){
    let errores ={}

    if (!valores.nombre) {
        errores.nombre = "El nombre es obligatorio"
    }
    if (!valores.empresa) {
        errores.empresa = "La empresa es obligatoria"
    }
    if (!valores.url) {
        errores.url = "La url del producto es obligatoria";
    }else if(!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)){
        errores.url = "El formato de la url es incorrecto"
    }
    //validar descripcion
    if (!valores.descripcion) {
        errores.descripcion = "Agrega una descripción de tu producto"
    }
    return errores;
}