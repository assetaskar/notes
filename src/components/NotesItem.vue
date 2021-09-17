<template>
  <div class="wrap">
    <h4 class="title" v-if="note.title">{{ note.title }}</h4>
    <div
      class="description"
      :class="{ bold: !note.title }"
      v-if="note.description"
    >
      {{ note.description }}
    </div>
    <div class="time">{{ note.timestamp }}</div>
    <div class="buttons">
      <button class="buttons__btn dots"></button>
      <button class="buttons__btn edit" @click="openModal"></button>
      <button class="buttons__btn delete" @click="del"></button>
    </div>
  </div>
  <the-modal
    :isOpen="isOpen"
    v-model:input="change.title"
    v-model:textarea="change.description"
    @close="closeModal"
    @handler="edit"
  />
</template>

<script>
import { reactive, ref, toRefs } from "@vue/reactivity";

import { getDatabase, ref as fb_ref, remove, update } from "@firebase/database";
import { getAuth } from "@firebase/auth";

import TheModal from "./TheModal.vue";

export default {
  name: "NotesItem",
  components: { TheModal },
  props: {
    data: {
      required: true,
      type: Object,
    },
  },
  setup(props) {
    const { data: note } = toRefs(props);
    const change = reactive({
      title: "",
      description: "",
    });
    const isOpen = ref(false);

    const db = getDatabase();
    const auth = getAuth();
    const userId = auth.currentUser.uid;

    function del() {
      remove(fb_ref(db, `notes/${userId}/${note.value.id}`));
    }
    function edit() {
      update(fb_ref(db, `notes/${userId}/${note.value.id}`), {
        title: change.title,
        description: change.description,
        timestamp: Date.now(),
      });
      closeModal();
    }
    function openModal() {
      change.title = note.value.title;
      change.description = note.value.description;
      isOpen.value = true;
    }
    function closeModal() {
      isOpen.value = false;
      reset();
    }
    function reset() {
      change.title = change.description = "";
    }

    return { note, del, edit, isOpen, change, openModal, closeModal };
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  min-height: 105px;
  border-radius: 10px;
  background-color: #fff;
  padding: 20px 35px 20px 20px;
  font-size: 14px;
  margin-bottom: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.title {
  flex-grow: 1;
  margin-bottom: 8px;
}

.description {
  flex-grow: 1;
  margin-bottom: 8px;
  color: rgb(95, 95, 95);
  white-space: pre-wrap;

  &.bold {
    font-weight: bold;
    color: #000;
  }
}

.time {
  color: rgb(95, 95, 95);
  font-size: 12px;
}

.buttons {
  position: absolute;
  right: 5px;
  top: 10px;

  &__btn {
    background-color: #ebebeb;
    border: none;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    background-position: center;
    background-repeat: no-repeat;

    &:hover {
      background-color: hsl(252, 87%, 80%);
    }
  }

  &:hover {
    .edit,
    .delete {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
    }
  }
}

.dots {
  background-image: url("../assets/dots.svg");
  background-size: 60%;
  transition: 0.2s;

  &.active {
    background-color: hsl(252, 87%, 67%);
  }
}

.edit,
.delete {
  position: absolute;
  left: 0;
  transition: 0.5s;
  transform: translateY(-50%);
  visibility: hidden;
  opacity: 0;
}

.edit {
  background-image: url("../assets/edit.svg");
  background-size: 75%;
  top: 100%;
}

.delete {
  background-image: url("../assets/delete.svg");
  background-size: 50%;
  top: 200%;
}
</style>
