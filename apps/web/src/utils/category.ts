// apps/web/src/utils/category.ts
export const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export const isValidSlugFormat = (slug: string) => {
  // simple validation: only lowercase letters, numbers and dashes, no leading/trailing dash
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
};
export const slugIfNameChanged = (newName: string, originalName?: string) => {
  if (!originalName || newName !== originalName) {
    return generateSlug(newName);
  }
  return undefined;
};
