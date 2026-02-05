function handleLogin(e) {
  e.preventDefault();

  const email = document.querySelector("input[type='email']").value;
  const password = document.querySelector("input[type='password']").value;

  fetch("http://localhost:3000/user-api/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ email, password })
})
.then(res => res.json())
.then(data => {
  console.log(data);
})
.catch(err => {
  console.error(err);
  alert("Server error");
});
}
