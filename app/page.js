"use client"
import {useEffect, useState, useContext} from "react";
import {FirebaseContext} from "../firebase";
import {collection, doc, getDoc, getDocs, onSnapshot} from "firebase/firestore";

import styled from "styled-components";
import {DetallesProducto} from "@/components/DetallesProducto";
import {useProductos} from "@/hooks/useProductos";

export default function Home() {
  const {productos}=useProductos("creado")

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
