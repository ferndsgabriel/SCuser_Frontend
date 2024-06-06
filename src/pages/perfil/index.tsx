import Head from "next/head";
import Header from "../../components/header";
import { AiFillDelete} from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import {HiPhotograph} from "react-icons/hi"
import { canSSRAuth } from "../../utils/canSSRAuth";
import { SetupApiClient } from "../../services/api";
import { toast } from "react-toastify";
import { useState, useEffect} from "react";
import style from "./styles.module.scss";
import { Loading } from "../../components/loading";
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
  const [isLoading, setIsLoading] = useState (true);

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
  },[]);

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
    try{
      if (foto.type === "image/jpeg" || foto.type === "image/png" ){
        const image = foto
        const data = new FormData();
        data.append('image', image);
        await apiClient.put('/photo', data);
        fetchUserDetails();
        window.location.reload();
      }   
    }catch(error){
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
      <div className={style.bodyArea}>
        <main className={style.container}>
          <h1>Perfil</h1>
          <div className={style.allItens}>
            <section className={style.section1}>
              <div className={style.photoArea}>
                {details.photo?(
                  <img src={details.photo}/>
                ):(
                  <HiPhotograph/>
                )}
              </div>

              <div className={style.btnsPhoto}>
                <label>
                  <span className="buttonSlide"><span className={style.deletePhotoSpan}>Adicionar foto <IoMdAdd/></span></span>
                  <input name='input' type="file" accept=".jpg, .jpeg, .png" onChange={(e) => HandlePhoto(e.target.files[0])} /> 
                </label>

                {details.photo?(
                  <span onClick={openModalPhotoDelete} className="buttonSlide">
                    <span className={style.deletePhotoSpan}>Deletar foto <AiFillDelete/></span>
                  </span>
                ):null}
              </div>

            </section>

              <section className={style.section2}>
                <h2>Minhas informações</h2>
                <div className={style.infosArea}>
                  <article className={style.cards}>
                    <p className={style.p1}>Nome:</p>
                    <p className={style.p2}>{details.name}</p>
                  </article>
                  <article className={style.cards}>
                    <p className={style.p1}>Sobrenome:</p>
                    <p className={style.p2}>{details.lastname}</p>
                  </article>
                  <article className={style.cards}>
                    <p className={style.p1}>Apartamento:</p>
                    <p className={style.p2}>Torre {details.apartment.tower.numberTower} - Apartamento {details.apartment.numberApt}</p>
                  </article>
                  {details.apartment.payment ?(
                  <article className={style.cards}>
                    <p className={style.p1}>Status de pagamento:</p>
                    <p className={`${style.p2} ${details.apartment.payment? style.adimplente : ''}` }> Adimplente </p>
                  </article>
                  ):(
                    <article className={style.cards}>
                      <p className={style.p1}>Status de pagamento:</p>
                      <p className={`${style.p2} ${!details.apartment.payment? style.inadimplente : ''}` }>Inadimplente </p>
                    </article>
                  )}
                </div>
              </section>
            </div>
        </main>
      </div>


      <Gmodal isOpen={isOpenDeletePhoto}
        onClose={closeModalPhotoDelete}
        className='modal'>
        <div className='modalContainer'>
          <div className='beforeButtons'>
            <h3>Remover foto de perfil</h3>
            <p>Deseja deletar sua foto de perfil?</p>
          </div>
          <div className='buttonsModal'>
            <button className='buttonSlide' onClick={handleDeletePhoto} autoFocus={true}><span>Deletar</span></button>
            <button onClick={closeModalPhotoDelete}  className='buttonSlide false'><span>Cancelar</span></button>      
          </div>

          </div>
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
