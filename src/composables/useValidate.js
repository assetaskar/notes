import { reactive } from "@vue/reactivity";
import useVuelidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";

export default function useValidate() {
  const state = reactive({
    email: "",
    password: "",
  });
  const rules = {
    email: { required, email },
    password: { required, minLength: minLength(6) },
  };
  const v$ = useVuelidate(rules, state);

  return { state, v$ };
}
