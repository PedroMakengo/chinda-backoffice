
export function FormatarPreco(preco: number) {
  const precoFormatado = preco.toLocaleString("pt-pt", {
    style: "currency",
    currency: "AOA",
  });
  return precoFormatado;
}
