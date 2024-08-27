import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "../../components/header";
import { Loading } from "../../components/loading";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { SetupApiClient } from "../../services/api";
import styles from "./styles.module.scss";
import { AiOutlineClose, AiOutlineUnorderedList } from "react-icons/ai";
import {formatDate, formatHours} from "../../utils/formatted";
import Link from "next/link"
import CreateReservationModal from "../../components/modals/modalsReservation/createReservation";
import DeleteReservationModal from "../../components/modals/modalsReservation/deleteReservation";
import WaitListModal from "../../components/modals/modalsReservation/waitList";
import AvaliationModal from "../../components/modals/modalsReservation/modalAvaliation";
import AddGuest from "../../components/modals/modalsReservation/addGuest";

import Head from "next/head";

type ReservationsProps = {
  date: number;
  start: number;
  finish: number;
  cleaningService: boolean;
  guest: null | string;
  reservationStatus: boolean;
  id:string;
  isEvaluated :boolean
};

interface CalendarProps {
  isBusy:boolean,
  date:number
}

export default function Reservation() {
  const [myReservationsList, setMyReservationsList] = useState<ReservationsProps[]>([]);
  const [allReservationsList, setAllReservationsList] = useState<ReservationsProps[]>([]);
  const [allNoAvaliationList, setAllNoAvaliationList] = useState<ReservationsProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpenWait, setIsOpenWait ] = useState (false);
  const [isOpenCreateReservation, setIsOpenCreateReservation] = useState(false);
  const [reservation_id, setReservation_id] = useState('');
  const [isOpenDeleteReservation, setIsOpenDeleteReservation] = useState(false);
  const [isOpenGuestReservation, setIsOpenGuestReservation] = useState(false);
  const [guest, setGuest] = useState('');
  const [isOpenModalAvaliation, setIsOpenModalAvaliation] = useState(false);
  const [dateValue, setDateValue] = useState<number>(null);
  const [calendarDate, setCalendarDate] = useState<CalendarProps>();
  const setupApi = SetupApiClient();



  useEffect(()=>{
    async function refreshDate(){

      if (loading || !isOpenCreateReservation
        || !isOpenDeleteReservation 
        || !isOpenModalAvaliation 
        || !isOpenGuestReservation){

        try{
          const [response, response1, response2] = await Promise.all([
          await setupApi.get('/myreservations'),
          await setupApi.get('/allreservations'),
          await setupApi.get('/noavaliation')
          ])
          setMyReservationsList(response.data);
          setAllReservationsList(response1.data);
          setAllNoAvaliationList(response2.data);
          
        }catch(error){
            console.log(error);
        }finally{
          setLoading(false);
        }
      }
    }

    refreshDate();
  },[loading, isOpenCreateReservation, isOpenDeleteReservation, isOpenModalAvaliation, isOpenGuestReservation]);
  ////////////////////////////////////////////////// refresh /////////////////////////////////////////////////////

  useEffect(()=>{
    if (calendarDate){
      setDateValue(calendarDate.date);
      if (calendarDate.isBusy){
        openModalWait();
      }else{
        openModalCreateReservation();
      }
    }
  },[calendarDate]);
  ////////////////////////////////////////////////// get day on click ///////////////////////////////////////////////

  function closeModalWait(){
    setDateValue(null);
    setIsOpenWait(false);
  }
  function openModalWait(){
    setIsOpenWait(true);
  }
  //---------------------- wait list and reservation ------------


  const closeModalCreateReservation = useCallback (()=>{
    setDateValue(null);
    setIsOpenCreateReservation(false);
  },[isOpenCreateReservation]);
  
  const openModalCreateReservation = useCallback (()=>{
    setIsOpenCreateReservation(true);
  },[isOpenCreateReservation]);
  //--------------------------Create reservation -----------------------------------


  const openModalDeleteReservation = useCallback((id:string)=>{
    setReservation_id(id);
    setIsOpenDeleteReservation(true);
  },[isOpenDeleteReservation]);

  const closeModalDeleteReservation = useCallback(()=>{
    setReservation_id('');
    setIsOpenDeleteReservation(false);
  },[isOpenDeleteReservation]);
  //--------------------------Delete reservation -----------------------------------

  const openModalGuest = useCallback((id:string, guest:string)=>{
    setGuest(guest);
    setReservation_id(id);
    setIsOpenGuestReservation(true);
  },[isOpenGuestReservation]);

  const closeModalGuest = useCallback(()=>{
    setGuest('');
    setReservation_id('');
    setIsOpenGuestReservation(false);
  },[isOpenGuestReservation]);

  //------------------add guest--------------------------------------//


  const openModalAvaliation = useCallback ((id:string)=>{
    setReservation_id(id);
    setIsOpenModalAvaliation(true);
  },[isOpenModalAvaliation]);

  const closeModalAvaliation = useCallback (()=>{
    setReservation_id('');
    setIsOpenModalAvaliation(false);
  },[isOpenModalAvaliation]);

  //------------------avaliation --------------------------------------//
  if (loading){
    return(
      <Loading/>
    )
  }

  return (
    <>
      <Head>
        <title>SalãoCondo - Reservas</title>
      </Head>
      
      <Header/>
      
      <div className={styles.bodyArea}>
        <main className={styles.container}>
          <h1>Reservas</h1>
          <div className={styles.alert}>
            <p>Para informações detalhadas sobre a reserva e o espaço do salão de festas, consulte o FAQ na guia{' '}
            <Link href="/settings"><b>Configurações</b></Link> do sistema.</p>
          </div>



              
              {myReservationsList.length > 0?(
                <section className={styles.section2}>
                  <h2>Minhas reservas</h2>
                  <div className={styles.allCards}>
                    {myReservationsList.map((item)=>{
                      return(
                        <article key={item.id} className={`${styles.card} ${item.reservationStatus? styles.cardTrue : styles.cardNull}`}>
                          <span>{formatDate(item.date)} - {formatHours(item.start)} às {formatHours(item.finish)}</span>
                          <div className={styles.buttons}>
                            <button onClick={()=>openModalDeleteReservation(item.id)}><AiOutlineClose /></button>
                            <button onClick={()=>openModalGuest(item.id, item.guest)}><AiOutlineUnorderedList /></button>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                </section>
              ):null}

              {allNoAvaliationList.length > 0?(
                <section className={styles.section3}>
                <h2>Aguardando finalização</h2>
                <div className={styles.allCards}>
                  {allNoAvaliationList.map((item)=>{
                    return(
                      <article key={item.id} className={styles.card}>
                        <span>{formatDate(item.date)} - {formatHours(item.start)} às {formatHours(item.finish)}</span>
                          <button onClick={()=>openModalAvaliation(item.id)}>Finalizar</button>
                      </article>
                    )
                  })}
                </div>
              </section>
              ):null}
          
        </main>
      </div>

      <WaitListModal
      isOpen={isOpenWait}
      onClose={closeModalWait}
      dateValue={dateValue}
      />
      {/* ------------------ modal wait list -------- */}

      <CreateReservationModal
      isOpen={isOpenCreateReservation}
      onClose={closeModalCreateReservation}
      dateValue={dateValue}
      />
      {/* ------------------ modal create reservation -------- */}
      

      <DeleteReservationModal
      isOpen={isOpenDeleteReservation}
      onClose={closeModalDeleteReservation}
      reservation_id={reservation_id}
      />
      {/* ------------------ modal delete resevation -------- */}

      <AddGuest
      isOpen={isOpenGuestReservation}
      onClose={closeModalGuest}
      guest={guest}
      id={reservation_id}
      />
      {/* ------------------ modal guest -------- */}
      
      <AvaliationModal
      isOpen={isOpenModalAvaliation}
      onClose={closeModalAvaliation}
      reservation_id={reservation_id}
      />
      {/*---------------Modal avaliation --------- */}
    </>

  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
      props: {
      }
  };
});