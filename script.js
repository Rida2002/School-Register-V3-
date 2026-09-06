const STORAGE_KEY = "school-register-students";
let students = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const form = document.getElementById("studentForm");
const body = document.getElementById("registerBody");
const search = document.getElementById("search");

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function render() {
  const query = search.value.trim().toLowerCase();
  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(query) ||
    s.className.toLowerCase().includes(query)
  );

  body.innerHTML = "";
  document.getElementById("empty").style.display = filtered.length ? "none" : "block";

  filtered.forEach(student => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(student.name)}</td>
      <td>${escapeHtml(student.className)}</td>
      <td><span class="badge ${student.status === "Present" ? "present" : "absent"}">${student.status}</span></td>
      <td><button class="delete" data-id="${student.id}">Remove</button></td>
    `;
    body.appendChild(row);
  });

  const total = students.length;
  const present = students.filter(s => s.status === "Present").length;
  document.getElementById("total").textContent = total;
  document.getElementById("present").textContent = present;
  document.getElementById("absent").textContent = total - present;
  document.getElementById("percentage").textContent =
    total ? Math.round((present / total) * 100) + "%" : "0%";
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[char]));
}

form.addEventListener("submit", event => {
  event.preventDefault();

  students.push({
    id: Date.now(),
    name: document.getElementById("name").value.trim(),
    className: document.getElementById("className").value.trim(),
    status: document.getElementById("status").value
  });

  save();
  form.reset();
  render();
});

body.addEventListener("click", event => {
  if (!event.target.matches(".delete")) return;
  const id = Number(event.target.dataset.id);
  students = students.filter(student => student.id !== id);
  save();
  render();
});

search.addEventListener("input", render);

document.getElementById("clearAll").addEventListener("click", () => {
  if (!students.length) return;
  if (confirm("Remove every student from the register?")) {
    students = [];
    save();
    render();
  }
});

render();
