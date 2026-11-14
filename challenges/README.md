# ABC Sempoa challenges

Each file is one set of 10 questions.

| Folder | File name | Used by |
|---|---|---|
| `daily/` | `YYYY-MM-DD.json` (e.g. `2026-11-14.json`) | 📅 Tantangan Harian on that day |
| `weekly/` | `YYYY-Www.json` (ISO week, Monday–Sunday, e.g. `2026-W46.json`) | 🏆 Tantangan Mingguan during that week |

A scheduled task runs `node tools/make-challenges.js` every evening and commits tomorrow's daily set
(and next week's weekly set on Sundays). The files hold exactly what the game would generate by itself,
so everyone gets the same questions whether or not the file can be loaded.

## Editing a day by hand

You can change any file before its day comes. The script never overwrites a file that already exists
(unless run with `--force`), so your edits are kept. When the game is hosted from this repo
(e.g. GitHub Pages), it loads the file; if a file is broken it is ignored and the game uses its own set.

Each question is either:

```json
{ "type": "build", "answer": 58 }
```
"Show this number" — `answer` from 0 to 9999.

```json
{ "type": "calc", "terms": [12, 7, -5], "answer": 14 }
```
A sum of 2 or 3 numbers (negative = take away). The terms must add up to `answer`, and every running
total must stay between 0 and 9999. A file must contain exactly 10 questions.
