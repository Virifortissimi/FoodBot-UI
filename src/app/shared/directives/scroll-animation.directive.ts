import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[fbScrollAnim]',
  standalone: true
})
export class ScrollAnimationDirective implements OnInit, OnDestroy {
  @Input() fbScrollAnim: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' = 'fade-up';
  @Input() delay = 0;

  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          this.el.nativeElement.classList.add('anim-visible');
        }, this.delay);
        this.observer?.disconnect();
      }
    }, { threshold: 0.15 });

    this.el.nativeElement.classList.add('fb-scroll-anim');
    this.el.nativeElement.setAttribute('data-anim', this.fbScrollAnim);
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
