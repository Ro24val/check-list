const categorias = {
  seguridad: ["Luces delanteras", "Luces traseras", "Freno de servicio", "Freno de mano", "Bocina", "Cinturones de seguridad", "Airbags", "Espejos retrovisores", "Luces de freno", "Claxon (bocina)"],
  motor: ["Nivel de aceite", "Nivel de refrigerante", "Nivel de freno", "Batería", "Correa de distribución", "Filtro de aire", "Fugas de líquidos", "Nivel de dirección hidráulica", "Suspensión", "Amortiguadores"],
  carroceria: ["Parabrisas", "Puertas y cerraduras", "Ventanas", "Aire acondicionado", "Filtro de cabina", "Escape/silenciador", "Tapón de combustible", "Estado de asientos", "Estado de carrocería", "Dirección asistida"],
  documentacion: ["Herramientas de emergencia", "Extintor", "Documentación", "Señales en tablero", "Kilometraje", "Próxima revisión técnica"]
};

const checklistDiv = document.getElementById("checklist");

function cambiarCategoria() {
  checklistDiv.innerHTML = "";
  const cat = document.getElementById("categoria").value;
  if (!categorias[cat]) return;

  categorias[cat].forEach((item, idx) => {
    const cont = document.createElement("div");
    cont.className = "checklist-item";
    cont.innerHTML = `
      <label>${item}</label>
      <select id="estado${idx}">
        <option value="ok">✅ OK</option>
        <option value="mantenimiento">⚠️ Requiere Mantenimiento</option>
        <option value="urgente">❌ Reemplazo Urgente</option>
      </select>
      <textarea id="comentario${idx}" class="comentario" placeholder="Comentario obligatorio si no está OK"></textarea>
      <input type="file" id="archivo${idx}" class="evidencia" accept="image/*,video/*">
    `;
    checklistDiv.appendChild(cont);

    cont.querySelector(`#estado${idx}`).addEventListener("change", e => {
      const val = e.target.value;
      const show = val !== "ok";
      cont.querySelector(".comentario").style.display = show ? "block" : "none";
      cont.querySelector(".evidencia").style.display = show ? "block" : "none";
    });
  });
}

function generarReporte() {
  const conductor = document.getElementById("conductor").value;
  const matricula = document.getElementById("matricula").value;
  const fecha = document.getElementById("fechahora").value;

  let resultado = `<h3>Reporte</h3><p><b>Conductor:</b> ${conductor}<br><b>Matrícula:</b> ${matricula}<br><b>Fecha:</b> ${fecha}</p><ul>`;

  const items = checklistDiv.querySelectorAll(".checklist-item");
  items.forEach((item, i) => {
    const label = item.querySelector("label").textContent;
    const estado = item.querySelector("select").value;
    const comentario = item.querySelector("textarea").value.trim();

    if (estado !== "ok" && comentario === "") {
      alert(`Debes ingresar comentario para "${label}"`);
      return;
    }

    resultado += `<li><b>${label}</b>: ${estado.toUpperCase()}${estado !== "ok" ? `<br><em>Comentario:</em> ${comentario}` : ""}</li>`;
  });

  resultado += `</ul>`;
  document.getElementById("resultado").innerHTML = resultado;
  localStorage.setItem("ultimoReporte", resultado);
}

function guardarComoPDF() {
  if (!document.getElementById("resultado").innerHTML.trim()) {
    alert("Genera el reporte primero.");
    return;
  }
  window.print();
}

function exportarExcel() {
  const ws = XLSX.utils.table_to_sheet(document.getElementById("resultado"));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Checklist");
  XLSX.writeFile(wb, "checklist.xlsx");
}

const canvas = document.getElementById("firma");
const ctx = canvas.getContext("2d");
let dibujando = false;
canvas.addEventListener("mousedown", e => {
  dibujando = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});
canvas.addEventListener("mousemove", e => {
  if (dibujando) {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
});
canvas.addEventListener("mouseup", () => dibujando = false);
function limpiarFirma() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

document.getElementById("fechahora").value = new Date().toLocaleString();
