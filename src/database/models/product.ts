export default interface ProductI {
  title: string;
  price: number;
  category: string;
  description: string;
  featuresDescription: string;
  features: {
    name: string;
    quantity: number;
  }[];
  image: string;
  userId: string; // Assuming ObjectId is represented as a string
  rating: number;
  reviews: number;
  createdAt?: Date;
  updatedAt?: Date;
}