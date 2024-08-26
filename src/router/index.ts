// Composables
import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login/index.vue";
import ResetPassword from "../views/ResetPassword/index.vue";
import Site from "../views/Site/index.vue";
import Cadastro from "../views/Cadastro/index.vue";
import Layout from "../views/Layout/index.vue";
// isIntegrator

import midd_auth from "@/middleware/midd_auth";
import module_admin from "@/router/modules/module_admin";

// Use o objeto useAuthStore

const routes = [
  {
    base: "/index.html",
    path: "/",
    name: "main",
    component: Login,
  },
  {
    path: "/reset-password",
    component: ResetPassword,
  },
  {
    path: "/dashboard",
    component: Layout,
    meta: { requiresAuth: true },
    children: [...module_admin],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// router.beforeEach((to, from) => {
//   return true;
// });

router.beforeEach(midd_auth);

export default router;
