export function getEnumKeyByValue<T extends Record<string, unknown>>(enumType: T, val: unknown): keyof T | undefined {
  const keys = Object.keys(enumType) as Array<keyof T>;
  return keys.find((key) => enumType[key] === val);
}

export function getEnumValueByKey<T extends Record<string, unknown>>(enumType: T, key: keyof T): T[keyof T] | undefined {
  return enumType[key];
}

// export function getEnumValues(enumType: any): string[] {
//   return Object.keys(enumType).map(key => enumType[key]);
// }
