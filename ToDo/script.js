const todoList = document.getElementById("todoList");
const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");

const api = "http://localhost:3000/todos";

// GET - gauti visus
function getTodos() {
  fetch(api)
    .then((response) => response.json())
    .then((data) => {
      todoList.innerHTML = "";

      data.forEach((todo) => {
        const li = document.createElement("li");

        // ✅ jei completed - uždedam klasę
        if (todo.completed) {
          li.classList.add("completed");
        }

        // tekstas
        const textSpan = document.createElement("span");
        textSpan.textContent =
          todo.title ?? todo.text ?? todo.name ?? "Be pavadinimo";

        // ✅ paspaudus ant teksto - pakeičiam completed (toggle)
        textSpan.addEventListener("click", () => {
          updateTodoStatus(todo.id, !todo.completed);
        });

        // TRYNIMO MYGTUKAS
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "X";
        deleteButton.addEventListener("click", () => {
          deleteTodo(todo.id);
        });

        li.appendChild(textSpan);
        li.appendChild(deleteButton);
        todoList.appendChild(li);
      });
    })
    .catch((error) => {
      console.log("Klaida gaunant todos:", error);
    });
}

getTodos();

// POST - pridėti naują
function addTodo(value) {
  return fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: value,
      completed: false,
    }),
  })
    .then((response) => response.json())
    .then(() => {
      todoInput.value = "";
      getTodos();
    })
    .catch((error) => console.log("Klaida pridedant todo:", error));
}

addBtn.addEventListener("click", function () {
  const inputValue = todoInput.value.trim();
  if (!inputValue) return;

  addTodo(inputValue);
});

// DELETE - ištrinti
function deleteTodo(id) {
  fetch(`${api}/${id}`, { method: "DELETE" })
    .then(() => getTodos())
    .catch((error) => {
      console.log("Klaida trinant todo:", error);
    });
}

// PATCH - atnaujinti completed (vieną lauką)
function updateTodoStatus(id, completedValue) {
  fetch(`${api}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: completedValue }),
  })
    .then(() => getTodos())
    .catch((error) => {
      console.log("Klaida atnaujinant todo:", error);
    });
}
