import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { Trans } from '@/components/Trans';

export function RAFooter() {
  return (
    <footer className="bg-black text-gray-300 py-10 px-6 md:px-16">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Logo + Address */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            🚗 <Trans translationKey="app.title" text="RoadGuard" />
          </h2>
          <p className="mt-4 text-sm leading-6">
            <Trans translationKey="footer.address" text="123 Main Street, MG Road" /> <br />
            <Trans translationKey="footer.city" text="Bengaluru, Karnataka - 560001" /> <br />
            <Trans translationKey="footer.country" text="India" />
          </p>
        </div>

        {/* Reach Us */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            <Trans translationKey="footer.reachUs" text="Reach Us" />
          </h3>
          <p className="text-sm">support@roadguard.com</p>
          <p className="text-sm mt-1">+91 xxxxx xxxxx</p>
          <p className="text-sm mt-1">+91 acaca acaca</p>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            <Trans translationKey="footer.company" text="Company" />
          </h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/about" className="hover:text-white">
              <Trans translationKey="footer.aboutUs" text="About Us" />
            </a></li>
            <li><a href="/careers" className="hover:text-white">
              <Trans translationKey="footer.careers" text="Careers" />
            </a></li>
            <li><a href="/contact" className="hover:text-white">
              <Trans translationKey="footer.contactUs" text="Contact Us" />
            </a></li>
            <li><a href="/news" className="hover:text-white">
              <Trans translationKey="footer.news" text="News" />
            </a></li>
          </ul>
        </div>

        {/* Services / Products */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            <Trans translationKey="footer.services" text="Services" />
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Trans translationKey="footer.flatTyre" text="Flat Tyre" /></li>
            <li><Trans translationKey="footer.batteryJumpstart" text="Battery Jumpstart" /></li>
            <li><Trans translationKey="footer.keyUnlock" text="Key Unlock Assistance" /></li>
            <li><Trans translationKey="footer.fuelDelivery" text="Fuel Delivery" /></li>
            <li><Trans translationKey="footer.towing" text="Towing" /></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            <Trans translationKey="footer.quickLinks" text="Quick Links" />
          </h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/subscriptions" className="hover:text-white">
              <Trans translationKey="footer.mySubscriptions" text="My Subscriptions" />
            </a></li>
            <li><a href="/stations" className="hover:text-white">
              <Trans translationKey="footer.nearbyStations" text="Nearby Fuel Stations" />
            </a></li>
            <li><a href="/fitment" className="hover:text-white">
              <Trans translationKey="footer.fitmentCenters" text="Fitment Centers" />
            </a></li>
            <li><a href="/recap" className="hover:text-white">
              <Trans translationKey="footer.yearRecap" text="Year Recap" />
            </a></li>
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
          © {new Date().getFullYear()} <Trans translationKey="app.title" text="RoadGuard" /> <Trans translationKey="footer.servicesPvtLtd" text="Services Pvt. Ltd." /> <Trans translationKey="footer.allRightsReserved" text="All Rights Reserved." />
        </p>

        {/* Policies */}
        <div className="flex space-x-4 text-sm mt-4 md:mt-0">
          <a href="/privacy" className="hover:text-white">
            <Trans translationKey="footer.privacyPolicy" text="Privacy Policy" />
          </a>
          <a href="/terms" className="hover:text-white">
            <Trans translationKey="footer.termsConditions" text="Terms & Conditions" />
          </a>
        </div>
      </div>
    </footer>
  );
}
