<template>
  <main class="main">
    <div class="container">
      <header class="main__header">
        <the-search v-model.trim="search" />
        <div class="main__exit">
          <button class="main__exit-btn" @click="exit"></button>
        </div>
      </header>
      <div>
        <notes-item v-for="note of sortData" :key="note.id" :data="note" />
      </div>
    </div>
  </main>
  <button
    class="modal-open"
    v-if="!isOpenModal"
    @click="openModalHandler"
  ></button>
  <the-modal
    :isOpen="isOpenModal"
    @close="closeModalHandler"
    @handler="pushData"
    v-model:input="input"
    v-model:textarea="textarea"
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
  onChildAdded,
  onChildRemoved,
  onChildChanged,
} from "firebase/database";

import TheSearch from "@/components/TheSearch.vue";
import NotesItem from "@/components/NotesItem.vue";
import TheModal from "../components/TheModal.vue";

export default {
  name: "Notes",
  components: { TheSearch, NotesItem, TheModal },
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

    const unsubscribeAdded = onChildAdded(notesRef, (note) => {
      data.value.push({
        id: note.key,
        title: note.val().title,
        description: note.val().description,
        timestamp: note.val().timestamp,
      });
    });
    const unsubscribeRemoved = onChildRemoved(notesRef, (note) => {
      const index = data.value.findIndex((item) => item.id === note.key);
      data.value.splice(index, 1);
    });
    const unsubscribeChanged = onChildChanged(notesRef, (note) => {
      const index = data.value.findIndex((item) => item.id === note.key);
      Object.assign(data.value[index], note.val());
    });

    const sortData = computed(() => {
      data.value.sort((a, b) => b.timestamp - a.timestamp);
      const newData = data.value.map((item) => {
        const timestamp = formatTimestamp(item.timestamp);
        return { ...item, timestamp };
      });
      if (!search) return newData;
      const regex = new RegExp(search.value, "i");
      return newData.filter(
        (d) => d.title.match(regex) || d.description.match(regex)
      );
    });

    function openModalHandler() {
      isOpenModal.value = true;
    }
    function closeModalHandler() {
      isOpenModal.value = false;
      reset();
    }
    function reset() {
      input.value = textarea.value = "";
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

    onUnmounted(() => {
      unsubscribeAdded();
      unsubscribeRemoved();
      unsubscribeChanged();
    });

    return {
      sortData,
      input,
      textarea,
      isOpenModal,
      openModalHandler,
      closeModalHandler,
      pushData,
      search,
      exit,
    };
  },
};
</script>

<style lang="scss" scoped>
.main {
  background-color: #ebebeb;
  min-height: 100vh;
  width: 100%;
  padding: 15px 0;

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
</style>
