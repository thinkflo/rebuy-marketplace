import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Offer } from '../../models/offer.model';

@Component({
  selector: 'app-purchase-modal',
  imports: [CurrencyPipe],
  template: `
    @if (isOpen && offer) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          (click)="close.emit()"
        ></div>

        <!-- Modal -->
        <div class="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in">
          @if (!purchased) {
            <h2 class="text-xl font-bold text-gray-900">Confirm Purchase</h2>
            <p class="mt-2 text-sm text-gray-500">
              You're about to purchase the following offer:
            </p>

            <div class="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 class="font-semibold text-gray-900">{{ offer.title }}</h3>
              <p class="mt-1 text-2xl font-bold text-emerald-600">
                {{ offer.price | currency: 'EUR' }}
              </p>
            </div>

            <div class="mt-6 flex gap-3">
              <button
                (click)="close.emit()"
                class="flex-1 px-4 py-2.5 cursor-pointer text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                (click)="onPurchase()"
                class="flex-1 px-4 py-2.5 cursor-pointer text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                Purchase Now
              </button>
            </div>
          } @else {
            <div class="text-center py-4">
              <div class="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                </svg>
              </div>
              <h2 class="mt-4 text-xl font-bold text-gray-900">Purchase Complete!</h2>
              <p class="mt-2 text-sm text-gray-500">
                Your purchase of <strong>{{ offer.title }}</strong> has been confirmed.
              </p>
              <button
                (click)="close.emit()"
                class="mt-6 w-full px-4 py-2.5 cursor-pointer text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: `
    .animate-in {
      animation: slideUp 0.2s ease-out;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
})
export class PurchaseModalComponent {
  @Input() isOpen = false;
  @Input() offer: Offer | null = null;
  @Output() close = new EventEmitter<void>();

  purchased = false;

  onPurchase() {
    // Simulate purchase — in production, this would call the real platform API
    this.purchased = true;
  }
}
