# Filippo Montagna — Personal Coach

Landing page one-page per Filippo Montagna, chinesiologo e preparatore
atletico.

HTML / CSS / JS puro, mobile-first, nessun framework e nessun processo di build:
si apre `index.html` e funziona.

---

## Da fare prima di pubblicare

### Il numero WhatsApp

In `assets/js/main.js`, prime righe:

```js
var CONFIG = {
  WHATSAPP: "393000000000",   // <-- numero reale, formato internazionale
  INSTAGRAM: "filo_personalcoach"
};
```

Formato internazionale senza `+` e senza spazi (es. `393401234567`).
Il numero alimenta tutti i pulsanti WhatsApp della pagina: hero, menu,
form della guida, footer e CTA fissa mobile.

---

## Struttura

```
index.html                          pagina unica
assets/css/style.css                stili + animazioni
assets/css/fonts.css                font locali
assets/js/main.js                   interazioni (config in cima al file)
assets/img/filippo-cutout.webp      soggetto scontornato, sta davanti al nome
assets/img/filippo-bg.jpg           stessa foto sfocata, fa da ambiente
assets/img/filippo-hero.jpg         foto piena (anteprima social)
assets/img/sorgente/                foto originale, per rigenerare gli asset
assets/img/hero-placeholder.svg     ripiego se le immagini mancassero
assets/img/favicon.svg              occhio verde, richiamo al logo
tools/prepara-foto.py               rigenera gli asset da una foto nuova
```

## L'hero è a strati

Dal fondo verso l'alto: ambiente sfocato → velature → **nome** → **figura
scontornata** → pulsanti.

La figura sta *davanti* al nome, con un'ombra portata che ne segue il
profilo, così Filippo "sporge" dal testo. I pulsanti stanno davanti a lei:
altrimenti finirebbero coperti e non sarebbero più cliccabili.

Il contenitore `.hero__content` non ha `z-index` di proposito — se creasse
un contesto di impilamento, il nome non potrebbe più passare dietro la
figura mentre i pulsanti le restano davanti.

### Cambiare la foto

```bash
pip install pillow rembg onnxruntime
python3 tools/prepara-foto.py percorso/della/foto-nuova.jpg
```

Rigenera i tre file in `assets/img/`. Lo scontorno gira in locale (modello
`u2net_human_seg`, scaricato al primo avvio): **la foto non viene inviata a
nessun servizio esterno**.

Serve uno scatto **verticale**, soggetto ben staccato dallo sfondo e
inquadratura da mezzo busto. Dopo il cambio vale la pena ricontrollare
l'inquadratura dell'hero: `.hero__cut` in `assets/css/style.css` regola
altezza e sporgenza a destra, ed è tarata perché la testa superi appena la
"A" finale di MONTAGNA senza coprire il cognome.

## Sezioni

1. **Hero** — figura scontornata davanti al nome, reveal a mascherina
   (`FILIPPO` bianco / `MONTAGNA` lime), badge glass, tagline, menu hamburger.
2. **Chi sono** — box in vetro smerigliato sopra la foto sfocata, testo in
   prima persona, motto di chiusura.
3. **Il metodo** — 4 step che entrano in sequenza allo scroll, con la linea
   lime che si riempie sotto ogni step.
4. **Aree di lavoro** — 4 card glass con alone che segue il puntatore
   (e stato al tocco su mobile).
5. **Guida gratuita** — "Da dove partire con l'allenamento", con copertina PDF
   stilizzata e form che apre WhatsApp con il messaggio già scritto.
6. **Footer** — CTA WhatsApp e Instagram
   [@filo_personalcoach](https://instagram.com/filo_personalcoach).

## Scelte tecniche

- **Palette**: nero/antracite `#0B0C0B`–`#1A1D1A`, accento lime `#C8FF2E`,
  testo bianco. Tutti i valori sono variabili CSS in cima a `style.css`.
- **Tipografia**: Anton (con Bebas Neue in fallback) per i titoli condensed,
  Inter per il corpo. Caricati da Google Fonts, con fallback di sistema se la
  rete non risponde.
- **Animazioni**: `IntersectionObserver` per i reveal allo scroll, transizioni
  CSS per tutto il resto. Nessuna libreria.
- **Accessibilità**: `prefers-reduced-motion` disattiva tutte le animazioni,
  il menu ha focus trap e chiusura con `Esc`, skip link in cima, focus
  visibile ovunque.
- **Fallback**: dove `backdrop-filter` non è supportato, i pannelli in vetro
  diventano tinta piena — restano leggibili.

## Guida PDF

Il form della guida non invia file: apre WhatsApp con un messaggio
precompilato che include nome e punto di partenza scelto, così Filippo
risponde inviando il PDF a mano. Nessun backend, nessun dato conservato,
nessun adempimento privacy da gestire.

Per automatizzarlo in seguito basta sostituire l'handler in `main.js`
(sezione 9) con una chiamata al servizio di mailing scelto.

## Pubblicazione

Sono file statici: qualsiasi hosting va bene. Su Netlify o Vercel si
trascina la cartella, oppure si collega il repository — nessuna configurazione
di build, la directory da pubblicare è la radice.
