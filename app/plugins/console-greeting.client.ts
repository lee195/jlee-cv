// A hello for anyone who opens devtools, plus a small capture-the-flag.
export default defineNuxtPlugin(() => {
  const big = 'font: 700 18px/1.4 Outfit, sans-serif; color: #38bdf8;'
  const body = 'font: 13px/1.6 "JetBrains Mono", monospace; color: inherit;'
  const accent = 'font: 600 13px/1.6 "JetBrains Mono", monospace; color: #2dd4bf;'

  console.log('%cOh hi, you opened devtools. 👋', big)
  console.log(
    '%cYou are exactly who I built this part for.\n\n' +
      '%c1.%c Press ⌘K / Ctrl+K anywhere on the page for a terminal.\n' +
      '%c2.%c A flag is hidden in this page\'s <head>. It\'s encoded, not encrypted.\n' +
      '   Found it? Submit it in the terminal: submit JL{...}\n\n' +
      '%cThe source is on GitHub too: https://github.com/lee195/jlee-cv',
    body, accent, body, accent, body, body
  )
})
