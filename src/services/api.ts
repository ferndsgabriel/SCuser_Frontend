import axios, {AxiosError} from "axios";
import { parseCookies } from "nookies";
import {destroyCookie} from "nookies";
import Router from "next/router";

export const baseURL = process.env.NEXT_PUBLIC_BASE_URL ;

async function signOut(){
    try{
        destroyCookie(undefined, "@SalaoCondo.token");
        Router.push('/');
    }catch{
        console.log('Error ao deslogar')
    }
}
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
                    signOut();
                }
            } else{
                return Promise.reject(error)
                
                } 
                return Promise.reject(error)
            }
        
    );
    
    return api;
}

