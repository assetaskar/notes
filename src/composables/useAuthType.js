import { computed, ref } from "@vue/reactivity";

const text = {
  signIn: {
    title: "Создать учетную запись",
    btn: "Зарегистрируйтесь сейчас",
    toggle: { text: "У меня есть аккаунт.", btn: "Войти" },
  },
  logIn: {
    title: "Вход в Ваш аккаунт",
    btn: "Войти",
    toggle: {
      text: "У вас нет аккаунта?",
      btn: "Зарегистрируйтесь сейчас",
    },
  },
};

export default function useAuthType(validate, { signIn, login, changeError }) {
  const authType = ref("signIn");
  const name = computed(() =>
    authType.value === "signIn" ? text.signIn : text.logIn
  );

  function submitHandler() {
    validate.value.$touch();
    if (validate.value.$error) return;
    authType.value === "signIn" ? signIn() : login();
  }
  function toggleHandler() {
    changeError("");
    validate.value.$reset();
    authType.value = authType.value === "signIn" ? "login" : "signIn";
  }

  return { authType, name, toggleHandler, submitHandler };
}
