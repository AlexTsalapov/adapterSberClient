import React from "react";
import style from "./ExportButton.module.css"
const ExportButton = ({exportToExcel}) => {
    return (
        <div >
            <button className={style.button} onClick={() => exportToExcel(document.getElementById('myTable'), 'table')}>
                Сохранить в xlsx
            </button>
        </div>
    )
}

export default ExportButton;