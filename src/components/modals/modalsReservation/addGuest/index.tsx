import { useState, useEffect, FormEvent, useRef } from "react";
import { Loading } from "../../../loading";
import InputMask from 'react-input-mask';
import styles from "./styles.module.scss";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import { SetupApiClient } from "../../../../services/api";
import { onlyString } from "../../../../utils/formatted";
import Gmodal from "../../default";



export default function  AddGuest ({id, guest, onClose, isOpen}){
    const guestList = guest || null;
    const reservation_id = id;
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inputName, setInputName] = useState('');
    const [inputRG, setInputRG] = useState('');
    const inputNameRef = useRef<HTMLInputElement>(null);
    const [buttonModal, setButtonModal] = useState(false);
    const apiClient = SetupApiClient();

    useEffect(()=>{
        if (isOpen){
            setLoading(true);
            try{
                setList(guestList.split(','))
            }catch(error){
                setList([]);
            }finally{
                setLoading(false);
            }
        }
    },[isOpen]);

    function handleRemove(index) {
        setList(list.filter((item, i) => i !== index));
    }
    
    function handleAdd(e:FormEvent){
        e.preventDefault();
        if (!inputName || inputName.length < 3 || !inputRG ){
            toast.warning('Por favor, preencha os campos corretamente.');
            return;
        }

        if (!onlyString(inputName.trim())){
            toast.warning('Nome inválido.');
            return
        }
        const withMask = inputRG.replace(/\D/g, '');
            
        if (withMask.length !== 4) {
            toast.warning('Por favor, insira exatamente 5 dígitos do RG.');
            return;
        }

        if (list.length >= 20){
            toast.warning('Limite máximo de convidados: 20.');
            return;
        }
        
        const addGuest = `${inputName.trim()}    -    XX.XXX-${inputRG}`;
        setList([...list, addGuest]);
        setInputName('');
        setInputRG('');
        inputNameRef.current?.focus();
    }

    async function handleGuest(){
        const slice = list.join(',');

        setButtonModal(true);
        try{
            await apiClient.put('/guest',{
                reservation_id:reservation_id,
                guest:slice
            });
            toast.success('Lista adicionada com sucesso.');
            onClose();
        }catch(error){
            toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
        }finally{
            setButtonModal(false);
        }
    }

    return(
        <>
            {isOpen ? (
                loading ? (
                    <Loading/>
                ):(
                    <Gmodal isOpen={isOpen} onClose={onClose} className={styles.modalGuest}>
                        <div className={styles.container}>
                            <div className={styles.addGuest}>
                                <div className={styles.borderArea}>
                                    <h2>Lista de convidados</h2>
                                </div>
                                <form onSubmit={handleAdd} className={styles.form}>
                                    <input placeholder="Digite o nome" value={inputName}
                                    onChange={(e)=>setInputName(e.target.value)} autoFocus={true} ref={inputNameRef}/>
                                    <InputMask placeholder='Os 4 últimos dígitos do RG' type="tel" mask='999-9' value={inputRG}
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
                                    {!buttonModal &&(
                                        <button onClick={onClose}>Cancelar</button>
                                    )}
                                    <button onClick={handleGuest} disabled={buttonModal}>Salvar</button>
                                </div>
                            </div>
                        </div>
                    </Gmodal>
                )
            ):null}
        </>
    )
}