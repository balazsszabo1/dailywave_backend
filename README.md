# Vizsgamunka Backend Dokumentáció - DailyWave Hírportál
Készítette: Schilling János Attila, Szabó Balázs

A **DailyWave Hírportál** backendje egy Node.js és Express alapú API, amely felelős a különböző adatkezelésekért, mint például a hírek, fórum témák és hozzászólások kezelése. Az API kapcsolódik egy MySQL adatbázishoz és biztosítja az adatokat a frontend számára.

## Technológiák
- **Node.js** - A backend futtató környezet.
- **Express.js** - Web keretrendszer, amely lehetővé teszi a REST API gyors fejlesztését.
- **MySQL** - Relációs adatbázis a háttéradatok tárolásához.

## Adatbázis
● category
    ○ cat_id
    ○ cat_name

● comments
    ○ comment_id
    ○ comment
    ○ user_id
    ○ topic_id
    ○ date

● news
    ○ news_id
    ○ cat_id
    ○ news_title
    ○ news
    ○ index_pic

● newsletter
    ○ newsletter_id
    ○ name
    ○ email

● pictures
    ○ picture_id
    ○ picture
    ○ news_id

● ratings
    ○ comment_id
    ○ user_id
    ○ plus
    ○ minus

● topic
    ○ topic_id
    ○ topic_title
    ○ user_id
    ○ date

● users
    ○ user_id
    ○ email
    ○ password
    ○ role
    ○ profile_picture
    ○ username

![Adatbázis diagram](images/adatbazis.png)

## Telepítés

A backend telepítése a következő lépésekkel történik:

### 1. Klónozd a repót
git clone https://github.com/balazsszabo1/dailywave_backend.git  
cd dailywave-backend  
npm install  
npm run dev


API Endpontok: 
## AuthControllers.js tartalma:
1. Felhasználói Hitelesítés:
POST /api/auth/register
Leírás: Új felhasználó regisztrálása.

Kérés törzse (JSON):
.....kép
Válasz: A sikeres regisztráció után visszakapott felhasználói adatok és token.
.....kép

2. Bejelentkezés
POST /api/auth/login
Leírás: Felhasználó bejelentkezése.

Kérés törzse (JSON):
....kép
Válasz: A sikeres bejelentkezés után visszakapott token.
....kép

3. Kijelentkezés
POST /api/auth/logout
Leírás: Felhasználó kijelentkezése.

Kérés törzse (JSON):
....kép
Válasz: A sikeres kijelentkezés után elvett token.
....kép

## ProfileControllers.s tartalma:
1. Profil Név szerkesztés
POST /api/profile/editProfileNane
Leírás: Bejelentkezett felhasználó profiljának lekérése (JWT token szükséges).
....kép
Válasz: A felhasználó adatainak JSON formátumban.
....kép

2. Profil név megjelenítés
GET /api/profile/getProfileName
Leírás: Bejelentkezett felhasználó profil nevének megváltoztatása.
....kép
Válasz: A felhasználó adatainak JSON formátumban.
....kép

3. Profil jelszó megváltoztatás
GET /api/profile/editProfilePsw
Leírás: Bejelentkezett felhasználó profil jelszavának megváltoztatása.
....kép
Válasz: A felhasználó adatainak JSON formátumban.
....kép

4. Profil jelszó megváltoztatás
POST /api/profile/editProfilePic
Leírás: Bejelentkezett felhasználó profil jelszavának megváltoztatása.
....kép
Válasz: A felhasználó adatainak JSON formátumban.
....kép

5. Profilkép megjelenítése
POST /api/profile/editProfilePic
Leírás: Bejelentkezett felhasználó profilképének megváltoztatása.
....kép
Válasz: A felhasználó adatainak JSON formátumban.
....kép

## newsControllers.js tartalma:
1. Hír feltöltés
POST /api/news/uploadNews
Leírás: Hírek feltöltése Admin felhasznáóként.
....kép
Válasz: A felhasználó adatainak JSON formátumban.
....kép

2. Hír megjelenítés
GET /api/news/getAllNews
Leírás: Hírek megjelenítése minden felhaszálónak.
....kép
Válasz: A felhasználó adatainak JSON formátumban.
....kép

3. ID alapján hír lekérés
GET /api/news/getNewsById
Leírás: Hírek ID alapján törénő megjelenítése.
....kép
Válasz: A felhasználó adatainak JSON formátumban.
....kép

4. Feliratkozás a hírlevélre
POST /api/news/newsletter
Leírás: Hírlevélre feliratkozás.
....kép
Válasz: A felhasználó adatainak JSON formátumban.
....kép

## topicControllers.js tartalma:
1. Témák megjelenítése
POST /api/topic/getAlltopics
....kép
Válasz: A felhasználó adatainak JSON formátumban.
....kép

2. Kommentek megjelenítése
POST /api/topic/getComments
Leírás: Bejelentkezett felhasználó kommentjének megjelenítése.
....kép
Válasz: A felhasználó adatainak JSON formátumban.
....kép

3. Komment hozzáadása
POST /api/topic/addComment
Leírás: Bejelentkezett felhasználó kommentjének hozzáadása.
....kép
Válasz: A felhasználó adatainak JSON formátumban.
....kép

4. Témák feltöltése
POST /api/topic/uploadTopic
Leírás: Téma hozzáadása.
....kép
Válasz: A felhasználó adatainak JSON formátumban.
....kép

## Middleware-ek: 
## isAdmin.js – Admin jogosultság ellenőrző middleware:
Ez a middleware biztosítja, hogy csak olyan felhasználók férhessenek hozzá bizonyos útvonalakhoz, akik admin jogosultsággal rendelkeznek.
...kép
## limiter.js – Rate limiting middleware:
Ez a middleware az `express-rate-limit` csomagot használja arra, hogy megakadályozza a túl sok kérés beérkezését egyazon IP-címről rövid idő alatt.
...kép
## jwtAuth.js – JWT token alapú hitelesítés middleware:
Ez a middleware biztosítja, hogy a védett útvonalakhoz csak olyan kliensek férhessenek hozzá, akik érvényes JSON Web Token-nel (JWT) rendelkeznek. A token az `auth_token` nevű cookie-ban van tárolva.
...kép
## multer.js – Fájlfeltöltés konfiguráció képekhez:
Ez a middleware a `multer` csomagot használja a fájlfeltöltések kezelésére, különös tekintettel a képfájlokra.
...kép

## Models: 
## db.js – MySQL adatbázis kapcsolat (connection pool):
Ez a fájl létrehoz egy új MySQL kapcsolatkezelőt (`pool`) a `mysql2` csomag segítségével, amely lehetővé teszi az adatbázishoz való hatékony és skálázható hozzáférést.
...kép

## Routes: 
## adminRoutes.js – Admin jogosultságot igénylő útvonalak:
Ez az Express router modul olyan végpontokat definiál, amelyek kizárólag adminisztrátorok számára érhetők el. A hozzáférés ellenőrzését két middleware végzi:
...kép
## authRoutes.js – Felhasználói hitelesítés útvonalai:
Ez a fájl az Express routert használva három fő autentikációs funkciót biztosít az alkalmazás számára: regisztráció, bejelentkezés és kijelentkezés.
...kép
## newsRoutes.js – Hírekkel kapcsolatos API végpontok:
Ez a modul az Express router segítségével különböző útvonalakat biztosít hírek feltöltéséhez, lekérdezéséhez, kereséséhez, valamint hírlevél-funkcióhoz.
...kép
## profileRoutes.js – Felhasználói profil API végpontok:
Ez a modul az Express router segítségével biztosítja a felhasználói profil kezelésére szolgáló végpontokat, beleértve a név, jelszó, profilkép módosítását és lekérdezését.
...kép
## topicRoutes.js – Topikok és hozzászólások API végpontok:
Ez a fájl az Express router segítségével biztosítja a topikok és hozzászólások kezelésére szolgáló végpontokat. A felhasználók képesek új topikokat feltölteni, hozzászólásokat hozzáadni, és meglévő hozzászólásokat megtekinteni.
...kép

## dotenvConfig.js – Környezeti változók betöltése és kezelése:
Ez a fájl felelős az alkalmazás konfigurációs beállításainak betöltéséért és központi tárolásáért. A fájl a `dotenv` csomag segítségével olvassa be a `.env` fájlban meghatározott környezeti változókat, majd egy objektumban tárolja azokat, amelyet az alkalmazás többi része később elérhet.
...kép

## Egyéb fájlok: 
## app.js – Az Express alkalmazás konfigurálása:
Ez a fájl tartalmazza az Express alkalmazás fő beállításait, ideértve a middleware-eket, az útvonalak regisztrálását és az alkalmazás alap konfigurációját.
...kép

## server.js – Az alkalmazás indítása:
Ez a fájl az Express alkalmazást indítja el a konfigurált porton és host néven, amelyeket a `.env` fájlban vagy a `dotenvConfig` modulban található beállítások határoznak meg.
...kép

## Backend GitHub és szerver integráció

A projekt backendje a [GitHub repóban található](https://github.com/balazsszabo1/dailywave_backend), ahol a legfrissebb kód mindig elérhető. A backend szerver a következő címen fut: [https://nodejs.dszcbaross.edu.hu/server/7b76faf3](https://nodejs.dszcbaross.edu.hu/server/7b76faf3). 

### Automatikus frissítések:

A backend szerver folyamatosan képes lekérni a legújabb változtatásokat közvetlenül a GitHub repóból, így a legfrissebb verzió mindig elérhető és futtatható anélkül, hogy manuálisan kellene frissíteni a kódot. Ezt a folyamatot automatizált script vagy CI/CD (Continuous Integration/Continuous Deployment) folyamat biztosítja, amely figyeli a GitHub repót, és frissíti a szervert a legújabb kódbázis alapján.

### Használat:

1. **GitHub repo**: Az alkalmazás backend kódja a [https://github.com/balazsszabo1/dailywave_backend](https://github.com/balazsszabo1/dailywave_backend) linken található.
2. **Szerver URL**: A backend szerver elérhetősége: [https://nodejs.dszcbaross.edu.hu/server/7b76faf3](https://nodejs.dszcbaross.edu.hu/server/7b76faf3).

Ez biztosítja, hogy a kód mindig naprakész legyen, és az új változtatások automatikusan tükröződjenek a szerveren.

## Biztonság és Titkosítás

A backend biztosítja az alapvető biztonsági mechanizmusokat az alkalmazás védelme érdekében. A következő megoldások kerültek implementálásra:

### 1. JWT Token-alapú hitelesítés
Az API végpontjai számára biztosított hitelesítés **JSON Web Token (JWT)** alapú. Minden felhasználónak regisztráció után érvényes JWT token-t adunk, amelyet a későbbi API kérésekhez használnak, így biztosítva a hozzáférés védelmét.

### 2. SSL Titkosítás
Az adatbiztonság érdekében a backend API **HTTPS-en** keresztül érhető el, biztosítva, hogy minden adat titkosítva legyen a kliens és a szerver között, ezzel elkerülve az adatlopásokat és lehallgatást.

### 3. Felhasználói adatok védelme
A felhasználók érzékeny adatainak, mint például a jelszavak, titkosítása **bcrypt hash**-el történik, hogy még adatlopás esetén sem legyenek elérhetők az eredeti jelszavak. Az API minden jelszóváltoztatást és regisztrációt biztonságos módon kezel.

---

## Hibakezelés és Naplózás

### 1. Hibakezelés
A backendben a **hibakezelés** központilag van megoldva, hogy minden nem várt esemény a megfelelő válaszformátumban kerüljön továbbításra a frontend felé. A hibák megfelelő kódokkal (pl. 404, 500) vannak jelezve, és az API minden esetben részletes hibaüzenetet biztosít.

### 2. Naplózás
Az alkalmazás **naplózza** a rendszer működését és az API kéréseket. A naplózási információk, mint például az API hívások időpontja, kérés típusai és válaszok, segítenek a hibák gyors diagnosztizálásában és a rendszer általános teljesítményének nyomon követésében. A naplózás konfigurálása az **express-winston** csomag segítségével történik, és a naplóadatok egy központi rendszerbe kerülhetnek továbbításra a későbbi elemzéshez.

## Tesztelés
A backend API tesztelését a **Postman** eszközzel végeztük. A következő teszteket futtattuk le a különböző API végpontokon, hogy biztosítsuk azok helyes működését:

- **Felhasználói regisztráció** (POST `/api/auth/register`)
- **Bejelentkezés** (POST `/api/auth/login`)
- **Profil név szerkesztése** (POST `/api/profile/editProfileName`)
- **Hírek feltöltése** (POST `/api/news/uploadNews`)
- **Komment hozzáadása** (POST `/api/topic/addComment`)
- **Admin jogosultság ellenőrzése** (POST `/api/admin/admin-only`)

A Postman tesztekről készült összes tesztelési link és dokumentáció elérhető [itt](https://link_az_osszes_teszthez).

## 🌐 Frontend

### 🔗 GitHub repo
- [Frontend](https://github.com/your-repo-url)

---

## 🛠️ Használt eszközök

- [Visual Studio Code](https://code.visualstudio.com/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [NPM](https://www.npmjs.com/)
- [Postman](https://www.postman.com/)
- [DrawSQL](https://drawsql.app/)
- [W3Schools](https://www.w3schools.com/)
- [StackOverflow](https://stackoverflow.com/)
- [ChatGPT](https://chat.openai.com/)
- [Tabnine](https://www.tabnine.com/)
- [GitHub](https://github.com/)
- [Google Drive](https://drive.google.com/)

















