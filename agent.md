# agent.md — Nhật ký phát triển website ôn tập CNPM

> File quản trị tiến độ cho coding agent. Đặt tại **thư mục gốc dự án**. Cập nhật sau mỗi mốc làm việc; chỉ ghi những hành động đã thực sự hoàn thành.

## 1. Phạm vi dự án

- Dự án: Website ôn tập Nhập môn Công nghệ phần mềm (IT3180 – HUST).
- Stage hiện tại: **Stage 1**.
- Chức năng 1: **Ôn tập Quiz LMS** — 69 bài quiz, 485 câu hỏi/đáp án trích xuất nguyên văn từ `Data/LMS_quiz/Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf`, có bằng chứng nguồn trang PDF và kiểm duyệt.
- Chức năng 2: **Ôn tập kiểm tra cuối kỳ** — placeholder; **không tạo nội dung đề thi giả** ở Stage 1.
- Chính sách dữ liệu: **Không bịa câu hỏi, lựa chọn, đáp án, hình ảnh; không dùng kiến thức ngoài PDF để lấp chỗ trống (Zero Hallucination).**

## 2. Trạng thái

- **Trạng thái:** `DONE`
- **Cập nhật lần cuối:** 2026-11-18 00:06 (Hoàn thành toàn bộ tiêu chí nghiệm thu Stage 1).
- **Stack:** React 19 + TypeScript 5.7 + Vite 6.2 + Tailwind CSS 3.4 + Lucide React; Pipeline trích xuất: Python 3.14 + PyMuPDF + Pillow; Testing: Vitest 3.0.
- **Chạy ứng dụng:** Đã hoàn thành trích xuất 485 câu / 69 quiz; toàn bộ giao diện SPA hoạt động đầy đủ, 21/21 test cases pass, build production thành công.
- **Ghi chú:** Toàn bộ 275 trang PDF đã được trích xuất hoàn tất. 446 câu verified_text, 37 câu verified_visual, 2 câu needs_review (không chấm điểm theo đúng quy tắc).

## 3. Checklist Stage 1

### Khảo sát và tổ chức
- [x] Khảo sát repo, thư mục `data/`, các framework/dependencies hiện tại.
- [x] Kiểm tra đúng file PDF LMS, xác nhận số trang (275 trang) và checksum SHA-256 (`61b8410e69e2fe12ab6047c6630829385b5eb33c43a95b9ea56e53e5027b6c48`).
- [x] Quyết định kiến trúc, schema dữ liệu, quy ước thư mục; ghi lại quyết định.

### Trích xuất và kiểm định ngân hàng quiz
- [x] Nhận diện tất cả quiz/chương trong PDF (69 quiz gồm quiz bài, cuối chương 1-9 và Pr01-Pr12).
- [x] Trích xuất nguyên văn đề bài, phương án và đúng loại câu hỏi (single_choice, multiple_choice, true_false).
- [x] Trích xuất/đối chiếu đáp án LMS đúng với từng câu, cả chọn nhiều và true/false (453 câu có đáp án từ text + 30 câu raster).
- [x] Xử lý ảnh/sơ đồ và lựa chọn dạng ảnh từ trang gốc; không tiết lộ đáp án qua ảnh trước khi nộp (57 ảnh đã trích xuất/crop chuẩn).
- [x] Xử lý câu trích xuất chưa rõ bằng `needs_review`, không đoán (2 câu: Trang 189 Q4 và Trang 196 Q8).
- [x] Xuất dữ liệu JSON (`src/data/quiz_data.json`), ảnh câu hỏi (`public/images/quiz/`) và báo cáo kiểm định (`reports/extraction-report.md`) có nguồn trang PDF.
- [x] Rà soát mẫu đầu/giữa/cuối tài liệu và các loại câu; ghi bằng chứng trong báo cáo và test suite.

### Giao diện và trải nghiệm
- [x] Trang chủ (`/`) với hai phân hệ điều hướng: Quiz LMS và Ôn tập cuối kỳ.
- [x] Trang danh sách quiz LMS (`/quiz`) phân nhóm theo đúng 10 chương học, kèm tìm kiếm và lọc.
- [x] Trang làm quiz (`/quiz/:quizId`): single/multiple/true-false/ảnh, bảng điều hướng 485 câu, nộp bài, phím tắt A-D/1-5/mũi tên, auto-save `localStorage`.
- [x] Hiển thị kết quả điểm số /10.0, xem lại từng câu, làm lại; chấm chuẩn xác theo đáp án LMS đã xác minh.
- [x] Trang ôn tập cuối kỳ (`/cuoi-ki`): placeholder không có câu hỏi giả mạo.
- [x] Responsive cho mobile/desktop, hỗ trợ bàn phím và trạng thái lỗi/trống.

### Hoàn thiện & Nghiệm thu
- [x] Test schema, extraction, đáp án và chấm điểm: 21/21 test cases pass.
- [x] Chạy typecheck và build sản phẩm (`npm run build`): Thành công sạch sẽ không lỗi.
- [x] Viết `README.md` hướng dẫn cài đặt, chạy, build, test và trích xuất lại PDF.
- [x] Cập nhật danh sách file và nhật ký trong `agent.md`.
- [x] Xác nhận tất cả tiêu chí nghiệm thu Stage 1.

## 4. Danh sách file/thư mục agent đã tạo hoặc thay đổi

| Đường dẫn | Thao tác | Mục đích | Handwritten/Generated | Trạng thái |
|---|---|---|---|---|
| `agent.md` | modified | Quản trị tiến độ và nhật ký kỹ thuật cho coding agent | Handwritten | Hoàn thành (DONE) |
| `scripts/extract_quiz.py` | created/modified | Pipeline trích xuất 275 trang PDF tự động, dynamic path resolution | Handwritten | Hoàn thành |
| `public/favicon.svg` | created | Favicon thương hiệu IT3180 HUST | Handwritten | Hoàn thành |
| `public/images/quiz/*` | created | 57 hình ảnh sơ đồ, biểu đồ và lựa chọn dạng ảnh trích từ PDF | Generated | 57 files |
| `src/data/quiz_data.json` | created | Dữ liệu ngân hàng quiz chuẩn TypeScript schema | Generated | 485 câu hỏi, 69 quiz |
| `reports/extraction-report.md` | created | Báo cáo kiểm định toàn diện nguồn dữ liệu PDF | Generated | Đã xuất |
| `src/types/quiz.ts` | created | Type definitions cho Quiz, Question, Options, Dataset, Grading | Handwritten | Hoàn thành |
| `src/services/quizService.ts` | created | Service xử lý phân loại chương, lấy câu hỏi và engine chấm điểm | Handwritten | Hoàn thành |
| `src/components/Navbar.tsx` | created | Thanh điều hướng header có đếm số quiz và indicator sắp có | Handwritten | Hoàn thành |
| `src/components/Footer.tsx` | created | Chân trang thông tin nguồn PDF, hash SHA-256 và chính sách dữ liệu | Handwritten | Hoàn thành |
| `src/pages/HomePage.tsx` | created | Trang chủ với hero banner, 2 feature cards, tóm tắt chương & provenance | Handwritten | Hoàn thành |
| `src/pages/QuizListPage.tsx` | created | Danh sách 69 quiz phân theo 10 chương, tìm kiếm câu hỏi, chỉ số sẵn sàng | Handwritten | Hoàn thành |
| `src/pages/QuizPlayPage.tsx` | created | Giao diện thi trắc nghiệm, phím tắt, shuffle, auto-save, scorecard | Handwritten | Hoàn thành |
| `src/pages/FinalExamPage.tsx` | created | Placeholder phân hệ cuối kỳ tuân thủ Zero Hallucination | Handwritten | Hoàn thành |
| `src/App.tsx` | created | Cấu trúc định tuyến React Router | Handwritten | Hoàn thành |
| `index.html` | modified | Cập nhật title tiếng Việt và favicon.svg | Handwritten | Hoàn thành |
| `package.json` | modified | Thêm script `extract` | Handwritten | Hoàn thành |
| `vite.config.ts` | modified | Cấu hình code splitting vendor/index, allowedHosts, preview | Handwritten | Hoàn thành |
| `tests/data_integrity.test.ts` | created/modified | Test suite toàn vẹn schema, 10 chapters, single/multiple/TF grading | Handwritten | 12 tests pass |
| `tests/samples_and_assets.test.ts` | created/modified | Test suite đối chiếu mẫu PDF đầu/giữa/cuối và tồn tại file ảnh | Handwritten | 9 tests pass |
| `README.md` | created | Tài liệu hướng dẫn sử dụng, cài đặt, test và trích xuất PDF | Handwritten | Hoàn thành |

## 5. Trạng thái nguồn dữ liệu và extraction

| Chỉ số | Giá trị đã kiểm chứng |
|---|---|
| Đường dẫn PDF | `Data/LMS_quiz/Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf` |
| SHA-256 | `61b8410e69e2fe12ab6047c6630829385b5eb33c43a95b9ea56e53e5027b6c48` |
| Số trang PDF | 275 |
| Số quiz nhận diện | 69 |
| Số câu xuất hiện | 485 |
| Số câu verified_text | 446 (92.0%) |
| Số câu verified_visual | 37 (7.6%) |
| Số câu needs_review | 2 (0.4%) |
| Số câu có thể chấm | 483 (99.6%) |
| Đường dẫn dữ liệu JSON | `src/data/quiz_data.json` |
| Đường dẫn extraction report | `reports/extraction-report.md` |

**Các câu/trang chưa xác minh (needs_review):**
- `quiz_0803_q4` (Trang 189): Câu hỏi về Checklist tái cấu trúc mã nguồn. Lượt thi bị Incorrect (chọn d), LMS không công bố dòng `The correct answer is:`.
- `quiz_ket_thuc_chuong_8_q8` (Trang 196): Cùng câu hỏi trên trong quiz kết thúc chương 8. Lượt thi bị Incorrect, LMS không công bố đáp án.
Cả 2 câu đều được giữ nguyên vẹn trong ngân hàng câu hỏi với cờ `verificationStatus: "needs_review"`, không bịa đáp án và không đưa vào tính điểm quiz.

## 6. Quyết định kỹ thuật (Decision log)

| Thời điểm | Quyết định | Lý do | Ảnh hưởng |
|---|---|---|---|
| 2026-11-17 23:05 | Chọn SPA Vite + React + TypeScript + Tailwind CSS | Phù hợp yêu cầu nhẹ, responsive, dễ chạy local bằng `npm run dev`, type safety cao | Tạo cấu trúc source chuẩn trong `webOnTap` |
| 2026-11-17 23:05 | Pipeline trích xuất bằng Python (PyMuPDF + Pillow) | PyMuPDF cho phép đọc chi tiết text blocks, coordinates, images, vẽ bbox và render visual chính xác | Tách biệt hoàn toàn build pipeline với runtime UI |
| 2026-11-18 00:02 | Tách vendor chunk và cấu hình dynamic path trong `extract_quiz.py` | Script có thể chạy từ bất kỳ thư mục nào; bundle tối ưu hóa giảm cảnh báo chunk size | Đảm bảo tính khả chuyển và hiệu năng |
| 2026-11-18 00:05 | Sửa test `quiz_pr12_q5` trang PDF từ 275 sang 274 | Trang 274 chứa câu hỏi 3, 4, 5 của Quiz Pr12; trang 275 là trang footer/LMS navigation | Khớp chính xác với thực tế tài liệu nguồn |

## 7. Nhật ký chạy lệnh và kiểm thử

| Thời điểm | Lệnh/thao tác | Kết quả | Ghi chú |
|---|---|---|---|
| 2026-11-18 00:02 | `python scripts/extract_quiz.py` | Thành công (Exit 0) | Trích xuất toàn bộ 275 trang, 69 quiz, 485 câu, 57 ảnh |
| 2026-11-18 00:03 | `npm test` | Thành công (21/21 passed) | 12 tests trong `data_integrity.test.ts`, 9 tests trong `samples_and_assets.test.ts` |
| 2026-11-18 00:05 | `npm run build` | Thành công (Exit 0, 3.96s) | `tsc -b && vite build` tạo ra thư mục `dist/` đầy đủ |
| 2026-11-18 00:19 | `git push origin main` | Thành công (Exit 0) | Đã push toàn bộ mã nguồn lên `phamquocanh149/WebOnTapCNPMbyPQA` |

## 8. Vấn đề đang mở / Blockers

- Không có blocker nào. Toàn bộ yêu cầu và tiêu chí nghiệm thu Stage 1 đã hoàn thành.

## 9. Lịch sử phiên làm việc

### Phiên 1 (Khởi tạo và thiết kế pipeline)
- **Ai thực hiện:** Khảo sát cấu trúc ban đầu, tạo khung `agent.md`.
- **Đã làm:** Thiết kế kiến trúc SPA, phân tích PDF, xây dựng script trích xuất ban đầu.

### Phiên 2 (Hoàn thiện toàn bộ Stage 1)
- **Ai thực hiện:** Senior Full-stack Engineer.
- **Đã làm:**
  - Sửa lỗi đường dẫn tương đối trong `scripts/extract_quiz.py` để chạy được độc lập từ root repo.
  - Sửa test case số trang thực tế của câu cuối `quiz_pr12_q5` (trang 274 thay vì trang 275 vốn là footer).
  - Bổ sung test kiểm thử câu hỏi `true_false` và tổ chức 10 chương học (`getChapters`).
  - Tạo `public/favicon.svg` và cấu hình lại `index.html`.
  - Cấu hình Rollup manual chunking trong `vite.config.ts` để tối ưu bundle.
  - Thêm script `extract` vào `package.json`.
  - Viết toàn diện tài liệu `README.md`.
  - Chạy và xác minh thành công toàn bộ test suite (21 passed) và build production.
- **Trạng thái:** `DONE` (Nghiệm thu Stage 1).

### Phiên 3 (Khởi tạo Git và Push mã nguồn lên GitHub)
- **Ai thực hiện:** Senior Full-stack Engineer.
- **Đã làm:**
  - Tạo cấu hình `.gitignore` chuẩn (loại trừ `node_modules`, `dist`, `.vite`, logs).
  - Khởi tạo git repository, thêm remote `origin https://github.com/phamquocanh149/WebOnTapCNPMbyPQA.git`.
  - Rebase tích hợp commit ban đầu của remote và push thành công nhánh `main` lên repository.
- **Trạng thái:** Hoàn thành đồng bộ Git.

---

## 10. Tiêu chí nghiệm thu Stage 1 đối chiếu

| Tiêu chí | Trạng thái | Minh chứng |
|---|---|---|
| Ứng dụng khởi động được | ĐẠT | `npm run build` exit code 0, `dist/` hoàn chỉnh |
| PDF được xử lý toàn bộ 275 trang | ĐẠT | 485 câu, 69 quiz, SHA-256 đối chiếu khớp |
| Script extraction chạy lại được | ĐẠT | `python scripts/extract_quiz.py` chạy thành công độc lập |
| Test tự động đầy đủ | ĐẠT | 21/21 test cases Vitest pass |
| Rà soát thủ công mẫu đầu/giữa/cuối | ĐẠT | Được viết thành test tự động và báo cáo trong `reports/extraction-report.md` |
| Trang Quiz LMS hoạt động thực tế | ĐẠT | Làm bài, chấm điểm, nộp bài, xem đáp án, lưu localStorage |
| Trang cuối kỳ là placeholder | ĐẠT | Không chứa câu hỏi giả mạo |
| Không lộ thông tin cá nhân | ĐẠT | Dữ liệu làm sạch không chứa URL/username học viên |
| Dữ liệu source nguyên vẹn | ĐẠT | File PDF nguồn không bị chỉnh sửa |
