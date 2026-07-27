#!/usr/bin/env python3
"""
Prepara gli asset dell'hero a partire da una foto sorgente.

Genera tre file in assets/img/:
  filippo-cutout.webp  soggetto scontornato, sta DAVANTI al nome
  filippo-bg.jpg       stessa foto sfocata e scurita, fa da ambiente dietro
  filippo-hero.jpg     foto piena, usata come fallback e per l'anteprima social

Serve solo se si cambia la foto. Uso:

    pip install pillow rembg onnxruntime
    python3 tools/prepara-foto.py percorso/della/foto.jpg

Lo scontorno gira in locale (modello u2net_human_seg, scaricato al primo
avvio): la foto non viene inviata a nessun servizio esterno.
"""

import os
import sys
from PIL import Image, ImageFilter, ImageEnhance

DEST = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "img")


def kb(path):
    return round(os.path.getsize(path) / 1024)


def main(src_path):
    src = Image.open(src_path).convert("RGB")
    print(f"sorgente: {src_path} {src.size[0]}x{src.size[1]}")
    os.makedirs(DEST, exist_ok=True)

    # --- 1. Foto piena (metadati rimossi, ricompressione progressiva) ---
    full = Image.new("RGB", src.size)
    full.putdata(list(src.getdata()))
    hero = os.path.join(DEST, "filippo-hero.jpg")
    full.save(hero, "JPEG", quality=84, optimize=True, progressive=True)
    print(f"  filippo-hero.jpg    {full.size[0]}x{full.size[1]}  {kb(hero)} KB")

    # --- 2. Sfondo sfocato e scurito ---
    # Sfocatura applicata ora e non a runtime: su mobile un backdrop-filter
    # su un'immagine grande costa parecchio in scorrimento.
    small = src.copy()
    small.thumbnail((760, 760), Image.LANCZOS)
    blurred = small.filter(ImageFilter.GaussianBlur(radius=18))
    blurred = ImageEnhance.Brightness(blurred).enhance(0.42)
    blurred = ImageEnhance.Color(blurred).enhance(0.72)
    bg = os.path.join(DEST, "filippo-bg.jpg")
    blurred.save(bg, "JPEG", quality=72, optimize=True, progressive=True)
    print(f"  filippo-bg.jpg      {blurred.size[0]}x{blurred.size[1]}  {kb(bg)} KB")

    # --- 3. Soggetto scontornato ---
    from rembg import remove, new_session

    session = new_session("u2net_human_seg")
    cut = remove(
        src,
        session=session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=250,
        alpha_matting_background_threshold=15,
        alpha_matting_erode_size=8,
    )
    box = cut.getbbox()          # via lo spazio vuoto: posizionamento prevedibile
    cut = cut.crop(box)
    if cut.width > 900:
        cut = cut.resize((900, round(cut.height * 900 / cut.width)), Image.LANCZOS)
    out = os.path.join(DEST, "filippo-cutout.webp")
    cut.save(out, "WEBP", quality=86, method=6)
    print(f"  filippo-cutout.webp {cut.width}x{cut.height}  {kb(out)} KB")
    print(f"  (proporzioni ritaglio {cut.width / cut.height:.3f} — se cambiano molto,")
    print(f"   ricontrolla l'inquadratura dell'hero in assets/css/style.css)")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
