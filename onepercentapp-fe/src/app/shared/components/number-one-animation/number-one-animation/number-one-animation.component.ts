import { Component, Input, ElementRef, ViewChild, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { createAnimation } from '@ionic/angular';
@Component({
  standalone: true,
  selector: 'app-number-one-animation',
  templateUrl: './number-one-animation.component.html',
  styleUrls: ['./number-one-animation.component.css']
})
export class NumberOneAnimationComponent implements OnInit, OnChanges {

  @Input() percentage: number = 0;
  @Input() fillColor: string = '#FF5733';
  @Input() duration: number = 2000;
  @Input() shape: 'shape1' | 'shape2' = 'shape1';

  @ViewChild('fillRect', { static: true }) fillRef!: ElementRef<SVGRectElement>;

  totalHeight: number = 642;
  uniqueId: string = '';

  ngOnInit(): void {
    this.uniqueId = `clipPath-${this.shape}`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['percentage'] || changes['duration']) {
      this.animateFill();
    }
  }

  animateFill(): void {
    if (!this.fillRef) return;

    const targetHeight = (this.percentage / 100) * this.totalHeight;

    const rect = this.fillRef.nativeElement;
    rect.setAttribute('y', this.totalHeight.toString());
    rect.setAttribute('height', '0');

    const animation = createAnimation()
      .addElement(rect)
      .duration(this.duration)
      .keyframes([
        { offset: 0, transform: 'translateY(0)', height: '0' },
        { offset: 1, transform: `translateY(-${targetHeight}px)`, height: `${targetHeight}px` },
      ]);

    animation.play();
  }

  getShapePath(): string {
    return this.shape === 'shape1'
      ? 'M183.48,0h91.75v642.2h-91.74V205.13c-48.69,43.59-112.99,70.1-183.48,70.1v-91.74c101.33,0,183.48-82.15,183.48-183.48h0Z'
      : 'M91.75,0c0,101.34,82.15,183.48,183.48,183.48v91.74c-70.5,0-134.79-26.52-183.48-70.1v437.07H0V0h0S91.75,0,91.75,0h0Z';
  }

}
