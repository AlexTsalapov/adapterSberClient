import React from 'react';
import style from './style.module.css'
import ExportButton from "./ExportButton";
import { DownloadTableExcel } from 'react-export-table-to-excel';



const Table = ({ columnsWithRows, exportToExcel}) => {
    if (Object.keys(columnsWithRows).length === 0) {
        return null; // Если объект пуст, не отображаем таблицу
    }


    const columns = Object.keys(columnsWithRows);
    const rows = Object.values(columnsWithRows);
    const maxRows = Math.max(...rows.map((column) => column.length));


    return (
        <div className={style.container}>
            <table className={style.table} id={"myTable"}>
                <thead>
                <tr>
                    {columns.map((column, index) => (
                        <th key={index}>{column}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {Array.from({ length: maxRows }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map((column, columnIndex) => (
                            <td key={columnIndex}>
                                {rows[columnIndex][rowIndex] || ""} {/* Используйте пустую строку, если значение не существует */}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
            <ExportButton exportToExcel={exportToExcel}/>
        </div>
    );
};

export default Table;