/** @type {import('tailwindcss').Config} */
import { join } from "path";
export const darkMode = "class";
export const content = [join(__dirname, "src/**/*.{html,js,ts,jsx,tsx}")];
export const theme = {
    extend: {},
};
export const plugins = [];
