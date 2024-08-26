export function FormatarDataEditavel(data: any) {
  const dataObj = new Date(data);

  const dia = String(dataObj.getDate()).padStart(2, "0");
  const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
  const ano = dataObj.getFullYear();

  // const dataFormatada = `${dia}/${mes}/${ano}`;
  const dataFormatada = `${ano}-${mes}-${dia}`;

  return dataFormatada;
}
