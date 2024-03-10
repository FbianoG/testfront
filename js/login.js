// Variáveis
const UrlBack = "https://teste-livid-tau.vercel.app"
// const UrlBack = "http://localhost:3000"
const btnSubmit = document.querySelector('#btnSubmit')
let count = 0


// Eventos
document.querySelectorAll('form')[0].addEventListener('submit', login)


// Funções
async function login(e) {
    e.preventDefault()

    btnSubmit.setAttribute("disabled", "true")
    btnSubmit.style.opacity = "0.3"
    btnSubmit.style.cursor = "default"

    const username = document.querySelectorAll('[name="username"]')[0].value
    const password = document.querySelectorAll('[name="password"]')[0].value

    const response = await fetch(`${UrlBack}/login`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" }
    })

    if (response.status === 400 || response.status === 401 ) {
        btnSubmit.removeAttribute("disabled")
        btnSubmit.style.opacity = '';
        btnSubmit.style.cursor = '';
        incorrectLogin()
    } else if (response.status === 200) {
        const data = await response.json()
        localStorage.setItem("Token", data.token)
        btnSubmit.removeAttribute("disabled")
        if (data.roles == "med") {
            window.location.href = "med.html"
        } else if (data.roles == "recep") {
            window.location.href = "recep.html"
        } else if (data.roles == "adm") {
            window.location.href = "admin.html"
        }
    } else if (response.status === 500) {
        window.location.href = "error.html"
    }
}

function incorrectLogin(e) {
    count += 1
    document.querySelector('#msgError').style.display = "block"
    document.querySelector('#msgError').textContent = `Usuáro ou Senha inválidos. (0${count})`
    document.querySelectorAll('[name="username"]')[0].style.border = "1px solid red"
    document.querySelectorAll('[name="username"]')[0].style.outline = "none"
    document.querySelectorAll('[name="password"]')[0].style.border = "1px solid red"
    document.querySelectorAll('[name="password"]')[0].style.outline = "none"
}


// Chamadas
localStorage.clear()
