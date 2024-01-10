"use client"
import {useState, useContext, useRef} from "react";
import {useRouter} from "next/navigation";
import {css} from "@emotion/css";
import {Formulario, Campo, InputSubmit, Error} from "../../styles/Formulario";

import {FirebaseContext} from "../../firebase";//vamos a subir el producto al state global de firebase
import {addDoc, collection, } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable, uploadBytes } from "firebase/storage"

//validaciones
import useValidacion from "../../hooks/useValidacion";
import validarCrearProducto from "../../validacion/ValidarCrearProducto";

const STATE_INICIAL = {
    nombre: "",
    empresa: "",
    imagen: "",
    url: "",
    descripcion: ""
}
export default function NuevoProducto() {

    const [error, setError]=useState(false)
    //state de las imagenes
    const [uploading, setUploading]=useState(false)
    const [urlImagen, setUrlImagen]=useState("")

    const router = useRouter()
    const {usuario, firebase}=useContext(FirebaseContext)

    const {
        valoresIniciales,
        listaErrores,
        handleSubmit,
        handleChange,
        handleBlur}=useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);
    //en el hook, al principio siempre se pasan los valores iniciales vacíos, se rellenan luego en el onChange.
    //en el hook, validarCrearCuenta es validar, que la pasa los valores que introduce el usuario
    const {nombre, empresa, imagen, url, descripcion}=valoresIniciales;//en el handleChange se rellenan los valores y los extraemos ya rellenados

    //context con las operaciones CRUD de firebase.
    const handleImageUpload = async (file) => {
        try {
            const storageRef = ref(firebase.storage, `productos/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    // handle upload progress, if needed
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                    setUploading(true);
                },
                (error) => {
                    // handle error during upload
                    console.error('Error uploading image:', error.message);
                    setUploading(false);
                },
                () => {
                    // handle successful upload
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        setUrlImagen(downloadURL);
                        setUploading(false);
                    });
                }
            );
        } catch (error) {
            console.error('Error handling image upload:', error.message);
            setUploading(false);
        }
    }
    async function crearProducto(){
        //si el usuario no está autenticado llevar al login
        if (!usuario){
            return router.push("/")
        }
        //crear el obj de nuevo producto
        const producto={
            nombre,
            empresa,
            imagen: urlImagen,
            url,
            descripcion,
            votos: 0,
            comentarios: [],
            creado: Date.now(),
            creador: {
                id: usuario.uid,
                nombre: usuario.displayName,
            },
            haVotado: []
        }
        //IINSERTAR PRODUCTO EN LA BD
        //firebase.db.collection("productos").add(producto)
        try {
            await addDoc(collection(firebase.db, "productos"), producto);
            console.log("Url imagen")
            console.log(urlImagen)
            router.push("/")
        }catch (error){
            console.error("Hubo un error al insertar producto ",error.message);
        }
    }

    return (
        usuario && (
            <div>
            <h1 className={css`
                    text-align: center;
                  margin-top: 5rem;
                `}
            >Nuevo Producto</h1>
                <Formulario
                    onSubmit={handleSubmit}
                >
                    <fieldset>
                        <legend>Información General</legend>

                        <Campo>
                            <label htmlFor="nombre">Nombre</label>
                            <input
                                type={"text"}
                                id={"nombre"}
                                placeholder={"Nombre producto"}
                                name={"nombre"}
                                value={nombre}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>

                        {listaErrores.nombre && <Error> {listaErrores.nombre} </Error>}

                        <Campo>
                            <label htmlFor="empresa">Empresa</label>
                            <input
                                type={"text"}
                                id={"empresa"}
                                placeholder={"Empresa o compañía"}
                                name={"empresa"}
                                value={empresa}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>

                        {listaErrores.empresa && <Error> {listaErrores.empresa } </Error>}

                        <Campo>
                            <label htmlFor="imagen">Imagen</label>

                            <input
                                accept="image/*"
                                type="file"
                                id="imagen"
                                name="imagen"
                                onChange={(e)=>handleImageUpload(e.target.files[0])}
                            />
                        </Campo>

                        {listaErrores.imagen && <Error> {listaErrores.imagen } </Error>}

                        <Campo>
                            <label htmlFor="url">Url</label>
                            <input
                                type={"url"}
                                id={"url"}
                                name={"url"}
                                placeholder={"Url producto..."}
                                value={url}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>

                        {listaErrores.url && <Error> {listaErrores.url } </Error>}
                    </fieldset>
                    <fieldset>
                        <legend>Sobre tu producto</legend>

                        <Campo>
                            <label htmlFor="descripcion">Descripcion</label>
                            <textarea
                                id={"descripcion"}
                                name={"descripcion"}
                                value={descripcion}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Campo>
                        {listaErrores.descripcion && <Error> {listaErrores.descripcion } </Error>}

                    </fieldset>

                    {error && <Error> {error} </Error>}

                    <InputSubmit
                        type={"submit"}
                        value={"Crear producto"}
                    />
                </Formulario>
            </div>
         )
    )
}
