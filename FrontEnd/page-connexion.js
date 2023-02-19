const loginForm = document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    login();
  });
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  localStorage.setItem(
    "authToken",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4"
  );
  const authToken = localStorage.getItem("authToken");

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      if (data.token) {
        console.log(data.token);
        localStorage.setItem("token", data.token);

        window.location.href = "./index.html";
      } else {
        alert("Les données saisies ne correspondent pas.");
      }
    })

    .catch(function (error) {
      console.log(error);
    });
}
