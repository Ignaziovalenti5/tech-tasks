import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'
import { getStorage, getDownloadURL, uploadBytesResumable, ref } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js'

const nationalitySelect = document.querySelector('#nationality')

const step1Button = document.querySelector('#btn-1')
const step2Button = document.querySelector('#btn-2')
const step3Button = document.querySelector('#btn-3')

const step3Form = document.querySelector('#step3')

const roundedDivs = document.querySelectorAll('.rounded')
const stepDivs = document.querySelectorAll('.step')
const sendBtn = document.querySelectorAll('.send-btn')

const firstName = document.querySelector('input[name=first-name]').value
const lastName = document.querySelector('input[name=last-name]').value
const idCard = document.querySelector('input[name=card-id]')
const cart = document.querySelector('input[name=cart]')
const address = document.querySelector('input[name=address]').value
const nationality = nationalitySelect.value
const age = document.querySelector('input[name=age]').value
const generic = document.querySelector('input[name=generic]')
const progressBar = document.querySelector('.progress')
const info = document.querySelectorAll('.info')

const prog = document.querySelector('#prog')

const urlStep1 = 'https://6393424311ed187986b052bb.mockapi.io/step1'
const urlStep2 = 'https://6393424311ed187986b052bb.mockapi.io/step2'
const urlStep3 = 'https://6393424311ed187986b052bb.mockapi.io/step3'

let stepsIndex = 0

const firebaseApp = initializeApp({
    apiKey: "AIzaSyBVCC6nMk_kxn7U3nQ1_o87yadzTv72FVA",
    authDomain: "task-aqua.firebaseapp.com",
    projectId: "task-aqua",
    storageBucket: "task-aqua.appspot.com",
    messagingSenderId: "843300568626",
    appId: "1:843300568626:web:364c204f888d9ecb76462b",
    measurementId: "G-CT9HYC8LMK"
})

const storage = getStorage(firebaseApp)


// API per popolare la select della nazionalità

fetch("https://restcountries.com/v3.1/all")
    .then(res => res.json())
    .then(res => {

        let nations = []

        for (let n of res) {
            nations.push(n.name.common)
        }

        nations.sort()

        for (let n of nations) {
            let opt = document.createElement('option')
            opt.innerText = n
            opt.value = n
            nationalitySelect.appendChild(opt)
        }
    })



// Funzione per il caricamento dei files su firebase

const uploadFile = (file) => {
    if (!file) return

    const storageRef = ref(storage, `files/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on("state_changed", (snapshot) => {
        const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        const progressSpan = document.querySelector('.progress-span')
        prog.innerText = progress
        progressSpan.style.width = `${progress}%`

    }, (err) => console.err(err),
        () => {
            getDownloadURL(uploadTask.snapshot.ref)
                .then(url => {
                    console.log('caricamento effettuato!', url);

                    if (stepsIndex < 2) {
                        roundedDivs[stepsIndex + 1].classList.add('bordered')
                        sendBtn[stepsIndex + 1].removeAttribute('disabled')
                    } else {
                        stepDivs[stepsIndex].classList.add('d-none')
                        stepDivs[stepsIndex + 1].classList.remove('d-none')
                    }

                    progressBar.classList.add('d-none')
                    info[stepsIndex].classList.add('d-none')
                    // info.classList.remove('info')

                    for (const d of roundedDivs) {
                        if (d.classList.contains('waiting')) {
                            d.classList.remove('waiting')
                            d.classList.add('fill')
                        }
                    }
                    prog.innerText = 0
                    stepsIndex++
                }
                )
        })
}

// Funzione per l'invio dei dati

async function fetchData(url, data, file) {

    if (!file) return

    if (stepsIndex < 2) {
        stepDivs[stepsIndex].classList.add('d-none')
        stepDivs[stepsIndex + 1].classList.remove('d-none')
    }
    roundedDivs[stepsIndex].classList.add('waiting')
    roundedDivs[stepsIndex].classList.remove('bordered')

    let progress = document.querySelector('.progress')
    progress.classList.remove('d-none')

    info[stepsIndex].classList.remove('d-none')

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const result = await response.json()
        console.log('Success:', response);
        console.log('Success:', result);

        uploadFile(file)

    } catch (err) {
        console.error('Error:', err);
    }
}


// Invio Primo Step

step1Button.addEventListener('click', async (e) => {
    e.preventDefault()

    const data = new FormData();

    data.append('first-name', firstName);
    data.append('last-name', lastName);

    fetchData(urlStep1, data, idCard.files[0])

})


// Invio Secondo Step

step2Button.addEventListener('click', async (e) => {
    e.preventDefault()

    const data = new FormData();

    data.append('address', address);
    data.append('nationality', nationality);
    data.append('age', age);

    fetchData(urlStep2, data, cart.files[0])

})


// Invio Terzo Step

step3Button.addEventListener('click', async (e) => {
    e.preventDefault()

    for (let c of step3Form.children) {
        c.setAttribute('disabled', true)
    }

    progressBar.classList.remove('d-none')
    
    const data = new FormData();

    fetchData(urlStep3, data, generic.files[0])
})

