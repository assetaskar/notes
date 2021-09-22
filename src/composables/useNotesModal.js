import { ref } from "@vue/reactivity";
import { editing, pushing } from "../api/notes";

export default function useNotesModal() {
  const input = ref("");
  const textarea = ref("");
  const isOpen = ref(false);
  const modalHandler = ref(null);

  return {
    input,
    isOpen,
    textarea,
    modalHandler,
    openModalAdd,
    openModalEdit,
    closeModalHandler,
  };

  function openModalAdd() {
    modalHandler.value = pushNote;
    isOpen.value = true;
  }
  function openModalEdit(note) {
    modalHandler.value = editNote.bind(null, note.id);
    input.value = note.title;
    textarea.value = note.description;
    isOpen.value = true;
  }
  function closeModalHandler() {
    isOpen.value = false;
    reset();
  }
  function reset() {
    input.value = textarea.value = "";
    modalHandler.value = null;
  }
  function pushNote() {
    pushing({
      title: input.value,
      description: textarea.value,
      timestamp: Date.now(),
    });
    closeModalHandler();
  }
  function editNote(id) {
    editing(id, {
      title: input.value,
      description: textarea.value,
      timestamp: Date.now(),
    });
    closeModalHandler();
  }
}
