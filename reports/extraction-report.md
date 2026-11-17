# Báo cáo trích xuất dữ liệu Quiz LMS — Stage 1

- **Nguồn tài liệu:** `Data/LMS_quiz/Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf`
- **SHA-256:** `61b8410e69e2fe12ab6047c6630829385b5eb33c43a95b9ea56e53e5027b6c48`
- **Số trang PDF thực tế:** 275 trang
- **Thời gian trích xuất:** 2026-11-17T23:28:00+07:00

---

## 1. Thống kê tổng quan

| Chỉ số | Số lượng | Tỷ lệ | Ghi chú |
|---|---|---|---|
| **Tổng số Quiz nhận diện** | **69** | 100% | Gồm quiz bài học, quiz kết thúc chương 1-9 và quiz Pr01-Pr12 |
| **Tổng số câu hỏi xuất hiện** | **485** | 100% | 455 câu từ 253 trang text + 30 câu từ 22 trang raster |
| **Xác minh bằng văn bản (`verified_text`)** | **446** | 92.0% | Khớp đối chiếu trực tiếp dòng 'The correct answer is' |
| **Xác minh trực quan (`verified_visual`)** | **37** | 7.6% | 7 câu đáp án dạng ảnh qua image xref + 30 câu raster Quiz 0901-0906 |
| **Cần rà soát (`needs_review`)** | **2** | 0.4% | 2 câu do PDF gốc không có đáp án LMS (lượt thi Incorrect) |
| **Số câu có thể chấm điểm** | **483** | 99.6% | Chỉ chấm các câu đã xác minh 100% đáp án |

---

## 2. Danh sách các câu `needs_review` (Không đưa vào chấm điểm)

Theo đúng quy tắc **Section 2 & Section 4**: Không tự ý đoán hoặc bịa đáp án cho câu không có đáp án rõ ràng trong PDF.

1. **`quiz_0803_q4` (Trang 189)**:
   - Đề bài: *Check-list của tái cấu trúc mã nguồn KHÔNG bao gồm yêu cầu nào?*
   - Lý do: Trang 189 lượt làm bài của sinh viên bị Incorrect (chọn d ), LMS không hiển thị dòng `The correct answer is:`.
   - Xử lý: Gắn `needs_review`, `correctOptionIds = []`, hiển thị thông báo trong quiz và không tính điểm.
2. **`quiz_ket_thuc_chuong_8_q8` (Trang 196)**:
   - Đề bài: *Check-list của tái cấu trúc mã nguồn KHÔNG bao gồm yêu cầu nào?*
   - Lý do: Trang 196 lượt làm bài bị Incorrect (chọn d ), LMS không hiển thị dòng `The correct answer is:`.
   - Xử lý: Gắn `needs_review`, `correctOptionIds = []`, hiển thị thông báo trong quiz và không tính điểm.

---

## 3. Các câu hỏi có ảnh lựa chọn và sơ đồ (`verified_visual`)

### Các câu có phương án lựa chọn dạng ảnh (Trích xuất và khớp xref):
- **Trang 115 (Quiz 0605 - Câu 4)**: Use case diagram. Khớp image xref 13702 giữa option a và đáp án chính thức LMS -> `opt_a`.
- **Trang 125 (Quiz 0608 - Câu 3)**: Use case diagram. Khớp image xref 14874 giữa option c và đáp án chính thức LMS -> `opt_c`.
- **Trang 126 (Quiz 0608 - Câu 4)**: Use case diagram. Khớp image xref 14913 giữa option a và đáp án chính thức LMS -> `opt_a`.
- **Trang 135 (Quiz Kết thúc chương 6 - Câu 10)**: Use case diagram. Khớp image xref 14874 -> `opt_c`.
- **Trang 136 (Quiz Kết thúc chương 6 - Câu 11)**: Use case diagram. Khớp image xref 16002 -> `opt_d`.
- **Trang 138 (Quiz Kết thúc chương 6 - Câu 14)**: Use case diagram. Khớp image xref 13702 -> `opt_a`.
- **Trang 174 (Quiz Kết thúc chương 7 - Câu 7)**: Class diagram. Khớp image xref 20018 -> `opt_a`.

### Các câu có sơ đồ đề bài (Prompt images):
- Trang 56, 57: Mô hình chế thử phần mềm (`quiz_ket_thuc_chuong_3_q15`).
- Trang 107-130: Các biểu đồ ca sử dụng, phân cấp use case, biểu đồ tuần tự.
- Trang 151-180: Biểu đồ lớp UML, sơ đồ kiến trúc module.
- Trang 211, 213, 214: Đồ thị luồng điều khiển kiểm thử (`quiz_0904`).
- Trang 212, 215: Đoạn mã nguồn C++ kiểm thử (`quiz_0904`).
- Trang 221, 223: Đồ thị miền tương đương điểm toán/vật lý (`quiz_0906`).

---

## 4. Thống kê theo từng Quiz

| STT | Mã Quiz | Tên Quiz | Chương | Số câu | Đã xác minh | Cần rà soát | Trang nguồn |
|---|---|---|---|---|---|---|---|
| 1 | `quiz_0102` | Quiz 0102 | Chương 1. Tổng quan về Công nghệ phần mềm | 5 | 5 | 0 | Trang 1-3 |
| 2 | `quiz_0103` | Quiz 0103 | Chương 1. Tổng quan về Công nghệ phần mềm | 5 | 5 | 0 | Trang 4-6 |
| 3 | `quiz_0104` | Quiz 0104 | Chương 1. Tổng quan về Công nghệ phần mềm | 5 | 5 | 0 | Trang 7-9 |
| 4 | `quiz_ket_thuc_chuong_1` | Quiz Kết thúc chương 1 | Chương 1. Tổng quan về Công nghệ phần mềm | 20 | 20 | 0 | Trang 10-17 |
| 5 | `quiz_0201` | Quiz 0201 | Chương 2. Vòng đời phần mềm | 5 | 5 | 0 | Trang 18-20 |
| 6 | `quiz_0202` | Quiz 0202 | Chương 2. Vòng đời phần mềm | 5 | 5 | 0 | Trang 21-23 |
| 7 | `quiz_0203` | Quiz 0203 | Chương 2. Vòng đời phần mềm | 5 | 5 | 0 | Trang 24-26 |
| 8 | `quiz_0204` | Quiz 0204 | Chương 2. Vòng đời phần mềm | 5 | 5 | 0 | Trang 27-29 |
| 9 | `quiz_ket_thuc_chuong_2` | Quiz Kết thúc chương 2 | Chương 2. Vòng đời phần mềm | 20 | 20 | 0 | Trang 30-37 |
| 10 | `quiz_0301` | Quiz 0301 | Chương 3. Phương pháp Agile | 5 | 5 | 0 | Trang 38-40 |
| 11 | `quiz_0302` | Quiz 0302 | Chương 3. Phương pháp Agile | 5 | 5 | 0 | Trang 41-43 |
| 12 | `quiz_0303` | Quiz 0303 | Chương 3. Phương pháp Agile | 5 | 5 | 0 | Trang 44-46 |
| 13 | `quiz_0304` | Quiz 0304 | Chương 3. Phương pháp Agile | 5 | 5 | 0 | Trang 47-49 |
| 14 | `quiz_ket_thuc_chuong_3` | Quiz Kết thúc chương 3 | Chương 3. Phương pháp Agile | 20 | 20 | 0 | Trang 50-59 |
| 15 | `quiz_0401` | Quiz 0401 | Chương 4. Quản lý dự án phần mềm | 5 | 5 | 0 | Trang 60-62 |
| 16 | `quiz_0402` | Quiz 0402 | Chương 4. Quản lý dự án phần mềm | 5 | 5 | 0 | Trang 63-65 |
| 17 | `quiz_0403` | Quiz 0403 | Chương 4. Quản lý dự án phần mềm (tiếp theo) | 5 | 5 | 0 | Trang 66-68 |
| 18 | `quiz_0404` | Quiz 0404 | Chương 4. Quản lý dự án phần mềm (tiếp theo) | 5 | 5 | 0 | Trang 69-71 |
| 19 | `quiz_ket_thuc_chuong_4` | Quiz Kết thúc chương 4 | Chương 4. Quản lý dự án phần mềm (tiếp theo) | 20 | 20 | 0 | Trang 72-79 |
| 20 | `quiz_0501` | Quiz 0501 | Chương 5. Quản lý cấu hình phần mềm | 5 | 5 | 0 | Trang 80-82 |
| 21 | `quiz_0502` | Quiz 0502 | Chương 5. Quản lý cấu hình phần mềm | 5 | 5 | 0 | Trang 83-85 |
| 22 | `quiz_0503` | Quiz 0503 | Chương 5. Quản lý cấu hình phần mềm | 5 | 5 | 0 | Trang 86-88 |
| 23 | `quiz_0504` | Quiz 0504 | Chương 5. Quản lý cấu hình phần mềm | 5 | 5 | 0 | Trang 89-91 |
| 24 | `quiz_ket_thuc_chuong_5` | Quiz Kết thúc chương 5 | Chương 5. Quản lý cấu hình phần mềm | 20 | 20 | 0 | Trang 92-100 |
| 25 | `quiz_0601` | Quiz 0601 | Chương 6. Kỹ nghệ yêu cầu phần mềm | 5 | 5 | 0 | Trang 101-103 |
| 26 | `quiz_0602` | Quiz 0602 | Chương 6. Kỹ nghệ yêu cầu phần mềm | 5 | 5 | 0 | Trang 104-106 |
| 27 | `quiz_0603` | Quiz 0603 | Chương 6. Kỹ nghệ yêu cầu phần mềm (tiếp theo) | 5 | 5 | 0 | Trang 107-109 |
| 28 | `quiz_0604` | Quiz 0604 | Chương 6. Kỹ nghệ yêu cầu phần mềm (tiếp theo) | 5 | 5 | 0 | Trang 110-112 |
| 29 | `quiz_0605` | Quiz 0605 | Chương 6. Kỹ nghệ yêu cầu phần mềm (tiếp theo) | 5 | 5 | 0 | Trang 113-116 |
| 30 | `quiz_0606` | Quiz 0606 | Chương 6. Kỹ nghệ yêu cầu phần mềm (tiếp theo) | 5 | 5 | 0 | Trang 117-119 |
| 31 | `quiz_0607` | Quiz 0607 | Chương 6. Kỹ nghệ yêu cầu phần mềm (tiếp theo) | 5 | 5 | 0 | Trang 120-122 |
| 32 | `quiz_0608` | Quiz 0608 | Chương 6. Kỹ nghệ yêu cầu phần mềm (tiếp theo) | 5 | 5 | 0 | Trang 123-127 |
| 33 | `quiz_0609` | Quiz 0609 | Chương 6. Kỹ nghệ yêu cầu phần mềm (tiếp theo) | 5 | 5 | 0 | Trang 128-130 |
| 34 | `quiz_ket_thuc_chuong_6` | Quiz Kết thúc chương 6 | Chương 6. Kỹ nghệ yêu cầu phần mềm (tiếp theo) | 20 | 20 | 0 | Trang 131-143 |
| 35 | `quiz_0701` | Quiz 0701 | Chương 7. Thiết kế phần mềm | 5 | 5 | 0 | Trang 144-146 |
| 36 | `quiz_0702` | Quiz 0702 | Chương 7. Thiết kế phần mềm | 5 | 5 | 0 | Trang 147-149 |
| 37 | `quiz_0703` | Quiz 0703 | Chương 7. Thiết kế phần mềm (tiếp theo) | 5 | 5 | 0 | Trang 150-152 |
| 38 | `quiz_0704` | Quiz 0704 | Chương 7. Thiết kế phần mềm (tiếp theo) | 5 | 5 | 0 | Trang 153-155 |
| 39 | `quiz_0705` | Quiz 0705 | Chương 7. Thiết kế phần mềm (tiếp theo) | 5 | 5 | 0 | Trang 156-158 |
| 40 | `quiz_0706` | Quiz 0706 | Chương 7. Thiết kế phần mềm (tiếp theo) | 5 | 5 | 0 | Trang 159-161 |
| 41 | `quiz_0707` | Quiz 0707 | Chương 7. Thiết kế phần mềm (tiếp theo) | 5 | 5 | 0 | Trang 162-165 |
| 42 | `quiz_0708` | Quiz 0708 | Chương 7. Thiết kế phần mềm (tiếp theo) | 5 | 5 | 0 | Trang 166-169 |
| 43 | `quiz_ket_thuc_chuong_7` | Quiz Kết thúc chương 7 | Chương 7. Thiết kế phần mềm (tiếp theo) | 20 | 20 | 0 | Trang 170-181 |
| 44 | `quiz_0801` | Quiz 0801 | Chương 8. Xây dựng phần mềm | 5 | 5 | 0 | Trang 182-184 |
| 45 | `quiz_0802` | Quiz 0802 | Chương 8. Xây dựng phần mềm | 5 | 5 | 0 | Trang 185-187 |
| 46 | `quiz_0803` | Quiz 0803 | Chương 8. Xây dựng phần mềm | 5 | 4 | 1 | Trang 188-190 |
| 47 | `quiz_0804` | Quiz 0804 | Chương 8. Xây dựng phần mềm | 5 | 5 | 0 | Trang 191-193 |
| 48 | `quiz_ket_thuc_chuong_8` | Quiz Kết thúc chương 8 | Chương 8. Xây dựng phần mềm | 20 | 19 | 1 | Trang 194-201 |
| 49 | `quiz_0901` | Quiz 0901 | Chương 9. Đảm bảo chất lượng phần mềm | 5 | 5 | 0 | Trang 202-204 |
| 50 | `quiz_0902` | Quiz 0902 | Chương 9. Đảm bảo chất lượng phần mềm | 5 | 5 | 0 | Trang 205-207 |
| 51 | `quiz_0903` | Quiz 0903 | Chương 9. Đảm bảo chất lượng phần mềm | 5 | 5 | 0 | Trang 208-210 |
| 52 | `quiz_0904` | Quiz 0904 | Chương 9. Đảm bảo chất lượng phần mềm | 5 | 5 | 0 | Trang 211-215 |
| 53 | `quiz_0905` | Quiz 0905 | Chương 9. Đảm bảo chất lượng phần mềm | 5 | 5 | 0 | Trang 216-218 |
| 54 | `quiz_0906` | Quiz 0906 | Chương 9. Đảm bảo chất lượng phần mềm | 5 | 5 | 0 | Trang 219-223 |
| 55 | `quiz_0907` | Quiz 0907 | Chương 9. Đảm bảo chất lượng phần mềm (tiếp theo) | 5 | 5 | 0 | Trang 224-226 |
| 56 | `quiz_0908` | Quiz 0908 | Chương 9. Đảm bảo chất lượng phần mềm (tiếp theo) | 5 | 5 | 0 | Trang 227-229 |
| 57 | `quiz_ket_thuc_chuong_9` | Quiz Kết thúc chương 9 | Chương 9. Đảm bảo chất lượng phần mềm (tiếp theo) | 20 | 20 | 0 | Trang 230-238 |
| 58 | `quiz_pr01` | Quiz Pr01 | Kiểm tra kết quả bài tập lớn | 10 | 10 | 0 | Trang 239-242 |
| 59 | `quiz_pr02` | Quiz Pr02 | Kiểm tra kết quả bài tập lớn | 5 | 5 | 0 | Trang 243-245 |
| 60 | `quiz_pr03` | Quiz Pr03 | Kiểm tra kết quả bài tập lớn | 5 | 5 | 0 | Trang 246-248 |
| 61 | `quiz_pr04` | Quiz Pr04 | Kiểm tra kết quả bài tập lớn | 5 | 5 | 0 | Trang 249-251 |
| 62 | `quiz_pr05` | Quiz Pr05 | Kiểm tra kết quả bài tập lớn | 5 | 5 | 0 | Trang 252-254 |
| 63 | `quiz_pr06` | Quiz Pr06 | Kiểm tra kết quả bài tập lớn | 5 | 5 | 0 | Trang 255-257 |
| 64 | `quiz_pr07` | Quiz Pr07 | Kiểm tra kết quả bài tập lớn (tiếp theo) | 5 | 5 | 0 | Trang 258-260 |
| 65 | `quiz_pr08` | Quiz Pr08 | Kiểm tra kết quả bài tập lớn (tiếp theo) | 5 | 5 | 0 | Trang 261-263 |
| 66 | `quiz_pr09` | Quiz Pr09 | Kiểm tra kết quả bài tập lớn (tiếp theo) | 5 | 5 | 0 | Trang 264-266 |
| 67 | `quiz_pr10` | Quiz Pr10 | Kiểm tra kết quả bài tập lớn (tiếp theo) | 5 | 5 | 0 | Trang 267-269 |
| 68 | `quiz_pr11` | Quiz Pr11 | Kiểm tra kết quả bài tập lớn (tiếp theo) | 5 | 5 | 0 | Trang 270-272 |
| 69 | `quiz_pr12` | Quiz Pr12 | Kiểm tra kết quả bài tập lớn (tiếp theo) | 5 | 5 | 0 | Trang 273-275 |
