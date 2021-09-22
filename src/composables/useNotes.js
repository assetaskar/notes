import { ref, computed } from "@vue/reactivity";
import { onUnmounted } from "@vue/runtime-core";
import { subscribe } from "../api/notes";

export default function useNotes() {
  const notes = ref([]);
  const isLoading = ref(true);
  const search = ref("");
  const unsubscribe = subscribe(notes, isLoading);

  const getNotes = computed(() => {
    if (!notes.value.length) return [];

    notes.value.sort((a, b) => b.timestamp - a.timestamp);
    const newNotes = notes.value.map((note) => {
      const timestamp = formatTimestamp(note.timestamp);
      return { ...note, timestamp };
    });
    if (!search.value) return newNotes;

    const regex = new RegExp(search.value, "i");
    return newNotes.filter(
      (note) => note.title.match(regex) || note.description.match(regex)
    );
  });

  onUnmounted(unsubscribe);

  return {
    getNotes,
    search,
    isLoading,
  };
}

function formatTimestamp(time) {
  const isToday = new Date().getDate() === new Date(time).getDate();
  const options = isToday
    ? { hour: "numeric", minute: "numeric" }
    : { day: "numeric", month: "long" };
  const method = isToday ? "toLocaleTimeString" : "toLocaleDateString";
  return new Date(time)[method]("ru-RU", options);
}
