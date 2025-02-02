// router/index.js
import { createRouter, createWebHistory } from "vue-router";

import Index from "../pages/index.vue";
import NewYearEvent from "../pages/NewYearEvent/index.vue";

const routes = [
  {
    path: "/",
    name: "Playgroud",
    component: Index,
  },
  {
    path: "/new_year_event",
    name: "Happy New Year",
    component: NewYearEvent,
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
