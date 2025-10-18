export interface FormMetaItem {
  id: number;
  title: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type FormMeta = Record<string, FormMetaItem[]>;
