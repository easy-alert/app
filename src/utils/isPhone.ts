export const isPhone = (value: string) => /^\d{10,}$/.test(value.replace(/\D/g, ""));
