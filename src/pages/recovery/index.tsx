import Head from "next/head";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import style from "./styles.module.scss";
import { canSSRGuest } from "../../utils/canSSRGuest";
import { useState, FormEvent } from "react";
import { SetupApiClient } from "../../services/api";
import { toast } from "react-toastify";
import {AiFillCloseCircle} from 'react-icons/ai';
import zxcvbn from 'zxcvbn';
import Router from "next/router";
import {isEmail} from 'validator';
import { Gmodal } from "../../components/myModal";

export default function Recovery(){

const [email, setEmail] = useState ('');
const [isOpen, setIsOpen] = useState (false);
const [cod, setCod] = useState ('');
const [pass, setPass] = useState ('');

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
        await AptClient.post('/cod',{
            email:email
        })
        toast.success('Código de recuperação enviado com sucesso para seu e-mail.');
        openModal();
    }catch(error){{
        toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
    }}
}

function openModal(){
    setIsOpen(true)
}

function closeModal(){
    setIsOpen (false)
    setEmail('');
    setCod('');
    setPass('');
}

async function handleRecovery(e:FormEvent){
    e.preventDefault();{
        const setupApi = SetupApiClient();
        if (email === '' || cod === "" || pass === ""){
            toast.warning('Por favor, insira todos os dados necessários.');
            return;
        }
        if (zxcvbn(pass).score < 3) {
            toast.warning('A senha deve conter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.');
            return;
        }
        try{
            await setupApi.put('/recovery',{
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
        }
    }
}


    return(
        <>
        <Head>
            <title>SalãoCondo - Recovery</title>
        </Head>
        <main className={style.container}>
            <img src="SalãoCondoLight.svg"/>
                <h1>Recuperar senha</h1>
                <form className={style.form } onSubmit={handleCodigo}>    
                    <Input type="email" placeholder="Digite seu email:"
                    value={email} autoFocus={true}
                    onChange={(e)=>setEmail(e.target.value)}/>
                    <Button type="submit">Enviar código</Button>
                </form>
                <Link href={'/'}>Fazer login
                </Link>
        </main>

        <Gmodal isOpen={isOpen}
        onClose={closeModal}
        className={style.modal}>
        <div className={style.modal}>
            <button  className={style.buttonclose} onClick={closeModal}>
                <AiFillCloseCircle size={30}/>
            </button>
            <img src="SalãoCondoLight.svg"/>

            <form className={style.formmodal} onSubmit={handleRecovery}>
                <Input type="tel" autoFocus={true} placeholder="Digite o seu código:" value={cod} onChange={(e)=>setCod(e.target.value)}
                />
                <Input type="password" placeholder="Sua nova senha:" value={pass} onChange={(e)=>setPass(e.target.value)}/>
                <Button type="submit">Alterar senha</Button>
            </form>

            <article className={style.buttonsOthersRecovery}>
                <button onClick={handleCodigo} className={style.buttonLink}>
                    Reenviar código  
                </button>
            </article>
        </div>   
        </Gmodal>
        </>
    )
}

export const getServerSideProps = canSSRGuest (async(ctx)=>{
    return{
        props:{
        }
    }
})