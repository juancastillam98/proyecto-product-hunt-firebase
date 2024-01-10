'use client'

import { useEffect, useContext, useState } from 'react'
import {router} from "next/client";


import {FirebaseContext} from "../../../firebase";
import {getDoc, doc, updateDoc, deleteDoc} from "firebase/firestore";

import {css} from "@emotion/css";
import styled from "styled-components";

import {formatDistanceToNow} from "date-fns/formatDistanceToNow";
import {es} from "date-fns/locale";
import {Campo, InputSubmit} from "../../../styles/Formulario";
import {Boton} from "../../../styles/Boton";

const ContenedorProducto = styled.div`
    @media(min-width: 768px){
      display: grid;
      grid-template-columns: 2fr 1fr;
      column-gap: 2rem;
      max-width: 1200px;
      width: 95%;
      margin: 5rem auto;
    }
`
const CreadorProducto = styled.p`
    padding: .5rem 2rem;
  background-color: #da552d;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
`

export default  function Producto({params}){
    //state del componente
    const [producto, setProducto]=useState({})
    const [error, setError]=useState(false)
    const [comentario, setComentario]=useState({})//cada comentario es un objeto con la información del propio comentario
    const {firebase, usuario}=useContext(FirebaseContext)
    const [consultarDB, setConsultarDB]=useState(true)
    const {id}=params;

    useEffect(()=>{
        if (id && consultarDB){
            const obtenerProducto = async ()=>{
                const productoRef = doc(firebase.db, "productos", id);
                const productoDoc = await getDoc(productoRef)
                if (productoDoc.exists()){
                    setProducto(productoDoc.data())
                    setConsultarDB(false)
                    setError(false)
                }else {
                    setError(true)
                    setConsultarDB(false)
                }

            }
            obtenerProducto();
        }
    },[id, producto])//queremos que haga la consulta a la bd cada vez que se modifque algo en el producto, como los votos

    if (Object.keys(producto).length=== 0 && !error) return <p>Cargando...</p>
    const {nombre, comentarios, creado, descripcion, url, imagen, empresa, votos, creador, haVotado}=producto;

    //Administrar y validar los votos
    const votarProducto =async () => {
        if (!usuario) {
            return router.push("/")
        }
        //obtener y sumar un nuevo voto
        const nuevoTotal = votos + 1;

        //verificar si el usuario actual ha votado
        if (haVotado.includes(usuario.uid)) return;

        const hanVotado =[//guardar el ID del usuario que ha votado
            ...haVotado,
            usuario.uid
        ]
        //actualar bd
        const productoDocRef = doc(firebase.db, "productos", id);
        await updateDoc(productoDocRef, {
            votos: nuevoTotal,
            haVotado: hanVotado
        });
        //actualizar state
        setProducto({
            ...producto,
            votos: nuevoTotal
        })
        setConsultarDB(true)//hay un voto, por lo que vuelvo a consultar la bd
    }

    //Funciones para crear comentarios
    const comentarioChange =e =>{
        setComentario({
            ...comentario,//es un objeto
            [e.target.name]: e.target.value
        })
    }
    //Identifica si el comentario es del creado del producto
    const esCreador = id =>{
        if (creador.id === id){
            return true;
        }
    }
    const agregarComentario = async e => {
        e.preventDefault();
        if (!usuario) {
            return router.push("/login")
        }
        //información extra al comentario
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        //tomar copia de comentarios y agregarlo al arreglo.
        const nuevosComentarios = [...comentarios, comentario]

        //actualar bd
        const productoDocRef = doc(firebase.db, "productos", id);
        await updateDoc(productoDocRef, {
            comentarios: nuevosComentarios
        });

        //Actualizar el state
        setProducto({
            ...producto,
            comentarios: nuevosComentarios
        })

        setConsultarDB(true);//vuelvo a consultar la bd
    }
    //función que revisa que el creador del  producto es el mismo que el que está autenticado
    const puedeBorrar = ()=>{
        if (!usuario) return false;
        if (creador.id === usuario.uid){
            return true;
        }
    }
    //eliminar un producto de la bd
    const eliminarProducto = async () => {
        if (!usuario) {
            return router.push("/login")
        }
        if (creador.id !== usuario.uid) {
            return router.push("/login");
        }
        try {
            await deleteDoc(doc(firebase.db, "productos", id));
            await router.push("/");
        }catch (error){
            console.log(error);
        }
    }

    return (
        error ? null : (
            <div>
                <div className={"contenedor"}>
                    <h1 className={css`
                    text-align: center;
                    margin-top: 5rem;
                `}>{nombre}</h1>
                    <ContenedorProducto>
                        <div>
                            <p>Publicado hace: {formatDistanceToNow(new Date(creado), {locale: es})}</p>
                            <p>Usuario;{creador?.nombre}  de {empresa}</p>

                            <img
                                src={imagen}
                                alt={`Imagen del producto ${nombre}`}
                            />
                            <p>{descripcion}</p>
                            {usuario && (
                                <>
                                    <h2>Agrega tu comentario</h2>
                                    <form
                                        onSubmit={agregarComentario}
                                    >
                                        <Campo>
                                            <input
                                                type={"text"}
                                                name={"mensaje"}
                                                onChange={comentarioChange}
                                            />
                                        </Campo>
                                        <InputSubmit
                                            type={"submit"}
                                            value={"Agregar comentario"}
                                        />
                                    </form>
                                </>
                            )}
                            <h2 className={css`
                            margin: 2rem 0;
                        `}>Comentarios</h2>
                            {comentarios.length === 0 ? "Aún no hay comentarios" : (
                                <ul>
                                    {comentarios.map((comentario, i) => (
                                        <li
                                            key={`${comentario.usuarioId}-${i}`}
                                            className={css`
                                            border: 1px solid #e1e1e1;
                                            padding: 2rem;
                                        `}
                                        >
                                            <p>{comentario.mensaje}</p>
                                            <p>Escrito por:
                                                <span className={css` font-weight: bold`}>
                                                &nbsp; {comentario.usuarioNombre}
                                            </span>
                                            </p>
                                            {esCreador(comentario.usuarioId) && <CreadorProducto>Es Creador</CreadorProducto>}
                                        </li>
                                    ))}
                                </ul>
                            )}

                        </div>
                        <aside>
                            <Boton
                                target={"_blank"}
                                backgroundColor={"true"}
                                href={url}
                            >Visitar URL</Boton>
                            <div className={css`
                            margin-top: 5rem;
                        `}>
                                <p className={css`
                            text-align: center;
                        `}>{votos} Votos</p>

                                {usuario && (
                                    <Boton
                                        onClick={votarProducto}
                                    >
                                        Votar
                                    </Boton>
                                )}

                            </div>
                        </aside>
                    </ContenedorProducto>
                    {puedeBorrar() &&
                        <Boton
                            onClick={eliminarProducto}
                        >Eliminar Producto</Boton>
                    }
                </div>
            </div>
        )

    );
};

