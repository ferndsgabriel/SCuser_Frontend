import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

export default function CalendarComponent({ myReservationsList, allReservationsList, setDateValue }) {
    const [myReservationsDateTrue, setMyReservationsDateTrue] = useState([]);
    const [myReservationsDateNull, setMyReservationsDateNull] = useState([]);
    const [allReservationsDate, setAllReservationsDate] = useState([]);
    const [daysBefore, setDaysBefore] = useState([]);
    const monthNow = new Date().getMonth();
    const yearNow = new Date().getFullYear();
    const [monthCalendar, setMonthCalendar] = useState(monthNow);
    const [yearCalendar, setYearCalendar] = useState(yearNow);
    const [nextMonthBoolean, setNextMonthBoolean] = useState(false);
    const [calendar, setCalendar] = useState([]);

    const monthString = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril',
        'Maio', 'Junho', 'Julho', 'Agosto',
        'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    function formatInDate(date) {
        if (date !== null) {
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

    useEffect(() => {
        const formatByTrue = myReservationsList
            .filter((item) => item.reservationStatus === true)
            .map((item) => {
                return formatInDate(item.date);
            });

        setMyReservationsDateTrue(formatByTrue);

        const formatByNull = myReservationsList
            .filter((item) => item.reservationStatus === null)
            .map((item) => {
                return formatInDate(item.date);
            });

        setMyReservationsDateNull(formatByNull);

        const formatAll = allReservationsList.map((item) => {
            return formatInDate(item.date);
        });

        setAllReservationsDate(formatAll);

        const onDay = new Date();
        const lastDay = onDay.getDate();

        for (var x = 1; x <= lastDay; x++) {
            const days = new Date();
            days.setDate(x);

            setDaysBefore((prevDays) => [...prevDays, new Date(days)]);
        }
    }, [myReservationsList, allReservationsList]);

    useEffect(() => {
        const generateCalendar = () => {
            const date = new Date(yearCalendar, monthCalendar, 1);
            const calendarDays = [];
            let row = [];

            while (date.getMonth() === monthCalendar) {
                const day = date.getDate();
                const isReserved = myReservationsDateTrue.some(d => d.getDate() === day && d.getMonth() === monthCalendar);
                const isReservedNull = myReservationsDateNull.some(d => d.getDate() === day && d.getMonth() === monthCalendar);
                const otherReserved = allReservationsDate.some(d => d.getDate() === day && d.getMonth() === monthCalendar && !isReserved);

                row.push({
                    day,
                    isReserved,
                    isReservedNull,
                    otherReserved,
                    daysPast: date < new Date()
                });

                if (date.getDay() === 6) {
                    calendarDays.push(row);
                    row = [];
                }

                date.setDate(day + 1);
            }

            if (row.length > 0) {
                calendarDays.push(row);
            }

            setCalendar(calendarDays);
        };

        generateCalendar();
    }, [monthCalendar, yearCalendar, myReservationsDateTrue, myReservationsDateNull, allReservationsDate]);

    function changeMonth(number) {
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

    const addZero = (number) => {
        if (number < 10) {
            return `0${number}`;
        } else {
            return number;
        }
    }

    const functionGetDate = (cell) => {
        const dayZero = addZero(cell.day);
        const monthZero = addZero(monthCalendar + 1);
        const valueDate = `${yearCalendar}${monthZero}${dayZero}`;

        const date = parseInt(valueDate);

        if (cell && cell.otherReserved) {
            setDateValue ({
                isBusy: true,
                date: date
            });
        } else if (!cell.isReserved || cell.isReservedNull) {
            setDateValue ({
                isBusy: false,
                date: date
            });
        }
    }

    return (
        <section className={styles.section1}>
            <div className={styles.calendarArea}>
                <article className={styles.dateInfo}>
                    <button onClick={() => changeMonth(-1)} disabled={!nextMonthBoolean}><AiOutlineLeft /></button>
                    <p>{monthString[monthCalendar]} - {yearCalendar}</p>
                    <button onClick={() => changeMonth(+1)} disabled={nextMonthBoolean}><AiOutlineRight /></button>
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
                                                    color: cell.isReserved || cell.isReservedNull || cell.otherReserved ? 'white' : (cell.daysPast ? 'gray' : ''),
                                                    pointerEvents: cell.isReserved || cell.isReservedNull || cell.daysPast ? 'none' : 'auto',
                                                }}
                                                onClick={() => functionGetDate(cell)}
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
                    <p style={{ color: "#51AB7B", fontSize: '1.2rem' }}>Aprovada (minha)</p>
                    <p style={{ color: '#405971', fontSize: '1.2rem' }}>Em análise (minha)</p>
                    <p style={{ color: '#f14a4a', fontSize: '1.2rem' }}>Ocupada (outro)</p>
                </article>
            </div>
        </section>
    )
}
