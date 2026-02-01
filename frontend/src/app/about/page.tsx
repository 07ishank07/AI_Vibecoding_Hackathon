import Navigation from '../../components/Navigation';

export default function About() {
  return (
    <>
      <Navigation context="public" userType="public" currentPage="/about" />
      <div className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-block bg-gradient-to-r from-blue-500/20 to-green-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              EMERGENCY MEDICAL PLATFORM
            </div>
            <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">
              About Crisis<span className="text-blue-500">Link</span><span className="text-green-500">.cv</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing emergency medical response through instant digital access to life-saving information
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-green-50 border border-blue-100 rounded-2xl shadow-sm">
              <div className="text-4xl font-black text-blue-600 mb-2">250K+</div>
              <div className="text-gray-700 font-medium">Preventable Deaths Annually</div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-blue-50 border border-green-100 rounded-2xl shadow-sm">
              <div className="text-4xl font-black text-green-600 mb-2">3 SEC</div>
              <div className="text-gray-700 font-medium">Average QR Scan Time</div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-green-50 border border-blue-100 rounded-2xl shadow-sm">
              <div className="text-4xl font-black text-blue-600 mb-2">24/7</div>
              <div className="text-gray-700 font-medium">Global Accessibility</div>
            </div>
          </div>

          {/* Problem Statement */}
          <div className="mb-20">
            <div className="bg-gradient-to-r from-blue-500 to-green-600 rounded-2xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-6">The Critical Challenge</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-xl mb-6 text-blue-100">
                    Emergency responders face critical delays accessing patient medical information, leading to preventable complications and deaths.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      <span>Patient identification delays</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      <span>Unknown allergies and medications</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      <span>Communication barriers</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      <span>Delayed family notification</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-400/20 to-green-400/20 rounded-xl p-6">
                  <div className="text-6xl font-black text-white/80 mb-4">250,000</div>
                  <div className="text-lg font-semibold">Lives lost annually due to medical information delays</div>
                </div>
              </div>
            </div>
          </div>

          {/* Solution */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Revolutionary Solution</h2>
            <div className="grid lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <div className="w-6 h-6 bg-blue-600 rounded"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Instant QR Access</h3>
                <p className="text-gray-700 leading-relaxed">
                  Single scan provides immediate access to critical medical data, eliminating identification delays.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                  <div className="w-6 h-6 bg-green-600 rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">AI Voice Assistant</h3>
                <p className="text-gray-700 leading-relaxed">
                  Medical information spoken in responder's language, ensuring clear communication under pressure.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <div className="w-6 h-6 bg-purple-600 rounded-lg"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Auto Notifications</h3>
                <p className="text-gray-700 leading-relaxed">
                  Emergency contacts instantly notified with location data when profile is accessed.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                  <div className="w-6 h-6 bg-orange-600 rounded-full"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Privacy Control</h3>
                <p className="text-gray-700 leading-relaxed">
                  Granular control over information visibility with medical professional verification tiers.
                </p>
              </div>
            </div>
          </div>

          {/* Technology Architecture */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Enterprise-Grade Technology</h2>
            <div className="bg-slate-900 rounded-2xl p-12 text-white">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <div className="w-8 h-8 bg-white rounded"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-4">Secure Infrastructure</h3>
                  <p className="text-slate-300 leading-relaxed">
                    FastAPI backend with PostgreSQL, Fernet encryption, and comprehensive audit logging.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <div className="w-8 h-8 bg-white rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-4">AI Integration</h3>
                  <p className="text-slate-300 leading-relaxed">
                    LeanMCP agent orchestration with AI/ML API for multilingual voice synthesis and processing.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <div className="w-8 h-8 bg-white rounded-lg"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-4">Modern Frontend</h3>
                  <p className="text-slate-300 leading-relaxed">
                    Next.js with responsive design, optimized for high-stress emergency situations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="mb-20">
            <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl p-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Security & Compliance</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-1">
                      <div className="w-4 h-4 bg-white rounded-sm"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">End-to-End Encryption</h3>
                      <p className="text-slate-600">All sensitive medical data protected with Fernet symmetric encryption</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-1">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">Access Control</h3>
                      <p className="text-slate-600">Multi-tier access system with medical professional verification</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-4 mt-1">
                      <div className="w-4 h-4 bg-white rounded"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">Audit Logging</h3>
                      <p className="text-slate-600">Complete access history with timestamp and responder identification</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-4 mt-1">
                      <div className="w-4 h-4 bg-white rounded-lg"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">Privacy Controls</h3>
                      <p className="text-slate-600">Granular user control over information visibility and sharing</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-white rounded-2xl p-12 shadow-sm border border-slate-200">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Secure Your Medical Information Today</h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Join the digital revolution in emergency medical response. Create your secure life passport in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/create-profile"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                Create Life Passport
              </a>
              <a 
                href="/emergency/demo"
                className="border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-bold py-4 px-8 rounded-xl transition-all duration-200 hover:bg-slate-50"
              >
                View Demo Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}