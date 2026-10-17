# Calculator

A clean, responsive calculator web app built with vanilla HTML, CSS, and JavaScript. No frameworks, no build step — just open it in a browser.

## Features

- Standard arithmetic: addition, subtraction, multiplication, division
- Decimal numbers and parentheses
- Clear (C) and backspace (DEL) controls
- Full keyboard support — type numbers and operators, `Enter` to calculate, `Esc` to clear
- Responsive grid layout that works on mobile and desktop

## Tech Stack

- HTML5
- CSS3 (Grid layout)
- Vanilla JavaScript — uses a hand-written expression parser instead of `eval()` for safe calculation

## How to Run

No installation needed. Open `index.html` in any modern browser, or serve the folder locally:

```bash
npx serve .
```

## Project Structure

```
├── index.html   # Calculator layout
├── style.css    # Styling (CSS Grid, responsive)
├── script.js    # Logic: input handling, keyboard support, safe expression parser
└── README.md
```
