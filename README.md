# ABC Sempoa 🧮

<img src="assets/mascot.png" alt="ABC Sempoa mascot" width="220" align="right">

A fun abacus (sempoa / soroban) learning game for kids, built with [Phaser 3](https://phaser.io).
Two layouts — **landscape** (1280 × 720) or **portrait** (720 × 1280), chosen in ⚙️ Options — playable on phones, tablets and desktop. Available in **Bahasa Indonesia** and **English**.

*Game belajar sempoa yang seru untuk anak-anak. Tampilan mendatar atau tegak (pilih di Pengaturan), bisa dimainkan di HP, tablet, dan komputer, dalam Bahasa Indonesia dan Inggris.*

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
| 📅 **Tantangan Harian / Daily Challenge** | 10 new questions every day on a **full 13-rod sempoa** — the same set for every child that day. Shows ✅ done today and a 🔥 days-in-a-row streak |
| 🏆 **Tantangan Mingguan / Weekly Challenge** | 10 harder questions, new every Monday (ISO week), with this week's best score |
| 🎨 **Main Bebas / Free Play** | **👆 Geser Manik / Move Beads:** the full 13-rod sempoa that shows the number in digits and words. **🔢 Ketik Angka / Type a Number:** type any number up to 9 digits and watch the sempoa set it the proper way — clear first, then rod by rod from the left, with a caption for every move (push, pull, or pinch) |

## Controls / Kontrol

- **Push** a bead toward the middle bar to count it, **pull** it away to remove it.
- Touch **anywhere on a rod**: above the bar grabs the top bead, below it grabs the nearest bottom bead.
- **Pinch 🤏 (jepit)** — for 6–9, the top bead and bottom beads must move **together**:
  - Two fingers: one pulls the top bead down, one pushes bottom beads up. Fingers don't have to be perfectly in sync — moves within about half a second count as one pinch.
  - One finger or mouse: slide the top bead down **through the bar** onto the bottom bead you want.
- Moving them one by one (with a pause between) counts as a wrong move in lessons and the challenge.
- **⚙️ Options / Pengaturan** (top-right on every screen): language (Indonesia / English), layout (🖥️ mendatar / 📱 tegak), bead colour (🌈 colourful or 🟤 classic brown), sound on/off, and About (version, made by Binjesoft).

## Daily & weekly challenges

Both play on the full sempoa (scroll with the slider or ‹ ›): show a number, or work out a sum step by step — the ▶ follows your running total. Timer, ❓ Guide, 💡 Help (finger demo), ✔ Submit, ⏭ Skip.

- Sets are generated from the date with a seeded generator, so they work offline and are identical for everyone.
- `node tools/make-challenges.js` publishes upcoming sets to [`challenges/`](challenges/); a scheduled task runs it every evening. When the game is hosted from this repo it loads those files, so a day can be edited by hand — see [challenges/README.md](challenges/README.md).

## The full sempoa

- 13 rods; the **orange ▼ and dot** mark the ones rod (Satuan), white **unit dots** mark every third rod.
- Rods right of the ones rod are decimals (persepuluhan, perseratusan…).
- Drag the **slider** under the sempoa, or tap the **‹ ›** arrows, to see more rods.

## Files

```
index.html          the whole game (Phaser 3, single file)
assets/mascot.svg   the ABC Sempoa kid mascot (vector)
assets/mascot.png   the mascot as a PNG
assets/thumb.png    the thumb hand used in finger demos
tests/              headless checks (run: node tests/test.js)
tools/              make-challenges.js — publishes daily/weekly question files
challenges/         published daily/ and weekly/ question sets
```

## Version

2.3.1 — made by **Binjesoft**.

## Notes

- Language, bead colour, sound setting and best score are saved in the browser (`localStorage`).
- Add/take-away rounds currently avoid "mixed" moves (top bead in while bottom beads go out, e.g. 4 + 1 = 5). Those "friends of 5" lessons are a good next step.
