interface SparePart {
    _id: string;
    name: string;
    quantity: number;
    price: { $numberDecimal: string };
    discount: { $numberDecimal: string };
    averageRating: number;
    images: { path: string }[];
  }

  export const getLowStockSpareParts = (spareParts: SparePart[], threshold = 10): SparePart[] => {
    if (!Array.isArray(spareParts)) {
        return [];
    }

    return spareParts.filter((part) => part.quantity <= threshold);
  };
