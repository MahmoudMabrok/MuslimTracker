export default function Footer() {
  return (
    <footer className="bg-neutral-dark text-white py-4 mt-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">"The best of you are those who learn the Quran and teach it." - Prophet Muhammad ﷺ</p>
        <p className="text-xs mt-2 text-gray-400">Muslim Actions Tracker © {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
