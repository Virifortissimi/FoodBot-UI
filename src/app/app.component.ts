import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter, firstValueFrom } from 'rxjs';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { FooterComponent } from './core/components/footer/footer.component';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';
import { ToastService } from './core/services/toast.service';
import { UserService } from './core/services/user.service';
import { environment } from '../environments/environment';
import { AiCoachMessage, AiCoachService } from './core/services/ai-coach.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive, NavbarComponent, FooterComponent, ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FoodbotUI';
  protected readonly sidebarItems = [
    { label: 'Dashboard', icon: 'dashboard', link: '/dashboard', exact: true },
    { label: 'Meal Planner', icon: 'calendar', link: '/meal-planner' },
    { label: 'Recipes', icon: 'book', link: '/recipes' },
    { label: 'Recipe Chat', icon: 'chat', link: '/recipe-chat' },
    { label: 'Nutrition', icon: 'heart', link: '/nutrition' },
    { label: 'Shopping List', icon: 'cart', link: '/shopping-list' },
    { label: 'Courses', icon: 'graduation', link: '/learn/courses' },
    { label: 'Pricing', icon: 'sparkles', link: '/pricing' }
  ];
  protected readonly coachButtonLabel = 'Chat with AI Coach';
  protected readonly aiCoachEnabled = environment.aiCoach.enabled;
  protected readonly coachActionLoading = signal(false);
  protected readonly coachModalOpen = signal(false);
  protected readonly coachModalMinimized = signal(false);
  protected readonly coachModalMaximized = signal(false);
  protected readonly coachMessages = signal<AiCoachMessage[]>([]);
  protected readonly coachSending = signal(false);
  protected readonly currentUrl = signal('/');
  protected readonly sidebarCollapsed = signal(false);
  protected readonly mobileSidebarOpen = signal(false);
  protected coachDraft = '';
  protected readonly authResolved = computed(() => this.authService.initialized());
  protected readonly routeLooksAuthenticated = computed(() => {
    const route = this.currentUrl();
    return route.startsWith('/dashboard')
      || route.startsWith('/meal-planner')
      || route.startsWith('/recipe-chat')
      || route.startsWith('/nutrition')
      || route.startsWith('/shopping-list')
      || route.startsWith('/profile')
      || route.startsWith('/onboarding')
      || route.startsWith('/learn/courses')
      || route.startsWith('/learn/lessons');
  });
  protected readonly showWorkspaceLoader = computed(() =>
    !this.authResolved() && (this.authService.sessionHint() || this.routeLooksAuthenticated())
  );
  protected readonly showPublicChrome = computed(() =>
    this.authResolved() && !this.authService.user()
  );
  protected readonly showAppSidebar = computed(() => {
    if (!this.authResolved() || !this.authService.user()) {
      return false;
    }

    const route = this.currentUrl();
    return !route.startsWith('/auth') && !route.startsWith('/onboarding');
  });
  protected readonly showCoachButton = computed(() => {
    const route = this.currentUrl();
    return !route.startsWith('/auth');
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    protected themeService: ThemeService,
    private userService: UserService,
    private toastService: ToastService,
    private aiCoachService: AiCoachService
  ) {
    this.currentUrl.set(this.router.url);

    if (this.authService.user() && !this.userService.profile()) {
      this.userService.getProfile().subscribe();
    }

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        this.currentUrl.set(event.urlAfterRedirects);
        this.mobileSidebarOpen.set(false);
      });
  }

  protected toggleSidebarCollapsed(): void {
    this.sidebarCollapsed.update(current => !current);
  }

  protected toggleMobileSidebar(): void {
    this.mobileSidebarOpen.update(current => !current);
  }

  protected closeMobileSidebar(): void {
    this.mobileSidebarOpen.set(false);
  }

  protected async signOut(): Promise<void> {
    await this.authService.signOut();
  }

  protected get currentSectionLabel(): string {
    const current = this.currentUrl();
    const match = this.sidebarItems.find(item => current === item.link || current.startsWith(`${item.link}/`));
    return match?.label || 'FoodBot';
  }

  protected get sidebarUserName(): string {
    const profile = this.userService.profile();
    const authUser = this.authService.user();
    return profile?.name || authUser?.fullName || authUser?.email?.split('@')[0] || 'FoodBot User';
  }

  protected get sidebarUserEmail(): string {
    const profile = this.userService.profile();
    const authUser = this.authService.user();
    return profile?.email || authUser?.email || '';
  }

  protected get sidebarUserInitial(): string {
    return this.sidebarUserName.charAt(0).toUpperCase();
  }

  async onCoachButtonClick(): Promise<void> {
    if (this.coachActionLoading()) {
      return;
    }

    this.coachActionLoading.set(true);

    try {
      if (!this.aiCoachEnabled) {
        this.openWhatsapp();
        return;
      }

      const token = await this.authService.ensureValidToken();
      if (!token) {
        this.toastService.info('Sign in to continue with the AI Coach.');
        await this.router.navigate(['/auth/login'], {
          queryParams: { redirect: this.currentUrl() || '/' }
        });
        return;
      }

      const profile = this.userService.profile() ?? await this.loadProfile();
      const tier = (profile?.subscriptionTier || 'Free').trim().toLowerCase();

      if (tier === 'free') {
        this.toastService.info('AI Coach is available on paid plans. Upgrade to continue.', 6000);
        await this.router.navigate(['/pricing']);
        return;
      }

      this.openCoachModal();
    } finally {
      this.coachActionLoading.set(false);
    }
  }

  protected toggleCoachMinimize(): void {
    if (!this.coachModalOpen()) {
      return;
    }

    this.coachModalMinimized.update(current => !current);
  }

  protected toggleCoachMaximize(): void {
    if (!this.coachModalOpen()) {
      return;
    }

    const next = !this.coachModalMaximized();
    this.coachModalMaximized.set(next);
    if (next) {
      this.coachModalMinimized.set(false);
    }
  }

  protected closeCoachModal(): void {
    this.coachModalOpen.set(false);
    this.coachModalMinimized.set(false);
    this.coachModalMaximized.set(false);
  }

  protected async sendCoachMessage(): Promise<void> {
    const message = this.coachDraft.trim();
    if (!message || this.coachSending()) {
      return;
    }

    const nextMessages = [
      ...this.coachMessages(),
      this.createMessage('user', message)
    ];

    this.coachMessages.set(nextMessages);
    this.coachDraft = '';
    this.coachSending.set(true);

    try {
      const reply = await this.aiCoachService.ask(nextMessages, message);
      this.coachMessages.update(current => [...current, this.createMessage('assistant', reply)]);
    } catch (error: any) {
      const fallback = error?.message || 'Unable to reach the AI Coach right now.';
      this.coachMessages.update(current => [...current, this.createMessage('assistant', fallback)]);
      this.toastService.error(fallback);
    } finally {
      this.coachSending.set(false);
    }
  }

  protected onCoachComposerKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();
    void this.sendCoachMessage();
  }

  private async loadProfile() {
    try {
      const res = await firstValueFrom(this.userService.getProfile());
      return res?.success ? res.data : null;
    } catch {
      this.toastService.error('Unable to verify your plan right now.');
      return null;
    }
  }

  private openWhatsapp(): void {
    window.open(environment.aiCoach.whatsappUrl, '_blank', 'noopener,noreferrer');
  }

  private openCoachModal(): void {
    this.coachModalOpen.set(true);
    this.coachModalMinimized.set(false);

    if (this.coachMessages().length === 0) {
      this.coachMessages.set([
        this.createMessage(
          'assistant',
          'Hi, I am your FoodBot AI Coach. Ask me about meals, macros, healthy swaps, cravings, or building better routines.'
        )
      ]);
    }
  }

  private createMessage(role: 'assistant' | 'user', content: string): AiCoachMessage {
    return {
      role,
      content,
      createdAt: new Date().toISOString()
    };
  }
}
