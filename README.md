# ABC Sempoa 🧮

<img src="assets/mascot.png" alt="ABC Sempoa mascot" width="220" align="right">

A fun abacus (sempoa / soroban) learning game for kids, built with [Phaser 3](https://phaser.io).
Portrait layout, playable on phones, tablets and desktop. Available in **Bahasa Indonesia** and **English**.

*Game belajar sempoa yang seru untuk anak-anak. Tampilan potret, bisa dimainkan di HP, tablet, dan komputer, dalam Bahasa Indonesia dan Inggris.*

## Play / Main

Open `index.html` in a browser. No build step needed — Phaser loads from a CDN.

Or serve the folder locally:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Modes / Mode

| Mode | What kids do |
|---|---|
| 📚 **Belajar / Learn** | 10 short lessons with Ollie the Owl: bottom beads (1), top bead (5), the pinch, tens, adding, up to 999 |
| 🎮 **Tantangan / Challenge** | 10 rounds — build a number, read the abacus, add and take away — with timer, combo multiplier, stars and best score |
| 🎨 **Main Bebas / Free Play** | A 4-rod abacus that shows the number in digits and words |

## Controls / Kontrol

- **Push** a bead toward the middle bar to count it, **pull** it away to remove it.
- **Pinch 🤏 (jepit)** — for 6–9, the top bead and bottom beads must move **at the same time**:
  - Touch: two fingers together (one pulls the top bead down, one pushes bottom beads up).
  - Mouse: drag one bead **across the bar** onto the other side.
- Moving them one by one counts as a wrong move in lessons and the challenge.

## Files

```
index.html          the whole game (Phaser 3, single file)
assets/mascot.svg   the ABC Sempoa kid mascot (vector)
assets/mascot.png   the mascot as a PNG
```

## Notes

- Language choice, sound setting and best score are saved in the browser (`localStorage`).
- Add/take-away rounds currently avoid "mixed" moves (top bead in while bottom beads go out, e.g. 4 + 1 = 5). Those "friends of 5" lessons are a good next step.
