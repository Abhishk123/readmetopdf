import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../components/ads/ad-banner/ad-banner';

export interface CourseEntry {
  id: string;
  name: string;
  credits: number;
  gradeValue: number;
}

@Component({
  selector: 'app-gpa-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdBannerComponent],
  templateUrl: './gpa-calculator.component.html',
  styleUrl: './gpa-calculator.component.css'
})
export class GpaCalculatorComponent implements OnInit {
  public scale = signal<'4.0' | '10.0'>('4.0');

  public courses = signal<CourseEntry[]>([
    { id: '1', name: 'Mathematics', credits: 4, gradeValue: 4.0 },
    { id: '2', name: 'Computer Science', credits: 4, gradeValue: 3.7 },
    { id: '3', name: 'Physics / Science', credits: 3, gradeValue: 3.3 },
    { id: '4', name: 'English Literature', credits: 3, gradeValue: 4.0 },
    { id: '5', name: 'Data Structures Lab', credits: 2, gradeValue: 3.7 }
  ]);

  // Standard 4.0 Grade Mapping Options
  public readonly gradeScale4 = [
    { label: 'A  (4.0)', value: 4.0 },
    { label: 'A- (3.7)', value: 3.7 },
    { label: 'B+ (3.3)', value: 3.3 },
    { label: 'B  (3.0)', value: 3.0 },
    { label: 'B- (2.7)', value: 2.7 },
    { label: 'C+ (2.3)', value: 2.3 },
    { label: 'C  (2.0)', value: 2.0 },
    { label: 'C- (1.7)', value: 1.7 },
    { label: 'D  (1.0)', value: 1.0 },
    { label: 'F  (0.0)', value: 0.0 }
  ];

  // 10.0 CGPA Scale Mapping Options
  public readonly gradeScale10 = [
    { label: 'O / Outstanding (10.0)', value: 10.0 },
    { label: 'A+ / Excellent (9.0)', value: 9.0 },
    { label: 'A / Very Good (8.0)', value: 8.0 },
    { label: 'B+ / Good (7.0)', value: 7.0 },
    { label: 'B / Above Average (6.0)', value: 6.0 },
    { label: 'C / Average (5.0)', value: 5.0 },
    { label: 'P / Pass (4.0)', value: 4.0 },
    { label: 'F / Fail (0.0)', value: 0.0 }
  ];

  public totalCredits = computed(() => {
    return this.courses().reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
  });

  public totalGradePoints = computed(() => {
    return this.courses().reduce((sum, c) => {
      const cr = Number(c.credits) || 0;
      const g = Number(c.gradeValue) || 0;
      return sum + (cr * g);
    }, 0);
  });

  public calculatedGpa = computed(() => {
    const credits = this.totalCredits();
    if (credits === 0) return 0;
    const gpa = this.totalGradePoints() / credits;
    return parseFloat(gpa.toFixed(2));
  });

  public estimatedPercentage = computed(() => {
    const gpa = this.calculatedGpa();
    if (this.scale() === '4.0') {
      // Standard US % mapping: (GPA / 4.0) * 100 or 20*GPA + 20
      return Math.min(100, Math.round((gpa / 4.0) * 100));
    } else {
      // 10.0 Scale standard formula: GPA * 9.5
      return Math.min(100, parseFloat((gpa * 9.5).toFixed(1)));
    }
  });

  public academicStanding = computed(() => {
    const gpa = this.calculatedGpa();
    if (this.scale() === '4.0') {
      if (gpa >= 3.8) return "Highest Honors (Summa Cum Laude)";
      if (gpa >= 3.5) return "Dean's List / Honors";
      if (gpa >= 3.0) return "Good Standing";
      if (gpa >= 2.0) return "Satisfactory";
      return "Academic Warning";
    } else {
      if (gpa >= 9.0) return "First Class with Distinction";
      if (gpa >= 7.5) return "First Class";
      if (gpa >= 6.0) return "Second Class";
      return "Pass";
    }
  });

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('jsns_gpa_courses');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.courses.set(parsed);
          }
        }
      } catch (e) {
        // Fallback to defaults
      }
    }
  }

  public saveToStorage(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('jsns_gpa_courses', JSON.stringify(this.courses()));
      } catch (e) {}
    }
  }

  public switchScale(s: '4.0' | '10.0'): void {
    this.scale.set(s);
    // Adjust default grade values if switching scales
    const updated = this.courses().map(c => ({
      ...c,
      gradeValue: s === '10.0' ? (c.gradeValue <= 4.0 ? c.gradeValue * 2.5 : c.gradeValue) : (c.gradeValue > 4.0 ? 3.7 : c.gradeValue)
    }));
    this.courses.set(updated);
    this.saveToStorage();
  }

  public addCourse(): void {
    const current = this.courses();
    const newCourse: CourseEntry = {
      id: Date.now().toString(),
      name: `Course ${current.length + 1}`,
      credits: 3,
      gradeValue: this.scale() === '4.0' ? 4.0 : 9.0
    };
    this.courses.set([...current, newCourse]);
    this.saveToStorage();
  }

  public removeCourse(id: string): void {
    if (this.courses().length <= 1) return;
    this.courses.set(this.courses().filter(c => c.id !== id));
    this.saveToStorage();
  }

  public resetCourses(): void {
    this.courses.set([
      { id: '1', name: 'Course 1', credits: 4, gradeValue: this.scale() === '4.0' ? 4.0 : 9.0 },
      { id: '2', name: 'Course 2', credits: 3, gradeValue: this.scale() === '4.0' ? 3.7 : 8.0 },
      { id: '3', name: 'Course 3', credits: 3, gradeValue: this.scale() === '4.0' ? 3.3 : 8.0 }
    ]);
    this.saveToStorage();
  }
}
