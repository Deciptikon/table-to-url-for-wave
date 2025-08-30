const precision = 5;

const baseURL = "https://deciptikon.github.io/WaveJS/";

const defaultData = {
  Chi: "4",
  Psi: "0.128",
  Amplutuda: "0.95",
  S: "1",
  Width: "640",
  Height: "480",
  X0: "141",
  Y0: "56",
  Scale: "0.04",
  Alfa: "1.571",
  Betta: "0.524",
  Gamma: "0",
  Ro: "2",
};

const defaultOrder = [
  "Chi",
  "Psi",
  "Amplutuda",
  "S",
  "Width",
  "Height",
  "X0",
  "Y0",
  "Scale",
  "Alfa",
  "Betta",
  "Gamma",
  "Ro",
];

document.addEventListener("DOMContentLoaded", function () {
  const table = document.getElementById("data-table");
  const tbody = table.querySelector("tbody");
  const addRowBtn = document.getElementById("add-row");
  const generateLinksBtn = document.getElementById("generate-links");
  const clearTableBtn = document.getElementById("clear-table");
  const linksContainer = document.getElementById("links-container");

  addTableRow();

  addRowBtn.addEventListener("click", function () {
    addTableRow();
  });

  clearTableBtn.addEventListener("click", function () {
    clearTable();
  });

  generateLinksBtn.addEventListener("click", function () {
    generateLinks();
  });

  function addTableRow() {
    const row = document.createElement("tr");

    // Добавляем 4 ячейки с input'ами
    for (let i = 0; i < 4; i++) {
      const cell = document.createElement("td");
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = `Введите число`;
      cell.appendChild(input);
      row.appendChild(cell);
    }

    const actionCell = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Удалить";
    deleteBtn.classList.add("btn", "btn-action");
    deleteBtn.addEventListener("click", function () {
      if (tbody.children.length > 1) {
        tbody.removeChild(row);
      } else {
        alert("Таблица должна содержать хотя бы одну строку");
      }
    });
    actionCell.appendChild(deleteBtn);
    row.appendChild(actionCell);

    tbody.appendChild(row);
  }

  function clearTable() {
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }
    addTableRow();

    linksContainer.innerHTML =
      '<p class="placeholder">Ссылки появятся здесь после генерации</p>';
  }

  function generateLinks() {
    const rows = tbody.querySelectorAll("tr");
    const data = [];

    rows.forEach((row) => {
      const inputs = row.querySelectorAll("input");
      const rowData = [];

      inputs.forEach((input) => {
        rowData.push(input.value.trim());
      });

      data.push(rowData);
    });

    linksContainer.innerHTML = "";

    if (data.length > 0) {
      data.forEach((rowData, index) => {
        const url = generateUrl(rowData);

        // Создаем элемент для отображения ссылки
        const linkItem = document.createElement("div");
        linkItem.classList.add("link-item");

        const numberSpan = document.createElement("span");
        numberSpan.classList.add("link-number");
        numberSpan.textContent = index + 1;

        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.textContent = url;
        anchor.target = "_blank"; // Открывать в новой вкладке
        anchor.rel = "noopener noreferrer"; // Безопасность

        linkItem.appendChild(numberSpan);
        linkItem.appendChild(anchor);
        linksContainer.appendChild(linkItem);
      });
    } else {
      linksContainer.innerHTML =
        '<p class="placeholder">Нет данных для генерации ссылок</p>';
    }
  }

  function urlFromData(baseURL, data) {
    let url = `${baseURL}?`;
    defaultOrder.forEach((key) => {
      url += `${key}=${data[key]}&`;
    });
    return url.slice(0, -1);
  }

  function generateUrl(rowData) {
    const [s, A, F, n] = rowData;

    if (!s && !A && !F && !n) {
      return baseURL;
    }

    const data = defaultData;

    data.S = s.replaceAll(",", ".");

    const a = Number(A.replaceAll(",", "."));
    if (isNaN(a)) {
      alert("Амплитуда колебаний должна быть корректной!");
      return;
    }
    data.Amplutuda = (a / 100).toFixed(precision);

    if (isNaN(Number(F.replaceAll(",", ".")))) {
      alert("Частота колебаний должна быть корректной!");
      return;
    }
    if (isNaN(Number(n.replaceAll(",", ".")))) {
      alert("Частота вращения должна быть корректной!");
      return;
    }
    if (Number(n.replaceAll(",", ".")) <= 0) {
      alert("Частота вращения должна быть строго больше нуля!");
      return;
    }

    // частота относительных колебаний
    const f = Number(F.replaceAll(",", ".")) / Number(n.replaceAll(",", "."));

    if (!isFinite(f)) {
      alert("Относительная частота бесконечна!");
      return;
    }

    // разделяем на целую (chi) и дробную (psi) части
    const chi = Math.floor(f);
    const psi = f - chi;

    data.Chi = chi;
    data.Psi = psi.toFixed(precision);

    const url = urlFromData(baseURL, data);
    return url;
  }
});
