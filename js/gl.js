// const UrlBack = "https://teste-livid-tau.vercel.app"
const UrlBack = "http://localhost:3000"

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

    console.log(data.leitos);
    createLeitos(data)
}

function createLeitos(params) {
    list.innerHTML = ""
    params.leitos.forEach(element => {
        let newCard = document.createElement("div")
        newCard.classList = "patientCard"
        newCard.innerHTML = createCardHtml(element)
        list.appendChild(newCard)
        newCard.querySelector("#btnSubmit").addEventListener('click', sendRoom)
    });
}

function createCardHtml(params) {
    const html = `
        <div class="loadingBar">
            <div class="load animate" style="${changeLoad(params.stats)}"></div>
        </div>
        <div class="headerCard">
            <div class="box">
                <span style="display: none;" id="id">${params._id}</span>
                <span>${params.id.slice(1, 2)}</span>
            </div>
            <h4>${params.name}</h4>
        </div>
        <div class="cardData">
            <span>${params.plan}</span>
            <div class="status">
                <div class="ballStatus"></div>
                <span>${params.stats ? params.stats : "Indefinido"}</span>
            </div>
            <input id="inputRoom" type="text" placeholder="Quarto" value="${params.room ? params.room : ""}">
            <button id="btnSubmit">Enviar</button>
        </div>
    `
    return html;
}

function changeLoad(params) {
    if (params === "internado") {
        return 'width: 80%;';
    } else if (params === "análise") {
        return 'width: 40%; background: #e3ac59;';
    } else {
        return ''; // Padrão para outros casos
    }
}


async function sendRoom(e) {
    const id = this.parentNode.parentNode.querySelector("#id").textContent
    const name = this.parentNode.parentNode.querySelectorAll("h4")[0].textContent
    const room = this.parentNode.querySelector("#inputRoom").value


    const response = await fetch(`${UrlBack}/updateLeito`, {
        method: "POST",
        body: JSON.stringify({ token, id, name, room }),
        headers: { "Content-Type": "application/json" }
    })
    if (response.status == 400 || response.status === 500) {
        // window.location.href = "login.html"
        console.log("caiu aqui");
    } else {
        const data = await response.json()
        console.log(data);
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



getLeitos()