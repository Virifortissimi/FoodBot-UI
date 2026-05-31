import { CommonModule } from '@angular/common';
import { Component, OnInit, afterNextRender, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SeoService } from '../../../../core/services/seo.service';
import { ToastService } from '../../../../core/services/toast.service';
import {
    API_DOCS_AUTH_STEPS,
    API_DOCS_BASE_URL,
    API_DOCS_ERRORS,
    API_DOCS_HIGHLIGHTS,
    API_DOCS_SECTIONS,
    ApiDocEndpoint,
    ApiDocSection
} from '../../data/api-docs.data';

@Component({
    selector: 'app-api-docs-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './api-docs-page.component.html',
    styleUrl: './api-docs-page.component.css'
})
export class ApiDocsPageComponent implements OnInit {
    private readonly seoService = inject(SeoService);
    private readonly toastService = inject(ToastService);
    private readonly router = inject(Router);

    protected readonly baseUrl = API_DOCS_BASE_URL;
    protected readonly highlights = API_DOCS_HIGHLIGHTS;
    protected readonly authSteps = API_DOCS_AUTH_STEPS;
    protected readonly sections = API_DOCS_SECTIONS;
    protected readonly errorRows = API_DOCS_ERRORS;
    protected readonly navItems = computed(() => [
        { id: 'overview', label: 'Overview' },
        { id: 'authentication', label: 'Authentication' },
        ...this.sections.map(section => ({ id: section.id, label: section.title })),
        { id: 'errors', label: 'Errors' }
    ]);
    protected readonly sampleSelections = signal<Record<string, string>>(
        this.sections.flatMap(section => section.endpoints)
            .reduce<Record<string, string>>((acc, endpoint) => {
                acc[endpoint.id] = endpoint.samples[0]?.label ?? '';
                return acc;
            }, {})
    );

    ngOnInit(): void {
        this.seoService.setPageMeta({
            title: 'API Docs by Scalefort',
            description: 'Private, client-facing FoodBot API documentation for approved integrations managed by Scalefort and issued API keys.',
            url: '/api-docs'
        });

        afterNextRender(() => {
            void this.scrollToCurrentFragment(false);
        });
    }

    protected selectSample(endpointId: string, label: string): void {
        this.sampleSelections.update(state => ({
            ...state,
            [endpointId]: label
        }));
    }

    protected currentSample(endpoint: ApiDocEndpoint) {
        const selected = this.sampleSelections()[endpoint.id];
        return endpoint.samples.find(sample => sample.label === selected) ?? endpoint.samples[0];
    }

    protected trackSection(_index: number, section: ApiDocSection): string {
        return section.id;
    }

    protected trackEndpoint(_index: number, endpoint: ApiDocEndpoint): string {
        return endpoint.id;
    }

    protected async goToSection(sectionId: string, event?: Event): Promise<void> {
        event?.preventDefault();

        await this.router.navigate(['/api-docs'], {
            fragment: sectionId,
            replaceUrl: false
        });

        await this.scrollToCurrentFragment(true);
    }

    protected async copyText(value: string, label: string): Promise<void> {
        if (typeof navigator === 'undefined' || !navigator.clipboard) {
            this.toastService.error('Clipboard is not available in this browser.');
            return;
        }

        await navigator.clipboard.writeText(value);
        this.toastService.success(`${label} copied.`);
    }

    private async scrollToCurrentFragment(smooth: boolean): Promise<void> {
        if (typeof document === 'undefined') {
            return;
        }

        await new Promise(resolve => requestAnimationFrame(resolve));

        const fragment = this.router.parseUrl(this.router.url).fragment;
        if (!fragment) {
            return;
        }

        document.getElementById(fragment)?.scrollIntoView({
            behavior: smooth ? 'smooth' : 'auto',
            block: 'start'
        });
    }
}
