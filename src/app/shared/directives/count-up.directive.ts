import { Directive, Input, ElementRef, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({ selector: '[fbCountUp]', standalone: true })
export class CountUpDirective implements OnInit {
    @Input('fbCountUp') target = 0;
    @Input() countDuration = 1800;
    @Input() countDecimals = 0;
    @Input() countPrefix = '';
    @Input() countSuffix = '';

    private io!: IntersectionObserver;

    constructor(
        private el: ElementRef,
        @Inject(PLATFORM_ID) private platformId: object
    ) { }

    ngOnInit() {
        if (!isPlatformBrowser(this.platformId)) {
            this.el.nativeElement.textContent =
                this.countPrefix + this.target.toFixed(this.countDecimals) + this.countSuffix;
            return;
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.el.nativeElement.textContent =
                this.countPrefix + this.target.toFixed(this.countDecimals) + this.countSuffix;
            return;
        }

        this.io = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { this.run(); this.io.disconnect(); } },
            { threshold: 0.5 }
        );
        this.io.observe(this.el.nativeElement);
    }

    private run() {
        const el = this.el.nativeElement;
        const t0 = performance.now();

        const frame = (now: number) => {
            const progress = Math.min((now - t0) / this.countDuration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = eased * this.target;
            el.textContent = this.countPrefix
                + value.toLocaleString('en', { maximumFractionDigits: this.countDecimals })
                + this.countSuffix;
            if (progress < 1) requestAnimationFrame(frame);
        };

        requestAnimationFrame(frame);
    }
}
