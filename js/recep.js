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
    boxList.innerHTML = ""
    medList.innerHTML = ""
    e.forEach(element => {
        const newLeito = document.createElement("div")
        newLeito.classList = `leitos`
        newLeito.innerHTML = createLeitoHtml(element)
        element.local == "box" ? boxList.appendChild(newLeito) : medList.appendChild(newLeito)
        newLeito.querySelectorAll("i").forEach(element => element.addEventListener('click', stats))
        // newLeito.querySelector('#btnInt').addEventListener('click', internar)
        element.stats == "análise" ? newLeito.style.background = "#fffae4" : ""
        element.stats == "aguardando alta" ? newLeito.style.background = "#f3edff" : ""
        element.stats == "internado" ? newLeito.style.background = "#d6efd4" : ""
    });
}

function createLeitoHtml(e) {
    const html = `
        <span class="id" style="display: none;">${e._id}</span>
        <span class="leito">${e.id}</span>
        <span class="name">${e.name}</span>
        <span class="plan">${e.plan}</span>
        <i class="fa-solid fa-magnifying-glass-chart" ${e.stats == "análise" || !e.stats && e.name ? `style="color: #a08af2"` : ""} id="análise"></i>
        <i class="fa-solid fa-file-waveform"   ${e.stats == "aguardando alta" ? `style="color: #a08af2"` : ""} id="aguardando alta"></i>
        <i class="fa-solid fa-bed-pulse"   ${e.stats == "internado" ? `style="color: #a08af2"` : ""} id="internado"></i>

    `
    console.log(e.stats);
    return html
}

async function stats(e) {
    const resposte = window.confirm("Você tem certeza que deseja alterar o status do leito?")
    if (resposte == false) {
        return
    }

    const date = new Date()
    const hour = date.getHours()
    const minutes = date.getMinutes()
    const dateReq = `${String(hour).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`

    // const stats = e.target.id
    // console.log(e.target);

    const stats = this.id
    const id = this.parentNode.querySelectorAll(".id")[0].textContent
    const name = this.parentNode.querySelectorAll(".name")[0].textContent
    console.log(name);
    if (name.trim() == "") {
        console.log({ message: "Return - valor em branco." });
        return
    }
    const response = await fetch(`${UrlBack}/updateLeito`, {
        method: "POST",
        body: JSON.stringify({ token, id, name, stats, hour: dateReq }),
        headers: { "Content-Type": "application/json" }
    })
    if (response.status === 400) {
        window.location.href = "login.html"
    } else {

        getLeitos()
    }
}






// Chamadas


getLeitos()