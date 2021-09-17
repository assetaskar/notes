<template>
  <teleport v-if="isOpen" to="body">
    <div class="modal">
      <div class="modal__wrap">
        <div class="modal__buttons">
          <button
            class="modal__btn modal__btn-back"
            @click="$emit('close')"
          ></button>
          <button
            class="modal__btn modal__btn-check"
            v-if="input || textarea"
            @click="$emit('handler')"
          ></button>
        </div>
        <input
          type="text"
          class="modal__input"
          placeholder="Заголовок"
          :value="input"
          @input="$emit('update:input', $event.target.value)"
        />
        <the-textarea
          :value="textarea"
          @input="$emit('update:textarea', $event.target.value)"
          placeholder="Начните ввод"
        />
      </div>
    </div>
  </teleport>
</template>

<script>
import TheTextarea from "./TheTextarea.vue";

export default {
  components: { TheTextarea },
  props: {
    isOpen: {
      required: true,
      type: Boolean,
    },
    input: {
      required: true,
      type: String,
    },
    textarea: {
      required: true,
      type: String,
    },
  },
  emits: ["close", "handler", "update:input", "update:textarea"],
};
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  width: 100%;
  height: 100vh;
  background-color: hsl(0, 0%, 79%);
  left: 0;
  top: 0;
  padding: 10px;
  overflow: hidden;

  &__wrap {
    margin: 0 auto;
    max-width: 500px;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    height: calc(100vh - 20px);
    overflow: auto;
  }

  &__input {
    width: 100%;
    font-size: 20px;
    margin-bottom: 15px;
    border: none;
    font-weight: bold;

    &:focus {
      outline: none;
    }
  }

  &__buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;
  }

  &__btn {
    width: 25px;
    height: 25px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    background-color: transparent;
    border: none;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.9);
    }

    &-back {
      background-image: url("../assets/back.svg");
    }

    &-check {
      background-image: url("../assets/check.svg");
    }
  }
}
</style>
