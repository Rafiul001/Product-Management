export interface ISubCategoryResponse {
  _id: string;
  subCategoryName: string;
  category: {
    _id: string;
    categoryName: string;
    status: boolean;
  };
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}
