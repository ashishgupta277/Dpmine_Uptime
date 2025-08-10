"use client";

import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'

import { 
  Monitor, 
  Menu,
  X
} from 'lucide-react';
import React, { useState } from 'react';
export function Appbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   
    return  <div className=" w-full">
    
        <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-gray-900/95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-16">
                    <div className="flex items-center flex-grow">
                      <div className="flex items-center space-x-2">
                        <div className="bg-blue-600 p-2 rounded-lg">
                          <Monitor className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">UptimeGuard</span>
                      </div>
                    </div>
                    
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-8">
                        <a href="#features" className="text-gray-300 hover:text-blue-400 transition-colors">Features</a>
                        <a href="#pricing" className="text-gray-300 hover:text-blue-400 transition-colors">Pricing</a>
                        <a href="#testimonials" className="text-gray-300 hover:text-blue-400 transition-colors">Reviews</a>
                        <SignedOut>
                        
                           <SignInButton mode="modal">
                             <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                               Sign In
                             </button>
                           </SignInButton>
                        <SignUpButton mode="modal">
                           <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                               Sign Up
                             </button>
                        </SignUpButton>
                        </SignedOut>
                         <SignedIn>
                        <UserButton />
                        </SignedIn>
                      </div>
                    </div>
        
                    <div className="md:hidden">
                      <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-gray-300 hover:text-white"
                      >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                      </button>
                    </div>
                  </div>
                </div>
        
                {/* Mobile menu */}
                {mobileMenuOpen && (
                  <div className="md:hidden bg-gray-900 border-t border-gray-800">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                      <a href="#features" className="block px-3 py-2 text-gray-300 hover:text-blue-400">Features</a>
                      <a href="#pricing" className="block px-3 py-2 text-gray-300 hover:text-blue-400">Pricing</a>
                      <a href="#testimonials" className="block px-3 py-2 text-gray-300 hover:text-blue-400">Reviews</a>
                      <SignedOut>
                        
                           <SignInButton mode="modal">
                             <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                               Sign In
                             </button>
                           </SignInButton>
                        <SignUpButton mode="modal">
                           <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                               Sign Up
                             </button>
                        </SignUpButton>
                        </SignedOut>
                         <SignedIn>
                        <UserButton />
                        </SignedIn>
                    </div>
                  </div>
                )}
              </nav>
    </div>
    
}