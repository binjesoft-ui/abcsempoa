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
| 🎨 **Main Bebas / Free Play** | **👆 Geser Manik / Move Beads:** a 4-rod abacus that shows the number in digits and words. **🔢 Ketik Angka / Type a Number:** type any number up to 9999 and watch the sempoa set it the proper way — clear first, then rod by rod from the left, with a caption for every move (push, pull, or pinch) |

## Controls / Kontrol

- **Push** a bead toward the middle bar to count it, **pull** it away to remove it.
- Touch **anywhere on a rod**: above the bar grabs the top bead, below it grabs the nearest bottom bead.
- **Pinch 🤏 (jepit)** — for 6–9, the top bead and bottom beads must move **together**:
  - Two fingers: one pulls the top bead down, one pushes bottom beads up. Fingers don't have to be perfectly in sync — moves within about half a second count as one pinch.
  - One finger or mouse: slide the top bead down **through the bar** onto the bottom bead you want.
- Moving them one by one (with a pause between) counts as a wrong move in lessons and the challenge.
- **⚙️ Options / Pengaturan** (top-right on every screen): language (Indonesia / English), bead colour (🌈 colourful or 🟤 classic brown), sound on/off, and About (version, made by Binjesoft).

## Files

```
index.html          the whole game (Phaser 3, single file)
assets/mascot.svg   the ABC Sempoa kid mascot (vector)
assets/mascot.png   the mascot as a PNG
```

## Version

1.2.0 — made by **Binjesoft**.

## Notes

- Language, bead colour, sound setting and best score are saved in the browser (`localStorage`).
- Add/take-away rounds currently avoid "mixed" moves (top bead in while bottom beads go out, e.g. 4 + 1 = 5). Those "friends of 5" lessons are a good next step.
