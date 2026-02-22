import { Offer } from '../models/offer.model';

/**
 * Returns a new array of offers sorted by votes descending.
 * Used for client-side re-sort after voting so the list order updates immediately.
 */
export function sortOffersByVotesDesc(offers: Offer[]): Offer[] {
  return [...offers].sort((a, b) => b.votes - a.votes);
}
