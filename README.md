# Filippo Montagna — Personal Coach

Landing page one-page per Filippo Montagna, istruttore di fitness e sport,
laureando SUISM.

HTML / CSS / JS puro, mobile-first, nessun framework e nessun processo di build:
si apre `index.html` e funziona.

---

## Da fare prima di pubblicare

Due cose sole, entrambe da cinque minuti.

### 1. La foto dell'hero

La pagina cerca **`assets/img/filippo-hero.jpg`**. Finché il file non c'è,
mostra automaticamente un segnaposto grafico (sfondo scuro con la scritta
"SEGNAPOSTO"): nessun riquadro rotto, ma è evidente che manca la foto.

Basta salvare la foto con quel nome esatto in `assets/img/` — non serve
toccare il codice.

Indicazioni per lo scatto:

- **Verticale o quadrato**, almeno 1600 px sul lato lungo.
- Soggetto **leggermente sopra il centro**: il testo del nome sta in basso e
  il gradiente scuro copre la parte inferiore dell'immagine.
- Va benissimo la foto con maglietta bianca e sfondo alberi. Se serve
  ricentrare il viso, si regola `object-position` in `assets/css/style.css`
  (regola `.hero__img`, valore attuale `50% 28%`).
- Comprimere sotto i ~400 KB (es. [squoosh.app](https://squoosh.app)),
  altrimenti l'hero si carica lento da mobile.

La stessa foto viene riusata, sfocata, come sfondo della sezione "Chi sono".

### 2. Il numero WhatsApp

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
index.html                       pagina unica
assets/css/style.css             stili + animazioni
assets/js/main.js                interazioni (config in cima al file)
assets/img/filippo-hero.jpg      <- da aggiungere
assets/img/hero-placeholder.svg  segnaposto automatico
assets/img/favicon.svg           occhio verde-lime, richiamo al logo
```

## Sezioni

1. **Hero** — foto a piena altezza, nome enorme con reveal a mascherina
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
