import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-(--color-background-secondary) text-(--midnight) pt-24 pb-12 border-t border-(--color-border-tertiary)">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-16 md:grid-cols-4">
          
          {/* Brand Info */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-(--midnight) text-white h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xl transition-all group-hover:scale-105">
                S
              </div>
              <span className="text-xl font-bold tracking-tight text-(--midnight)">STAKY</span>
            </Link>
            <p className="text-(--color-text-secondary) text-sm leading-relaxed max-w-xs">
              Redefining the digital marketplace with a minimalist approach to premium shopping. Quality, curated, and timeless.
            </p>
          </div>

          {/* Quick Links - Shop */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-(--color-text-tertiary) mb-8">Shop</h4>
            <ul className="space-y-4">
              {["Electronics", "Fashion", "Beauty", "Home & Kitchen"].map(item => (
                <li key={item}>
                  <Link to={`/`} className="text-[13px] font-medium text-(--color-text-secondary) hover:text-(--midnight) transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links - Info */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-(--color-text-tertiary) mb-8">Information</h4>
            <ul className="space-y-4">
              {["About Staky", "Sustainability", "Terms & Conditions", "Privacy Policy"].map(item => (
                <li key={item}>
                  <Link to="#" className="text-[13px] font-medium text-(--color-text-secondary) hover:text-(--midnight) transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-(--color-text-tertiary) mb-8">Connect</h4>
            <div className="flex gap-3 mb-8">
               {["IG", "TW", "FB", "LI"].map(social => (
                 <button key={social} className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-[10px] font-bold border border-(--color-border-tertiary) hover:border-(--midnight) hover:bg-(--midnight) hover:text-white transition-all">
                   {social}
                 </button>
               ))}
            </div>
            <p className="text-[10px] font-bold text-(--color-text-tertiary) uppercase tracking-widest leading-loose">
              Join our newsletter for <br/> curated updates and early access.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-8 border-t border-(--color-border-tertiary) flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-(--color-text-tertiary) text-[10px] font-bold uppercase tracking-widest">
            © 2026 STAKY STUDIOS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-10">
            <span className="text-(--color-text-tertiary) text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:text-(--midnight)">GLOBAL SHOPPING</span>
            <span className="text-(--color-text-tertiary) text-[10px] font-bold uppercase tracking-widest">EST. 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
