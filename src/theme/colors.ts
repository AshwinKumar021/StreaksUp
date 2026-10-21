const colors = {
  background: "#17142B",
  backgroundDeep: "#100E20",
  surface: "#211E39",
  surfaceRaised: "#2B2747",
  border: "#3A3558",
  text: "#FFFFFF",
  logoutBtnClr: "#FFFFFF",
  buttonClr: "#FFFFFF",
  textMuted: "#B6B1CA",
  textSubtle: "#85809E",
  accentStart: "#FF9A44",
  accentEnd: "#F45B83",
  accent: "#FF815E",
  success: "#62D6A4",
  warning: "#FFD166",
  error: "#FF7285",
  white: "#FFFFFF",
  transparent: "transparent",
} as const;

export type AppColors = { [Key in keyof typeof colors]: string };

export const habitColors = {
  water: "#16865B",
  reading: "#8E5700",
  movement: "#C85B00",
  journal: "#D63C68",
} as const;

export const lightColors: AppColors = {
  background: "#FFF9F5",
  backgroundDeep: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceRaised: "#F1ECF7",
  border: "#E2DCEB",
  text: "#27223B",
  buttonClr: "#FFFFFF",
  logoutBtnClr: "#17142B",
  textMuted: "#68627A",
  textSubtle: "#756F84",
  accentStart: "#ee7715",
  accentEnd: "#D63C68",
  accent: "#D96B4B",
  success: "#16865B",
  warning: "#d9b64b",
  error: "#C9364D",
  white: "#FFFFFF",
  transparent: "transparent",
};

export default colors;
