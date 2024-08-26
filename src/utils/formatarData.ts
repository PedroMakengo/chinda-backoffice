export function FormatarData(data: string) {
  const dataObj = new Date(data);

  const dia = String(dataObj.getDate()).padStart(2, "0");
  const mes = +String(dataObj.getMonth()).padStart(2, "0");
  const ano = dataObj.getFullYear();

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const dataFormatada = `${monthNames[mes]} de ${ano}`;

  return dataFormatada;
}
