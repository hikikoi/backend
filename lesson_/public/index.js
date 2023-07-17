// Функция для создания ячейки таблицы
function createTableCell(content) {
    const cell = document.createElement("td");
    cell.textContent = content;
    return cell;
  }
  
  // Функция для создания строки таблицы
  function createTableRow(data) {
    const row = document.createElement("tr");
    row.appendChild(createTableCell(data.id));
    row.appendChild(createTableCell(data.name));
    row.appendChild(createTableCell(data.birth));
    row.appendChild(createTableCell(data.death));
    row.appendChild(createTableCell(data.profession));
    return row;
  }
  
  // Функция для отображения данных в таблице
  function displayDataInTable(data) {
    const table = document.getElementById("data-table");
  
    // Очистка таблицы
    table.innerHTML = "";
  
    // Создание заголовка таблицы
    const headerRow = document.createElement("tr");
    headerRow.innerHTML = "<th>ID</th><th>Name</th><th>Birth</th><th>Death</th><th>Profession</th>";
    table.appendChild(headerRow);
  
    // Создание строк таблицы с данными
    data.forEach((item) => {
      const row = createTableRow(item);
      table.appendChild(row);
    });
  }
  
  // Запрос данных с сервера и отображение их в таблице
  fetch("http://localhost:5000/philosophers")
    .then((response) => response.json())
    .then((data) => {
      displayDataInTable(data);
    })
    .catch((error) => {
      console.log("An error occurred:", error);
    });