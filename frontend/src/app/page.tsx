import Navigation from '../components/Navigation';

export default function Home() {
  return (
    <>
      <Navigation context="public" userType="public" currentPage="/" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              CrisisLink<span className="text-red-600">.cv</span>
            </h1>
            <p className="text-xl text-gray-600 mb-2">Your Life Passport</p>
            <p className="text-lg text-gray-500">
              Instant medical info + AI voice assistant + Auto-notify family
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  🚨 The Problem
                </h2>
                <p className="text-gray-600 mb-6">
                  250,000+ preventable deaths occur annually due to delayed access to medical information in emergencies.
                </p>
                
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  💡 Our Solution
                </h2>
                <p className="text-gray-600">
                  Scan QR code → Instant medical info + AI voice assistant + Auto-notify family
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">How It Works</h3>
                <ol className="text-left text-gray-600 space-y-2">
                  <li>1. Create profile at crisislink.cv</li>
                  <li>2. Print QR code (keep in wallet)</li>
                  <li>3. Emergency happens → Scan QR</li>
                  <li>4. AI speaks medical info in responder's language</li>
                  <li>5. Family auto-notified with location</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="space-x-4">
            <a 
              href="/create-profile" 
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
            >
              Create Your Life Passport
            </a>
            <a 
              href="/emergency/demo" 
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
            >
              View Demo
            </a>
          </div>

          <div className="mt-12 text-sm text-gray-500">
            <p>🏆 Built for AI Vibecoding Hackathon</p>
            <p>✅ Daytona • ✅ LeanMCP • ✅ AI/ML API</p>
          </div>
        </div>
      </div>
    </>
  );
}
