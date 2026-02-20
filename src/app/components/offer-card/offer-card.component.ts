import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Offer } from '../../models/offer.model';
import { VoteButtonComponent } from '../vote-button/vote-button.component';

@Component({
  selector: 'app-offer-card',
  imports: [RouterLink, CurrencyPipe, VoteButtonComponent],
  template: `
    <div class="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden">
      <div class="flex">
        <!-- Vote section -->
        <div class="flex-shrink-0 p-4 flex items-start">
          <app-vote-button
            [votes]="offer.votes"
            (onUpvote)="upvote.emit(offer)"
            (onDownvote)="downvote.emit(offer)"
          />
        </div>

        <!-- Content -->
        <a [routerLink]="['/offers', offer.id]" class="flex-1 p-4 pl-0 cursor-pointer">
          <div class="flex flex-col sm:flex-row gap-4">
            <!-- Image -->
            <div class="flex-shrink-0">
              <img
                [src]="offer.image"
                [alt]="offer.title"
                class="w-full sm:w-32 h-32 object-cover rounded-md bg-gray-100"
              />
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <h3 class="text-lg font-semibold text-gray-900 truncate">
                  {{ offer.title }}
                </h3>
                <span class="flex-shrink-0 text-lg font-bold text-emerald-600">
                  {{ offer.price | currency: 'EUR' }}
                </span>
              </div>
              <p class="mt-1 text-sm text-gray-500 line-clamp-2">
                {{ offer.description }}
              </p>
              <div class="mt-3 flex items-center gap-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {{ offer.category }}
                </span>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  `,
})
export class OfferCardComponent {
  @Input({ required: true }) offer!: Offer;
  @Output() upvote = new EventEmitter<Offer>();
  @Output() downvote = new EventEmitter<Offer>();
}
