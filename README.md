# AYBÜ — Akademik Teşvik ve Ödül Sistemi

Ankara Yıldırım Beyazıt Üniversitesi akademik ödül başvurularının çevrim içi alınması, puanlanması ve komisyon tarafından değerlendirilmesi için geliştirilmiş web uygulaması.

## Özellikler

- **Akademisyen paneli:** Kategori bazlı başvuru oluşturma, otomatik puan hesaplama, kanıt belgesi yükleme, taslak kaydetme ve itiraz başvurusu.
- **Fakülte komisyonu paneli:** Yalnızca kendi fakültesine ait başvuruları görüntüleme, puana göre sıralama ve değerlendirme (onay / red / revizyon).
- **Sistem yöneticisi paneli:** Tüm başvurular, kullanıcı yönetimi ve puanlama kriterlerini düzenleme.
- **Güvenlik:** JWT tabanlı kimlik doğrulama, bcrypt ile şifre saklama, `@aybu.edu.tr` e-posta doğrulaması.

## Teknolojiler

- Node.js + Express
- Vanilla JavaScript (SPA), HTML5, CSS3
- JSON tabanlı dosya veritabanı (`data/db.json`)
- JWT, bcryptjs, multer, nodemailer

## Kurulum

```bash
npm install
cp .env.example .env   # değerleri doldurun
npm start
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışır.

## Ortam Değişkenleri

`.env.example` dosyasını `.env` olarak kopyalayıp doldurun:

| Değişken | Açıklama |
|----------|----------|
| `PORT` | Sunucu portu (varsayılan 3000) |
| `JWT_SECRET` | JWT imzalama anahtarı (üretimde uzun ve rastgele olmalı) |
| `SMTP_*` | E-posta doğrulama için SMTP sunucu bilgileri |

## Proje Yapısı

```
server.js              # Express sunucusu ve API uçları
mailer.js              # E-posta doğrulama gönderimi
data/                  # Akademik birimler ve veritabanı
public/                # Frontend (HTML, CSS, JS)
  ├── index.html
  ├── css/
  └── js/
```

## Lisans

ISC
