export function compararDuasData(dataInicial: string, dataFinal: string) {
  // Converter as strings para objetos Date
  const dataInicio = new Date(dataInicial);
  const dataFim = new Date(dataFinal);

  // Comparar as datas
  if (dataInicio > dataFim) {
    return false;
  } else if (dataInicio < dataFim) {
    return true;
  } else {
    return true;
  }
}
