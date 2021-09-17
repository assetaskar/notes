<template>
  <div :class="{ error: validation.$error, mb: true }">
    <label class="form__label">{{ label }}</label>
    <input
      :type="type"
      class="form__input"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="validation.$touch"
      autocomplete="off"
    />
    <p v-for="error of validation.$errors" :key="error.$uid">
      {{ error.$message }}
    </p>
  </div>
</template>

<script>
export default {
  name: "TheFormInput",

  props: {
    type: {
      default: "text",
      type: String,
    },
    label: {
      required: true,
      type: String,
    },
    validation: {
      required: true,
      type: Object,
    },
    modelValue: {
      required: true,
      type: String,
    },
    modelModifiers: null,
    placeholder: {
      type: String,
    },
  },

  emits: ["update:modelValue"],
};
</script>

<style lang="scss" scoped>
.form {
  &__label {
    display: block;
    margin-bottom: 5px;
  }

  &__input {
    font-size: 15px;
    padding: 18px;
    border: 1px solid #dddfe1;
    width: 100%;

    &::placeholder {
      color: #abafb3;
    }

    &:focus {
      outline: none;
      border-color: #7f63f4;
    }
  }
}

.error {
  .form__input {
    border-color: hsl(0, 100%, 60%);
  }

  p {
    color: hsl(0, 100%, 60%);
    font-size: 12px;
  }
}

.mb {
  margin-bottom: 20px;
}
</style>
