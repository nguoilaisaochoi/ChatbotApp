export const Lightmode = {
  backgroundColor: "white",
  inputColor: "white",
  boderinputColor: "#676767",
  textColor: "black",
  itemchatColor: "white",
  drawerActiveBackgroundColor: "#323142",
  drawerActiveTintColor: "#A0A0A5",
  borderColor: "gray",
};
export const Darkmode = {
  backgroundColor: "#141718",
  inputColor: "#232627",
  boderinputColor: "#676767",
  textColor: "#A0A0A5",
  itemchatColor: "#232627",
  drawerActiveBackgroundColor: "#232627",
  drawerActiveTintColor: "#A0A0A5",
  borderColor: "white",
};
export const getTheme = (isDarkMode) => {
  return isDarkMode ? Darkmode : Lightmode;
};
