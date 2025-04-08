Vizsgamunka Backend Dokumentáció - DailyWave Hírportál
Készítette: Schilling János Attila, Szabó Balázs

A **DailyWave Hírportál** backendje egy Node.js és Express alapú API, amely felelős a különböző adatkezelésekért, mint például a hírek, fórum témák és hozzászólások kezelése. Az API kapcsolódik egy MySQL adatbázishoz és biztosítja az adatokat a frontend számára.

## Technológiák

- **Node.js** - A backend futtató környezet.
- **Express.js** - Web keretrendszer, amely lehetővé teszi a REST API gyors fejlesztését.
- **MySQL** - Relációs adatbázis a háttéradatok tárolásához.

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


















