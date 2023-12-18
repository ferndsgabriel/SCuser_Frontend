import style from "./styles.module.scss"
import {FaSpinner} from 'react-icons/fa'

export function Loading(){
    return(
            <>
                <div className={style.container}>
                    <div className={style.conteudo}>
                        <FaSpinner/>
                    </div>    
                </div>
            </>
    )
}