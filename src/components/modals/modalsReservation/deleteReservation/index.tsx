import Gmodal from "../../default";
import { SetupApiClient } from "../../../../services/api";
import {toast} from "react-toastify";
import { FormEvent, useState } from "react";


export default function DeleteReservationModal({isOpen, onClose, reservation_id}){
    const apiClient = SetupApiClient();
    const [buttonModal, setButtonModal] = useState(false)


    async function handleDeleteReservation(e:FormEvent){
        e.preventDefault();

        if (reservation_id === ''){
            toast.warning('Reserva não encontrada.');
            return;
        }

        setButtonModal(true);
        try{
            await  apiClient.delete('/reservations',{
                data:{
                reservation_id:reservation_id
                }
            });
            toast.success('Reserva cancelada com sucesso.');
            onClose();
        }catch(error){
            toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
        }finally{
            setButtonModal(false);
        }
    }
    

    return(
        <Gmodal isOpen={isOpen} 
        onClose={onClose}
        className='modal'> 
            <form className="modalContainer" onSubmit={handleDeleteReservation}>
                <div className="beforeButtons">
                    <h3>Cancelar reserva</h3>
                    <p><b>Observação: </b>Cancelamentos de reservas aprovadas com menos de 2 dias de
                    antecedência da data do evento estão sujeitos a uma taxa de R$ 100,00.
                    Deseja confirmar o cancelamento? </p>

                    <div>
                        
                    </div>
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