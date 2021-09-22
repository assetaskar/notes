<template>
  <main class="main">
    <div class="container">
      <header class="main__header">
        <the-search v-model.trim="search" />
        <div class="main__exit">
          <button class="main__exit-btn" @click="exitHandler"></button>
        </div>
      </header>
      <div v-if="isLoading">
        <the-loader />
        <the-loader />
        <the-loader />
      </div>
      <transition
        enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut"
        mode="out-in"
        duration="1000"
      >
        <div v-if="getNotes.length">
          <transition-group
            enter-active-class="animate__animated animate__fadeInLeft"
            leave-active-class="animate__animated animate__fadeOutRight"
            move-class="note-item-move"
          >
            <notes-item
              v-for="note of getNotes"
              :key="note.id"
              :data="note"
              @edit="openModalEdit"
            />
          </transition-group>
        </div>
        <div v-else-if="!getNotes.length && !isLoading" class="not">
          <img src="../assets/notes.svg" alt="notes-icon" />
          <p>Нет заметок</p>
        </div>
      </transition>
    </div>
  </main>
  <button class="modal-open" v-if="!isOpen" @click="openModalAdd"></button>
  <the-modal
    :isOpen="isOpen"
    @close="closeModalHandler"
    @handler="modalHandler"
    v-model:input.trim="input"
    v-model:textarea.trim="textarea"
  />
</template>

<script>
import { useRouter } from "vue-router";

import TheSearch from "@/components/TheSearch.vue";
import NotesItem from "@/components/NotesItem.vue";
import TheModal from "@/components/TheModal.vue";
import TheLoader from "@/components/TheLoader.vue";
import useNotes from "@/composables/useNotes.js";
import useNotesModal from "@/composables/useNotesModal.js";
import { exit } from "@/api/notes.js";

export default {
  name: "Notes",
  components: { TheSearch, NotesItem, TheModal, TheLoader },
  setup() {
    const router = useRouter();

    const { getNotes, search, isLoading } = useNotes();

    const {
      input,
      isOpen,
      textarea,
      modalHandler,
      openModalAdd,
      openModalEdit,
      closeModalHandler,
    } = useNotesModal();

    const exitHandler = exit(router);

    return {
      getNotes,
      input,
      textarea,
      isOpen,
      openModalAdd,
      closeModalHandler,
      search,
      exitHandler,
      modalHandler,
      openModalEdit,
      isLoading,
    };
  },
};
</script>

<style lang="scss" scoped>
.note-item-move {
  transition: transform 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.main {
  background-color: #ebebeb;
  min-height: 100vh;
  width: 100%;
  padding: 15px 0 70px;
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    justify-content: space-between;
    padding: 0 15px;
  }

  &__exit {
    display: flex;
    align-items: center;
    justify-content: center;

    &-btn {
      border: none;
      background-color: transparent;
      background-image: url("../assets/exit.svg");
      background-repeat: no-repeat;
      background-size: 90%;
      background-position: center;
      width: 25px;
      height: 37px;
      transition: 0.2s;

      &:hover {
        transform: scale(1.1);
      }

      &:active {
        transform: scale(0.9);
      }
    }
  }
}

.container {
  max-width: 500px;
  margin: 0 auto;
  padding: 0 10px;
}

.modal-open {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: hsl(252, 87%, 67%);
  background-image: url("../assets/plus.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 70%;
  box-shadow: 0 0 10px 0 hsl(252, 87%, 67%);
  color: #fff;
  outline: none;
  border: none;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
    background-color: hsl(252, 100%, 67%);
  }

  &:active {
    transform: scale(0.9);
    box-shadow: none;
  }
}

.not {
  text-align: center;
}
</style>
