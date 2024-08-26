export function contarDiasFacturadosEntreDatas(
  data1: Date,
  data2: Date,
  sabado: boolean,
  dom: boolean
): number {
  const umDia = 24 * 60 * 60 * 1000;
  const delta = Math.abs(data2.getTime() - data1.getTime());
  const diasTotais = Math.floor(delta / umDia);

  if (!sabado || !dom) {
    let diasRemovidos = 0;
    for (let i = 0; i < diasTotais; i++) {
      const dataAtual = new Date(data1.getTime() + i * umDia);
      if (
        (!sabado && dataAtual.getDay() === 6) ||
        (!dom && dataAtual.getDay() === 0)
      ) {
        diasRemovidos++;
      }
    }
    return diasTotais - diasRemovidos;
  }

  return diasTotais;
}
