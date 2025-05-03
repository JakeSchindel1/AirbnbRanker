import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [accessAttempts, setAccessAttempts] = useState(0);
  const [ipAddress, setIpAddress] = useState('');
  const navigate = useNavigate();

  // Generate fake IP address
  useEffect(() => {
    const randomIP = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    setIpAddress(randomIP);
  }, []);

  // Simple authentication handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    setAccessAttempts(prev => prev + 1);
    
    // For demonstration purposes, use a simple check
    if (password === 'jerryfan') {
      // Store authentication state in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      
      // Navigate to the main app
      navigate('/app');
    } else {
      setError(`ACCESS DENIED (ATTEMPT #${accessAttempts + 1})`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-green-500 font-mono">
      <div className="w-full max-w-md p-4 bg-black border border-green-500">
        <div className="text-center mb-6">
          <pre className="text-xs mb-2">
{`
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⢀⣀⡀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠴⠒⠈⠉⠁⠀⠀⠀⠀⠀⠀⠉⠁⠲⠠⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⡴⠋⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⠀⠀⠀⠀⠀⠁⠑⡄⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⡰⠋⠀⠀⣀⣤⣶⣶⣋⣟⣿⣿⣿⣿⣿⣿⣿⣿⣿⡷⠶⡄⠈⠑⢄⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⡸⠀⠀⣴⡾⠗⠋⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢳⡄⠀⢡⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠇⢀⣾⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣆⠈⡄⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣾⡏⠀⠀⢀⣀⣤⣤⣤⣀⠀⠀⠀⠀⠀⣀⣤⣤⣤⣀⡀⠀⠀⢸⣿⡄⡇⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣰⣿⠃⠀⣴⣿⣿⡿⠿⠿⠟⠀⠀⠀⠀⠀⠻⠿⠿⢿⣿⣿⣦⠀⠀⣿⡧⠃⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣿⣿⠀⠀⠈⠉⣠⡤⠤⣄⡀⠀⠀⠀⠀⠀⠀⣠⠤⠤⣄⠉⠉⠀⠀⣿⣿⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣼⣿⠀⠀⠀⡞⣡⣾⡶⣦⠱⠀⠀⠀⠀⠀⠎⣰⣶⡶⣌⠳⠀⠀⠀⢿⣯⡀⠀⠀⠀⠀
⠀⠀⠀⠀⣾⠈⡟⠀⠀⠁⡄⢿⣿⣿⣿⢀⠀⠀⠀⠀⠈⡀⣿⣿⣿⡿⢠⠀⠀⠀⢸⠋⢱⠀⠀⠀⠀
⠀⠀⠀⠀⠟⠀⡇⠀⠀⠀⠈⠢⠉⠉⠤⠊⠄⠀⠀⠀⠀⡑⠤⠉⠉⠴⠃⠀⠀⠀⢸⠀⢸⠀⠀⠀⠀
⠀⠀⠀⠀⠘⡄⡇⠀⠀⠀⠀⠀⠀⣀⣠⣬⣧⢀⣀⡀⣴⣧⣄⣀⠀⠀⠀⠀⠀⠀⢸⢀⠂⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠈⢱⠀⠀⣀⣀⣤⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣤⣄⣀⠀⠀⡞⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢸⠀⠀⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⡇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠉⠉⠙⢿⣿⣿⣭⣬⣭⣿⣿⡿⠏⠉⠉⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠐⠹⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⠟⢃⠀⠀⠀⠀⠀
⠀⠀⠀⠀⡠⢅⠀⠈⠑⠢⢄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡠⠔⠊⠁⠀⡨⢄⡀⠀⠀⠀
⠀⠀⡠⠊⠀⠀⠣⡀⠀⠀⠀⠀⠉⠐⠒⠀⢤⣄⣀⣠⡤⠄⠒⠂⠉⠀⠀⠀⠀⠀⡔⠁⠀⠑⢆⠀⠀
⠀⡜⠀⠀⠀⠀⠀⠈⠢⢀⠀⠀⠀⠀⢀⡰⣿⣿⣿⣿⣿⠦⡀⠀⠀⠀⠀⠀⡠⠊⠀⠀⠀⠀⠀⢡⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀
`}
          </pre>
          <div className="text-xs text-red-500 mb-2 animate-pulse">
            WARNING: UNAUTHORIZED ACCESS IS PROHIBITED
          </div>
          <div className="text-xs text-green-400 mb-2">
            CONNECTION ESTABLISHED: {ipAddress}
          </div>
          <div className="text-xs text-yellow-500 mb-4">
            SESSION MONITORED {'>>'} ENTER CREDENTIALS TO PROCEED
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-1 bg-black border border-red-500 text-red-500 text-center animate-pulse">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-center">
            <div className="text-xs text-left mb-1">PASSKEY:</div>
            <input
              id="password"
              type="password"
              className="w-full p-2 border border-green-500 bg-black text-green-500 text-center font-mono"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
          </div>
          
          <div className="text-center">
            <button
              type="submit"
              className="w-1/2 py-1 px-2 bg-black hover:bg-green-900 text-green-500 border border-green-500 font-mono"
            >
              AUTHENTICATE
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-xs text-green-500">
          <div className="flex justify-between mb-1">
            <span>SECURITY LEVEL:</span>
            <span>MAXIMUM</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>SYSTEM:</span>
            <span>SECURE</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>LOCATION TRACKING:</span>
            <span className="text-red-500 animate-pulse">ACTIVE</span>
          </div>
          <div className="text-center mt-4 text-xs text-yellow-500">
            {`[SYSTEM MESSAGE: THIS IS A HIGHLY SECURED AREA]`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 