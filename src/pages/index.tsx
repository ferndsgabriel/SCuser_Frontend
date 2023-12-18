import Head from "next/head";
import styles from "../../styles/Home.module.scss";
import {Input} from "../components/ui/input";
import {Button} from "../components/ui/button";
import Link from "next/link";
import {FormEvent, useContext, useState} from "react"
import { AuthContext } from "../contexts/AuthContexts"
import { isEmail } from 'validator';
import { toast } from "react-toastify";
import { canSSRGuest } from "../utils/canSSRGuest";

export default function Home(){

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState (false)
  const {singIn} = useContext(AuthContext)
  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    if (email === "" && pass === ""){
      return;
    }
    if (email === "" || pass === ""){
      toast.warning('Por favor, insira todas as suas informações.');
      return;
    }
    if (!isEmail(email)){
      toast.warning('Por favor, insira um e-mail válido.');
      return;
    }
    setLoading(true)
    let data = {
      email,
      pass
    };
    await singIn(data);
    setLoading(false)
  }


  return(
    <>
    <Head>
        <title>
        SalãoCondo - Página inicial
        </title>
    </Head>
    <main className={styles.container}>
      <img src="SalãoCondoLight.svg"/>
    
        <form className={styles.form} onSubmit={handleLogin}>
          <Input placeholder="Digite seu endereço de email:" type="text"  autoFocus={true}
          value={email} onChange={(e)=>setEmail(e.target.value)}/>

          <Input placeholder="Digite sua senha:" type="password"
          value={pass} onChange={(e)=>setPass(e.target.value)}/>
          
          <Button
            loading={loading}
            type="submit">
            Entrar
          </Button>
        </form>
        <div className={styles.othersOptions}>
          <Link href={"/recovery"} className={styles.link}>
            Recuperar conta
          </Link>

          <Link href={"/singup"} className={styles.link}>
            Não tem uma conta? Cadastre-se
          </Link>
        </div>
        
    </main>
    </>
  )
}

export const getServerSideProps = canSSRGuest (async ()=>{
  return{
    props:{}
  }
})