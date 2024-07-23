import { getDb } from "../db";
import { SellerI } from "../types/models";


export class Seller implements SellerI {

  seller_id: string;
  seller_zip_code_prefix: number;
  seller_city: string;
  seller_state: string;

  constructor(seller_id: string, seller_zip_code_prefix: number, seller_city: string, seller_state: string) {
    this.seller_id = seller_id;
    this.seller_zip_code_prefix = seller_zip_code_prefix;
    this.seller_city = seller_city;
    this.seller_state = seller_state;
  }




  static async findById(userId: string) : Promise<Seller | undefined>{
    const db = getDb();
    try {
      const seller = await db.collection('sellers').findOne({ seller_id: userId });
      if (seller) {
        return new Seller(
          seller.seller_id,
          seller.seller_zip_code_prefix,
          seller.seller_city,
          seller.seller_state
        );
      }
      return undefined;
    } catch (err) {
      console.log(err);
    }
  }

  static async updateSeller(
    userId: string,
    updateFields: { [key: string]: any }
  ): Promise<{ updated: boolean, message: string }> {
    const db = getDb();
    let message: string;
    try {
      const result = await db.collection('sellers').updateOne(
        { seller_id: userId },
        { $set: updateFields }
      );

      if (result.modifiedCount > 0) {
        message = 'Success';
        return {
          updated: true,
          message
        };

      } else {
        message = 'Seller not found or no changes made';
        console.log(message);
      }
      return { updated: false, message };
    } catch (err) {
      message = `Error updating seller ${err}`
      console.error(message);
      return { updated: false, message };
    }
  }
}

