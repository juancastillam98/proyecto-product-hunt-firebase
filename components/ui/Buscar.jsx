import { useState, useCallback } from "react";
import styled from "styled-components";
import { css } from '@emotion/css'
import {useSearchParams, useRouter} from 'next/navigation';

const InputText = styled.input`
  border: 1px solid var(--gris3);
  padding: 1rem;
  min-width: 300px;
`
const InputSubmit = styled.button`
  height: 3rem;
  width: 3rem;
  display: block;
  background-size: 4rem;
  background-image: url("/static/img/buscar.png");
  background-repeat: no-repeat;
  position: absolute;
  right: 1rem;
  top: 1px;
  background-color: white;
  border: none;
  text-indent: -10px;
  &:hover {
    cursor: pointer;
  }
`

export const Buscar = () => {
    const [busqueda, setBusqueda] = useState("");
    const searchParams = useSearchParams();
    const router = useRouter();

    //const q = productoBuscar.get("q")==="true"

    const createQueryString = useCallback(
        (name, value) => {
            const params = new URLSearchParams(searchParams)
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )
    const buscarProducto =(e)=>{
        e.preventDefault();
        console.log(createQueryString())
        if (busqueda.trim()==="") return;
        router.push("/buscar"+"?"+createQueryString("busqueda", busqueda))
    }

    return (
        <form className={css`
      position:relative;
    `}
              onSubmit={buscarProducto}
        >
            <InputText
                type="text"
                placeholder={"Buscar Productos"}
                value={busqueda}
                //onChange={(e) => createQueryString("buscar", e.target.value)}
                onChange={(e)=>setBusqueda(e.target.value)}
            />
            <InputSubmit type="submit" value={"Buscar"} />
        </form>
    );
}
