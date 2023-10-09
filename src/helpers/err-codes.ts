type ErrorMessage = { code: number; message: string; status: number };

export const _WRONG_PARAMS_: ErrorMessage = { code: 4060, message: "Անթույլատրելի պարամետրեր", status: 406 };
export const _VALIDATION_ERROR_: ErrorMessage = { code: 4061, message: "Վալիդացիայի ձախողում", status: 406 };
export const _WRONG_LOGIN_OR_PASSWORD: ErrorMessage = {
  code: 4010,
  message: "Սխալ ծածկանուն կամ գաղտնաբառ",
  status: 401,
};
export const _NOT_AVAILABLE_TO_USER_: ErrorMessage = { code: 4031, message: "Օգտատիրոջը հասանելի չէ", status: 403 };
export const _RESOURCE_NOT_FOUND_: ErrorMessage = { code: 4041, message: "Հասցեն չի գտնվել", status: 404 };
export const _TOKEN_IS_WRONG_: ErrorMessage = { code: 4030, message: "Վավերացման ձախողում", status: 403 };
export const _RESET_CODE_IS_WRONG_: ErrorMessage = { code: 4062, message: "Վավերացման կոդը սխալ է", status: 406 };
export const _OLD_PASSWORD_IS_WRONG_: ErrorMessage = { code: 4063, message: "Old password is wrong", status: 406 };
export const _INSUFFICIENT_BALANCE: ErrorMessage = { code: 4041, message: "Անբավարար հաշիվ ", status: 404 };
// _USER_NOT_FOUND_ = { code: 4041,  message: `Օգտատեր չի գտնվել` };
export const _USER_DOES_NOT_HAVE_ACCESS_: ErrorMessage = {
  code: 4032,
  message: "Օգտատերը իրավունք չունի",
  status: 403,
};
export const _CANT_SEND_MAIL_: ErrorMessage = { code: 1444, message: "Նամակը հաջողությամբ չի ուղարկվել", status: 500 };
export const _TECHNICAL_DIFFICULTIES_: ErrorMessage = { code: 5000, message: "Technical Difficulties", status: 500 };
