import Head from "next/head";
import Header from "../../components/header";
import { Input } from "../../components/ui/input";
import {FiLogOut} from "react-icons/fi";
import {ChangeEvent, FormEvent, useState, useEffect} from "react";
import style from './styles.module.scss';
import {AiTwotoneDelete} from "react-icons/ai";
import { singOut } from "../../contexts/AuthContexts";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { SetupApiClient } from "../../services/api";
import { toast } from "react-toastify";
import zxcvbn from 'zxcvbn';
import Modal from "react-modal";
import { Loading } from "../../components/loading";



type UserPropsItens = {
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
    
interface UserInterface{
    userProps: UserPropsItens;
}

export default function Settings({userProps}: UserInterface){
Modal.setAppElement('#__next');

const [userDate, setUserDate] = useState(userProps || null);
const [inputPass, setInputPass] = useState(false);
const [oldPass, setOldPass] = useState ('');
const [newPass, setNewPass] = useState ('');
const [isOpen, setIsOpen] = useState (false);
const [inputDelete, setInputDelete] = useState ('');
const [loading, setLoading ] = useState(true);
const [check, setCheckBox] = useState (false);

async function refreshDate(){
    try{
        const setupApi = SetupApiClient();
        const response = await setupApi.get('/me');
        setUserDate(response.data)
        setLoading(false);
    }catch(err){
        console.log('Erro ao obter dados do servidor');
        setTimeout(refreshDate, 500);
    }
}
useEffect(()=>{
    refreshDate();
},[]);

function changeInputPass(){
    setInputPass(true);
}

async function handlePass(e:FormEvent){
    e.preventDefault();
    const SetupApi = SetupApiClient();
    if (newPass === "" || oldPass === ""){
        cancelPass(e);
        return;
    }
    if(newPass === oldPass){
        toast.warning('Senha duplicada. Por favor, escolha uma senha diferente da anterior.');
        return;
    }
    if (zxcvbn(newPass).score < 3) {
        toast.warning('A senha deve conter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.');
        return;
    }
    try{
        await SetupApi.put('/password',{
            pass:oldPass,
            newPass: newPass
        })
        toast.success("A senha foi alterada com êxito!");
        cancelPass(e);
        refreshDate();

    }catch(error){
        toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
    }
}

function cancelPass(e:FormEvent){
    e.preventDefault();
    setInputPass(false);
    setOldPass('');
    setNewPass('');
}

function openModal(){
    setIsOpen(true);
}

function closeModal(){
    setIsOpen(false);
    setInputDelete('');
    setCheckBox(false);
}

async function handleDeleteAccount(e:FormEvent){
    e.preventDefault();
    const SetupApi = SetupApiClient();
    try{
        await SetupApi.delete('/account',{
            data:{
                pass:inputDelete
            }   
        })
        toast.success("Sua conta foi excluída com êxito.");
        singOut();
        
    }catch(error){
        toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
        return;
    }
}

    if (loading){
        return <Loading/>;
    }
    
    return(
        <>
        <Head>
            <title>SalãoCondo - Configurações</title>
        </Head>
        <Header/>
        <main className={style.container}>
            <h1>Configurações</h1>
            <section className={style.section1}>
                <h2>Dados</h2>
                <div className={style.conteudo1}>
                    <p>Nome: {userDate.name}</p>
                    <p>Sobrenome: {userDate.lastname}</p>
                    <p>Residência: Torre {userDate.apartment.tower.numberTower} - Apartamento {userDate.apartment.numberApt}</p>
                    <p>Email: {userDate.email}</p>
                </div>
            </section>

            <section className={style.section2}>
                <h2>Segurança</h2>
                <div className={style.conteudo2}>
                <p>Alterar senha: </p>
                    <form className={style.formChangePass} onSubmit={handlePass}>   
                        <Input placeholder="Digite sua senha atual:"
                        type="password" 
                        disabled={!inputPass}
                        value={oldPass}
                        onChange={(e)=>setOldPass(e.target.value)}
                        />

                        <Input placeholder="Sua nova senha:"
                        type="password"
                        disabled={!inputPass}
                        value={newPass}
                        onChange={(e)=>setNewPass(e.target.value)}
                        />

                        <div className={style.buttons}>
                        {!inputPass ?(
                            <button onClick={changeInputPass}><p>Alterar</p></button>
                        ):null}   

                        {inputPass ?(
                            <>  
                                <button type="submit"><p>Salvar</p></button> 
                                <button onClick={cancelPass}><p>Cancelar</p></button>
                            </>
                        ):null}
                        </div>
                    </form> 
                </div>     
            </section>

            <section className={style.section3}>
                <h2>Apagar conta</h2>
                <button onClick={openModal}>Deletar minha conta <AiTwotoneDelete/></button>
            </section>

            <span className={style.logout}>
                <h2>Fazer logout</h2>
                <div className={style.areaButton}>
                    <button onClick={singOut}><FiLogOut/></button>
                </div>
            </span>
        </main>

        <Modal isOpen={isOpen}
            onRequestClose={closeModal}
            className='modal'
            style={{overlay:{
                backgroundColor: 'rgba(0, 0, 0, 0.3)'
                }}}>
                <form className="modalContainer" onSubmit={handleDeleteAccount}>
                <div className="beforeButtons">
                    <h3>Excluir conta</h3>
                    <p>Tem certeza de que deseja excluir permanentemente sua conta?</p>
                    <input type="password" 
                    placeholder="Digite sua senha"
                    value={inputDelete} autoFocus={true}
                    onChange={(e)=>setInputDelete(e.target.value)}
                    className='inputModal'/>
                    <div className="modalCheckboxArea">
                        <input type="checkbox" onChange={(e)=>setCheckBox(e.target.checked)}/>
                        <p>Excluir minha conta</p>
                    </div>
                </div>
                <div className='buttonsModal'>
                    <button disabled={!check} type="submit" className='true'><span>Deletar</span></button>
                    <button onClick={closeModal}  className='false'><span>Cancelar</span></button>      
                </div>
                </form>
            </Modal>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    try {
        const SetupApi = SetupApiClient(ctx);
        const response = await SetupApi.get('/me');
        return {
            props: {
                userProps: response.data
            }
        };
    } 
    catch (error) {
    console.error('Erro ao obter dados da api');
        return {
            props: {
                userProps: []
            },
        };
    }   
});