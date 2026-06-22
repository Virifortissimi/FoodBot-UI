import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';
import { StaggerDirective } from '../../../../shared/directives/stagger.directive';
import { AuthService } from '../../../../core/services/auth.service';
import {
  SubscriptionMarketContext,
  SubscriptionPlan,
  SubscriptionService
} from '../../../../core/services/subscription.service';
import { ToastService } from '../../../../core/services/toast.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-pricing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective, StaggerDirective],
  templateUrl: './pricing-page.component.html',
  styleUrl: './pricing-page.component.css'
})
export class PricingPageComponent implements OnInit {
  annual = true;
  processingPlan: 'pro' | 'coach' | null = null;
  cancellingSubscription = false;
  showCancelModal = false;
  verifyingReference = false;
  loadingPlans = true;
  market: SubscriptionMarketContext | null = null;
  plans: SubscriptionPlan[] = [];
  localeCountryCode: string | null = null;
  timeZone: string | null = null;

  freeFeatures = [
    '1 meal plan/month',
    'Unlimited manual meal-plan editing',
    'Browse up to 20 recipes',
    'Up to 10 saved recipes',
    '10 recipe chat messages/day, 200/month',
    '1 shopping list/month',
    'Unlimited shopping-list interaction',
    'Basic nutrition tracking',
    'Basic dashboard overview',
    'Partially open learning library',
    'Community recipes'
  ];
  proFeatures = [
    '3 meal plans/week, 10/month',
    'Unlimited manual meal-plan editing',
    'Browse up to 100 recipes',
    'Up to 50 saved recipes',
    'Unlimited recipe chat',
    '3 shopping lists/week, 10/month',
    'Advanced dashboard analytics',
    'Full learning library',
    'AI Coach access with plan-based monthly cap'
  ];
  coachFeatures = [
    'Unlimited meal plans',
    'Unlimited recipe browse and saved recipes',
    'Unlimited shopping lists',
    'Unlimited recipe chat',
    'Full AI Coach access',
    'Dedicated support',
    'API access by separate approval'
  ];

  comparisonRows = [
    { feature: 'Meal Planner', free: '1/month', pro: '3/week, 10/month', coach: 'Unlimited' },
    { feature: 'Manual Meal Plan Editing', free: 'Unlimited', pro: 'Unlimited', coach: 'Unlimited' },
    { feature: 'Recipe Browse', free: '20 recipes', pro: '100 recipes', coach: 'Unlimited' },
    { feature: 'Saved Recipes', free: '10', pro: '50', coach: 'Unlimited' },
    { feature: 'Recipe Chat', free: '10/day, 200/month', pro: 'Unlimited', coach: 'Unlimited' },
    { feature: 'AI Coach', free: 'No', pro: 'Limited', coach: 'Full' },
    { feature: 'Shopping List Generation', free: '1/month', pro: '3/week, 10/month', coach: 'Unlimited' },
    { feature: 'Shopping List Interaction', free: 'Unlimited', pro: 'Unlimited', coach: 'Unlimited' },
    { feature: 'Dashboard Analytics', free: 'Basic', pro: 'Advanced', coach: 'Coach-grade' },
    { feature: 'Courses / Learn', free: 'Partial', pro: 'Full', coach: 'Full' },
    { feature: 'API Access', free: 'No', pro: 'By approval', coach: 'By approval' },
    { feature: 'Support', free: 'Standard', pro: 'Priority', coach: 'Dedicated' }
  ];

  faqs = [
    { q: 'Can I really use FoodBot for free?', a: 'Absolutely. The Free plan has no card required and lets you test the core features before upgrading.', open: false },
    { q: 'What happens if I cancel my Pro subscription?', a: 'Your account stays active until the current billing cycle ends, then it moves to Free without deleting your data.', open: false },
    { q: 'Can I switch between monthly and annual billing?', a: 'Yes. You can switch billing cadence at any time and the new cycle starts from your next renewal.', open: false },
    { q: 'Is there a student discount?', a: 'Contact support with your student ID and we will apply an education discount where available.', open: false },
    { q: 'Do you offer team or family plans?', a: 'Team plans are on the roadmap. For now, each user should maintain an individual account.', open: false }
  ];

  constructor(
    private subscriptionService: SubscriptionService,
    private authService: AuthService,
    private userService: UserService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    if (this.authService.user() && !this.userService.profile()) {
      this.userService.getProfile().subscribe();
    }
  }

  ngOnInit(): void {
    this.localeCountryCode = this.detectLocaleCountryCode();
    this.timeZone = this.detectTimeZone();
    this.loadPlans();
    void this.verifyReferenceIfNeeded();
  }

  async startCheckout(plan: 'pro' | 'coach') {
    if (!this.canStartCheckout(plan)) {
      return;
    }

    const token = await this.authService.ensureValidToken();
    if (!token) {
      this.router.navigate(['/auth/login'], { queryParams: { redirect: '/pricing' } });
      return;
    }

    this.processingPlan = plan;

    const successUrl = `${window.location.origin}/pricing`;
    const cancelUrl = `${window.location.origin}/pricing`;
    const billingCycle = this.annual ? 'annual' : 'monthly';

    this.subscriptionService.initialize(
      plan,
      billingCycle,
      successUrl,
      cancelUrl,
      this.localeCountryCode,
      this.timeZone
    ).pipe(
      finalize(() => {
        if (this.processingPlan === plan) {
          this.processingPlan = null;
        }
      })
    ).subscribe({
      next: (res) => {
        if (!res.success || !res.data.authorizationUrl) {
          this.toastService.error('Unable to start checkout right now.');
          return;
        }

        window.location.href = res.data.authorizationUrl;
      },
      error: () => this.toastService.error('Unable to start checkout right now.')
    });
  }

  toggleFaq(faq: { open: boolean }) {
    faq.open = !faq.open;
  }

  openCancelSubscriptionModal() {
    if (!this.isLoggedIn || this.currentPlan === 'free' || this.cancellingSubscription) {
      return;
    }

    this.showCancelModal = true;
  }

  closeCancelSubscriptionModal() {
    if (this.cancellingSubscription) {
      return;
    }

    this.showCancelModal = false;
  }

  cancelSubscription() {
    if (!this.isLoggedIn || this.currentPlan === 'free' || this.cancellingSubscription) {
      return;
    }

    this.cancellingSubscription = true;
    this.subscriptionService.cancel().pipe(
      finalize(() => {
        this.cancellingSubscription = false;
      })
    ).subscribe({
      next: (res) => {
        if (!res.success) {
          this.toastService.error('Unable to cancel the subscription right now.');
          return;
        }

        if (res.data.managementUrl) {
          this.showCancelModal = false;
          this.toastService.success(res.data.message || 'Redirecting to subscription management.');
          window.location.href = res.data.managementUrl;
          return;
        }

        this.showCancelModal = false;
        this.userService.getProfile().subscribe();
        this.toastService.success(res.data.message || 'Your subscription will end at the end of the current billing period.');
      },
      error: () => this.toastService.error('Unable to cancel the subscription right now.')
    });
  }

  get isLoggedIn(): boolean {
    return !!this.authService.user();
  }

  get currentPlan(): 'free' | 'pro' | 'coach' {
    const tier = (this.userService.profile()?.subscriptionTier || 'Free').trim().toLowerCase();

    if (tier === 'pro') {
      return 'pro';
    }

    if (tier === 'coach' || tier === 'premium' || tier === 'nutrition coach') {
      return 'coach';
    }

    return 'free';
  }

  isCurrentPlan(plan: 'free' | 'pro' | 'coach'): boolean {
    return this.isLoggedIn && this.currentPlan === plan;
  }

  get activeCurrencySymbol(): string {
    return this.market?.currencySymbol ?? '₦';
  }

  get activeProviderLabel(): string {
    const providers = this.market?.supportedProviders ?? [this.market?.provider ?? 'paystack'];
    return providers
      .map(provider => provider === 'flutterwave' ? 'Flutterwave' : 'Paystack')
      .join(' / ');
  }

  get activeRegionLabel(): string {
    if (this.market?.regionGroup === 'nigeria') {
      return 'Nigeria pricing';
    }

    return this.market?.regionGroup === 'global' ? 'International pricing' : 'Africa pricing';
  }

  get annualToggleCopy(): string {
    return `Billed yearly in ${this.market?.currencySymbol ?? '₦'}`;
  }

  get annualDiscountCopy(): string {
    return 'Annual billing discount applied';
  }

  isPlanMuted(plan: 'free' | 'pro' | 'coach'): boolean {
    return this.isLoggedIn && this.getPlanRank(plan) < this.getPlanRank(this.currentPlan);
  }

  canStartCheckout(plan: 'pro' | 'coach'): boolean {
    return !this.isLoggedIn || this.getPlanRank(plan) > this.getPlanRank(this.currentPlan);
  }

  get canCancelCurrentSubscription(): boolean {
    return this.isLoggedIn && this.currentPlan !== 'free';
  }

  getPlanButtonLabel(plan: 'free' | 'pro' | 'coach'): string {
    if (this.isCurrentPlan(plan)) {
      return 'Current Plan';
    }

    if (this.isPlanMuted(plan)) {
      return 'Included in your plan';
    }

    if (plan === 'free') {
      return this.isLoggedIn ? 'Downgrade unavailable' : 'Get Started - It\'s Free';
    }

    if (plan === 'pro') {
      return this.isLoggedIn ? 'Upgrade to Pro' : 'Start Pro Checkout';
    }

    return this.isLoggedIn ? 'Upgrade to Coach' : 'Start Coach Checkout';
  }

  getPlanPrice(planKey: 'pro' | 'coach'): number {
    const plan = this.getPlan(planKey);
    if (!plan) {
      return 0;
    }

    return this.annual ? plan.annualEquivalentMonthlyAmount : plan.monthlyAmount;
  }

  getAnnualBillingTotal(planKey: 'pro' | 'coach'): number {
    return this.getPlan(planKey)?.annualAmount ?? 0;
  }

  getPlanDisplayAmount(planKey: 'pro' | 'coach'): string {
    return this.formatAmount(this.getPlanPrice(planKey));
  }

  getFreePlanDisplayAmount(): string {
    return this.formatAmount(0);
  }

  getPlanAnnualBillingCopy(planKey: 'pro' | 'coach'): string {
    const plan = this.getPlan(planKey);
    if (!plan || !this.annual) {
      return '';
    }

    return `Billed ${this.formatAmount(plan.annualAmount)}/yr`;
  }

  formatAmount(amount: number): string {
    const formattedNumber = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0
    }).format(amount);

    return `${this.market?.currencySymbol ?? '₦'}${formattedNumber}`;
  }

  private getPlan(planKey: 'pro' | 'coach'): SubscriptionPlan | undefined {
    return this.plans.find(item => item.key === planKey);
  }

  private getPlanRank(plan: 'free' | 'pro' | 'coach'): number {
    switch (plan) {
      case 'coach':
        return 3;
      case 'pro':
        return 2;
      default:
        return 1;
    }
  }

  private loadPlans(): void {
    const cached = this.subscriptionService.getCachedPlans(this.localeCountryCode, this.timeZone);
    if (cached?.success) {
      this.market = cached.data.market;
      this.plans = cached.data.plans;
    }

    this.loadingPlans = true;
    this.subscriptionService.getPlans(this.localeCountryCode, this.timeZone).pipe(
      finalize(() => {
        this.loadingPlans = false;
      })
    ).subscribe({
      next: (res) => {
        if (!res.success) {
          this.toastService.error('Unable to load pricing right now.');
          return;
        }

        this.market = res.data.market;
        this.plans = res.data.plans;
      },
      error: () => this.toastService.error('Unable to load pricing right now.')
    });
  }

  private async verifyReferenceIfNeeded() {
    const reference = this.route.snapshot.queryParamMap.get('reference')
      ?? this.route.snapshot.queryParamMap.get('session_id');
    const provider = this.route.snapshot.queryParamMap.get('provider') as 'paystack' | 'flutterwave' | null;
    const token = await this.authService.ensureValidToken();

    if (!reference || !token) {
      return;
    }

    this.verifyingReference = true;
    this.subscriptionService.verify(reference, provider ?? undefined).pipe(
      finalize(() => {
        this.verifyingReference = false;
        this.router.navigate([], {
          queryParams: { reference: null, session_id: null, provider: null },
          queryParamsHandling: 'merge'
        });
      })
    ).subscribe({
      next: (res) => {
        if (res.success && res.data.verified) {
          this.userService.getProfile().subscribe();
          this.toastService.success('Subscription activated successfully.');
          return;
        }

        this.toastService.error('Payment verification is pending. Please check again shortly.');
      },
      error: () => this.toastService.error('Unable to verify payment at the moment.')
    });
  }

  private detectLocaleCountryCode(): string | null {
    if (typeof navigator === 'undefined') {
      return null;
    }

    const timeZone = this.detectTimeZone();
    const timezoneImpliesAfrica = timeZone?.startsWith('Africa/') === true;
    const localeCandidates = [navigator.language, ...(navigator.languages ?? [])];
    for (const locale of localeCandidates) {
      if (!locale) {
        continue;
      }

      const normalized = locale.replace('_', '-').split('-');
      const country = normalized[normalized.length - 1]?.toUpperCase();
      if (country && country.length === 2) {
        if (timezoneImpliesAfrica && !this.isAfricanCountryCode(country)) {
          return null;
        }

        return country;
      }
    }

    return null;
  }

  private detectTimeZone(): string | null {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone ?? null;
    } catch {
      return null;
    }
  }

  private isAfricanCountryCode(countryCode: string): boolean {
    return new Set([
      'DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM', 'CD', 'CG', 'CI',
      'DJ', 'EG', 'GQ', 'ER', 'SZ', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR',
      'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW',
      'SH', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'TZ', 'TG', 'TN', 'UG', 'EH',
      'ZM', 'ZW'
    ]).has(countryCode);
  }
}
