// I know it's insecure to put that here, but this key should be public
const API_KEY = 'bfcae88cf13f3f2c05b4b4ebd3835341';

console.log('%cFerramenta para desenvolvedores, tenha cuidado com esta área caso não saiba o que estiver fazendo. Clique F12 para fechar esta aba.', 'color: red');


const mainContainer = document.getElementById('main');
const result = document.getElementById('result');
const cityToSearchInput = document.getElementById('myInput');

function loadFirstPage() {
    result.innerHTML = `
        <h2>Cidades pré-definidas</h2>
        <p class="pre-city" onclick="SearchByCity('Manaus')">Manaus</p>
        <p class="pre-city" onclick="SearchByCity('Recife')">Recife</p>
        <p class="pre-city" onclick="SearchByCity('São Paulo')">São Paulo</p>
        <p class="pre-city" onclick="SearchByCity('Florianópolis')">Florianópolis</p>
        <p class="pre-city" onclick="SearchByCity('Goiânia')">Goiânia</p>
        <div class="mylocation-button" onclick="SearchByLocation()">Utilizar a minha localização (GPS)</div>
    `;
}


function SendCityToSearch() {
    result.innerHTML = `Carregando dados.. `;

    // Validação de dados
    if (String(cityToSearchInput.value) === '')
        return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityToSearchInput.value}&appid=${API_KEY}&lang=pt_br`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                result.innerHTML = `<h2>Não foi possível encontrar esta cidade/estado 😞</h2>`;
                throw new Error(`Ocorreu um erro`)
            }
        })
        .then(data => {
            RenderInformationOnScreen(data, cityToSearchInput.value);
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        })
        .finally(() => {
            // Limpa dados da pesquisa
            cityToSearchInput.value = '';
        });
}

function SearchByCity(cityName) {
    const cityToSearchInput = document.getElementById('myInput');
    cityToSearchInput.value = cityName;
    SendCityToSearch();
}

function SearchByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            result.innerHTML = `Carregando dados.. `;

            const lat = position.coords.latitude,
                lon = position.coords.longitude;

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=pt_br`)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        result.innerHTML = `<h2>Não foi possível encontrar esta cidade/estado 😞</h2>`;
                        throw new Error(`Ocorreu um erro`)
                    }
                })
                .then(data => {
                    RenderInformationOnScreen(data, 'sua localização');
                    console.log(data);
                })
                .catch(error => {
                    console.error(error);
                });
        });
    } else {
        alert(`Geolocation indisponível, tente em outro dispositivo`);
        return;
    }
}

// Dados que vem da API da openweather
function RenderInformationOnScreen(data, locationToDisplay) {
    const currentTime = data.dt;
    const isDay = (currentTime >= data.sys.sunrise && currentTime < data.sys.sunset);

    mainContainer.classList.remove(isDay ? 'dark' : 'light');
    mainContainer.classList.add(isDay ? 'light' : 'dark');

    const temperature = (data.main.temp - 273.15).toFixed(1);
    const localTime = new Date(currentTime * 1000)
        .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    result.innerHTML = `
    <h2>Em ${locationToDisplay} está de ${isDay ? 'dia! 🌞' : 'noite! 🌃'} ${localTime} </h2>

    <!-- Information -->
    <p>Sigla País: ${data.sys.country}</p>
    <p>Temperatura: ${temperature} °C  ${temperature > 30 ? '🥵' : (temperature < 25 ? '🥶' : '😃')}</p>
    <p>Clima atual: ${data.weather[0].description}
        <img style="vertical-align: middle" src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}"/>
    </p>
    <p>Umidade: ${data.main.humidity} %</p>
    <p>Velocidade dos ventos: ${data.wind.speed} m/s</p>
    
    <!-- Google Maps -->
    <div class="map-link">
        <a target='_blank' href='https://www.google.com/maps/search/@${data.coord.lat},${data.coord.lon},15.25z'>Abrir em Google Maps</a>
    <div>`;
}