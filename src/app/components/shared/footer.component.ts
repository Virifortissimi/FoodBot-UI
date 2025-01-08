import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>FoodBot</h3>
          <p>AI-powered nutrition assistant helping you achieve your health goals.</p>
        </div>
        
        <div class="footer-section">
          <h4>Product</h4>
          <ul>
            <li><a routerLink="/features">Features</a></li>
            <li><a routerLink="/pricing">Pricing</a></li>
            <li><a routerLink="/meal-planner">Meal Planner</a></li>
            <li><a routerLink="/nutritionist">Nutritionist</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Company</h4>
          <ul>
            <li><a routerLink="/about">About Us</a></li>
            <li><a routerLink="/blog">Blog</a></li>
            <li><a routerLink="/careers">Careers</a></li>
            <li><a routerLink="/contact">Contact</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><a routerLink="/privacy">Privacy Policy</a></li>
            <li><a routerLink="/terms">Terms of Service</a></li>
            <li><a routerLink="/cookies">Cookie Policy</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="social-links">
          <a href="#"><i class="fab fa-twitter"></i></a>
          <a href="#"><i class="fab fa-facebook"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-linkedin"></i></a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #1a1a1a;
      color: white;
      padding: 4rem 2rem 2rem;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      margin-bottom: 3rem;
    }

    .footer-section h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    .footer-section h4 {
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }

    .footer-section ul {
      list-style: none;
      padding: 0;
    }

    .footer-section ul li {
      margin-bottom: 0.5rem;
    }

    .footer-section a {
      color: #999;
      text-decoration: none;
      transition: color 0.3s;
    }

    .footer-section a:hover {
      color: white;
    }

    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding-top: 2rem;
      border-top: 1px solid #333;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .social-links {
      display: flex;
      gap: 1rem;
    }

    .social-links a {
      color: #999;
      font-size: 1.5rem;
      transition: color 0.3s;
    }

    .social-links a:hover {
      color: white;
    }

    @media (max-width: 768px) {
      .footer-bottom {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }
    }
  `]
})
export class FooterComponent {}