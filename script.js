// Pobranie elementów HTML
const toDoContainer = document.getElementById('to-do');
const addButton = document.getElementById('add-button');
const searchInput = document.getElementById('search');
const taskNameInput = document.getElementById('task-name');
const taskDateInput = document.getElementById('task-date');

// Wczytanie zadań z localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Funkcja do zapisu zadań w localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Funkcja do wyświetlenia zadań
function draw() {
  toDoContainer.innerHTML = '';  // Wyczyść listę zadań
  tasks.forEach((task, index) => {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');
    checkbox.checked = task.completed;
    checkbox.addEventListener('click', () => toggleTaskCompletion(index));

    const taskName = document.createElement('span');
    taskName.classList.add('task-name');
    taskName.textContent = task.name;
    if (task.completed) taskName.style.textDecoration = 'line-through';
    taskName.addEventListener('click', () => editTaskName(index));

    const taskDate = document.createElement('span');
    taskDate.classList.add('task-date');
    taskDate.textContent = task.date;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.textContent = 'Usuń';
    deleteButton.addEventListener('click', () => deleteTask(index));

    taskElement.appendChild(checkbox);
    taskElement.appendChild(taskName);
    taskElement.appendChild(taskDate);
    taskElement.appendChild(deleteButton);

    toDoContainer.appendChild(taskElement);
  });
}

// Dodawanie nowego zadania
addButton.addEventListener('click', () => {
  const name = taskNameInput.value.trim();
  const date = taskDateInput.value;
  const today = new Date().toISOString().split('T')[0]; // Dzisiejsza data w formacie YYYY-MM-DD

  // Sprawdzenie, czy nazwa zadania jest podana i czy data jest pusta lub przyszła
  if (name && (date === '' || date > today)) {
    tasks.push({ name, date, completed: false });
    saveTasks();
    draw();

    // Wyczyść pola wejściowe
    taskNameInput.value = '';
    taskDateInput.value = '';
  } else {
    alert("Podaj nazwę zadania i upewnij się, że data jest pusta lub większa od dzisiejszej.");
  }
});

// Usuwanie zadania
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  draw();
}

// Zmiana statusu ukończenia zadania
function toggleTaskCompletion(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  draw();
}

// Edycja nazwy zadania
function editTaskName(index) {
  const taskElement = document.querySelectorAll('.task')[index];
  const taskNameElement = taskElement.querySelector('.task-name');

  const input = document.createElement('input');
  input.type = 'text';
  input.value = tasks[index].name;
  input.classList.add('task-edit-input');

  input.addEventListener('blur', () => saveTaskNameEdit(index, input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') input.blur();
  });

  taskElement.replaceChild(input, taskNameElement);
  input.focus();
}

// Zapis edytowanej nazwy zadania
function saveTaskNameEdit(index, newName) {
  tasks[index].name = newName.trim() || tasks[index].name;
  saveTasks();
  draw();
}

// Wyszukiwanie zadań
searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  if (query.length >= 2) {
    toDoContainer.innerHTML = '';
    tasks.forEach((task, index) => {
      if (task.name.toLowerCase().includes(query)) {
        const highlightedTask = highlightQuery(task.name, query);
        displayFilteredTask(task, index, highlightedTask);
      }
    });
  } else {
    draw();
  }
});

// Podświetlanie znalezionej frazy w zadaniach
function highlightQuery(text, query) {
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
}

// Wyświetlanie przefiltrowanych zadań
function displayFilteredTask(task, index, highlightedTask) {
  const taskElement = document.createElement('div');
  taskElement.classList.add('task');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('task-checkbox');
  checkbox.checked = task.completed;
  checkbox.addEventListener('click', () => toggleTaskCompletion(index));

  const taskName = document.createElement('span');
  taskName.classList.add('task-name');
  taskName.innerHTML = highlightedTask;
  if (task.completed) taskName.style.textDecoration = 'line-through';
  taskName.addEventListener('click', () => editTaskName(index));

  const taskDate = document.createElement('span');
  taskDate.classList.add('task-date');
  taskDate.textContent = task.date;

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-button');
  deleteButton.textContent = 'Usuń';
  deleteButton.addEventListener('click', () => deleteTask(index));

  taskElement.appendChild(checkbox);
  taskElement.appendChild(taskName);
  taskElement.appendChild(taskDate);
  taskElement.appendChild(deleteButton);

  toDoContainer.appendChild(taskElement);
}

// Inicjalizacja: wczytanie zadań przy ładowaniu
draw();
