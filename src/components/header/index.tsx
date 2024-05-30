import Link from "next/link"
import styles from "./styles.module.scss"
import {AiOutlineClose, AiOutlineSchedule, AiOutlineMenu } from "react-icons/ai";
import { IoHomeOutline, IoSunny, IoMoon } from "react-icons/io5";
import {FiSettings} from "react-icons/fi";
import { useState, useEffect, useRef, useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { useRouter} from 'next/router';

export default function Header(){
    const routerActual = useRouter().pathname;
    const [openNav, setOpenNav] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);
    const {dark, changeThemes} = useContext (ThemeContext);

    useEffect(()=>{
        function closeNavWithEsc(e:KeyboardEvent){
            if (openNav){
                if (e.key === 'Escape'){
                    setOpenNav(false);
                }   
            }else{
                return;
            }
        }
        document.addEventListener('keydown', closeNavWithEsc);

        return ()=> document.removeEventListener('keydown', closeNavWithEsc);
    },[openNav]);

    return (
        <>
        {openNav?(
            <span className={styles.bgNav} onClick={()=>setOpenNav(false)}/>
        ):null}
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href={'/reservation'}>
                    <img src="./iconDark.svg" alt={'Logo Svg'}/>
                </Link>

                {openNav?(
                    <button onClick={()=>setOpenNav(false)} className={styles.buttonMenu}>
                        <AiOutlineClose/>
                    </button>
                ):(
                    <button onClick={()=>setOpenNav(true)} className={styles.buttonMenu}>
                        <AiOutlineMenu/>
                    </button>
                )}
                
                <nav style={openNav?{display:'block'}:{display:''}} ref={navRef}>
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
                            <Link href={'/reservation'}
                            className={routerActual === '/reservation'?styles.activeNav:''}>
                                <span>Reservas</span>
                                <AiOutlineSchedule/>        
                            </Link>
                        </li>  

                        <li className={styles.li}>
                            <Link href={'/perfil'}
                            className={routerActual === '/perfil'?styles.activeNav:''}>
                                <span>Perfil</span>
                                <IoHomeOutline />

                            </Link>
                        </li>

                        <li className={styles.li}>
                            <Link href={'/settings'}
                            className={routerActual === '/settings'?styles.activeNav:''}>
                                <span>Configurações</span>
                                <FiSettings/>
                            </Link>
                        </li>  
                    </ul>
                </nav>
            </div>
        </header>
        <div className={styles.breakline}>
        </div> 
            
        </>
    )
}