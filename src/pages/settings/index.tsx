import Head from "next/head";
import Header from "../../components/header";
import { Input } from "../../components/ui/input";
import {FiLogOut} from "react-icons/fi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import {FormEvent, useState, useEffect} from "react";
import style from './styles.module.scss';
import {AiTwotoneDelete} from "react-icons/ai";
import { singOut } from "../../contexts/AuthContexts";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { SetupApiClient } from "../../services/api";
import { toast } from "react-toastify";
import zxcvbn from 'zxcvbn';
import { Loading } from "../../components/loading";
import Chat from "../../components/chat";

import FeedBackModal from "../../components/modals/modalsSettings/feedback";
import BugsModal from "../../components/modals/modalsSettings/bugs";
import DeleteAccountModal from "../../components/modals/modalsSettings/deleteAccount";

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
interface FAQItem {
    question: string;
    answers: string[];
}

interface FAQData {
    faq: FAQItem[];
}

export default function Settings({userProps}: UserInterface){
    const SetupApi = SetupApiClient();
    const [userDate, setUserDate] = useState(userProps || null);
    const [inputPass, setInputPass] = useState(false);
    const [oldPass, setOldPass] = useState ('');
    const [newPass, setNewPass] = useState ('');
    const [isOpen, setIsOpen] = useState (false);
    const [loading, setLoading ] = useState(true);
    const [isOpenBug, setIsOpenBug] = useState(false);
    const [isOpenFeedback, setIsOpenFeedback] = useState(false);

    const faqData = require ("../../faq.json");
    const faq: FAQData = faqData as FAQData;
    const [expandedQuestions, setExpandedQuestions] = useState({});

    const handleCheckboxChange = (question) => {
        setExpandedQuestions({
            ...expandedQuestions,
            [question]: !expandedQuestions[question]
        });
    };


    useEffect(()=>{
        
        async function refreshDate(){
            try{
                const response = await SetupApi.get('/me');
                setUserDate(response.data)
            }catch(err){
                console.log('Erro ao obter dados do servidor');
            }finally{
                setLoading(false);
            }
        }
        refreshDate();
    },[]);
    

    function changeInputPass(){
        setInputPass(true);
    }

    async function handlePass(e:FormEvent){
        e.preventDefault();
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
    }

    function openModalBug(){
        setIsOpenBug(true);
    }
    function closeModalBug(){
        setIsOpenBug(false);
    }

    function openModalFeedback(){
        setIsOpenFeedback(true);
    }
    function closeModalFeedback(){
        setIsOpenFeedback(false);
    }



    if (loading){
        return <Loading/>;
    }
        
    return(
        <>
            <Head>
                <title>SalãoCondo - Configurações</title>
            </Head>
            <Chat/>

            <Header/>
            <div className={style.bodyArea}>
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
                                    <button onClick={changeInputPass} className="buttonSlide"><span>Alterar</span></button>
                                ):null}   

                                {inputPass ?(
                                    <>  
                                        <button type="submit" className="buttonSlide">Salvar</button> 
                                        <button onClick={cancelPass}  className="buttonSlide">Cancelar</button>
                                    </>
                                ):null}
                                </div>
                            </form> 
                        </div>     
                    </section>

                    <section className={style.section3}>
                    <h2>FAQ - Perguntas frequentes</h2>
                    <div className={style.questionsArea}>
                        {faq.faq.map((item, index) => {
                            const isExpanded = expandedQuestions[item.question];
                            return (
                                <div key={item.question} className={style.cardQuestion}>
                                    <label className={style.labelQuestion}>
                                        <h4>{item.question}</h4>
                                        <input
                                            type="checkbox"
                                            checked={isExpanded}
                                            onChange={() => handleCheckboxChange(item.question)}
                                        />
                                        {isExpanded ?(
                                            <FaAngleUp/>
                                        ):<FaAngleDown />}
                                        
                                    </label>
                                    {isExpanded && (
                                        <ul className={style.answer}>
                                            {item.answers.map((answer, index) => (
                                                <li key={index}>{answer}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    </section>

                    <section className={style.section4}>
                        <h2>Reportar</h2>
                        <div className={style.btnReports}>
                            <button onClick={openModalBug} className="buttonSlide">Bugs ou problemas</button>
                            <button onClick={openModalFeedback} className=  "buttonSlide">Feedback</button>
                        </div>
                    </section>


                    <section className={style.section5}>
                        <h2>Apagar conta</h2>
                        <button onClick={openModal} className="buttonSlide"><span>Deletar minha conta <AiTwotoneDelete/></span></button>
                    </section>

                    <section className={style.section6}>
                        <h2>Fazer logout</h2>
                        <div className={style.areaButton}>
                            <button onClick={singOut} className="buttonSlide"><span>Sair da conta<FiLogOut/></span></button>
                        </div>
                    </section>
                </main>
            </div>
        
            <DeleteAccountModal 
            isOpen={isOpen}
            onClose={closeModal}
            />

            <BugsModal
            isOpen={isOpenBug}
            onClose={closeModalBug}
            />
            <FeedBackModal
            isOpen={isOpenFeedback}
            onClose={closeModalFeedback}
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