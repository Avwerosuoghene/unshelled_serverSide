
export interface SellerI {
    seller_id: string;
    seller_zip_code_prefix: number;
    seller_city: string;
    seller_state: string;
  }

export interface OrderI {
  order_id: string;
  order_item_id: number;
  product_id: string;
  seller_id: string;
  shipping_limit_date: Date;
  price: number;
  freight_value: number;
  }

  
  export interface IConfigurables {
    dev: {
      [key: string]: string;
    };
    prod: {
      [key: string]: string;
    };
  }
