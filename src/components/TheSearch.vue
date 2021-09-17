<template>
  <div class="wrap">
    <input
      type="text"
      placeholder="Поиск заметок"
      class="input"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <button
      class="btn"
      v-if="modelValue"
      @click="$emit('update:modelValue', '')"
    ></button>
  </div>
</template>

<script>
export default {
  name: "TheSearch",
  props: {
    modelValue: {
      required: true,
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  position: relative;
  background-color: #cfcfcf;
  margin-right: 15px;
  border-radius: 20px;
  padding: 10px 40px;

  &::before {
    content: "";
    width: 14px;
    height: 14px;
    position: absolute;
    left: 13px;
    top: calc(50% - 8px);
    background-image: url("../assets/search.svg");
    background-repeat: no-repeat;
  }
}

.input {
  width: 100%;
  border: none;
  font-size: 14px;
  background-color: inherit;

  &:focus {
    outline: none;
  }
}

.btn {
  position: absolute;
  right: 10px;
  top: calc(50% - 10px);
  background-color: #ebebeb;
  background-image: url("../assets/remove.svg");
  background-repeat: no-repeat;
  background-size: 70%;
  background-position: center;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  transition: 0.2s;

  &:active {
    transform: scale(0.9);
  }

  &:hover {
    transform: scale(1.1);
  }
}
</style>
