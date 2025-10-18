import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-collapsable-card',
  templateUrl: './collapsable-card.component.html',
  styleUrls: ['./collapsable-card.component.scss'],
  imports: [CommonModule, TranslateModule],
})
export class CollapsableCardComponent implements AfterViewInit {
  @Input() hour?: string;
  @Input() status?: string;
  @Input() class?: string;
  @Input() type!: 'hydration' | 'food';
  @Input() title!: string;
  @Input() icon?: string;
  @Input() recommended?: string;
  @Input() items?: any[];
  @Input() total?: number;
  @Input() points?: boolean[];

  isCollapsed = true;
  contentHeight = 0;

  @ViewChild('cardInner') cardInner!: ElementRef;

  ngAfterViewInit(): void {
    setTimeout(() => this.setExpandedHeight(), 0);
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.setExpandedHeight();
  }

  private setExpandedHeight(): void {
    if (this.cardInner?.nativeElement) {
      this.contentHeight = this.cardInner.nativeElement.scrollHeight;
    }
  }
}
