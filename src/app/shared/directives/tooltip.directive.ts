import { Directive, ElementRef, HostListener, Input, OnDestroy, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Directive({
    selector: '[appTooltip]',
    standalone: true
})
export class TooltipDirective implements OnDestroy {
    @Input('appTooltip') tooltipContent = '';
    private tooltipEl: HTMLElement | null = null;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        @Inject(DOCUMENT) private doc: Document,
        @Inject(PLATFORM_ID) private platformId: object
    ) { }

    @HostListener('mouseenter') onMouseEnter() {
        if (!this.tooltipContent) return;
        this.showTooltip();
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.hideTooltip();
    }

    @HostListener('focusin') onFocusIn() {
        if (!this.tooltipContent) return;
        this.showTooltip();
    }

    @HostListener('focusout') onFocusOut() {
        this.hideTooltip();
    }

    ngOnDestroy(): void {
        this.hideTooltip();
    }

    private showTooltip() {
        if (!isPlatformBrowser(this.platformId) || this.tooltipEl) {
            return;
        }

        this.tooltipEl = this.renderer.createElement('div');
        this.renderer.appendChild(this.tooltipEl, this.renderer.createText(this.tooltipContent));

        this.renderer.setStyle(this.tooltipEl, 'position', 'absolute');
        this.renderer.setStyle(this.tooltipEl, 'background', '#1a1a1a');
        this.renderer.setStyle(this.tooltipEl, 'color', '#fff');
        this.renderer.setStyle(this.tooltipEl, 'padding', '8px 12px');
        this.renderer.setStyle(this.tooltipEl, 'border-radius', '8px');
        this.renderer.setStyle(this.tooltipEl, 'font-size', '12px');
        this.renderer.setStyle(this.tooltipEl, 'z-index', '1000');
        this.renderer.setStyle(this.tooltipEl, 'width', '200px');
        this.renderer.setStyle(this.tooltipEl, 'pointer-events', 'none');
        this.renderer.setStyle(this.tooltipEl, 'box-shadow', '0 4px 6px -1px rgb(0 0 0 / 0.1)');

        this.renderer.appendChild(this.doc.body, this.tooltipEl);

        const hostPos = this.el.nativeElement.getBoundingClientRect();
        const tooltipPos = this.tooltipEl!.getBoundingClientRect();

        const top = hostPos.top - tooltipPos.height - 10;
        const left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;

        this.renderer.setStyle(this.tooltipEl, 'top', `${top + window.scrollY}px`);
        this.renderer.setStyle(this.tooltipEl, 'left', `${left + window.scrollX}px`);
        this.renderer.setStyle(this.tooltipEl, 'opacity', '1');
        this.renderer.setStyle(this.tooltipEl, 'transition', 'opacity 0.2s ease');
    }

    private hideTooltip() {
        if (this.tooltipEl && isPlatformBrowser(this.platformId)) {
            if (this.tooltipEl.parentNode === this.doc.body) {
                this.renderer.removeChild(this.doc.body, this.tooltipEl);
            }
            this.tooltipEl = null;
        }
    }
}
