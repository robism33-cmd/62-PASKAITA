const todoList = document.getElementById("todoList");
const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const api = "http://localhost:3001/todos";

// CRUD operacijos

// GET - gauti visa info (Read)
function getTodos() {
  fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      data.forEach((todo) => {
        const li = document.createElement("li");
        li.textContent = todo.text;

        // Delete mygtukas
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "X";

        if (todo.completed) {
          li.classList.add("completed");
        }

        li.addEventListener("click", function () {
          updateTodoStatus(todo.id);
        });

        deleteButton.addEventListener("click", function () {
          deleteTodo(todo.id);
        });

        li.appendChild(deleteButton);
        todoList.appendChild(li);
      });
    });
}

getTodos();

// POST - issaugoti nauja informacija (Create)
function addTodo(value) {
  fetch(api, {
    // Nurodau koks metodas bus atliekamas, kad fetch funkcija suprastu
    method: "POST",
    // Nurodau kokio tipo informacija ateis, siuo atveju JSON
    headers: {
      "Content-type": "application/json",
    },
    // Body - nurodau ka siusiu ir kad siusiu info JSON formatu
    body: JSON.stringify({
      text: value,
      completed: false,
    }),
  }).then((response) => {
    return response.json();
  });
}

addBtn.addEventListener("click", function () {
  const inputValue = todoInput.value;

  if (!inputValue) {
    return;
  }

  addTodo(inputValue);
});

// DELETE - istrinti informacija
function deleteTodo(id) {
  // http://localhost:3001/todos/2
  fetch(`${api}/${id}`, {
    method: "DELETE",
  });
}

// PATCH - atnaujinti duomenis, keicia tik viena arba kelis key'us
function updateTodoStatus(id) {
  fetch(`${api}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      completed: true,
    }),
  });
}
