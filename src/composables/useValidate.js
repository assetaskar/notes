import { reactive } from "@vue/reactivity";
import useVuelidate from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";

export default function useValidate() {
  const state = reactive({
    email: "",
    password: "",
  });
  const customRequired = helpers.withMessage("Обязательное поле", required);
  const customEmail = helpers.withMessage(
    "Значение не является допустимым адресом электронной почты",
    email
  );
  const customMinLength = helpers.withMessage(
    "Это поле должно быть не менее 6 символов",
    minLength(6)
  );
  const rules = {
    email: { customRequired, customEmail },
    password: { customRequired, customMinLength },
  };
  const v$ = useVuelidate(rules, state);

  return { state, v$ };
}
