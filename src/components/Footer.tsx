export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎓</span>
            <div>
              <p className="font-bold text-lg">WISE English Club</p>
              <p className="text-sm text-gray-400">Learning Portal</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} WISE English Club. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
