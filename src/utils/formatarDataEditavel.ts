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

export function formatDateWithInputTime(inputTime: any) {
  const currentDate = new Date();

  // Separar horas e minutos do valor do input (formato HH:MM)
  const [inputHours, inputMinutes] = inputTime.split(":");

  // Definir as horas e minutos com base no input
  currentDate.setHours(inputHours);
  currentDate.setMinutes(inputMinutes);
  currentDate.setSeconds(0); // Opcional: Zera os segundos

  // Obter as partes da data no formato desejado
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");

  // Formatar a data para o formato desejado
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
