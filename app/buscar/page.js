"use client"
import {useSearchParams} from "next/navigation";
import {DetallesProducto} from "../../components/DetallesProducto";
import {useProductos} from "../../hooks/useProductos";
import {useEffect, useState} from "react";
export default function Buscar() {
    const searchParams = useSearchParams()
    const valoresURL = searchParams.get('busqueda')

    const {productos}=useProductos("creado")
    const [resultado, setResultado] =useState([])
   useEffect(()=>{
    const busqueda = valoresURL.toLowerCase();
    const filtro = productos.filter( producto => {
        return(
            producto.nombre.toLowerCase().includes(busqueda)
        )
    })
       setResultado(filtro)
   },[valoresURL, productos])

    return (
        <div>
            <div className={"contenedor"}>
                <ul className={"bg-white"}>
                    {resultado.map(producto =>(
                        <DetallesProducto
                            key={producto.id}
                            producto={producto}
                        />
                    ))}
                </ul>
            </div>

        </div>
    )
}
