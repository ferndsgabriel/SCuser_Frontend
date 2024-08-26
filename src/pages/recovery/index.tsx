import Head from "next/head";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import style from "../../../styles/Home.module.scss";
import { canSSRGuest } from "../../utils/canSSRGuest";
import { useState, FormEvent,useContext } from "react";
import { SetupApiClient } from "../../services/api";
import { toast } from "react-toastify";
import {isEmail} from 'validator';
import RecoveryModal from "../../components/modals/modalRecovery";
import { ThemeContext } from "../../contexts/ThemeContext";


export default function Recovery(){

    const [email, setEmail] = useState ('');
    const [isOpen, setIsOpen] = useState (false);
    const {dark} = useContext(ThemeContext);
    const [loadingButton, setLoadingButton] = useState(false);

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
            toast.info('Se o endereço de email informado estiver cadastrado, você receberá um código de recuperação em breve.');
            openModal();
        }catch(error){{
            toast.info('Se o endereço de email informado estiver cadastrado, você receberá um código de recuperação em breve.');
            openModal();
        }}
    }

    function openModal(){
        setIsOpen(true)
    }

    function closeModal(){
        setIsOpen (false)
        setEmail('');
    }

    return(
        <>
            <Head>
                <title>SalãoCondo - Recovery</title>
            </Head>

            <main className={style.container}>
                {dark?(
                    <img src="./iconDark.svg" alt="SalãoCondo Logo" />
                ):(
                    <img src="./iconLight.svg" alt="SalãoCondo Logo" />
                )}
                <h1>Recuperar senha</h1>
                <form className={style.form } onSubmit={handleCodigo}>    
                    <Input type="email" placeholder="Digite seu email:"
                    value={email} autoFocus={true}
                    onChange={(e)=>setEmail(e.target.value)}/>
                    <Button type="submit">Enviar código</Button>
                </form>
                {!loadingButton && (
                    <div className={style.othersOptions}>
                        <Link href={'/'} className={style.link}>
                            Fazer login
                        </Link>
                    </div>
                )}
            </main>

            <RecoveryModal 
            isOpen={isOpen}
            onClose={closeModal} 
            email={email}
            />
        </>
    )
}

export const getServerSideProps = canSSRGuest (async(ctx)=>{
    return{
        props:{
        }
    }
})