import {useState} from "react";
import {useEffect} from "react";

//este hook va a recibir 3 parámetros, el estado inicial, qué vamos a validar y la función a ejeuctar al hacer submit
//se va a utilizar tanto para crear cuenta, como el login, como crearProducto
export default  function useValidacion(stateInicial, validar, fn){
    const [valoresIniciales, setValoresIniciales] = useState(stateInicial);//datos que introduce el usuario en el formulario
    const [listaErrores, setListaErrores] = useState({});//la función de validar, devuelve un objeto con errores
    const [submitForm, guardarSubmitForm]=useState(false)//cuando el user le de a enviar cambia a true

    //al hacer submit el user, submitForm está a true, comprobamos que cuando esté a true la validación del formulario
    useEffect(()=>{
        if (submitForm){
            const nodeErrores = Object.keys(listaErrores).length===0; //compruebo si hay algún error.
            if (nodeErrores){//si no hay errores, mandamos ejecutar la función.
                fn();
            }
            guardarSubmitForm(false)// si no hay errores, reiniciamos el formulario
        }
    }, [listaErrores])

    //  función que se ejecuta conforme el usuario escribe algo (validación en tiempo real)
    const handleChange= (e)=>{
        setValoresIniciales({
            ...valoresIniciales, //recuerda, el hacer copia del objeto es como hacer valores+=valores (acumulador)
            [e.target.name] : e.target.value, //va creando el obj
        })
    }
    //función que se ejecuta cuando el usuario hace submit, comprobamos si hay errores en lo que ha introducido el usuario
    const handleSubmit= (e)=>{
        e.preventDefault();
        //para comprobar lo que el usuario ha escrito, mandamos llamar la función de validar, pasánle un objeto con el contenido que ha escrito el usuairo en el form
        const errorValidacion = validar(valoresIniciales)//validar es la función que le pasmos al hook
        setListaErrores(errorValidacion);//le paamos un objeto que devuelve la función de validar. Si la función de validar devuelve un objeto vacío, es que no hay errores
        guardarSubmitForm(true)
    }

    //cuando se realiza el evento de blur
    const handleBlur = ()=>{
        const errorValidacion = validar(valoresIniciales)
        setListaErrores(errorValidacion);
    }

    return {
        valoresIniciales,
        listaErrores,
        handleSubmit,
        handleChange,
        handleBlur
    }
};