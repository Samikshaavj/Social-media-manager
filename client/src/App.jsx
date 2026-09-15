import { useState, useEffect } from 'react'
import axios from 'axios'
import { Activity, Server } from 'lucide-react'
import './App.css'

function App() {
  const [health, setHealth] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Basic test of backend communication
    axios.get('http://localhost:5000/api/health')
      .then(response => {
        setHealth(response.data)
      })
      .catch(err => {
        console.error("Backend connection failed:", err);
        setError("Could not connect to backend")
      })
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl p-8 max-w-md w-full shadow-2xl border border-slate-700">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-600/20 p-4 rounded-full">
            <Activity className="w-12 h-12 text-indigo-400" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center text-white mb-2">Social-Vibe</h1>
        <p className="text-slate-400 text-center mb-8">Unified Social Media Management</p>
        
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <Server className="w-5 h-5 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">System Status</h2>
          </div>
          
          {health ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-emerald-400 font-mono text-sm">Backend Connected (Status: {health.status})</span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-red-400 font-mono text-sm">{error}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
              <span className="text-yellow-400 font-mono text-sm">Connecting to backend...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
