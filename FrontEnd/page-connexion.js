const loginForm = document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    login();
  });
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

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
