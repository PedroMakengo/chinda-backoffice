import { Empresa, Utilizador } from "./../Domain/Entities/index";
import { defineStore } from "pinia";

import { localdb } from "@/Infra/localstorage";
interface User {
  name: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  empresa: Empresa | null;
}

class AuthStore {
  [x: string]: any;
  constructor() {
    defineStore("auth", {
      state: (): AuthState => ({
        token: <string | null>localStorage.getItem("token"),
        user: <User | null>JSON.parse(localStorage.getItem("user") || "null"),
        empresa: <Empresa | null>(
          JSON.parse(localStorage.getItem("empresa") || "null")
        ),
      }),
    });
  }

  async salvarToken(token: string) {
    await localdb.save("token", token);
  }

  async salvarUtilizador(utilizador: Utilizador) {
    await localdb.save("utilizador", utilizador);
  }

  async obterToken() {
    await localdb.read("token").then((v) => {
      return v;
    });
    return await localdb.read("token");
  }

  async deleteToken() {
    return await localdb.remove("token");
  }

  async deleteUtilizador() {
    return await localdb.remove("utilizador");
  }

  async havePermissions(params: any) {
    const user = (await localdb.read("user")) as any;
    console.log("userr,", user);
    return await localdb.remove("empresa");
  }
}

export const authStore: AuthStore = new AuthStore();
