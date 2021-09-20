<template>
  <main class="main">
    <div class="container">
      <header class="main__header">
        <the-search v-model.trim="search" />
        <div class="main__exit">
          <button class="main__exit-btn" @click="exit"></button>
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
        <div v-if="sortData.length">
          <transition-group
            enter-active-class="animate__animated animate__fadeInLeft"
            leave-active-class="animate__animated animate__fadeOutRight"
            move-class="note-item-move"
          >
            <notes-item
              v-for="note of sortData"
              :key="note.id"
              :data="note"
              @edit="openModalEdit"
            />
          </transition-group>
        </div>
        <div v-else-if="!sortData.length && !isLoading" class="not">
          <img src="../assets/notes.svg" alt="notes-icon" />
          <p>Нет заметок</p>
        </div>
      </transition>
    </div>
  </main>
  <button class="modal-open" v-if="!isOpenModal" @click="openModalAdd"></button>
  <the-modal
    :isOpen="isOpenModal"
    @close="closeModalHandler"
    @handler="modalHandler"
    v-model:input.trim="input"
    v-model:textarea.trim="textarea"
  />
</template>

<script>
import { computed, ref } from "@vue/reactivity";
import { onUnmounted } from "@vue/runtime-core";
import { useRouter } from "vue-router";

import { getAuth, signOut } from "firebase/auth";
import {
  getDatabase,
  ref as fb_ref,
  push,
  set,
  update,
  onValue,
} from "firebase/database";

import TheSearch from "@/components/TheSearch.vue";
import NotesItem from "@/components/NotesItem.vue";
import TheModal from "@/components/TheModal.vue";
import TheLoader from "@/components/TheLoader.vue";

export default {
  name: "Notes",
  components: { TheSearch, NotesItem, TheModal, TheLoader },
  setup() {
    const router = useRouter();
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase();
    const notesRef = fb_ref(db, "notes/" + userId);
    const data = ref([]);
    const input = ref("");
    const textarea = ref("");
    const isOpenModal = ref(false);
    const search = ref("");
    const modalHandler = ref(null);
    const isLoading = ref(true);

    const unsubscribe = onValue(notesRef, (snapshot) => {
      data.value = [];
      if (snapshot.exists()) {
        const notes = snapshot.val();
        for (const key in notes) {
          data.value.push({
            id: key,
            ...notes[key],
          });
        }
      }
      if (isLoading.value) {
        isLoading.value = false;
      }
    });

    const sortData = computed(() => {
      if (!data.value.length) return [];
      data.value.sort((a, b) => b.timestamp - a.timestamp);
      const newData = data.value.map((item) => {
        const timestamp = formatTimestamp(item.timestamp);
        return { ...item, timestamp };
      });
      if (!search.value) return newData;
      const regex = new RegExp(search.value, "i");
      return newData.filter(
        (d) => d.title.match(regex) || d.description.match(regex)
      );
    });

    function openModalAdd() {
      modalHandler.value = pushData;
      isOpenModal.value = true;
    }
    function openModalEdit(note) {
      modalHandler.value = editData.bind(null, note.id);
      input.value = note.title;
      textarea.value = note.description;
      isOpenModal.value = true;
    }
    function closeModalHandler() {
      isOpenModal.value = false;
      reset();
    }
    function reset() {
      input.value = textarea.value = "";
      modalHandler.value = null;
    }
    function pushData() {
      const newPostRef = push(notesRef);
      set(newPostRef, {
        title: input.value,
        description: textarea.value,
        timestamp: Date.now(),
      });
      closeModalHandler();
    }
    function editData(id) {
      update(fb_ref(db, `notes/${userId}/${id}`), {
        title: input.value,
        description: textarea.value,
        timestamp: Date.now(),
      });
      closeModalHandler();
    }
    function formatTimestamp(time) {
      const isToday = new Date().getDate() === new Date(time).getDate();
      const options = isToday
        ? { hour: "numeric", minute: "numeric" }
        : { day: "numeric", month: "long" };
      const method = isToday ? "toLocaleTimeString" : "toLocaleDateString";
      return new Date(time)[method]("ru-RU", options);
    }
    function exit() {
      signOut(auth)
        .then(() => {
          router.push({ name: "auth" });
        })
        .catch((error) => {
          console.log(error);
        });
    }

    onUnmounted(unsubscribe);

    return {
      sortData,
      input,
      textarea,
      isOpenModal,
      openModalAdd,
      closeModalHandler,
      search,
      exit,
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
