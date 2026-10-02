import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎓</span>
            <div>
              <p className="font-bold text-lg">{site.name}</p>
              <p className="text-sm text-gray-400">運営：{site.operator}</p>
            </div>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a href="/parent" className="text-gray-300 hover:text-white">保護者の方へ</a>
            <a href="/teachers" className="text-gray-300 hover:text-white">英語の先生へ</a>
            <a href="/about" className="text-gray-300 hover:text-white">使い方・データの扱い</a>
            {site.contactUrl && (
              <a href={site.contactUrl} className="text-gray-300 hover:text-white">
                {site.contactLabel}
              </a>
            )}
          </nav>
        </div>
        <p className="mt-6 text-xs text-gray-500">
          &copy; {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
