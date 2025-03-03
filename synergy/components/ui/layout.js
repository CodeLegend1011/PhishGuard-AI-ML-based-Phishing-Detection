import Sidebar from "./sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto lg:ml-0 ml-0">
        {children}
      </main>
    </div>
  );
}
