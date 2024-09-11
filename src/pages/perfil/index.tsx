import Head from "next/head";
import Header from "../../components/header";
import { AiFillDelete} from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import {HiPhotograph} from "react-icons/hi"
import { canSSRAuth } from "../../utils/canSSRAuth";
import { SetupApiClient } from "../../services/api";
import { toast } from "react-toastify";
import { useState, useCallback, useContext} from "react";
import { AuthContext } from "../../contexts/AuthContexts";
import style from "./styles.module.scss";
import DeletePhotoModal from "../../components/modals/modalsPerfil/deletePhoto";
import { FaSpinner } from "react-icons/fa";
import Chat from "../../components/chat";



export default function Perfil(){
  const apiClient = SetupApiClient();
  const [isOpenDeletePhoto, setIsOpenDeletePhoto] = useState (false);
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const {user} = useContext(AuthContext);
  const [imagePreview, setImagePreview] = useState(user.photo || null);


  //-------------------------------------------------Deletar foto
  
  const openModalPhotoDelete = useCallback(()=>{
    setIsOpenDeletePhoto(true);
  },[isOpenDeletePhoto]);

  const closeModalPhotoDelete = useCallback(()=>{
    setIsOpenDeletePhoto(false);
  },[isOpenDeletePhoto]);
  

  
  async function HandlePhoto(foto: File): Promise<void> {
    try {
      if (foto.type === "image/jpeg" || foto.type === "image/png") {
        const image = foto;
        setIsAddingPhoto(true);
        
        const data = new FormData();
        data.append('image', image);
  
        const processedPhotoURL = URL.createObjectURL(image);
  
        await apiClient.put('/photo', data);

        setImagePreview(processedPhotoURL);
      }
    } catch (error) {
      toast.warning(error.response?.data?.error || 'Erro desconhecido');
    } finally {
      setIsAddingPhoto(false);
    }
  }
  

//------------------------------------------------------------


  return(
    <>
      <Head>
        <title>
          SalãoCondo - Perfil
        </title>
      </Head>
      <Chat/>
      <Header/>
      <div className={style.bodyArea}>
      
        <main className={style.container}>
        
          <h1>Perfil</h1>
          <div className={style.allItens}>
            <section className={style.section1}>
              <div className={style.photoArea}>
                {imagePreview ?(
                  <img src={imagePreview}/>
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
                  {user.photo &&(
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
                    <p className={style.p2}>{`${user.name} ${user.lastname}`}</p>
                  </article>
                  <article className={style.cards}>
                    <p className={style.p1}>Torre</p>
                    <p className={style.p2}>Torre {user.apartment.tower.numberTower}</p>
                  </article>
                  <article className={style.cards}>
                    <p className={style.p1}>Apartamento:</p>
                    <p className={style.p2}>Apartamento {user.apartment.numberApt}</p>
                  </article>
                  {user.apartment.payment ?(
                  <article className={style.cards}>
                    <p className={style.p1}>Status de pagamento:</p>
                    <p className={`${style.p2} ${user.apartment.payment? style.adimplente : ''}` }> Adimplente </p>
                  </article>
                  ):(
                    <article className={style.cards}>
                      <p className={style.p1}>Status de pagamento:</p>
                      <p className={`${style.p2} ${!user.apartment.payment? style.inadimplente : ''}` }>Inadimplente </p>
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
