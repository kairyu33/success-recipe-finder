import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "成功レシピ 記事検索",
    template: "%s | Success Recipe Finder"
  },
  description: "note.comの成功事例記事を効率的に検索・発見。ジャンル、対象、おすすめ度でフィルタリング可能な記事検索システム。",
  keywords: ["成功レシピ", "note記事検索", "記事管理", "成功事例", "ビジネス", "副業", "起業"],
  authors: [{ name: "Success Recipe Team" }],
  creator: "Success Recipe Finder",
  publisher: "Success Recipe Team",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://success-recipe-finder.vercel.app",
    title: "成功レシピ 記事検索 - Success Recipe Finder",
    description: "note.comの成功事例記事を効率的に検索・発見できるWebアプリケーション",
    siteName: "Success Recipe Finder",
  },
  twitter: {
    card: "summary_large_image",
    title: "成功レシピ 記事検索",
    description: "note.comの成功事例記事を効率的に検索・発見",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {/* Navigation Bar */}
        <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center px-2 text-2xl font-extrabold text-white hover:scale-110 transition-transform">
                  📚 成功レシピ 記事検索
                </Link>
                <div className="hidden sm:ml-8 sm:flex sm:space-x-2">
                  <Link
                    href="/articles"
                    className="inline-flex items-center px-6 py-2 text-sm font-bold text-white hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm"
                  >
                    📖 記事一覧
                  </Link>
                  <Link
                    href="/admin"
                    className="inline-flex items-center px-6 py-2 text-sm font-bold text-white hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm"
                  >
                    ⚙️ 管理画面
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-white/80 font-semibold">
                  β版
                </span>
              </div>
            </div>
          </div>
        </nav>

        {children}
        {/* Toast通知プロバイダー */}
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={4000}
          theme="system"
        />
        {/* Optimized devtools removal - less aggressive, stops after 30s */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                let removalCount = 0;
                let intervalId = null;
                let timeoutId = null;

                function removeDevtools() {
                  // Remove all possible devtools elements
                  const selectors = [
                    '[data-nextjs-dialog-overlay]',
                    '[data-nextjs-portal]',
                    'button[data-nextjs-app-router-devtools-button]',
                    'div[data-nextjs-devtools]',
                    'nextjs-portal',
                    '#__next-build-watcher',
                    'button[title*="Next.js"]',
                    'button[aria-label*="Next.js"]',
                    'button:has(kbd)',
                    '[class*="devtools"]',
                    '[id*="devtools"]'
                  ];

                  let removed = false;
                  selectors.forEach(selector => {
                    try {
                      const elements = document.querySelectorAll(selector);
                      elements.forEach(el => {
                        if (el && el.parentNode) {
                          el.parentNode.removeChild(el);
                          removed = true;
                        }
                      });
                    } catch (e) {}
                  });

                  // Check for buttons with "N" text that might be devtools
                  const buttons = document.querySelectorAll('button');
                  buttons.forEach(btn => {
                    const text = btn.textContent?.trim();
                    if (text === 'N' || btn.getAttribute('aria-label')?.includes('devtools')) {
                      if (btn.parentNode) {
                        btn.parentNode.removeChild(btn);
                        removed = true;
                      }
                    }
                  });

                  if (removed) {
                    removalCount++;
                  }
                }

                // Run immediately
                removeDevtools();

                // Run on DOM changes with debouncing
                if (typeof MutationObserver !== 'undefined') {
                  let debounceTimer = null;
                  const observer = new MutationObserver(() => {
                    if (debounceTimer) clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(removeDevtools, 100);
                  });
                  observer.observe(document.body, {
                    childList: true,
                    subtree: true
                  });
                }

                // Reduced polling frequency: 2000ms instead of 500ms (75% reduction in overhead)
                intervalId = setInterval(removeDevtools, 2000);

                // Stop aggressive checking after 30 seconds (devtools usually appear early)
                timeoutId = setTimeout(() => {
                  if (intervalId) {
                    clearInterval(intervalId);
                    console.log('[Devtools Removal] Stopped aggressive checking after 30s. Removed devtools', removalCount, 'times.');
                  }
                }, 30000);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
