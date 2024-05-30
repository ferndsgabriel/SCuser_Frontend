import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import { Loading } from "../../components/loading";
import { canSSRAuth } from "../../utils/canSSRAuth";
import { SetupApiClient } from "../../services/api";
import styles from "./styles.module.scss";
import { AiOutlineLeft, AiOutlineRight, AiOutlineClose, AiOutlineUnorderedList } from "react-icons/ai";
import { toast } from "react-toastify";
import {formatDate, formatHours} from "../../utils/formatted";
import { AddGuest } from "../../components/modal/Addguest";
import { Gmodal } from "../../components/myModal";
import Link from "next/link"

type MyReservationsProps = {
  date: number;
  start: number;
  finish: number;
  cleaningService: boolean;
  guest: null | string;
  reservationStatus: boolean;
  id:string
};

type AllReservationsProps = {
  id: string;
  date: number;
  start: number;
  finish: number;
};

interface CalendarProps {
  myReservations: MyReservationsProps[];
  allReservations: AllReservationsProps[];
}

export default function Reservation({ myReservations, allReservations }: CalendarProps) {
  const [myReservationsList, setMyReservationsList] = useState(myReservations || null);
  const [allReservationsList, setAllReservationsList] = useState(allReservations || null);
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

  const [dateValue, setDateValue] = useState<number>(null);
  const [hoursStart, setHoursStart] = useState<number>(9);
  const [minutesStart, setMinutesStart] = useState<number>(0);
  const [hoursFinish, setHoursFinish] = useState<number>(10);
  const [minutesFinish, setMinutesFinish] = useState<number>(0);
  const [inputClean, setInputClean] = useState (false);


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
  async function refreshDate(){
    try{
        const setupApi = SetupApiClient();
        const response = await setupApi.get('/myreservations');
        const response2 = await setupApi.get('/allreservations');
        setMyReservationsList(response.data);
        setAllReservationsList(response2.data);
        setLoading(false);
    }catch(err){
        setTimeout(refreshDate, 500);
    }
  }
  useEffect(()=>{
    refreshDate();
  },[]);

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

  function openModalReservation(cell){
    const dayZero = addZero(cell.day);
    const monthZero = addZero(monthCalendar + 1);
    const valueDate = `${yearCalendar}${monthZero }${dayZero }`;
    setDateValue(parseInt(valueDate));
    if (cell && cell.otherReserved) {
      setIsOpenWait(true);
    }else if (!cell.isReserved || cell.isReservedNull){
      setIsOpenCreateReservation(true);
    }
  }

  function closeModalWait(){
    setDateValue(null);
    setIsOpenWait(false);
  }

  function closeModalCreateReservation(){
    setDateValue(null);
    setHoursStart(9);
    setMinutesStart(0);
    setHoursFinish(10);
    setMinutesFinish(0);
    setInputClean(false);
    setIsOpenCreateReservation(false);
  }

  async function handleAwait(){
    if (dateValue === null){
      toast.warning('Data inválida.');
    }
    try{
      await setupApi.post('/list',{
          date:dateValue
      });
      toast.success('Adicionado a lista de espera com sucesso.');
      refreshDate();
    }catch(error){
      toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
    }finally{
      closeModalWait();
    }
  }

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

  function changeSelectStartHours(e){
    const hours = e.target.value;
    setHoursStart(parseInt(hours));
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

  function changeSelectStarMinutes(e){
    const minutes = e.target.value;
    setMinutesStart(parseInt(minutes));
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

  function changeSelectFinishHours(e){
    const hours = e.target.value;
    setHoursFinish(parseInt(hours));
  };
  
  function changeSelectFinishMinutes(e){
    const minutes = e.target.value;
    setMinutesFinish(parseInt(minutes));
  };

  async function handleCreateReservation(){
    const start = `${addZero(hoursStart)}${addZero(minutesStart)}`;
    const finish = `${addZero(hoursFinish)}${addZero(minutesFinish)}`;
    if (parseInt(finish) <= parseInt(start)){
      toast.warning('O horário de início da reserva não pode ser posterior ou igual ao término.');
      return
    }
    try{
      await setupApi.post('/reservations',{
        date:dateValue,
        cleaning:inputClean,
        start:start,
        finish: finish
      });
      toast.success('Reserva solicitada com sucesso.');
      closeModalCreateReservation();
      refreshDate();
    }catch(error){
      toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
    }
  }
  
  //--------------------------Delete reservation -----------------------------------

  function openModalDeleteReservation(id:string){
    setReservation_id(id);
    setIsOpenDeleteReservation(true);
  }
  function closeModalDeleteReservation(){
    setReservation_id('');
    setIsOpenDeleteReservation(false);
  }

  async function handleDeleteReservation(){
    if (reservation_id === ''){
      toast.warning('Reserva não encontrada.');
      return;
    }
    try{
      await setupApi.delete('/reservations',{
        data:{
          reservation_id:reservation_id
        }
      });
      toast.success('Reserva cancelada com sucesso.');
      closeModalDeleteReservation();
      refreshDate();
    }catch(error){
      toast.warning(error.response && error.response.data.error || 'Erro desconhecido');
    }
  }

  //-----------------------------------------------//-----------------------------------------

  function openModalGuest(id:string, guest:string){
    setGuest(guest);
    setReservation_id(id);
    setIsOpenGuestReservation(true);
  }

  function closeModalGuest(){
    setGuest('');
    setReservation_id('');
    refreshDate();
    setIsOpenGuestReservation(false);
  }
  //-----------------------------------------------//-----------------------------------------//

  function hourGoogleCalendar(hour:string){
    if (hour.length === 3){
      const gotHour = hour.substring(0,1);
      const gotMinutes = hour.substring(1,3);
      return `${gotHour}:${gotMinutes}:00`
    }
    else{
      const gotHour = hour.substring(0,2);
      const gotMinutes = hour.substring(2,4);
      return `${gotHour}:${gotMinutes}:00`
    }
  }


  //-----------------------------------------------//-----------------------------------------//

  if (loading){
    return(
      <Loading/>
    )
  }

  return (
    <>
      {isOpenGuestReservation?(
        null
      ):<Header/>}
      
      <main className={styles.container}>
        <h1>Reservas</h1>
        <div className={styles.alert}>
          <p>Para informações detalhadas sobre a reserva e o espaço do salão de festas, consulte o FAQ na guia{' '}
          <Link href="/settings"><b>Configurações</b></Link> do sistema.</p>
        </div>

        <div className={styles.allSections}>
          <section className={styles.section1}>
            <article className={styles.dateInfo}>
                    <button onClick={() => changeMonth(-1)}disabled={!nextMonthBoolean}><AiOutlineLeft/></button>
                    <p>{monthString[monthCalendar]} - {yearCalendar}</p>
                    <button onClick={() => changeMonth(+1)} disabled={nextMonthBoolean}><AiOutlineRight/></button>
            </article>
              <table className={styles.calendarArea}>
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
        </div>
      </main>
      {/* ------------------ modal wait list -------- */}
      <Gmodal isOpen={isOpenWait}
      onClose={closeModalWait}
      className='modal'>
            <div className="modalContainer">
              <div className="beforeButtons">
                  <h3>Lista de espera</h3>
                  <p>Você gostaria de se inscrever na lista de espera? Em caso de cancelamento da reserva, você será notificado por meio de SMS e e-mail.</p>

              </div>
              <div className='buttonsModal'>
                  <button className='buttonSlide' onClick={handleAwait} autoFocus={true}>Entrar</button>
                  <button onClick={closeModalWait} className='buttonSlide'>Cancelar</button>      
              </div>
            </div>
      </Gmodal>
    {/* ------------------ modal create reservation -------- */}
      <Gmodal isOpen={isOpenCreateReservation}
      onClose={closeModalCreateReservation}
      className='modal'>
          <div className="modalContainer">
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
                <button className='buttonSlide' onClick={handleCreateReservation}>Reservar</button>
                <button onClick={closeModalCreateReservation} className='buttonSlide'>Cancelar</button>      
            </div>
          </div>
      </Gmodal>

      {/* ------------------ modal delete resevation -------- */}
      <Gmodal isOpen={isOpenDeleteReservation}
      onClose={closeModalDeleteReservation}
      className='modal'>
          <div className="modalContainer">
            <div className="beforeButtons">
                <h3>Cancelar reserva</h3>
                <p><b>Observação: </b>Cancelamentos de reservas aprovadas com menos de 2 dias de
              antecedência da data do evento estão sujeitos a uma taxa de R$ 100,00.
              Deseja confirmar o cancelamento? </p>
            </div>
            <div className='buttonsModal'>
                <button className='buttonSlide' onClick={handleDeleteReservation} autoFocus={true}>Confirmar</button>
                <button onClick={closeModalDeleteReservation} className='buttonSlide'>Não</button>      
            </div>
          </div>
      </Gmodal>

      {/* ------------------ modal guest -------- */}
      <Gmodal isOpen={isOpenGuestReservation}
      onClose={closeModalGuest}
      className={styles.modalGuest}>
            <AddGuest id={reservation_id} guest={guest} closeModal={closeModalGuest}/>
      </Gmodal>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  try {
    const SetupApi = SetupApiClient(ctx);
    const response1 = await SetupApi.get("/myreservations");
    const response2 = await SetupApi.get("/allreservations");
      return {
          props: {
            myReservations: response1.data,
            allReservations: response2.data
          }
      };
  } 
  catch (error) {
  console.error('Erro ao obter dados da api');
      return {
          props: {
            myReservations: [],
            allReservations: []
          },
      };
  }   
});