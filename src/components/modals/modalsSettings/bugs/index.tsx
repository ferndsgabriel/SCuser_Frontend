import Gmodal from "../../default";
import { SetupApiClient } from "../../../../services/api";
import {toast} from "react-toastify";
import { FormEvent, useState, useEffect } from "react";

export default function BugsModal({isOpen, onClose}){
    const apiClient = SetupApiClient();
    const [textArea, setTextArea] = useState("");
    const [buttonModal, setButtonModal] = useState(false);
    

    async function handleReport(e:FormEvent){
        e.preventDefault();
        if (!textArea){
            toast.warning('Reporte o seu problema.');
            return;
        }
        setButtonModal(true);
        try{
            await apiClient.post('/report',{
                message:textArea,
                option:2
            });
        toast.success('Reporte enviado com sucesso.');
        onClose();
        }catch(error){
            toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
            return; 
        }finally{
            setButtonModal(false);
        }
    }

    useEffect(()=>{
        if (!isOpen){
            setTextArea('');
        }
    },[onClose]);

    return(
        <Gmodal isOpen={isOpen} 
        onClose={onClose}
        className='modal'> 
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
                <button 
                    className='buttonSlide' 
                    autoFocus={true}
                    disabled={buttonModal}
                    type="submit">
                    <span>Reportar</span>
                </button>

                {!buttonModal &&(
                    <button onClick={onClose}  className='buttonSlide'><span>Cancelar</span></button>     
                )}
            </div>
        </form>
        </Gmodal>
    )
}