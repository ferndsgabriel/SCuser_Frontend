import Head from "next/head";
import Header from "../../components/header";
import { Input } from "../../components/ui/input";
import {FiLogOut} from "react-icons/fi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import {ChangeEvent, FormEvent, useState, useEffect} from "react";
import style from './styles.module.scss';
import {AiTwotoneDelete} from "react-icons/ai";
import { singOut } from "../../contexts/AuthContexts";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { SetupApiClient } from "../../services/api";
import { toast } from "react-toastify";
import zxcvbn from 'zxcvbn';
import { Loading } from "../../components/loading";
import { Gmodal } from "../../components/myModal";


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
    const [inputDelete, setInputDelete] = useState ('');
    const [loading, setLoading ] = useState(true);
    const [check, setCheckBox] = useState (false);
    const [isOpenBug, setIsOpenBug] = useState(false);
    const [isOpenFeedback, setIsOpenFeedback] = useState(false);
    const [textArea, setTextArea] = useState("");
    const [typeReport, setTypeReport] = useState(0);

    const faqData = require ("../../faq.json");
    const faq: FAQData = faqData as FAQData;
    const [expandedQuestions, setExpandedQuestions] = useState({});

    const handleCheckboxChange = (question) => {
        setExpandedQuestions({
            ...expandedQuestions,
            [question]: !expandedQuestions[question]
        });
    };

    async function refreshDate(){
        try{
            const response = await SetupApi.get('/me');
            setUserDate(response.data)
            setLoading(false);
        }catch(err){
            ('Erro ao obter dados do servidor');
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

    function openModalBug(){
        setTypeReport(1);
        setIsOpenBug(true);
    }
    function closeModalBug(){
        setTextArea('');
        setTypeReport(0);
        setIsOpenBug(false);
    }

    function openModalFeedback(){
        setTypeReport(2);
        setIsOpenFeedback(true);
    }
    function closeModalFeedback(){
        setTextArea('');
        setTypeReport(0);
        setIsOpenFeedback(false);
    }

    async function handleReport(e:FormEvent){
        e.preventDefault();
        if (!textArea){
            toast.warning('Reporte o seu problema.');
            return;
        }
        try{
            await SetupApi.post('/report',{
                message:textArea,
                option:typeReport
            });
        toast.success('Reporte enviado com sucesso.');
        closeModalBug();
        closeModalFeedback();
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
                <h2>Reportar</h2>
                <div className={style.btnReports}>
                    <button onClick={openModalBug}><p>Bug ou problemas</p></button>
                    <button onClick={openModalFeedback}><p>Feedback</p></button>
                </div>
            </section>

        <section className={style.section4} id="section4">
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
                                <span>
                                    {isExpanded ?(
                                        <FaAngleUp/>
                                    ):<FaAngleDown />}
                                </span>
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

            <section className={style.section5}>
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
    
        <Gmodal isOpen={isOpen}
            onClose={closeModal}
            className="modal">
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
            </Gmodal>

            <Gmodal isOpen={isOpenBug}
            onClose={closeModalBug}
            className="modal">
                <form className="modalContainer" onSubmit={handleReport}>
                <div className="beforeButtons">
                    <h3>Reportar bug ou problemas</h3>
                    <p>Reporte um bug no sistema ou solicite ajuda para resolver um problema.</p>
                    <textarea 
                    placeholder="Digite seu problema..."
                    value={textArea} autoFocus={true}
                    onChange={(e)=>setTextArea(e.target.value)}
                    className='textAreaModal'
                    minLength={30}
                    maxLength={2000}/>
                </div>
                <div className='buttonsModal'>
                    <button type="submit" className='true'><span>Reportar</span></button>
                    <button onClick={closeModalBug}  className='false'><span>Cancelar</span></button>      
                </div>
                </form>
            </Gmodal>

            <Gmodal isOpen={isOpenFeedback}
            onClose={closeModalFeedback}
            className="modal">
                <form className="modalContainer" onSubmit={handleReport}>
                <div className="beforeButtons">
                    <h3>Compartilhe seu feedback</h3>
                    <p>Reporte sugestões de melhorias para o nosso time.</p>
                    <textarea 
                    placeholder="Digite seu problema..."
                    value={textArea} autoFocus={true}
                    onChange={(e)=>setTextArea(e.target.value)}
                    className='textAreaModal'
                    minLength={30}
                    maxLength={2000}/>
                </div>
                <div className='buttonsModal'>
                    <button type="submit" className='true'><span>Reportar</span></button>
                    <button onClick={closeModalFeedback}  className='false'><span>Cancelar</span></button>      
                </div>
                </form>
            </Gmodal>
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