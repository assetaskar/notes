import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Auth = () => import(/* webpackChunkName: "auth" */ "../views/Auth.vue");
const Notes = () =>
  import(/* webpackChunkName: "notes" */ "../views/Notes.vue");

const routes = [
  {
    path: "/",
    name: "auth",
    component: Auth,
    beforeEnter: (to, from, next) => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          next({ name: "notes", params: { id: user.uid } });
        } else {
          next();
        }
      });
      unsubscribe();
    },
  },
  {
    path: "/notes/:id",
    name: "notes",
    component: Notes,
    beforeEnter: (to, from, next) => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          next({ name: "auth" });
        } else if (to.params.id !== user.uid) {
          next({ params: { id: user.uid } });
        } else {
          next();
        }
      });
      unsubscribe();
    },
  },
  {
    path: "/:pathMatch(.*)",
    redirect: {
      name: "auth",
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
