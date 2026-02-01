import Navigation from '../components/Navigation';

export default function Home() {
  return (
    <>
      <Navigation context="public" userType="public" currentPage="/" />
      <div className="min-h-screen bg-white text-gray-900">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-white"></div>
          <div className="relative max-w-6xl mx-auto px-6 py-24">
            <div className="text-center mb-16">
              <div className="inline-block border border-blue-500/30 rounded-full px-4 py-2 mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent text-sm font-medium">EMERGENCY MEDICAL SYSTEM</span>
              </div>
              <h1 className="text-6xl font-black mb-6 tracking-tight">
                Crisis<span className="text-blue-500">Link</span><span className="text-green-500">.cv</span>
              </h1>
              <p className="text-2xl text-gray-300 mb-4 font-light">Your Digital Life Passport</p>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Instant medical access through QR technology with AI-powered voice assistance and automated emergency notifications
              </p>
            </div>

            {/* Problem & Solution Cards */}
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 shadow-sm border border-blue-100">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-xl flex items-center justify-center mb-6">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Critical Problem</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Over 250,000 preventable deaths occur annually due to delayed access to critical medical information during emergencies.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 shadow-sm border border-green-100">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-6">
                  <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Our Solution</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  QR code scanning provides instant medical data access with multilingual AI voice assistance and automatic family notification.
                </p>
              </div>
            </div>

            {/* Process Flow */}
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 mb-16 shadow-sm border border-blue-100">
              <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Emergency Response Process</h3>
              <div className="grid md:grid-cols-5 gap-6">
                {[
                  { step: "01", title: "Create Profile", desc: "Set up medical information" },
                  { step: "02", title: "Generate QR", desc: "Print for wallet or ID" },
                  { step: "03", title: "Emergency Scan", desc: "Responder scans code" },
                  { step: "04", title: "AI Voice", desc: "Medical summary spoken" },
                  { step: "05", title: "Auto Notify", desc: "Family contacted instantly" }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-sm">{item.step}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="text-center space-x-6">
              <a 
                href="/create-profile" 
                className="inline-block bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                Create Life Passport
              </a>
              <a 
                href="/emergency/demo" 
                className="inline-block border border-slate-600 hover:border-slate-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 hover:bg-slate-800"
              >
                View Demo Profile
              </a>
            </div>

            {/* Tech Stack */}
            <div className="mt-20 text-center">
              <div className="inline-flex items-center space-x-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-full px-8 py-4 shadow-sm border border-blue-100">
                <span className="text-gray-600 text-sm font-medium">POWERED BY</span>
                <span className="text-gray-900 font-semibold">Daytona</span>
                <span className="text-gray-900 font-semibold">LeanMCP</span>
                <span className="text-gray-900 font-semibold">AI/ML API</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}