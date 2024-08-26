import Gmodal from "../../default";
import { SetupApiClient } from "../../../../services/api";
import {toast} from "react-toastify";
import { FormEvent, useEffect, useState } from "react";
import { IoIosStar } from "react-icons/io";

export default function AvaliationModal({isOpen, onClose, reservation_id}){
    const apiClient = SetupApiClient();
    const [buttonModal, setButtonModal] = useState(false)
    const [ratingEase, setRatingEase] = useState(0);
    const [ratingTime, setRatingTime] = useState(0);
    const [ratingSpace, setRatingSpace] = useState(0);
    const [ratingHygiene, setRatingHygiene] = useState(0);


    async function handleAvaliation(e:FormEvent){
        e.preventDefault();
        if (ratingEase <=0 ||  ratingSpace <=0 ||  ratingHygiene <= 0 || ratingTime <= 0){
            toast.warning('Você precisa enviar uma avaliação.');
            return;
        }

        setButtonModal(true);
        try{
            await apiClient.put('/avaliation',{
                time:ratingTime,
                space:ratingSpace,
                hygiene:ratingHygiene,
                ease:ratingEase,
                reservation_id:reservation_id
        });
            toast.success('Reserva avaliada.');
            onClose();
        }catch(error){
            toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
        }finally{
            setButtonModal(false)
        }
    }

    const renderStarsEase = () => {
        const stars = [];
    
        for (let i = 0; i < 5; i++) {
            let starClass = "star";
        
        if (i < ratingEase) {
            starClass += " filled";
        }
    
        stars.push(
            <button
            key={i}
            type="button"
            className={starClass}
            onClick={(e) => {
                e.preventDefault();
                setRatingEase(i + 1);
            }}
            disabled={buttonModal}>
            <IoIosStar />
            </button>
        );
        }
    
        return stars;
    };
    
    const renderStarsTime = () => {
        const stars = [];

        for (let i = 0; i < 5; i++) {
            let starClass = "star";
            
            if (i < ratingTime) {
                starClass += " filled";
            }

        stars.push(
        <button
            key={i}
            type="button"
            className={starClass}
            onClick={(e) => {
            e.preventDefault();
            setRatingTime(i + 1)
            }}
            disabled={buttonModal}>
            <IoIosStar />
        </button>
        );
    }

    return stars;
    };
    
    const renderStarsSpace = () => {
        const stars = [];

        for (let i = 0; i < 5; i++) {
            let starClass = "star";
            
            if (i < ratingSpace) {
            starClass += " filled";
            }

            stars.push(
            <button
                key={i}
                type="button"
                className={starClass}
                onClick={(e) => {
                e.preventDefault();
                setRatingSpace(i + 1);
                }}
                disabled={buttonModal}>
                <IoIosStar />
            </button>
        );
    }

    return stars;
    };
    
    const renderStarsHygiene = () => {
        const stars = [];
    
        for (let i = 0; i < 5; i++) {
            let starClass = "star";
            
            if (i < ratingHygiene) {
            starClass += " filled";
            }

            stars.push(
            <button
                key={i}
                type="button"
                className={starClass}
                onClick={(e) => {
                e.preventDefault();
                setRatingHygiene(i + 1)
                }}
                disabled={buttonModal}>
                <IoIosStar />
            </button>
            );
        }
    
        return stars;
    };

    useEffect(()=>{
        if (!isOpen){
            setRatingEase(0);
            setRatingTime(0)
        }
    },[onClose]);

    return(
        <Gmodal isOpen={isOpen} 
        onClose={onClose}
        className='modal'> 
            <form className="modalContainer" onSubmit={handleAvaliation}>
                <div className="beforeButtons">
                    <h3>Finalizar e avaliar reserva</h3>

                    <div className="avaliationContainer">
                    <p>Facilidade de Reserva:</p>
                    <div className="buttonAvaliation">
                        {renderStarsEase()}
                    </div>
                    </div>

                    <div className="avaliationContainer">
                    <p>Tempo para Aprovação da Reserva:</p>
                    <div className="buttonAvaliation">
                        {renderStarsTime()}
                    </div>
                    </div>

                    <div className="avaliationContainer">
                    <p>Condição do Espaço:</p>
                    <div className="buttonAvaliation">
                    {renderStarsSpace()}
                    </div>
                    </div>

                    <div className="avaliationContainer">
                    <p>Higiene do Espaço:</p>
                    <div className="buttonAvaliation">
                        {renderStarsHygiene()}
                    </div>
                    </div>
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