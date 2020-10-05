// I know it's insecure to put that here, but this key should be public
const API_KEY = 'bfcae88cf13f3f2c05b4b4ebd3835341';

function SendCityToSearch() {
    const mainContainer = document.getElementById('main');
    const cityToSearchInput = document.getElementById('myInput');
    const cityToSearch = cityToSearchInput.value;
    cityToSearchInput.value = ''
    const result = document.getElementById('result');

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityToSearch}&appid=${API_KEY}&lang=pt_br`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                result.innerHTML = `<h2>Não foi possível encontrar esta cidade/estado 😞</h2>`;
                throw new Error(`Ocorreu um erro`)
            }
        })
        .then(data => {
            const currentTime = data.dt;
            const isDay = (currentTime >= data.sys.sunrise && currentTime < data.sys.sunset);

            if (isDay) {
                mainContainer.classList.remove('dark');
                mainContainer.classList.add('light');
            } else {
                mainContainer.classList.add('dark');
                mainContainer.classList.remove('light');
            }

            const temperature = (data.main.temp - 273.15).toFixed(1);

            result.innerHTML = `
            <h2>Em ${cityToSearch} está de ${isDay ? 'dia! 🌞' : 'noite! 🌃'} </h2>

            <!-- Information -->
            <p>Sigla País: ${data.sys.country}</p>
            <p>Temperatura: ${temperature} °C  ${ temperature > 30 ? '🥵' : (temperature < 25 ? '🥶' : '😃') }</p>
            <p>Clima atual: ${data.weather[0].description}
                <img style="vertical-align: middle" src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}"/>
            </p>
            <p>Umidade: ${data.main.humidity} %</p>
            <p>Velocidade dos ventos: ${data.wind.speed} m/s</p>
            
            <!-- Google Maps -->
            <div class="map-link">
                <a target='_blank' href='https://www.google.com/maps/search/@${data.coord.lat},${data.coord.lon},15.25z'>Abrir em Google Maps</a>
            <div>`;
            console.log(data);
        })
        .catch(error => {
            console.error(error);
        });
}

function SearchByCity(cityName) {
    const cityToSearchInput = document.getElementById('myInput');
    cityToSearchInput.value = cityName;
    SendCityToSearch();
}