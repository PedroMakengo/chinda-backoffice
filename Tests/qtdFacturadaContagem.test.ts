import { describe, expect, test } from "@jest/globals";
import { contarDiasFacturadosEntreDatas } from "../src/utils/contarDiasFaturados";

describe("ContagemDiasComponent", () => {
  it("calcula corretamente a quantidade de dias a factrurar", () => {
    const data1 = new Date(2023, 7, 15);
    const data2 = new Date(2023, 7, 31);
    const sabado = true;
    const dom = true;

    const quantidadeEsperada = contarDiasFacturadosEntreDatas(
      data1,
      data2,
      sabado,
      dom
    );

    console.log(quantidadeEsperada);
    expect(quantidadeEsperada).toBe(16);
  });
});
