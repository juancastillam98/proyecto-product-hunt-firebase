"use client"
import {useState} from "react";
import {useRouter} from "next/navigation";
import {css} from "@emotion/css";
import {Formulario, Campo, InputSubmit, Error} from "../../styles/Formulario";

import firebase from "../../firebase"//el index.js

//validaciones
import useValidacion from "../../hooks/useValidacion";
import validarIniciarSesion from "../../validacion/ValidarIniciarSesion";

const STATE_INICIAL = {
    email: "",
    password: "",
}

export default function Login() {
    const router = useRouter()

    const [error, setError]=useState(false)

    const {valoresIniciales, listaErrores, handleSubmit, handleChange,
        handleBlur}=useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);
    //en el hook, al principio siempre se pasan los valores iniciales vacíos, se rellenan luego en el onChange.
    //en el hook, validarCrearCuenta es validar, que la pasa los valores que introduce el usuario

    const {email, password}=valoresIniciales;//en el handleChange se rellenan los valores y los extraemos ya rellenados


    async function iniciarSesion(){
        try {
            await firebase.login(email, password);
            router.push("/")
        }catch(error){
            console.error("Hubo un error al autenticar el usuario ",error.message);
            setError(error.message)
        }
    }

    return (
        <div>
            <h1 className={css`
                    text-align: center;
                    margin-top: 5rem;
                `}
            >Iniciar Sesión</h1>
            <Formulario
                onSubmit={handleSubmit}
            >
                <Campo>
                    <label htmlFor="email">Email</label>
                    <input
                        type={"email"}
                        id={"email"}
                        placeholder={"Tu email"}
                        name={"email"}
                        value={email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Campo>

                {listaErrores.nombre && <Error> {listaErrores.email} </Error>}

                <Campo>
                    <label htmlFor="password">Password</label>
                    <input
                        type={"password"}
                        id={"password"}
                        placeholder={"Tu password"}
                        name={"password"}
                        value={password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Campo>

                {listaErrores.nombre && <Error> {listaErrores.password} </Error>}
                {error && <Error> {error} </Error>}

                <InputSubmit
                    type={"submit"}
                    value={"Iniciar Sesión"}
                />
            </Formulario>

        </div>
    )
}