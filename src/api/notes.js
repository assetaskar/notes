import {
  onValue,
  ref,
  getDatabase,
  push,
  set,
  update,
} from "@firebase/database";
import { getAuth, signOut } from "firebase/auth";

export function subscribe(data, loading) {
  const db = getDatabase();
  const auth = getAuth();
  const userId = auth.currentUser.uid;
  const notesRef = ref(db, "notes/" + userId);
  return onValue(notesRef, (snapshot) => {
    data.value = [];
    if (snapshot.exists()) {
      const response = snapshot.val();
      for (const key in response) {
        data.value.push({
          id: key,
          ...response[key],
        });
      }
    }
    loading.value = false;
  });
}

export function pushing(data) {
  const db = getDatabase();
  const auth = getAuth();
  const userId = auth.currentUser.uid;
  const notesRef = ref(db, "notes/" + userId);
  const newPostRef = push(notesRef);
  set(newPostRef, data);
}

export function editing(id, data) {
  const db = getDatabase();
  const auth = getAuth();
  const userId = auth.currentUser.uid;
  update(ref(db, `notes/${userId}/${id}`), data);
}

export function exit(router) {
  const auth = getAuth();
  return () => {
    signOut(auth)
      .then(() => {
        router.push({ name: "auth" });
      })
      .catch((error) => {
        console.log(error);
      });
  };
}
