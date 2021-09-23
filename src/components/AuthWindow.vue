<template>
  <transition
    appear
    enter-active-class="animate__animated animate__bounceInRight"
    leave-active-class="animate__animated animate__bounceOutRight"
    mode="out-in"
    :duration="1000"
  >
    <div class="account" :key="authType">
      <h1 class="account__h1">{{ name.title }}</h1>
      <the-form @submit.prevent="submitHandler" :btn="name.btn">
        <the-form-input
          label="Email*"
          placeholder="yourname@company.com"
          :validation="v$.email"
          v-model.trim="state.email"
        />
        <the-form-input
          type="password"
          label="Пароль*"
          placeholder="******"
          :validation="v$.password"
          v-model.trim="state.password"
        />
      </the-form>
      <div class="account__toggle">
        {{ name.toggle.text }}
        <button class="account__toggle-btn" @click="toggleHandler">
          {{ name.toggle.btn }}
        </button>
      </div>
      <div class="account__footer">
        {{ new Date().getFullYear() }} Copyrights &copy; NOTES
      </div>
    </div>
  </transition>
</template>

<script>
import { useRouter } from "vue-router";

import TheForm from "./TheForm.vue";
import TheFormInput from "./TheFormInput.vue";

import useValidate from "@/composables/useValidate.js";
import useAuthType from "@/composables/useAuthType.js";

export default {
  name: "AuthWindow",

  components: { TheForm, TheFormInput },

  setup() {
    const router = useRouter();

    const { state, v$ } = useValidate();

    const { authType, name, toggleHandler, submitHandler } = useAuthType(
      router,
      state,
      v$
    );

    return {
      v$,
      state,
      name,
      submitHandler,
      toggleHandler,
      authType,
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
