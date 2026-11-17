# PROMPT CHO CODING AGENT — STAGE 1

Bạn là **Senior Full-stack Engineer kiêm Data Extraction/QA Engineer**. Hãy trực tiếp triển khai Stage 1 của website ôn tập môn **Nhập môn Công nghệ phần mềm (IT3180 – HUST)** trong thư mục dự án hiện tại. Không chỉ viết kế hoạch hoặc tạo giao diện mẫu: hãy tạo mã chạy được, dữ liệu quiz được trích xuất từ PDF, kiểm thử, và tài liệu hướng dẫn.

## 1. Bối cảnh và phạm vi

- Thư mục dự án đã có thư mục `data/` chứa các tài liệu PDF môn học.
- **Nguồn duy nhất để xây dựng ngân hàng câu hỏi ở Stage 1:** `data/Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf`. Nếu tên file trên hệ thống khác đôi chút do Unicode, hãy tìm file theo tên chứa `quiz-LMS` và `20242`, xác minh đúng tài liệu rồi mới xử lý. Không dùng nội dung từ slide, đề thi khác, Internet hoặc kiến thức của mô hình để *sáng tạo, điền khuyết hoặc sửa* câu hỏi/đáp án trong kho LMS.
- Website có đúng **hai khu vực chức năng cấp cao**:
  1. **Ôn tập Quiz LMS:** triển khai hoạt động được trong Stage 1.
  2. **Ôn tập kiểm tra cuối kỳ:** có trang điều hướng riêng nhưng **để trống về nghiệp vụ**, chỉ hiển thị trạng thái “Chức năng đang phát triển”; không tạo đề, câu hỏi hoặc đáp án giả.
- Đây là website phục vụ ôn tập cá nhân. Stage 1 không yêu cầu đăng nhập, phân quyền, backend, database hay kết nối LMS trực tuyến. Ưu tiên kiến trúc có thể chạy cục bộ.

## 2. Quy tắc nguồn dữ liệu: BẮT BUỘC

**Không bịa đặt dưới bất kỳ hình thức nào.** Đặc biệt:

1. Chỉ đưa vào kho câu hỏi những mục **thực sự có trong PDF**. Giữ nguyên nội dung tiếng Việt/tiếng Anh, thuật ngữ, dấu câu, ý nghĩa và lựa chọn đáp án; không tự viết lại câu, không thêm ví dụ hoặc lời giải thích AI vào dữ liệu gốc.
2. Trích xuất nguyên văn **đề bài, tất cả phương án, thứ tự phương án trong lượt quiz gốc**, loại câu hỏi, quiz/chương tương ứng và đáp án được PDF xác nhận.
3. Xác định đáp án theo thông tin LMS như `The correct answer is:`, `The correct answers are:` hoặc biến thể đúng/sai có dấu nháy; đối chiếu với phương án. **Không coi phương án đã được người làm chọn là đáp án đúng** khi kết quả là `Incorrect`. Dấu tick/cross chỉ là bằng chứng bổ sung, không thay thế đáp án chính thức nếu mâu thuẫn.
4. Hỗ trợ ít nhất các dạng xuất hiện trong PDF: `single_choice`, `multiple_choice` (`Select one or more`), `true_false`, và câu có **ảnh/sơ đồ/phương án là ảnh**. Với ảnh, cắt và lưu **đúng hình có sẵn từ trang PDF**, giữ nguyên hình; không vẽ lại hoặc tự tạo hình thay thế.
5. Có những câu mà phần text extraction không lấy được đáp án vì đáp án/phương án nằm trong ảnh hoặc dòng đáp án bị trống. Hãy render trang liên quan để **kiểm tra trực quan**, trích xuất vùng ảnh chính xác và gắn `verificationStatus = verified_visual` **chỉ nếu có đủ chứng cứ rõ ràng**. Nếu vẫn không xác minh được, gắn `needs_review`, ghi rõ lý do, không chấm điểm câu đó và không giả định đáp án.
6. Nếu câu hỏi không đọc được hoặc thiếu lựa chọn: **không tự hoàn thiện**. Đưa vào báo cáo lỗi trích xuất, đồng thời giữ bằng chứng trang nguồn để rà soát. Không âm thầm bỏ qua.
7. Các câu xuất hiện cả trong quiz bài học và quiz kết thúc chương có thể là câu trùng lặp. **Giữ nguyên sự xuất hiện theo từng quiz** và thứ tự phương án tương ứng; có thể tạo liên kết câu trùng để tái sử dụng, nhưng không xóa các lần xuất hiện ở các bài quiz khác nhau.
8. Mỗi câu phải truy vết được về **tên PDF + số trang PDF (đếm từ 1) + tên quiz + số thứ tự câu trong quiz**. Không hiển thị dữ liệu cá nhân/định danh xuất hiện trong header hoặc URL lượt làm bài của LMS lên giao diện.
9. Nếu dữ liệu trích xuất và trang PDF mâu thuẫn hoặc có khả năng sai do thứ tự text, hãy ưu tiên kiểm tra **ảnh trang gốc**, báo cáo quyết định. Nếu đáp án chính thức của LMS có vẻ sai về kiến thức chuyên môn, vẫn **giữ đáp án LMS** và đánh dấu ghi chú bất nhất; không tự sửa.
10. Mọi chỉ số số lượng quiz, số câu, số câu đã xác minh phải được **tính từ dữ liệu đã trích xuất**, không hardcode hoặc ước đoán.

## 3. Khảo sát dự án và chọn stack

- Trước khi viết code: liệt kê cấu trúc thư mục, xác định framework, package manager, scripts và conventions sẵn có. **Không phá hoặc thay thế dự án hiện hữu** khi không cần thiết.
- Nếu thư mục chưa có ứng dụng, tạo SPA bằng **React + TypeScript + Vite**; dùng CSS/Tailwind tùy điều kiện thực tế, ưu tiên giao diện nhẹ, đẹp, responsive và dễ bảo trì. Routing có thể dùng React Router; không cần server API riêng cho câu hỏi.
- Dữ liệu quiz lưu dưới dạng JSON tĩnh có schema/type TypeScript rõ ràng, tách khỏi UI. Không phải đọc PDF ở runtime trình duyệt; việc trích xuất PDF là quy trình build/chuẩn bị dữ liệu.
- Dùng công cụ trích xuất phù hợp (ưu tiên **Python + PyMuPDF/fitz** nếu có thể); xử lý UTF-8. Khi text extraction không đáng tin cậy, **render trang PDF rồi kiểm tra bằng mắt**; chỉ dùng OCR nếu thực sự cần và phải kiểm tra lại kết quả. Viết script có thể chạy lại trong `scripts/`.
- Không đưa nguyên PDF vào `public/` nếu không cần thiết. Chỉ xuất phần ảnh dùng cho câu hỏi; crop không được chứa các phần không liên quan hoặc dữ liệu định danh cá nhân.

## 4. Yêu cầu cho pipeline trích xuất

Thực hiện theo các bước:

**A. Khảo sát toàn bộ 275 trang (xác nhận số trang thực tế từ file):** phát hiện ranh giới các lượt `Quiz 0102`, `Quiz Kết thúc chương ...`, `Quiz Pr...` và các quiz khác có mặt; xác định chương/bài từ breadcrumb hoặc tiêu đề trong PDF. Không giả định rằng mỗi quiz chỉ chiếm một trang; bỏ qua trang chỉ có navigation/footer khi không có câu hỏi.

**B. Trích xuất câu hỏi:** ghép đúng các mảnh text bị xuống dòng; phân định câu dựa trên bố cục thực tế chứ không chỉ `Question n` vì nhiều câu có thể nằm trên một trang, còn phần thân câu có thể nằm ở vị trí khác trong thứ tự trích xuất. Nhận diện các câu dài, nhiều lựa chọn đúng, true/false và câu có hình. Loại bỏ chrome của LMS (thanh điều hướng, tên tài khoản, thời gian, điểm, URL lượt làm bài) khỏi phần nội dung câu hỏi.

**C. Đối chiếu đáp án:** map đáp án LMS đến `optionId` của **đúng câu hỏi**, không đoán dựa vào nhãn a/b/c/d nếu vị trí lựa chọn thay đổi. Với nhiều đáp án, lưu mảng id và chấm theo tập hợp lựa chọn (không phụ thuộc thứ tự người chọn). Với câu true/false, giữ nhãn hiển thị theo bản gốc. Nếu câu hỏi có ảnh đáp án, crop đúng từng lựa chọn hoặc vùng ảnh cần thiết để người dùng nhìn được đầy đủ.

**D. Kiểm định, xuất dữ liệu, báo cáo:** tạo schema/validation, phát hiện ID trùng, option trùng, câu không có đáp án, đáp án không khớp lựa chọn, trường rỗng, quiz bị mất câu hoặc thiếu trang nguồn. Tạo báo cáo `extraction-report.md` hoặc tương đương gồm: tổng số quiz, tổng số câu xuất hiện, đã xác minh bằng text, đã xác minh bằng ảnh, cần kiểm tra, bị loại khỏi phần chấm; thống kê theo từng chương/quiz và danh sách vấn đề có số trang để rà soát.

Gợi ý schema (được phép cải thiện cho hợp dự án, **không được đánh mất provenance**):

```ts
type Question = {
  id: string;                     // ổn định và duy nhất theo quiz + question number
  quizId: string;
  questionNumber: number;
  type: 'single_choice' | 'multiple_choice' | 'true_false';
  prompt: string;
  promptImages?: string[];
  options: { id: string; label?: string; text?: string; image?: string }[];
  correctOptionIds: string[];     // chỉ có giá trị khi xác minh được
  verificationStatus: 'verified_text' | 'verified_visual' | 'needs_review';
  verificationNote?: string;
  source: { file: string; pages: number[]; quizTitle: string };
};

type Quiz = {
  id: string;
  title: string;
  chapterId?: string;             // căn cứ trên nội dung PDF
  questionIds: string[];
  sourcePages: number[];
};
```

Lưu cả record cần rà soát vào dữ liệu/audit, nhưng **không được đưa câu thiếu đáp án chắc chắn vào các bài kiểm tra có chấm điểm**. Có thể hiển thị rõ “Chưa xác minh” ở chế độ xem nguồn, hoặc tách riêng báo cáo kiểm duyệt. Phải dễ chạy lại extraction khi PDF thay đổi.

## 5. Giao diện Stage 1

**Trang chủ** (`/` hoặc route tương đương): tên môn học, mô tả ngắn, hai thẻ điều hướng:

- **Ôn tập Quiz LMS** → vào kho quiz hoạt động.
- **Ôn tập kiểm tra cuối kỳ** → vào trang placeholder “Chức năng đang phát triển”, **không chứa dữ liệu minh họa bịa ra**.

**Trang kho Quiz LMS**:

- Hiển thị các chương/nhóm và quiz **theo đúng các tên được tìm thấy trong PDF**, bao gồm quiz bài học, quiz kết thúc chương, nhóm `Pr` nếu có.
- Mỗi quiz hiển thị số câu có thể luyện, số câu cần kiểm tra, tên gốc; cho phép vào luyện quiz cụ thể. Có thể thêm bộ lọc/tìm kiếm theo tên/chương khi không làm chậm tiến độ.
- Thông báo minh bạch nếu quiz có câu chưa xác minh; không nói tất cả câu đã sẵn sàng khi thực tế chưa đủ.

**Trang làm quiz**:

- Hiển thị câu hỏi, lựa chọn (văn bản/ảnh), loại câu hỏi, tiến độ `câu hiện tại / tổng câu`, nút trước/sau, nộp bài.
- `single_choice` và `true_false`: chọn một; `multiple_choice`: chọn nhiều. Lưu lựa chọn của người dùng theo câu.
- Sau khi nộp: hiển thị **đúng/sai theo đáp án LMS**, đáp án chính xác, câu đã chọn và điểm/tổng số câu đã chấm; cho phép xem lại, làm lại. Không lấy đáp án người dùng làm đáp án gốc.
- Có thể xem nguồn của câu (tên quiz + số trang PDF), nhưng không cần cung cấp PDF đầy đủ nếu không có viewer.
- Giữ nguyên thứ tự câu và phương án mặc định như nguồn; nếu có tính năng xáo trộn thì **tắt mặc định** và phải giữ mapping đáp án chính xác.
- Không để lộ đáp án trước khi người dùng nộp trong chế độ làm bài; không đánh dấu đáp án trong ảnh lựa chọn nếu bản ảnh nguồn có icon kết quả LMS (crop phần ảnh gốc phù hợp, tránh để dấu tick/x hoặc dòng answer key trong vùng mà học viên nhìn thấy trước khi nộp).
- Responsive cho desktop/mobile, truy cập được bằng bàn phím, trạng thái loading/error/empty rõ ràng. Có thể lưu tiến độ vào `localStorage` (không bắt buộc đăng nhập).

**Trang cuối kỳ**: chỉ hiển thị tiêu đề, trạng thái chưa triển khai và nút quay về trang chủ. Không làm thêm tính năng cuối kỳ ở Stage 1.

## 6. Kiểm thử và tiêu chí nghiệm thu

Không coi Stage 1 hoàn tất cho tới khi:

- Ứng dụng khởi động được bằng lệnh hướng dẫn trong README; TypeScript check/build thành công.
- PDF được xử lý **toàn bộ**, không chỉ một vài trang đầu, không lấy dữ liệu demo thay cho dữ liệu thực. Nếu chưa xử lý hết, phải nêu rõ phạm vi thực tế đã xong và vẫn để trạng thái `IN_PROGRESS`.
- Có script extraction chạy lại được, dữ liệu JSON đã xuất, asset hình ảnh cần thiết và báo cáo kiểm chứng/trích xuất.
- Có test tự động tối thiểu cho: schema hợp lệ; ID duy nhất; câu đã xác minh có đáp án nằm trong options; bài một lựa chọn; bài nhiều lựa chọn; đúng/sai; kết quả quiz; không chấm câu `needs_review`; render câu có ảnh. Có thể dùng Vitest/Testing Library hoặc công cụ tương đương với stack hiện tại.
- **Rà soát thủ công trực tiếp với PDF** ít nhất các mẫu ở đầu, giữa, cuối file và mỗi loại câu hỏi, đặc biệt câu có ảnh UML và câu chọn nhiều đáp án; ghi rõ sample nào đã kiểm tra và kết quả vào báo cáo.
- Trang LMS hiển thị dữ liệu thật và chấm đúng; trang cuối kỳ là placeholder không có đề/câu giả.
- Không có mật khẩu, token, thông tin cá nhân hoặc URL truy cập lượt làm bài được đưa vào assets công khai.
- Dữ liệu source không bị thay đổi. Không tuyên bố đã kiểm tra một mục khi chưa thực hiện.

## 7. Quản trị tiến độ bắt buộc — `agent.md`

Ngay khi bắt đầu, đọc `agent.md` tại **root** dự án; nếu chưa có, tạo file này. File là **nguồn thông tin tiến độ chính thức** để một coding agent khác có thể tiếp tục không cần hỏi lại. Cập nhật file **sau mỗi cột mốc có thay đổi thực tế** và **trước khi kết thúc mỗi phiên làm việc**. Không ghi thành tích giả.

Bắt buộc có:

1. Mục tiêu/phạm vi Stage 1 và yêu cầu không bịa dữ liệu.
2. Trạng thái hiện tại (`NOT_STARTED`, `IN_PROGRESS`, `BLOCKED`, `DONE`) và checklist từng đầu việc.
3. **Danh sách toàn bộ file/thư mục đã tạo, chỉnh sửa hoặc xóa**, với đường dẫn, mục đích, tình trạng; phân biệt file sinh tự động với file viết tay.
4. Lịch sử quyết định kỹ thuật và lý do chọn stack/schema/chiến lược PDF.
5. Kết quả trích xuất: nguồn PDF, checksum SHA-256 nếu tính được, số trang, số quiz/câu đã nhận diện, số đã xác minh/chưa xác minh, các trang cần kiểm tra; cập nhật con số từ output thực tế.
6. Nhật ký kiểm thử: lệnh đã chạy, kết quả pass/fail, lỗi đang tồn tại.
7. Công việc còn lại, blocker, bước tiếp theo cụ thể và lịch sử từng phiên (ngày/giờ nếu xác định được).

Không được tự ghi `DONE` khi chưa đáp ứng tiêu chí nghiệm thu. Nếu phải dừng vì giới hạn thời gian/tài nguyên, hãy để dự án ở trạng thái có thể chạy/tiếp tục, đánh dấu rõ phần còn thiếu và việc cần làm tiếp theo.

## 8. Tài liệu bàn giao và cách làm việc

- Tạo/cập nhật `README.md`: mô tả hệ thống, cấu trúc thư mục, yêu cầu môi trường, cách cài đặt/chạy/build/test và **cách chạy lại bộ trích xuất từ PDF**.
- Tách mã nguồn, dữ liệu, scripts trích xuất, báo cáo và image assets thành các thư mục rõ ràng; không cần tuân thủ tên thư mục cứng nếu dự án đã có quy ước tốt.
- Triển khai thật theo thứ tự: **(1) khảo sát repo và PDF → (2) tạo/update `agent.md` → (3) xây pipeline + audit dữ liệu → (4) xây UI → (5) test, đối chiếu PDF, build → (6) cập nhật README, báo cáo và `agent.md`**.
- Tự kiểm tra các giả định; không hỏi lại những thông tin đã có trong thư mục dự án. Nếu có mâu thuẫn hoặc trở ngại kỹ thuật, chọn giải pháp giữ nguyên tính trung thực nguồn, ghi rõ vào `agent.md` và tiếp tục phần có thể làm được.
- Khi hoàn tất, phản hồi ngắn gọn bằng tiếng Việt gồm: kiến trúc/stack đã sử dụng, các trang và chức năng đã chạy, **số quiz/câu được trích xuất và số cần kiểm tra** dựa trên số liệu thật, các file quan trọng, cách chạy/test, và các giới hạn còn lại của Stage 1.

**Ưu tiên số 1: dữ liệu thật và đúng với PDF. Ưu tiên số 2: chạy được và có thể kiểm thử. Ưu tiên số 3: giao diện đẹp, dễ ôn tập. Không đánh đổi tính chính xác để làm một bản demo trông hoàn chỉnh.**
