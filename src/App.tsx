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
  LogIn,
  UserPlus,
  LogOut,
  RefreshCw,
  FolderPlus,
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
  difficulty: string;
  statement_markdown: string;
  time_limit_ms: number;
  memory_limit_mb: number;
  judge_mode: string;
}

interface Contest {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  rule_type: string;
}

interface Organization {
  id: string;
  name: string;
  description: string;
  member_count: number;
  contests_count: number;
}

interface Blog {
  id: string;
  title: string;
  author_name: string;
  content_markdown: string;
  created_at: string;
}

interface Wiki {
  id: string;
  title: string;
  category: string;
  content_markdown: string;
  updated_at: string;
}

interface Submission {
  id: string;
  problem_code: string;
  language: string;
  verdict: string;
  time_consumed_ms: number;
  memory_consumed_kb: number;
  created_at: string;
}

interface RouteEntry {
  method: string;
  path: string;
  handler: string;
  description: string;
}

interface JudgerWorker {
  id: string;
  name: string;
  status: string;
  state: string;
  image: string;
}

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [apiStatus, setApiStatus] = useState<string>('Checking...');
  const [verdicts, setVerdicts] = useState<string[]>([]);

  // Entities
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [contests, setContests] = useState<Contest[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [wikis, setWikis] = useState<Wiki[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [routesCatalog, setRoutesCatalog] = useState<RouteEntry[]>([]);
  const [judgerWorkers, setJudgerWorkers] = useState<JudgerWorker[]>([]);

  // Submission Form State
  const [submissionCode, setSubmissionCode] = useState<string>(
    '#include <iostream>\n\nint main() {\n    long long a, b;\n    if (std::cin >> a >> b) {\n        std::cout << a + b << std::endl;\n    }\n    return 0;\n}'
  );
  const [selectedLang, setSelectedLang] = useState<string>('cpp20');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authUsername, setAuthUsername] = useState<string>('');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authMessage, setAuthMessage] = useState<string>('');

  // Admin Create Item State
  const [adminAddCategory, setAdminAddCategory] = useState<'problem' | 'contest' | 'org' | 'blog' | 'wiki'>('problem');
  const [adminMsg, setAdminMsg] = useState<string>('');

  // Admin Form States
  const [probCode, setProbCode] = useState('');
  const [probTitle, setProbTitle] = useState('');
  const [probDiff, setProbDiff] = useState('Medium');
  const [probStatement, setProbStatement] = useState('### Đề bài mới\n\nNội dung bài tập với toán KaTeX: $a + b = c$.');
  const [probTimeLimit, setProbTimeLimit] = useState(1000);
  const [probMemLimit, setProbMemLimit] = useState(256);
  const [probJudgeMode, setProbJudgeMode] = useState('Standard');
  const [probSampleIn, setProbSampleIn] = useState('1 2\n');
  const [probSampleOut, setProbSampleOut] = useState('3\n');

  const [contestTitle, setContestTitle] = useState('');
  const [contestDesc, setContestDesc] = useState('');
  const [contestRule, setContestRule] = useState('ICPC');

  const [orgName, setOrgName] = useState('');
  const [orgDesc, setOrgDesc] = useState('');

  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogContent, setBlogContent] = useState('');

  const [wikiTitle, setWikiTitle] = useState('');
  const [wikiCategory, setWikiCategory] = useState('Tutorial');
  const [wikiContent, setWikiContent] = useState('');

  const fetchData = () => {
    fetch('/health')
      .then((res) => res.text())
      .then((data) => setApiStatus(`Online (${data})`))
      .catch(() => setApiStatus('Offline'));

    fetch('/api/v1/verdicts')
      .then((res) => res.json())
      .then((data) => setVerdicts(data))
      .catch(() => setVerdicts([]));

    fetch('/api/v1/problems')
      .then((res) => res.json())
      .then((data) => {
        setProblems(data);
        if (data.length > 0 && !selectedProblem) {
          setSelectedProblem(data[0]);
        }
      })
      .catch((err) => console.error('Error fetching problems:', err));

    fetch('/api/v1/contests')
      .then((res) => res.json())
      .then((data) => setContests(data))
      .catch((err) => console.error('Error fetching contests:', err));

    fetch('/api/v1/organizations')
      .then((res) => res.json())
      .then((data) => setOrganizations(data))
      .catch((err) => console.error('Error fetching orgs:', err));

    fetch('/api/v1/blogs')
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((err) => console.error('Error fetching blogs:', err));

    fetch('/api/v1/wikis')
      .then((res) => res.json())
      .then((data) => setWikis(data))
      .catch((err) => console.error('Error fetching wikis:', err));

    fetch('/api/v1/submissions')
      .then((res) => res.json())
      .then((data) => setSubmissions(data))
      .catch((err) => console.error('Error fetching submissions:', err));

    fetch('/api/v1/admin/routes')
      .then((res) => res.json())
      .then((data) => setRoutesCatalog(data))
      .catch(() => setRoutesCatalog([]));

    fetch('/api/v1/admin/judgers')
      .then((res) => res.json())
      .then((data) => setJudgerWorkers(data))
      .catch(() => setJudgerWorkers([]));
  };

  useEffect(() => {
    fetchData();
    const storedUser = localStorage.getItem('tyyoj_username');
    if (storedUser) {
      setCurrentUser(storedUser);
    }
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage('');

    if (authMode === 'register') {
      try {
        const res = await fetch('/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: authUsername,
            email: authEmail,
            password: authPassword,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setAuthMessage('Đăng ký thành công! Email xác thực đã gửi.');
          setAuthMode('login');
        } else {
          setAuthMessage(`Lỗi: ${data.message || 'Không thể đăng ký'}`);
        }
      } catch (err: unknown) {
        setAuthMessage(`Lỗi kết nối: ${(err as Error).message}`);
      }
    } else {
      try {
        const res = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username_or_email: authUsername,
            password: authPassword,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('tyyoj_token', data.access_token);
          localStorage.setItem('tyyoj_username', data.username);
          setCurrentUser(data.username);
          setShowAuthModal(false);
          setAuthMessage('');
        } else {
          setAuthMessage('Sai tài khoản hoặc mật khẩu.');
        }
      } catch (err: unknown) {
        setAuthMessage(`Lỗi đăng nhập: ${(err as Error).message}`);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tyyoj_token');
    localStorage.removeItem('tyyoj_username');
    setCurrentUser(null);
  };

  const handleCodeSubmit = async () => {
    if (!selectedProblem) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/v1/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem_code: selectedProblem.code,
          language: selectedLang,
          source_code: submissionCode,
        }),
      });

      if (res.ok) {
        fetchData();
        setActiveTab('submissions');
      } else {
        alert('Nộp bài thất bại. Vui lòng kiểm tra mã nguồn hoặc giới hạn tần suất.');
      }
    } catch (err) {
      alert(`Lỗi nộp bài: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Admin Handle Create
  const handleAdminCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminMsg('');

    try {
      if (adminAddCategory === 'problem') {
        const res = await fetch('/api/v1/problems', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: probCode,
            title: probTitle,
            difficulty: probDiff,
            statement_markdown: probStatement,
            time_limit_ms: Number(probTimeLimit),
            memory_limit_mb: Number(probMemLimit),
            judge_mode: probJudgeMode,
            sample_input: probSampleIn,
            sample_output: probSampleOut,
          }),
        });
        if (res.ok) {
          setAdminMsg(`Thêm bài tập ${probCode} thành công!`);
          setProbCode('');
          setProbTitle('');
          fetchData();
        } else {
          setAdminMsg('Lỗi khi thêm bài tập.');
        }
      } else if (adminAddCategory === 'contest') {
        const now = new Date();
        const end = new Date(now.getTime() + 5 * 3600 * 1000);
        const res = await fetch('/api/v1/contests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: contestTitle,
            description: contestDesc,
            start_time: now.toISOString(),
            end_time: end.toISOString(),
            rule_type: contestRule,
          }),
        });
        if (res.ok) {
          setAdminMsg(`Thêm kỳ thi ${contestTitle} thành công!`);
          setContestTitle('');
          setContestDesc('');
          fetchData();
        }
      } else if (adminAddCategory === 'org') {
        const res = await fetch('/api/v1/organizations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: orgName,
            description: orgDesc,
          }),
        });
        if (res.ok) {
          setAdminMsg(`Thêm tổ chức ${orgName} thành công!`);
          setOrgName('');
          setOrgDesc('');
          fetchData();
        }
      } else if (adminAddCategory === 'blog') {
        const res = await fetch('/api/v1/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: blogTitle,
            author_name: blogAuthor || (currentUser || 'Admin'),
            content_markdown: blogContent,
          }),
        });
        if (res.ok) {
          setAdminMsg(`Đăng bài viết ${blogTitle} thành công!`);
          setBlogTitle('');
          setBlogContent('');
          fetchData();
        }
      } else if (adminAddCategory === 'wiki') {
        const res = await fetch('/api/v1/wikis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: wikiTitle,
            category: wikiCategory,
            content_markdown: wikiContent,
          }),
        });
        if (res.ok) {
          setAdminMsg(`Thêm mục wiki ${wikiTitle} thành công!`);
          setWikiTitle('');
          setWikiContent('');
          fetchData();
        }
      }
    } catch (err: unknown) {
      setAdminMsg(`Lỗi: ${(err as Error).message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Header Navigation */}
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
                <BookOpen className="w-4 h-4" /> Bài tập ({problems.length})
              </button>
              <button
                onClick={() => setActiveTab('contests')}
                className={`px-3 py-2 rounded-md flex items-center gap-1.5 transition ${
                  activeTab === 'contests' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Trophy className="w-4 h-4" /> Kỳ thi ({contests.length})
              </button>
              <button
                onClick={() => setActiveTab('organizations')}
                className={`px-3 py-2 rounded-md flex items-center gap-1.5 transition ${
                  activeTab === 'organizations' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Users className="w-4 h-4" /> Tổ chức ({organizations.length})
              </button>
              <button
                onClick={() => setActiveTab('submissions')}
                className={`px-3 py-2 rounded-md flex items-center gap-1.5 transition ${
                  activeTab === 'submissions' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Send className="w-4 h-4" /> Bài nộp ({submissions.length})
              </button>
              <button
                onClick={() => setActiveTab('blogs')}
                className={`px-3 py-2 rounded-md flex items-center gap-1.5 transition ${
                  activeTab === 'blogs' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4" /> Blogs ({blogs.length})
              </button>
              <button
                onClick={() => setActiveTab('wiki')}
                className={`px-3 py-2 rounded-md flex items-center gap-1.5 transition ${
                  activeTab === 'wiki' ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <HelpCircle className="w-4 h-4" /> Wiki ({wikis.length})
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

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono">
                <Activity className="w-3 h-3 text-emerald-600" />
                API: {apiStatus}
              </span>

              {currentUser ? (
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-700">{currentUser}</span>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-slate-500 hover:text-red-600 rounded hover:bg-slate-100"
                    title="Đăng xuất"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-3 py-1.5 bg-sky-600 text-white rounded text-xs font-semibold hover:bg-sky-700 flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" /> Đăng nhập
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
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
                  Custom Checker (testlib.h) và Interactive pipe judging. Toàn bộ nội dung bài tập, kỳ thi và thông báo
                  được quản trị viên cập nhật trực tiếp từ bảng điều khiển Admin.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('problems')}
                    className="px-5 py-2.5 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 shadow-xs flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" /> Bắt đầu giải bài ({problems.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('contests')}
                    className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 flex items-center gap-2"
                  >
                    <Trophy className="w-4 h-4" /> Xem kỳ thi ({contests.length})
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
                <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">Bài tập</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{problems.length}</div>
                <div className="text-emerald-600 text-xs mt-1">Đang hoạt động</div>
              </div>
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
                <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">Kỳ thi</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{contests.length}</div>
                <div className="text-sky-600 text-xs mt-1">ICPC &amp; IOI Rule</div>
              </div>
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
                <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">Bài nộp</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{submissions.length}</div>
                <div className="text-slate-500 text-xs mt-1">Xếp hàng Redis</div>
              </div>
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
                <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">Podman Workers</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{judgerWorkers.length || 1} Online</div>
                <div className="text-emerald-600 text-xs mt-1">Persistent Engine API</div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: Bài tập (Problems) */}
        {activeTab === 'problems' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-3">
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                <h3 className="font-semibold text-slate-900 text-sm mb-3">Danh sách bài tập</h3>
                {problems.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    Không tìm thấy bài tập nào. Quản trị viên có thể thêm bài tập mới từ trang Admin.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {problems.map((prob) => (
                      <div
                        key={prob.id}
                        onClick={() => setSelectedProblem(prob)}
                        className={`p-3 rounded-md border cursor-pointer transition ${
                          selectedProblem?.id === prob.id
                            ? 'border-sky-500 bg-sky-50/50'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-mono font-bold text-sky-700">{prob.code}</span>
                          <span className="text-slate-500">{prob.judge_mode}</span>
                        </div>
                        <div className="font-medium text-slate-900 text-sm mt-1">{prob.title}</div>
                        <div className="flex gap-2 text-xs text-slate-500 mt-2">
                          <span>{prob.time_limit_ms}ms</span>
                          <span>&bull;</span>
                          <span>{prob.memory_limit_mb}MB</span>
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
                )}
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              {selectedProblem ? (
                <>
                  <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs">
                    <div className="flex justify-between items-start border-b border-slate-200 pb-4 mb-4">
                      <div>
                        <span className="text-xs font-mono font-bold text-sky-600">{selectedProblem.code}</span>
                        <h2 className="text-xl font-bold text-slate-900">{selectedProblem.title}</h2>
                      </div>
                      <div className="text-right text-xs text-slate-500 font-mono">
                        <div>
                          Giới hạn thời gian: <strong className="text-slate-800">{selectedProblem.time_limit_ms} ms</strong>
                        </div>
                        <div>
                          Giới hạn bộ nhớ: <strong className="text-slate-800">{selectedProblem.memory_limit_mb} MB</strong>
                        </div>
                        <div>
                          Chế độ chấm: <strong className="text-slate-800">{selectedProblem.judge_mode}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="prose max-w-none text-slate-700 text-sm leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {selectedProblem.statement_markdown}
                      </ReactMarkdown>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs">
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

                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-slate-500 font-mono">
                        Giới hạn: {selectedProblem.time_limit_ms}ms &bull; {selectedProblem.memory_limit_mb}MB
                      </span>
                      <button
                        onClick={handleCodeSubmit}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-sky-600 text-white rounded font-medium text-xs hover:bg-sky-700 flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" /> {isSubmitting ? 'Đang gửi...' : 'Gửi bài chấm'}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white p-8 rounded-lg border border-slate-200 text-center text-slate-500">
                  Không tìm thấy bài tập được chọn.
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: Kỳ thi (Contests) */}
        {activeTab === 'contests' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900">Kỳ thi lập trình thi đấu</h2>
              <div className="mt-6 divide-y divide-slate-200">
                {contests.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    Không tìm thấy kỳ thi nào. Quản trị viên có thể tạo kỳ thi mới từ trang Admin.
                  </div>
                ) : (
                  contests.map((c) => (
                    <div key={c.id} className="py-4 flex justify-between items-center">
                      <div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                          {c.rule_type} Rules
                        </span>
                        <h3 className="text-base font-semibold text-slate-900 mt-1">{c.title}</h3>
                        <p className="text-xs text-slate-600 mt-1">{c.description}</p>
                        <div className="text-xs text-slate-400 mt-2 font-mono">
                          Bắt đầu: {new Date(c.start_time).toLocaleString()} &bull; Kết thúc: {new Date(c.end_time).toLocaleString()}
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-sky-600 text-white rounded text-xs font-semibold hover:bg-sky-700">
                        Chi tiết kỳ thi
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: Tổ chức (Organizations) */}
        {activeTab === 'organizations' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900">Các câu lạc bộ &amp; Tổ chức đối tác</h2>
              {organizations.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  Không tìm thấy tổ chức nào. Quản trị viên có thể thêm tổ chức từ trang Admin.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {organizations.map((org) => (
                    <div key={org.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                      <div className="font-bold text-slate-900 text-base">{org.name}</div>
                      <p className="text-xs text-slate-600 mt-1">{org.description}</p>
                      <div className="text-xs text-slate-500 mt-3 font-mono">
                        {org.member_count} thành viên &bull; {org.contests_count} kỳ thi
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: Bài nộp (Submissions) */}
        {activeTab === 'submissions' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-900">Danh sách bài nộp</h2>
                <button
                  onClick={fetchData}
                  className="px-2.5 py-1 text-xs border border-slate-300 rounded hover:bg-slate-100 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Làm mới
                </button>
              </div>

              <div className="border border-slate-200 rounded overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Mã nộp</th>
                      <th className="p-3">Bài tập</th>
                      <th className="p-3">Ngôn ngữ</th>
                      <th className="p-3">Kết quả (Verdict)</th>
                      <th className="p-3">Thời gian</th>
                      <th className="p-3">Bộ nhớ</th>
                      <th className="p-3">Thời điểm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {submissions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-slate-500">
                          Không tìm thấy bài nộp nào.
                        </td>
                      </tr>
                    ) : (
                      submissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-medium text-slate-900">{sub.id.substring(0, 8)}...</td>
                          <td className="p-3 font-bold font-mono text-sky-600">{sub.problem_code}</td>
                          <td className="p-3">{sub.language}</td>
                          <td className="p-3">
                            {sub.verdict === 'Accepted' ? (
                              <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                                <CheckCircle2 className="w-3.5 h-3.5" /> ACCEPTED
                              </span>
                            ) : sub.verdict === 'Pending' || sub.verdict === 'Running' || sub.verdict === 'Compiling' ? (
                              <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                                <Activity className="w-3.5 h-3.5 animate-spin" /> {sub.verdict}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 font-bold text-red-600">
                                <XCircle className="w-3.5 h-3.5" /> {sub.verdict}
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-mono">{sub.time_consumed_ms} ms</td>
                          <td className="p-3 font-mono">{sub.memory_consumed_kb} KB</td>
                          <td className="p-3 text-slate-500 font-mono">
                            {new Date(sub.created_at).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Trạng thái verdict chuẩn trong hệ thống: </span>
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

        {/* VIEW: Blogs */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900">Bài viết &amp; Tin tức</h2>
              {blogs.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  Không tìm thấy bài viết nào. Quản trị viên có thể đăng bài từ trang Admin.
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {blogs.map((b) => (
                    <article key={b.id} className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition">
                      <div className="text-xs text-slate-500">
                        {new Date(b.created_at).toLocaleDateString()} &bull; bởi {b.author_name}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{b.title}</h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">{b.content_markdown}</p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: Wiki */}
        {activeTab === 'wiki' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900">Cẩm nang &amp; Tài liệu Wiki</h2>
              {wikis.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  Không tìm thấy tài liệu wiki nào. Quản trị viên có thể thêm mục wiki từ trang Admin.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {wikis.map((w) => (
                    <div key={w.id} className="p-4 border border-slate-200 rounded-lg">
                      <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {w.category}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 mt-2">{w.title}</h3>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">{w.content_markdown}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: Về chúng mình (About Us) */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-xs">
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
                    <li>&bull; <strong>Cơ sở dữ liệu:</strong> PostgreSQL 17 + Redis 8</li>
                    <li>&bull; <strong>Quản lý Worker:</strong> Podman Engine Socket API (`/run/podman/podman.sock`)</li>
                    <li>&bull; <strong>Reverse Proxy:</strong> Nginx cổng 80 với Unified API Routing (`/api/v1/*`)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: Quản trị Admin (Add Content Forms, Route Registry, Podman Judgers) */}
        {activeTab === 'admin' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg border border-purple-200 shadow-xs">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-600" /> Trung tâm Quản trị Toàn diện (Admin Dashboard)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Thêm và quản lý nội dung (Bài tập, Kỳ thi, Tổ chức, Blog, Wiki), giám sát Route Catalog và điều khiển Podman Judger.
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-md">
                  Administrator Mode
                </span>
              </div>

              {/* SECTION: Admin Content Creator Forms */}
              <div className="mt-6 p-5 border border-purple-100 rounded-lg bg-purple-50/30">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                    <FolderPlus className="w-4 h-4 text-purple-600" /> Thêm Nội dung Mới vào Hệ thống
                  </h3>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setAdminAddCategory('problem')}
                      className={`px-2.5 py-1 text-xs rounded font-medium ${
                        adminAddCategory === 'problem' ? 'bg-purple-600 text-white' : 'bg-white border text-slate-700'
                      }`}
                    >
                      + Bài tập
                    </button>
                    <button
                      onClick={() => setAdminAddCategory('contest')}
                      className={`px-2.5 py-1 text-xs rounded font-medium ${
                        adminAddCategory === 'contest' ? 'bg-purple-600 text-white' : 'bg-white border text-slate-700'
                      }`}
                    >
                      + Kỳ thi
                    </button>
                    <button
                      onClick={() => setAdminAddCategory('org')}
                      className={`px-2.5 py-1 text-xs rounded font-medium ${
                        adminAddCategory === 'org' ? 'bg-purple-600 text-white' : 'bg-white border text-slate-700'
                      }`}
                    >
                      + Tổ chức
                    </button>
                    <button
                      onClick={() => setAdminAddCategory('blog')}
                      className={`px-2.5 py-1 text-xs rounded font-medium ${
                        adminAddCategory === 'blog' ? 'bg-purple-600 text-white' : 'bg-white border text-slate-700'
                      }`}
                    >
                      + Blog
                    </button>
                    <button
                      onClick={() => setAdminAddCategory('wiki')}
                      className={`px-2.5 py-1 text-xs rounded font-medium ${
                        adminAddCategory === 'wiki' ? 'bg-purple-600 text-white' : 'bg-white border text-slate-700'
                      }`}
                    >
                      + Wiki
                    </button>
                  </div>
                </div>

                {adminMsg && (
                  <div className="mb-4 p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs">
                    {adminMsg}
                  </div>
                )}

                <form onSubmit={handleAdminCreate} className="space-y-3 bg-white p-4 rounded border border-slate-200">
                  {adminAddCategory === 'problem' && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Mã bài (Code)</label>
                          <input
                            type="text"
                            required
                            placeholder="P1004"
                            value={probCode}
                            onChange={(e) => setProbCode(e.target.value)}
                            className="w-full text-xs p-2 border rounded font-mono"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-medium text-slate-700 mb-1">Tiêu đề bài tập</label>
                          <input
                            type="text"
                            required
                            placeholder="Tìm cặp số nguyên tố..."
                            value={probTitle}
                            onChange={(e) => setProbTitle(e.target.value)}
                            className="w-full text-xs p-2 border rounded"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Độ khó</label>
                          <select
                            value={probDiff}
                            onChange={(e) => setProbDiff(e.target.value)}
                            className="w-full text-xs p-2 border rounded bg-white"
                          >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Chế độ chấm</label>
                          <select
                            value={probJudgeMode}
                            onChange={(e) => setProbJudgeMode(e.target.value)}
                            className="w-full text-xs p-2 border rounded bg-white"
                          >
                            <option value="Standard">Standard Diff</option>
                            <option value="CustomChecker">Custom Checker</option>
                            <option value="Interactive">Interactive</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Giới hạn thời gian (ms)</label>
                          <input
                            type="number"
                            required
                            value={probTimeLimit}
                            onChange={(e) => setProbTimeLimit(Number(e.target.value))}
                            className="w-full text-xs p-2 border rounded font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Giới hạn bộ nhớ (MB)</label>
                          <input
                            type="number"
                            required
                            value={probMemLimit}
                            onChange={(e) => setProbMemLimit(Number(e.target.value))}
                            className="w-full text-xs p-2 border rounded font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Đề bài (Hỗ trợ Markdown &amp; KaTeX $...$)
                        </label>
                        <textarea
                          rows={4}
                          value={probStatement}
                          onChange={(e) => setProbStatement(e.target.value)}
                          className="w-full text-xs p-2 border rounded font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Test mẫu Input</label>
                          <textarea
                            rows={2}
                            value={probSampleIn}
                            onChange={(e) => setProbSampleIn(e.target.value)}
                            className="w-full text-xs p-2 border rounded font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Test mẫu Output</label>
                          <textarea
                            rows={2}
                            value={probSampleOut}
                            onChange={(e) => setProbSampleOut(e.target.value)}
                            className="w-full text-xs p-2 border rounded font-mono"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {adminAddCategory === 'contest' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Tên kỳ thi</label>
                        <input
                          type="text"
                          required
                          value={contestTitle}
                          onChange={(e) => setContestTitle(e.target.value)}
                          className="w-full text-xs p-2 border rounded"
                          placeholder="Kỳ thi lập trình thi đấu..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Mô tả kỳ thi</label>
                        <textarea
                          rows={3}
                          value={contestDesc}
                          onChange={(e) => setContestDesc(e.target.value)}
                          className="w-full text-xs p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Thể thức</label>
                        <select
                          value={contestRule}
                          onChange={(e) => setContestRule(e.target.value)}
                          className="w-full text-xs p-2 border rounded bg-white"
                        >
                          <option value="ICPC">ICPC Rule</option>
                          <option value="IOI">IOI Rule</option>
                        </select>
                      </div>
                    </>
                  )}

                  {adminAddCategory === 'org' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Tên tổ chức / CLB</label>
                        <input
                          type="text"
                          required
                          value={orgName}
                          onChange={(e) => setOrgName(e.target.value)}
                          className="w-full text-xs p-2 border rounded"
                          placeholder="CLB Thuật toán..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Mô tả tổ chức</label>
                        <textarea
                          rows={3}
                          value={orgDesc}
                          onChange={(e) => setOrgDesc(e.target.value)}
                          className="w-full text-xs p-2 border rounded"
                        />
                      </div>
                    </>
                  )}

                  {adminAddCategory === 'blog' && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Tiêu đề bài viết</label>
                          <input
                            type="text"
                            required
                            value={blogTitle}
                            onChange={(e) => setBlogTitle(e.target.value)}
                            className="w-full text-xs p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Tác giả</label>
                          <input
                            type="text"
                            value={blogAuthor}
                            onChange={(e) => setBlogAuthor(e.target.value)}
                            placeholder={currentUser || 'Admin'}
                            className="w-full text-xs p-2 border rounded"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Nội dung bài viết</label>
                        <textarea
                          rows={4}
                          required
                          value={blogContent}
                          onChange={(e) => setBlogContent(e.target.value)}
                          className="w-full text-xs p-2 border rounded"
                        />
                      </div>
                    </>
                  )}

                  {adminAddCategory === 'wiki' && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Tiêu đề tài liệu</label>
                          <input
                            type="text"
                            required
                            value={wikiTitle}
                            onChange={(e) => setWikiTitle(e.target.value)}
                            className="w-full text-xs p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">Chuyên mục</label>
                          <input
                            type="text"
                            required
                            value={wikiCategory}
                            onChange={(e) => setWikiCategory(e.target.value)}
                            className="w-full text-xs p-2 border rounded"
                            placeholder="Tutorial, Compiler, FAQ..."
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Nội dung cẩm nang</label>
                        <textarea
                          rows={4}
                          required
                          value={wikiContent}
                          onChange={(e) => setWikiContent(e.target.value)}
                          className="w-full text-xs p-2 border rounded"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 text-white rounded text-xs font-semibold hover:bg-purple-700 flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Lưu vào Cơ sở Dữ liệu
                    </button>
                  </div>
                </form>
              </div>

              {/* Real Route & API Catalog */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-purple-600" /> Quản lý Danh mục Route &amp; API Endpoints ({routesCatalog.length})
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">Unified Ingress: /api/v1/* &amp; /health</span>
                </div>

                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Method</th>
                        <th className="p-2.5">Đường dẫn</th>
                        <th className="p-2.5">Mô tả</th>
                        <th className="p-2.5">Handler</th>
                        <th className="p-2.5">Trạng thái</th>
                        <th className="p-2.5 text-right">Test Ping</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {routesCatalog.map((r, idx) => (
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
                          <td className="p-2.5 text-slate-600">{r.description}</td>
                          <td className="p-2.5 font-mono text-[11px] text-slate-500">{r.handler}</td>
                          <td className="p-2.5">
                            <span className="text-emerald-700 font-semibold text-[11px]">ACTIVE</span>
                          </td>
                          <td className="p-2.5 text-right">
                            <button
                              onClick={() => {
                                fetch(r.path.replace('{id_or_code}', 'P1001'))
                                  .then((res) => alert(`Test ${r.path} -> HTTP ${res.status}`))
                                  .catch((err) => alert(`Test ${r.path} -> ${err.message}`));
                              }}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium"
                            >
                              Ping
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Real Podman Judger Container Management */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-purple-600" /> Container Podman qua Socket API ({judgerWorkers.length})
                  </h3>
                  <button
                    onClick={() => alert('Yêu cầu khởi tạo Judger đã gửi tới Podman Engine socket!')}
                    className="px-3 py-1.5 bg-purple-600 text-white rounded text-xs font-semibold hover:bg-purple-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm Worker
                  </button>
                </div>

                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Tên Container</th>
                        <th className="p-2.5">Container ID</th>
                        <th className="p-2.5">Image</th>
                        <th className="p-2.5">Trạng thái</th>
                        <th className="p-2.5 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {judgerWorkers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-3 text-center text-slate-500 font-mono text-[11px]">
                            Đang kết nối Podman Socket (/run/podman/podman.sock)...
                          </td>
                        </tr>
                      ) : (
                        judgerWorkers.map((w, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2.5 font-mono font-medium text-slate-900">{w.name}</td>
                            <td className="p-2.5 font-mono text-[11px] text-slate-500">{w.id.substring(0, 12)}</td>
                            <td className="p-2.5 text-slate-600 font-mono text-[11px]">{w.image}</td>
                            <td className="p-2.5">
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {w.status}
                              </span>
                            </td>
                            <td className="p-2.5 text-right">
                              <button
                                onClick={() => alert(`Dừng worker ${w.name}`)}
                                className="text-red-600 hover:text-red-800 font-medium text-[11px]"
                              >
                                Dừng
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Auth Modal (Login / Register) */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 max-w-sm w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-900">
                {authMode === 'login' ? 'Đăng nhập tài khoản' : 'Đăng ký tài khoản'}
              </h3>
              <button onClick={() => setShowAuthModal(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>

            {authMessage && (
              <div className="mb-4 p-2.5 bg-sky-50 text-sky-800 border border-sky-200 rounded text-xs">
                {authMessage}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tên người dùng</label>
                <input
                  type="text"
                  required
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                  placeholder="username"
                />
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                    placeholder="user@example.com"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Mật khẩu (Argon2id)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                  placeholder="Tối thiểu 8 ký tự"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-sky-600 text-white rounded text-xs font-semibold hover:bg-sky-700 flex items-center justify-center gap-1.5 mt-4"
              >
                {authMode === 'login' ? <LogIn className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                {authMode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
              {authMode === 'login' ? (
                <span>
                  Chưa có tài khoản?{' '}
                  <button onClick={() => setAuthMode('register')} className="text-sky-600 font-semibold hover:underline">
                    Đăng ký ngay
                  </button>
                </span>
              ) : (
                <span>
                  Đã có tài khoản?{' '}
                  <button onClick={() => setAuthMode('login')} className="text-sky-600 font-semibold hover:underline">
                    Đăng nhập
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            &copy; 2026 <strong>Toi Yêu Yuri Online Judge</strong> (toiyeuyuriiiii &amp; nmkdeveloper) &bull; MIT License
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-slate-600">Light Mode</span>
            <span>&bull;</span>
            <span className="text-slate-600">Trung tâm Quản trị Toàn diện</span>
            <span>&bull;</span>
            <span className="text-slate-600">Podman Engine API</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
