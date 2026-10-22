import { describe, it, expect } from 'vitest';
import {
  calculateBmi,
  getBmiCategory,
  getAgeBand,
  getHealthyWeightRangeKg,
} from '../src/services/bmiService.js';

describe('BMI and Age Band Calculations', () => {
  it('calculates BMI boundaries correctly at height 200 cm', () => {
    // 72 kg -> 18.0 underweight
    const bmi72 = calculateBmi(200, 72);
    expect(bmi72).toBe(18.0);
    expect(getBmiCategory(bmi72)).toBe('underweight');

    // 74 kg -> 18.5 normal
    const bmi74 = calculateBmi(200, 74);
    expect(bmi74).toBe(18.5);
    expect(getBmiCategory(bmi74)).toBe('normal');

    // 99.6 kg -> 24.9 normal
    const bmi99_6 = calculateBmi(200, 99.6);
    expect(bmi99_6).toBe(24.9);
    expect(getBmiCategory(bmi99_6)).toBe('normal');

    // 100 kg -> 25.0 overweight
    const bmi100 = calculateBmi(200, 100);
    expect(bmi100).toBe(25.0);
    expect(getBmiCategory(bmi100)).toBe('overweight');

    // 119.6 kg -> 29.9 overweight
    const bmi119_6 = calculateBmi(200, 119.6);
    expect(bmi119_6).toBe(29.9);
    expect(getBmiCategory(bmi119_6)).toBe('overweight');

    // 120 kg -> 30.0 obese
    const bmi120 = calculateBmi(200, 120);
    expect(bmi120).toBe(30.0);
    expect(getBmiCategory(bmi120)).toBe('obese');
  });

  it('determines ageBand correctly', () => {
    expect(getAgeBand(18)).toBe('adult');
    expect(getAgeBand(39)).toBe('adult');
    expect(getAgeBand(40)).toBe('midlife');
    expect(getAgeBand(54)).toBe('midlife');
    expect(getAgeBand(55)).toBe('senior');
    expect(getAgeBand(80)).toBe('senior');
  });

  it('computes healthy weight range accurately', () => {
    expect(getHealthyWeightRangeKg(175)).toEqual({ min: 56.7, max: 76.3 });
    expect(getHealthyWeightRangeKg(200)).toEqual({ min: 74.0, max: 99.6 });
  });
});
