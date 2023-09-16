import { createTheme } from "@nextui-org/react";

import { darkTransparent, dark } from "./config/colors";

const lightTheme = {
  colors: {
    blue50: "#EAFAFF",
    blue100: "#BBE2EF",
    blue200: "#8AC9DD",
    blue300: "#66B4CD",
    blue400: "#3E9CBB",
    blue500: "#2E90B0",
    blue600: "#1A7FA0",
    blue700: "#045E7B",
    blue800: "#033646",
    blue900: "#002B39",
    blue1000: "#091720",

    orange50: "#FFF6F3",
    orange100: "#FFECE4",
    orange200: "#FFDED2",
    orange300: "#FFCCB9",
    orange400: "#FFB89E",
    orange500: "#F8A78A",
    orange600: "#F69977",
    orange700: "#F28057",
    orange800: "#F17041",
    orange900: "#E54F18",

    green50: "#E9FFF2",
    green100: "#C0F1D4",
    green200: "#95E5B5",
    green300: "#73D199",
    green400: "#45CC7B",
    green500: "#20D267",
    green600: "#0FC457",
    green700: "#04B149",
    green800: "#05983F",
    green900: "#00762F",

    red50: "#FFF4F4",
    red100: "#FEDDDD",
    red200: "#FBC0C0",
    red300: "#FCA5A5",
    red400: "#F48484",
    red500: "#F36060",
    red600: "#EF4444",
    red700: "#E53232",
    red800: "#DE1313",
    red900: "#C90808",

    primary: "$blue700",
    secondary: "$orange700",

    primaryLight: "$blue200",
    primaryLightHover: "$blue300",
    primaryLightActive: "$blue400",
    primaryLightContrast: "$blue600",
    primaryBorder: "$blue500",
    primaryBorderHover: "$blue600",
    primarySolidHover: "$blue700",
    primarySolidContrast: "$blue50",
    primaryShadow: "$blue500",

    secondaryLight: "$orange200",
    secondaryLightHover: "$orange300",
    secondaryLightActive: "$orange400",
    secondaryLightContrast: "$orange600",
    secondaryBorder: "$orange500",
    secondaryBorderHover: "$orange600",
    secondarySolidHover: "$orange700",
    secondarySolidContrast: "$orange50",
    secondaryShadow: "$orange500",

    gradient: "linear-gradient(112deg, $blue600 -3.59%, $blue700 -20.3%, $orange800 90.46%)",
    gradientShadow: "linear-gradient(112deg, $blue600 -3.59%, $blue700 -20.3%, $orange800 90.46%)",
    link: "$orange800",
    headerBackground: darkTransparent(0.8),
    background: "#F2F6FB",
    backgroundContrast: "#fff",
  },
  space: {},
  fonts: {
    sans: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Roboto\", \"Oxygen\", \"Ubuntu\", \"Cantarell\", \"Fira Sans\", \"Droid Sans\", \"Helvetica Neue\", sans-serif",
    mono: "'Roboto Mono', Monaco, 'Lucida Console', 'Liberation Mono', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Courier New', monospace",
  },
  fontWeights: {
    lighter: "300",
    normal: "400",
    medium: "600",
    bold: "700",
    bolder: "800",
  }
};

const darkTheme = {
  colors: {
    blue1000: "#EAFAFF",
    blue900: "#BBE2EF",
    blue800: "#8AC9DD",
    blue700: "#66B4CD",
    blue600: "#3E9CBB",
    blue500: "#2E90B0",
    blue400: "#1A7FA0",
    blue300: "#045E7B",
    blue200: "#033646",
    blue100: "#002B39",
    blue50: "#091720",

    orange900: "#FFF6F3",
    orange800: "#FFECE4",
    orange700: "#EAFAFF",
    orange600: "#FFDED2",
    orange500: "#FFB89E",
    orange400: "#F8A78A",
    orange300: "#F69977",
    orange200: "#F28057",
    orange100: "#F17041",
    orange50: "#E54F18",

    green900: "#E9FFF2",
    green800: "#C0F1D4",
    green700: "#95E5B5",
    green600: "#73D199",
    green500: "#45CC7B",
    green400: "#20D267",
    green300: "#0FC457",
    green200: "#04B149",
    green100: "#05983F",
    green50: "#00762F",

    red50: "#FFF4F4",
    red100: "#FEDDDD",
    red200: "#FBC0C0",
    red300: "#FCA5A5",
    red400: "#F48484",
    red500: "#F36060",
    red600: "#EF4444",
    red700: "#E53232",
    red800: "#DE1313",
    red900: "#C90808",

    primary: "$blue600",
    secondary: "$orange600",

    primaryLight: "$blue200",
    primaryLightHover: "$blue300",
    primaryLightActive: "$blue400",
    primaryLightContrast: "$blue600",
    primaryBorder: "$blue500",
    primaryBorderHover: "$blue600",
    primarySolidHover: "$blue700",
    primarySolidContrast: "$blue50",
    primaryShadow: "$blue500",

    secondaryLight: "$orange200",
    secondaryLightHover: "$orange300",
    secondaryLightActive: "$orange400",
    secondaryLightContrast: "$orange600",
    secondaryBorder: "$orange500",
    secondaryBorderHover: "$orange600",
    secondarySolidHover: "$orange700",
    secondarySolidContrast: "$orange50",
    secondaryShadow: "$orange500",

    errorLight: "$red200",
    errorLightHover: "$red400",
    errorLightActive: "$red500",
    errorLightContrast: "$red800",
    errorBorder: "$red700",
    errorBorderHover: "$red700",
    errorSolidHover: "$red900",
    errorSolidContrast: "$red100",
    errorShadow: "$red600",

    selection: "$blue400",

    gradient: "linear-gradient(112deg, $blue600 -3.59%, $blue500 -20.3%, $orange200 90.46%)",
    gradientShadow: "linear-gradient(112deg, $blue600 -3.59%, $blue700 -20.3%, $orange800 90.46%)",
    link: "$orange400",
    headerBackground: darkTransparent(0.8),
    background: "#020d14",
    backgroundContrast: dark,

    accents0: "$gray100",
  },
  space: {},
  fonts: {
    sans: "Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Roboto\", \"Oxygen\", \"Ubuntu\", \"Cantarell\", \"Fira Sans\", \"Droid Sans\", \"Helvetica Neue\", sans-serif",
    mono: "'Roboto Mono', Monaco, 'Lucida Console', 'Liberation Mono', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Courier New', monospace",
  },
  fontWeights: {
    lighter: "300",
    normal: "400",
    medium: "600",
    bold: "700",
    bolder: "800",
  }
};

function getThemeConfig(type = "light") {
  return createTheme({
    type,
    theme: type === "light" ? lightTheme : darkTheme,
  });
}

export default getThemeConfig;
