import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import styles from "./styles.module.scss";
import {IoEyeSharp} from "react-icons/io5";
import {BsEyeSlashFill} from "react-icons/bs";
import {useState} from "react";
import InputMask from 'react-input-mask';



interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  mask?: string;
}

export const Input = ({ type, mask, ...rest }: InputProps) => {
  const [inputType, setInputType] = useState(type);
  const [inputIcon, setInputIcon] = useState(<BsEyeSlashFill />);

  function handleInputType() {
    setInputType('text');
    setInputIcon(<IoEyeSharp />);
    if (inputType === 'text') {
      setInputType(type);
      setInputIcon(<BsEyeSlashFill />);
    }
  }

  return (
    <label className={styles.inputContainer}>
      <InputMask
        className={styles.input}
        type={inputType}
        mask={mask}
        {...rest}
        tabIndex={1}
      />

      {type === 'password' ? (
        <button onClick={handleInputType} type="button" className={styles.buttonEyes}
        style={{userSelect:'none'}}>
          {inputIcon}
        </button>
      ) : (
        null
      )}
    </label>
  );
}