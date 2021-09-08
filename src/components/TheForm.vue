<template>
  <form class="form">
    <slot></slot>
    <div class="form__btn-wrap">
      <button type="submit" class="form__btn">{{ btn }}</button>
    </div>
  </form>
</template>

<script>
export default {
  name: "TheForm",
  props: ["btn"],
};
</script>

<style lang="scss" scoped>
.form {
  text-align: left;
  margin-bottom: 30px;

  &__btn {
    font-size: 18px;
    background-color: hsl(252, 87%, 67%);
    color: #fff;
    padding: 15px 40px;
    border: none;
    border-radius: 2em;

    &-wrap {
      text-align: center;
    }

    &:hover,
    &:focus {
      background-color: hsl(252, 97%, 67%);
      box-shadow: 0 0 10px 0 hsl(252, 97%, 67%);
      outline: none;
    }
  }
}
</style>
