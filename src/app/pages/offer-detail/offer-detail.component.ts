import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OfferService } from '../../services/offer.service';
import { Offer } from '../../models/offer.model';
import { VoteButtonComponent } from '../../components/vote-button/vote-button.component';
import { PurchaseModalComponent } from '../../components/purchase-modal/purchase-modal.component';

@Component({
  selector: 'app-offer-detail',
  imports: [RouterLink, CurrencyPipe, DatePipe, VoteButtonComponent, PurchaseModalComponent],
  template: `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Back link -->
      <a routerLink="/" class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
          <path fill-rule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clip-rule="evenodd" />
        </svg>
        Back to offers
      </a>

      @if (loading()) {
        <div class="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
          <div class="h-64 bg-gray-200 rounded-lg mb-6"></div>
          <div class="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      }

      @if (error()) {
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          <strong>Error:</strong> {{ error() }}
          <a routerLink="/" class="ml-2 underline hover:no-underline">Go back</a>
        </div>
      }

      @if (offer() && !loading()) {
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <!-- Image -->
          <img
            [src]="offer()!.image"
            [alt]="offer()!.title"
            class="w-full h-48 sm:h-64 object-cover bg-gray-100"
          />

          <div class="p-6">
            <!-- Header -->
            <div class="flex items-start gap-4">
              <app-vote-button
                [votes]="offer()!.votes"
                (onUpvote)="onUpvote()"
                (onDownvote)="onDownvote()"
              />
              <div class="flex-1">
                <h1 class="text-2xl font-bold text-gray-900">{{ offer()!.title }}</h1>
                <div class="mt-2 flex flex-wrap items-center gap-3">
                  <span class="text-2xl font-bold text-emerald-600">
                    {{ offer()!.price | currency: 'EUR' }}
                  </span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {{ offer()!.category }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="mt-6 prose prose-sm text-gray-600">
              <p>{{ offer()!.description }}</p>
            </div>

            <!-- Meta -->
            <div class="mt-6 pt-6 border-t border-gray-100 text-xs text-gray-400">
              Listed {{ offer()!.createdAt | date: 'mediumDate' }}
            </div>

            <!-- Purchase button -->
            <div class="mt-6">
              <button
                (click)="showPurchaseModal.set(true)"
                class="w-full sm:w-auto px-6 py-3 cursor-pointer text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                Purchase This Offer
              </button>
            </div>
          </div>
        </div>
      }
    </div>

    <app-purchase-modal
      [isOpen]="showPurchaseModal()"
      [offer]="offer()"
      (close)="showPurchaseModal.set(false)"
    />
  `,
})
export class OfferDetailComponent implements OnInit {
  offer = signal<Offer | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  showPurchaseModal = signal(false);

  constructor(
    private route: ActivatedRoute,
    private offerService: OfferService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.offerService.getOffer(id).subscribe({
        next: (offer) => {
          this.offer.set(offer);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Offer not found.');
          this.loading.set(false);
          console.error('Error loading offer:', err);
        },
      });
    }
  }

  onUpvote() {
    const current = this.offer();
    if (!current) return;
    const updated = { ...current, votes: current.votes + 1 };
    this.offer.set(updated);
    this.offerService.upvote(updated).subscribe({
      error: () => this.offer.set(current),
    });
  }

  onDownvote() {
    const current = this.offer();
    if (!current || current.votes <= 0) return;
    const updated = { ...current, votes: current.votes - 1 };
    this.offer.set(updated);
    this.offerService.downvote(updated).subscribe({
      error: () => this.offer.set(current),
    });
  }
}
