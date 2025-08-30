import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trans } from '@/components/Trans';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <Trans 
              translationKey="hero.title" 
              text="Welcome to RoadGuard" 
            />
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            <Trans 
              translationKey="hero.subtitle" 
              text="Your trusted partner for road safety and assistance" 
            />
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🚨</div>
              <h3 className="text-lg font-semibold mb-2">
                <Trans translationKey="features.emergency" text="24/7 Emergency Support" />
              </h3>
              <p className="text-gray-600">
                <Trans translationKey="features.emergency.desc" text="Round the clock assistance when you need it most" />
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">📍</div>
              <h3 className="text-lg font-semibold mb-2">
                <Trans translationKey="features.tracking" text="Real-time Vehicle Tracking" />
              </h3>
              <p className="text-gray-600">
                <Trans translationKey="features.tracking.desc" text="Know exactly where your vehicle is at all times" />
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🛠️</div>
              <h3 className="text-lg font-semibold mb-2">
                <Trans translationKey="features.assistance" text="Roadside Assistance" />
              </h3>
              <p className="text-gray-600">
                <Trans translationKey="features.assistance.desc" text="Professional help when you're stranded" />
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                <Trans translationKey="cta.getStarted" text="Get Started Today" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" className="px-8 py-3">
                <Trans translationKey="cta.learnMore" text="Learn More" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}