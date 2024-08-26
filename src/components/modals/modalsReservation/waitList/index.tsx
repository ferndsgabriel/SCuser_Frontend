import Gmodal from "../../default";
import { SetupApiClient } from "../../../../services/api";
import {toast} from "react-toastify";
import { FormEvent, useState } from "react";
import { formatDate } from "../../../../utils/formatted";


export default function WaitListModal({isOpen, onClose, dateValue}){
    const apiClient = SetupApiClient();
    const [buttonModal, setButtonModal] = useState(false)


    async function handleAwait(e:FormEvent){
            e.preventDefault();

            if (dateValue === null){
            toast.warning('Data inválida.');
            }

            setButtonModal(true);
            try{
                await apiClient.post('/list',{
                    date:dateValue
                });
                toast.success('Adicionado a lista de espera com sucesso.');
            }catch(error){
                toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
            }finally{
                setButtonModal(false);
                onClose();
            }
        }
    

    return(
        <Gmodal isOpen={isOpen} 
        onClose={onClose}
        className='modal'> 
            <form className="modalContainer" onSubmit={handleAwait}>
                <div className="beforeButtons">
                    <h3>Lista de espera</h3>
                    <p>Você gostaria de se inscrever na lista de espera? Em caso de cancelamento da reserva, você será notificado por meio de SMS e e-mail.</p>
                </div>
                
                <div className='buttonsModal'>
                    <button 
                        className='buttonSlide' 
                        autoFocus={true}
                        disabled={buttonModal}
                        type="submit">
                        <span>Confirmar</span>
                    </button>

                    {!buttonModal &&(
                        <button onClick={onClose}  className='buttonSlide'><span>Cancelar</span></button>     
                    )}
                </div>
            </form>
        </Gmodal>
    )
}