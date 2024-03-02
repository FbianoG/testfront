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
    let statsClass
    if (e.stats == "análise") {
        statsClass = "an"
    } else if (e.stats == "aguardando alta") {
        statsClass = "al"
    } else if (e.stats == "internado") {
        statsClass = "in"
    }
    const html = `
    
    <div class="cardHeader">
        <div class="headerData">
            <input type="text" name="id" style="display: none;" value="${e._id}">
            <input type="text" name="name" id="name" placeholder="Paciente" value="${e.name}">
            <input type="text" name="plan" id="plan" placeholder="Plano" value="${e.plan}">
            <input type="text" name="age" id="age" placeholder="Idade" value="${e.age}">
        </div>
        <span class="box">${e.id}</span>
    </div>
    <div class="cardData">
        <div id="checklist">
            <input value="1" name="nota" type="checkbox" id="${e._id}01" ${e.nota == true ? "checked" : ""}>
            <label for="${e._id}01">Nota</label>

            <input value="2" name="conc" type="checkbox" id="${e._id}02" ${e.conc == true ? "checked" : ""}>
            <label for="${e._id}02">Conciliação</label>
            
            <input value="3" name="pres" type="checkbox" id="${e._id}03" ${e.pres == true ? "checked" : ""}>
            <label for="${e._id}03">Prescrição</label>


            <input value="4" name="exa" type="checkbox" id="${e._id}04" ${e.exa == true ? "checked" : ""}>
            <label for="${e._id}04">Exames</label>

            <input value="5" name="int" type="checkbox" id="${e._id}05" ${e.int == true ? "checked" : ""}>
            <label for="${e._id}05">Internação</label>
        </div>
        <textarea name="obs" spellcheck="false">${e.obs}</textarea>
    </div>
    <div class="cardButtons">
        <i class="fa-solid fa-floppy-disk" id="btnSave"></i>
        <i class="fa-solid fa-broom" id="btnClear"></i>
        <div class="status">
        <i class="fa-solid fa-circle statusMark" id="${statsClass}"></i>
            <span class="stausText" id="${statsClass}">${e.stats ? e.stats : "Indefinido"}</span>
            <span class="hour"> ${e.hour && e.stats == "aguardando alta" ? e.hour + "h" : "-"}</span>
        </div>
    </div>
    
    `
    return html
}

function activeCard(e) {
    const card = e.target.parentNode.parentNode.parentNode
    console.log(card);
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
    const age = card.querySelector("[name='age']").value
    const plan = card.querySelector("[name='plan']").value
    const obs = card.querySelector("[name='obs']").value
    const nota = card.querySelector("[name='nota']").checked
    const conc = card.querySelector("[name='conc']").checked
    const pres = card.querySelector("[name='pres']").checked
    const exa = card.querySelector("[name='exa']").checked
    const int = card.querySelector("[name='int']").checked
    // console.log(name);

    const response = await fetch(`${UrlBack}/updateLeito`, {
        method: "POST",
        body: JSON.stringify({ token, id, name, age, plan, obs, nota, conc, pres, exa, int, }),
        headers: { "Content-Type": "application/json" }
    })
    if (response.status == 201) {
        showPopup()
    }
    const data = await response.json()
    console.log(response.status);
    getLeitos()
}

function clear(e) {
    const alertResposta = window.confirm("Tem certeza que deseja limpar o leito?")
    if (alertResposta === false) {
        return
    }

    const card = e.target.parentNode.parentNode
    card.querySelector("#name").value = ""
    card.querySelector("#age").value = ""
    card.querySelector("[name='plan']").value = ""
    card.querySelector("[name='obs']").value = ""
    card.querySelectorAll(".hour")[0].textContent = "-"
    card.querySelectorAll("[type='checkbox']").forEach(element => {
        element.checked = false;
    })
    save(e)
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