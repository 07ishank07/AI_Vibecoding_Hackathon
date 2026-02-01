'use client'

import { useState, useEffect } from 'react'
import { QrCode, Download, Share2, Printer } from 'lucide-react'

interface QRCodeDisplayProps {
  username: string
}

export default function QRCodeDisplay({ username }: QRCodeDisplayProps) {
  const [qrData, setQrData] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const generateQR = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:8000/api/qr/generate/${username}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })
      
      if (response.ok) {
        const data = await response.json()
        setQrData(data.qr_code)
      }
    } catch (err) {
      console.error('QR generation failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const downloadQR = () => {
    if (!qrData) return
    const link = document.createElement('a')
    link.href = qrData
    link.download = `${username}-emergency-qr.png`
    link.click()
  }

  const printQR = () => {
    if (!qrData) return
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Emergency QR - ${username}</title></head>
          <body style="text-align:center;padding:20px;font-family:Arial;">
            <h1>Emergency QR Code</h1>
            <h2>${username}</h2>
            <img src="${qrData}" style="max-width:300px;" />
            <p>Scan for emergency medical information</p>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  useEffect(() => {
    generateQR()
  }, [username])

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 shadow-sm border border-blue-100">
      <div className="flex items-center gap-3 mb-4">
        <QrCode className="w-6 h-6 text-blue-500" />
        <h3 className="text-lg font-bold text-gray-900">Emergency QR Code</h3>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-500/30 border-t-green-500 rounded-full animate-spin"></div>
        </div>
      ) : qrData ? (
        <>
          <div className="text-center mb-4">
            <img 
              src={qrData} 
              alt="Emergency QR Code"
              className="mx-auto border border-gray-300 rounded-lg"
              style={{ maxWidth: '200px' }}
            />
          </div>
          
          <div className="text-center text-sm text-gray-600 mb-4">
            <p>Emergency URL: crisislink.cv/emergency/{username}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={downloadQR}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              Save
            </button>
            
            <button 
              onClick={printQR}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            
            <button 
              onClick={() => navigator.clipboard.writeText(`https://crisislink.cv/emergency/${username}`)}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-600">
          <p>Failed to generate QR code</p>
          <button 
            onClick={generateQR}
            className="mt-2 text-blue-600 hover:text-green-600 text-sm"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  )
}