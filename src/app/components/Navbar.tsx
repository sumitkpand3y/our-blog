"use client"
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-serif text-gray-900">
            Medium
          </Link>

          {/* Search Bar (only show when logged in) */}
          {session && (
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </div>
            </div>
          )}

          {/* Right Side Navigation */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                {/* Write Button */}
                <Link href="/editor" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span className="text-sm">Write</span>
                </Link>

                {/* Notifications */}
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.5-3.5a9.96 9.96 0 010-7L21 2H3l4.5 4.5a9.96 9.96 0 010 7L3 17h5m7 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2"
                  >
                    <Image
                      src={session.user.image || '/default-image.jpg'}
                      alt={session.user.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Your Dashboard
                      </Link>
                      <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Settings
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/our-story" className="text-sm text-gray-600 hover:text-gray-900">
                  Our story
                </Link>
                <Link href="/membership" className="text-sm text-gray-600 hover:text-gray-900">
                  Membership
                </Link>
                <Link href="/editor" className="text-sm text-gray-600 hover:text-gray-900">
                  Write
                </Link>
                <button
                  onClick={() => signIn()}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Sign in
                </button>
                <button
                  onClick={() => signIn()}
                  className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800"
                >
                  Get started
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}