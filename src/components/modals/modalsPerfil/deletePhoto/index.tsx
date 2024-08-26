import Gmodal from "../../default";
import { SetupApiClient } from "../../../../services/api";
import {toast} from "react-toastify";
import { FormEvent, useState } from "react";

export default function DeletePhotoModal({isOpen, onClose, setImagePreview}){
    const apiClient = SetupApiClient();
    const [buttonModal, setButtonModal] = useState(false)

    async function handleDeletePhoto(e:FormEvent) {
        e.preventDefault();
        setButtonModal(true);
        try {
            await apiClient.put('/photodelete');
            toast.success('Foto deletada');
            setImagePreview(null);
        } catch (error) {
            toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
        } finally {
            setButtonModal(false);
            onClose();
        }
    }

    return(
        <Gmodal isOpen={isOpen} 
        onClose={onClose}
        className='modal'> 
            <form className='modalContainer' onSubmit={handleDeletePhoto}>
                <div className='beforeButtons'>
                    <h3>Remover foto de perfil</h3>
                    <p>Deseja deletar sua foto de perfil?</p>
                </div>
                <div className='buttonsModal'>
                    <button 
                        className='buttonSlide' 
                        autoFocus={true}
                        disabled={buttonModal}
                        type="submit">
                        <span>Deletar</span>
                    </button>

                    {!buttonModal &&(
                        <button onClick={onClose}  className='buttonSlide'><span>Cancelar</span></button>     
                    )}
                </div>
            </form>

        </Gmodal>
    )
}