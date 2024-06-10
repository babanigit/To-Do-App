// Theme Presets

export interface ThemeDataType {
    name: string;
    body: string;
    text: string;
    bg1: number;

    body2: string;

    // dark?: string; // Optional property
}

const lightTheme: ThemeDataType = {
    name: "light",
    body: "#ECECEC",
    text: "#373737",
    bg1: 1,

    body2: "#D2D2D2",

};

const darkTheme: ThemeDataType = {
    name: "dark",
    // 242424
    body: "#242424",
    text: "#D8D8D8",
    bg1: 50,

    body2: "#373737",

};

export const themes: { [key: string]: ThemeDataType } = {
    light: lightTheme,
    dark: darkTheme,
};