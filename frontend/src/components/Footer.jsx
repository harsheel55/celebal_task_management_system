import React from 'react';
import { Link } from 'react-router-dom';

// SVG Icons for social media links. 
// Using them directly like this avoids needing to install an icon library.
const GitHubIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);


export default function Footer() {
  return (
    // The main footer container with the glassmorphism effect.
    // It has a semi-transparent black background, a backdrop blur, and a subtle top border.
    <footer className="bg-black/20 text-gray-300 backdrop-blur-lg border-t border-white/10 mt-12">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Left Section: Brand and Copyright */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-white">TaskMaster</h3>
            <p className="mt-2 text-sm text-gray-400">
              &copy; {new Date().getFullYear()} TaskMaster. All rights reserved.
            </p>
          </div>
          
          {/* Center Section: Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link to="/" className="text-sm hover:text-white transition-colors duration-300">
              Home
            </Link>
            <Link to="/dashboard" className="text-sm hover:text-white transition-colors duration-300">
              Dashboard
            </Link>
            <Link to="/tasks" className="text-sm hover:text-white transition-colors duration-300">
              All Tasks
            </Link>
          </nav>

          {/* Right Section: Social Media Icons */}
          <div className="flex space-x-5">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">
              <span className="sr-only">Twitter</span>
              <TwitterIcon />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300">
              <span className="sr-only">GitHub</span>
              <GitHubIcon />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}