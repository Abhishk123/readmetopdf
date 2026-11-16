import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversionStatus } from '../../models/conversion.model';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.css'
})
export class ProgressBarComponent {
  @Input() percentage: number = 0;
  @Input() status: ConversionStatus = 'idle';
  @Input() message: string = '';
}
