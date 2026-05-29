import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { EDITORIALS, Editorial } from './home.data';
 
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
 
  slides: Product[] = [];
  editorials: Editorial[] = EDITORIALS;
  currentSlide = 0;
  loading = true;
 
  private autoplayInterval: ReturnType<typeof setInterval> | null = null;
 
  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}
 
  ngOnInit(): void {
    this.productService.getProducts(0, 5)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (page) => {
          this.slides = page.content;
          this.loading = false;
          this.cdr.detectChanges();
          this.startAutoplay();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }
 
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopAutoplay();
  }
 
  prevSlide(): void {
    this.zone.run(() => {
      this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
      this.cdr.detectChanges();
    });
    this.restartAutoplay();
  }
 
  nextSlide(): void {
    this.zone.run(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
      this.cdr.detectChanges();
    });
    this.restartAutoplay();
  }
 
  goToSlide(i: number): void {
    this.zone.run(() => {
      this.currentSlide = i;
      this.cdr.detectChanges();
    });
    this.restartAutoplay();
  }
 
  private startAutoplay(): void {
    this.zone.runOutsideAngular(() => {
      this.autoplayInterval = setInterval(() => {
        this.zone.run(() => {
          this.currentSlide = (this.currentSlide + 1) % this.slides.length;
          this.cdr.detectChanges();
        });
      }, 5000);
    });
  }
 
  private stopAutoplay(): void {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
 
  private restartAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }
}