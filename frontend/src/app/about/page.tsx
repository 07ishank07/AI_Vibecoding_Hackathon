import Navigation from '../../components/Navigation';

export default function About() {
  return (
    <>
      <Navigation context="public" userType="public" currentPage="/about" />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              About CrisisLink<span className="text-red-600">.cv</span>
            </h1>
            <p className="text-xl text-gray-600">
              Saving lives through instant access to critical medical information
            </p>
          </div>

          {/* Problem Statement */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-red-800 mb-4">🚨 The Critical Problem</h2>
            <div className="text-red-700 space-y-3">
              <p className="text-lg font-semibold">250,000+ preventable deaths occur annually due to delayed access to medical information in emergencies.</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Emergency responders waste precious minutes trying to identify patients</li>
                <li>Critical allergies and medications are unknown during treatment</li>
                <li>Family members aren't notified quickly enough</li>
                <li>Language barriers prevent effective communication</li>
              </ul>
            </div>
          </div>

          {/* Solution */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">💡 Our Solution</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Instant Access</h3>
                <p className="text-gray-600 mb-4">
                  A simple QR code scan provides immediate access to critical medical information, 
                  eliminating delays in emergency care.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3">AI Voice Assistant</h3>
                <p className="text-gray-600 mb-4">
                  Medical information is spoken aloud in the responder's language, 
                  ensuring clear communication even in high-stress situations.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Automatic Notifications</h3>
                <p className="text-gray-600 mb-4">
                  Emergency contacts are instantly notified with location information 
                  when the profile is accessed.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Privacy Control</h3>
                <p className="text-gray-600">
                  Users control what information is publicly visible versus 
                  what requires medical professional verification.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🔄 How It Works</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">1</div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Create Your Life Passport</h3>
                  <p className="text-gray-600">Set up your medical profile with essential information, emergency contacts, and privacy preferences.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">2</div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Print & Carry Your QR Code</h3>
                  <p className="text-gray-600">Download and print your unique QR code. Keep it in your wallet, on your phone, or wear it as a medical alert.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">3</div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Emergency Access</h3>
                  <p className="text-gray-600">In an emergency, responders scan your QR code to instantly access your medical information.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">4</div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">AI Voice & Notifications</h3>
                  <p className="text-gray-600">Critical information is spoken aloud while your emergency contacts are automatically notified.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Technology */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🛠️ Technology Stack</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-lg p-4 mb-3">
                  <h3 className="font-semibold text-blue-800">Secure Backend</h3>
                </div>
                <p className="text-sm text-gray-600">Python FastAPI with encrypted data storage and PostgreSQL database</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 rounded-lg p-4 mb-3">
                  <h3 className="font-semibold text-green-800">AI Integration</h3>
                </div>
                <p className="text-sm text-gray-600">AI/ML API for voice synthesis and LeanMCP for intelligent agent orchestration</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 rounded-lg p-4 mb-3">
                  <h3 className="font-semibold text-purple-800">Modern Frontend</h3>
                </div>
                <p className="text-sm text-gray-600">Next.js with responsive design optimized for emergency situations</p>
              </div>
            </div>
          </div>

          {/* Security & Privacy */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">🔒 Security & Privacy</h2>
            <div className="text-blue-700 space-y-3">
              <p>Your medical information is protected with enterprise-grade security:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Encryption:</strong> All sensitive data is encrypted using Fernet symmetric encryption</li>
                <li><strong>Access Control:</strong> Two-tier access system with public and medical professional views</li>
                <li><strong>Audit Logging:</strong> Every access is logged with timestamp and responder information</li>
                <li><strong>Privacy Controls:</strong> You decide what information is publicly visible</li>
              </ul>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Create Your Life Passport?</h2>
            <p className="text-gray-600 mb-6">Join thousands who have already secured their emergency medical information.</p>
            <div className="space-x-4">
              <a 
                href="/create-profile"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
              >
                Get Started Now
              </a>
              <a 
                href="/guide"
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
              >
                Setup Guide
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}