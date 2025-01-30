const form = document.getElementById("form");
const main = document.getElementById("main");
const apiUrl = "http://localhost:3000/users";
const loader = document.getElementById("loader");

function showLoader() {
  loader.style.display = "block";
}

function hideLoader() {
  loader.style.display = "none";
}

function fetchUsers() {
  showLoader();
  fetch(apiUrl)
    .then((res) => res.json())
    .then((users) => {
      main.innerHTML = "";
      users.forEach((user) => {
        main.innerHTML += `
          <div class="user" data-id="${user.id}">
            <ul>
              <li><span>Name <i class="fa-solid fa-user"></i></span><p>${user.name}</p></li>
              <li><span>Email <i class="fa-solid fa-envelope"></i></span><p>${user.email}</p></li>
              <li><span>Age <i class="fa-solid fa-cake-candles"></i></span><p>${user.age}</p></li>
            </ul>
            <div class="btns">
              <button id="edit" onclick="editUser(${user.id}, '${user.name}', '${user.email}', '${user.age}')">Edit</button>
              <button id="delete" onclick="deleteUser(${user.id})">Delete</button>
            </div>
          </div>
        `;
      });
    })
    .catch((err) => console.error("Error fetching users:", err))
    .finally(() => hideLoader());
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  showLoader();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const age = document.getElementById("age").value;

  const userId = document.getElementById("user-id")?.value;

  const method = userId ? "PUT" : "POST";
  const url = userId ? `${apiUrl}/${userId}` : apiUrl;

  fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, age })
  })
    .then((res) => res.json())
    .then(() => {
      fetchUsers();
      form.reset();
      document.getElementById("user-id")?.remove();
    })
    .catch((err) => console.error("Error saving user:", err))
    .finally(() => hideLoader());
});

function deleteUser(id) {
  showLoader();
  fetch(`${apiUrl}/${id}`, { method: "DELETE" })
    .then(() => fetchUsers())
    .catch((err) => console.error("Error deleting user:", err))
    .finally(() => hideLoader());
}

function editUser(id, name, email, age) {
  document.getElementById("name").value = name;
  document.getElementById("email").value = email;
  document.getElementById("age").value = age;

  let userIdInput = document.getElementById("user-id");
  if (!userIdInput) {
    userIdInput = document.createElement("input");
    userIdInput.type = "hidden";
    userIdInput.id = "user-id";
    form.appendChild(userIdInput);
  }
  userIdInput.value = id;
}

fetchUsers();

const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});
