  // Calcular noches
export const calculateNights = (start, end) => {
const startDate = new Date(start);
const endDate = new Date(end);
const nights = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
return nights
};

// Calcular coste total
export const calculateTotalStayCost = (pricePerNight, numberOfNights) => {
if (typeof pricePerNight !== 'number' || typeof numberOfNights !== 'number') {
throw new Error('Los parámetros deben ser números');
}
if (pricePerNight < 0 || numberOfNights < 0) {
throw new Error('Los valores no pueden ser negativos');
}
const total = pricePerNight * numberOfNights;
return parseFloat(total.toFixed(2));
};
