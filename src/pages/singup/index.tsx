import Head from "next/head";
import styles from "../../../styles/Home.module.scss";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { FormEvent, useState, useContext, ChangeEvent, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContexts";
import { toast } from "react-toastify";
import { isEmail, isMobilePhone } from 'validator';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import zxcvbn from 'zxcvbn';
import { canSSRGuest } from "../../utils/canSSRGuest";
import { SetupApiClient } from "../../services/api";
import { Loading } from "../../components/loading";
import Modal from "react-modal";
import Termos from "../../components/termos";
import { onlyString } from "../../utils/formatted";

type AptProps = {
  id: string;
  numberApt: string;
  tower_id: string;
  user: any[]; 
}
type TowersProps = {
  id:string,
  numberTower:string 
  apartment:[]
}

interface AptPropsInterface {
  Alltowers: TowersProps[];
  AllApts:AptProps[];
}

export default function Home({ AllApts, Alltowers}: AptPropsInterface) {
  const [optionsApts, setOptionApts] = useState<AptProps []>(AllApts || null);
  const [optionsTowers, setOptionTowers] = useState<TowersProps []>(Alltowers || null) ;
  const [selectTower, setSelectTower] = useState(0);
  const [selectApt, setSelectApt] = useState(0);

  const [apartament_id, setapartament_id] = useState('');
  const [name, setName] = useState(''.toLowerCase());
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [cpf, setCPF] = useState('');
  const [pass, setPass] = useState('');
  const [phone_number, setPhone_number] = useState ('');
  const { singUp } = useContext(AuthContext);
  const [loadingPage, setLoadingPage] = useState(true);
  const [checkbox, setCheckbox] = useState(false);
  const [isOpen, setIsOpen] = useState (false);
  

  
Modal.setAppElement('#__next');

  async function refreshDate(){
    try{
      const api = SetupApiClient();
      const response = await api.get('/apts');
      setOptionApts(response.data);
      setLoadingPage(false);
    }catch(err){
      console.log('Erro ao obter dados do servidor');
      setTimeout(refreshDate, 500);
    }
  }

  useEffect(()=>{
    refreshDate()
  },[]);

  // --------------------------------------------------------------//

  useEffect(()=>{
    try{
      const aptID = optionsApts.filter((item)=>
      item.tower_id === optionsTowers[selectTower].id);
      setapartament_id(aptID[selectApt].id);
    }catch(err){
      setapartament_id(null);
    }


  },[selectTower, selectApt, Home]);

  
  // --------------------------------------------------------------//
  function handleSelectTower(e: React.ChangeEvent<HTMLSelectElement>){
    const indexTower = parseInt (e.target.value);
    setSelectApt(0);
    setSelectTower(indexTower);
  }
  // --------------------------------------------------------------//
  function handleSelectApt(e: ChangeEvent<HTMLSelectElement>) {
    const indexApt = parseInt (e.target.value);
    setSelectApt(indexApt);
  }
  // --------------------------------------------------------------//


  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    if (checkbox === false){
      toast.warning('É necessário aceitar os termos do contrato.');
      return;
    }
    if (name === "" || lastname === "" || cpf === "" || email === "" || pass === "" || phone_number === "") {
      toast.warning('Por favor, insira todas as informações necessárias.');
      return;
    }
    if (!onlyString(name) || !onlyString(lastname)){
      toast.warning('Por favor, insira um nome válido.');
      return;
    }
    if (!isMobilePhone(phone_number)){
      toast.error("Por favor, insira um número de telefone válido.");
      return
    }
    if (!isEmail(email)) {
      toast.error("E-mail inválido. Utilize um endereço do Gmail ou Hotmail.");
      return;
    }
    if (!isEmailOfType(email)) {
      toast.error("E-mail inválido. Utilize um endereço do Gmail ou Hotmail.");
      return;
    }
    if (!cpfValidator.isValid(cpf)) {
      toast.error("Por favor, insira um CPF válido.");
      return;
    }
    if (zxcvbn(pass).score < 3) {
      toast.warning('A senha deve conter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.');
      return;
    }

    setLoading(true);

    let data = {
      email, 
      name, 
      apartament_id,
      cpf,
      pass, 
      lastname, phone_number
    };

    await singUp(data);
    setLoading(false);
  }


  const isEmailOfType = (email) => {
    const allowedDomains = ['gmail.com', 'hotmail.com'];
    const domain = email.split('@')[1].toLowerCase();
    return allowedDomains.includes(domain);
  };

  function openModal(){
    setIsOpen(true);
  }

  function closedModal(){
    setIsOpen(false);
  }

  if(loadingPage){
    return <Loading/>
  }
  return (
    <>
      <Head>
        <title>SalãoCondo - Cadastrar</title>
      </Head>
      <main className={styles.container}>
        <img src="SalãoCondoLight.svg"/>

          <form className={styles.form} onSubmit={handleRegister}>
            <article className={styles.inputsRow}>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Digite seu nome:" type="text" autoFocus={true} />
              <Input value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder="Seu sobrenome:" type="text" />
              <select value={selectTower} onChange={handleSelectTower} tabIndex={1}>
                {optionsTowers.filter((item)=>item.apartment.length > 0)
                .map((item, index)=>{
                  return(
                    <option key={item.id} value={index}>
                      Torre: {item.numberTower}
                    </option>
                  )
                })}
              </select>
              <select className={styles.option} value={selectApt} onChange={handleSelectApt} tabIndex={1}>
                {optionsApts.filter((item)=>
                item.tower_id === optionsTowers[selectTower].id).map((item, index)=>{
                  return(
                    <option key={item.id} value={index}>
                      Apartamento: {item.numberApt}
                    </option>
                  )
                })}
              </select>
            </article>

              <Input value={phone_number} onChange={(e) => setPhone_number(e.target.value)} placeholder="Seu telefone:" type="tel"
              mask="(99)99999-9999"/>
              <Input value={cpf} onChange={(e) => setCPF(e.target.value)} placeholder="Seu CPF:" type="text"
              mask="999.999.999-99"/>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Seu email:" type="text" />
              <Input value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Sua senha:" type="password" />
              
              <div className={styles.checkboxArea}>
                <input type="checkbox" onChange={(e)=>setCheckbox(e.target.checked)}/> 
                <p>Li e aceito os <a onClick={openModal} tabIndex={1}>termos de contratos</a>.</p>
              </div>    
              <Button loading={loading} type="submit" disabled={!checkbox}>
                Cadastrar
              </Button>
          </form>
          <div className={styles.othersOptions}>
            <Link href={"/"} className={styles.link}>
              Fazer login
            </Link>
          </div>

      </main>

      <Modal onRequestClose={closedModal}
      isOpen={isOpen}
      className={styles.termos}
      style={{overlay:{
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
        }}}><Termos buttonAction={closedModal}/></Modal>
    </>
  );
}


export const getServerSideProps = canSSRGuest(async (ctx) => {
  try {
      const SetupApi = SetupApiClient(ctx);
      const response = await SetupApi.get('/apts');
      const response2 = await SetupApi.get('/towers');
      const AllApts = response.data
      const Alltowers = response2.data
      console.log(AllApts)
      return {
          props: {
          Alltowers,
          AllApts
          },
      };
      }catch (error) {
          console.error('Erro ao obter dados da API');
      return {
          props: {
          Alltowers:[],
          AllApts:[]
          },
      };
  }
});

