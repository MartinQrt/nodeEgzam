const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-button");

loginButton.addEventListener("click", (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  fetch("http://localhost:8080/login", {
    method: "POST",
    cors: true,
    headers: {
      "Content-Type": "aplication/json",
    },
    body: JSON.stringify({ email, password }),
  }).then((response) => {
    if (!response.ok) {
      response.text().then((result) => alert(result));
      return;
    }

    response.json()
        .then(result => {
            localStorage.setItem('accessToken', result.accessToken);
            window.location.href=""
        })
  });
});
