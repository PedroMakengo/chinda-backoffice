import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";

export default createVuetify({
  // components: { VDataTable },
  defaults: {
    VTextField: {
      variant: "outlined",
      density: "compact",
    },
    VAutocomplete: {
      density: "compact",
      variant: "outlined",
    },
    vtextarea: {
      density: "compact",
      variant: "outlined",
    },
    VDataTable: {
      noDataText: "Sem Informações",
      itemsPerPageText: "Linhas por página",
    },
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#1867C0",
          secondary: "#5CBBF6",
        },
      },
    },
  },
});
