import { Link } from 'react-router-dom';
import { Rss, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-cine-dark border-t border-cine-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left — Branding */}
          <div>
            <Link to="/" className="text-white font-bold text-lg tracking-tight">
              CineView
            </Link>
            <p className="text-cine-subtle text-sm mt-1">
              Good Movies. Brighter Days.
            </p>
          </div>

          {/* Right — Links + Socials */}
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-cine-subtle hover:text-white transition-colors">About</a>
            <a href="#" className="text-sm text-cine-subtle hover:text-white transition-colors">Contact</a>
            <a href="#" className="text-sm text-cine-subtle hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-sm text-cine-subtle hover:text-white transition-colors">Terms</a>
            <div className="flex items-center gap-3 ml-2">
              <a href="#" className="text-cine-subtle hover:text-cine-amber transition-colors" aria-label="RSS Feed">
                <Rss size={16} />
              </a>
              <a href="#" className="text-cine-subtle hover:text-cine-amber transition-colors" aria-label="Website">
                <Globe size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-cine-border">
          <p className="text-cine-muted text-sm">
            © {new Date().getFullYear()} CineView. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
