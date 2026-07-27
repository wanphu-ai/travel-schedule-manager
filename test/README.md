# 🧪 HƯỚNG DẪN KIỂM THỬ DỰ ÁN (TESTING GUIDE)

Tài liệu này chi tiết hóa toàn bộ hệ thống kiểm thử tự động (Unit Tests) và kịch bản thử nghiệm thủ công (Manual Testing) cho dự án **Travel Schedule Manager**.

---

## 📂 Cấu Trúc Thư Mục Kiểm Thử

```text
test/
├── authValidation.test.js    # Unit Tests kiểm tra Zod Validation Schemas
├── firebaseError.test.js     # Unit Tests kiểm tra Helper Mapping mã lỗi Firebase
├── manualTestCases.md        # Kịch bản kiểm thử thủ công chi tiết từng bước (Step-by-Step)
├── README.md                 # Tài liệu hướng dẫn kiểm thử (File hiện tại)
└── setup.js                  # Cấu hình môi trường Vitest & @testing-library/jest-dom
```

---

## ⚡ 1. KIỂM THỬ TỰ ĐỘNG (AUTOMATED UNIT TESTS)

Dự án sử dụng **Vitest** kết hợp với **React Testing Library** và **JSDOM** để chạy các unit test kiểm tra tính chính xác của dữ liệu nghiệp vụ và các hàm tiện ích.

### 🏃 Cách Chạy Test
Mở Terminal tại thư mục gốc của dự án và chạy câu lệnh:
```bash
npm test
```

### 📋 Danh Sách Các Bài Test Tự Động (8 Passed Tests)

#### A. Auth & Event Validation Schemas (`test/authValidation.test.js`)
1. **Password Format Regex**: Thử nghiệm đăng ký với mật khẩu yếu (`weakpassword`) $\rightarrow$ Kiểm tra chặn chính xác do thiếu chữ hoa và ký tự đặc biệt.
2. **Strict Password Validation**: Thử nghiệm với mật khẩu hợp lệ (`StrongPass123!`) $\rightarrow$ Trả về kết quả xác thực thành công.
3. **Password Match Confirmation**: Thử nghiệm khi `confirmPassword` không trùng với `password` $\rightarrow$ Trả về thông báo lỗi không trùng khớp 100%.
4. **Event Overlapping Time Validation (Start < End)**: Thử nghiệm tạo sự kiện có giờ kết thúc trước giờ bắt đầu (`10:00` đến `08:00`) $\rightarrow$ Kiểm tra chặn báo lỗi logic thời gian.
5. **Valid Event Slot**: Thử nghiệm tạo sự kiện đúng giờ (`08:00` đến `10:00`) $\rightarrow$ Xác nhận hợp lệ thành công.

#### B. Firebase Error Code Mapping (`test/firebaseError.test.js`)
1. **Invalid Email Code**: Thử nghiệm mã lỗi `auth/invalid-email` $\rightarrow$ Kiểm tra trả về câu tiếng Việt thân thiện *"Email không hợp lệ. Vui lòng kiểm tra lại."*.
2. **Email Already In Use Code**: Thử nghiệm mã `auth/email-already-in-use` $\rightarrow$ Trả về thông báo *"Email này đã được sử dụng..."*.
3. **Unknown Error Fallback**: Thử nghiệm mã lỗi lạ không có trong danh sách $\rightarrow$ Trả về thông báo lỗi mặc định an toàn.

---

## 🖐️ 2. KIỂM THỬ THỦ CÔNG (MANUAL TEST CASES)

Chi tiết kịch bản kiểm thử giao diện người dùng (UI/UX) và các luồng nghiệp vụ thực tế được trình bày đầy đủ trong file **[`manualTestCases.md`](./manualTestCases.md)** bao gồm 5 kịch bản chính:

* **Test Case 1**: Đăng ký tài khoản mới & Khởi tạo Profile ban đầu trên Cloud Firestore.
* **Test Case 2**: Đăng nhập & Kiểm tra cơ chế bảo vệ tuyến đường (Protected Routes - Chặn truy cập trái phép).
* **Test Case 3**: Chỉnh sửa thông tin cá nhân (Profile View/Edit Mode) & Bảo mật không cho chỉnh sửa UID/Email.
* **Test Case 4**: Thêm/Sửa/Xóa sự kiện, Kiểm tra Realtime Engine đếm ngược và Logic chống trùng lặp khung giờ.
* **Test Case 5**: Chuyển đổi giao diện Sáng/Tối (Dark/Light mode Toggle) & Lưu trạng thái vào `localStorage`.

---

## 🛠️ Công Nghệ Kiểm Thử Sử Dụng
- **Runner**: Vitest v2.0+
- **DOM Environment**: JSDOM
- **Assertion Library**: `@testing-library/jest-dom`
