export default  function validarCrearCuenta(valores){
    let errores ={}

    if (!valores.nombre) {
        errores.nombre = "El nombre es obligatorio"
    }

    //validar el email
    if (!valores.email) {
        errores.email = "El email"
    }else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email)){
        errores.email = "Email no válido";
    }
    //Validar el password
    if (!valores.password) {
        errores.password = "El password es obligatorio"
    }else if (valores.password.length < 7){
        errores.password = "El password debe tener al menos 6 caracteres"
    }
    return errores;
}