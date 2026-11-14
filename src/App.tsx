import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {
  Home,
  BookOpen,
  Trophy,
  Users,
  Send,
  Heart,
  FileText,
  HelpCircle,
  Shield,
  Activity,
  Plus,
  Server,
  Code2,
  CheckCircle2,
  XCircle,
  Terminal,
} from 'lucide-react';

type TabType =
  | 'home'
  | 'problems'
  | 'contests'
  | 'organizations'
  | 'submissions'
  | 'about'
  | 'blogs'
  | 'wiki'
  | 'admin';

interface Problem {
  id: string;
  code: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  mode: 'Standard' | 'CustomChecker' | 'Interactive';
  timeLimitMs: number;
  memoryLimitMb: number;
  statement: string;
}

interface Submission {
  id: string;
  user: string;
  problemCode: string;
  language: string;
  verdict: string;
  timeMs: number;
  memoryKb: number;
  submittedAt: string;
}

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [apiStatus, setApiStatus] = useState<string>('Checking...');
  const [verdicts, setVerdicts] = useState<string[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [submissionCode, setSubmissionCode] = useState<string>('// Solution here');
  const [selectedLang, setSelectedLang] = useState<string>('cpp20');

  useEffect(() => {
    fetch('/health')
      .then((res) => res.text())
      .then((data) => setApiStatus(`Online (${data})`))
      .catch(() => setApiStatus('Offline'));

    fetch('/api/v1/verdicts')
      .then((res) => res.json())
      .then((data) => setVerdicts(data))
      .catch(() => setVerdicts([]));
  }, []);

  const sampleProblems: Problem[] = [
    {
      id: 'p-1001',
      code: 'P1001',
      title: 'A + B Problem',
      difficulty: 'Easy',
      mode: 'Standard',
      timeLimitMs: 1000,
      memoryLimitMb: 256,
      statement: `### Bài toán A + B
Cho hai số nguyên $a, b \\in \\mathbb{Z}$ thỏa mãn $-10^9 \\le a, b \\le 10^9$. Hãy tính giá trị của tổng $S = a + b$.

**Định dạng đầu vào:** Một dòng duy nhất chứa hai số nguyên $a$ và $b$ cách nhau bởi khoảng trắng.

**Định dạng đầu ra:** In ra một số nguyên duy nhất là kết quả của $a + b$.

**Ví dụ:**
- Đầu vào: \`3 5\`
- Đầu ra: \`8\`
`,
    },
    {
      id: 'p-1002',
      code: 'P1002',
      title: 'Dãy số Fibonacci modulo $10^9+7$',
      difficulty: 'Medium',
      mode: 'Standard',
      timeLimitMs: 1500,
      memoryLimitMb: 512,
      statement: `### Dãy số Fibonacci
Cho số nguyên dương $n$ ($1 \\le n \\le 10^{18}$). Hãy tính số Fibonacci thứ $n$:
$$ F_0 = 0, \\quad F_1 = 1, \\quad F_n = F_{n-1} + F_{n-2} \\pmod{10^9+7} $$

**Định dạng đầu vào:** Một dòng chứa số nguyên $n$.

**Định dạng đầu ra:** Kết quả $F_n \\pmod{10^9+7}$.
`,
    },
    {
      id: 'p-1003',
      code: 'P1003',
      title: 'Đoán số bí mật (Interactive)',
      difficulty: 'Hard',
      mode: 'Interactive',
      timeLimitMs: 2000,
      memoryLimitMb: 256,
      statement: `### Đoán số bí mật
Hệ thống giám khảo giữ một số nguyên bí mật $X \\in [1, 10^9]$. Bạn được phép thực hiện tối đa $32$ truy vấn dạng:
\`? Y\` (với $1 \\le Y \\le 10^9$).

Giám khảo sẽ phản hồi:
- \`<\`: nếu $X < Y$
- \`>\`: nếu $X > Y$
- \`=\`: nếu $X = Y$

Sau khi tìm được, in ra \`! X\` và kết thúc chương trình. Chú ý luôn dùng \`fflush(stdout)\` hoặc \`std::cout << std::flush\`.
`,
    },
  ];

  const sampleSubmissions: Submission[] = [
    {
      id: 'sub-8921',
      user: 'toiyeuyuriiiii',
      problemCode: 'P1001',
      language: 'C++20',
      verdict: 'ACCEPTED',
      timeMs: 15,
      memoryKb: 1420,
      submittedAt: 'Vừa xong',
    },
    {
      id: 'sub-8920',
      user: 'nmkdeveloper',
      problemCode: 'P1003',
      language: 'Python3',
      verdict: 'ACCEPTED',
      timeMs: 42,
      memoryKb: 8900,
      submittedAt: '2 phút trước',
    },
    {
      id: 'sub-8919',
      user: 'coder_guest',
      problemCode: 'P1002',
      language: 'Pascal',
      verdict: 'TIME_LIMIT_EXCEEDED',
      timeMs: 1510,
      memoryKb: 3200,
      submittedAt: '5 phút trước',
    },
  ];

  const apiRoutesCatalog = [
    { method: 'GET', path: '/health', handler: 'tyyoj_backend::health_check', desc: 'Trạng thái hoạt động server' },
    { method: 'GET', path: '/api/v1/verdicts', handler: 'tyyoj_backend::list_verdicts', desc: 'Danh sách các verdict judging' },
    { method: 'POST', path: '/api/v1/auth/register', handler: 'tyyoj_backend::auth::register', desc: 'Đăng ký tài khoản người dùng' },
    { method: 'POST', path: '/api/v1/auth/login', handler: 'tyyoj_backend::auth::login', desc: 'Xác thực và cấp phát JWT token' },
    { method: 'GET', path: '/api/v1/problems', handler: 'tyyoj_backend::problem::list', desc: 'Lấy danh sách bài tập' },
    { method: 'GET', path: '/api/v1/problems/{id}', handler: 'tyyoj_backend::problem::get', desc: 'Chi tiết bài tập (Markdown + KaTeX)' },
    { method: 'POST', path: '/api/v1/submissions', handler: 'tyyoj_backend::submission::create', desc: 'Nộp bài giải và xếp hàng Redis' },
    { method: 'GET', path: '/api/v1/admin/judgers', handler: 'tyyoj_backend::docker::list_workers', desc: 'Quản lý danh sách Judger Podman' },
    { method: 'POST', path: '/api/v1/admin/judgers', handler: 'tyyoj_backend::docker::create_worker', desc: 'Khởi tạo persistent Judger container' },
  ];

  const activeProblem = selectedProblem || sampleProblems[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Navbar Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-9 h-9 bg-sky-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-xs">
                Y
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  Toi Yêu Yuri <span className="text-sky-600">Online Judge</span>
                </span>
                <span className="block text-[11px] text-slate-500 font-mono -mt-1">tyyoj v0.1.0</span>
              </div>
            </div>

            {/* Nav Menu */}
            <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3 py-2 rounded-md flex items-center gap-1.5 transition ${
                  activeTab === 'home' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Home className="w-4 h-4" /> Trang chủ
              </button>
              <button
                onClick={() => setActiveTab('problems')}
                className={`px-3 py-2 rounded-md flex items-center gap-1.5 transition ${
                  activeTab === 'problems' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4" /> Bài tập
              </button>
              <button
                onClick={() => setActiveTab('contests')}
                className={`px-3 py-2 rounded-md flex items-center gap-1.5 transition ${
                  activeTab === 'contests' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Trophy className="w-4 h-4" /> Kỳ thi
              </button>
              <button
                onClick={() => setActiveTab('organizations')}
                className={`px-3 py-2 rounded-md flex items-center gap-1.5 transition ${
                  activeTab === 'organizations' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Users className="w-4 h-4" /> Tổ chức
              </button>
              <button
                onClick={() => setActiveTab('submissions')}
                className={`px-3 py-2 rounded-md flex items-center gap-1.5 transition ${
                  activeTab === 'submissions' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Send className="w-4 h-4" /> Bài nộp
              </button>
              <button
                onClick={() => setActiveTab('blogs')}
                className={`px-3 py-2 rounded-md flex items-center gap-1.5 transition ${
                  activeTab === 'blogs' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4" /> Blogs
              </button>
              <button
                onClick={() => setActiveTab('wiki')}
                className={`px-3 py-2 rounded-md flex items-center gap-1.5 transition ${
                  activeTab === 'wiki' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <HelpCircle className="w-4 h-4" /> Wiki
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`px-3 py-2 rounded-md flex items-center gap-1.5 transition ${
                  activeTab === 'about' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Heart className="w-4 h-4" /> Về chúng mình
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`ml-2 px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-semibold border ${
                  activeTab === 'admin'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                }`}
              >
                <Shield className="w-3.5 h-3.5" /> Quản trị Admin
              </button>
            </nav>

            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
                <Activity className="w-3 h-3 text-emerald-600" />
                API: {apiStatus}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* VIEW: Trang chủ (Home) */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 mb-4">
                  🚀 Hệ thống Online Judge thế hệ mới
                </span>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
                  Nền tảng chấm bài Lập trình thi đấu an toàn, tin cậy &amp; tốc độ
                </h1>
                <p className="mt-4 text-base text-slate-600 leading-relaxed">
                  Toi Yêu Yuri Online Judge cung cấp hệ thống worker chấm mã nguồn độc lập chạy liên tục trên Podman,
                  hỗ trợ định dạng toán học phong phú với Markdown + KaTeX, cùng 3 chế độ chấm toàn diện: Standard,
                  Custom Checker (testlib.h) và Interactive pipe judging.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('problems')}
                    className="px-5 py-2.5 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 shadow-xs flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" /> Bắt đầu giải bài
                  </button>
                  <button
                    onClick={() => setActiveTab('contests')}
                    className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 flex items-center gap-2"
                  >
                    <Trophy className="w-4 h-4" /> Xem kỳ thi
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-lg border border-slate-200">
                <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">Bài tập</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">128+</div>
                <div className="text-emerald-600 text-xs mt-1">C++, Pascal, Python3</div>
              </div>
              <div className="bg-white p-5 rounded-lg border border-slate-200">
                <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">Kỳ thi</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">12</div>
                <div className="text-sky-600 text-xs mt-1">ICPC &amp; IOI Rule</div>
              </div>
              <div className="bg-white p-5 rounded-lg border border-slate-200">
                <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">Bài nộp</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">8,921</div>
                <div className="text-slate-500 text-xs mt-1">Live queue via Redis</div>
              </div>
              <div className="bg-white p-5 rounded-lg border border-slate-200">
                <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">Podman Judgers</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">4 Online</div>
                <div className="text-emerald-600 text-xs mt-1">Persistent workers</div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: Bài tập (Problems) */}
        {activeTab === 'problems' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Problem List (col-4) */}
            <div className="lg:col-span-4 space-y-3">
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <h3 className="font-semibold text-slate-900 text-sm mb-3">Danh sách bài tập</h3>
                <div className="space-y-2">
                  {sampleProblems.map((prob) => (
                    <div
                      key={prob.id}
                      onClick={() => setSelectedProblem(prob)}
                      className={`p-3 rounded-md border cursor-pointer transition ${
                        activeProblem.id === prob.id
                          ? 'border-sky-500 bg-sky-50/50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono font-bold text-sky-700">{prob.code}</span>
                        <span className="text-slate-500">{prob.mode}</span>
                      </div>
                      <div className="font-medium text-slate-900 text-sm mt-1">{prob.title}</div>
                      <div className="flex gap-2 text-xs text-slate-500 mt-2">
                        <span>{prob.timeLimitMs}ms</span>
                        <span>&bull;</span>
                        <span>{prob.memoryLimitMb}MB</span>
                        <span>&bull;</span>
                        <span
                          className={`font-semibold ${
                            prob.difficulty === 'Easy'
                              ? 'text-emerald-600'
                              : prob.difficulty === 'Medium'
                              ? 'text-amber-600'
                              : 'text-red-600'
                          }`}
                        >
                          {prob.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Problem Detail & Submission (col-8) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <div className="flex justify-between items-start border-b border-slate-200 pb-4 mb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-sky-600">{activeProblem.code}</span>
                    <h2 className="text-xl font-bold text-slate-900">{activeProblem.title}</h2>
                  </div>
                  <div className="text-right text-xs text-slate-500 font-mono">
                    <div>Giới hạn thời gian: <strong className="text-slate-800">{activeProblem.timeLimitMs} ms</strong></div>
                    <div>Giới hạn bộ nhớ: <strong className="text-slate-800">{activeProblem.memoryLimitMb} MB</strong></div>
                    <div>Chế độ chấm: <strong className="text-slate-800">{activeProblem.mode}</strong></div>
                  </div>
                </div>

                <div className="prose max-w-none text-slate-700 text-sm leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {activeProblem.statement}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Code Submission Box */}
              <div className="bg-white p-6 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-sky-600" /> Nộp bài giải
                  </h3>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-500 font-medium">Ngôn ngữ:</label>
                    <select
                      value={selectedLang}
                      onChange={(e) => setSelectedLang(e.target.value)}
                      className="text-xs border border-slate-300 rounded px-2.5 py-1 bg-white font-mono"
                    >
                      <option value="cpp20">C++20 (g++ -std=c++20 -O2)</option>
                      <option value="pascal">Pascal (fpc -O2)</option>
                      <option value="python3">Python 3 (python3 / pypy3)</option>
                    </select>
                  </div>
                </div>

                <textarea
                  value={submissionCode}
                  onChange={(e) => setSubmissionCode(e.target.value)}
                  rows={8}
                  className="w-full font-mono text-xs p-3 bg-slate-900 text-slate-100 rounded border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                  placeholder="Dán mã nguồn tại đây..."
                />

                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => {
                      alert(`Đã nộp bài cho ${activeProblem.code} (${selectedLang}) thành công!`);
                      setActiveTab('submissions');
                    }}
                    className="px-4 py-2 bg-sky-600 text-white rounded font-medium text-xs hover:bg-sky-700 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Gửi bài chấm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: Kỳ thi (Contests) */}
        {activeTab === 'contests' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Kỳ thi lập trình thi đấu</h2>
              <p className="text-slate-500 text-sm mt-1">Tham gia các kỳ thi chính thức theo thể thức ICPC và IOI.</p>

              <div className="mt-6 divide-y divide-slate-200">
                <div className="py-4 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Đang diễn ra</span>
                    <h3 className="text-base font-semibold text-slate-900 mt-1">Toi Yêu Yuri Contest 01 (ICPC Rules)</h3>
                    <p className="text-xs text-slate-500 mt-1">Thời gian: 180 phút &bull; 6 bài tập &bull; 142 thí sinh tham gia</p>
                  </div>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700">
                    Vào thi ngay
                  </button>
                </div>

                <div className="py-4 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-100 text-sky-800">Sắp diễn ra</span>
                    <h3 className="text-base font-semibold text-slate-900 mt-1">Yuri Grand Contest #2 (IOI Rules)</h3>
                    <p className="text-xs text-slate-500 mt-1">Bắt đầu: 19:00 Chủ Nhật &bull; 300 phút &bull; Chấm điểm theo subtask</p>
                  </div>
                  <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded text-xs font-semibold hover:bg-slate-200">
                    Đăng ký tham gia
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: Tổ chức (Organizations) */}
        {activeTab === 'organizations' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Các câu lạc bộ &amp; Tổ chức đối tác</h2>
              <p className="text-slate-500 text-sm mt-1">Nơi kết nối các trường đại học, trường chuyên và cộng đồng thuật toán.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                  <div className="font-bold text-slate-900 text-base">VNOI Community</div>
                  <p className="text-xs text-slate-600 mt-1">Cộng đồng Lập trình Thi đấu Việt Nam</p>
                  <div className="text-xs text-slate-500 mt-3 font-mono">15,000+ thành viên &bull; 240 kỳ thi</div>
                </div>

                <div className="p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                  <div className="font-bold text-slate-900 text-base">VNU-UET Algorithms Club</div>
                  <p className="text-xs text-slate-600 mt-1">Đại học Công nghệ - ĐHQGHN</p>
                  <div className="text-xs text-slate-500 mt-3 font-mono">450+ thành viên &bull; 18 kỳ thi</div>
                </div>

                <div className="p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                  <div className="font-bold text-slate-900 text-base">Yuri CP Enthusiasts</div>
                  <p className="text-xs text-slate-600 mt-1">CLB Lập trình thi đấu Toi Yêu Yuri</p>
                  <div className="text-xs text-slate-500 mt-3 font-mono">1,200+ thành viên &bull; 12 kỳ thi</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: Bài nộp (Submissions) */}
        {activeTab === 'submissions' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-900">Danh sách bài nộp gần đây</h2>
                <span className="text-xs text-slate-500 font-mono">Cập nhật theo thời gian thực qua Redis</span>
              </div>

              <div className="border border-slate-200 rounded overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Mã nộp</th>
                      <th className="p-3">Người nộp</th>
                      <th className="p-3">Bài tập</th>
                      <th className="p-3">Ngôn ngữ</th>
                      <th className="p-3">Kết quả (Verdict)</th>
                      <th className="p-3">Thời gian</th>
                      <th className="p-3">Bộ nhớ</th>
                      <th className="p-3">Thời điểm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {sampleSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-medium text-slate-900">{sub.id}</td>
                        <td className="p-3 font-medium text-sky-600">{sub.user}</td>
                        <td className="p-3 font-bold font-mono">{sub.problemCode}</td>
                        <td className="p-3">{sub.language}</td>
                        <td className="p-3">
                          {sub.verdict === 'ACCEPTED' ? (
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                              <CheckCircle2 className="w-3.5 h-3.5" /> ACCEPTED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-bold text-red-600">
                              <XCircle className="w-3.5 h-3.5" /> {sub.verdict}
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-mono">{sub.timeMs} ms</td>
                        <td className="p-3 font-mono">{sub.memoryKb} KB</td>
                        <td className="p-3 text-slate-500">{sub.submittedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Supported Verdicts list */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Các trạng thái verdict hỗ trợ: </span>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {verdicts.map((v) => (
                    <span key={v} className="bg-slate-100 text-slate-700 text-[11px] font-mono px-2 py-0.5 rounded border border-slate-200">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: Về chúng mình (About Us) */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-lg border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">Về dự án Toi Yêu Yuri Online Judge</h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                <strong>Toi Yêu Yuri Online Judge (`tyyoj`)</strong> là nền tảng chấm bài trực tuyến chuyên dụng cho Lập trình Thi đấu
                được thiết kế theo tiêu chí <strong>Safety &gt; Performance &gt; Standard</strong>.
              </p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 border border-slate-200 rounded-lg bg-slate-50/50">
                  <h3 className="font-bold text-slate-900 text-sm">Nhóm Tác giả &amp; Bản quyền</h3>
                  <ul className="text-xs text-slate-600 mt-2 space-y-1">
                    <li>&bull; <strong>Tác giả:</strong> toiyeuyuriiiii &amp; nmkdeveloper</li>
                    <li>&bull; <strong>Bản quyền:</strong> &copy; 2026 Toi Yêu Yuri Online Judge</li>
                    <li>&bull; <strong>Giấy phép:</strong> MIT License (Mã nguồn mở công khai)</li>
                  </ul>
                </div>

                <div className="p-5 border border-slate-200 rounded-lg bg-slate-50/50">
                  <h3 className="font-bold text-slate-900 text-sm">Hạ tầng Công nghệ</h3>
                  <ul className="text-xs text-slate-600 mt-2 space-y-1">
                    <li>&bull; <strong>Core API:</strong> Rust (Axum, Tokio, SQLx, Lettre, Bollard)</li>
                    <li>&bull; <strong>Hộp cát (Sandbox):</strong> C++20 Linux namespaces, cgroups v2, seccomp</li>
                    <li>&bull; <strong>Quản lý Worker:</strong> Podman Engine Socket API (`podman.sock`)</li>
                    <li>&bull; <strong>Giao diện:</strong> React 19 + TypeScript + Vite + TailwindCSS</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: Blogs */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Bài viết &amp; Tin tức (Blogs)</h2>
              <div className="mt-6 space-y-4">
                <article className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition">
                  <div className="text-xs text-slate-500">14 Tháng 11, 2026 &bull; bởi toiyeuyuriiiii</div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">Chào mừng bạn đến với Toi Yêu Yuri Online Judge</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Giới thiệu nền tảng chấm bài thi đấu trực tuyến hoàn toàn mới với kiến trúc Podman daemon và hỗ trợ đầy đủ công thức toán KaTeX.
                  </p>
                </article>

                <article className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition">
                  <div className="text-xs text-slate-500">12 Tháng 11, 2026 &bull; bởi nmkdeveloper</div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">Kỹ thuật giải bài tập tương tác (Interactive Problems)</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Hướng dẫn chi tiết cách đọc/ghi qua đường ống (POSIX pipes) và cách phòng tránh lỗi quá thời gian nhàn rỗi (IDLENESS_LIMIT_EXCEEDED).
                  </p>
                </article>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: Wiki */}
        {activeTab === 'wiki' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Cẩm nang &amp; Tài liệu Wiki</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 border border-slate-200 rounded-lg">
                  <h3 className="font-bold text-sm text-slate-900">1. Quy chuẩn biên dịch (Compiler Flags)</h3>
                  <ul className="text-xs text-slate-600 mt-2 space-y-1 font-mono">
                    <li>&bull; C++20: g++ -std=c++20 -O2</li>
                    <li>&bull; Free Pascal: fpc -O2</li>
                    <li>&bull; Python: python3 / pypy3</li>
                  </ul>
                </div>

                <div className="p-4 border border-slate-200 rounded-lg">
                  <h3 className="font-bold text-sm text-slate-900">2. Ba chế độ chấm (Judge Modes)</h3>
                  <ul className="text-xs text-slate-600 mt-2 space-y-1">
                    <li>&bull; <strong>Standard:</strong> So khớp token diff chuẩn.</li>
                    <li>&bull; <strong>Custom Checker:</strong> Chấm bằng file testlib.h.</li>
                    <li>&bull; <strong>Interactive:</strong> Giao tiếp 2 chiều qua pipe.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: Quản trị Admin (Admin Dashboard: Routes, APIs, Podman Judgers) */}
        {activeTab === 'admin' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg border border-purple-200 shadow-xs">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-600" /> Trung tâm Quản trị Toàn diện (Admin Dashboard)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Giám sát toàn bộ API endpoints, điều phối router và quản lý đội ngũ worker Podman Judger.
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-md">
                  Administrator Mode
                </span>
              </div>

              {/* SECTION: Route & API Management */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-purple-600" /> Quản lý Danh mục Route &amp; API Endpoints
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">Unified Domain: /api/v1/*</span>
                </div>

                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Phương thức</th>
                        <th className="p-2.5">Đường dẫn Route</th>
                        <th className="p-2.5">Mô tả chức năng</th>
                        <th className="p-2.5">Handler nội bộ</th>
                        <th className="p-2.5">Trạng thái</th>
                        <th className="p-2.5 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {apiRoutesCatalog.map((r, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono font-bold">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] ${
                                r.method === 'GET'
                                  ? 'bg-blue-100 text-blue-800'
                                  : r.method === 'POST'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {r.method}
                            </span>
                          </td>
                          <td className="p-2.5 font-mono text-slate-900 font-medium">{r.path}</td>
                          <td className="p-2.5 text-slate-600">{r.desc}</td>
                          <td className="p-2.5 font-mono text-[11px] text-slate-500">{r.handler}</td>
                          <td className="p-2.5">
                            <span className="text-emerald-700 font-semibold text-[11px]">ACTIVE</span>
                          </td>
                          <td className="p-2.5 text-right">
                            <button
                              onClick={() => {
                                fetch(r.path.replace('{id}', 'test'))
                                  .then((res) => alert(`Test ${r.path} -> HTTP ${res.status}`))
                                  .catch((err) => alert(`Test ${r.path} -> ${err.message}`));
                              }}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium"
                            >
                              Kiểm tra
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION: Podman Judger Fleet Management */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-purple-600" /> Quản lý Hạm đội Judger Podman (Persistent Workers)
                  </h3>
                  <button
                    onClick={() => alert('Yêu cầu khởi tạo Judger mới đã gửi tới Podman Engine socket!')}
                    className="px-3 py-1.5 bg-purple-600 text-white rounded text-xs font-semibold hover:bg-purple-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm Worker Judger
                  </button>
                </div>

                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Worker ID</th>
                        <th className="p-2.5">Container ID</th>
                        <th className="p-2.5">Trạng thái</th>
                        <th className="p-2.5">Heartbeat</th>
                        <th className="p-2.5">Tải CPU / RAM</th>
                        <th className="p-2.5 text-right">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-2.5 font-mono font-medium text-slate-900">judger-persistent-01</td>
                        <td className="p-2.5 font-mono text-[11px] text-slate-500">podman-c102a9ff</td>
                        <td className="p-2.5">
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ONLINE
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-600 text-[11px]">Vừa xong (5s/lần)</td>
                        <td className="p-2.5 font-mono text-[11px]">CPU: 0.2% &bull; 64MB</td>
                        <td className="p-2.5 text-right">
                          <button
                            onClick={() => alert('Đã gửi tín hiệu dừng tới worker judger-persistent-01!')}
                            className="text-red-600 hover:text-red-800 font-medium text-[11px]"
                          >
                            Dừng worker
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            &copy; 2026 <strong>Toi Yêu Yuri Online Judge</strong> (toiyeuyuriiiii &amp; nmkdeveloper) &bull; MIT License
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-slate-600">Light Mode</span>
            <span>&bull;</span>
            <span className="text-slate-600">Nginx Port 80 Proxy</span>
            <span>&bull;</span>
            <span className="text-slate-600">Podman Engine API</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
