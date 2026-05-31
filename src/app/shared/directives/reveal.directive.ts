import { Directive, Input, ElementRef, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type RevealVariant = 'up' | 'fade' | 'left' | 'right' | 'scale-up' | 'blur-up';

@Directive({ selector: '[fbReveal]', standalone: true })
export class RevealDirective implements OnInit, OnDestroy {
    @Input('fbReveal') variant: RevealVariant = 'up';
    @Input() revealDelay = 0;
    @Input() revealDuration = 700;

    private io!: IntersectionObserver;

    private readonly starts: Record<RevealVariant, Partial<CSSStyleDeclaration>> = {
        'up': { opacity: '0', transform: 'translateY(32px)' },
        'fade': { opacity: '0', transform: 'none' },
        'left': { opacity: '0', transform: 'translateX(-32px)' },
        'right': { opacity: '0', transform: 'translateX(32px)' },
        'scale-up': { opacity: '0', transform: 'scale(0.92) translateY(20px)' },
        'blur-up': { opacity: '0', transform: 'translateY(24px)', filter: 'blur(8px)' },
    };

    constructor(
        private el: ElementRef,
        @Inject(PLATFORM_ID) private platformId: object
    ) { }

    ngOnInit() {
        if (!isPlatformBrowser(this.platformId)) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const el = this.el.nativeElement as HTMLElement;
        const start = this.starts[this.variant];

        Object.assign(el.style, start);
        el.style.willChange = 'opacity, transform, filter';
        el.style.transition = [
            `opacity ${this.revealDuration}ms var(--ease-snap) ${this.revealDelay}ms`,
            `transform ${this.revealDuration}ms var(--ease-snap) ${this.revealDelay}ms`,
            this.variant === 'blur-up'
                ? `filter ${this.revealDuration}ms var(--ease-snap) ${this.revealDelay}ms`
                : '',
        ].filter(Boolean).join(', ');

        this.io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.style.opacity = '1';
                    el.style.transform = 'none';
                    el.style.filter = 'none';
                    this.io.disconnect();
                    setTimeout(() => { el.style.willChange = 'auto'; },
                        this.revealDuration + this.revealDelay + 100);
                }
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );
        this.io.observe(el);
    }

    ngOnDestroy() { this.io?.disconnect(); }
}
