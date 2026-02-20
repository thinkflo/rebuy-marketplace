import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PurchaseModalComponent } from './purchase-modal.component';
import { createMockOffer } from '../../../testing/mock-offer';

describe('PurchaseModalComponent', () => {
  let component: PurchaseModalComponent;
  let fixture: ComponentFixture<PurchaseModalComponent>;
  const mockOffer = createMockOffer({ title: 'Test Product', price: 49.99 });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be hidden when isOpen is false', async () => {
    component.isOpen = false;
    component.offer = mockOffer;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.fixed')).toBeNull();
  });

  it('should be visible when isOpen is true', async () => {
    component.isOpen = true;
    component.offer = mockOffer;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.fixed')).toBeTruthy();
  });

  it('should be hidden when offer is null', async () => {
    component.isOpen = true;
    component.offer = null;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.fixed')).toBeNull();
  });

  it('should display offer title when open', async () => {
    component.isOpen = true;
    component.offer = mockOffer;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Test Product');
  });

  it('should display offer price when open', async () => {
    component.isOpen = true;
    component.offer = mockOffer;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('49.99');
  });

  it('should show confirmation view initially', async () => {
    component.isOpen = true;
    component.offer = mockOffer;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Confirm Purchase');
    expect(fixture.nativeElement.textContent).toContain('Purchase Now');
  });

  it('should show success view after purchase', async () => {
    component.isOpen = true;
    component.offer = mockOffer;
    fixture.detectChanges();
    await fixture.whenStable();

    component.onPurchase();
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Purchase Complete');
  });

  it('should emit close on cancel button click', async () => {
    component.isOpen = true;
    component.offer = mockOffer;
    fixture.detectChanges();
    await fixture.whenStable();

    const spy = vi.spyOn(component.close, 'emit');
    const cancelButton = Array.from(
      fixture.nativeElement.querySelectorAll('button')
    ).find((b: any) => b.textContent?.trim() === 'Cancel') as HTMLButtonElement;

    cancelButton.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit close on backdrop click', async () => {
    component.isOpen = true;
    component.offer = mockOffer;
    fixture.detectChanges();
    await fixture.whenStable();

    const spy = vi.spyOn(component.close, 'emit');
    const backdrop = fixture.nativeElement.querySelector(
      '.absolute.inset-0'
    ) as HTMLElement;

    backdrop.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit close on Done button after purchase', async () => {
    component.isOpen = true;
    component.offer = mockOffer;
    fixture.detectChanges();
    await fixture.whenStable();

    component.onPurchase();
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const spy = vi.spyOn(component.close, 'emit');
    const doneButton = Array.from(
      fixture.nativeElement.querySelectorAll('button')
    ).find((b: any) => b.textContent?.trim() === 'Done') as HTMLButtonElement;

    doneButton.click();

    expect(spy).toHaveBeenCalled();
  });
});
