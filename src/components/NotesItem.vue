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
      <button class="buttons__btn edit" @click="$emit('edit', note)"></button>
      <button class="buttons__btn delete" @click="del"></button>
    </div>
  </div>
</template>

<script>
import { toRefs } from "@vue/reactivity";

import { getDatabase, ref as fb_ref, remove } from "@firebase/database";
import { getAuth } from "@firebase/auth";

export default {
  name: "NotesItem",
  props: {
    data: {
      required: true,
      type: Object,
    },
  },
  emits: ["edit"],
  setup(props) {
    const { data: note } = toRefs(props);

    const db = getDatabase();
    const auth = getAuth();
    const userId = auth.currentUser.uid;

    function del() {
      remove(fb_ref(db, `notes/${userId}/${note.value.id}`));
    }

    return { note, del };
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  min-height: 105px;
  border-radius: 10px;
  background-color: #fff;
  padding: 13px 35px 20px 20px;
  font-size: 14px;
  margin-bottom: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.title {
  flex-grow: 1;
  font-weight: normal;

  &::first-line {
    line-height: 2;
    font-weight: bold;
  }
}

.description {
  flex-grow: 1;
  margin-bottom: 8px;
  color: rgb(95, 95, 95);
  white-space: pre-wrap;

  &.bold::first-line {
    font-weight: bold;
    color: #000;
    line-height: 2;
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
