import { Component } from '@angular/core';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  template: `
    <section class="testimonials">
      <h2>What Our Users Say</h2>
      <div class="testimonials-grid">
        <div class="testimonial-card">
          <div class="avatar">
            <img src="https://i.pravatar.cc/150?u=1" alt="Sarah M." />
          </div>
          <p class="quote">"FoodBot helped me achieve my fitness goals through personalized meal plans. The AI recommendations are spot-on!"</p>
          <p class="author">Sarah M.</p>
          <p class="role">Fitness Enthusiast</p>
        </div>
        <div class="testimonial-card">
          <div class="avatar">
            <img src="https://i.pravatar.cc/150?u=2" alt="John D." />
          </div>
          <p class="quote">"As a busy professional, having an AI nutritionist available 24/7 has been a game-changer for my health journey."</p>
          <p class="author">John D.</p>
          <p class="role">Software Engineer</p>
        </div>
        <div class="testimonial-card">
          <div class="avatar">
            <img src="https://i.pravatar.cc/150?u=3" alt="Emily R." />
          </div>
          <p class="quote">"The recipe suggestions are creative and delicious. I've discovered so many healthy meals I never knew I could make!"</p>
          <p class="author">Emily R.</p>
          <p class="role">Home Chef</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .testimonials {
      padding: 6rem 2rem;
      background: #f8fafc;
      text-align: center;
    }

    .testimonials h2 {
      margin-bottom: 3rem;
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .testimonial-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .avatar {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
    }

    .avatar img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }

    .quote {
      font-size: 1.1rem;
      line-height: 1.6;
      color: #1e293b;
      margin-bottom: 1.5rem;
    }

    .author {
      font-weight: 600;
      color: var(--primary);
      margin-bottom: 0.25rem;
    }

    .role {
      color: var(--text-light);
      font-size: 0.9rem;
    }
  `]
})
export class TestimonialsComponent {}