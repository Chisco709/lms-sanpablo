export const formatPrice = (price: number) => {
    // Convertir de USD a COP (tasa de 4186 COP por 1 USD)
    const copPrice = price * 4186;
    
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        // Evitar decimales para COP
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(copPrice);
}