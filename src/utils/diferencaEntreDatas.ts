export function DiferencaData(dataInicio: string, dataFim: string) {
  const dataInicial: any = new Date(dataInicio);
  const dataFinal: any = new Date(dataFim);

  const diferencaEmMilissegundos = dataFinal - dataInicial;

  const umDiaEmMilissegundos = 24 * 60 * 60 * 1000;

  const diferencaEmDias = Math.floor(
    diferencaEmMilissegundos / umDiaEmMilissegundos
  );

  return diferencaEmDias;
}
