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
        newLeito.classList = `patientCard`
        newLeito.innerHTML = createLeitoHtml(element)
        element.local == "box" ? boxList.appendChild(newLeito) : medList.appendChild(newLeito)
        newLeito.querySelectorAll("i").forEach(element => element.addEventListener('click', stats))
        // newLeito.querySelector('#btnInt').addEventListener('click', internar)
        // element.stats == "análise" ? newLeito.style.background = "#fffae4" : ""
        // element.stats == "aguardando alta" ? newLeito.style.background = "#f3edff" : ""
        // element.stats == "internado" ? newLeito.style.background = "#d6efd4" : ""
    });
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
    <div class="loadingBar">
    <div class="load animate" style="${changeLoad(params.stats)}"></div>
</div>
        <div class="headerCard">
            <div class="box">
                <span style="display: none;" id="id">${params._id}</span>
                <span>${params.id}</span>
            </div>
            <h4 id="name">${params.name}</h4>
        </div>
        <div class="cardData">
            <span>${params.plan}</span>
            <div class="status">
            <i class="fa-solid fa-circle ballStatus" id="${statsClass}"></i>
                <span>${params.stats ? params.stats : "Indefinido"}</span>
            </div>
            <input id="inputRoom" type="text" placeholder="-" value="${params.room ? params.room : ""}" disabled>
            <div class="dataButtons">
            <i class="fa-solid fa-magnifying-glass-chart" ${params.stats == "análise" || !params.stats && params.name ? `style="color: #a08af2"` : ""} id="análise"></i>
            <i class="fa-solid fa-file-waveform"   ${params.stats == "aguardando alta" ? `style="color: #a08af2"` : ""} id="aguardando alta"></i>
            <i class="fa-solid fa-bed-pulse"   ${params.stats == "internado" ? `style="color: #a08af2"` : ""} id="internado"></i>
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

    // const stats = e.target.id
    // console.log(e.target);
    const card = this.parentNode.parentNode.parentNode

    const stats = this.id
    const id = card.querySelector("#id").textContent
    const name = card.querySelector("#name").textContent
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