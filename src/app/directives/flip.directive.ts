import { Directive, ElementRef, AfterViewChecked, Input } from '@angular/core';

@Directive({
  selector: '[appFlip]',
})
export class FlipDirective implements AfterViewChecked {
  @Input() flipDuration = 300;
  
  private positions = new Map<string, DOMRect>();

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewChecked() {
    const children = this.el.nativeElement.children;
    const newPositions = new Map<string, DOMRect>();

    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      const key = child.dataset['flipKey'];
      if (!key) continue;

      const newRect = child.getBoundingClientRect();
      newPositions.set(key, newRect);

      const oldRect = this.positions.get(key);
      if (oldRect) {
        const deltaY = oldRect.top - newRect.top;
        if (Math.abs(deltaY) > 1) {
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