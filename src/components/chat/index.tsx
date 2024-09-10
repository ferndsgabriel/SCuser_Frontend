import React, { useEffect, useState, useRef, useContext, FormEvent, MouseEvent } from "react";
import styles from "./styles.module.scss";
import { FaChevronDown } from "react-icons/fa";
import { IoSend, IoChatbubbleEllipsesOutline, IoCheckmarkDoneSharp, IoCheckmarkSharp } from "react-icons/io5";
import { IoConnection } from "../../utils/ioConnection";
import { AuthContext } from "../../contexts/AuthContexts";
import DateConverter from "../../utils/dateConverter";

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
  const bodyRef = useRef<HTMLUListElement>(null);
  const isOpenRef = useRef(isOpen);


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
      const messageFor = (data.conversation.apartment_id);

      if (messageFor === apartmentId) {
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
            if (Notification.permission === 'granted') {      
              new Notification("Mensagem de administrador:", {
                body:data.content,
                icon: './Icon.svg'
              });
            }
            return [...prev, data];
          }
        });
      } 
    });

    io.on('messageDeliveredUser', (data) => {
      if (Array.isArray(data)) {
        setMessages((prev) =>
          prev.map((msg) =>
            data.some(deliveredMsg => deliveredMsg.id === msg.id) ? { ...msg, delivered: true } : msg
          )
        );
      } else {
        console.error('error');
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
    const requestNotificationPermission = async () => {
      if (Notification.permission === 'default') {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            console.log('Permissão de notificação concedida.');
          }
        } catch (error) {
          console.error('Erro ao solicitar permissão de notificação:', error);
        }
      }
    };
  
    requestNotificationPermission();
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
          <button className={styles.buttonOpen} onClick={() => setIsOpen(true)}>
            <IoChatbubbleEllipsesOutline />
            {alerts > 0 && (
              <div className={styles.alerts}>
                <span>{alerts}</span>
              </div>
            )}
          </button>
      )}
    </>
  );
}

export default React.memo(Chat);