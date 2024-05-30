import React, { ReactNode, useRef } from 'react';
import styles from "./styles.module.scss";
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    className?:string
}

export const Gmodal: React.FC<ModalProps> = ({ isOpen, onClose, children, className }) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLDivElement>(null);
    const {dark} = useContext (ThemeContext);

    if (!isOpen) {
        return null; 
    }

    function clickClose(e: React.MouseEvent<HTMLDivElement>): void {
        if (e.target === overlayRef.current) {
            onClose();
        }
    }

    function escClose (e:KeyboardEvent){
        if (e.key === 'Escape'){
            onClose();
        }
        return  window.removeEventListener('keydown', escClose);
    }

    window.addEventListener('keydown', escClose);

    return (
        <div
        className={styles.overlay}
        onClick={clickClose}
        ref={overlayRef}
        style={{
          backgroundColor: dark ? 'rgba(22,31,40,0.7)' : 'rgba(255,255,255,0.5)', // ou a cor que preferir
        }}>
        <div className={className} ref={mainRef}>
            {children}
        </div>
    </div>
    )
}
