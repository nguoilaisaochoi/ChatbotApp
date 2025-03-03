export const Lightmode = {
  backgroundColor: "white",
  inputColor: "white",
  boderinputColor: "#676767",
  textColor: "black",
  itemchatColor: "white",
};
export const Darkmode = {
  backgroundColor: "#141718",
  inputColor: "#232627",
  boderinputColor: "#676767",
  textColor: "white",
  itemchatColor: "#232627",
};
export const getTheme = (isDarkMode) => {
  return isDarkMode ? Darkmode : Lightmode;
};
