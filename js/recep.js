// Variáveis
const UrlBack = "https://teste-livid-tau.vercel.app"
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
    console.log(data.leitos);
    loadLeitos(data.leitos)
}

function loadLeitos(e) {
    e.forEach(element => {
        const newLeito = document.createElement("div")
        newLeito.classList = "leitos"
        newLeito.innerHTML = createLeitoHtml(element)
        element.local == "box" ? boxList.appendChild(newLeito) : medList.appendChild(newLeito)
    });
}

function createLeitoHtml(e) {
    const html = `
        <span class="id" style="display: none;">${e._id}</span>
        <span class="leito">${e.id}</span>
        <span class="name">${e.name}</span>
        <span class="plan">${e.plan}</span>
        <button>Alta</button>
        <button>Internar</button>
    `
    return html
}



// Chamadas


getLeitos()