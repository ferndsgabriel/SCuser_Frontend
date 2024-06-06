import styles from "./styles.module.scss";
import { IoHomeOutline, IoSunny, IoMoon } from "react-icons/io5";
import {AiOutlineClose, AiOutlineSchedule, AiOutlineMenu, } from "react-icons/ai";
import { BsPeopleFill } from "react-icons/bs";
import {FiSettings, FiLogOut } from "react-icons/fi";
import { MdApartment } from "react-icons/md";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { AuthContext } from "../../contexts/AuthContexts";


export default function Header (){
    const [isOpenNav, setIsOpenNav] = useState (false);
    const blackAreaRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLDivElement>(null);
    const routerActual = useRouter().pathname;
    const {changeThemes, dark} = useContext(ThemeContext);
    const {singOut} = useContext(AuthContext);

    function handleOpenNav(){
        setIsOpenNav(true);
        blackAreaRef.current?.classList.add(styles.blackAreaGet);
        navRef.current?.classList.add(styles.openNavBar);
    }

    function handleCloseNav(){
        setIsOpenNav(false);
        blackAreaRef.current?.classList.remove(styles.blackAreaGet);
        navRef.current?.classList.remove(styles.openNavBar);
    }

    return(
        <>
            <span className={styles.blackArea} ref={blackAreaRef} onClick={handleCloseNav}></span>

            <header className={styles.headerArea}>
                <Link href={'/reservation'}>
                    <img src="./iconDark.svg" alt="icon"/>
                </Link>
            
                {isOpenNav?(
                    <button onClick={handleCloseNav}><AiOutlineClose/></button>
                ):(
                    <button onClick={handleOpenNav}><AiOutlineMenu/></button>
                )}  
            </header>

            <nav className={styles.navBar} ref={navRef}>
                <div className={styles.imgAndButton}>
                    <Link href={'/reservation'}>
                        <img src="./iconDark.svg" alt="icon"/>
                    </Link>
                    <button onClick={handleCloseNav}><AiOutlineClose/></button>
                </div>
                
                <ul>
                    <li className={styles.liTheme}>   
                        <label className={`${styles.labelTheme} ${dark? styles.labelDark : styles.labelLight}`}>
                            {!dark ?(
                                <IoSunny className={styles.svgSun}/>
                            ):(
                                <IoMoon className={styles.svgMoon}/>
                            )}
                            <input type='checkbox' checked={dark} onChange={(e)=>changeThemes(e.target.checked)}/>
                        </label>
                    </li>

                    <li className={styles.li}>
                        <Link href={'/perfil'}
                        className={routerActual === '/perfil'?styles.activeNav:''}>
                            <IoHomeOutline />
                            Perfil
                        </Link>
                    </li>

                    <li className={styles.li}>
                            <Link href={'/reservation'}
                            className={routerActual === '/reservation'?styles.activeNav:''}>
                                <AiOutlineSchedule/>
                                Reservas     
                            </Link>
                        </li>  


                        <li className={styles.li}>
                            <Link href={'/settings'}
                            className={routerActual === '/settings'?styles.activeNav:''}>
                                <FiSettings/>       
                                Configurações                  
                            </Link>
                        </li>  
                </ul>

                <button className={styles.logout} onClick={singOut}>Sair<FiLogOut /></button>
            </nav>

            <span className={styles.breakArea}></span>
        </>
    )
}