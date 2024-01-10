import {useContext, useEffect, useState} from "react";
import {FirebaseContext} from "../firebase";
import {collection, onSnapshot, query, orderBy} from "firebase/firestore";

export const useProductos = orden=>{
    const [productos, setProductos] = useState([])
    const {firebase}=useContext(FirebaseContext);

    useEffect(() => {
        const obtenerProductos = () => {
            const q = query(collection(firebase.db, "productos"), orderBy(orden, "desc"));
            return onSnapshot(q, manejarSnapshot);
        }
        obtenerProductos();
    },[] );

    function manejarSnapshot(snapshot) {
        const productos = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setProductos(productos)
        // Aquí puedes actualizar el estado de tu componente con los productos si es necesario
    }
    return {
        productos
    }
}

