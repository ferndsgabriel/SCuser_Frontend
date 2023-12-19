import { useState, useEffect, FormEvent, useRef } from "react";
import { Loading } from "../../loading";
import InputMask from 'react-input-mask';
import styles from "./styles.module.scss";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import { SetupApiClient } from "../../../services/api";
import { onlyString } from "../../../utils/formatted";

interface guestProps {
    id:string,
    guest:string,
    closeModal:()=>void;
}

export const AddGuest = ({id, guest, closeModal}:guestProps)=>{
    const guestList = guest || null;
    const reservation_id = id;
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inputName, setInputName] = useState('');
    const [inputRG, setInputRG] = useState('');
    const inputNameRef = useRef<HTMLInputElement>(null);
    const apiClient = SetupApiClient();

    useEffect(()=>{
        try{
            setList(guestList.split(','))
        }catch(error){
            setList([]);
        }
        setLoading(false);
    },[]);

    function handleRemove(index) {
        setList(list.filter((item, i) => i !== index));
    }
    
    function handleAdd(e:FormEvent){
        e.preventDefault();
        if (!inputName || inputName.length < 3 || !inputRG ){
            toast.warning('Por favor, preencha os campos corretamente.');
            return;
        }

        if (!onlyString(inputName)){
            toast.warning('Nome inválido.');
            return
        }
        const withMask = inputRG.replace(/\D/g, '');
            
        if (withMask.length !== 5) {
            toast.warning('Por favor, insira exatamente 5 dígitos do RG.');
            return;
        }

        if (list.length >= 20){
            toast.warning('Limite máximo de convidados: 20.');
            return;
        }
        
        const addGuest = `${inputName}    -    ${inputRG}.XXX-X`;
        setList([...list, addGuest]);
        setInputName('');
        setInputRG('');
        inputNameRef.current?.focus();
    }

    async function handleGuest(){
        const slice = list.join(',')
        try{
            await apiClient.put('/guest',{
                reservation_id:reservation_id,
                guest:slice
            });
            toast.success('Lista adicionada com sucesso.');
        closeModal();
        }catch(error){
            toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
            return;
        }
    }

    if (loading){
        return(
            <Loading/>
        )
    }
    return(
        <>
            <div className={styles.container}>
                <div className={styles.addGuest}>
                    <div className={styles.borderArea}>
                        <h2>Lista de convidados</h2>
                    </div>
                    <form onSubmit={handleAdd} className={styles.form}>
                        <input placeholder="Digite o nome" value={inputName}
                        onChange={(e)=>setInputName(e.target.value)} autoFocus={true} ref={inputNameRef}/>
                        <InputMask placeholder='Digite o RG' mask='99.999' value={inputRG}
                        onChange={(e)=>setInputRG(e.target.value)}/>
                        <button type="submit"><AiOutlinePlus /></button>
                    </form>
                    <ul className={styles.ul}>
                        {list.map((item, index)=>{
                            return(
                                <li key={index} onClick={()=>handleRemove(index)}>
                                    <span>{index + 1} - {item}</span>
                                    <button onClick={()=>handleRemove(index)}><AiOutlineClose /></button>
                                </li>
                            )
                        })}
                    </ul>
                    <div className={styles.buttons}>
                        <button onClick={closeModal}>Cancelar</button>
                        <button onClick={handleGuest}>Salvar</button>
                    </div>
                </div>
            </div>
        </>
    )
}