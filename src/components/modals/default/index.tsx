import React, { ReactNode, useRef, useContext, useEffect } from 'react';
import styles from "./styles.module.scss";
import { ThemeContext } from '../../../contexts/ThemeContext';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
}

export default function Gmodal({ isOpen, onClose, children, className }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const { dark } = useContext(ThemeContext);

    const clickClose = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (e.target === overlayRef.current) {
            onClose();
        }
    };

    useEffect(() => {
        const escClose = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', escClose);
        }

        return () => {
            window.removeEventListener('keydown', escClose);
        };
    }, [isOpen, onClose]);

    return (
        <>
            {isOpen && (
                <div
                    className={styles.overlay}
                    onClick={clickClose}
                    ref={overlayRef}
                    style={{
                        backgroundColor: dark ? 'rgba(22,31,40,0.7)' : 'rgba(255,255,255,0.5)',
                    }}>
                    <div className={className}>
                        {children}
                    </div>
                </div>
            )}
        </>
    );
}
