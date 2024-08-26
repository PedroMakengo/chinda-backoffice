import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import Toaster from "@meforma/vue-toaster";
import ToastPlugin, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

import "./assets/styles/global.scss";

import { registerPlugins } from "@/plugins";

const pinia = createPinia();
const app = createApp(App);

app.use(Toaster);
app.use(pinia);
app.use(ToastPlugin, { position: POSITION.TOP_RIGHT });

registerPlugins(app);
app.mount("#app");
