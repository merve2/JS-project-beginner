import { StorageManager } from './storage.js';

export class WeatherService {
    constructor() {
        this.cityHistory = [];
        this.storageKey = 'sehirler';
        this.initializeElements();
        this.setupEventListeners();
        this.loadCityHistory();
    }
    
    initializeElements() {
        this.form = document.getElementById("havaForm");
        this.input = document.getElementById("sehir");
        this.result = document.getElementById("sonuc");
        this.historyList = document.getElementById("gecmisSehirListesi");
        this.clearBtn = document.getElementById("temizle");
    }
    
    setupEventListeners() {
        this.form.addEventListener("submit", (e) => this.getWeather(e));
        this.clearBtn.addEventListener("click", () => this.clearHistory());
    }
    
    async getWeather(e) {
        e.preventDefault();
        
        const city = this.input.value.trim();
        if (city === "") {
            this.result.textContent = "Lütfen bir şehir girin.";
            return;
        }
        
        try {
            const url = `https://wttr.in/${city}?format=j1`;
            const response = await fetch(url);
            const data = await response.json();
            
            const nearestArea = data.nearest_area[0].areaName[0].value.toLowerCase();
            if (nearestArea !== city.toLowerCase()) {
                this.result.textContent = "Lütfen Geçerli Bir Şehir Adı Girin.";
                return;
            }
            
            const current = data.current_condition[0];
            const temperature = current.temp_C;
            const description = current.weatherDesc[0].value;
            const windSpeed = current.windspeedKmph;
            
            this.result.innerHTML = `
                <h3>${city.toUpperCase()} Hava Durumu</h3>
                <p>Sıcaklık: ${temperature} °C</p>
                <p>Hava Durumu: ${description}</p>
                <p>Rüzgar Hızı: ${windSpeed} km/sa</p>
            `;
            
            this.input.value = "";
            this.addCityToHistory(city);
            
        } catch (error) {
            this.result.textContent = "Veri Alınamadı. Lütfen tekrar deneyin.";
            console.error("Hava durumu hatası:", error);
        }
    }
    
    addCityToHistory(city) {
        if (!this.cityHistory.includes(city)) {
            this.cityHistory.push(city);
            this.saveCityHistory();
            this.renderCityInHistory(city);
        }
    }
    
    renderCityInHistory(city) {
        const li = document.createElement("li");
        li.textContent = city;
        this.historyList.appendChild(li);
    }
    
    saveCityHistory() {
        StorageManager.save(this.storageKey, this.cityHistory);
    }
    
    loadCityHistory() {
        const savedCities = StorageManager.load(this.storageKey);
        if (savedCities) {
            this.cityHistory = savedCities;
            this.cityHistory.forEach(city => this.renderCityInHistory(city));
        }
    }
    
    clearHistory() {
        this.cityHistory = [];
        this.historyList.innerHTML = "";
        StorageManager.remove(this.storageKey);
        console.log("Şehir geçmişi temizlendi!");
    }
}

