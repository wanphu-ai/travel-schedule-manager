export const mapFirebaseError = (errorCode) => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Email không hợp lệ. Vui lòng kiểm tra lại.';
    case 'auth/user-disabled':
      return 'Tài khoản của bạn đã bị khóa.';
    case 'auth/user-not-found':
      return 'Không tìm thấy tài khoản với email này.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email hoặc mật khẩu không chính xác.';
    case 'auth/email-already-in-use':
      return 'Email này đã được sử dụng bởi một tài khoản khác.';
    case 'auth/weak-password':
      return 'Mật khẩu quá yếu, cần tối thiểu 8 ký tự và có ký tự đặc biệt.';
    case 'auth/too-many-requests':
      return 'Quá nhiều lần đăng nhập không thành công. Vui lòng thử lại sau.';
    case 'auth/network-request-failed':
      return 'Lỗi kết nối mạng. Vui lòng kiểm tra lại Internet.';
    default:
      return 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.';
  }
};
