const cardsDiv = document.getElementById("cards");
const statusText = document.getElementById("status");

const producerInput = document.getElementById("producer");
const modelInput = document.getElementById("model");
const yearInput = document.getElementById("year");
const colorInput = document.getElementById("color");
const imgInput = document.getElementById("img");
const addBtn = document.getElementById("addColection");

const api = "http://localhost:3002/autos";

// ✅ pagal tavo DB raktus
function toDbObject() {
  return {
    Gamintojas: producerInput.value.trim(),
    Modelis: modelInput.value.trim(),
    Metai: yearInput.value.trim(),
    Spalva: colorInput.value.trim(),
    "Nuotrauka URL": imgInput.value.trim(),
  };
}

function clearForm() {
  producerInput.value = "";
  modelInput.value = "";
  yearInput.value = "";
  colorInput.value = "";
  imgInput.value = "";
}

// ✅ GET
function getAutos() {
  statusText.textContent = "Kraunama...";
  fetch(api)
    .then((r) => r.json())
    .then((data) => {
      cardsDiv.innerHTML = "";
      statusText.textContent = `Rasta: ${data.length}`;

      data.forEach((auto) => {
        const gamintojas = auto["Gamintojas"] ?? "Nėra";
        const modelis = auto["Modelis"] ?? "Nėra";
        const metai = auto["Metai"] ?? "Nėra";
        const spalva = auto["Spalva"] ?? "Nėra";
        const imgUrl = auto["Nuotrauka URL"] ?? "";

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
          ${
            imgUrl
              ? `<img src="${imgUrl}" alt="auto">`
              : `<img src="https://via.placeholder.com/600x400?text=No+Image" alt="auto">`
          }
          <div class="card-body">
            <h3>${gamintojas} — ${modelis}</h3>
            <p><strong>Metai:</strong> ${metai}</p>
            <p><strong>Spalva:</strong> ${spalva}</p>

            <div class="actions">
              <button class="btn btn-edit">Redaguoti</button>
              <button class="btn btn-delete">Trinti</button>
            </div>
          </div>
        `;

        // ✅ DELETE
        card.querySelector(".btn-delete").addEventListener("click", () => {
          deleteAuto(auto.id);
        });

        // ✅ UPDATE (PATCH)
        card.querySelector(".btn-edit").addEventListener("click", () => {
          editAuto(auto);
        });

        cardsDiv.appendChild(card);
      });
    })
    .catch((err) => {
      console.log(err);
      statusText.textContent = "Klaida kraunant duomenis.";
    });
}

// ✅ POST
function addAuto() {
  const newAuto = toDbObject();

  // paprasta validacija
  if (!newAuto.Gamintojas || !newAuto.Modelis) {
    statusText.textContent = "Įveskite bent Gamintoją ir Modelį.";
    return;
  }

  fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newAuto),
  })
    .then((r) => r.json())
    .then(() => {
      clearForm();
      getAutos();
    })
    .catch((err) => {
      console.log(err);
      statusText.textContent = "Klaida pridedant automobilį.";
    });
}

// ✅ DELETE
function deleteAuto(id) {
  fetch(`${api}/${id}`, { method: "DELETE" })
    .then(() => getAutos())
    .catch((err) => {
      console.log(err);
      statusText.textContent = "Klaida trinant automobilį.";
    });
}

// ✅ UPDATE (PATCH)
function editAuto(auto) {
  const newColor = prompt("Įveskite naują spalvą:", auto["Spalva"] ?? "");
  if (newColor === null) return; // cancel

  fetch(`${api}/${auto.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Spalva: newColor }),
  })
    .then(() => getAutos())
    .catch((err) => {
      console.log(err);
      statusText.textContent = "Klaida atnaujinant automobilį.";
    });
}

addBtn.addEventListener("click", addAuto);

getAutos();
