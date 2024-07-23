
export interface AuthPayload {
  userName: string;
  password: string;
}

export interface UpdateSellerPayload {
  userName: string;
  city?: string;
  state?: string;
}

export interface GetOrdersRequestPayload {
  sellerId: string;
  sortBy: string;
  limit: number,
  offset: number
}

export enum SortyBy {
  price = 'price',
  limit_date = 'shipping_limit_date'
  
}

