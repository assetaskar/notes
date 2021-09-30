import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "@firebase/auth";

export function sign_in(router, state, callbackError) {
  const auth = getAuth();
  return () => {
    createUserWithEmailAndPassword(auth, state.email, state.password)
      .then(({ user }) => {
        callbackError("");
        router.push({ name: "notes", params: { id: user.uid } });
      })
      .catch(({ code }) => {
        code === "auth/email-already-in-use" &&
          callbackError("Email уже существует");
      });
  };
}

export function log_in(router, state, callbackError) {
  const auth = getAuth();
  return () => {
    signInWithEmailAndPassword(auth, state.email, state.password)
      .then(({ user }) => {
        callbackError("");
        router.push({ name: "notes", params: { id: user.uid } });
      })
      .catch(({ code }) => {
        code === "auth/user-not-found" &&
          callbackError("Пользователь не найден");
      });
  };
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
