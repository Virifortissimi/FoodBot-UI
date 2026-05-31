import { Directive, Input, ElementRef, AfterViewInit } from '@angular/core';

@Directive({ selector: '[fbStagger]', standalone: true })
export class StaggerDirective implements AfterViewInit {
    @Input('fbStagger') set stepInput(val: string | number) { this.step = Number(val) || 90; }
    step = 90;
    @Input() staggerStart = 0;

    constructor(private el: ElementRef) { }

    ngAfterViewInit() {
        const children = Array.from(
            (this.el.nativeElement as HTMLElement).children
        ) as HTMLElement[];

        children.forEach((child, i) => {
            child.style.transitionDelay = `${this.staggerStart + i * this.step}ms`;
        });
    }
}
