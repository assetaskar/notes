import { ref } from "@vue/reactivity";

export default function useAuthError() {
  const error = ref("");

  function changeError(message) {
    error.value = message;
  }

  return { error, changeError };
}
