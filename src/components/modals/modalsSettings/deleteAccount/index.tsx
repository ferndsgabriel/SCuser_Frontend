import Gmodal from "../../default";
import { FormEvent, useEffect, useState, ChangeEvent, useContext } from "react";
import { toast } from "react-toastify";
import { SetupApiClient } from "../../../../services/api";
import { AuthContext } from "../../../../contexts/AuthContexts";

export default function DeleteAccountModal({isOpen, onClose}){
    const {signOut} = useContext(AuthContext);
    const [loadingModal, setLoadingModal] = useState(false);
    const setupApi = SetupApiClient();
    const [inputDelete, setInputDelete] = useState ('');
    const [checkBox, setCheckBox] = useState (false);

    async function handleDeleteAccount(e:FormEvent){
        e.preventDefault();

        setLoadingModal(true);
        try{
            await setupApi.delete('/account',{
                data:{
                    pass:inputDelete
                }   
            })
            toast.success("Sua conta foi excluída com êxito.");
            signOut();
            
        }catch(error){
            toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
            return;
        }finally{
            setLoadingModal(false);
        }
    }

    function handleCheckboxChange(e:ChangeEvent<HTMLInputElement>){
        setCheckBox(e.target.checked)
    }

    useEffect(()=>{
        if (!isOpen){
            setInputDelete("");
            setCheckBox(false);
        }
    },[onClose])

    return(
        <Gmodal isOpen={isOpen}
            onClose={onClose}
            className='modal'>   
            <form className='modalContainer' onSubmit={handleDeleteAccount}>
                <div className='beforeButtons'>
                    <h3>Deletar conta</h3>
                    <p>Tem certeza de que deseja excluir permanentemente sua conta?</p>
                    <input type="password" 
                    placeholder="Digite sua senha"
                    value={inputDelete} autoFocus={true}
                    onChange={(e)=>setInputDelete(e.target.value)}
                    className='inputModal'/>
                    <div className='modalCheckboxArea'>
                        <input type="checkbox"  onChange={handleCheckboxChange} className=''/>
                        <p>Excluir minha conta</p>
                    </div>
                </div>
                <div className='buttonsModal'>
                    {checkBox && (
                        <button type="submit" className='buttonSlide'
                        autoFocus={true} disabled={loadingModal}>Confirmar</button>
                    )} 
                    {!loadingModal && (
                    <button onClick={onClose} className='buttonSlide'>Cancelar</button>
                    )}
                </div>
            </form>
    </Gmodal>

    )
}