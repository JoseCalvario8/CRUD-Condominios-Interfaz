addEventListener("DOMContentLoaded", (event) => {
  getCondominios();
});
var selectedRow = null;
var _id = null;

//Show Alerts
function showAlert(message, className) {
  const div = document.createElement("div");
  div.className = `alert alert-${className}`;

  div.appendChild(document.createTextNode(message));
  const container = document.querySelector(".container");
  const main = document.querySelector(".main");
  container.insertBefore(div, main);

  setTimeout(() => document.querySelector(".alert").remove(), 3000);
}

function getCondominios() {
  fetch("http://127.0.0.1:3000/condominios", {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  })
    .then((Response) => Response.json())
    .then((data) => data.forEach((condominio) => addCondominio(condominio)));
}

function postCondominio(datos) {
  fetch("http://127.0.0.1:3000/condominios", {
    method: "POST",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  })
    .then((Response) => Response.json())
    .then((data) => {
      console.log(data);
      addCondominio(datos);
      selectedRow = null;
      showAlert("Registro añadido", "success");
    });
}

//Limpiar los campos
function clearFields() {
  document.querySelector("#firstName").value = "";
  document.querySelector("#lastName").value = "";
  document.querySelector("#rollNo").value = "";
  document.querySelector("#propietario").value = "";
  document.querySelector("#tel-propietario").value = "";
  document.querySelector("#habitantes").value = "";
}

function addCondominio(condominio) {
  const list = document.querySelector("#student-list");
  const row = document.createElement("tr");

  row.innerHTML = `
        <td>${condominio.nombre}</td>
        <td>${condominio.domicilio}</td>
        <td>${condominio.coto}</td>
        <td>${condominio.propietario}</td>
        <td>${condominio.propietariotel}</td>
        <td>${condominio.habitantes}</td>
        <td>
        <a href="#" onclick = "actualizar(event,'${condominio._id}')" class="btn btn-warning btn-sm edit">Actualizar</a>
        <a href="#" onclick = "eliminar(event,'${condominio._id}')" class="btn btn-danger btn-sm delete">Eliminar</a>
    `;
  list.appendChild(row);
}
//Añadir Registro

document.querySelector("#student-form").addEventListener("submit", (e) => {
  e.preventDefault();

  //Obtener los valores
  const nombre = document.querySelector("#firstName").value;
  const domicilio = document.querySelector("#lastName").value;
  const coto = document.querySelector("#rollNo").value;
  const propietario = document.querySelector("#propietario").value;
  const propietariotel = document.querySelector("#tel-propietario").value;
  const habitantes = Number(document.querySelector("#habitantes").value);

  //Validacion
  if (
    nombre == "" ||
    domicilio == "" ||
    coto == "" ||
    propietario == "" ||
    propietariotel == "" ||
    habitantes == NaN
  ) {
    showAlert("Por favor rellene todos los campos", "danger");
  } else {
    const datos = {
      nombre,
      domicilio,
      coto,
      propietario,
      propietariotel,
      habitantes,
    };
    if (selectedRow == null) {
      postCondominio(datos);
    } else {
      actualizarCondominio(datos);
      selectedRow = null;
      showAlert("Registro editado", "info");
    }
    clearFields();
  }
});

function actualizar(e, id) {
  e.preventDefault();
  _id = id;
}

function actualizarCondominio(datos) {
  fetch(`http://127.0.0.1:3000/condominios/${_id}`, {
    method: "PATCH",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  })
    .then((Response) => Response.json())
    .then((data) => {
      var st = document.getElementById("student-list");
      st.innerHTML = "";
      getCondominios();
      selectedRow = null;
      showAlert("Registro actualizado", "success");
    });
}
//Editar registro
document.querySelector("#student-list").addEventListener("click", (e) => {
  target = e.target;
  if (target.classList.contains("edit")) {
    selectedRow = target.parentElement.parentElement;
    document.querySelector("#firstName").value =
      selectedRow.children[0].textContent;
    document.querySelector("#lastName").value =
      selectedRow.children[1].textContent;
    document.querySelector("#rollNo").value =
      selectedRow.children[2].textContent;
    document.querySelector("#propietario").value =
      selectedRow.children[3].textContent;
    document.querySelector("#tel-propietario").value =
      selectedRow.children[4].textContent;
    document.querySelector("#habitantes").value =
      selectedRow.children[5].textContent;
  }
});

function eliminar(e, id) {
  e.preventDefault();
  fetch(`http://127.0.0.1:3000/condominios/${id}`, {
    method: "DELETE",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  })
    .then((Response) => Response.json())
    .then((data) => {
      var st = document.getElementById("student-list");
      st.innerHTML = "";
      getCondominios();
    });
}

//Borrar registro

document.querySelector("#student-list").addEventListener("click", (e) => {
  target = e.target;
  if (target.classList.contains("delete")) {
    target.parentElement.parentElement.remove();
    showAlert("Registro eliminado", "danger");
  }
});
