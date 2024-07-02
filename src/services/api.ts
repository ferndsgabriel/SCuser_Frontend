import axios, {AxiosError} from "axios";
import { parseCookies } from "nookies";
import { singOut } from "../contexts/AuthContexts";


//export const baseURL = "http://localhost:3333";
//export const baseURL = "https://api.salaocondo.site";
export const baseURL = 'https://scbackend.vercel.app';

export const SetupApiClient = (ctx = undefined) =>{
    let cookies = parseCookies(ctx);
    const api = axios.create ({
        baseURL:baseURL,
        headers:{
            Authorization: `Bearer ${cookies["@SalaoCondo.token"]}`,
        },
    });

    api.interceptors.response.use(
        response =>{
            return response;
        },
        (error: AxiosError)=>{
            if (error.response.status === 401){
                if (typeof window !== 'undefined'){
                    //chamar função de deslogar user
                    singOut();
                }
            } else{
                return Promise.reject(error)
                
                } 
                return Promise.reject(error)
            }
        
    );
        return api;
}

