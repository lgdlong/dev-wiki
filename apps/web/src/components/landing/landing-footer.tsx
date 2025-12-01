import Link from "next/link";
import { Github } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Thư viện Video", href: "/videos" },
    { label: "Tutorials", href: "/tutorials" },
    { label: "Roadmaps", href: "/docs" },
  ],
  company: [
    { label: "Về chúng tôi", href: "/docs" },
    { label: "Liên hệ", href: "#" },
    { label: "Blog", href: "#" },
  ],
  legal: [
    { label: "Điều khoản", href: "#" },
    { label: "Bảo mật", href: "#" },
  ],
};

export function LandingFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-mono text-xl font-bold text-gray-950">
                Dev Wiki
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              Nền tảng học lập trình qua video, được sắp xếp có hệ thống và kiểm
              duyệt chất lượng.
            </p>
            <a
              href="https://github.com/lgdlong/dev-wiki"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-950"
            >
              <Github className="h-4 w-4" />
              Open Source
            </a>
          </div>

          {/* Links */}
          <div className="grid grid-cols-3 gap-8 md:col-span-3">
            <div>
              <h4 className="mb-4 text-sm font-semibold text-gray-950">
                Sản phẩm
              </h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-gray-950"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-gray-950">
                Công ty
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-gray-950"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold text-gray-950">
                Pháp lý
              </h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-gray-950"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 md:flex-row">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Dev Wiki. All rights reserved.
          </p>
          <p className="text-sm text-gray-400">Made with ❤️ for developers</p>
        </div>
      </div>
    </footer>
  );
}
