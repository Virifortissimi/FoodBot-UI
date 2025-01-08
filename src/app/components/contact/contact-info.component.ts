import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="contact-info">
      <h2>Get in Touch</h2>
      
      <div class="info-items">
        <div class="info-item">
          <i class="fas fa-envelope"></i>
          <div class="item-content">
            <h3>Email Us</h3>
            <p>support&#64;foodbot.africa</p>
            <p>business&#64;foodbot.africa</p>
          </div>
        </div>

        <div class="info-item">
          <i class="fas fa-phone"></i>
          <div class="item-content">
            <h3>Call Us</h3>
            <p>+1 (555) 123-4567</p>
            <p>Mon-Fri, 9am-6pm EST</p>
          </div>
        </div>

        <div class="info-item">
          <i class="fas fa-location-dot"></i>
          <div class="item-content">
            <h3>Visit Us</h3>
            <p>123 Nutrition Street</p>
            <p>Health Valley, NU 12345</p>
          </div>
        </div>
      </div>

      <div class="social-links">
        <h3>Follow Us</h3>
        <div class="social-icons">
          <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
          <a href="#" class="social-icon"><i class="fab fa-facebook"></i></a>
          <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
          <a href="#" class="social-icon"><i class="fab fa-linkedin"></i></a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-info {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    h2 {
      margin-bottom: 2rem;
      color: var(--text);
    }

    .info-items {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .info-item i {
      font-size: 1.5rem;
      color: var(--primary);
      padding: 1rem;
      background: var(--background);
      border-radius: 12px;
    }

    .item-content h3 {
      margin-bottom: 0.5rem;
      color: var(--text);
    }

    .item-content p {
      color: var(--text-light);
      line-height: 1.6;
    }

    .social-links {
      padding-top: 2rem;
      border-top: 1px solid #e2e8f0;
    }

    .social-links h3 {
      margin-bottom: 1rem;
      color: var(--text);
    }

    .social-icons {
      display: flex;
      gap: 1rem;
    }

    .social-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: var(--background);
      border-radius: 50%;
      color: var(--primary);
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .social-icon:hover {
      background: var(--primary);
      color: white;
      transform: translateY(-2px);
    }
  `]
})
export class ContactInfoComponent {}