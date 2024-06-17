import {createContext, ReactNode, useState} from "react";
import {destroyCookie, setCookie, parseCookies} from "nookies"
import Router from "next/router";
import { api } from "../services/apiClient";
import { toast } from "react-toastify";


type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    singIn: (credentials: CredentialProps) =>Promise<void>;
    singOut:()=>void
    singUp:(Credentials: SingUpProps ) =>Promise<void>;
}

type UserProps = {
    id:string;
    name: string;
    lastname: string;
    email: string;
    phone_number:string
}

type CredentialProps = {
    email: string;
    pass: string;
}
type SingUpProps = {
    email:string;
    cpf:string | number;
    name: string;
    lastname: string;
    apartament_id:string;
    pass: string;
    phone_number: string;
}
type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext ({} as AuthContextData);

export function singOut(){
    try{
        destroyCookie(undefined, "@SalaoCondo.token");
        Router.push('/')

    }catch{
        console.log('Error ao deslogar')
    }
}


export function AuthProvider ({children}:AuthProviderProps){
    const [user, setUser] = useState<UserProps>();
    const isAuthenticated = !!user;

    async function singIn({email, pass}:CredentialProps) {
        try{
            const response = await api.post("/session",{
                pass:pass,
                email:email,
            })
            const {id, name, lastname, token, phone_number} = response.data
            setCookie (undefined, "@SalaoCondo.token", token,{
                maxAge:60*60*24*30,
                path:"/", //quais caminhos terão acesso ao cookies, se
                //deixarmos barra, vai ser todos
            });
            
            setUser({
                id,
                name,
                lastname,
                email,
                phone_number
            });
            api.defaults.headers['Authorization'] = `Bearer ${token}`
            Router.push("/reservation");
            
        }
        catch(error){
            toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
        }
    }

    async function singUp ({name, lastname, apartament_id, cpf, email, pass, phone_number}:SingUpProps){
        try{
            const response = await api.post('/user',{
                name:name,
                lastname:lastname,
                apartament_id:apartament_id,
                cpf:cpf,
                email:email,
                pass: pass,
                phone_number:phone_number
            })
            Router.push("/congrations")
            return response.data.id
        }catch(error){
            toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
            return;
        }
    }

    return(
        <AuthContext.Provider 
        value={{user, isAuthenticated, singIn,singOut,singUp}}>
            {children}
        </AuthContext.Provider>
    );
}

