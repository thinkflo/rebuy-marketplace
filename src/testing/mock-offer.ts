import { Offer } from '../app/models/offer.model';

export function createMockOffer(overrides: Partial<Offer> = {}): Offer {
  return {
    id: '1',
    title: 'Test Offer',
    description: 'A test offer description',
    price: 99.99,
    votes: 10,
    image: 'https://example.com/image.jpg',
    category: 'Electronics',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

export function createMockOffers(count: number = 5): Offer[] {
  return Array.from({ length: count }, (_, i) =>
    createMockOffer({
      id: String(i + 1),
      title: `Offer ${i + 1}`,
      votes: (count - i) * 10,
      price: (i + 1) * 25,
      category: ['Electronics', 'Books', 'Games', 'Music', 'Tools'][i % 5],
    })
  );
}
