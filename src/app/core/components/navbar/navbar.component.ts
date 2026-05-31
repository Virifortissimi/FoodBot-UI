import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { SettingsPanelComponent } from '../../../shared/components/settings-panel/settings-panel.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, SettingsPanelComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  mobileOpen = false;
  userDropdownOpen = false;
  productMenuOpen = false;
  resourceMenuOpen = false;
  scrolled = false;

  settingsOpen = false;
  readonly productLinks = [
    { label: 'Meal Planner', link: '/meal-planner' },
    { label: 'Recipes', link: '/recipes' },
    { label: 'Recipe Chat', link: '/recipe-chat' },
    { label: 'Nutrition', link: '/nutrition' }
  ];
  readonly resourceLinks = [
    { label: 'Pricing', link: '/pricing' },
    { label: 'API Docs', link: '/api-docs' },
    { label: 'Learn', link: '/learn' }
  ];

  constructor(
    public authService: AuthService,
    public themeService: ThemeService,
    private readonly router: Router,
    private readonly elementRef: ElementRef<HTMLElement>
  ) {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeMenus();
        this.userDropdownOpen = false;
        this.mobileOpen = false;
      });
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = (typeof window !== 'undefined') && window.scrollY > 60;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as Node | null;
    if (target && !this.elementRef.nativeElement.contains(target)) {
      this.closeMenus();
      this.userDropdownOpen = false;
    }
  }

  get userInitial(): string {
    return (this.authService.user()?.fullName || this.authService.user()?.email || 'U')[0].toUpperCase();
  }

  get productsActive(): boolean {
    return this.productLinks.some(item => this.router.url.startsWith(item.link));
  }

  get resourcesActive(): boolean {
    return this.resourceLinks.some(item => this.router.url.startsWith(item.link));
  }

  toggleMenu(kind: 'product' | 'resource', event?: Event) {
    event?.stopPropagation();

    if (kind === 'product') {
      this.productMenuOpen = !this.productMenuOpen;
      this.resourceMenuOpen = false;
      return;
    }

    this.resourceMenuOpen = !this.resourceMenuOpen;
    this.productMenuOpen = false;
  }

  closeMenus() {
    this.productMenuOpen = false;
    this.resourceMenuOpen = false;
  }

  logout() {
    this.authService.signOut();
    this.mobileOpen = false;
    this.userDropdownOpen = false;
    this.closeMenus();
  }
}
