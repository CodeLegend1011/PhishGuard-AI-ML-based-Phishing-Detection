"use client";
import { useState } from "react";
import { Activity, Home, ShieldAlert, MessageCircle, Mail, BotMessageSquare, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const navItems = [
  { icon: ShieldAlert, label: "Dashboard", route: "/dashboard" },
  { icon: Activity, label: "Detection", route: "/pages/detection" },
  { icon: MessageCircle, label: "Messaging", route: "/pages/messaging" },
  { icon: Mail, label: "Mail", route: "/pages/mail" },
  { icon: BotMessageSquare, label: "Chatbot", route: "/pages/chatbot" },
  { icon: User, label: "Account", route: "/pages/account" },
];

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="text-white"
        >
          <Menu size={24} />
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:block fixed inset-y-0 left-0 z-40 lg:relative w-64 bg-gray-800 p-4 flex flex-col space-y-6 shadow-xl transition-all duration-300`}>
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2">
            <img 
              src="/logo_phishguard.png" 
              alt="Logo" 
              className="w-8 h-8 rounded-full" // Adjust the size and make the image round
            />
            <h2 className="text-xl font-bold text-white">PhishGuard</h2>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Menu size={20} />
          </Button>
        </div>
        
        {/* Navigation Items */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700 transition-colors cursor-pointer" onClick={() => router.push(item.route)}>
                <item.icon size={20} />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Status Info */}
        <div className="border-t border-gray-700 pt-4">
          <div className="text-sm text-gray-400">Last scan: 3 hours ago</div>
          <div className="flex items-center mt-2">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm">System online</span>
          </div>
        </div>
      </aside>

      {/* Backdrop for Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
}
