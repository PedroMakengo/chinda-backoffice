export function FormatarDataEditavel(data: any) {
  const dataObj = new Date(data);

  const dia = String(dataObj.getDate()).padStart(2, "0");
  const mes = String(dataObj.getMonth() + 1).padStart(2, "0");
  const ano = dataObj.getFullYear();

  const dataFormatada = `${dia}/${mes}/${ano}`;
  // const dataFormatada = `${ano}-${mes}-${dia}`;

  return dataFormatada;
}

export function FormatarHoraEditavel(isoString: any) {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}
