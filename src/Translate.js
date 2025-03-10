import { getLocales } from "expo-localization";

export const Translate = (textKey) => {
  const locales = getLocales();
  const languageCode = locales[0].languageCode;
  const translationsForLanguage =
    languageCode == "vi" ? translations["vi"] : translations["en"];
  return translationsForLanguage[textKey] || textKey;
};
const translations = {
  en: {
    version: "Version",
    signin: "Sign in",
    toyour: "to your",
    account: "account",
    username: "User name",
    password: "Password",
    signin: "Sign in",
    youdonothaveanaccount: "You do not have an account",
    signup: "Signup",
    orsigninwith: "Or sign in with",
    createyouraccount: "create your account",
  },
  vi: {
    version: "Phiên bản",
    signin: "Đăng nhập",
    toyour: "tài khoản",
    account: "của bạn",
    username: "Tên người dùng",
    password: "Mật khẩu",
    youdonothaveanaccount: "Bạn không có tài khoản",
    signup: "Đăng ký",
    orsigninwith: "Hoặc đăng nhập bằng",
    createyouraccount: "Tạo tài khoản của bạn",
  },
};
