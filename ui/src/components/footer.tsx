import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaWhatsapp } from "react-icons/fa";

export function RAFooter() {
  return (
    <footer className="bg-black text-gray-300 py-10 px-6 md:px-16">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Logo + Address */}
        <div>
          <h2 className="text-2xl font-bold text-white">🚗 RoadGuard</h2>
          <p className="mt-4 text-sm leading-6">
            123 Main Street, MG Road <br />
            Bengaluru, Karnataka - 560001 <br />
            India
          </p>
        </div>

        {/* Reach Us */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Reach Us</h3>
          <p className="text-sm">support@roadguard.com</p>
          <p className="text-sm mt-1">+91 xxxxx xxxxx</p>
          <p className="text-sm mt-1">+91 acaca acaca</p>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/careers" className="hover:text-white">Careers</a></li>
            <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
            <li><a href="/news" className="hover:text-white">News</a></li>
          </ul>
        </div>

        {/* Services / Products */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Services</h3>
          <ul className="space-y-2 text-sm">
            <li>Flat Tyre</li>
            <li>Battery Jumpstart</li>
            <li>Key Unlock Assistance</li>
            <li>Fuel Delivery</li>
            <li>Towing</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/subscriptions" className="hover:text-white">My Subscriptions</a></li>
            <li><a href="/stations" className="hover:text-white">Nearby Fuel Stations</a></li>
            <li><a href="/fitment" className="hover:text-white">Fitment Centers</a></li>
            <li><a href="/recap" className="hover:text-white">Year Recap</a></li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between">
        {/* Social Icons */}
        <div className="flex space-x-4 text-xl">
          <a href="#" className="hover:text-white"><FaFacebook /></a>
          <a href="#" className="hover:text-white"><FaInstagram /></a>
          <a href="#" className="hover:text-white"><FaLinkedin /></a>
          <a href="#" className="hover:text-white"><FaYoutube /></a>
          <a href="#" className="hover:text-white"><FaWhatsapp /></a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-gray-400 mt-4 md:mt-0">
          © {new Date().getFullYear()} RoadGuard Services Pvt. Ltd. All Rights Reserved.
        </p>

        {/* Policies */}
        <div className="flex space-x-4 text-sm mt-4 md:mt-0">
          <a href="/privacy" className="hover:text-white">Privacy Policy</a>
          <a href="/terms" className="hover:text-white">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  );
}
