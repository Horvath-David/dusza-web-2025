# Felhasználói útmutató (UI)

Ez az útmutató az alkalmazás felületének használatát mutatja be. Két fő nézet érhető el: Master és Player.

## Navigáció
- Játékmester nézet: világok, kártyagyűjtemény és kazamaták kezelése, játékos paklik áttekintése.
- Játékos nézet: világok böngészése, saját játékok kezelése, aktív játékhoz csatlakozás.
- A nézeteken belül a „Vissza” gombbal léphetsz vissza a fő játéknézetre.

## MastJátékmesterer nézet

### Gyűjtemény kezelése
- Lista: a „Gyűjteményed” rács a kártyákat mutatja (név, sebzés/HP, elem, „(vezér)” jelzés).
- Új kártya:
  1. Kattints: „Új hozzáadása”.
  2. Töltsd ki: Név (max. 16), Sebzés (≥1), Életerő (≥1), Elem (Tűz/Víz/Föld/Szél).
  3. „Létrehozzás”.
  4. Siker esetén értesítés jelenik meg, a lista frissül.
- Kártya módosítása:
  1. Kattints egy kártyára a rácsban.
  2. Módosíthatod a mezőket, majd „Módosítás”.
  3. „Törlés” eltávolítja a kártyát.
  4. „Vezér készítés” speciális kártyát hoz létre:
     - Válassz erősítést: „Életerő duplázása” vagy „Sebzés duplázása”.
     - Ezután hozd létre a vezért.
- Hibajelzések:
  - Duplikált név esetén hibaüzenet.
  - Vezér létrehozásakor kötelező erősítést választani.

### Kazamaták kezelése
- Lista: a „Kazamaták” nézet a meglévő kazamatákat sorolja (név, típus).
- Új kazamata:
  1. „Új kazamta létrehozzása”.
  2. Add meg: Név, Típus:
     - Egyszerű találkozás (basic)
     - Kis kazamata (small)
     - Nagy kazamata (big)
  3. Kártyák hozzáadása:
     - A rácsban látszanak a jelenlegi választások.
     - „+” megnyomásával megnyílik a kártyaválasztó.
     - A rendszer a típushoz illeszkedő kártyamennyiséget vár:
       - Egyszerű találkozás (basic): pontosan 1 kártya
       - Kis kazamata (small): pontosan 4 kártya
       - Nagy kazamata (big): pontosan 6 kártya
     - A kiválasztó felület jelzi, ha nincs elég megfelelő kártya.
     - A kis/nagy kazamatákhoz nem-vezér kártyák szükségesek; ahol szükséges, a felület boss kártyát kér.
  4. „Létrehozzás”.
  5. Siker esetén értesítés, a lista frissül.
- Kazamata módosítása:
  - A listában a ceruza ikonra kattintva megnyílik a szerkesztés.
  - Név, típus, kártyák módosíthatók; „Módosítás” ment.
- Kazamata törlése:
  - A kuka ikon eltávolítja a kiválasztott kazamatát.
- Vizuális segítségek:
  - Ha a kártyaszám nem felel meg a típusnak, hibaüzenet jelenik meg.
  - A kiválasztott kártyákat az „X” gombbal kiveheted a kazamatából.

### Játékos paklik
- Áttekintés a játékosok paklijairól a Master nézetben.
- Cél: ellenőrzés, szükség esetén adminisztratív műveletek.

## Játékos nézet

### Világok és új játék
- Nyisd meg a Világok nézetet, válassz világot, indíts új játékot.
- A felület jelzi az elérhető opciókat az adott világhoz.

### Saját játékok és aktív játék
- „Saját játékok” listában válaszd ki a folytatni kívánt játékot.
- Az „Aktív játék” nézetben közvetlenül beléphetsz a futó sessionbe.

## Értesítések és visszajelzések
- Sikeres művelet: zöld/siker üzenet.
- Hiba: piros/hiba üzenet (pl. hiányzó mezők, nem megfelelő kártyaszám).
- A listák automatikusan frissülnek sikeres műveletek után.

## Tippek
- Kártya szerkesztéshez kattints a kártyára a gyűjtemény rácsában.
- A „Vissza” gomb bármikor visszavisz a játék fő nézetébe.
- Kazamatáknál mindig ellenőrizd a típushoz előírt kártyaszámot, különben a mentés nem engedélyezett.

```
    Copyright (C) 2025  ${csapatnev} team (Béla Buczkó, Dávid Horváth, Márton Vad)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
```
