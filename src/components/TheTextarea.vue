<template>
  <textarea rows="1" ref="textarea" class="textarea"></textarea>
</template>

<script>
import autosize from "autosize";

export default {
  name: "TheTextarea",
  mounted() {
    autosize(this.$refs.textarea);
    this.$refs.textarea.focus();
  },
  beforeUnmount() {
    autosize.destroy(this.$refs.textarea);
  },
};
</script>

<style lang="scss" scoped>
.textarea {
  width: 100%;
  resize: none;
  font-size: 14px;
  line-height: 1.2;
  border: none;
  -ms-overflow-style: none;
  scrollbar-width: none;
  font-family: inherit;

  &::-webkit-scrollbar {
    width: 0;
  }

  &:focus {
    outline: none;
  }
}
</style>
