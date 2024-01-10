"use client"
import firebase, {FirebaseContext} from "../firebase";//lo importo del index
import useAutenticacion from "../hooks/useAutenticacion";

export const FirebaseProvider = ({children, props}) => {
    const usuario = useAutenticacion()
    //const {Component, pageProps}=props; //component es el componente actual y pops los props de la página
    return(
        <FirebaseContext.Provider
            value={{
                firebase,
                usuario
            }}
        >
            {/*<Component {...pageProps}/>*/}
            {children}
        </FirebaseContext.Provider>
    )
}