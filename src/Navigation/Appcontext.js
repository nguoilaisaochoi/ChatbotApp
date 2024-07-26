import { createContext, useState } from "react";

export const Appcontext = createContext();
export const Appprovider = (props) => {
  const [isLogin, setIslogin] = useState(false);
  const [fromHistory, setFromhistory] = useState(false);
  const [isNew, setIsnew] = useState(true);
  const [isSend, setIssend] = useState(false);
  const [idchatrecent, setIdchatrecent] = useState([]);
  const [messages, setMessages] = useState([]);
  return (
    <Appcontext.Provider
      value={{
        isLogin,
        setIslogin,
        messages,
        setMessages,
        isNew,
        setIsnew,
        idchatrecent,
        setIdchatrecent,
        fromHistory,
        setFromhistory,
        isSend,
        setIssend,
      }}
    >
      {props.children}
    </Appcontext.Provider>
  );
};
