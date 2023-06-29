import React from "react";
import style from './style.module.css'
import Button from './Button/Button'

const Main = () => {


    return (

        <div>
            <div className={style.agregator}>Агрегатор</div>
            <div className={style.text}>
                <div className={style.textTable}>Выберите таблицу</div>
                <div className={style.textField}>Выберите поле</div>
            </div>
            <Button/>


        </div>


    )
}

export default Main