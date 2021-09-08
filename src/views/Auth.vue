<template>
  <div class="auth">
    <div class="auth__left"></div>
    <auth-window class="auth__right" />
  </div>
</template>

<script>
import AuthWindow from "../components/AuthWindow.vue";

export default {
  name: "Auth",
  components: {
    AuthWindow,
  },
};
</script>

<style lang="scss" scoped>
.auth {
  display: flex;
  height: 100vh;
  overflow: hidden;

  &__left {
    flex-grow: 1;
    background-color: #7f63f4;
    color: #fff;
  }

  &__right {
    flex-grow: 1;
    max-width: 555px;
    overflow-y: auto;
  }
}
</style>
