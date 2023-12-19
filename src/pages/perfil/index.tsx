import Head from "next/head";
import Header from "../../components/header";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { FaSpinner } from "react-icons/fa";
import {HiPhotograph} from "react-icons/hi"
import { canSSRAuth } from "../../utils/canSSRAuth";
import { SetupApiClient } from "../../services/api";
import { toast } from "react-toastify";
import { useState, ChangeEvent, useEffect, FormEvent} from "react";
import style from "./styles.module.scss";
import {isMobilePhone } from 'validator';
import { Loading } from "../../components/loading";
import InputMask from 'react-input-mask';
import { Gmodal } from "../../components/myModal";


  type userProps = {
    cpf: string,
    id: string,
    name: string,
    lastname: string,
    email: string,
    photo: null | string,
    accountStatus: boolean,
    phone_number: string,
    apartment_id: string,
    apartment: {
        numberApt: string,
        tower_id: string,
        payment: boolean,
        payday: Date,
        tower: {
            numberTower:string
        }
    }
  }
  interface userPropsInterface {
    userDate:userProps;
  }

export default function Perfil({userDate}:userPropsInterface){
  const apiClient = SetupApiClient();
  const [details,setDetails] = useState(userDate || null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isOpenDeletePhoto, setIsOpenDeletePhoto] = useState (false);
  const [isOpenPhone, setIsOpenPhone] = useState (false);
  const [phone, setPhone] = useState ('');
  const [isLoading, setIsLoading] = useState (true);
  const [spinnerPhoto, setSpinnerPhoto] = useState (false);

  async function fetchUserDetails() {
    try {
      const response = await apiClient.get('/me');
      setDetails(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log('Erro ao obter dados do servidor');
      setTimeout(fetchUserDetails, 500);
    }
  }

  useEffect(()=>{
    fetchUserDetails();
    if (details.photo == null ){
      setImagePreview(null);
    }
    else{
      try{
        setImagePreview(`https://drive.google.com/uc?export=view&id=${details.photo}`);
      }catch(err){
        setImagePreview(null);
      }
    }
  },[])
  //-------------------------------------------------Deletar foto
  function openModalPhotoDelete() {
    setIsOpenDeletePhoto(true);
  }
  
  function closeModalPhotoDelete() {
    setIsOpenDeletePhoto(false);
  }
  
  async function handleDeletePhoto() {
    try {
      await apiClient.put('/photodelete');
      toast.success('Foto deletada');
      await fetchUserDetails(); // Se fetchUserDetails é assíncrono, use await aqui
      setImagePreview(null);
    } catch (error) {
      toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
    } finally {
      closeModalPhotoDelete();
    }
  }
  
//------------------------------------------------- adicionar foto
  async function HandlePhoto(foto){
    setSpinnerPhoto(true);
    try{
      if (foto.type === "image/jpeg" || foto.type === "image/png" ){
        const file = foto
        const data = new FormData();
        data.append('file', file);
        await apiClient.put('/photo', data);
        fetchUserDetails();
        window.location.reload();
        setSpinnerPhoto(false);
        
      }   
    }catch(error){
      toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
    } 
    setSpinnerPhoto(false); 
  }

//------------------------------------------------- alterar telefone
  function openModalPhone(){
    setIsOpenPhone(true);
  }

  function closeModalPhone(){
    setIsOpenPhone(false);
    setPhone('');
  }

  async function changePhone(e:FormEvent){
    e.preventDefault();
    if (phone === ''){
      return;
    }
    if (!isMobilePhone(phone)){
      toast.warning('Por favor, insira um número válido.');
      return;
    }
    if (phone === details.phone_number){
      toast.warning('Digite um número diferente do atual.');
      return;
    }
    try{
      await apiClient.put('/phone',{
        number:phone
      })
      toast.success('O número foi alterado com sucesso!');
      fetchUserDetails();
      closeModalPhone()
    }
    catch(error){
      toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
    }
  }
//------------------------------------------------------------

  if (isLoading){
    return <Loading/>
  }

  return(
    <>
      <Head>
        <title>
          SalãoCondo - Perfil
        </title>
      </Head>
      <Header/>
      <main className={style.container}>
      <h1>Perfil</h1>
        <section className={style.sectionPhoto}>    
              <label className={style.circulo}>
                <input type="file" accept=".jpg, .jpeg, .png" onChange={(e) => HandlePhoto(e.target.files[0])} />
                {spinnerPhoto?(
                  <FaSpinner className={style.svgSpinner}/>
                ):(
                  null
                )}

                <div className={style.perfilContainer}>
                  <img src={imagePreview}/>
                </div>
                
                {imagePreview == null ? <HiPhotograph/> : null}
              </label>
            {details.photo?(
              <button onClick={openModalPhotoDelete} className={style.buttonPhoto}>
                <AiFillDelete/>Deletar foto 
              </button>
            ):null}
        </section>

        <section className={style.info}>
            <h2>Olá, {details.name} {details.lastname}</h2>    
            <article>
              <p>Telefone: {details.phone_number}</p>
              <button className={style.phoneButton}onClick={openModalPhone} tabIndex={1}><AiFillEdit/></button>
            </article>
            
            <article>
              <p>Torre: {details.apartment.tower.numberTower} - Apartamento: {details.apartment.numberApt}</p>
            </article>

            {details.apartment.payment ?(
              <article style={{'backgroundColor':'#51AB7B'}}>
                <p>Status: Adimplente </p>
              </article>
            ):(
              <article style={{'backgroundColor':'#f14a4a'}}>
                <p>Status: Inadimplente</p>
              </article>
            )}
        </section>
      </main>

      <Gmodal isOpen={isOpenDeletePhoto}
        onClose={closeModalPhotoDelete}
        className='modal'>
        <div className='modalContainer'>
          <div className='beforeButtons'>
            <h3>Remover foto de perfil</h3>
            <p>Deseja deletar sua foto de perfil?</p>
          </div>
          <div className='buttonsModal'>
            <button className='true' onClick={handleDeletePhoto}autoFocus={true}><span>Sim</span></button>
            <button onClick={closeModalPhotoDelete}  className='false'><span>Não</span></button>
          </div>
          </div>
        </Gmodal>

      <Gmodal isOpen={isOpenPhone}
        onClose={closeModalPhone}
        className='modal'>
        <form className='modalContainer' onSubmit={changePhone}>   
          <div className="beforeButtons">
            <h3>Alterar telefone</h3>
            <p>Digite seu novo número de telefone:</p>
            <InputMask className='inputModal'
            placeholder="Exemplo:(11) 99999-9999"
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
            mask={'(99)99999-9999'}
            autoFocus={true}/>
          </div>

          <div className='buttonsModal'>
            <button className='true' type='submit'><span>Alterar</span></button>
            <button className='false' onClick={closeModalPhone}><span>Cancelar</span></button>
          </div>
        </form>
        </Gmodal>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = SetupApiClient(ctx);
  try {
    const response = await apiClient.get('/me');
    const userData = response.data;
    return {
      props: {
        userDate: userData,
      },
    };
  } catch (error) {
    console.error('Erro ao obter dados da api');
    return {
      props: {
        userDate: []
      },
    };
  }
});
