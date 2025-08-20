// app/utils/tag.ts
export const TAG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export function isValidTagName(input: string): boolean {
  return TAG_PATTERN.test(input);
}
