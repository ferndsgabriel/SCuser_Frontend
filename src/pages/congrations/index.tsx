import Head from "next/head";
import styles from "./styles.module.scss"
import Link from "next/link";
import { canSSRGuest } from "../../utils/canSSRGuest";
import { useLoading } from "../../contexts/LoadingContexts";

export default function Congrations() {
const { loading, setLoading } = useLoading();
  return (
    <>
      <Head>
        <title>SalãoCondo - Aguardando aprovação</title>
      </Head>
      <main className={styles.container}>
        <h1>PARABÉNS!!</h1>
        <h2> VOCÊ CONCLUIU SEU CADASTRO. </h2>

        <img className={styles.Congrations} src="Congrations.png" alt="Congrations"/>

        <p>Seus dados serão enviados ao administrador para validar seu cadastro. O processo de validação geralmente leva de 24 a 48 horas.</p>
        <Link href={"/"} className={styles.link}>Fazer login</Link>
      </main>
    </>
  );
}

export const getServerSideProps = canSSRGuest (async ()=>{
  return{
    props:{}
  }
})
