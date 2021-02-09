
export interface SubCategory {
  categoryId: number;
  name: string;
  image_url: string;
}

export interface Category {
  categoryId: number;
  name: string;
  image_url: string;
  subCategories: SubCategory[];
}
