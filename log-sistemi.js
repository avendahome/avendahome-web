
// log-sistemi.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, increment, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyD8jhYx0u-Soht0BUDKVWnjcEzLwwq97sE",
    authDomain: "avendahome-70281.firebaseapp.com",
    databaseURL: "https://avendahome-70281-default-rtdb.firebaseio.com",
    projectId: "avendahome-70281",
    storageBucket: "avendahome-70281.firebasestorage.app",
    messagingSenderId: "1070192915746",
    appId: "1:1070192915746:web:31b7e4e1956991366b617b",
    measurementId: "G-TGSD1Q45ZH"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function getFullLog() {
    let geoData = {};
    
    try {
        const response = await fetch('https://ipapi.co/json/');
        geoData = await response.json();
    } catch (e) {
        console.log("IP bilgisi alınamadı.");
    }

    const visitorLog = {
        timestamp: new Date().toISOString(),
        yerel_saat: new Date().toLocaleString('tr-TR'),
        geldigi_yer: document.referrer || "Direkt giriş",
        su_an_ki_sayfa: window.location.href,
        ip: geoData.ip || "Bilinmiyor",
        sehir: geoData.city || "Bilinmiyor",
        ulke: geoData.country_name || "Bilinmiyor",
        iss: geoData.org || "Bilinmiyor",
        tarayici: navigator.userAgent,
        isletim_sistemi: navigator.platform,
        ekran_boyutu: `${window.screen.width}x${window.screen.height}`
    };

    // 1. Detaylı Log
    const logRef = ref(db, 'detayli_loglar');
    push(logRef, visitorLog);

    // 2. Şehir ve Toplam Sayaç
    if (!localStorage.getItem('istatistik_eklendi')) {
        const statsRef = ref(db, 'istatistikler');
        const sehir = geoData.city || "Bilinmiyor";
        const temizSehirAdi = sehir.replace(/\./g, '_');

        update(statsRef, {
            "toplam_tekil_ziyaretci": increment(1),
            [`sehirler/${temizSehirAdi}`]: increment(1)
        }).then(() => {
            localStorage.setItem('istatistik_eklendi', 'true');
        });
    }
}

getFullLog();
