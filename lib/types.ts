export type ModuleItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  version: string;
  size: string;
  category: string;
  downloadUrl: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ModuleInput = Omit<ModuleItem, "id" | "createdAt" | "updatedAt">;
