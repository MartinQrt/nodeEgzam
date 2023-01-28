const loginForm = document.getElementById("register-form");
const registerButton = document.getElementById("register-button");

registerButton.addEventListener("click", (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  const passwordRepeat = loginForm.passwordRepeat.value;
  const fullName = loginForm.fullName.value;

  if (passwordRepeat !== password) {
    alert("Password do not match");
    return;
  }

  fetch("http://;pcalhost:8080/register", {
    method: "POST",
    cors: true,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, fullName }),
  })
    .then((response) => {
      if (!response.ok) {
        response.text().then((result) => alert(result));
        return;
      }

      response.json().then(() => (window.location.href = "login.html"));
    })
    .catch((err) => {
      alert(err);
    });
});
