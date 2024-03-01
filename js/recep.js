// Variáveis
const UrlBack = "https://teste-livid-tau.vercel.app"
// const UrlBack = "http://localhost:3000"
const token = localStorage.getItem("Token")
const boxList = document.querySelectorAll('.boxList')[0]
const medList = document.querySelectorAll('.medList')[0]


// Eventos 
if (!token) {
    window.location.href = "login.html"
}



// Funções
async function getLeitos() {
    const response = await fetch(`${UrlBack}/getLeitos`, {
        method: "POST",
        body: JSON.stringify({ token }),
        headers: { "Content-Type": "application/json" }
    })
    if (response.status === 401 || response.status === 500) {
        window.location.href = "login.html"
    }
    const data = await response.json()
    // console.log(data.leitos);
    loadLeitos(data.leitos)
}

function loadLeitos(e) {
    e.forEach(element => {
        const newLeito = document.createElement("div")
        newLeito.classList = "leitos"
        newLeito.innerHTML = createLeitoHtml(element)
        element.local == "box" ? boxList.appendChild(newLeito) : medList.appendChild(newLeito)
        newLeito.querySelector('#btnAlta').addEventListener('click', alta)
        element.alta == true ? newLeito.style.background = "#f0cece" : ""
    });
}

function createLeitoHtml(e) {
    const html = `
        <span class="id" style="display: none;">${e._id}</span>
        <span class="leito">${e.id}</span>
        <span class="name">${e.name}</span>
        <span class="plan">${e.plan}</span>
        <button id="btnAlta">${e.alta == false ? "Alta" : "C/Alta"}</button>
        <button id="btnInt">Internar</button>
    `
    return html
}

async function alta() {
    const leito = this.parentNode
    const id = leito.querySelectorAll(".id")[0].textContent
    const name = leito.querySelectorAll(".name")[0].textContent
    const alta = true
    if (name.trim() == "") {
        console.log({ message: "Return - valor em branco." });
        return
    }
    const response = await fetch(`${UrlBack}/updateLeito`, {
        method: "POST",
        body: JSON.stringify({ token, id, name, alta }),
        headers: { "Content-Type": "application/json" }
    })
    if (response.status === 400) {
        window.location.href = "login.html"
    } else {
        if (this.textContent == "C/Alta") {
            this.textContent = "Alta"
            leito.style.background = ""
        } else {
            this.textContent = "C/Alta"
            leito.style.background = "#f0cece"
        }
    }
}






// Chamadas


getLeitos()