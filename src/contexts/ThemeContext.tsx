import { promises } from "dns";
import React, { createContext, useEffect, useState } from "react";

type ThemeContextType = {
    changeThemes: (darkMode: boolean) => void;
    dark: boolean;
}

const ThemeContext = createContext({} as ThemeContextType);

export default function ThemeProvider({ children }) {
    const [dark, setDark] = useState(true);

    const changeThemes = (boolean:boolean) => {
        setDark(boolean);
        const localStorageTheme = JSON.stringify(boolean);
        localStorage.setItem('salaoCondoTheme', localStorageTheme);
    }

    useEffect(() => {
        const theme = localStorage.getItem('salaoCondoTheme');
        if (theme) {
            setDark(JSON.parse(theme));
        }
    }, []);
    

    useEffect(() => {
        const root = document.documentElement.style;
        root.setProperty('--White', '#ffff');
        root.setProperty('--Black', '#000');
        root.setProperty('--Background', !dark ? '#fff' : '#161F28');
        root.setProperty('--Text', !dark ? '#000' : '#fff');
        root.setProperty('--Placeholder','#ebeaea');
        root.setProperty('--Transparente', !dark ? 'rgba(180, 179, 185, 0.4)' : 'rgba(0, 0, 0, 0.2)');
        root.setProperty('--Transparente2','rgba(0, 0, 0, 0.2)');
        root.setProperty('--ButtonHover', !dark ? '#161F28' : 'rgba(0, 0, 0, 0.2)');
        root.setProperty('--Light', !dark? '#585858':'#9e9e9e');
        root.setProperty('--ButtonColor', !dark? '#161F28':'#ffff');
        root.setProperty('--ButtonText', !dark? '#ffff':'#161F28');
        root.setProperty('--Primary-normal', '#526F84');
        root.setProperty('--Sucess', '#6D9E80');
        root.setProperty('--Error','#B25C5C');
        root.setProperty('--Primary-dark','#161F28');

    }, [dark]);

    return (
        <ThemeContext.Provider value={{ changeThemes, dark }}>
            {children}
        </ThemeContext.Provider>
    )
}

export { ThemeContext };
