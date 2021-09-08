<template>
  <div class="account">
    <h1 class="account__h1">{{ title }}</h1>
    <the-form @submit.prevent="submitHandler" :btn="btn">
      <the-form-input
        label="Email*"
        placeholder="yourname@company.com"
        :validation="v$.email"
        v-model="state.email"
      />
      <the-form-input
        type="password"
        label="Пароль*"
        placeholder="******"
        :validation="v$.password"
        v-model="state.password"
      />
    </the-form>
    <div class="account__toggle">
      {{ toggle.text }}
      <button class="account__toggle-btn" @click="toggleHandler">
        {{ toggle.btn }}
      </button>
    </div>
    <div class="account__footer">
      {{ new Date().getFullYear() }} Copyrights &copy; NOTES
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from "@vue/reactivity";
import useVuelidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import TheForm from "./TheForm.vue";
import TheFormInput from "./TheFormInput.vue";

export default {
  name: "AuthWindow",

  components: { TheForm, TheFormInput },

  setup() {
    const state = reactive({
      email: "",
      password: "",
    });
    const rules = {
      email: { required, email },
      password: { required, minLength: minLength(6) },
    };
    const v$ = useVuelidate(rules, state);

    const auth = ref("signIn");

    const title = computed(() =>
      auth.value === "signIn" ? "Создать учетную запись" : "Вход в Ваш аккаунт"
    );
    const btn = computed(() =>
      auth.value === "signIn" ? "Зарегистрируйтесь сейчас" : "Войти"
    );
    const toggle = computed(() =>
      auth.value === "signIn"
        ? { text: "У меня есть аккаунт.", btn: "Войти" }
        : { text: "У вас нет аккаунта?", btn: "Зарегистрируйтесь сейчас" }
    );

    const toggleHandler = () => {
      v$.value.$reset();
      auth.value === "signIn"
        ? (auth.value = "login")
        : (auth.value = "signIn");
    };
    const submitHandler = () => {
      return;
    };

    return {
      v$,
      state,
      auth,
      title,
      btn,
      toggle,
      submitHandler,
      toggleHandler,
    };
  },
};
</script>

<style lang="scss" scoped>
.account {
  background-color: #fff;
  text-align: center;
  padding: 140px 55px 25px;
  color: #464a53;
  display: flex;
  flex-direction: column;

  &__h1 {
    font-size: 22px;
    margin-bottom: 20px;
  }

  &__toggle {
    flex-grow: 1;
    color: #abafb3;
    font-size: 15px;
    margin-bottom: 50px;

    &-btn {
      background-color: transparent;
      border: none;
      font-size: inherit;
      color: hsl(252, 87%, 67%);
      text-decoration-line: underline;

      &:hover {
        text-decoration-line: none;
        color: hsl(252, 100%, 67%);
      }
      &:focus {
        color: hsl(252, 100%, 67%);
        outline: none;
      }
    }
  }

  &__footer {
    font-size: 14px;
  }
}
</style>
