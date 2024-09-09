import Head from "next/head";
import Header from "../../components/header";
import { AiFillDelete} from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import {HiPhotograph} from "react-icons/hi"
import { canSSRAuth } from "../../utils/canSSRAuth";
import { SetupApiClient } from "../../services/api";
import { toast } from "react-toastify";
import { useState, useEffect, useCallback} from "react";
import style from "./styles.module.scss";
import { Loading } from "../../components/loading";
import DeletePhotoModal from "../../components/modals/modalsPerfil/deletePhoto";
import { FaSpinner } from "react-icons/fa";
import Chat from "../../components/chat";


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


export default function Perfil(){
  const apiClient = SetupApiClient();
  const [details,setDetails] = useState<userProps>();
  const [imagePreview, setImagePreview] = useState(null);
  const [isOpenDeletePhoto, setIsOpenDeletePhoto] = useState (false);
  const [loading, setLoading] = useState (true);
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);


  useEffect(()=>{
    async function fetchUserDetails() {
      if (loading || !isOpenDeletePhoto){
        try {
          const response = await apiClient.get('/me');
          setDetails(response.data);
        } catch (error) {
          console.log('Erro ao obter dados do servidor');
          setTimeout(fetchUserDetails, 500);
        }finally{
          setLoading(false);
        }
      }
    }
    fetchUserDetails();
  },[loading, isOpenDeletePhoto, HandlePhoto]);

  //-------------------------------------------------Deletar foto
  
  const openModalPhotoDelete = useCallback(()=>{
    setIsOpenDeletePhoto(true);
  },[isOpenDeletePhoto]);

  const closeModalPhotoDelete = useCallback(()=>{
    setIsOpenDeletePhoto(false);
  },[isOpenDeletePhoto]);
  

  
  async function HandlePhoto(foto){
    try{
      if (foto.type === "image/jpeg" || foto.type === "image/png" ){
        const image = foto
        setIsAddingPhoto(true);
        const data = new FormData();
        data.append('image', image);
        await apiClient.put('/photo', data);
      }   
    }catch(error){
      toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
    }finally{
      setIsAddingPhoto(false);
    }
  }

//------------------------------------------------------------

  if (loading){
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
        <Chat/>
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
              
              {!isAddingPhoto ? (
                <div className={style.btnsPhoto}>
                  <label>
                    <span className="buttonSlide">Adicionar foto <IoMdAdd/></span>
                    <input name='input' type="file" accept=".jpg, .jpeg, .png" onChange={(e) => HandlePhoto(e.target.files[0])} /> 
                  </label>
                  {details.photo &&(
                    <span onClick={openModalPhotoDelete} className="buttonSlide">
                      Deletar foto <AiFillDelete/>
                    </span>
                  )}
                </div>
              ):(
                <FaSpinner className={style.spin}/>
              )}

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

      <DeletePhotoModal
      isOpen={isOpenDeletePhoto}
      onClose={closeModalPhotoDelete}
      setImagePreview={setImagePreview}
      />
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
      props: {
      }
  };
});
