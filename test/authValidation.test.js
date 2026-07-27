import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from '../src/validations/authSchema';
import { eventSchema } from '../src/validations/eventSchema';

describe('Auth Validation Schemas Test Suite', () => {
  it('should fail registration when password is weak', () => {
    const invalidData = {
      email: 'user@example.com',
      password: 'weakpassword', // thiếu hoa và ký tự đặc biệt
      confirmPassword: 'weakpassword'
    };
    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should pass registration when password matches strict regex', () => {
    const validData = {
      email: 'user@example.com',
      password: 'StrongPass123!',
      confirmPassword: 'StrongPass123!'
    };
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail when confirmPassword does not match password', () => {
    const mismatchData = {
      email: 'user@example.com',
      password: 'StrongPass123!',
      confirmPassword: 'DifferentPass123!'
    };
    const result = registerSchema.safeParse(mismatchData);
    expect(result.success).toBe(false);
  });
});

describe('Event Validation Schema Test Suite', () => {
  it('should fail if endTime is before startTime', () => {
    const invalidEvent = {
      title: 'Đi dạo bãi biển',
      startTime: '10:00',
      endTime: '08:00',
      category: 'Ngắm cảnh',
      status: 'Sắp tới'
    };
    const result = eventSchema.safeParse(invalidEvent);
    expect(result.success).toBe(false);
  });

  it('should pass if endTime is after startTime', () => {
    const validEvent = {
      title: 'Đi dạo bãi biển',
      startTime: '08:00',
      endTime: '10:00',
      category: 'Ngắm cảnh',
      status: 'Sắp tới'
    };
    const result = eventSchema.safeParse(validEvent);
    expect(result.success).toBe(true);
  });
});
