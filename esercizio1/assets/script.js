const nationalitySelect = document.querySelector('#nationality')

const step1Button = document.querySelector('#btn-1')
const step2Button = document.querySelector('#btn-2')
const step3Button = document.querySelector('#btn-3')

const step1Form = document.querySelector('#step1')
const step2Form = document.querySelector('#step2')
const step3Form = document.querySelector('#step3')

const roundedDivs = document.querySelectorAll('.rounded')
const stepDivs = document.querySelectorAll('.step')
const sendBtn = document.querySelectorAll('.send-btn')
const successDiv = document.querySelector('.success')

let firstName = document.querySelector('input[name=first-name]').value
let lastName = document.querySelector('input[name=last-name]').value
let idCard = document.querySelector('input[name=card-id]')
let cart = document.querySelector('input[name=cart]')
let address = document.querySelector('input[name=address]').value
let nazionality = nationalitySelect.value
let age = document.querySelector('input[name=age]').value
let generic = document.querySelector('input[name=generic]')

const urlStep1 = 'https://6393424311ed187986b052bb.mockapi.io/step1'
const urlStep2 = 'https://6393424311ed187986b052bb.mockapi.io/step2'
const urlStep3 = 'https://6393424311ed187986b052bb.mockapi.io/step3'

let stepsIndex = 0


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


// Funzione per convertire i file come Base64

const convertBase64 = async (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};


// Funzione per l'invio dei dati

async function fetchData(url, data) {

    if (stepsIndex < 2) {
        stepDivs[stepsIndex].classList.add('d-none')
        stepDivs[stepsIndex + 1].classList.remove('d-none')
    }
    roundedDivs[stepsIndex].classList.add('waiting')
    roundedDivs[stepsIndex].classList.remove('bordered')

    let progress = document.querySelector('.progress')
    progress.classList.remove('d-none')
    let info = document.querySelector('.info')
    if (info) info.classList.remove('d-none')

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

        if (stepsIndex < 2) {
            roundedDivs[stepsIndex + 1].classList.add('bordered')
            sendBtn[stepsIndex + 1].removeAttribute('disabled')
        } else {
            stepDivs[stepsIndex].classList.add('d-none')
            stepDivs[stepsIndex + 1].classList.remove('d-none')
        }

        progress.classList.add('d-none')
        info.classList.add('d-none')
        info.classList.remove('info')
        for (const d of roundedDivs) {
            if (d.classList.contains('waiting')) {
                d.classList.remove('waiting')
                d.classList.add('fill')
            }
        }
        stepsIndex++

    } catch (err) {
        console.error('Error:', err);
    }
}


// Invio Primo Step

step1Button.addEventListener('click', async (e) => {
    e.preventDefault()

    const fileConverted = await convertBase64(idCard.files[0]);

    const data = new FormData();

    data.append('first-name', firstName);
    data.append('last-name', lastName);
    data.append('id-card', fileConverted);

    console.log(data);
    fetchData(urlStep1, data)

})


// Invio Secondo Step

step2Button.addEventListener('click', async (e) => {
    e.preventDefault()

    const fileConverted = await convertBase64(cart.files[0]);

    const data = new FormData();

    data.append('cart', fileConverted);
    data.append('address', address);
    data.append('age', age);

    fetchData(urlStep2, data)

})


// Invio Terzo Step

step3Button.addEventListener('click', async (e) => {
    e.preventDefault()

    const fileConverted = await convertBase64(generic.files[0]);

    for (let c of step3Form.children) {
        c.setAttribute('disabled', true)
    }

    let progress = document.querySelector('.progress')
    progress.classList.remove('d-none')
    let info = document.querySelector('.info')
    if (info) info.classList.remove('d-none')


    const data = new FormData();

    data.append('generic', fileConverted);

    fetchData(urlStep3, data)
})

