import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    { name: 'Help', href: '/help' },
    { name: 'Status', href: '/status' },
    { name: 'About', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Blog', href: '/blog' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Text to speech', href: '/text-to-speech' },
    { name: 'Teams', href: '/teams' },
  ]

  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="container-custom">
        <div className="py-12">
          {/* Main Footer Content */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 mb-8">
            {footerLinks.map((link, index) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="hover:text-black transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="text-center text-sm text-gray-500 border-t border-gray-100 pt-8">
            <p>&copy; {currentYear} My Medium Blog. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}