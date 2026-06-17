import type { TProductDocument } from "@shared/models/Product";

export type TStockEntryProductItem = {
  product: TProductDocument;
  quantity: number;
  unitPrice: number;
};

export type TStockEntryDocument = {
  _id: string;
  productList: TStockEntryProductItem[];
  totalCost: number;
  challanImage: string;
  createdAt: Date;
  updatedAt: Date;
};
