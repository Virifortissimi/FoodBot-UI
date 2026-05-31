import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { CommunicationsService } from '../../services/communications.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  newsletterEmail = '';
  subscribing = false;

  constructor(
    private readonly communicationsService: CommunicationsService,
    private readonly toastService: ToastService
  ) {}

  joinNewsletter(): void {
    const email = this.newsletterEmail.trim();
    if (!email || this.subscribing) {
      return;
    }

    this.subscribing = true;
    this.communicationsService.subscribeNewsletter(email).pipe(
      finalize(() => {
        this.subscribing = false;
      })
    ).subscribe({
      next: (result) => {
        this.newsletterEmail = '';
        this.toastService.success(
          result.newlySubscribed
            ? 'You are now subscribed to the FoodBot newsletter.'
            : 'You are already subscribed to the FoodBot newsletter.'
        );
      },
      error: () => this.toastService.error('Unable to join the newsletter right now.')
    });
  }
}
