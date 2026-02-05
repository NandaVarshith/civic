function handleRegister(e) {
  e.preventDefault();

  const name = document.querySelector("input[type='text']").value;
  const email = document.querySelector("input[type='email']").value;
  const password = document.querySelector("input[type='password']").value;
  const role = document.querySelector("select").value;

  fetch("http://localhost:3000/user-api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password, role })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message || "Registered successfully");
    window.location.href = "login.html";
  })
  .catch(() => alert("Server error"));
}
