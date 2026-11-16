import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdBannerComponent } from '../../components/ads/ad-banner/ad-banner';

export type UnitCategory = 'length' | 'weight' | 'temperature' | 'storage' | 'area' | 'speed';

interface UnitDef {
  id: string;
  name: string;
  toBase: (val: number) => number;
  fromBase: (baseVal: number) => number;
}

@Component({
  selector: 'app-unit-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdBannerComponent],
  templateUrl: './unit-converter.component.html',
  styleUrl: './unit-converter.component.css'
})
export class UnitConverterComponent {
  public activeCategory = signal<UnitCategory>('length');

  public fromValue = signal<number>(1);
  public fromUnit = signal<string>('meter');
  public toUnit = signal<string>('foot');

  // Definitions for all units normalized to base unit
  public readonly unitDefinitions: Record<UnitCategory, UnitDef[]> = {
    length: [
      { id: 'meter', name: 'Meters (m)', toBase: v => v, fromBase: v => v },
      { id: 'kilometer', name: 'Kilometers (km)', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'centimeter', name: 'Centimeters (cm)', toBase: v => v * 0.01, fromBase: v => v * 100 },
      { id: 'millimeter', name: 'Millimeters (mm)', toBase: v => v * 0.001, fromBase: v => v * 1000 },
      { id: 'mile', name: 'Miles (mi)', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
      { id: 'yard', name: 'Yards (yd)', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
      { id: 'foot', name: 'Feet (ft)', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      { id: 'inch', name: 'Inches (in)', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 }
    ],
    weight: [
      { id: 'kilogram', name: 'Kilograms (kg)', toBase: v => v, fromBase: v => v },
      { id: 'gram', name: 'Grams (g)', toBase: v => v * 0.001, fromBase: v => v * 1000 },
      { id: 'milligram', name: 'Milligrams (mg)', toBase: v => v * 0.000001, fromBase: v => v * 1000000 },
      { id: 'pound', name: 'Pounds (lbs)', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
      { id: 'ounce', name: 'Ounces (oz)', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
      { id: 'ton', name: 'Metric Tons (t)', toBase: v => v * 1000, fromBase: v => v / 1000 }
    ],
    temperature: [
      { id: 'celsius', name: 'Celsius (°C)', toBase: v => v, fromBase: v => v },
      { id: 'fahrenheit', name: 'Fahrenheit (°F)', toBase: v => (v - 32) * (5 / 9), fromBase: v => (v * 9 / 5) + 32 },
      { id: 'kelvin', name: 'Kelvin (K)', toBase: v => v - 273.15, fromBase: v => v + 273.15 }
    ],
    storage: [
      { id: 'byte', name: 'Bytes (B)', toBase: v => v, fromBase: v => v },
      { id: 'kb', name: 'Kilobytes (KB)', toBase: v => v * 1024, fromBase: v => v / 1024 },
      { id: 'mb', name: 'Megabytes (MB)', toBase: v => v * 1048576, fromBase: v => v / 1048576 },
      { id: 'gb', name: 'Gigabytes (GB)', toBase: v => v * 1073741824, fromBase: v => v / 1073741824 },
      { id: 'tb', name: 'Terabytes (TB)', toBase: v => v * 1099511627776, fromBase: v => v / 1099511627776 }
    ],
    area: [
      { id: 'sq_meter', name: 'Square Meters (m²)', toBase: v => v, fromBase: v => v },
      { id: 'sq_km', name: 'Square Kilometers (km²)', toBase: v => v * 1000000, fromBase: v => v / 1000000 },
      { id: 'sq_foot', name: 'Square Feet (ft²)', toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
      { id: 'acre', name: 'Acres', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
      { id: 'hectare', name: 'Hectares', toBase: v => v * 10000, fromBase: v => v / 10000 }
    ],
    speed: [
      { id: 'kmh', name: 'Kilometers per hour (km/h)', toBase: v => v, fromBase: v => v },
      { id: 'mph', name: 'Miles per hour (mph)', toBase: v => v * 1.60934, fromBase: v => v / 1.60934 },
      { id: 'mps', name: 'Meters per second (m/s)', toBase: v => v * 3.6, fromBase: v => v / 3.6 },
      { id: 'knot', name: 'Knots (kn)', toBase: v => v * 1.852, fromBase: v => v / 1.852 }
    ]
  };

  public currentUnitList = computed(() => {
    return this.unitDefinitions[this.activeCategory()];
  });

  public convertedValue = computed(() => {
    const units = this.currentUnitList();
    const fromDef = units.find(u => u.id === this.fromUnit()) || units[0];
    const toDef = units.find(u => u.id === this.toUnit()) || units[1];

    const val = Number(this.fromValue()) || 0;
    const baseVal = fromDef.toBase(val);
    const result = toDef.fromBase(baseVal);

    return parseFloat(result.toFixed(6));
  });

  public setCategory(cat: UnitCategory): void {
    this.activeCategory.set(cat);
    const list = this.unitDefinitions[cat];
    this.fromUnit.set(list[0].id);
    this.toUnit.set(list[1] ? list[1].id : list[0].id);
    this.fromValue.set(1);
  }

  public swapUnits(): void {
    const temp = this.fromUnit();
    this.fromUnit.set(this.toUnit());
    this.toUnit.set(temp);
  }
}
