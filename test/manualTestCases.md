# KỊCH BẢN THỬ NGHIỆM THỦ CÔNG (MANUAL TEST CASES)
**Dự án:** Quản Lý Lịch Trình Chuyến Đi (Travel Schedule Manager)

---

## TEST CASE 1: ĐĂNG KÝ VÀ TẠO PROFILE BAN ĐẦU
1. Truy cập đường dẫn `/register`.
2. Thử nhập Email sai định dạng (vd: `abc@`) $\rightarrow$ Kiểm tra thông báo lỗi Zod validation bên dưới ô input.
3. Thử nhập Mật khẩu yếu (`123456`) $\rightarrow$ Kiểm tra lỗi yêu cầu chữ hoa, chữ thường và ký tự đặc biệt.
4. Nhập mật khẩu khớp chuẩn `StrongPass123!` nhưng `confirmPassword` gõ khác $\rightarrow$ Báo lỗi mật khẩu không trùng khớp.
5. Nhập chuẩn tất cả dữ liệu $\rightarrow$ Bấm **Đăng Ký Tài Khoản**.
   - *Kỳ vọng:* Toast "Successfully! Tạo tài khoản thành công." xuất hiện, chuyển trang sang `/login`.

---

## TEST CASE 2: ĐĂNG NHẬP & BẢO VỆ ROUTE (PROTECTED ROUTE)
1. Đang ở `/login`, thử tự gõ trên thanh địa chỉ đường dẫn `/schedule` hoặc `/profile`.
   - *Kỳ vọng:* Hệ thống tự động đẩy ngược về lại `/login` (Protected Route hoạt động).
2. Nhập Email & Mật khẩu đã đăng ký ở Test Case 1 $\rightarrow$ Bấm **Đăng Nhập**.
   - *Kỳ vọng:* Đăng nhập thành công, lưu vào `AuthContext`, tự động chuyển hướng vào `/schedule`.

---

## TEST CASE 3: CHỈNH SỬA HỒ SƠ TÀI KHOẢN (PROFILE)
1. Bấm vào Profile Badge trên Navbar để truy cập `/profile`.
2. Kiểm tra các thông tin `UID` và `Email` bị khóa màu xám (disabled), không cho phép chỉnh sửa.
3. Bấm **Chỉnh Sửa Profile**, nhập Tên, Họ, Số điện thoại và Địa chỉ.
4. Bấm **Save Changes**.
   - *Kỳ vọng:* Toast "Profile updated successfully!" xuất hiện. UI cập nhật ngay thông tin vừa lưu.

---

## TEST CASE 4: QUẢN LÝ LỊCH TRÌNH & REALTIME ENGINE (SCHEDULE)
1. Tại trang `/schedule`, bấm **Thêm Sự Kiện Mới**.
2. Nhập Tiêu đề "Ăn sáng Phở Bò", chọn Giờ bắt đầu trùng với giờ hiện tại trên máy tính, Giờ kết thúc sau đó 1 tiếng.
3. Bấm **Tạo Sự Kiện**.
   - *Kỳ vọng:* Event mới xuất hiện, Realtime Engine nhận diện ngay giờ hiện tại và chuyển trạng thái sang **🔥 ĐANG DIỄN RA**, banner nổi bật đầu trang hiển thị thông tin sự kiện này.
4. Thử tạo 1 Event mới khác bị **trùng lặp khung giờ** đè lên Event hiện tại.
   - *Kỳ vọng:* Toast báo lỗi "Khung giờ bị trùng lặp đè lên sự kiện khác!" xuất hiện và chặn không cho thêm.
5. Dùng nút mũi tên `↑` `↓` để thay đổi thứ tự ưu tiên các Event.

---

## TEST CASE 5: GIAO DIỆN SÁNG / TỐI & LOCALSTORAGE PERSISTENCE
1. Bấm vào icon Mặt trời ☀️ / Mặt trăng 🌙 trên Navbar.
   - *Kỳ vọng:* Toàn bộ màu sắc ứng dụng chuyển đổi mượt mà giữa Dark mode và Light mode theo tông màu Phối tương đồng (Analogous Teal / Cyan / Sky).
2. Nhấn nút F5 (Refresh trang).
   - *Kỳ vọng:* Chế độ màu vừa chọn và dữ liệu lịch trình vẫn giữ nguyên không bị mất.
