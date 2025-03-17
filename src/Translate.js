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
    signup: "Sign up",
    orsigninwith: "Or sign in with",
    createyouraccount: "create your account",
    accountname: "Account name",
    password: "Password",
    createyouraccount: "Create your account?",
    alreadyhaveanaccount: "Already have an account?",
    accountnamereg: "Account name (6 characters or more)",
    nickname: "Nickname (max 20 characters)",
    passwordreg: "Password (8 characters or more)",
    confirmpassword: "Confirm password",
    notice: "Notice",
    pleasefullinfor: "Please enter full information",
  },
  vi: {
    version: "Phiên bản",
    signin: "Đăng nhập",
    toyour: "tài khoản",
    account: "của bạn",
    username: "Tên người dùng",
    password: "Mật khẩu",
    youdonothaveanaccount: "Bạn chưa có tài khoản",
    signup: "Đăng ký",
    orsigninwith: "Hoặc đăng nhập bằng",
    createyouraccount: "Tạo tài khoản của bạn",
    accountname: "Tên tài khoản",
    password: "Mật khẩu",
    createyouraccount: "Tạo tài khoản của bạn?",
    alreadyhaveanaccount: "Đã có tài khoản?",
    accountnamereg: "Tên tài khoản (6 ký tự trở lên)",
    nickname: "Biệt danh (tối đa 20 ký tự)",
    passwordreg: "Mật khẩu (8 ký tự trở lên)",
    confirmpassword: "Xác nhận mật khẩu",
    notice: "Thông báo",
    pleasefullinfor: "Hãy nhập đầy đủ thông tin",
  },
};
