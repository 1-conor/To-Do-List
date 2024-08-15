const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const priorityOptions = document.getElementsByName("priority");
const dateBox = document.getElementById("date-box");
const colorOptions = document.getElementsByName("color");

var addTaskModal = document.getElementById("add-task-modal");
var btn = document.getElementById("add-btn");
var span = addTaskModal.getElementsByClassName("close")[0];

btn.onclick = function() {
  addTaskModal.style.display = "block";
}
span.onclick = function() {
  addTaskModal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == addTaskModal) {
    addTaskModal.style.display = "none";
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function addTask() {
    if (inputBox.value === '') {
        alert("Please enter a task to add");
        return;
    }

    let selectedPriority = '';
    for (const radio of priorityOptions) {
      if (radio.checked) {
        selectedPriority = radio.value;
        break;
      }
    }

    if (selectedPriority === '') {
      alert("Please select a value for task priority");
      return;
    }

    if (dateBox.value === '') {
      alert("Please enter a date");
      return;
    }

    const date = formatDate(dateBox.value);

    let li = document.createElement("li");
    li.innerHTML = `
        <i class="bi bi-check-circle check-icon"></i>
        <span class="task-name">${inputBox.value}</span>
        <span class="task-date">${date}</span>
        <span class="details"><button class="button details-btn" id="see-details">Details</button></span>
        <span class="delete"><i class="bi bi-x-lg"></i></span>`;
    li.classList.add('list-item');
    li.classList.add('priority-' + selectedPriority);
    listContainer.appendChild(li);
    addTaskModal.style.display = "none";
    inputBox.value = "";
    dateBox.value = "";
    for (const radio of priorityOptions) {
      radio.checked = false;
    }
    saveData();
}

// Event delegation to handle clicks
listContainer.addEventListener("click", function(e) {
  // Check if the delete icon or its container was clicked
  if (e.target.closest(".delete")) {
      e.target.closest(".list-item").remove();
      saveData();
  }

// Check if the "Details" button was clicked
  if (e.target.classList.contains("details-btn")) {
    e.stopImmediatePropagation();
    const listItem = e.target.closest(".list-item");
    showDetails(listItem);
    return;
  }

  // Handle clicking on the list item itself
  let target = e.target;
  while (target && !target.classList.contains('list-item')) {
      target = target.parentElement;
  }

  if (target) {
      target.classList.toggle("checked");
      const icon = target.querySelector(".check-icon");
      if (target.classList.contains("checked")) {
          icon.classList.remove("bi-check-circle");
          icon.classList.add("bi-check-circle-fill");
      } else {
          icon.classList.remove("bi-check-circle-fill");
          icon.classList.add("bi-check-circle");
      }
      saveData();
  }
}, false);

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTasks() {
    listContainer.innerHTML = localStorage.getItem("data");
}
showTasks();

function changeColor() {
  let selectedColor= '#966DE8';

  for (const radio of colorOptions) {
    if (radio.checked) {
      switch (radio.value) {
        case 'purple':
          selectedColor = "#966DE8";
          break;
        case 'red':
          selectedColor = "#E84C61";
          break;
        case 'blue':
          selectedColor = "#6D8FE8";
          break;
        case 'pink':
          selectedColor = "#E88FC3";
          break;
        case 'green':
          selectedColor = "#6DE8A8";
          break;
        case 'yellow':
          selectedColor = "#E8E36D";
          break;
      }
      break;
    }
  }
  localStorage.setItem('selectedColor', selectedColor);
  document.documentElement.style.setProperty('--primary-color', selectedColor);
}

function loadColor() {
  const savedColor = localStorage.getItem('selectedColor');
  if (savedColor) {
    // Apply the saved color to the document
    document.documentElement.style.setProperty('--primary-color', savedColor);

    // Set the corresponding radio button as checked
    for (const radio of colorOptions) {
      if (radio.value === getColorValue(savedColor)) {
        radio.checked = true;
        break;
      }
    }
  } else {
    // Apply the default color if no saved color is found
    document.documentElement.style.setProperty('--primary-color', '#966DE8');
  }
}

// Helper function to get the color value from the color code
function getColorValue(colorCode) {
  switch (colorCode) {
    case "#966DE8":
      return 'purple';
    case "#E84C61":
      return 'red';
    case "#6D8FE8":
      return 'blue';
    case "#E88FC3":
      return 'pink';
    case "#6DE8A8":
      return 'green';
    case "#E8E36D":
      return 'yellow';
    default:
      return '';
  }
}

colorOptions.forEach(radio => {
  radio.addEventListener('change', changeColor);
});

window.onload = loadColor;

function showDetails(listItem) {
  const taskName = listItem.querySelector(".task-name").textContent;
  const taskDate = listItem.querySelector(".task-date").textContent;
  const taskPriority = listItem.classList.contains('priority-low') ? 'Low' :
                        listItem.classList.contains('priority-medium') ? 'Medium' : 'High';

  const detailsModal = document.getElementById("see-details-modal");
  detailsModal.querySelector(".modal-content .task-details").innerHTML = `
    <p><strong>Name:</strong> ${taskName}</p>
    <p><strong>Date:</strong> ${taskDate}</p>
    <p><strong>Priority:</strong> ${taskPriority}</p>
  `;

  detailsModal.style.display = "block";

  const closeSpan = detailsModal.getElementsByClassName("close")[0];
  closeSpan.onclick = function() {
    detailsModal.style.display = "none";
  }

  window.onclick = function(event) {
    if (event.target == detailsModal) {
      detailsModal.style.display = "none";
    }
  }
}
