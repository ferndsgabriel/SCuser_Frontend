
export function formatHours (number:number) {
    const inString = number.toString();

    if (number !== null){
        if (inString.length === 3 ){
            const hours = inString.substring(0,1);
            const minutes = inString.substring(1,3);
    
            return `0${hours}:${minutes}`; 
        }else{
            const hours = inString.substring(0,2);
            const minutes = inString.substring(2,4);
    
            return `${hours}:${minutes}`; 
        }
    }
}

export function formatDate (number) {
    if (number !== null){
        const inString = number.toString()
        const year = inString.substring(0,4);
        const month = inString.substring(4,6);
        const day = inString.substring(6,8);
    
        return `${day}/${month}/${year}`;
    }
}


export function onlyString(string:string){
    if (!/^[a-zA-Z]+$/.test(string)) {
        return false;
    }
    return true;
}
