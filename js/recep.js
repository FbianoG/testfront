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
    loadLeitos(data.leitos)
}

function loadLeitos(e) {
    boxList.innerHTML = ""
    medList.innerHTML = ""
    e.forEach(element => {
        const newLeito = document.createElement("div")
        newLeito.classList = `patientCard`
        newLeito.innerHTML = createLeitoHtml(element)
        element.local == "box" ? boxList.appendChild(newLeito) : medList.appendChild(newLeito)
        newLeito.querySelectorAll("button").forEach(element => element.addEventListener('click', stats))
        element.name.trim() == "" ? newLeito.style.opacity = "0.5": ""
    })
}

function createLeitoHtml(params) {
    let statsClass
    if (params.stats == "análise") {
        statsClass = "an"
    } else if (params.stats == "aguardando alta") {
        statsClass = "al"
    } else if (params.stats == "internado") {
        statsClass = "in"
    }
    const html = `  
        <span class="leito" id="id" style="display: none;">${params._id}</span>
        <span class="leito">${params.id}</span>
        <div class="data">
            <span class="nome" id="name">${params.name}</span>
            <br>
            <span class="idade">${params.age}</span>
        </div>
        <span class="plano">${params.plan}</span>
        <span class="status ${params.stats}">${params.stats ? params.stats : "ind"}</span>
        <span class="quarto">${params.room ? params.room : "-"}</span>
        <div class="more">
            <span></span>
            <span></span>
            <span></span>
            <div class="moreData">
                <button id="análise">Análise</button>
                <button  id="aguardando alta">Sol. Alta</button>
                <button  id="internado">Internar</button>
            </div>
        </div>
    `
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
    const card = this.parentNode.parentNode.parentNode
    const stats = this.id
    const id = card.querySelector("#id").textContent
    const name = card.querySelector("#name").textContent
    console.log(stats);
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

function changeLoad(params) {
    if (params == "" || params == null) {
        return 'width: 0%;';
    } else if (params == "análise") {
        return 'width: 30%; background: #efb850;';
        
    } else if (params == "aguardando alta") {
        return 'width: 65%; background: #9acde2;';
    } else if (params == "internado") {
        return 'width: 100%;';
    }
}


// Chamadas
getLeitos()