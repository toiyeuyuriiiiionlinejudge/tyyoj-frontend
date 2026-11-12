# `tyyoj-frontend`

Web interface for **Toi Yêu Yuri Online Judge (`tyyoj`)**, built with React 19, TypeScript, Vite, TailwindCSS, and KaTeX.

## Features

- **Problem Statements:** Rich rendering supporting GitHub Flavored Markdown and inline/block KaTeX math equations (`$...$` and `$$...$$`).
- **Authentication:** Registration with SMTP email verification flow, login, and user profile management.
- **Code Submission:** Monaco/syntax-highlighted code editor for C++, Pascal, and Python submissions.
- **Live Submission Status:** Real-time verdict updates (`PENDING`, `COMPILING`, `RUNNING`, `ACCEPTED`, `WRONG_ANSWER`, etc.).
- **Admin Judger Fleet Control:** Admin GUI dashboard to create, scale, inspect, start, and stop persistent Docker judger worker containers.
- **Contest Scoreboard:** Live standings and problem statistics.

## Technology Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8
- **Styling:** TailwindCSS 4
- **Math & Markdown:** `react-markdown`, `remark-math`, `rehype-katex`, `katex`
- **Icons:** `lucide-react`

## License

MIT © 2026 Toi Yêu Yuri Online Judge (toiyeuyuriiiii & nmkdeveloper)
