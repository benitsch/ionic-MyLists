
export function getEnumKeyByValue<T extends Record<string, unknown>>(enumType: T, val: unknown): keyof T | undefined {
  const keys = Object.keys(enumType) as Array<keyof T>;
  return keys.find((key) => enumType[key] === val);
}

export function getEnumValueByKey<T extends Record<string, unknown>>(enumType: T, key: keyof T): T[keyof T] | undefined {
  return enumType[key];
}

export function getEnumAsKeyValuePair<T extends Record<keyof T, string | number>>(enumType: T): Array<{ key: keyof T; value: T[keyof T] }> {
  return Object.entries(enumType).map(([key, value]) => ({ key, value })) as Array<{ key: keyof T; value: T[keyof T] }>;
}
