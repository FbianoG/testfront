// Variáveis
const UrlBack = "https://teste-livid-tau.vercel.app"
// const UrlBack = "http://localhost:3000"
const token = localStorage.getItem("Token")
const list = document.querySelectorAll('.patientsList')[0]
const listMed = document.querySelectorAll('.patientsList')[1]


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
    loadPatients(data.leitos)
}

function loadPatients(e) {
    list.innerHTML = ""
    listMed.innerHTML = ""
    e.forEach(element => {
        const newCardPatient = document.createElement("div")
        newCardPatient.classList = "patientCard"
        newCardPatient.innerHTML = cardPatientHTML(element)
        element.local == "box" ? list.appendChild(newCardPatient) : listMed.appendChild(newCardPatient)
        if (element.name.trim() === "") {
            newCardPatient.style.filter = "grayscale(100)"
            newCardPatient.style.opacity = "0.4"
        }
        newCardPatient.querySelector("#name").addEventListener('keyup', activeCard)
        newCardPatient.querySelector("#btnClear").addEventListener('click', clear)
        newCardPatient.querySelector("#btnSave").addEventListener('click', save)
    })
}

function cardPatientHTML(e) {
    const html = `
    <input type="text" name="id" style="display: none;" value="${e._id}">
    <input type="text" name="name" id="name" placeholder="Paciente" value="${e.name}">
    <div class="cardData">
        <input type="text" name="plan" placeholder="Plano" value="${e.plan}">
        <div id="checklist">
            <input value="1" name="nota" type="checkbox" id="${e._id}01" ${e.nota == true ? "checked" : ""}>
            <label for="${e._id}01">Nota</label>
            <input value="2" name="conc" type="checkbox" id="${e._id}02" ${e.conc == true ? "checked" : ""}>
            <label for="${e._id}02">Conciliação</label>
            <input value="3" name="r" type="checkbox" id="${e._id}03">
            <label for="${e._id}03">coffe</label>
            <input value="4" name="int" type="checkbox" id="${e._id}04" ${e.int == true ? "checked" : ""}>
            <label for="${e._id}04">Internação</label>
        </div>
    </div>
    <textarea name="obs" spellcheck="false">${e.obs}</textarea>
    <div class="cardButtons">
        <button id="btnSave">Salvar</button>
        <button id="btnClear">Limpar</button>
    </div>
    <div class="marker ${e.alta == true ? "pulse" : ""}">${e.id}</div>
    `
    return html
}

function activeCard(e) {
    const card = e.target.parentNode
    if (e.target.value.trim() === "") {
        card.style.filter = "grayscale(100)"
        card.style.opacity = "0.4"
        return
    }
    card.style.filter = "grayscale(0)"
    card.style.opacity = "1"
}

async function save(e) {
    const card = e.target.parentNode.parentNode
    const id = card.querySelector("[name='id']").value
    const name = card.querySelector("[name='name']").value
    const plan = card.querySelector("[name='plan']").value
    const obs = card.querySelector("[name='obs']").value
    const nota = card.querySelector("[name='nota']").checked
    const conc = card.querySelector("[name='conc']").checked
    const int = card.querySelector("[name='int']").checked
    const alta = name == "" ? false : undefined

    const response = await fetch(`${UrlBack}/updateLeito`, {
        method: "POST",
        body: JSON.stringify({ token, id, name, plan, obs, nota, conc, int, alta }),
        headers: { "Content-Type": "application/json" }
    })
    if (response.status == 201) {
        showPopup()
    }
    const data = await response.json()
    console.log(response.status);
}

function clear(e) {
    const card = e.target.parentNode.parentNode
    card.querySelector("#name").value = ""
    card.querySelector("[name='plan']").value = ""
    card.querySelector("[name='obs']").value = ""
    card.querySelectorAll("[type='checkbox']").forEach(element => {
        element.checked = false;
    })
    card.style.filter = "grayscale(100)"
    card.style.opacity = "0.4"
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

// Chamadas
getLeitos()