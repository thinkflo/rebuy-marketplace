import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoteButtonComponent } from './vote-button.component';

describe('VoteButtonComponent', () => {
  let component: VoteButtonComponent;
  let fixture: ComponentFixture<VoteButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VoteButtonComponent);
    component = fixture.componentInstance;
    component.votes = 10;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display vote count', () => {
    const span = fixture.nativeElement.querySelector('span');
    expect(span?.textContent?.trim()).toBe('10');
  });

  it('should apply green class when votes > 0', () => {
    const span = fixture.nativeElement.querySelector('span');
    expect(span?.classList.contains('text-emerald-600')).toBe(true);
  });

  it('should apply gray class when votes is 0', async () => {
    component.votes = 0;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const span = fixture.nativeElement.querySelector('span');
    expect(span?.classList.contains('text-gray-400')).toBe(true);
  });

  it('should emit onUpvote when up button clicked', () => {
    const spy = vi.spyOn(component.onUpvote, 'emit');
    const upButton = fixture.nativeElement.querySelector(
      'button[aria-label="Upvote"]'
    ) as HTMLButtonElement;

    upButton.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit onDownvote when down button clicked', () => {
    const spy = vi.spyOn(component.onDownvote, 'emit');
    const downButton = fixture.nativeElement.querySelector(
      'button[aria-label="Downvote"]'
    ) as HTMLButtonElement;

    downButton.click();

    expect(spy).toHaveBeenCalled();
  });
});
