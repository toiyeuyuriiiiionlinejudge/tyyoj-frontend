import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Terminal, Cpu, Server, CheckCircle2, Activity } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'admin'>('problem');
  const [verdicts, setVerdicts] = useState<string[]>([]);
  const [apiStatus, setApiStatus] = useState<string>('Checking...');

  useEffect(() => {
    // Relative API requests through unified domain routing (/api/v1 and /health)
    fetch('/health')
      .then((res) => res.text())
      .then((data) => setApiStatus(`Backend Online (${data})`))
      .catch(() => setApiStatus('Backend Offline'));

    fetch('/api/v1/verdicts')
      .then((res) => res.json())
      .then((data) => setVerdicts(data))
      .catch(() => setVerdicts([]));
  }, []);

  const sampleProblemMarkdown = `
# P1001: A + B Problem (with KaTeX Math)

Calculate the sum of two integers $a$ and $b$.

### Mathematical Formulation
Given two integers $a, b \\in \\mathbb{Z}$ where:
$$ -10^9 \\le a, b \\le 10^9 $$

Compute the value of $S$:
$$ S = \\sum_{i=1}^{n} (a_i + b_i) $$

### Dynamic Problem Limits
- **Time Limit:** 1000 ms (Configurable per problem)
- **Memory Limit:** 256 MB (Configurable per problem)
- **Judging Mode:** Standard Token Diff
`;

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <header className="border-b border-slate-800 pb-4 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-sky-400">Toi Yêu Yuri Online Judge (`tyyoj`)</h1>
          <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
            <span>High-Security Online Judge with Persistent Docker Judgers</span>
            <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Activity className="w-3 h-3" /> API: {apiStatus}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('problem')}
            className={`px-4 py-2 rounded text-sm font-medium ${
              activeTab === 'problem' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Problem Preview (KaTeX)
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 rounded text-sm font-medium flex items-center gap-1 ${
              activeTab === 'admin' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Server className="w-4 h-4" /> Admin Judger Fleet
          </button>
        </div>
      </header>

      {activeTab === 'problem' ? (
        <section className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {sampleProblemMarkdown}
            </ReactMarkdown>
          </div>

          <div className="mt-6 border-t border-slate-800 pt-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Live Submission Verdicts (from unified `/api/v1/verdicts`):
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {verdicts.map((v) => (
                <span
                  key={v}
                  className="bg-slate-800 text-slate-300 text-xs font-mono px-2 py-1 rounded border border-slate-700"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-100">
              <Cpu className="w-5 h-5 text-purple-400" /> Persistent Docker Judger Instances
            </h2>
            <button className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded text-sm font-medium">
              + Provision New Judger
            </button>
          </div>
          <div className="border border-slate-800 rounded overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Worker ID</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Heartbeat</th>
                  <th className="p-3">Languages</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="p-3 font-mono text-xs">judger-persistent-01</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ONLINE
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 text-xs">Just now (every 5s)</td>
                  <td className="p-3 text-xs text-slate-300">C++20, Pascal, Python3</td>
                  <td className="p-3">
                    <button className="text-red-400 hover:underline text-xs">Stop</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      <footer className="mt-8 border-t border-slate-800 pt-4 text-center text-xs text-slate-500 flex justify-center items-center gap-1">
        <Terminal className="w-3.5 h-3.5" /> © 2026 Toi Yêu Yuri Online Judge (toiyeuyuriiiii & nmkdeveloper) · MIT License
      </footer>
    </div>
  );
};

export default App;
