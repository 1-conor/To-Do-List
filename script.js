const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const priorityOptions = document.getElementsByName("priority");
const dateBox = document.getElementById("date-box");
const descriptionBox = document.getElementById("description-box");
const colorOptions = document.getElementsByName("color");

const addTaskModal = document.getElementById("add-task-modal");
const btn = document.getElementById("add-btn");
const span = addTaskModal.getElementsByClassName("close")[0];

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

  const inputDate = new Date(dateBox.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (dateBox.value === '') {
      alert("Please enter a date for the task to be done by");
      return;
  }

  if (inputDate.getTime() < today.getTime()) {
      alert("The task due date cannot be in the past");
      return;
  }

  const date = formatDate(dateBox.value);

  let li = document.createElement("li");
  li.innerHTML = `
      <i class="bi bi-check-circle check-icon"></i>
      <span class="task-name">${inputBox.value}</span>
      <span class="task-date">${date}</span>
      <span class="details"><button class="button details-btn" id="see-details">Details</button></span>
      <span class="edit"><i class="bi bi-pencil-square edit-btn" id="edit-details"></i></span>
      <span class="delete"><i class="bi bi-x-lg"></i></span>`;
  li.classList.add('list-item');
  li.classList.add('priority-' + selectedPriority);

  // Add a data attribute to store the description
  li.dataset.description = descriptionBox.value;

  listContainer.appendChild(li);
  addTaskModal.style.display = "none";
  inputBox.value = "";
  dateBox.value = "";
  descriptionBox.value = "";
  for (const radio of priorityOptions) {
      radio.checked = false;
  }
  saveData();
  sortTasks(); // Sort tasks after adding a new one
}

// Event delegation to handle clicks
listContainer.addEventListener("click", function(e) {
  // Check if the delete icon or its container was clicked
  if (e.target.closest(".delete")) {
      e.target.closest(".list-item").remove();
      saveData();
      sortTasks(); // Sort tasks after deletion
  }

  // Check if the "Details" button was clicked
  if (e.target.classList.contains("details-btn")) {
    e.stopImmediatePropagation();
    const listItem = e.target.closest(".list-item");
    showDetails(listItem);
    return;
  }

  // Check if the "Edit" button was clicked
  if (e.target.classList.contains("edit-btn")) {
    e.stopImmediatePropagation();
    const listItem = e.target.closest(".list-item");
    editTask(listItem);
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
    sortTasks(); // Sort tasks when loading from localStorage
}
showTasks();

function changeColor() {
  let selectedColor = '#966DE8';

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
  const taskDescription = listItem.dataset.description; // Extract from data attribute
  const taskPriority = listItem.classList.contains('priority-low') ? 'Low' :
                        listItem.classList.contains('priority-medium') ? 'Medium' : 'High';

  const detailsModal = document.getElementById("see-details-modal");
  detailsModal.querySelector(".modal-content .task-details").innerHTML = `
      <p><strong>Name:</strong> ${taskName}</p>
      <p><strong>Description:</strong> ${taskDescription}</p>
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

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
      // Remove 'active' class from all nav items
      document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));

      // Add 'active' class to the clicked nav item
      item.classList.add('active');

      // Filter tasks based on the clicked filter
      filterTasks(item.getAttribute('data-filter'));
  });
});

function filterTasks(filter) {
  const listItems = document.querySelectorAll('#list-container .list-item');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  const weekEnd = new Date(today);
  weekEnd.setDate(today.getDate() + (6 - today.getDay()));
  
  listItems.forEach(item => {
      const taskDateText = item.querySelector('.task-date').textContent;
      const [day, month, year] = taskDateText.split('/').map(Number);
      const taskDate = new Date(year, month - 1, day); // month is zero-indexed

      let shouldShow = false;

      switch (filter) {
        case 'all':
          shouldShow = true;
          break;
        case 'today':
          shouldShow = taskDate.getTime() === today.getTime();
          break;
        case 'week':
          shouldShow = taskDate >= weekStart && taskDate <= weekEnd;
          break;
        case 'priority-low':
          shouldShow = item.classList.contains('priority-low');
          break;
        case 'priority-medium':
          shouldShow = item.classList.contains('priority-medium');
          break;
        case 'priority-high':
          shouldShow = item.classList.contains('priority-high');
          break;
      }

      item.style.display = shouldShow ? 'grid' : 'none'; // Ensure layout remains as grid
  });

  sortTasks(); // Sort tasks after filtering
}

function sortTasks() {
  const listItems = Array.from(listContainer.children);
  listItems.sort((a, b) => {
      const dateA = new Date(a.querySelector('.task-date').textContent.split('/').reverse().join('-'));
      const dateB = new Date(b.querySelector('.task-date').textContent.split('/').reverse().join('-'));
      return dateA - dateB;
  });

  listItems.forEach(item => listContainer.appendChild(item)); // Re-append sorted items
}

function editTask(buttonElement) {
  const listItem = buttonElement.closest('li');
  const editTaskModal = document.getElementById('edit-task-modal');

  // Populate the edit form with current task details
  document.getElementById('edit-task-name').value = listItem.querySelector('.task-name').textContent;
  const [day, month, year] = listItem.querySelector('.task-date').textContent.split('/');
  document.getElementById('edit-task-date').value = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  document.getElementById('edit-task-description').value = listItem.dataset.description;

  const priority = listItem.classList.contains('priority-low') ? 'low' :
                   listItem.classList.contains('priority-medium') ? 'medium' : 'high';
  document.querySelector(`input[name="edit-priority"][value="${priority}"]`).checked = true;

  // Display the edit modal
  editTaskModal.style.display = 'block';

  // Close the modal when the close button is clicked
  const closeSpan = editTaskModal.getElementsByClassName('close')[0];
  closeSpan.onclick = function() {
      editTaskModal.style.display = 'none';
  };

  window.onclick = function(event) {
      if (event.target == editTaskModal) {
          editTaskModal.style.display = 'none';
      }
  };

  // Save changes when the save button is clicked
  document.getElementById('save-edit-btn').onclick = function() {
      saveEditChanges(listItem);
  };
}

function saveEditChanges(listItem) {
  // Get the new values from the edit form
  const updatedName = document.getElementById('edit-task-name').value;
  const updatedDate = document.getElementById('edit-task-date').value;
  const updatedDescription = document.getElementById('edit-task-description').value;

  let updatedPriority = '';
  const priorityRadios = document.getElementsByName('edit-priority');
  for (const radio of priorityRadios) {
      if (radio.checked) {
          updatedPriority = radio.value;
          break;
      }
  }

  // Update the task in the DOM
  listItem.querySelector('.task-name').textContent = updatedName;
  listItem.querySelector('.task-date').textContent = formatDate(updatedDate);
  listItem.dataset.description = updatedDescription;

  listItem.classList.remove('priority-low', 'priority-medium', 'priority-high');
  listItem.classList.add(`priority-${updatedPriority}`);

  // Hide the edit modal
  document.getElementById('edit-task-modal').style.display = 'none';

  // Save the updated task list
  saveData();
  sortTasks();
}