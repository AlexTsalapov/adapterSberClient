import React, {useState} from 'react';
import style from './style.module.css'
import Table from '../Table/Table';
import axios from 'axios';
import * as XLSX from 'xlsx'





function Button() {
    const [tableColumnsValue, setTableColumnsValue] = useState({});
    const [tableColumns, setTableColumns] = useState([]);
    const [tableList, setTableList] = useState({});
    const [field, setField] = useState([]);
    const [isFirstField, setIsFirstField] = useState(true);
    const [isOpenTable, setIsOpenTable] = useState(false);
    const [isOpenField, setIsOpenField] = useState(false);
    const [isChooseField, setIsChooseField] = useState(false);
    const [selectedItemTable, setSelectedItemTable] = useState('Выберите таблицу ↓');
    const [selectedItemField, setSelectedItemField] = useState('Выберите поле ↓');

    async function filterTable() {
        setTableColumns(tableColumns.filter((item, index) => {
            return tableColumns.indexOf(item) === index;
        }));
    }

   async function checkTableWithForeignKey() {
        const data = {
            table: selectedItemTable

        }
        axios.post('http://localhost:3001/tables/table/foreign_key', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                if (!isFirstField) {
                    setTableColumns(prevTableColumns => [...prevTableColumns, ...response.data.tables]);


                } else {
                    setTableColumns(response.data.tables)
                }

            })
            .catch((error) => {
                console.log(error);
            });
        await filterTable()
        setIsFirstField(false)
    }

    async function checkTable() {
       await filterTable()
        if (isFirstField) {
            axios.get('http://localhost:3001/tables')
                .then((response) => {

                    setTableColumns(response.data.tables);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        console.log(tableColumns)
    }

    function checkField() {
        if (selectedItemTable !== 'Выберите таблицу ↓') {
            const data = {
                table: selectedItemTable

            }
            axios.post('http://localhost:3001/tables/table', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {

                    setField(response.data.field);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }


    const toggleDropdownTable = () => {
        setIsOpenTable(!isOpenTable);
    };
    const toggleDropdownField = () => {
        setIsOpenField(!isOpenField);
    };
    const handleItemClickTable = (item) => {
        setSelectedItemTable(item);
        setIsOpenTable(false);
    };
    const handleItemClickField = (item) => {
        console.log(item)
        setSelectedItemField(item);

        setIsOpenField(false);
        setSelectedItemField(item);


    };
    const clickAdd = () => {
        if (selectedItemField !== 'Выберите поле ↓') {
            getValue(selectedItemTable, selectedItemField)
            setIsChooseField(true)

            checkTableWithForeignKey()
            console.log('tableList: ' + tableList)
        }
    };

    function getValueNewTable(tableNew, fieldNew) {

        const data = {
            tableNew: tableNew,
            fieldNew: fieldNew,
            tableAndFieldsOld: tableList

        }
        console.log(data)
        axios.post('http://localhost:3001/tables/table/field/new_table', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

            .then((response) => {

                console.log(response.data.rows)
                console.log(Object.keys(response.data.rows))
                console.log(Object.values(response.data.rows)[0])
                setTableColumnsValue({
                    [Object.keys(response.data.rows)[0]]: Object.values(response.data.rows)[0].split(',')
                })
                console.log(Object.keys(response.data.rows).length)
                for (let i = 1; i < Object.keys(response.data.rows).length; i++) {
                    setTableColumnsValue(prevTableColumnsValues => ({
                        ...prevTableColumnsValues,
                        [Object.keys(response.data.rows)[i]]: Object.values(response.data.rows)[i].split(',')

                    }));
                }
                console.log(tableColumnsValue)
                /*
                setTableColumnsValue(
                    [Object.keys(response.data.rows)[i]]: response.data.rows



                )*/
            })


            .catch((error) => {
                console.log(error);
            });
    }

    function getValue(table, field) {
        if (field !== 'Выберите поле ↓') {
            const data = {
                table: table,
                field: field

            }
            console.log('length: ' + Object.keys(tableList).length)
            if (Object.keys(tableList).length == 0 || Object.keys(tableList).includes(table)) {
                axios.post('http://localhost:3001/tables/table/field', data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then((response) => {

                        setTableColumnsValue(prevTableColumnsValues => ({
                            ...prevTableColumnsValues,
                            [selectedItemField]: response.data.rows

                        }));


                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                getValueNewTable(selectedItemTable, selectedItemField)
            }
            addNewTableAndField(table, field)

        } else {
            console.log(field)
        }

        function addNewTableAndField(table, field) {

            console.log('table' + table)
            console.log(tableList)
            if (Object.keys(tableList).length !== 0 && Object.keys(tableList).includes(table)) {
                tableList[table].push(field)
            } else {

                tableList[table] = [field]
            }
            console.log(tableList)
        }
    }
    function getCurrentData() {
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, "0");
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const year = String(currentDate.getFullYear()).slice(2);
        const hours = String(currentDate.getHours()).padStart(2, "0");
        const minutes = String(currentDate.getMinutes()).padStart(2, "0");
        return `${day}${month}${year}-${hours}${minutes}`;
    }
    function exportToExcel(tableData) {
        const worksheet = XLSX.utils.table_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'table_' + getCurrentData() + '.xlsx');
    }

    return (
        <div>
            <div className={style.button}>
                <div onClick={checkTable} className={style.dropdown}>
                    <button className={style.dropbtn} onClick={toggleDropdownTable}>
                        {selectedItemTable}
                    </button>
                    {isOpenTable && (
                        <div className={style.dropdownContentTable}>
                            {tableColumns.map((item) => (

                                <li className={style.choose} onClick={() => handleItemClickTable(item)}>{item}</li>
                            ))}
                        </div>
                    )}
                </div>
                <div onClick={checkField} className={style.dropdown}>
                    <button className={style.dropbtnField} onClick={toggleDropdownField}>
                        {selectedItemField}
                    </button>
                    {isOpenField && (
                        <div className={style.dropdownContentField}>
                            {field.map((item) => (
                                <li className={style.choose} onClick={() => handleItemClickField(item)}>{item}</li>

                            ))}
                        </div>


                    )}

                </div>
                <button className={style.add} onClick={() => clickAdd()}>✔</button>
            </div>
            {isChooseField &&  <Table columnsWithRows={tableColumnsValue} exportToExcel={exportToExcel}/>}
        </div>
    );
}

export default Button