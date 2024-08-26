import router from "@/router";
import { authStore } from "@/stores/store_autenticacao";

const authMiddleware = async (to: any, from: any, next: any) => {
  const isAuthenticated = await checkUserAuthentication();

  if (isAuthenticated && to.path === "/login") {
    await router.push("/dashboard");
    return;
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    router.push("/login");
  } else if (to.meta.requiresGuest && isAuthenticated) {
    router.push("/dashboard");
  } else {
    next();
  }
};

const checkUserAuthentication = async () => {
  const result = await authStore.obterToken();
  if (result) return true;
};

export default authMiddleware;
