const addBtn = document.querySelector(".add-btn");
const clearBtn = document.querySelector(".clear-btn");
const exportBtn = document.querySelector(".export-btn");
let amount = document.querySelector(".amount-input");
let to = document.querySelector(".to-input");
let note = document.querySelector(".note-input");
let date = document.querySelector(".date-input");
const fullTable = document.querySelector(".history-table");
const table = document.querySelector(".history-table tbody");

//This array has all the entries stored. Fetches from local storage or falls back on the empty array
const entries = JSON.parse(localStorage.getItem("expenses")) || [];

//Clearing records
clearBtn.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("expenses");
  let entryRows = document.querySelectorAll(".entry-row");
  entryRows.forEach((row) => {
    row.remove();
  });
});

addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let amtValue = amount.value;
  let toValue = to.value;
  let noteValue = note.value;
  let dateValue = date.value;

  if (
    (amtValue === "") |
    (toValue === "") |
    (noteValue === "") |
    (dateValue === "")
  ) {
    alert("Please fill all the inputs");
  } else {
    const entry = {
      date: dateValue,
      to: toValue,
      note: noteValue,
      amount: amtValue,
    };

    entries.push(entry);

    //Json.stringify() used so as to store the JSON object as a string
    localStorage.setItem("expenses", JSON.stringify(entries));

    //This is to show the entered inputs in the table as soon as the add button is clicked
    let inputs = [dateValue, toValue, noteValue, amtValue];
    let row = table.insertRow(0);
    row.setAttribute("class", "entry-row");
    for (let i = 0; i < 4; i++) {
      let cell = row.insertCell(i);
      cell.innerHTML = inputs[i];
    }
  }

  // To remove previously entered inputs
  document.querySelector(".amount-input").value = "";
  document.querySelector(".to-input").value = "";
  document.querySelector(".note-input").value = "";
  document.querySelector(".date-input").value = "";
});

//To populate the entries from local storage
entries.forEach((entry) => {
  let row = table.insertRow(0);
  row.setAttribute("class", "entry-row");
  for (let i = 0; i < 4; i++) {
    let cell = row.insertCell(i);
    cell.innerHTML = entry[Object.keys(entry)[i]];
  }
});

//Export records as CSV
//Reference for this export code: https://medium.com/@danny.pule/export-json-to-csv-file-using-javascript-a0b7bc5b00d2

function convertToCSV(objArray) {
  var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  var str = "";

  for (var i = 0; i < array.length; i++) {
    var line = "";
    for (var index in array[i]) {
      if (line != "") line += ",";

      line += array[i][index];
    }

    str += line + "\r\n";
  }

  return str;
}

function exportCSVFile(headers, items, fileTitle) {
  if (headers) {
    items.unshift(headers);
  }

  // Convert Object to JSON
  var jsonObject = JSON.stringify(items);

  var csv = this.convertToCSV(jsonObject);

  var exportedFilenmae = fileTitle + ".csv" || "export.csv";

  var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilenmae);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

let headers = {
  date: "date",
  to: "to",
  note: "note",
  amount: "amount",
};

exportBtn.addEventListener("click", (e) => {
  e.preventDefault();
  convertToCSV(entries);
  exportCSVFile(headers, entries, "Monthly-Expenses");
});

//Magically expanding textarea
//Codepen reference for the magically expanding textarea: https://codepen.io/tomhodgins/pen/KgazaE
// var comfyText = (function () {
//   var tag = document.querySelectorAll("textarea");
//   for (var i = 0; i < tag.length; i++) {
//     tag[i].addEventListener("paste", autoExpand);
//     tag[i].addEventListener("input", autoExpand);
//     tag[i].addEventListener("keyup", autoExpand);
//   }
//   function autoExpand(e, el) {
//     var el = el || e.target;
//     el.style.height = "inherit";
//     el.style.height = el.scrollHeight + "px";
//   }
//   window.addEventListener("load", expandAll);
//   window.addEventListener("resize", expandAll);
//   function expandAll() {
//     var tag = document.querySelectorAll("textarea");
//     for (var i = 0; i < tag.length; i++) {
//       autoExpand(e, tag[i]);
//     }
//   }
// })();
