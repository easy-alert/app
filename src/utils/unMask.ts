export function unMaskPhone(value: string) {
  return value.replace(/[^a-zA-Z0-9@._-]/g, "");
}

export const unMaskBRL = (value: string): string => value.replace(/[^0-9]/g, "");
