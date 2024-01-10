import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import "firebase/firestore"
import { firebaseConfig } from "./config";
class Firebase {
    constructor() {
        const app = initializeApp(firebaseConfig);
        this.auth = getAuth(app);//instancia de la clase firebase
        this.db=getFirestore(app)
        this.storage = getStorage(app)
    }
    async registrar(nombre, email, password) {
        const nuevoUsuario = await createUserWithEmailAndPassword(this.auth, email, password);
        return await updateProfile(nuevoUsuario.user, {
            displayName: nombre
        });
    }
    //iniciar sesión
    async login(email, password) {
        return signInWithEmailAndPassword(this.auth, email, password);
    }

    //cerrar sesión usuario
    async cerrarSesion(){
        return await this.auth.signOut();
    }
}
export const firebase = new Firebase();

