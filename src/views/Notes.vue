<template>
  <h1>Test</h1>
  <button @click="exit">exit</button>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

export default {
  name: "Main",

  setup() {
    const router = useRouter();

    const exit = () => {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          router.push({ name: "auth" });
        })
        .catch((error) => {
          console.log(error);
        });
    };

    return { exit };
  },
};
</script>
