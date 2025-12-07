# 🌤️ WeatherApp - Modern Hava Durumu Uygulaması

Modern, responsive ve kullanıcı dostu bir hava durumu web uygulaması. OpenWeatherMap API ve Google Places API kullanılarak geliştirilmiştir.

![WeatherApp Preview](assets/preview.png)

## ✨ Özellikler

### Tasarım
- 🎨 Modern ve minimal tasarım
- 🌙 Koyu/Açık tema desteği
- 📱 Tam responsive (mobil, tablet, masaüstü)
- 🌈 Hava durumuna göre dinamik arka planlar
- ✨ Glassmorphism efektleri
- 🔄 Yumuşak animasyonlar

### Hava Durumu
- 🌡️ Anlık sıcaklık (°C/°F)
- 🤒 Hissedilen sıcaklık
- 💧 Nem oranı
- 💨 Rüzgar hızı ve yönü
- 🔽 Basınç
- 👁️ Görüş mesafesi
- 🌅 Gün doğumu/batımı
- ☀️ UV indeksi (tahminî)

### Tahminler
- ⏰ 24 saatlik tahmin
- 📅 5 günlük tahmin
- 📊 Sıcaklık grafikleri

### Ekstra
- 🏭 Hava kalitesi indeksi (AQI)
- 👕 Giysi önerileri
- 📍 Konum kaydetme
- 🔍 Google Places ile şehir arama
- 💾 LocalStorage ile tercih kaydetme

## 🚀 Kurulum

### 1. API Anahtarları

#### OpenWeatherMap API
1. [OpenWeatherMap](https://openweathermap.org/api) sitesine gidin
2. Ücretsiz hesap oluşturun
3. API Keys bölümünden anahtar alın
4. `js/api.js` dosyasını açın ve `OPENWEATHER_KEY` değerini güncelleyin:

```javascript
OPENWEATHER_KEY: 'YOUR_API_KEY_HERE',
```

#### Google Places API (Opsiyonel)
1. [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
2. Yeni proje oluşturun
3. Places API'yi etkinleştirin
4. API anahtarı oluşturun
5. `index.html` dosyasındaki Google API script'ini güncelleyin:

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_API_KEY&libraries=places&callback=initAutocomplete" async defer></script>
```

### 2. Çalıştırma

Uygulama statik dosyalardan oluştuğu için herhangi bir sunucuda çalıştırılabilir:

**VS Code Live Server ile:**
1. VS Code'da Live Server eklentisini yükleyin
2. `index.html` dosyasına sağ tıklayın
3. "Open with Live Server" seçin

**Python ile:**
```bash
cd weather-app
python -m http.server 8080
```

**Node.js ile:**
```bash
npx serve
```

Ardından tarayıcınızda `http://localhost:8080` adresine gidin.

## 📁 Dosya Yapısı

```
weather-app/
├── index.html          # Ana HTML dosyası
├── manifest.json       # PWA manifest
├── sw.js              # Service Worker
├── README.md          # Bu dosya
├── css/
│   ├── styles.css     # Ana stiller
│   ├── themes.css     # Tema stilleri
│   ├── animations.css # Animasyonlar
│   └── responsive.css # Responsive stiller
├── js/
│   ├── app.js         # Ana uygulama
│   ├── api.js         # API çağrıları
│   ├── weather.js     # Hava durumu işlemleri
│   ├── location.js    # Konum servisleri
│   ├── storage.js     # LocalStorage yönetimi
│   ├── ui.js          # UI güncellemeleri
│   └── charts.js      # Grafik çizimleri
└── assets/
    └── icons/         # PWA ikonları
```

## 🔧 Kullanılan Teknolojiler

- **HTML5** - Semantik yapı
- **CSS3** - Flexbox, Grid, Custom Properties
- **JavaScript (ES6+)** - Vanilla JS, Promises, Async/Await
- **Chart.js** - Grafik görselleştirme
- **Font Awesome** - İkon kütüphanesi
- **Google Fonts** - Inter & Outfit fontları
- **OpenWeatherMap API** - Hava durumu verileri
- **Google Places API** - Şehir arama (opsiyonel)

## 📱 Ekran Görüntüleri

### Açık Tema
- Ana dashboard
- Detaylı hava bilgileri
- Saatlik ve günlük tahminler

### Koyu Tema
- Gece modu
- Göz yorgunluğunu azaltır

## ⚙️ Ayarlar

Ayarlar sayfasından şunları değiştirebilirsiniz:

- **Tema**: Açık, Koyu, Otomatik
- **Sıcaklık Birimi**: Celsius (°C), Fahrenheit (°F)
- **Rüzgar Hızı Birimi**: km/s, mph, m/s
- **Kayıtlı Konumlar**: Ekleme ve silme

## 🌐 API Endpoints

### OpenWeatherMap
| Endpoint | Kullanım |
|----------|----------|
4. Branch'e push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

**Not**: Bu uygulama eğitim amaçlı geliştirilmiştir. Üretim ortamında kullanmadan önce API anahtarlarınızı güvenli bir şekilde sakladığınızdan emin olun.
