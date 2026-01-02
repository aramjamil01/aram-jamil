
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

export interface OrderItem extends MenuItem {
  quantity: number;
  note?: string;
}

export interface Table {
  id: number;
  status: 'available' | 'occupied' | 'selected';
}

export type Category = 'کەباب' | 'شۆربا' | 'خواردنەوە' | 'شیرینی';
