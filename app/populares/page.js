"use client"
import {useProductos} from "../../hooks/useProductos";
import {DetallesProducto} from "../../components/DetallesProducto";

export default function Populares() {

    const {productos}=useProductos("votos")

    return (
        <div className={"lisstado-productos"}>
            <div className={"contenedor"}>
                <ul className={"bg-white"}>
                    {productos.map(producto =>(
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
