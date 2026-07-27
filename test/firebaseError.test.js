import { describe, it, expect } from 'vitest';
import { mapFirebaseError } from '../src/utils/firebaseErrorMessages';

describe('Firebase Error Mapping Unit Tests', () => {
  it('should map invalid-email code correctly', () => {
    const msg = mapFirebaseError('auth/invalid-email');
    expect(msg).toContain('Email không hợp lệ');
  });

  it('should map email-already-in-use code correctly', () => {
    const msg = mapFirebaseError('auth/email-already-in-use');
    expect(msg).toContain('Email này đã được sử dụng');
  });

  it('should map unknown error fallback correctly', () => {
    const msg = mapFirebaseError('auth/some-random-error');
    expect(msg).toContain('Đã xảy ra lỗi không xác định');
  });
});
