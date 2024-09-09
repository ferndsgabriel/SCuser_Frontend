import React, { useEffect, useState, useRef, useContext, FormEvent, MouseEvent } from "react";
import styles from "./styles.module.scss";
import { FaChevronDown } from "react-icons/fa";
import { IoSend, IoChatbubbleEllipsesOutline, IoCheckmarkDoneSharp, IoCheckmarkSharp } from "react-icons/io5";
import { IoConnection } from "../../utils/ioConnection";
import { AuthContext } from "../../contexts/AuthContexts";
import DateConverter from "../../utils/dateConverter";
import Draggable from 'react-draggable';

interface MessageProps {
  content: string;
  conversation_id?: string;
  date?: Date;
  from: string;
  id?: string;
  to?: string;
  waiting?: boolean;
  delivered: boolean;
}

function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const io = IoConnection;
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [text, setText] = useState('');
  const { user } = useContext(AuthContext);
  const apartmentId = user?.apartment_id;
  const [alerts, setAlerts] = useState(0);
  const [dragging, setDragging] = useState(false);
  const bodyRef = useRef<HTMLUListElement>(null);
  const isOpenRef = useRef(isOpen);
  const [isDraggable, setIsDraggable] = useState(false);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    io.connect();

    io.emit('getId', { id: apartmentId });

    io.on('oldMessages', (data) => {
      if (data && data.messages) {
        setMessages(data.messages);
      }
    });

    io.on('newMessage', (data) => {
      if (isOpenRef.current) {
        io.emit('deliverMessageUser', { id: apartmentId });
      }
      setMessages((prev) => {
        const messageExists = prev.some((msg) =>
          msg.waiting && msg.date?.getTime() === new Date(data.date).getTime()
        );

        if (messageExists) {
          return prev.map((msg) =>
            msg.waiting && msg.date?.getTime() === new Date(data.date).getTime()
              ? { ...msg, ...data, waiting: false }
              : msg
          );
        } else {
          return [...prev, data];
        }
      });
    });

    io.on('messageDeliveredUser', (data) => {
      if (Array.isArray(data)) {
        setMessages((prev) =>
          prev.map((msg) =>
            data.some(deliveredMsg => deliveredMsg.id === msg.id) ? { ...msg, delivered: true } : msg
          )
        );
      } else {
        console.error('Error: unexpected data format for messageDeliveredUser event');
      }
    });

    return () => {
      io.off('oldMessages');
      io.off('newMessage');
      io.disconnect();
    };
  }, [apartmentId]);

  useEffect(() => {
    if (!isOpen) {
      io.emit('getId', { id: apartmentId });
      io.on('oldMessages', (data) => {
        if (data && data.messages) {
          const unreadMessages = data.messages.filter(msg => !msg.delivered && msg.from !== 'user');
          setAlerts(unreadMessages.length);
        }
      });
    } else {
      io.emit('deliverMessageUser', { id: apartmentId });
      setAlerts(0);
      if (bodyRef.current) {
        const element = bodyRef.current;
        element.scrollTop = element.scrollHeight;
      }
    }
  }, [messages, isOpen]);

  
  function sendMessage(e: FormEvent) {
    e.preventDefault();

    if (text && user) {
      const date = new Date();

      const pushList = {
        content: text,
        from: 'user',
        waiting: true,
        date: date,
        delivered: false
      };

      setMessages(prev => [...prev, pushList]);

      io.emit('sendMessageUser', { id: apartmentId, content: text, date: date });
      setText('');
    }
  }
  useEffect(() => {
    const handleResize = () => {
      setIsDraggable(window.matchMedia("(max-width: 768px)").matches);
    };

    handleResize(); 
    window.addEventListener("resize", handleResize); 

    return () => {
      window.removeEventListener("resize", handleResize); 
    };
  }, []);

  return (
    <>
      {isOpen ? (
        <>
          <article className={styles.container}>
            <header className={styles.header}>
              <div className={styles.userArea}>
                <img src="./IconMiniWhite.svg" alt="icon" className={styles.img} />
                <span>SalãoCondoADM</span>
              </div>
              <button onClick={() => setIsOpen(false)}>
                <FaChevronDown />
              </button>
            </header>

            <ul className={styles.body} ref={bodyRef}>
              {messages.length > 0 && messages.map((item, index) => (
                <li key={item.id || index} className={`${item.waiting ? ` ${styles.fromUser} ${styles.waiting}` : ''} ${item.from === 'user' ? styles.fromUser : styles.fromAdmin}`}>
                  <p className={styles.content}>{item.content}</p>

                  <div className={styles.dateAndMark}>
                    <p className={styles.date}>{DateConverter(item.date)}</p>
                    {item.from === 'user' && (
                      item.delivered ? (
                        <IoCheckmarkDoneSharp />
                      ) : (
                        <IoCheckmarkSharp />  
                      )
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <form className={styles.send} onSubmit={sendMessage}>
              <input
                placeholder="Digite sua mensagem aqui..."
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
              />

              <button type="submit" disabled={!text}>
                <IoSend />
              </button>
            </form>
          </article>
        </>
      ) : (
        <>
          <button className={styles.buttonOpen} onClick={() => setIsOpen(true)}>
            <IoChatbubbleEllipsesOutline />
            {alerts > 0 && (
              <div className={styles.alerts}>
                <span>{alerts}</span>
              </div>
            )}
          </button>
        </>
      )}
    </>
  );
}

export default React.memo(Chat);