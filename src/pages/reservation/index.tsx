import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "../../components/header";
import { Loading } from "../../components/loading";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { SetupApiClient } from "../../services/api";
import styles from "./styles.module.scss";
import { AiOutlineLeft, AiOutlineRight, AiOutlineClose, AiOutlineUnorderedList } from "react-icons/ai";
import {formatDate, formatHours} from "../../utils/formatted";
import Link from "next/link"
import CreateReservationModal from "../../components/modals/modalsReservation/createReservation";
import DeleteReservationModal from "../../components/modals/modalsReservation/deleteReservation";
import WaitListModal from "../../components/modals/modalsReservation/waitList";
import AvaliationModal from "../../components/modals/modalsReservation/modalAvaliation";
import AddGuest from "../../components/modals/modalsReservation/addGuest";

type MyReservationsProps = {
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
  myReservations: MyReservationsProps[];
  allReservations: MyReservationsProps[];
  allNoAvaliations:MyReservationsProps[];
}

export default function Reservation({ myReservations, allReservations, allNoAvaliations }: CalendarProps) {
  const [myReservationsList, setMyReservationsList] = useState(myReservations || null);
  const [allReservationsList, setAllReservationsList] = useState(allReservations || null);
  const [allNoAvaliationList, setAllNoAvaliationList] = useState(allNoAvaliations || null);
  const [loading, setLoading] = useState(true);
  const setupApi = SetupApiClient();
  const [calendar, setCalendar] = useState([]);
  const monthNow = new Date().getMonth();
  const yearNow = new Date().getFullYear();
  const [monthCalendar, setMonthCalendar] = useState(monthNow);
  const [yearCalendar, setYearCalendar] = useState(yearNow);
  const [nextMonthBoolean, setNextMonthBoolean] = useState (false);
  const [isOpenWait, setIsOpenWait ] = useState (false);
  const [isOpenCreateReservation, setIsOpenCreateReservation] = useState(false);
  const [reservation_id, setReservation_id] = useState('');
  const [isOpenDeleteReservation, setIsOpenDeleteReservation] = useState(false);
  const [isOpenGuestReservation, setIsOpenGuestReservation] = useState(false);
  const [guest, setGuest] = useState('');
  const [isOpenModalAvaliation, setIsOpenModalAvaliation] = useState(false);


  const [dateValue, setDateValue] = useState<number>(null);



  const monthString = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril',
    'Maio', 'Junho', 'Julho', 'Agosto',
    'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const [myReservationsDateTrue, setMyReservationsDateTrue] = useState([]);
  const [myReservationsDateNull, setMyReservationsDateNull] = useState([]);
  const [allReservationsDate, setAllReservationsDate] = useState([]);
  const [daysBefore, setDaysBefore] = useState ([]);


  // --------------------------------------------------------/////////

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

  // -----------------------Passar para o formato data minhas datas number --------------------------/////////

  useEffect(() => {
    const formatByTrue = myReservationsList.filter((item) => item.reservationStatus === true)
      .map((item) => {
        return formatInDate(item.date);
      });
    setMyReservationsDateTrue(formatByTrue);

    const formatByNull = myReservationsList.filter((item) => item.reservationStatus === null)
      .map((item) => {
        return formatInDate(item.date);
      });
    setMyReservationsDateNull(formatByNull);

    const formatAll = allReservationsList.map((item)=>{
      return formatInDate(item.date);
    });
    setAllReservationsDate(formatAll);

    const onDay = new Date();
    const lastDay = onDay.getDate();
    
    for (var x = 1; x <= lastDay; x++) {
      const days = new Date();
      days.setDate(x);
    
      setDaysBefore(prevDays => [...prevDays, new Date(days)]);
    }
    

  }, [myReservationsList, allReservationsList]);

// -------------------- Função converte em data real -----------------------/////////

  function formatInDate(date: number) {
    if (date !== null){
      const dateString = date.toString();
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      const monthInt = parseInt(month);
      const inDate = new Date();
      inDate.setDate(parseInt(day));
      inDate.setFullYear(parseInt(year));
      inDate.setMonth(monthInt - 1);
  
      return inDate;
    }
  }

// -------------------- Alterar o mês  -----------------------/////////
  function changeMonth(number: number) {
    setNextMonthBoolean(!nextMonthBoolean);
    const newMonth = monthCalendar + number;
    if (newMonth > 11) {
      setMonthCalendar(0);
      setYearCalendar(yearCalendar + 1);
    } else {
      setMonthCalendar(newMonth);
    }
    if (newMonth < 0) {
      setMonthCalendar(11);
      setYearCalendar(yearCalendar - 1);
    }
  }

// -------------------- Renderizar calendario -----------------------/////////
useEffect(() => {
    const currentDate = new Date();
    currentDate.setMonth(monthCalendar);
    currentDate.setFullYear(yearCalendar);

    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();

    const newCalendar = [];
    let dayOfMonth = 1;

    for (let i = 0; i < 6; i++) {
      const row = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayOfWeek) {
          row.push(null);
        } else if (dayOfMonth <= daysInMonth) {

          const isReserved = myReservationsDateTrue.some(
            (reservation) =>
              new Date(reservation).getDate() === dayOfMonth &&
              new Date(reservation).getMonth() === monthCalendar &&
              new Date(reservation).getFullYear() === yearCalendar
          );
          const isReservedNull = myReservationsDateNull.some(
            (reservation) =>
              new Date(reservation).getDate() === dayOfMonth &&
              new Date(reservation).getMonth() === monthCalendar &&
              new Date(reservation).getFullYear() === yearCalendar
          );

          const otherReserved = allReservationsDate.some(
            (reservation) =>
              new Date(reservation).getDate() === dayOfMonth &&
              new Date(reservation).getMonth() === monthCalendar &&
              new Date(reservation).getFullYear() === yearCalendar
          );

          const daysPast = daysBefore.some(
            (reservation) =>
              new Date(reservation).getDate() === dayOfMonth &&
              new Date(reservation).getMonth() === monthCalendar &&
              new Date(reservation).getFullYear() === yearCalendar
          );

          row.push({ day: dayOfMonth, isReserved: isReserved, isReservedNull, otherReserved, daysPast });
          dayOfMonth++;
        } else {
          row.push(null);
        }
      }
      newCalendar.push(row);
    

    setCalendar(newCalendar);
  }
}, [monthCalendar, myReservationsDateTrue, myReservationsDateNull, yearCalendar]);


  //---------------------- wait list and reservation ------------
  const addZero = (number:number) =>{
    if (number < 10){
      return `0${number}`;
    }else{
      return number;
    }
  }

  function closeModalWait(){
    setDateValue(null);
    setIsOpenWait(false);
  }

  const openModalReservation = useCallback ((cell)=>{
    const dayZero = addZero(cell.day);
    const monthZero = addZero(monthCalendar + 1);
    const valueDate = `${yearCalendar}${monthZero }${dayZero }`;
    setDateValue(parseInt(valueDate));
    if (cell && cell.otherReserved) {
      setIsOpenWait(true);
    }else if (!cell.isReserved || cell.isReservedNull){
      setIsOpenCreateReservation(true);
    }
  },[isOpenCreateReservation]);

  const closeModalCreateReservation = useCallback (()=>{
    setDateValue(null);
    setIsOpenCreateReservation(false);
  },[isOpenCreateReservation]);

  //--------------------------Delete reservation -----------------------------------
  const openModalDeleteReservation = useCallback((id:string)=>{
    setReservation_id(id);
    setIsOpenDeleteReservation(true);
  },[isOpenDeleteReservation]);

  const closeModalDeleteReservation = useCallback(()=>{
    setReservation_id('');
    setIsOpenDeleteReservation(false);
  },[isOpenDeleteReservation]);


  //-----------------------------------------------//-----------------------------------------

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

  //-----------------------------------------------//-----------------------------------------//


  const openModalAvaliation = useCallback ((id:string)=>{
    setReservation_id(id);
    setIsOpenModalAvaliation(true);
  },[isOpenModalAvaliation]);

  const closeModalAvaliation = useCallback (()=>{
    setReservation_id('');
    setIsOpenModalAvaliation(false);
  },[isOpenModalAvaliation]);




  if (loading){
    return(
      <Loading/>
    )
  }

  return (
    <>
    <Header/>
      
      <div className={styles.bodyArea}>
        <main className={styles.container}>
          <h1>Reservas</h1>
          <div className={styles.alert}>
            <p>Para informações detalhadas sobre a reserva e o espaço do salão de festas, consulte o FAQ na guia{' '}
            <Link href="/settings"><b>Configurações</b></Link> do sistema.</p>
          </div>

            <section className={styles.section1}>
              <div className={styles.calendarArea}>
                <article className={styles.dateInfo}>
                        <button onClick={() => changeMonth(-1)}disabled={!nextMonthBoolean}><AiOutlineLeft/></button>
                        <p>{monthString[monthCalendar]} - {yearCalendar}</p>
                        <button onClick={() => changeMonth(+1)} disabled={nextMonthBoolean}><AiOutlineRight/></button>
                </article>
                <table className={styles.calendar}>
                  <thead>
                    <tr>
                      <th>Dom</th>
                      <th>Seg</th>
                      <th>Ter</th>
                      <th>Qua</th>
                      <th>Qui</th>
                      <th>Sex</th>
                      <th>Sáb</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calendar.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={`${rowIndex}-${cellIndex}`}>
                            {cell ? (
                              <button
                                style={{
                                  backgroundColor: cell.isReserved ? '#51AB7B' : (cell.isReservedNull ? '#405971' : (cell.otherReserved ? '#f14a4a' : '')),
                                  color: cell.isReserved ? 'white' : (cell.isReservedNull ? 'white' : (cell.otherReserved ? 'white' : (cell.daysPast ? 'gray' : ''))),
                                  pointerEvents: cell.isReserved || cell.isReservedNull || cell.daysPast ? 'none' : 'auto',
                                }}
                                onClick={() => openModalReservation(cell)}
                                disabled={cell.isReserved || cell.isReservedNull}
                              >
                                {cell.day}
                              </button>
                            ) : null}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <article className={styles.legends}>
                  <p style={{color:"#51AB7B", fontSize:'1.2rem'}}>Aprovada (minha)</p>
                  <p style={{color:'#405971', fontSize:'1.2rem'}}>Em análise (minha)</p>
                  <p style={{color:'#f14a4a', fontSize:'1.2rem'}}>Ocupada (outro)</p>
                </article>
                </div>
            </section>
              
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
                  {allNoAvaliations.map((item)=>{
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
  try {
    const SetupApi = SetupApiClient(ctx);
    const response1 = await SetupApi.get("/myreservations");
    const response2 = await SetupApi.get("/allreservations");
    const response3 = await SetupApi.get("/noavaliation");
      return {
          props: {
            myReservations: response1.data,
            allReservations: response2.data,
            allNoAvaliations: response3.data
          }
      };
  } 
  catch (error) {
  console.error('Erro ao obter dados da api');
      return {
          props: {
            myReservations: [],
            allReservations: [],
            allNoAvaliations:[]
          },
      };
  }   
});