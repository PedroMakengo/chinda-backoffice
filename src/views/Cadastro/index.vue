<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import Header from "@/components/Site/Header/index.vue";
import TitleModal from "@/components/TitleModal/index.vue";
import { UsecaseAdicionarPedidos } from "@/Domain/Usecases/Pedidos/usecase_adicionar_pedidos";
import { UsecaseListaEspecializacoes } from "@/Domain/Usecases/Especializacoes/usecase_lista_especializacoes";
import { UsecaseListaProvincias } from "@/Domain/Usecases/Provincias/usecase_lista_provincias";

import { useToast } from "vue-toastification";

export default defineComponent({
  components: { Header, TitleModal },
  setup() {
    const toast = useToast();

    const forms = ref<any>({
      nome: undefined!,
      sobrenome: undefined!,
      telefone: undefined!,
      tipoIdentificacao: undefined!,
      numeroDocumento: undefined!,
      utilizador: undefined!,
      email: undefined!,
      especializacao: undefined!,
      hospital: undefined!,
      cidade: undefined!,
      pais: undefined!,
      dataInicio: undefined!,
      dataFim: undefined!,
    });
    const modalAddVinculos = ref(false);
    const dataVinculos = ref<any>([]);
    const dataFiles = ref<any>([]);
    const selectedFile = ref(null);
    const modalAdicionarArquivos = ref(false);

    const dataTipoIdentificacao = ref([
      {
        name: "BI",
        tipo: 0,
      },
      {
        name: "Passaporte",
        tipo: 1,
      },
      {
        name: "Carta de Condução",
        tipo: 0,
      },
    ]);
    const dataEspecializacao = ref<any>([]);
    const dataProvincias = ref<any>([]);

    const file = ref(null);
    const fileNameDocumento = ref<any>("");
    const fileDocumentoBase64 = ref<any>("");
    const filesCertificados = ref<any>([]);
    const filesOutrosDocumentos = ref<any>([]);
    const fileNameOrdemMedicos = ref<any>("");
    const fileDocumentoMedicos64 = ref<any>("");
    const loadingInserirPedido = ref(false);

    const handleFileUploadDocumentoIdentifcacao = (event: any) => {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        file.value = selectedFile;
        fileNameDocumento.value = selectedFile.name;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          let base64String = e.target.result.split(",")[1];
          fileDocumentoBase64.value = base64String;
        };

        reader.readAsDataURL(selectedFile);
      }
    };

    const handleFileUploadCertificadoTrabalho = (event: any) => {
      const selectedFiles = Array.from(event.target.files);

      filesCertificados.value = [];

      selectedFiles.forEach((file: any) => {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          let base64String = e.target.result.split(",")[1];

          filesCertificados.value.push({
            fileName: file.name,
            content: base64String,
          });
        };

        reader.readAsDataURL(file);
      });
    };

    const handleFileUploadCedulaOrdemMedicos = (event: any) => {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        fileNameOrdemMedicos.value = selectedFile.name;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          let base64String = e.target.result.split(",")[1];
          fileDocumentoMedicos64.value = base64String;
        };

        reader.readAsDataURL(selectedFile);
      }
    };

    const handleFileUploadOutrosDocumentos = (event: any) => {
      const selectedFiles = Array.from(event.target.files);

      filesOutrosDocumentos.value = [];

      selectedFiles.forEach((file: any) => {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          let base64String = e.target.result.split(",")[1];
          filesOutrosDocumentos.value.push({
            fileName: file.name,
            content: base64String,
          });
        };

        reader.readAsDataURL(file);
      });
    };

    const handleSubmitVinculos = () => {
      modalAddVinculos.value = true;
    };

    const buscarListaEspecializacao = async () => {
      const query = `?pageNumber=1&pageSize=100`;
      const response = await UsecaseListaEspecializacoes.handler(query);
      dataEspecializacao.value = response?.object.items;
    };

    const buscarListaProvincias = async () => {
      const query = `?pageNumber=1&pageSize=100`;
      const response = await UsecaseListaProvincias.handler(query);
      dataProvincias.value = response?.object.items;
    };

    const onSubmitVinculos = () => {
      const data = {
        hospital: forms.value.hospital,
        cidade: forms.value.cidade,
        pais: forms.value.pais,
        dataInicio: forms.value.dataInicio,
        dataFim: forms.value.dataFim,
      };
      dataVinculos.value.push(data);

      // forms.value = {
      //   hospital: undefined!,
      //   cidade: undefined!,
      //   pais: undefined!,
      //   dataInicio: undefined!,
      //   dataFim: undefined!,
      // };
      modalAddVinculos.value = false;
    };

    const onSubmitPedidos = async () => {
      loadingInserirPedido.value = true;
      const files = [
        {
          fileName: fileNameDocumento.value,
          content: fileDocumentoBase64.value,
        },
        {
          fileName: fileNameOrdemMedicos.value,
          content: fileDocumentoMedicos64.value,
        },
        ...filesCertificados.value,
      ];

      const data = {
        nome: forms.value.nome,
        sobrenome: forms.value.sobrenome,
        telefone: forms.value.telefone,
        tipoIdentificacao: forms.value.tipoIdentificacao,
        numeroDocumento: forms.value.numeroDocumento,
        utilizador: forms.value.utilizador,
        email: forms.value.email,
        especializacao: forms.value.especializacao,
        vinculos: dataVinculos.value,
        files,
      };

      console.log("File Certificados :", files);
      console.log(data);

      const response = await UsecaseAdicionarPedidos.store(data);

      if (response?.success) {
        toast.success("Pedido de cadastro realizado com sucesso!", {
          timeout: 3000,
        });

        forms.value = {
          hospital: undefined!,
          cidade: undefined!,
          pais: undefined!,
          dataInicio: undefined!,
          dataFim: undefined!,
        };

        fileNameDocumento.value = null;
        fileDocumentoBase64.value = null;
        filesCertificados.value = null;
        filesOutrosDocumentos.value = null;
        fileNameOrdemMedicos.value = null;
        fileDocumentoMedicos64.value = null;

        loadingInserirPedido.value = false;
      } else {
        toast.error(`${response?.object.detail}`, {
          timeout: 3000,
        });
        loadingInserirPedido.value = false;
      }
    };

    onMounted(() => {
      buscarListaEspecializacao();
      buscarListaProvincias();
    });

    return {
      forms,
      onSubmitVinculos,
      handleFileUploadDocumentoIdentifcacao,
      handleFileUploadCertificadoTrabalho,
      handleFileUploadCedulaOrdemMedicos,
      handleFileUploadOutrosDocumentos,
      modalAddVinculos,
      modalAdicionarArquivos,
      dataVinculos,
      handleSubmitVinculos,
      onSubmitPedidos,
      dataTipoIdentificacao,
      dataEspecializacao,
      dataProvincias,
      loadingInserirPedido,
    };
  },
});
</script>

<template>
  <main>
    <Header :isCadastro="true" />
    <div class="banner-register"></div>

    <div class="section">
      <div class="container">
        <v-row>
          <v-col cols="12" md="12">
            <div class="formulario">
              <form class="spacing" @submit.prevent="onSubmitPedidos">
                <v-row>
                  <v-col cols="12" md="12">
                    <div class="borderItems">
                      <p>Informações Pessoais</p>
                    </div>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" md="8">
                    <v-text-field
                      label="Nome"
                      v-model="forms.nome"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Sobrenome"
                      v-model="forms.sobrenome"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Telefone"
                      v-model="forms.telefone"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-autocomplete
                      label="Tipo Identificação"
                      v-model="forms.tipoIdentificacao"
                      :items="dataTipoIdentificacao"
                      item-value="tipo"
                      item-title="name"
                    ></v-autocomplete>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-autocomplete
                      label="Especialização"
                      v-model="forms.especializacao"
                      :items="dataEspecializacao"
                      item-title="descricao"
                      item-value="id"
                    ></v-autocomplete>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Utilizador"
                      v-model="forms.utilizador"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      label="E-mail"
                      v-model="forms.email"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Nº do Documento"
                      v-model="forms.numeroDocumento"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" md="12">
                    <div class="borderItems">
                      <p>Endereço</p>
                    </div>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" md="4">
                    <v-autocomplete
                      label="Província"
                      v-model="forms.provincia"
                      :items="dataProvincias"
                      item-title="nome"
                      item-value="id"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Município"
                      v-model="forms.municipio"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Comuna"
                      v-model="forms.comuna"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Rua"
                      v-model="forms.rua"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Bairro"
                      v-model="forms.bairro"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Complemento"
                      v-model="forms.bairro"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" md="12">
                    <div class="borderItems">
                      <p>Vínculos</p>
                      <div class="buttons">
                        <v-btn
                          color="blue"
                          class="button"
                          @click="handleSubmitVinculos"
                        >
                          <span class="mdi mdi-plus"></span>
                        </v-btn>
                      </div>
                    </div>
                  </v-col>
                </v-row>

                <!-- Adicionar Tabela Vinculos -->
                <div class="vinculos-container" v-if="dataVinculos.length > 0">
                  <div
                    class="item"
                    v-for="(item, index) in dataVinculos"
                    :key="index"
                  >
                    <p>
                      Hospital: <strong>{{ item.hospital }}</strong>
                    </p>
                    <span>Cidade: {{ item.cidade }}</span>
                    <span>Páis: {{ item.pais }}</span>
                    <span>x</span>
                  </div>
                </div>

                <template v-else>
                  <div class="vinculos-container">
                    <p>Adicione o vínculo, clicando no ícone</p>
                  </div>
                </template>

                <v-row>
                  <v-col cols="12" md="12">
                    <div class="borderItems">
                      <p>Arquivos</p>
                    </div>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" md="12">
                    <v-text-field
                      type="file"
                      label="Documentação de Identificação"
                      @change="handleFileUploadDocumentoIdentifcacao"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="12">
                    <v-text-field
                      type="file"
                      label="Certificados de Trabalho"
                      @change="handleFileUploadCertificadoTrabalho"
                      multiple
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="12">
                    <v-text-field
                      type="file"
                      label="Cédula da ordens dos médicos"
                      @change="handleFileUploadCedulaOrdemMedicos"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="12">
                    <v-text-field
                      type="file"
                      label="Outros Documentos"
                      @change="handleFileUploadOutrosDocumentos"
                      multiple
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row class="pt-4 pb-4">
                  <v-col cols="12" align="right">
                    <v-btn
                      type="submit"
                      color="green"
                      :loading="loadingInserirPedido"
                    >
                      Salvar
                    </v-btn>
                  </v-col>
                </v-row>
              </form>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>

    <v-dialog v-model="modalAddVinculos" width="65%" persistent>
      <v-card>
        <TitleModal
          title="Adicionar Vínculos"
          @fechar="modalAddVinculos = false"
        />
        <v-card-text>
          <div class="formulario">
            <form class="spacing" @submit.prevent="onSubmitVinculos">
              <v-row class="pt-4 pb-4">
                <v-col cols="12" md="8">
                  <v-text-field
                    label="Hospital"
                    v-model="forms.hospital"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    label="Cidade"
                    v-model="forms.cidade"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    label="País"
                    v-model="forms.pais"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    type="date"
                    label="Data Início"
                    v-model="forms.dataInicio"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    type="date"
                    label="Data Final"
                    v-model="forms.dataFim"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" align="right">
                  <v-btn type="submit" color="blue"> Adicionar </v-btn>
                </v-col>
              </v-row>
            </form>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </main>
</template>

<style lang="scss" scoped>
@import url(./styles.scss);
</style>
