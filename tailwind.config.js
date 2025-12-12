module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
        "*.{js,ts,jsx,tsx,mdx}"
    ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ["'Press Start 2P'", "ui-monospace", "SFMono-Regular"]
      },
      colors: {
        dqblue: "#0b1c36"
      }
    }
  },
  plugins: []
}
