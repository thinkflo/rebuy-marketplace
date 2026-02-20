import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OfferCardComponent } from './offer-card.component';
import { createMockOffer } from '../../../testing/mock-offer';

describe('OfferCardComponent', () => {
  let component: OfferCardComponent;
  let fixture: ComponentFixture<OfferCardComponent>;
  const mockOffer = createMockOffer({
    id: '7',
    title: 'Premium Widget',
    price: 149.99,
    votes: 42,
    category: 'Electronics',
    description: 'A fantastic premium widget',
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(OfferCardComponent);
    component = fixture.componentInstance;
    component.offer = mockOffer;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display offer title', () => {
    const title = fixture.nativeElement.querySelector('h3');
    expect(title?.textContent?.trim()).toBe('Premium Widget');
  });

  it('should display offer price', () => {
    expect(fixture.nativeElement.textContent).toContain('149.99');
  });

  it('should display offer category', () => {
    const category = fixture.nativeElement.querySelector('.rounded-full');
    expect(category?.textContent?.trim()).toBe('Electronics');
  });

  it('should display offer description', () => {
    expect(fixture.nativeElement.textContent).toContain('A fantastic premium widget');
  });

  it('should render image with correct src and alt', () => {
    const img = fixture.nativeElement.querySelector('img');
    expect(img?.src).toBe(mockOffer.image);
    expect(img?.alt).toBe('Premium Widget');
  });

  it('should link to correct detail route', () => {
    const link = fixture.nativeElement.querySelector('a');
    expect(link?.getAttribute('href')).toBe('/offers/7');
  });

  it('should emit upvote event with offer', () => {
    const spy = vi.spyOn(component.upvote, 'emit');
    const upButton = fixture.nativeElement.querySelector(
      'button[aria-label="Upvote"]'
    ) as HTMLButtonElement;

    upButton.click();

    expect(spy).toHaveBeenCalledWith(mockOffer);
  });

  it('should emit downvote event with offer', () => {
    const spy = vi.spyOn(component.downvote, 'emit');
    const downButton = fixture.nativeElement.querySelector(
      'button[aria-label="Downvote"]'
    ) as HTMLButtonElement;

    downButton.click();

    expect(spy).toHaveBeenCalledWith(mockOffer);
  });
});
