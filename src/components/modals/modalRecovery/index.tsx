import style from "../../../../styles/Home.module.scss";
import Gmodal from "../default";
import { useContext, FormEvent, useState, useEffect } from "react";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { toast } from "react-toastify";
import { SetupApiClient } from "../../../services/api";
import zxcvbn from 'zxcvbn';
import Router from "next/router";
import {isEmail} from 'validator';

export default function RecoveryModal({isOpen, onClose, email}){
    const {dark} = useContext(ThemeContext);
    const setupApi = SetupApiClient();
    const [cod, setCod] = useState ('');
    const [pass, setPass] = useState ('');

    const [loadingButton, setLoadingButton] = useState(false);

    async function handleRecovery(e:FormEvent){
        e.preventDefault();   

            if (email === '' || cod === "" || pass === ""){
                toast.warning('Por favor, insira todos os dados necessários.');
                return;
            }
            if (zxcvbn(pass).score < 3) {
                toast.warning('A senha deve conter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.');
                return;
            }

            setLoadingButton(true);
            try{
                await setupApi.put('recovery',{
                    pass: pass,
                    cod:cod,
                    email:email
                })
                toast.success('Senha recuperada com êxito.');
                setTimeout(()=>{
                    Router.push('/');
                },1500)
            }catch(error){
                console.log(error);
                toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
        }finally{
            setLoadingButton(false);
        }
    }

    async function handleCodigo (e:FormEvent){
        e.preventDefault();
    
        if (!email){
            toast.warning('Por favor, insira seu e-mail.');
            return
        }
        if (!isEmail(email.trim())){
            toast.warning('Por favor, insira um e-mail válido.');
            return
        }
    
        const AptClient = SetupApiClient();
        try{
            await AptClient.post('cod',{
                email:email
            })
            toast.success('Código de recuperação enviado com sucesso para seu e-mail.');
        }catch(error){{
            toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
            console.log(error)
        }}
    }

    useEffect(()=>{
        if (!isOpen){
            setCod('');
            setPass('');
        }
    },[onClose])

    return(
        <Gmodal isOpen={isOpen}
        onClose={onClose}
        className={style.modalRecovery}>
            <div className={style.container}>
                {dark?(
                    <img src="./iconDark.svg" alt="SalãoCondo Logo" />
                ):(
                    <img src="./iconLight.svg" alt="SalãoCondo Logo" />
                )}

                <form className={style.form} onSubmit={handleRecovery}>
                    <Input type="tel" placeholder="Digite o seu código:" value={cod} onChange={(e)=>setCod(e.target.value)}/>
                    <Input type="password" placeholder="Sua nova senha:" value={pass} onChange={(e)=>setPass(e.target.value)}/>
                    <Button type="submit" disabled={loadingButton}>Alterar senha</Button>
                </form>
                
                {!loadingButton &&(
                    <div className={style.othersOptions}>
                        <button onClick={handleCodigo} className={style.link}>Reenviar código</button>
                        <button className={style.link} onClick={onClose}>Cancelar</button>
                    </div>
                ) }
            </div>
        </Gmodal>
    )
}