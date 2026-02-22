import { Directive, ElementRef, AfterViewChecked, Input } from '@angular/core';

/** Data attribute used to identify list items for FLIP animation. */
const DATA_ATTR_FLIP_KEY = 'flipKey';

/** Default animation duration in ms. */
const DEFAULT_FLIP_DURATION_MS = 300;

/** Minimum vertical movement in px to trigger animation (avoids jitter). */
const POSITION_THRESHOLD_PX = 1;

/**
 * FLIP directive: animates list items when their order changes by recording
 * positions and applying a short translateY transition. Place on the list
 * container and set data-flip-key on each child (e.g. to offer.id).
 */
@Directive({
  selector: '[appFlip]',
})
export class FlipDirective implements AfterViewChecked {
  @Input() flipDuration = DEFAULT_FLIP_DURATION_MS;

  private positions = new Map<string, DOMRect>();

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewChecked(): void {
    const children = this.el.nativeElement.children;
    const newPositions = new Map<string, DOMRect>();

    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      const key = child.dataset[DATA_ATTR_FLIP_KEY];
      if (!key) continue;

      const newRect = child.getBoundingClientRect();
      newPositions.set(key, newRect);

      const oldRect = this.positions.get(key);
      if (oldRect) {
        const deltaY = oldRect.top - newRect.top;
        if (Math.abs(deltaY) > POSITION_THRESHOLD_PX) {
          child.style.transform = `translateY(${deltaY}px)`;
          child.style.transition = 'none';

          requestAnimationFrame(() => {
            child.style.transition = `transform ${this.flipDuration}ms ease`;
            child.style.transform = '';
          });
        }
      }
    }

    this.positions = newPositions;
  }
}