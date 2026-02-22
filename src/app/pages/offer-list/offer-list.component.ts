import { Component, OnInit, signal } from '@angular/core';
import { OfferService } from '../../services/offer.service';
import { Offer } from '../../models/offer.model';
import { OfferCardComponent } from '../../components/offer-card/offer-card.component';
import { FlipDirective } from '../../directives/flip.directive';
import { sortOffersByVotesDesc } from '../../core/offer.utils';

const SKELETON_COUNT = 3;
const LOAD_ERROR_MESSAGE = 'Failed to load offers. Please check your API configuration.';

@Component({
  selector: 'app-offer-list',
  imports: [OfferCardComponent, FlipDirective],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Top Offers</h1>
        <p class="mt-1 text-sm text-gray-500">
          Browse and vote on the best offers. Sorted by community votes.
        </p>
      </div>

      @if (loading()) {
        <div class="space-y-4">
          @for (i of skeletonItems; track i) {
            <div class="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
              <div class="flex gap-4">
                <div class="w-10 flex flex-col items-center gap-2">
                  <div class="w-8 h-8 bg-gray-200 rounded"></div>
                  <div class="w-6 h-4 bg-gray-200 rounded"></div>
                  <div class="w-8 h-8 bg-gray-200 rounded"></div>
                </div>
                <div class="w-32 h-32 bg-gray-200 rounded-md"></div>
                <div class="flex-1 space-y-3">
                  <div class="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div class="h-4 bg-gray-200 rounded w-full"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          }
        </div>
      }

      @if (error()) {
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          <strong>Error:</strong> {{ error() }}
          <button (click)="loadOffers()" class="ml-2 underline hover:no-underline">Try again</button>
        </div>
      }

      @if (!loading() && !error()) {
        <div class="space-y-3" appFlip>
          @for (offer of offers(); track offer.id) {
            <div [attr.data-flip-key]="offer.id">
              <app-offer-card
                [offer]="offer"
                (upvote)="onUpvote($event)"
                (downvote)="onDownvote($event)"
              />
            </div>
          } @empty {
            <div class="text-center py-12 text-gray-500">
              No offers found.
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class OfferListComponent implements OnInit {
  offers = signal<Offer[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  /** Number of skeleton placeholders shown while loading. */
  protected readonly skeletonItems = Array.from({ length: SKELETON_COUNT }, (_, i) => i + 1);

  constructor(private offerService: OfferService) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this.loading.set(true);
    this.error.set(null);
    this.offerService.getOffers().subscribe({
      next: (offers) => {
        this.offers.set(offers);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(LOAD_ERROR_MESSAGE);
        this.loading.set(false);
        console.error('Error loading offers:', err);
      },
    });
  }

  onUpvote(offer: Offer): void {
    offer.votes++;
    this.offers.update((list) => sortOffersByVotesDesc(list));
    this.offerService.upvote(offer).subscribe({
      error: () => {
        offer.votes--;
        this.offers.update((list) => sortOffersByVotesDesc(list));
      },
    });
  }

  onDownvote(offer: Offer): void {
    if (offer.votes <= 0) return;
    offer.votes--;
    this.offers.update((list) => sortOffersByVotesDesc(list));
    this.offerService.downvote(offer).subscribe({
      error: () => {
        offer.votes++;
        this.offers.update((list) => sortOffersByVotesDesc(list));
      },
    });
  }
}
