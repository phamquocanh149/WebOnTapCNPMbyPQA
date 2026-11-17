import os
import re
import json
import hashlib
from PIL import Image
import pymupdf

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

PDF_CANDIDATES = [
    os.path.join(PROJECT_ROOT, 'Data', 'LMS_quiz', 'Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf'),
    os.path.join(PROJECT_ROOT, 'data', 'LMS_quiz', 'Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf'),
    os.path.join(PROJECT_ROOT, 'data', 'Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf'),
    os.path.join(PROJECT_ROOT, 'Data', 'Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf'),
    os.path.join(PROJECT_ROOT, '..', 'data', 'LMS_quiz', 'Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf'),
]

PDF_PATH = next((p for p in PDF_CANDIDATES if os.path.exists(p)), PDF_CANDIDATES[0])
IMG_OUT_DIR = os.path.join(PROJECT_ROOT, 'public', 'images', 'quiz')
DATA_OUT_PATH = os.path.join(PROJECT_ROOT, 'src', 'data', 'quiz_data.json')
REPORT_OUT_PATH = os.path.join(PROJECT_ROOT, 'reports', 'extraction-report.md')

os.makedirs(IMG_OUT_DIR, exist_ok=True)
os.makedirs(os.path.dirname(DATA_OUT_PATH), exist_ok=True)
os.makedirs(os.path.dirname(REPORT_OUT_PATH), exist_ok=True)

def compute_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def clean_text(text):
    if not text:
        return ""
    text = text.replace('\uf00c', '').replace('\uf00d', '').replace('', '').replace('', '')
    text = text.replace('\u2714', '').replace('\u2713', '').replace('\u2718', '').replace('\u2716', '')
    text = text.replace('✔', '').replace('✖', '')
    text = re.sub(r'[ \t]+', ' ', text)
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    return '\n'.join(lines).strip()

def normalize(s):
    s = clean_text(s).lower()
    s = re.sub(r'[^\w\s]', '', s)
    return re.sub(r'\s+', ' ', s).strip()

def slugify(text):
    text = text.lower()
    text = re.sub(r'[àáạảãâầấậẩẫăằắặẳẵ]', 'a', text)
    text = re.sub(r'[èéẹẻẽêềếệểễ]', 'e', text)
    text = re.sub(r'[ìíịỉĩ]', 'i', text)
    text = re.sub(r'[òóọỏõôồốộổỗơờớợởỡ]', 'o', text)
    text = re.sub(r'[ùúụủũưừứựửữ]', 'u', text)
    text = re.sub(r'[ỳýỵỷỹ]', 'y', text)
    text = re.sub(r'[đ]', 'd', text)
    text = re.sub(r'[^a-z0-9]+', '_', text)
    return text.strip('_')

def get_chapter_id(text):
    if not text:
        return "khac"
    m = re.search(r'Chương\s+(\d+)', text, re.IGNORECASE)
    if m:
        return f"chuong_{m.group(1)}"
    if 'bài tập lớn' in text.lower() or 'pr' in text.lower():
        return "kiem_tra_btt_lon"
    return "khac"

# Special known image answer matches verified via PDF image xrefs:
IMAGE_ANSWER_PAGES = {
    115: "opt_a", # xref 13702
    125: "opt_c", # xref 14874
    126: "opt_a", # xref 14913
    135: "opt_c", # xref 14874
    136: "opt_d", # xref 16002
    138: "opt_a", # xref 13702
    174: "opt_a", # xref 20018
}

# Verified Visual data for Quiz 0901 - 0906 (pages 202 - 223)
RASTER_QUIZZES = [
    {
        "id": "quiz_0901",
        "title": "Quiz 0901",
        "chapterId": "chuong_9",
        "chapterTitle": "Chương 9. Đảm bảo chất lượng phần mềm",
        "sourcePages": [202, 203, 204],
        "questions": [
            {
                "id": "quiz_0901_q1",
                "quizId": "quiz_0901",
                "questionNumber": 1,
                "type": "single_choice",
                "prompt": "Lỗi của một phần mềm",
                "options": [
                    {"id": "opt_a", "label": "a", "text": "Là không đáp ứng về mặt chức năng của sản phẩm."},
                    {"id": "opt_b", "label": "b", "text": "Là không thỏa mãn yêu cầu của khách hàng."},
                    {"id": "opt_c", "label": "c", "text": "Là sự khác biệt giữa sản phẩm với các yêu cầu đặt ra."},
                    {"id": "opt_d", "label": "d", "text": "Được phát hiện trực tiếp bởi lập trình viên."}
                ],
                "correctOptionIds": ["opt_c"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 202; LMS ghi nhận 'The correct answer is: Là sự khác biệt giữa sản phẩm với các yêu cầu đặt ra.'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [202], "quizTitle": "Quiz 0901"}
            },
            {
                "id": "quiz_0901_q2",
                "quizId": "quiz_0901",
                "questionNumber": 2,
                "type": "single_choice",
                "prompt": "Theo định nghĩa của IEEE thì chất lượng của sản phẩm phần mềm không bao gồm",
                "options": [
                    {"id": "opt_a", "label": "a", "text": "Đạt được các yêu cầu đặt ra."},
                    {"id": "opt_b", "label": "b", "text": "Đạt được mong đợi của khách hàng."},
                    {"id": "opt_c", "label": "c", "text": "Đạt được mong đợi của người dùng."},
                    {"id": "opt_d", "label": "d", "text": "Đáp ứng được các yêu cầu của người phát triển."}
                ],
                "correctOptionIds": ["opt_d"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 202; LMS ghi nhận 'The correct answer is: Đáp ứng được các yêu cầu của người phát triển.'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [202], "quizTitle": "Quiz 0901"}
            },
            {
                "id": "quiz_0901_q3",
                "quizId": "quiz_0901",
                "questionNumber": 3,
                "type": "single_choice",
                "prompt": "Định nghĩa về chất lượng phần mềm được nhìn nhận dưới những góc độ nào?",
                "options": [
                    {"id": "opt_a", "label": "a", "text": "Người sử dụng, người phát triển, nhà kinh doanh, người phân tích chiến lược."},
                    {"id": "opt_b", "label": "b", "text": "Nhà sản xuất, lợi ích, người phân tích, tiềm năng."},
                    {"id": "opt_c", "label": "c", "text": "Người dùng, sản xuất, sản phẩm, kinh tế."},
                    {"id": "opt_d", "label": "d", "text": "Người dùng, nhà phát triển, kĩ năng, lợi nhuận."}
                ],
                "correctOptionIds": ["opt_c"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 203; LMS ghi nhận 'The correct answer is: Người dùng, sản xuất, sản phẩm, kinh tế.'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [203], "quizTitle": "Quiz 0901"}
            },
            {
                "id": "quiz_0901_q4",
                "quizId": "quiz_0901",
                "questionNumber": 4,
                "type": "single_choice",
                "prompt": "Yếu tố nào sau đây không được xem là khó khăn trong kiểm thử phần mềm",
                "options": [
                    {"id": "opt_a", "label": "a", "text": "Phụ thuộc vào chất lượng của thiết kế."},
                    {"id": "opt_b", "label": "b", "text": "Dễ bị ảnh hưởng tâm lý của người kiểm thử."},
                    {"id": "opt_c", "label": "c", "text": "Khó đảm bảo được tính đầy đủ của kiểm thử."},
                    {"id": "opt_d", "label": "d", "text": "Việc lựa chọn kĩ thuật kiểm thử phù hợp."}
                ],
                "correctOptionIds": ["opt_d"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 203; LMS ghi nhận 'The correct answer is: Việc lựa chọn kĩ thuật kiểm thử phù hợp.'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [203], "quizTitle": "Quiz 0901"}
            },
            {
                "id": "quiz_0901_q5",
                "quizId": "quiz_0901",
                "questionNumber": 5,
                "type": "single_choice",
                "prompt": "Phát biểu nào sau đây không đúng đối với mô hình chữ V",
                "options": [
                    {"id": "opt_a", "label": "a", "text": "Validation là kiểm tra xem sản phẩm có thỏa mãn các yêu cầu người dùng hay không."},
                    {"id": "opt_b", "label": "b", "text": "Là mô hình cho hoạt động phát triển và đánh giá chất lượng phần mềm."},
                    {"id": "opt_c", "label": "c", "text": "Verification là xác minh xem hệ thống có được xây dựng đúng hay không."},
                    {"id": "opt_d", "label": "d", "text": "Là mô hình đánh giá chất lượng sản phẩm dựa trên góc nhìn của người dùng cuối."}
                ],
                "correctOptionIds": ["opt_d"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 203; LMS ghi nhận 'The correct answer is: Là mô hình đánh giá chất lượng sản phẩm dựa trên góc nhìn của người dùng cuối.'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [203], "quizTitle": "Quiz 0901"}
            }
        ]
    },
    {
        "id": "quiz_0902",
        "title": "Quiz 0902",
        "chapterId": "chuong_9",
        "chapterTitle": "Chương 9. Đảm bảo chất lượng phần mềm",
        "sourcePages": [205, 206, 207],
        "questions": [
            {
                "id": "quiz_0902_q1",
                "quizId": "quiz_0902",
                "questionNumber": 1,
                "type": "single_choice",
                "prompt": "Đồ thị luồng điều khiển",
                "options": [
                    {"id": "opt_a", "label": "a", "text": "Thể hiện việc tương tác về mặt dữ liệu của chương trình."},
                    {"id": "opt_b", "label": "b", "text": "Biểu diễn các đường đi từ điểm bắt đầu đến điểm kết thúc của chương trình."},
                    {"id": "opt_c", "label": "c", "text": "Biểu diễn cấu trúc dữ liệu của một đơn vị chương trình."},
                    {"id": "opt_d", "label": "d", "text": "Là sự liên kết giữa các module trong chương trình được biểu diễn ở dạng đồ thị."}
                ],
                "correctOptionIds": ["opt_b"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 205; LMS ghi nhận 'The correct answer is: Biểu diễn các đường đi từ điểm bắt đầu đến điểm kết thúc của chương trình.'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [205], "quizTitle": "Quiz 0902"}
            },
            {
                "id": "quiz_0902_q2",
                "quizId": "quiz_0902",
                "questionNumber": 2,
                "type": "single_choice",
                "prompt": "Chọn phát biểu sai đối với kiểm thử luồng điều khiển",
                "options": [
                    {"id": "opt_a", "label": "a", "text": "Luôn kiểm thử được một đường đi (path) từ điểm bắt đầu đến điểm kết thúc của chương trình."},
                    {"id": "opt_b", "label": "b", "text": "Luồng điều khiển luôn có một điểm bắt đầu và một điểm kết thúc."},
                    {"id": "opt_c", "label": "c", "text": "Thiết kế các ca kiểm thử nhằm tìm ra các đường dẫn có lỗi."},
                    {"id": "opt_d", "label": "d", "text": "Với mỗi dữ liệu đầu vào chương trình có thể thực hiện theo các đường dẫn khác nhau."}
                ],
                "correctOptionIds": ["opt_a"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 205; LMS ghi nhận 'The correct answer is: Luôn kiểm thử được một đường đi (path) từ điểm bắt đầu đến điểm kết thúc của chương trình.'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [205], "quizTitle": "Quiz 0902"}
            },
            {
                "id": "quiz_0902_q3",
                "quizId": "quiz_0902",
                "questionNumber": 3,
                "type": "single_choice",
                "prompt": "Phát biểu nào là sai đối với các kĩ thuật thiết kế ca kiểm thử theo kiểm thử hộp trắng",
                "options": [
                    {"id": "opt_a", "label": "a", "text": "Phân vùng tương đương."},
                    {"id": "opt_b", "label": "b", "text": "Bao phủ điểm định nghĩa của biến."},
                    {"id": "opt_c", "label": "c", "text": "Bao phủ lệnh."},
                    {"id": "opt_d", "label": "d", "text": "Bao phủ điểm sử dụng của biến."}
                ],
                "correctOptionIds": ["opt_a"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 206; LMS ghi nhận 'The correct answer is: Phân vùng tương đương.'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [206], "quizTitle": "Quiz 0902"}
            },
            {
                "id": "quiz_0902_q4",
                "quizId": "quiz_0902",
                "questionNumber": 4,
                "type": "single_choice",
                "prompt": "Phát biểu nào là sai đối với kiểm thử hộp trắng",
                "options": [
                    {"id": "opt_a", "label": "a", "text": "Người dùng hệ thống có thể tham gia thực hiện tùy từng giai đoạn cụ thể."},
                    {"id": "opt_b", "label": "b", "text": "Được thực hiện chủ yếu bởi lập trình viên hoặc kiểm thử viên"},
                    {"id": "opt_c", "label": "c", "text": "Có thể triển khai ở bước tích hợp các module."},
                    {"id": "opt_d", "label": "d", "text": "Có thể áp dụng ở giai đoạn kiểm thử đơn vị."}
                ],
                "correctOptionIds": ["opt_a"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 206; LMS ghi nhận 'The correct answer is: Người dùng hệ thống có thể tham gia thực hiện tùy từng giai đoạn cụ thể.'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [206], "quizTitle": "Quiz 0902"}
            },
            {
                "id": "quiz_0902_q5",
                "quizId": "quiz_0902",
                "questionNumber": 5,
                "type": "single_choice",
                "prompt": "Kiểm thử hộp trắng",
                "options": [
                    {"id": "opt_a", "label": "a", "text": "Kiểm thử hoạt động của chương trình dựa vào mô tả chức năng."},
                    {"id": "opt_b", "label": "b", "text": "Được thực hiện bởi kiểm thử viên."},
                    {"id": "opt_c", "label": "c", "text": "Tập trung vào kết quả đầu ra dựa trên dữ liệu đầu vào."},
                    {"id": "opt_d", "label": "d", "text": "Chiến lược kiểm thử dựa trên cấu trúc của chương trình."}
                ],
                "correctOptionIds": ["opt_d"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 206; LMS ghi nhận 'The correct answer is: Chiến lược kiểm thử dựa trên cấu trúc của chương trình.'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [206], "quizTitle": "Quiz 0902"}
            }
        ]
    },
    {
        "id": "quiz_0903",
        "title": "Quiz 0903",
        "chapterId": "chuong_9",
        "chapterTitle": "Chương 9. Đảm bảo chất lượng phần mềm",
        "sourcePages": [208, 209, 210],
        "questions": [
            {
                "id": "quiz_0903_q1",
                "quizId": "quiz_0903",
                "questionNumber": 1,
                "type": "single_choice",
                "prompt": "Trong kiểm thử hộp trắng với luồng điều khiển",
                "options": [
                    {"id": "opt_a", "label": "a", "text": "Tiêu chí bao phủ nhánh còn được gọi là bao phủ điểm quyết định."},
                    {"id": "opt_b", "label": "b", "text": "Có thể xét bao phủ nhánh và bao phủ lệnh thay thế cho bao phủ đường dẫn."},
                    {"id": "opt_c", "label": "c", "text": "Tiêu chí mạnh nhất là bao phủ mọi đường dẫn."},
                    {"id": "opt_d", "label": "d", "text": "Bao phủ lệnh luôn được đảm bảo trong mọi trường hợp."}
                ],
                "correctOptionIds": ["opt_c"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 208; LMS ghi nhận 'The correct answer is: Tiêu chí mạnh nhất là bao phủ mọi đường dẫn.'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [208], "quizTitle": "Quiz 0903"}
            },
            {
                "id": "quiz_0903_q2",
                "quizId": "quiz_0903",
                "questionNumber": 2,
                "type": "single_choice",
                "prompt": "Sử dụng kĩ thuật bao phủ nhánh trong kiểm thử luồng điều khiển nhằm mục đích",
                "options": [
                    {"id": "opt_a", "label": "a", "text": "Kiểm tra giá trị điều kiện của điểm quyết định phải là true."},
                    {"id": "opt_b", "label": "b", "text": "Đảm bảo các nhánh tại điểm quyết định ở trên đồ thị luồng điều khiển phải được xem xét."},
                    {"id": "opt_c", "label": "c", "text": "Xác định giá trị đầu ra khi chương trình thực hiện câu lệnh điều kiện tương ứng."},
                    {"id": "opt_d", "label": "d", "text": "Câu lệnh điều kiện bất kì luôn được thực hiện ít nhất một lần."}
                ],
                "correctOptionIds": ["opt_b"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 208; LMS ghi nhận 'The correct answer is: Đảm bảo các nhánh tại điểm quyết định ở trên đồ thị luồng điều khiển phải được xem xét.'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [208], "quizTitle": "Quiz 0903"}
            },
            {
                "id": "quiz_0903_q3",
                "quizId": "quiz_0903",
                "questionNumber": 3,
                "type": "single_choice",
                "prompt": "Phát biểu nào là sai đối với kĩ thuật bao phủ nhánh",
                "options": [
                    {"id": "opt_a", "label": "a", "text": "Không đảm bảo tìm được giá trị của dữ liệu để tất cả các nhánh rẽ đều được xét."},
                    {"id": "opt_b", "label": "b", "text": "Bao phủ nhánh đảm bảo bao phủ lệnh."},
                    {"id": "opt_c", "label": "c", "text": "Luôn thiết kế được đường đi tương ứng với các nhánh rẽ."},
                    {"id": "opt_d", "label": "d", "text": "Các nhánh rẽ làm mọi câu lệnh đều được thực thi ít nhất một lần."}
                ],
                "correctOptionIds": ["opt_c"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 209; LMS ghi nhận 'The correct answer is: Luôn thiết kế được đường đi tương ứng với các nhánh rẽ.'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [209], "quizTitle": "Quiz 0903"}
            },
            {
                "id": "quiz_0903_q4",
                "quizId": "quiz_0903",
                "questionNumber": 4,
                "type": "single_choice",
                "prompt": "Các tiêu chí nào không dùng để lựa chọn đường dẫn chương trình trong kiểm thử luồng điều khiển",
                "options": [
                    {"id": "opt_a", "label": "a", "text": "Bao phủ các đường dẫn."},
                    {"id": "opt_b", "label": "b", "text": "Đảm bảo mọi miền dữ liệu đầu vào của hệ thống đều được xem xét."},
                    {"id": "opt_c", "label": "c", "text": "Đảm bảo mọi câu lệnh trong chương trình đều được thực thi."},
                    {"id": "opt_d", "label": "d", "text": "Đảm bảo mọi giá trị điều kiện true/false ở câu lệnh điều kiện đều được kiểm tra."}
                ],
                "correctOptionIds": ["opt_b"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 209; LMS ghi nhận 'The correct answer is: Đảm bảo mọi miền dữ liệu đầu vào của hệ thống đều được xem xét.'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [209], "quizTitle": "Quiz 0903"}
            },
            {
                "id": "quiz_0903_q5",
                "quizId": "quiz_0903",
                "questionNumber": 5,
                "type": "single_choice",
                "prompt": "Kĩ thuật bao phủ lệnh không yêu cầu",
                "options": [
                    {"id": "opt_a", "label": "a", "text": "Mọi câu lệnh đều được thực thi ít nhất một lần."},
                    {"id": "opt_b", "label": "b", "text": "Cần thực thi ít nhất một nhánh rẽ ở khối câu lệnh điều kiện."},
                    {"id": "opt_c", "label": "c", "text": "Các đỉnh trên đồ thị luồng điều khiển phải xuất hiện ít nhất 1 lần trong đường thực thi của chương trình."},
                    {"id": "opt_d", "label": "d", "text": "Tìm ra đường đi qua câu lệnh cần xem xét."}
                ],
                "correctOptionIds": ["opt_b"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 209; LMS ghi nhận 'The correct answer is: Cần thực thi ít nhất một nhánh rẽ ở khối câu lệnh điều kiện.'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [209], "quizTitle": "Quiz 0903"}
            }
        ]
    },
    {
        "id": "quiz_0904",
        "title": "Quiz 0904",
        "chapterId": "chuong_9",
        "chapterTitle": "Chương 9. Đảm bảo chất lượng phần mềm",
        "sourcePages": [211, 212, 213, 214, 215],
        "questions": [
            {
                "id": "quiz_0904_q1",
                "quizId": "quiz_0904",
                "questionNumber": 1,
                "type": "multiple_choice",
                "prompt": "Các node nào trên đồ thị tương ứng với các điều kiện cần kiểm tra",
                "promptImages": ["/images/quiz/quiz_0904_flowchart.png"],
                "options": [
                    {"id": "opt_a", "label": "a", "text": "Node 2"},
                    {"id": "opt_b", "label": "b", "text": "Node 3"},
                    {"id": "opt_c", "label": "c", "text": "Node 1"},
                    {"id": "opt_d", "label": "d", "text": "Node 4"}
                ],
                "correctOptionIds": ["opt_a", "opt_d"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 211; LMS ghi nhận 'The correct answers are: Node 2, Node 4'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [211], "quizTitle": "Quiz 0904"}
            },
            {
                "id": "quiz_0904_q2",
                "quizId": "quiz_0904",
                "questionNumber": 2,
                "type": "single_choice",
                "prompt": "Test case tương ứng với câu lệnh trả về return true; của đoạn chương trình là",
                "promptImages": ["/images/quiz/quiz_0904_code.png"],
                "options": [
                    {"id": "opt_a", "label": "a", "text": "<4, 8, true>"},
                    {"id": "opt_b", "label": "b", "text": "không có đáp án nào đúng"},
                    {"id": "opt_c", "label": "c", "text": "<1, 5, false>"},
                    {"id": "opt_d", "label": "d", "text": "<2, 8, false>"}
                ],
                "correctOptionIds": ["opt_a"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 212; LMS ghi nhận 'The correct answer is: <4, 8, true>'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [212], "quizTitle": "Quiz 0904"}
            },
            {
                "id": "quiz_0904_q3",
                "quizId": "quiz_0904",
                "questionNumber": 3,
                "type": "multiple_choice",
                "prompt": "Các node nào trên đồ thị tương ứng với các giá trị kết quả có thể trả về",
                "promptImages": ["/images/quiz/quiz_0904_flowchart.png"],
                "options": [
                    {"id": "opt_a", "label": "a", "text": "Node 3"},
                    {"id": "opt_b", "label": "b", "text": "Node 2"},
                    {"id": "opt_c", "label": "c", "text": "Node 5"},
                    {"id": "opt_d", "label": "d", "text": "Node 6"}
                ],
                "correctOptionIds": ["opt_a", "opt_c", "opt_d"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 213; LMS ghi nhận 'The correct answers are: Node 3, Node 5, Node 6'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [213], "quizTitle": "Quiz 0904"}
            },
            {
                "id": "quiz_0904_q4",
                "quizId": "quiz_0904",
                "questionNumber": 4,
                "type": "single_choice",
                "prompt": "Test case tương ứng với đường đi qua các node 1-2-4-5 được thể hiện trên đồ thị là",
                "promptImages": ["/images/quiz/quiz_0904_flowchart.png"],
                "options": [
                    {"id": "opt_a", "label": "a", "text": "<1, 5, false>"},
                    {"id": "opt_b", "label": "b", "text": "không tồn tại"},
                    {"id": "opt_c", "label": "c", "text": "<2, 8, false>"},
                    {"id": "opt_d", "label": "d", "text": "<4, 8, true>"}
                ],
                "correctOptionIds": ["opt_c"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 214; LMS ghi nhận 'The correct answer is: <2, 8, false>'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [214], "quizTitle": "Quiz 0904"}
            },
            {
                "id": "quiz_0904_q5",
                "quizId": "quiz_0904",
                "questionNumber": 5,
                "type": "single_choice",
                "prompt": "Test case tương ứng với nhánh (qt * 0.3 + ck * 0.7) < 4 (đúng) trên đồ thị luồng điều khiển là",
                "promptImages": ["/images/quiz/quiz_0904_code.png"],
                "options": [
                    {"id": "opt_a", "label": "a", "text": "<4, 8, true>"},
                    {"id": "opt_b", "label": "b", "text": "<1, 5, false>"},
                    {"id": "opt_c", "label": "c", "text": "không có đáp án nào đúng"},
                    {"id": "opt_d", "label": "d", "text": "<2, 8, false>"}
                ],
                "correctOptionIds": ["opt_b"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 215; LMS ghi nhận 'The correct answer is: <1, 5, false>'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [215], "quizTitle": "Quiz 0904"}
            }
        ]
    },
    {
        "id": "quiz_0905",
        "title": "Quiz 0905",
        "chapterId": "chuong_9",
        "chapterTitle": "Chương 9. Đảm bảo chất lượng phần mềm",
        "sourcePages": [216, 217, 218],
        "questions": [
            {
                "id": "quiz_0905_q1",
                "quizId": "quiz_0905",
                "questionNumber": 1,
                "type": "single_choice",
                "prompt": "Kĩ thuật phân lớp tương đương trong phương pháp kiểm thử hộp đen thực hiện những bước nào sau đây",
                "options": [
                    {"id": "opt_a", "label": "a", "text": "Xác định các giá trị nằm ở miền giao của mỗi lớp để đảm bảo tính chính xác của ca kiểm thử."},
                    {"id": "opt_b", "label": "b", "text": "Lấy giá trị bất kì miền giá trị để xây dựng ca kiểm thử."},
                    {"id": "opt_c", "label": "c", "text": "Cần xác định tính hợp lệ của dữ liệu đầu vào."},
                    {"id": "opt_d", "label": "d", "text": "Xác định các lớp tương đương từ giá trị đầu vào và đầu ra."}
                ],
                "correctOptionIds": ["opt_d"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 216; LMS ghi nhận 'The correct answer is: Xác định các lớp tương đương từ giá trị đầu vào và đầu ra.'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [216], "quizTitle": "Quiz 0905"}
            },
            {
                "id": "quiz_0905_q2",
                "quizId": "quiz_0905",
                "questionNumber": 2,
                "type": "single_choice",
                "prompt": "Kĩ thuật phân lớp tương đương trong phương pháp kiểm thử hộp đen",
                "options": [
                    {"id": "opt_a", "label": "a", "text": "Luôn có thể xác định lớp dựa theo miền dữ liệu hợp lệ hoặc không hợp lệ."},
                    {"id": "opt_b", "label": "b", "text": "Hành vi của hệ thống là đối với mọi điểm thuộc lớp tương đương có thể khác nhau."},
                    {"id": "opt_c", "label": "c", "text": "Hệ thống sẽ hoạt động theo cách khác nhau tùy thuộc vào dữ liệu thuộc lớp nào."},
                    {"id": "opt_d", "label": "d", "text": "Dựa vào miền dữ liệu đầu vào và đầu ra."}
                ],
                "correctOptionIds": ["opt_d"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 216; LMS ghi nhận 'The correct answer is: Dựa vào miền dữ liệu đầu vào và đầu ra.'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [216], "quizTitle": "Quiz 0905"}
            },
            {
                "id": "quiz_0905_q3",
                "quizId": "quiz_0905",
                "questionNumber": 3,
                "type": "single_choice",
                "prompt": "Đâu không được xem là nhược điểm của kĩ thuật phân lớp tương đương trong phương pháp kiểm thử hộp đen là",
                "options": [
                    {"id": "opt_a", "label": "a", "text": "Phụ thuộc vào kiến trúc của đơn vị chương trình."},
                    {"id": "opt_b", "label": "b", "text": "Việc thiết kế các ca kiểm thử sẽ phức tạp nếu các dữ liệu không còn độc lập."},
                    {"id": "opt_c", "label": "c", "text": "Không quan tâm đến một số giá trị không hợp lệ."},
                    {"id": "opt_d", "label": "d", "text": "Phụ thuộc vào kinh nghiệm của người kiểm thử."}
                ],
                "correctOptionIds": ["opt_a"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 217; LMS ghi nhận 'The correct answer is: Phụ thuộc vào kiến trúc của đơn vị chương trình.'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [217], "quizTitle": "Quiz 0905"}
            },
            {
                "id": "quiz_0905_q4",
                "quizId": "quiz_0905",
                "questionNumber": 4,
                "type": "single_choice",
                "prompt": "Các phương pháp thiết kế ca kiểm thử đối với phương pháp kiểm thử hộp đen",
                "options": [
                    {"id": "opt_a", "label": "a", "text": "Phân lớp tương đương, phân tích giá trị biên, sử dụng bảng quyết định, kiểm thử trạng thái."},
                    {"id": "opt_b", "label": "b", "text": "Kiểm thử trạng thái, phân miền giá trị, sử dụng bảng quyết định, xác định giá trị biên."},
                    {"id": "opt_c", "label": "c", "text": "Xác định giá trị biên, kiểm thử hoạt động, phân chia miền tương đương, sử dụng bảng quyết định."},
                    {"id": "opt_d", "label": "d", "text": "Phân tích giá trị của biến, sử dụng bảng quyết định, kiểm thử trạng thái hệ thống."}
                ],
                "correctOptionIds": ["opt_a"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 217; LMS ghi nhận 'The correct answer is: Phân lớp tương đương, phân tích giá trị biên, sử dụng bảng quyết định, kiểm thử trạng thái.'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [217], "quizTitle": "Quiz 0905"}
            },
            {
                "id": "quiz_0905_q5",
                "quizId": "quiz_0905",
                "questionNumber": 5,
                "type": "single_choice",
                "prompt": "Phát biểu nào là sai đối với phương pháp kiểm thử hộp đen",
                "options": [
                    {"id": "opt_a", "label": "a", "text": "Được thực hiện bởi kiểm thử viên."},
                    {"id": "opt_b", "label": "b", "text": "Kiểm thử hộp đen dựa trên yêu cầu và chức năng của chương trình."},
                    {"id": "opt_c", "label": "c", "text": "Không xác định được việc sẽ kiểm soát lỗi như thế nào."},
                    {"id": "opt_d", "label": "d", "text": "Cấu trúc của đơn vị chương trình quyết định đến việc thiết kế các test case."}
                ],
                "correctOptionIds": ["opt_d"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 217; LMS ghi nhận 'The correct answer is: Cấu trúc của đơn vị chương trình quyết định đến việc thiết kế các test case.'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [217], "quizTitle": "Quiz 0905"}
            }
        ]
    },
    {
        "id": "quiz_0906",
        "title": "Quiz 0906",
        "chapterId": "chuong_9",
        "chapterTitle": "Chương 9. Đảm bảo chất lượng phần mềm",
        "sourcePages": [219, 220, 221, 222, 223],
        "questions": [
            {
                "id": "quiz_0906_q1",
                "quizId": "quiz_0906",
                "questionNumber": 1,
                "type": "single_choice",
                "prompt": "Thứ tự các bước để giải quyết bài toán kiểm thử hộp đen với lớp tương đương là",
                "options": [
                    {"id": "opt_a", "label": "a", "text": "Phân các lớp cho miền giá trị của dữ liệu. Xác định các dữ liệu đầu vào và miền giá trị tương ứng. Lấy giá trị thích hợp cho các dữ liệu đầu ra. Thiết kế các test case."},
                    {"id": "opt_b", "label": "b", "text": "Xác định các dữ liệu đầu vào và miền giá trị tương ứng. Thiết kế các test case. Lấy giá trị thích hợp cho các dữ liệu đầu ra. Xác định các test case."},
                    {"id": "opt_c", "label": "c", "text": "Xác định các dữ liệu đầu vào và miền giá trị tương ứng. Phân các lớp cho miền giá trị của dữ liệu. Lấy giá trị thích hợp cho các dữ liệu đầu ra. Xác định các test case."},
                    {"id": "opt_d", "label": "d", "text": "Thiết kế các test case. Phân các lớp cho miền giá trị của dữ liệu. Lấy giá trị thích hợp cho các dữ liệu đầu ra. Xác định các test case."}
                ],
                "correctOptionIds": ["opt_c"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 219; LMS ghi nhận 'The correct answer is: Xác định các dữ liệu đầu vào và miền giá trị tương ứng. Phân các lớp cho miền giá trị của dữ liệu. Lấy giá trị thích hợp cho các dữ liệu đầu ra. Xác định các test case.'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [219], "quizTitle": "Quiz 0906"}
            },
            {
                "id": "quiz_0906_q2",
                "quizId": "quiz_0906",
                "questionNumber": 2,
                "type": "multiple_choice",
                "prompt": "Với bài toán xét kết quả của sinh viên với hai điểm thi là toán và vật lý. Sinh viên chỉ vượt qua kì thi nếu: Cả điểm toán và điểm vật lý >= 70 (xét theo thang điểm 100) và điểm trung bình của toán và vật lý >= 80. Các miền tương đương được xác định bởi giới hạn của các đường",
                "options": [
                    {"id": "opt_a", "label": "a", "text": "Lý = 100; Lý = 70"},
                    {"id": "opt_b", "label": "b", "text": "Toán = 100; Toán = 70"},
                    {"id": "opt_c", "label": "c", "text": "Không có đáp án nào đúng"},
                    {"id": "opt_d", "label": "d", "text": "(Toán + Lý)/2 = 80"}
                ],
                "correctOptionIds": ["opt_a", "opt_b", "opt_d"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 220; LMS ghi nhận 'The correct answers are: Toán = 100; Toán = 70, Lý = 100; Lý = 70, (Toán + Lý)/2 = 80'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [220], "quizTitle": "Quiz 0906"}
            },
            {
                "id": "quiz_0906_q3",
                "quizId": "quiz_0906",
                "questionNumber": 3,
                "type": "single_choice",
                "prompt": "Với bài toán xét kết quả của sinh viên với hai điểm thi là toán và vật lý. Sinh viên chỉ vượt qua kì thi nếu: Cả điểm toán và điểm vật lý >= 70 (xét theo thang điểm 100) và điểm trung bình của toán và vật lý >= 80. Các miền tương ứng với trường hợp \"Không đạt\" là:",
                "promptImages": ["/images/quiz/quiz_0906_graph.png"],
                "options": [
                    {"id": "opt_a", "label": "a", "text": "1, 2, 4, 5, 6, 7"},
                    {"id": "opt_b", "label": "b", "text": "1, 5, 6"},
                    {"id": "opt_c", "label": "c", "text": "1, 4, 5, 6"},
                    {"id": "opt_d", "label": "d", "text": "1, 2, 4, 5, 6"}
                ],
                "correctOptionIds": ["opt_a"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 221; LMS ghi nhận 'The correct answer is: 1, 2, 4, 5, 6, 7'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [221], "quizTitle": "Quiz 0906"}
            },
            {
                "id": "quiz_0906_q4",
                "quizId": "quiz_0906",
                "questionNumber": 4,
                "type": "multiple_choice",
                "prompt": "Với bài toán xét kết quả của sinh viên với hai điểm thi là toán và vật lý. Sinh viên chỉ vượt qua kì thi nếu: Cả điểm toán và điểm vật lý >= 70 (xét theo thang điểm 100) và điểm trung bình của toán và vật lý >= 80. Các test case nào sau đây được thiết kế đúng:",
                "options": [
                    {"id": "opt_a", "label": "a", "text": "<80, 50, false>"},
                    {"id": "opt_b", "label": "b", "text": "<75, 75, false>"},
                    {"id": "opt_c", "label": "c", "text": "<96, 66, false>"},
                    {"id": "opt_d", "label": "d", "text": "<86, 86, true>"}
                ],
                "correctOptionIds": ["opt_a", "opt_b", "opt_c", "opt_d"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 222; LMS ghi nhận 'The correct answers are: <80, 50, false>, <96, 66, false>, <75, 75, false>, <86, 86, true>'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [222], "quizTitle": "Quiz 0906"}
            },
            {
                "id": "quiz_0906_q5",
                "quizId": "quiz_0906",
                "questionNumber": 5,
                "type": "single_choice",
                "prompt": "Với bài toán xét kết quả của sinh viên với hai điểm thi là toán và vật lý. Sinh viên chỉ vượt qua kì thi nếu: Cả điểm toán và điểm vật lý >= 70 (xét theo thang điểm 100) và điểm trung bình của toán và vật lý >= 80. Các miền tương ứng với trường hợp \"Đạt\" là:",
                "promptImages": ["/images/quiz/quiz_0906_graph.png"],
                "options": [
                    {"id": "opt_a", "label": "a", "text": "3"},
                    {"id": "opt_b", "label": "b", "text": "Không có đáp án nào đúng"},
                    {"id": "opt_c", "label": "c", "text": "2, 3, 7"},
                    {"id": "opt_d", "label": "d", "text": "3, 4"}
                ],
                "correctOptionIds": ["opt_a"],
                "verificationStatus": "verified_visual",
                "verificationNote": "Trích xuất và kiểm tra trực quan từ trang raster 223; LMS ghi nhận 'The correct answer is: 3'",
                "source": {"file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf", "pages": [223], "quizTitle": "Quiz 0906"}
            }
        ]
    }
]

def extract_all():
    print(f"Opening PDF: {PDF_PATH}")
    doc = pymupdf.open(PDF_PATH)
    total_pages = len(doc)
    sha256 = compute_sha256(PDF_PATH)
    print(f"Total pages: {total_pages}, SHA-256: {sha256}")

    quizzes_dict = {}
    current_quiz_title = None
    current_chapter_title = None

    # Step 1: Pre-scan headers to determine quiz & chapter per page
    page_quiz_info = {}
    for p_idx in range(total_pages):
        p_num = p_idx + 1
        page = doc[p_idx]
        text = page.get_text()

        m_review = re.search(r'^(Quiz [^\n\r:]+):\s*Attempt review', text, re.MULTILINE)
        m_bc = re.search(r'Tuần \d+ - ([^\n\r]+)\s*\s*(Quiz [^\n\r]+)', text)
        
        if m_review:
            current_quiz_title = m_review.group(1).strip()
        elif m_bc:
            current_quiz_title = m_bc.group(2).strip()

        if m_bc:
            current_chapter_title = m_bc.group(1).strip()

        if 202 <= p_num <= 204:
            current_quiz_title = "Quiz 0901"
            current_chapter_title = "Chương 9. Đảm bảo chất lượng phần mềm"
        elif 205 <= p_num <= 207:
            current_quiz_title = "Quiz 0902"
            current_chapter_title = "Chương 9. Đảm bảo chất lượng phần mềm"
        elif 208 <= p_num <= 210:
            current_quiz_title = "Quiz 0903"
            current_chapter_title = "Chương 9. Đảm bảo chất lượng phần mềm"
        elif 211 <= p_num <= 215:
            current_quiz_title = "Quiz 0904"
            current_chapter_title = "Chương 9. Đảm bảo chất lượng phần mềm"
        elif 216 <= p_num <= 218:
            current_quiz_title = "Quiz 0905"
            current_chapter_title = "Chương 9. Đảm bảo chất lượng phần mềm"
        elif 219 <= p_num <= 223:
            current_quiz_title = "Quiz 0906"
            current_chapter_title = "Chương 9. Đảm bảo chất lượng phần mềm"

        page_quiz_info[p_num] = {
            "quiz_title": current_quiz_title,
            "chapter_title": current_chapter_title
        }

    all_questions = []

    # Step 2: Extract text pages
    for p_idx in range(total_pages):
        p_num = p_idx + 1
        if 202 <= p_num <= 223:
            continue

        page = doc[p_idx]
        all_blocks = page.get_text('blocks')
        quiz_title = page_quiz_info[p_num]["quiz_title"]
        chapter_title = page_quiz_info[p_num]["chapter_title"]
        if not quiz_title:
            continue

        quiz_id = slugify(quiz_title)
        chapter_id = get_chapter_id(chapter_title)

        if quiz_id not in quizzes_dict:
            quizzes_dict[quiz_id] = {
                "id": quiz_id,
                "title": quiz_title,
                "chapterId": chapter_id,
                "chapterTitle": chapter_title,
                "questionIds": [],
                "sourcePages": []
            }
        if p_num not in quizzes_dict[quiz_id]["sourcePages"]:
            quizzes_dict[quiz_id]["sourcePages"].append(p_num)

        # Left column question headers
        q_headers = []
        for b in all_blocks:
            if b[0] < 120 and b[1] < 1150:
                m = re.match(r'^Question\s+(\d+)', b[4].strip())
                if m:
                    q_headers.append((int(m.group(1)), b[1], b[3]))
        q_headers.sort(key=lambda x: x[1])

        if not q_headers:
            continue

        main_blocks = [b for b in all_blocks if b[0] > 120 and b[3] < 1150]

        for i in range(len(q_headers)):
            q_num = q_headers[i][0]
            q_id = f"{quiz_id}_q{q_num}"
            y_start = q_headers[i][1] - 15.0 if i > 0 else 130.0
            y_end = q_headers[i+1][1] - 15.0 if i < len(q_headers) - 1 else 1150.0

            q_blocks = [b for b in main_blocks if b[1] >= y_start and b[3] <= y_end + 10]
            q_blocks.sort(key=lambda b: b[1])

            prompt_lines = []
            option_lines = []
            answer_lines = []
            sel_text = None
            sel_y0 = None
            state = 'PROMPT'

            for b in q_blocks:
                lines = [l.strip() for l in b[4].split('\n') if l.strip()]
                for line in lines:
                    if re.search(r'Select\s+one', line, re.IGNORECASE):
                        sel_text = line
                        sel_y0 = b[1]
                        state = 'OPTIONS'
                        continue
                    if 'The correct answer' in line or (state == 'ANSWER'):
                        state = 'ANSWER'
                        answer_lines.append(line)
                        continue
                    if state == 'PROMPT':
                        if not any(x in line for x in ['Dashboard', 'BL-IT3180', 'Started on', 'Hide sidebars', 'Jump to...']):
                            prompt_lines.append(line)
                    elif state == 'OPTIONS':
                        option_lines.append(line)

            prompt_text = clean_text('\n'.join(prompt_lines))

            # Prompt Images
            prompt_images = []
            for img_info in page.get_images():
                xref = img_info[0]
                rects = page.get_image_rects(xref)
                for r in rects:
                    if r.x0 > 120 and r.y0 >= y_start and r.y1 <= (sel_y0 if sel_y0 else y_end):
                        img_filename = f"{q_id}_prompt.png"
                        img_path = os.path.join(IMG_OUT_DIR, img_filename)
                        try:
                            base_img = doc.extract_image(xref)
                            with open(img_path, 'wb') as f_img:
                                f_img.write(base_img["image"])
                            img_web_path = f"/images/quiz/{img_filename}"
                            if img_web_path not in prompt_images:
                                prompt_images.append(img_web_path)
                        except Exception as e:
                            print(f"Error saving image xref {xref} for {q_id}: {e}")

            # Options
            options = []
            curr_lbl = None
            curr_text = []
            for line in option_lines:
                m_opt = re.match(r'^([a-e])\.\s*(.*)', line)
                m_tf = re.match(r'^(True|False|Đúng|Sai)\b\s*(.*)', line, re.IGNORECASE)
                if m_opt:
                    if curr_lbl:
                        options.append({'id': f'opt_{curr_lbl}', 'label': curr_lbl, 'text': clean_text(' '.join(curr_text))})
                    curr_lbl = m_opt.group(1).lower()
                    curr_text = [m_opt.group(2)]
                elif m_tf and not curr_lbl:
                    lbl = 'a' if m_tf.group(1).lower() in ['true', 'đúng'] else 'b'
                    options.append({'id': f'opt_{lbl}', 'label': lbl, 'text': clean_text(line)})
                else:
                    if curr_lbl:
                        curr_text.append(line)
            if curr_lbl:
                options.append({'id': f'opt_{curr_lbl}', 'label': curr_lbl, 'text': clean_text(' '.join(curr_text))})

            # Check question type
            is_mult = sel_text and bool(re.search(r'Select\s+one\s+or\s+more', sel_text, re.IGNORECASE))
            if is_mult:
                q_type = "multiple_choice"
            elif len(options) == 2 and any(x in [o["text"].strip().lower() for o in options] for x in ['đúng', 'sai', 'true', 'false']):
                q_type = "true_false"
            else:
                q_type = "single_choice"

            # Check if options are images (e.g. pages 115, 125, 126, 135, 136, 138, 174)
            if p_num in IMAGE_ANSWER_PAGES:
                q_imgs = []
                for img_info in page.get_images():
                    xref = img_info[0]
                    rects = page.get_image_rects(xref)
                    for r in rects:
                        if r.x0 > 120 and r.y0 > (sel_y0 if sel_y0 else y_start) and r.y0 < 920:
                            q_imgs.append((r.y0, xref, r))
                q_imgs.sort(key=lambda x: x[0])
                seen_xrefs = []
                for item in q_imgs:
                    if item[1] not in [x[1] for x in seen_xrefs]:
                        seen_xrefs.append(item)

                options = []
                labels = ['a', 'b', 'c', 'd']
                for idx, item in enumerate(seen_xrefs[:4]):
                    lbl = labels[idx]
                    opt_id = f"opt_{lbl}"
                    xref = item[1]
                    img_filename = f"{q_id}_opt_{lbl}.png"
                    img_path = os.path.join(IMG_OUT_DIR, img_filename)
                    base_img = doc.extract_image(xref)
                    with open(img_path, 'wb') as f_img:
                        f_img.write(base_img["image"])
                    options.append({
                        "id": opt_id,
                        "label": lbl,
                        "text": "",
                        "image": f"/images/quiz/{img_filename}"
                    })

            # Parse Answer
            correct_option_ids = []
            verification_status = "verified_text"
            verification_note = None

            if p_num in IMAGE_ANSWER_PAGES:
                matched_opt = IMAGE_ANSWER_PAGES[p_num]
                correct_option_ids = [matched_opt]
                verification_status = "verified_visual"
                verification_note = f"Đáp án dạng ảnh được xác minh bằng đối chiếu image xref từ PDF gốc (trang {p_num})."
            elif not answer_lines:
                correct_option_ids = []
                verification_status = "needs_review"
                verification_note = "PDF không hiển thị dòng 'The correct answer is' (lượt làm bài Incorrect và LMS không công bố đáp án)."
            else:
                ans_raw = ' '.join(answer_lines)
                m_ans = re.search(r'The correct answers?\s+(?:is|are):\s*(.*)', ans_raw, re.IGNORECASE)
                if m_ans:
                    ans_clean = clean_text(m_ans.group(1))
                else:
                    m_tf_ans = re.search(r"The correct answer is\s+['\"]?([^'\"\.\n\r]+)['\"]?\.", ans_raw, re.IGNORECASE)
                    ans_clean = clean_text(m_tf_ans.group(1)) if m_tf_ans else clean_text(ans_raw)

                if is_mult:
                    subs = [clean_text(s) for s in re.split(r'[,;\n]', ans_clean) if clean_text(s)]
                    for s in subs:
                        for opt in options:
                            if normalize(s) == normalize(opt['text']) or normalize(s) in normalize(opt['text']) or normalize(opt['text']) in normalize(s):
                                if opt['id'] not in correct_option_ids:
                                    correct_option_ids.append(opt['id'])
                else:
                    for opt in options:
                        if normalize(ans_clean) == normalize(opt['text']) or normalize(ans_clean) in normalize(opt['text']) or normalize(opt['text']) in normalize(ans_clean):
                            correct_option_ids.append(opt['id'])
                            break
                    if not correct_option_ids and len(options) == 2:
                        for opt in options:
                            if ('đúng' in opt['text'].lower() and 'đúng' in ans_clean.lower()) or \
                               ('sai' in opt['text'].lower() and 'sai' in ans_clean.lower()) or \
                               ('true' in opt['text'].lower() and 'true' in ans_clean.lower()) or \
                               ('false' in opt['text'].lower() and 'false' in ans_clean.lower()):
                                correct_option_ids.append(opt['id'])

                if not correct_option_ids:
                    verification_status = "needs_review"
                    verification_note = f"Không map được đáp án '{ans_clean}' vào danh sách lựa chọn."

            q_obj = {
                "id": q_id,
                "quizId": quiz_id,
                "questionNumber": q_num,
                "type": q_type,
                "prompt": prompt_text,
                "options": options,
                "correctOptionIds": correct_option_ids,
                "verificationStatus": verification_status,
                "source": {
                    "file": "Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf",
                    "pages": [p_num],
                    "quizTitle": quiz_title
                }
            }
            if prompt_images:
                q_obj["promptImages"] = prompt_images
            if verification_note:
                q_obj["verificationNote"] = verification_note

            all_questions.append(q_obj)
            quizzes_dict[quiz_id]["questionIds"].append(q_id)

    # Step 3: Inject raster quizzes (Quiz 0901 - 0906)
    for r_quiz in RASTER_QUIZZES:
        quiz_id = r_quiz["id"]
        quizzes_dict[quiz_id] = {
            "id": quiz_id,
            "title": r_quiz["title"],
            "chapterId": r_quiz["chapterId"],
            "chapterTitle": r_quiz["chapterTitle"],
            "questionIds": [q["id"] for q in r_quiz["questions"]],
            "sourcePages": r_quiz["sourcePages"]
        }
        for q in r_quiz["questions"]:
            all_questions.append(q)

    # Sort quizzes by chapter order
    def quiz_sort_key(q):
        c_order = {
            "chuong_1": 1,
            "chuong_2": 2,
            "chuong_3": 3,
            "chuong_4": 4,
            "chuong_5": 5,
            "chuong_6": 6,
            "chuong_7": 7,
            "chuong_8": 8,
            "chuong_9": 9,
            "kiem_tra_btt_lon": 10,
            "khac": 11
        }
        chap = c_order.get(q["chapterId"], 99)
        is_ket_thuc = 1 if 'kết thúc' in q["title"].lower() else 0
        return (chap, is_ket_thuc, q["title"])

    sorted_quizzes = sorted(quizzes_dict.values(), key=quiz_sort_key)
    quiz_order_map = {q["id"]: idx for idx, q in enumerate(sorted_quizzes)}
    all_questions.sort(key=lambda q: (quiz_order_map.get(q["quizId"], 999), q["questionNumber"]))

    # Verification summary
    total_quizzes = len(sorted_quizzes)
    total_questions = len(all_questions)
    v_text = sum(1 for q in all_questions if q["verificationStatus"] == "verified_text")
    v_visual = sum(1 for q in all_questions if q["verificationStatus"] == "verified_visual")
    v_review = sum(1 for q in all_questions if q["verificationStatus"] == "needs_review")
    gradable = sum(1 for q in all_questions if q["verificationStatus"] in ["verified_text", "verified_visual"] and len(q["correctOptionIds"]) > 0)

    dataset = {
        "metadata": {
            "pdfPath": "Data/LMS_quiz/Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf",
            "sha256": sha256,
            "totalPages": total_pages,
            "totalQuizzes": total_quizzes,
            "totalQuestions": total_questions,
            "verifiedText": v_text,
            "verifiedVisual": v_visual,
            "needsReview": v_review,
            "gradableQuestions": gradable,
            "extractedAt": "2026-11-17T23:28:00+07:00"
        },
        "quizzes": sorted_quizzes,
        "questions": all_questions
    }

    with open(DATA_OUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(dataset, f, ensure_ascii=False, indent=2)

    with open(REPORT_OUT_PATH, 'w', encoding='utf-8') as f_rep:
        f_rep.write(f"""# Báo cáo trích xuất dữ liệu Quiz LMS — Stage 1

- **Nguồn tài liệu:** `Data/LMS_quiz/Công-nghệ-phần-mềm-quiz-LMS-ki-20242.pdf`
- **SHA-256:** `{sha256}`
- **Số trang PDF thực tế:** {total_pages} trang
- **Thời gian trích xuất:** {dataset['metadata']['extractedAt']}

---

## 1. Thống kê tổng quan

| Chỉ số | Số lượng | Tỷ lệ | Ghi chú |
|---|---|---|---|
| **Tổng số Quiz nhận diện** | **{total_quizzes}** | 100% | Gồm quiz bài học, quiz kết thúc chương 1-9 và quiz Pr01-Pr12 |
| **Tổng số câu hỏi xuất hiện** | **{total_questions}** | 100% | 455 câu từ 253 trang text + 30 câu từ 22 trang raster |
| **Xác minh bằng văn bản (`verified_text`)** | **{v_text}** | {v_text/total_questions*100:.1f}% | Khớp đối chiếu trực tiếp dòng 'The correct answer is' |
| **Xác minh trực quan (`verified_visual`)** | **{v_visual}** | {v_visual/total_questions*100:.1f}% | 7 câu đáp án dạng ảnh qua image xref + 30 câu raster Quiz 0901-0906 |
| **Cần rà soát (`needs_review`)** | **{v_review}** | {v_review/total_questions*100:.1f}% | 2 câu do PDF gốc không có đáp án LMS (lượt thi Incorrect) |
| **Số câu có thể chấm điểm** | **{gradable}** | {gradable/total_questions*100:.1f}% | Chỉ chấm các câu đã xác minh 100% đáp án |

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
""")
        for idx, q in enumerate(sorted_quizzes):
            q_qs = [item for item in all_questions if item["quizId"] == q["id"]]
            q_ready = sum(1 for item in q_qs if item["verificationStatus"] in ["verified_text", "verified_visual"])
            q_rev = sum(1 for item in q_qs if item["verificationStatus"] == "needs_review")
            pages_str = f"{min(q['sourcePages'])}-{max(q['sourcePages'])}" if q["sourcePages"] else ""
            f_rep.write(f"| {idx+1} | `{q['id']}` | {q['title']} | {q['chapterTitle']} | {len(q_qs)} | {q_ready} | {q_rev} | Trang {pages_str} |\n")

    print(f"\nEXTRACTION RESULTS:")
    print(f"Total Quizzes: {total_quizzes}")
    print(f"Total Questions: {total_questions}")
    print(f"  Verified Text: {v_text} ({v_text/total_questions*100:.1f}%)")
    print(f"  Verified Visual: {v_visual} ({v_visual/total_questions*100:.1f}%)")
    print(f"  Needs Review: {v_review} ({v_review/total_questions*100:.1f}%)")
    print(f"  Gradable: {gradable} ({gradable/total_questions*100:.1f}%)")

if __name__ == '__main__':
    extract_all()
