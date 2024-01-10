"use client"
import {useState, useEffect} from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function useAutenticacion(){
    const [usuarioAutenticado, setUsuarioAutenticado] = useState(null)
    useEffect(()=>{
        const auth = getAuth();
        //comprobamos si hay un usuario autenticado al cambiar el state
        const unsubscribe = onAuthStateChanged(auth, (usuario) => {
          if (usuario){// si hay un
              setUsuarioAutenticado(usuario)
          }  else {
              setUsuarioAutenticado(null)
          }
        })
        return ()=>unsubscribe();
    },[])

    return usuarioAutenticado;
}