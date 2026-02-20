import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display app name in header', () => {
    const el: HTMLElement = fixture.nativeElement;
    const header = el.querySelector('header');
    expect(header).toBeTruthy();
    // Check there's some brand text rendered
    expect(header!.textContent!.trim().length).toBeGreaterThan(0);
  });

  it('should have link to home', () => {
    const links = fixture.nativeElement.querySelectorAll('a');
    const homeLink = Array.from(links).find(
      (a: any) => a.getAttribute('href') === '/'
    );
    expect(homeLink).toBeTruthy();
  });

  it('should have navigation links', () => {
    const links = fixture.nativeElement.querySelectorAll('a');
    expect(links.length).toBeGreaterThan(0);
  });
});
