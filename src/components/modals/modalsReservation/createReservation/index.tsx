import Gmodal from "../../default";
import { SetupApiClient } from "../../../../services/api";
import {toast} from "react-toastify";
import { FormEvent, useEffect, useState } from "react";
import { formatDate } from "../../../../utils/formatted";


export default function CreateReservationModal({isOpen, onClose, dateValue}){
    const apiClient = SetupApiClient();
    const [buttonModal, setButtonModal] = useState(false)
    const [hoursStart, setHoursStart] = useState<number>(9);
    const [minutesStart, setMinutesStart] = useState<number>(0);
    const [hoursFinish, setHoursFinish] = useState<number>(10);
    const [minutesFinish, setMinutesFinish] = useState<number>(0);
    const [inputClean, setInputClean] = useState (false);

    const addZero = (number:number) =>{
        if (number < 10){
            return `0${number}`;
        }
        else{
            return number;
        }
    }
    
    async function handleCreateReservation(e:FormEvent){

        e.preventDefault();
        
        const start = `${addZero(hoursStart)}${addZero(minutesStart)}`;
        const finish = `${addZero(hoursFinish)}${addZero(minutesFinish)}`;

        if (parseInt(finish) <= parseInt(start)){
            toast.warning('O horário de início da reserva não pode ser posterior ou igual ao término.');
            return
        }

        setButtonModal(true);
        try{
            await apiClient.post('/reservations',{
                date:dateValue,
                cleaning:inputClean,
                start:start,
                finish: finish
            });
            toast.success('Reserva solicitada com sucesso.');
            onClose();
        }catch(error){
            toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
        }finally{
            setButtonModal(false)
        }
    }
    
    function changeSelectStartHours(e){
        const hours = e.target.value;
        setHoursStart(parseInt(hours));
    };

    function changeSelectStarMinutes(e){
        const minutes = e.target.value;
        setMinutesStart(parseInt(minutes));
    };

    function changeSelectFinishHours(e){
        const hours = e.target.value;
        setHoursFinish(parseInt(hours));
    };

    function changeSelectFinishMinutes(e){
        const minutes = e.target.value;
        setMinutesFinish(parseInt(minutes));
    };

    const hoursStartLoop = () => {
        let x = 9;
        const finish = 21;
        let startHoursList = [];
        
        for (; x <= finish; x++) {
            startHoursList.push(
            <option key={x} value={x}>
                {x}
            </option>
            );
        }
        return startHoursList;
    };

    const minutesStartLoop = () => {
        let x = 0;
        const finish = 45;
        let startMinutesList = [];
    
        for (; x <= finish; x = x + 15) {
        startMinutesList.push(
            <option key={x} value={x}>
            {x}
            </option>
        );
        }

        return startMinutesList;
    };

    const hoursFinishLoop = () => {
        let x = 10
        const finish = 22;
        let startHoursList = [];
    
        for (; x <= finish; x++) {
            startHoursList.push(
            <option key={x} value={x}>
                {x}
            </option>
            );
        }
        return startHoursList;
    }

    useEffect(()=>{
        if (!isOpen){
            setHoursStart(9);
            setMinutesStart(0);
            setHoursFinish(10);
            setMinutesFinish(0);
            setInputClean(false);
        }
    },[onClose]);
    
    return(
        <Gmodal isOpen={isOpen} 
        onClose={onClose}
        className='modal'> 
            <form className="modalContainer" onSubmit={handleCreateReservation}>
                <div className="beforeButtons">
                    <h3>Criar reserva</h3>
                    <p>Você gostaria de criar uma reserva para o dia {formatDate(dateValue)}?</p>
                    <div className='selectsHoursArea'>
                        <span>das</span>
                        <div className="selectsArea">
                        <select onChange={changeSelectStartHours} value={hoursStart} autoFocus={true}> 
                            {hoursStartLoop()}
                        </select>
                        <span>:</span>
                        <select onChange={changeSelectStarMinutes} value={minutesStart}>
                            {minutesStartLoop()}
                        </select>
                        </div>
                        <span>às</span>
                        <div className="selectsArea">
                        <select onChange={changeSelectFinishHours} value={hoursFinish}> 
                            {hoursFinishLoop()}
                        </select>
                        <span>:</span>
                        <select onChange={changeSelectFinishMinutes} value={minutesFinish}>
                            {minutesStartLoop()}
                        </select>
                    </div>
                    </div>
                    <div className="modalCheckboxArea">
                    <input type="checkbox" onChange={(e)=>setInputClean(e.target.checked)}/>
                    <p>Serviço de limpeza (R$80,00).</p>
                    </div>
                </div>
                <div className='buttonsModal'>
                    <button 
                        className='buttonSlide' 
                        autoFocus={true}
                        disabled={buttonModal}
                        type="submit">
                        <span>Criar</span>
                    </button>

                    {!buttonModal &&(
                        <button onClick={onClose}  className='buttonSlide'><span>Cancelar</span></button>     
                    )}
                </div>
            </form>

        </Gmodal>
    )
}