/**
 * Domain model for a marketplace offer.
 * Used across list, detail, and purchase flows; price and votes are numbers (API may send strings, coerced in OfferService).
 */
export interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  votes: number;
  image: string;
  category: string;
  createdAt: string;
}
