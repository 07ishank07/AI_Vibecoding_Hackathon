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
      const response = await fetch(`/api/qr/generate/${username}`, {
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
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <QrCode className="w-6 h-6 text-red-500" />
        <h3 className="text-lg font-bold text-white">Emergency QR Code</h3>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
        </div>
      ) : qrData ? (
        <>
          <div className="text-center mb-4">
            <img 
              src={qrData} 
              alt="Emergency QR Code"
              className="mx-auto border border-slate-600 rounded-lg"
              style={{ maxWidth: '200px' }}
            />
          </div>
          
          <div className="text-center text-sm text-slate-400 mb-4">
            <p>Emergency URL: crisislink.cv/emergency/{username}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={downloadQR}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              Save
            </button>
            
            <button 
              onClick={printQR}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            
            <button 
              onClick={() => navigator.clipboard.writeText(`https://crisislink.cv/emergency/${username}`)}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-slate-400">
          <p>Failed to generate QR code</p>
          <button 
            onClick={generateQR}
            className="mt-2 text-red-400 hover:text-red-300 text-sm"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  )
}