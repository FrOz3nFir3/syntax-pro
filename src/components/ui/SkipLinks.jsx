import React from "react";

const SkipLinks = ({ links = [] }) => {
  const handleSkipLinkClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="skip-links fixed top-0 left-0 z-50 -translate-y-full focus-within:translate-y-0 transition-transform">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="
            block px-4 py-2 bg-blue-600 text-white font-medium
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            hover:bg-blue-700 transition-colors
          "
          onClick={(e) => handleSkipLinkClick(e, link.href)}
        >
          {link.text}
        </a>
      ))}
    </div>
  );
};

export default SkipLinks;
