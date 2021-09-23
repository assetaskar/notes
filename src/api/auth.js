import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "@firebase/auth";

export function sign_in(router, state) {
  const auth = getAuth();
  return () => {
    createUserWithEmailAndPassword(auth, state.email, state.password)
      .then((userCredential) => {
        const user = userCredential.user;
        router.push({ name: "notes", params: { id: user.uid } });
      })
      .catch((error) => {
        console.log(error.errorCode);
        console.log(error.errorMessage);
      });
  };
}

export function log_in(router, state) {
  const auth = getAuth();
  return () => {
    signInWithEmailAndPassword(auth, state.email, state.password)
      .then((userCredential) => {
        const user = userCredential.user;
        router.push({ name: "notes", params: { id: user.uid } });
      })
      .catch((error) => {
        console.log(error.errorCode);
        console.log(error.errorMessage);
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
