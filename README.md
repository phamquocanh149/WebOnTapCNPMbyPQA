# Website Ôn tập Nhập môn Công nghệ phần mềm (IT3180 – HUST) — Stage 1

Hệ thống website hỗ trợ sinh viên Đại học Bách khoa Hà Nội ôn tập và luyện thi trắc nghiệm môn **Nhập môn Công nghệ phần mềm (IT3180)**, kì học 20242.

Toàn bộ ngân hàng câu hỏi, các lựa chọn và đáp án chính thức được **trích xuất 100% nguyên văn từ tài liệu LMS gốc** (`Data/LMS_quiz/Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf`). Tuyệt đối không tự tạo, phỏng đoán hoặc bổ sung nội dung ngoài tài liệu nguồn.

---

## 1. Tính năng đã hoàn thiện trong Stage 1

### 1.1. Phân hệ Ôn tập Quiz LMS (Hoạt động đầy đủ)
- **Quy mô ngân hàng đề:** 69 bài quiz với tổng cộng 485 câu hỏi, bao phủ toàn bộ 275 trang tài liệu LMS kì 20242:
  - Các bài quiz bài học (Chương 1 đến Chương 9).
  - Các bài quiz kết thúc chương (Chương 1 đến Chương 9).
  - Các bài quiz kiểm tra kết quả bài tập lớn (Pr01 đến Pr12).
- **Hỗ trợ đầy đủ các dạng câu hỏi:**
  - `single_choice`: Chọn 1 phương án đúng.
  - `multiple_choice`: Chọn một hoặc nhiều phương án đúng (`Select one or more`). Chấm điểm nghiêm ngặt theo tập hợp phương án đúng.
  - `true_false`: Đúng / Sai.
  - Câu hỏi có **ảnh sơ đồ đề bài** (UML Use Case, Class Diagram, Activity Diagram, Control Flow Graph, v.v.).
  - Câu hỏi có **phương án lựa chọn là hình ảnh** (được crop chuẩn xác, không chứa dấu tick/cross lộ đáp án).
- **Trải nghiệm làm bài & chấm điểm:**
  - Chấm điểm tự động và đối chiếu chi tiết với đáp án chính thức của hệ thống LMS.
  - Không công bố đáp án trước khi người dùng nhấn nộp bài.
  - Tùy chọn xáo trộn thứ tự câu hỏi (mặc định TẮT để bảo toàn thứ tự gốc của đề thi).
  - Hỗ trợ phím tắt (`A`-`D` hoặc `1`-`5` để chọn phương án; `←`/`→` để chuyển câu).
  - Tự động lưu tiến độ làm bài vào `localStorage` giúp không bị mất bài khi tải lại trang.
  - Truy vết nguồn gốc (Provenance): Hiển thị tên file và số trang PDF chính xác cho từng câu hỏi.
- **Xử lý trung thực câu hỏi chưa xác minh (`needs_review`):**
  - 2 câu hỏi (`quiz_0803_q4` và `quiz_ket_thuc_chuong_8_q8`) do tài liệu LMS của sinh viên làm sai và hệ thống LMS ẩn dòng đáp án đúng: Hệ thống đánh dấu minh bạch trạng thái `needs_review`, thông báo rõ lý do và **loại trừ hoàn toàn khỏi điểm số chấm bài** để đảm bảo nguyên tắc Zero Hallucination.

### 1.2. Phân hệ Ôn tập kiểm tra cuối kỳ (Placeholder Stage 1)
- Có trang điều hướng riêng (`/cuoi-ki`) với thông báo trạng thái "Chức năng đang phát triển — Stage 2".
- Tuân thủ nguyên tắc không tạo câu hỏi, đề thi hoặc đáp án giả mạo khi chưa có tài liệu đề thi chính thức được bàn giao.

---

## 2. Cấu trúc thư mục

```
webOnTap/
├── Data/
│   └── LMS_quiz/
│       └── Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf   # File PDF nguồn 275 trang
├── public/
│   ├── favicon.svg                                    # Icon website
│   └── images/
│       └── quiz/                                      # 57 ảnh sơ đồ và ảnh lựa chọn trích xuất từ PDF
├── reports/
│   └── extraction-report.md                           # Báo cáo trích xuất & kiểm định chi tiết
├── scripts/
│   └── extract_quiz.py                                # Pipeline trích xuất tự động bằng Python
├── src/
│   ├── components/                                    # Navbar, Footer
│   ├── data/
│   │   └── quiz_data.json                             # Dữ liệu 69 quiz & 485 câu hỏi dạng JSON
│   ├── pages/
│   │   ├── HomePage.tsx                               # Trang chủ với 2 phân hệ điều hướng
│   │   ├── QuizListPage.tsx                           # Kho danh sách quiz phân theo chương & tìm kiếm
│   │   ├── QuizPlayPage.tsx                           # Giao diện làm bài thi, nộp bài & xem đáp án
│   │   └── FinalExamPage.tsx                          # Trang placeholder ôn tập cuối kỳ
│   ├── services/
│   │   └── quizService.ts                             # Logic nghiệp vụ, tổ chức chương, chấm điểm
│   ├── types/
│   │   └── quiz.ts                                    # TypeScript schema cho Quiz & Question
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tests/
│   ├── data_integrity.test.ts                         # Test tính toàn vẹn schema, logic chấm điểm
│   └── samples_and_assets.test.ts                     # Test đối chiếu mẫu đầu/giữa/cuối & kiểm tra ảnh
├── agent.md                                           # Nhật ký quản trị tiến độ của coding agent
├── PROMPT_AGENT_STAGE1.md                             # Yêu cầu kỹ thuật Stage 1
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 3. Yêu cầu môi trường

- **Node.js**: >= 18.0.0 (khuyến nghị Node 20 LTS trở lên)
- **npm**: >= 9.0.0
- **Python** (chỉ cần khi muốn chạy lại bộ trích xuất PDF): >= 3.10 với các thư viện:
  ```bash
  pip install pymupdf pillow
  ```

---

## 4. Hướng dẫn cài đặt và vận hành

### 4.1. Cài đặt dependencies
```bash
npm install
```

### 4.2. Khởi chạy môi trường phát triển (Dev server)
```bash
npm run dev
```
Truy cập ứng dụng tại: `http://localhost:3000` (hoặc cổng hiển thị trên terminal).

### 4.3. Chạy bộ kiểm thử tự động (Test suite)
```bash
npm test
```
Bộ test Vitest sẽ tự động kiểm tra 21 test case gồm:
- Toàn vẹn metadata và mã hash SHA-256 của file PDF.
- Kiểm tra tính duy nhất của 69 quiz ID và 485 câu hỏi ID.
- Mọi câu hỏi đã xác minh đều có đáp án hợp lệ nằm trong danh sách lựa chọn.
- Kiểm tra logic chấm điểm: single choice, multiple choice, true/false.
- Đảm bảo các câu `needs_review` không bao giờ bị tính điểm.
- Đối chiếu các câu hỏi mẫu đầu, giữa, cuối PDF với bản gốc.
- Kiểm tra sự tồn tại vật lý của toàn bộ 57 file ảnh được tham chiếu.

### 4.4. Build ứng dụng sản phẩm
```bash
npm run build
```
Lệnh thực hiện kiểm tra TypeScript (`tsc -b`) và biên dịch bundle tối ưu qua Vite vào thư mục `dist/`.

### 4.5. Xem trước bản build production
```bash
npm run preview
```

---

## 5. Hướng dẫn chạy lại bộ trích xuất từ PDF (Data Pipeline)

Nếu cần cập nhật hoặc trích xuất lại từ file PDF gốc:

```bash
npm run extract
# hoặc chạy trực tiếp bằng python:
python scripts/extract_quiz.py
```

Pipeline sẽ thực hiện:
1. Đọc và xác minh mã SHA-256 của file `Data/LMS_quiz/Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf`.
2. Duyệt qua 275 trang, phân định ranh giới từng quiz và từng câu hỏi.
3. Trích xuất text đề bài, các phương án, và đáp án từ dòng `The correct answer is:` / `The correct answers are:`.
4. Với các trang chứa ảnh lựa chọn (như biểu đồ Use Case trong Quiz 0605, 0608, KT Chương 6, KT Chương 7): Trích xuất ảnh lựa chọn và đối chiếu image xref với ảnh của đáp án chính thức.
5. Với các trang PDF dạng raster scan (Quiz 0901 đến Quiz 0906, trang 204 đến 225): Tự động render trang, crop các vùng ảnh sơ đồ (control flow graph, bảng quyết định), phân tích câu hỏi và đối chiếu đáp án với `verificationStatus = verified_visual`.
6. Xuất dữ liệu vào `src/data/quiz_data.json`, ảnh vào `public/images/quiz/`, và tạo báo cáo nghiệm thu tại `reports/extraction-report.md`.

---

## 6. Báo cáo kiểm định và chỉ số trích xuất

| Chỉ số | Giá trị thực tế đã kiểm chứng |
|---|---|
| Tập tin PDF nguồn | `Data/LMS_quiz/Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf` |
| Mã SHA-256 | `61b8410e69e2fe12ab6047c6630829385b5eb33c43a95b9ea56e53e5027b6c48` |
| Tổng số trang PDF | 275 trang |
| Tổng số bài Quiz | 69 bài quiz |
| Tổng số câu hỏi xuất hiện | 485 câu hỏi |
| Câu xác minh bằng văn bản (`verified_text`) | 446 câu (92.0%) |
| Câu xác minh trực quan (`verified_visual`) | 37 câu (7.6%) |
| Câu cần rà soát (`needs_review`) | 2 câu (0.4%) |
| Số câu đưa vào chấm điểm | 483 câu (99.6%) |
| Tổng số tài nguyên ảnh trích xuất | 57 file ảnh PNG |

---

## 7. Tiêu chuẩn tuân thủ và chính sách dữ liệu
- Không chứa bất kỳ thông tin cá nhân, cookie, token hoặc mã định danh của sinh viên làm bài thi trong PDF gốc.
- Dữ liệu hoàn toàn tĩnh, ứng dụng có thể chạy offline độc lập mà không phụ thuộc vào internet hoặc máy chủ ngoại vi.
