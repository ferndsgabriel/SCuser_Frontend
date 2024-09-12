import { useState, useEffect, FormEvent, useRef } from "react";
import { Loading } from "../../../loading";
import InputMask from 'react-input-mask';
import styles from "./styles.module.scss";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import { SetupApiClient } from "../../../../services/api";
import { onlyString } from "../../../../utils/formatted";
import Gmodal from "../../default";



interface GuestProps{
    name: string;
    rg:string;
    reservation_id?:string
    id:string | null;
}

export default function  Addname ({id, guest, onClose, isOpen}){
    const [list, setList] = useState<GuestProps[]>([]);
    const [listDelete, setListDelete] = useState<GuestProps[]>([]);
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
                setList(guest);
            }catch(error){
                setList([]);
            }finally{
                setLoading(false);
            }
        }else{
            setInputName('');
            setInputRG('');
        }
    },[isOpen, onClose]);

    function handleRemove(index:number) {
        setList(list.filter((item, i) => i !== index));
        setListDelete((prev)=>[...prev, list[index]]);
    }

    
    function handleAdd(e: FormEvent) {
        e.preventDefault();
    
        if (!inputName || inputName.length < 3 || !inputRG) {
            toast.warning('Por favor, preencha os campos corretamente.');
            return;
        }
    
        const nameWithoutSpecialChars = /^[a-zA-Z\s]+$/;
        if (!nameWithoutSpecialChars.test(inputName)) {
            toast.warning('O nome não pode conter caracteres especiais ou números.');
            return;
        }
    
        const withMask = inputRG.replace(/\D/g, '');
        if (withMask.length !== 4) {
            toast.warning('Por favor, insira exatamente 4 dígitos do RG.');
            return;
        }
    
        if (list.length >= 20) {
            toast.warning('Limite máximo de convidados: 20.');
            return;
        }
    
        const addGuest = {
            name: inputName.trim(),
            rg: inputRG,
            id: null,
        };
    
        setList([...list, addGuest]);
        setInputName('');
        setInputRG('');
        inputNameRef.current?.focus();
    }
    

    async function handleGuest(){


        const withoutId = list.filter((item)=>{
            return item.id == null;
        });

        const deleteItens = listDelete
        .filter((item) => item.id != null)
        .map((item) => item.id); 
    

        const promises = [];


        if (withoutId.length > 0) {
            const createGuestPromise = apiClient.put('/guest', {
                createGuest: {
                    reservation_id: id,
                    Guest: withoutId,
                },
            });
            promises.push(createGuestPromise); 
        }
        
        if (deleteItens.length > 0) {
            const deleteGuestPromise = apiClient.delete('/guest', {
                data: {
                    deleteGuest: { Guest: deleteItens },
                },
            });
            promises.push(deleteGuestPromise); 
        }
        
        setButtonModal(true);
        if (promises.length > 0) {
            try {
                const [response, response2] = await Promise.all(promises);
                toast.success('Lista atualizada com sucesso.');
                onClose();
            } catch (error) {
                toast.warning(error.response?.data?.error || 'Erro desconhecido');
            }finally{
                setButtonModal(false);
            }
        }else{
            onClose();
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
                                                <span>{index + 1}: {item.name} - {item.rg}</span>
                                                <button onClick={()=>handleRemove(index)}><AiOutlineClose /></button>
                                            </li>
                                        )
                                    })}
                                </ul>
                                <div className={styles.buttons}>
                                    {!buttonModal &&(
                                        <button onClick={onClose}>Cancelar</button>
                                    )}
                                    <button onClick={handleGuest} disabled={buttonModal} >Salvar</button>
                                </div>
                            </div>
                        </div>
                    </Gmodal>
                )
            ):null}
        </>
    )
}