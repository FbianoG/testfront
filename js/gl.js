const UrlBack = "https://teste-livid-tau.vercel.app"
// const UrlBack = "http://localhost:3000"

let intervalId
const token = localStorage.getItem("Token")
const list = document.querySelectorAll('.list')[0]


if (token.trim() == "") {
    window.location.href = "login.html"
}




// Funções 
async function getLeitos() {
    const response = await fetch(`${UrlBack}/getLeitos`, {
        method: "POST",
        body: JSON.stringify({ token }),
        headers: { "Content-Type": "application/json" }
    })
    if (response.status === 400 || response.status === 500) {
        window.location.href = "login.html"
    }

    const data = await response.json()
    createLeitos(data)
    count += 1
}

function createLeitos(params) {
    list.innerHTML = ""
    params.leitos.forEach((element, index) => {
        if (element.name.trim() == "") {
            return
        }
        let newCard = document.createElement("div")
        newCard.classList = "patientCard"
        newCard.innerHTML = createCardHtml(element, index)
        list.appendChild(newCard)
        newCard.querySelector("#btnSubmit").addEventListener('click', sendRoom)
        newCard.querySelector("#inputRoom").addEventListener('focus', () => clearInterval(intervalId))
        newCard.querySelector("#inputRoom").addEventListener('blur', atualizePage)
    })
}

function createCardHtml(params, index) {
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
            <div class="load animate" style="${changeLoad(params.room)}"></div>
        </div>
        <div class="headerCard">
            <div class="box">
                <span style="display: none;" id="id">${params._id}</span>
                <span>${index + 1}</span>
            </div>
            <h4>${params.name}</h4>
        </div>
        <div class="cardData">
            <span>${params.plan}</span>
            <div class="status">
            <i class="fa-solid fa-circle ballStatus" id="${statsClass}"></i>
                <span>${params.stats ? params.stats : "Indefinido"}</span>
            </div>

            <input id="inputRoom" type="text" placeholder="Quarto" value="${params.room ? params.room : ""}">
            
            <div class="dataButtons">
            <i class="fa-solid fa-floppy-disk" id="btnSubmit"></i>
            </div>
        </div>
        <span class="ticket">${changeLocal(params.local)}</span>
    `
    return html;
}

function changeLocal(params) {
    if (params === "box" || params === "med") {
        return "ad"
    } else if (params === "ped") {
        return "ped"
    } else {
        return "GO"
    }
}

function changeLoad(params) {
    if (params == "" || params == null) {
        return 'background: #e79b9b;';
    }
}

async function sendRoom(e) {
    const id = this.parentNode.parentNode.parentNode.querySelector("#id").textContent
    const name = this.parentNode.parentNode.parentNode.querySelectorAll("h4")[0].textContent
    const room = this.parentNode.parentNode.querySelector("#inputRoom").value.trim()

    const response = await fetch(`${UrlBack}/updateLeito`, {
        method: "POST",
        body: JSON.stringify({ token, id, name, room }),
        headers: { "Content-Type": "application/json" }
    })
    if (response.status == 400 || response.status === 500) {
        window.location.href = "login.html"
    } else {
        // const data = await response.json()
        getLeitos()
        showPopup()
    }
}

function showPopup() {
    const popup = document.querySelectorAll('.popup')[0]
    popup
    popup.style.bottom = "20px"
    popup.style.opacity = "1"
    setTimeout(() => {
        popup.style.bottom = "-150px"
        popup.style.opacity = "0"
    }, 2500);
}

let count = 0

function atualizePage() { // Atualizar a página a cada 60seg
    intervalId = setInterval(getLeitos, 60000);
}




getLeitos()

atualizePage();

