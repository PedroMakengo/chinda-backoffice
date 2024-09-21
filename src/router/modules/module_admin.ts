import { RouteRecordRaw } from "vue-router";

import Utentes from "@/views/Utentes/index.vue";
import Especialistas from "@/views/Especialistas/index.vue";
import Sintomas from "@/views/Sintomas/index.vue";
import Pedidos from "@/views/Pedidos/index.vue";
import Perfil from "@/views/Perfil/index.vue";
import Medicos from "@/views/Medicos/index.vue";
import Home from "@/views/Home/index.vue";
import Consultas from "@/views/Consultas/index.vue";
import Disponibilidade from "@/views/Disponibilidade/index.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/dashboard",
    component: Home,
  },
  {
    path: "/dashboard/utentes",
    component: Utentes,
  },
  {
    path: "/dashboard/especializacao",
    component: Especialistas,
  },
  {
    path: "/dashboard/pedidos",
    component: Pedidos,
  },
  {
    path: "/dashboard/sintomas",
    component: Sintomas,
  },
  {
    path: "/dashboard/perfil",
    component: Perfil,
  },
  {
    path: "/dashboard/medicos",
    component: Medicos,
  },
  {
    path: "/dashboard/consultas",
    component: Consultas,
  },
  {
    path: "/dashboard/disponibilidade",
    component: Disponibilidade,
  },
];

export default routes;
