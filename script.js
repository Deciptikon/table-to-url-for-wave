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

  function toRadians(gradus) {
    return (Math.PI * gradus) / 180;
  }

  function num(n, precision = 5) {
    return Number.parseFloat(Number(n).toFixed(precision)).toString();
  }

  function isValid(str, options = {}) {
    if (!str || typeof str !== "string" || str.trim() === "") {
      return false;
    }

    const trimmedStr = str.trim().replaceAll(",", ".");

    if (isNaN(trimmedStr) || trimmedStr === "" || isNaN(Number(trimmedStr))) {
      return false;
    }

    const num = Number(trimmedStr);

    if (options.integer && !Number.isInteger(num)) {
      return false;
    }

    if (options.min !== undefined && num < options.min) {
      return false;
    }

    if (options.max !== undefined && num > options.max) {
      return false;
    }

    return true;
  }

  function generateUrl(rowData) {
    const commonInputs = document.querySelectorAll(
      "#common-params-table input"
    );
    const commonParams = Array.from(commonInputs).map((input) => input.value);

    const [s, A, F, n] = rowData;
    const [width, height, x0, y0, scale, alfa, betta, gamma, ro] = commonParams;

    if (!s && !A && !F && !n) {
      alert("Уникальные параметры отсутствуют! Сгенерирована пустая ссылка.");
      return baseURL;
    }

    const data = defaultData;

    if (!isValid(width, { integer: true, min: 100, max: 1080 })) {
      alert("Ширина холста должна быть корректной!");
      return;
    }
    data.Width = width.replaceAll(",", ".");

    if (!isValid(height, { integer: true, min: 100, max: 1080 })) {
      alert("Высота холста должна быть корректной!");
      return;
    }
    data.Height = height.replaceAll(",", ".");

    if (!isValid(x0)) {
      alert("Смещение по горизонтали должно быть корректным!");
      return;
    }
    data.X0 = x0.replaceAll(",", ".");

    if (!isValid(y0)) {
      alert("Смещение по вертикали должно быть корректным!");
      return;
    }
    data.Y0 = y0.replaceAll(",", ".");

    if (!isValid(scale, { min: 0, max: 5 })) {
      alert("Масштаб должен быть корректным!");
      return;
    }
    data.Scale = scale.replaceAll(",", ".");

    if (!isValid(alfa, { min: 0, max: 90 })) {
      alert(
        "Угол наклона главной режущей кромки (Alfa) должен быть корректным!"
      );
      return;
    }
    let al = Number(alfa.replaceAll(",", "."));
    if (90 - al < 0.01) al = 90 - 0.01;
    data.Alfa = num(toRadians(al));

    if (!isValid(betta, { min: 0, max: 90 })) {
      alert(
        "Угол наклона вспомогательной режущей кромки (Betta) должен быть корректным!"
      );
      return;
    }
    let be = Number(betta.replaceAll(",", "."));
    if (90 - be < 0.01) be = 90 - 0.01;
    data.Betta = num(toRadians(be));

    if (!isValid(gamma, { min: -90, max: 90 })) {
      alert(
        "Угол наклона резца относительно поверхности обработки (Gamma) должен быть корректным!"
      );
      return;
    }
    data.Gamma = num(toRadians(Number(gamma.replaceAll(",", "."))));

    if (!isValid(ro, { min: 0, max: 10 })) {
      alert("Радиус скругления вершины резца (Ro) должен быть корректным!");
      return;
    }
    data.Ro = ro.replaceAll(",", ".");

    if (!isValid(s, { min: 0, max: 10 })) {
      alert("Подача должна быть корректной!");
      return;
    }
    data.S = s.replaceAll(",", ".");

    if (!isValid(A, { min: 0, max: 100000 })) {
      alert("Амплитуда колебаний должна быть корректной!");
      return;
    }
    data.Amplutuda = num(Number(A.replaceAll(",", ".")) / 100);

    if (!isValid(F, { min: 0, max: 100000 })) {
      alert("Частота колебаний должна быть корректной!");
      return;
    }
    if (!isValid(n, { min: 0, max: 100000 })) {
      alert("Частота вращения должна быть корректной!");
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

    data.Chi = num(chi);
    data.Psi = num(Math.max(psi, 0.00001));

    const url = urlFromData(baseURL, data);
    return url;
  }
});
