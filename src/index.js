/**
  * Генерируем таблицу из JSON файла
  * 
  * @param {Array} jsonData - первое число
  * @param {string} elementIdForTable - второе число
  * @returns {void}
  */
function generateTable(jsonData, elementIdForTable) {
    //Создаем таблицу
    let tableElement = document.createElement("table");

    //Создаем заголовки таблицы
    let headerCellNames = "";
    let headerCellNamesArray = Object.keys(jsonData[0]);
    for (let k = 0; k < headerCellNamesArray.length; k++) {
        headerCellNames += `<th><div class="th-container">${headerCellNamesArray[k]} <p class="sort-pointer">&#9650</p></div></th>`;
    }
    tableElement.innerHTML += `<tr>${headerCellNames}</tr>`;

    //Добавляем остальные строки с данными
    for (let i = 0; i < jsonData.length; i++) {
        let row = tableElement.insertRow(-1);
        for (let l = 0; l < headerCellNamesArray.length; l++) {
            let cell = row.insertCell(-1);
            cell.innerHTML = jsonData[i][headerCellNamesArray[l]];
        }
    }

    //Получаем div в который будет вложена таблица и поиск
    let mainDivContainer = document.getElementById(elementIdForTable);

    //Создаем div для поиска
    let searchDivContainer = document.createElement("div");
    searchDivContainer.classList.add("main-container");
    mainDivContainer.appendChild(searchDivContainer);

    //Создаем div для таблицы
    let tableDivContainer = document.createElement("div");
    tableDivContainer.classList.add("table-container");
    tableDivContainer.id = "tableElement";
    mainDivContainer.appendChild(tableDivContainer);

    //Добавляем ввод
    let inputElement = document.createElement("input");
    inputElement.addEventListener("input", findValue)
    inputElement.type = "text";
    inputElement.id = "searchInput";
    searchDivContainer.appendChild(inputElement);

    //Добавляем селект
    let selectElement = document.createElement("select");
    selectElement.setAttribute("id", "searchSelect");
    selectElement.addEventListener("change", clearHighlight)

    for (let i = 0; i < headerCellNamesArray.length; i++) {
        let optionElement = document.createElement("option");
        optionElement.value = i;
        optionElement.text = headerCellNamesArray[i];
        selectElement.appendChild(optionElement);
    }
    searchDivContainer.appendChild(selectElement);

    //Добавляем таблицу
    tableDivContainer.innerHTML = "";
    tableDivContainer.appendChild(tableElement);

    //Присваиваем событие сортировки при нажатии на каждое название столбца 
    let headerCellsArray = document.querySelectorAll("th");
    headerCellsArray.forEach((el, index) => el.addEventListener("click", sortableElement.bind(this, index)));

    //Сортировка таблицы
    let tableRows = Array.from(document.querySelectorAll("tr")).slice(1);
    let sortStatus = true; //true - отсортировано от А до Я; false - отсортировано от Я до А
    let prevColumnNumber = 0;
    function sortableElement(currentColumnNumber) {
        let sortPointer = document.getElementsByClassName("sort-pointer");
        if (!sortStatus && prevColumnNumber == currentColumnNumber) { //Проверяем был ли отсортирован текущий столбец
            tableRows.reverse();
            sortStatus = true;
            sortPointer[currentColumnNumber].innerHTML = "&#9650";
        } else {
            //Сортируем сверяя значения от индекса столбца
            tableRows.sort((a, b) => a.children[currentColumnNumber].innerHTML.localeCompare(b.children[currentColumnNumber].innerHTML));
            prevColumnNumber = currentColumnNumber;
            sortStatus = false;
            sortPointer[currentColumnNumber].innerHTML = "&#9660";
        }
        tableRows.forEach(row => tableElement.appendChild(row));
    }

    //Поиск
    function findValue() {
        tableRows.forEach(el => {
            let tableRow = el.children[selectElement.value];
            tableRow.innerHTML = tableRow.innerText;
            let cellData = tableRow.innerHTML.toLowerCase();
            if (cellData.indexOf(inputElement.value.toLowerCase()) !== -1 && inputElement.value !== "") {
                tableRow.innerHTML = tableRow.innerHTML.replace(new RegExp(inputElement.value, "gi"), (match) => `<mark>${match}</mark>`);
            }
        })
    }

    //Сброс поиска и выделения полей при изменении столбца
    function clearHighlight() {
        let tableDataRows = Array.from(document.querySelectorAll("td"));
        tableDataRows.forEach(el => {
            el.innerHTML = el.innerHTML.replace(new RegExp("<[^>]*>", "gi"), "");
            inputElement.value = "";
        })
    }
}

fetch("data/data.json")
.then(resp => resp.json())
.then(data => generateTable(data.users, "table"))
.catch((error) => console.log("error:", error));;