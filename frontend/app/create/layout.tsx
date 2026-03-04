import Navbar from "@/components/navbar-v2";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar isLoggedIn={false} messageCount={3} notifCount={2} />
      <main>{children}</main>
      <footer className="bg-stone-800 text-stone-400 mt-16 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-brand text-stone-300 font-medium">2P2</span>
          <p className="text-xs text-stone-500">© {new Date().getFullYear()} 2P2. All rights reserved.</p>
          <div className="flex gap-4 text-xs">
            <a href="#" className="hover:text-stone-200 transition-colors">Privacy</a>
            <a href="#" className="hover:text-stone-200 transition-colors">Terms</a>
            <a href="#" className="hover:text-stone-200 transition-colors">Help</a>
          </div>
        </div>
      </footer>
    </>
  );
}
