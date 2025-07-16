import { TaskManager } from './modules/taskManager.js';
import { WeatherService } from './modules/weatherService.js';
import { StorageManager } from './modules/storage.js';

class App {
    constructor() {
        console.log("🚀 Uygulama başlatılıyor...");

        // Modülleri başlat
        this.taskManager = new TaskManager();
        this.weatherService = new WeatherService();

        console.log("✅ Uygulama başarıyla başlatıldı!");
        console.log("📝 Görev Yöneticisi:", this.taskManager);
        console.log("🌤️ Hava Durumu Servisi:", this.weatherService);
    }
}

// Sayfa yüklendiğinde uygulamayı başlat
document.addEventListener("DOMContentLoaded", () => {
    const app = new App();

    // Hava durumu formu işlemleri
    const havaForm = document.getElementById("havaForm");
    const sehirInput = document.getElementById("sehir");
    const sonucDiv = document.getElementById("sonuc");

    havaForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const sehir = sehirInput.value.trim();
        if (sehir === "") return;

        const veri = await app.weatherService.getWeather(sehir);
        if (veri) {
            sonucDiv.innerHTML = `
                <p><strong>${veri.name}</strong> için hava durumu: ${veri.weather[0].description}</p>
                <p>Sıcaklık: ${veri.main.temp} °C</p>
            `;
        } else {
            sonucDiv.innerHTML = "<p>Şehir bulunamadı.</p>";
        }

        sehirInput.value = "";
    });
});
