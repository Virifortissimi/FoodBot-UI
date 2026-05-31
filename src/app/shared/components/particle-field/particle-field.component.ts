import {
    Component, Input, ElementRef, ViewChild,
    AfterViewInit, OnDestroy, NgZone, ChangeDetectionStrategy, Inject, PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Particle {
    x: number; y: number;
    vx: number; vy: number;
    r: number;
    baseAlpha: number;
    alpha: number;
    alphaTarget: number;
    alphaSpeed: number;
    alphaPulseTimer: number;
    alphaPulseInterval: number;
    color: string;
}

@Component({
    selector: 'fb-particle-field',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <canvas #canvas
      aria-hidden="true"
      role="presentation"
      class="absolute inset-0 w-full h-full pointer-events-none"
      style="z-index: 1;">
    </canvas>`,
})
export class ParticleFieldComponent implements AfterViewInit, OnDestroy {
    @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

    @Input() density: 'sparse' | 'normal' | 'dense' = 'normal';
    @Input() variant: 'light' | 'dark' = 'light';

    private particles: Particle[] = [];
    private raf = 0;
    private ro!: ResizeObserver;

    // Colour palettes per variant
    private readonly palettes = {
        light: ['#6B74E8', '#9099F0', '#B5BAF6', '#7B83EC'],
        dark: ['#9099F0', '#B5BAF6', '#D0D4FA', '#C0C5F8'],
    };

    private get targetCount(): number {
        const base = { sparse: 35, normal: 65, dense: 100 }[this.density];
        if (!isPlatformBrowser(this.platformId)) return base;
        // Reduce automatically on mobile
        return window.innerWidth < 768 ? Math.floor(base * 0.4) : base;
    }

    constructor(
        private zone: NgZone,
        @Inject(PLATFORM_ID) private platformId: object
    ) { }

    ngAfterViewInit() {
        if (!isPlatformBrowser(this.platformId)) return;
        const canvas = this.canvasRef.nativeElement;

        // Respect prefers-reduced-motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            canvas.style.opacity = '0.15';
            this.drawStaticSnapshot(canvas);
            return;
        }

        this.ro = new ResizeObserver(() => this.resize(canvas));
        this.ro.observe(canvas.parentElement!);
        this.resize(canvas);

        // Run outside Angular change detection — critical for performance
        this.zone.runOutsideAngular(() => this.loop(canvas));
    }

    private resize(canvas: HTMLCanvasElement) {
        const dpr = Math.min(window.devicePixelRatio, 2);
        const parent = canvas.parentElement!;
        const w = parent.clientWidth;
        const h = parent.clientHeight;

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;

        const ctx = canvas.getContext('2d')!;
        ctx.scale(dpr, dpr);
        this.initParticles(w, h);
    }

    private initParticles(w: number, h: number) {
        const colors = this.palettes[this.variant];
        const n = this.targetCount;
        this.particles = Array.from({ length: n }, () => {
            const baseAlpha = 0.18 + Math.random() * 0.35;
            const pulseRange = 0.12 + Math.random() * 0.18;

            // Size: biased toward small particles
            const sizeRoll = Math.random();
            const r = sizeRoll < 0.60 ? 1 + Math.random() * 1.2         // 60% small: 1–2.2px
                : sizeRoll < 0.88 ? 2.5 + Math.random() * 1.2       // 28% medium: 2.5–3.7px
                    : 4 + Math.random() * 1.4;         // 12% large: 4–5.4px

            return {
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.22,
                vy: (Math.random() - 0.5) * 0.14,
                r,
                baseAlpha,
                alpha: baseAlpha,
                alphaTarget: baseAlpha + pulseRange,
                alphaSpeed: 0.0008 + Math.random() * 0.001,
                alphaPulseTimer: 0,
                alphaPulseInterval: 3000 + Math.random() * 5000,
                color: colors[Math.floor(Math.random() * colors.length)],
            };
        });
    }

    private loop(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d')!;
        const dpr = Math.min(window.devicePixelRatio, 2);

        const tick = () => {
            const w = canvas.width / dpr;
            const h = canvas.height / dpr;

            ctx.clearRect(0, 0, w, h);

            for (const p of this.particles) {
                // Drift
                p.x += p.vx;
                p.y += p.vy;

                // Wrap at boundaries with a small margin
                if (p.x < -10) p.x = w + 10;
                if (p.x > w + 10) p.x = -10;
                if (p.y < -10) p.y = h + 10;
                if (p.y > h + 10) p.y = -10;

                // Opacity pulse — each particle has its own cycle
                p.alphaPulseTimer += 16.67;   // ~60fps frame tick
                if (p.alphaPulseTimer > p.alphaPulseInterval) {
                    p.alphaPulseTimer = 0;
                    p.alphaTarget = p.alphaTarget === p.baseAlpha
                        ? p.baseAlpha + 0.18 + Math.random() * 0.14
                        : p.baseAlpha;
                }
                p.alpha += (p.alphaTarget - p.alpha) * p.alphaSpeed * 60;

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
                ctx.fill();
            }

            ctx.globalAlpha = 1;
            this.raf = requestAnimationFrame(tick);
        };

        this.raf = requestAnimationFrame(tick);
    }

    private drawStaticSnapshot(canvas: HTMLCanvasElement) {
        const dpr = Math.min(window.devicePixelRatio, 2);
        const parent = canvas.parentElement!;
        const w = parent.clientWidth;
        const h = parent.clientHeight;

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        const ctx = canvas.getContext('2d')!;
        ctx.scale(dpr, dpr);
        this.initParticles(w, h);
        const colors = this.palettes[this.variant];

        for (const p of this.particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = colors[0];
            ctx.globalAlpha = p.baseAlpha * 0.5;
            ctx.fill();
        }
    }

    ngOnDestroy() {
        if (this.raf) cancelAnimationFrame(this.raf);
        this.ro?.disconnect();
    }
}
