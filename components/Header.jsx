"use client"
import Link from "next/link";
import {useContext} from "react";
import { FirebaseContext } from "../firebase";

import { css } from '@emotion/css'
import styled from "styled-components";
import {Navegacion} from "./Navegacion";
import {Buscar} from "./ui/Buscar";
import {Boton} from "../styles/Boton";


const ContenedorHeader = styled.div`
  max-width: 1200px;
  width: 95%;
  margin: 0 auto;
  @media (width >=768px) {
      display: flex;
      justify-content: space-between;
  }
`
const Logo = styled.a`
  color: var(--naranja);
  font-size: 4rem;
  line-height: 0;
  font-weight: 700;
  font-family: "Roboto Slab", serif;
  margin-right: 2rem;
  `
export const Header = () => {

    const {usuario, firebase} = useContext(FirebaseContext);
    //const usuario = true;

    return (

        <header>
            <ContenedorHeader className={css`
              border-bottom: 2px solid var(--gris3);
              padding: 1rem 0;
            `}>
                <div
                    className={css`
                        display: flex;
                      align-items: center;
                    `}
                >
                    <Link href={"/"}>
                        <Logo>P</Logo>
                    </Link>
                        <Buscar/>
                        <Navegacion/>

                </div>
                <div className={css`
                    display: flex;
                  align-items: center;
                `}>

                    {usuario ? (
                        <>
                            <p className={css`
                              margin-right: 2rem;
                            `}>
                                Hola: {usuario.displayName}
                            </p>
                            <Boton
                                backgroundColor={"true"}
                                onClick={()=>firebase.cerrarSesion()}
                            >Cerrar Sesión</Boton>
                        </>

                    ) : (

                        <>
                            <Link href={"/login"}>
                                <Boton backgroundColor={"true"}>
                                    Login
                                </Boton>
                            </Link>
                            <Link href={"/crear-cuenta"}>
                                <Boton>
                                    Crear cuenta
                                </Boton>
                            </Link>
                        </>
                    )}


                </div>
            </ContenedorHeader>
        </header>
    )
}