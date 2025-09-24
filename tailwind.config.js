/** @type {import('tailwindcss').Config} */
export const content = [
    "./src/**/*.{js,ts,jsx,tsx}", // adjust to match your project
];
export const theme = {
    extend: {},
};
export const plugins = [require("daisyui")];
export const daisyui = {
    themes: ["light", "dark"], // enables both light & dark
    darkTheme: "dark", // set the default dark theme
};
