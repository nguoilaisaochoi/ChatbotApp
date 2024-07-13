import { createContext, useState } from "react";

export const Appcontext = createContext();
export const Appprovider = (props) => {
  const [isLogin, setIslogin] = useState(false);
  return (
    <Appcontext.Provider value={{ isLogin, setIslogin }}>{props.children}</Appcontext.Provider>
  );
};
