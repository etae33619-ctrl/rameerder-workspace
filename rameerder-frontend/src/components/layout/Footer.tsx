// import React from "react";
import { Link } from "react-router-dom";
import { Container } from "../ui/Container";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export function Footer() {
  return (
    <footer className="bg-brand-navy text-slate-300 pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Col */}
          <div>
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white mb-6">
              <span className="text-3xl font-black text-brand-blue">R</span>
              RAMEERDER PACE
            </Link>
            <p className="text-sm mb-6 max-w-xs leading-relaxed">
              Your trusted partner in Cameroon for books, stationery, logistics, consultancy, and sourcing. Delivered with speed and honesty.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-brand-blue transition-colors">About Us</Link></li>
              <li><Link to="/shop" className="hover:text-brand-blue transition-colors">Shop Products</Link></li>
              <li><Link to="/services" className="hover:text-brand-blue transition-colors">Our Services</Link></li>
              <li><Link to="/blog" className="hover:text-brand-blue transition-colors">Latest Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-6">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/contact" className="hover:text-brand-blue transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-brand-blue transition-colors">FAQs</Link></li>
              <li><Link to="#" className="hover:text-brand-blue transition-colors">Shipping & Returns</Link></li>
              <li><Link to="#" className="hover:text-brand-blue transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-6">Subscribe</h4>
            <p className="text-sm mb-4">Get the latest updates, offers and industry insights.</p>
            <form className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Email Address" 
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-brand-blue"
              />
              <Button type="button" variant="primary">Join</Button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>&copy; {new Date().getFullYear()} Rameerder Pace Group. All rights reserved.</p>
          <div className="flex gap-4">
            {/* Social Icons Placeholder */}
            <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center cursor-pointer hover:bg-brand-blue transition-colors">f</span>
            <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center cursor-pointer hover:bg-brand-blue transition-colors">in</span>
            <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center cursor-pointer hover:bg-brand-blue transition-colors">x</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}