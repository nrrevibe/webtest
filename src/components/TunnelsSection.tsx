import React from 'react';
import { 
  Link2, 
  ShieldCheck, 
  Globe, 
  Terminal, 
  ChevronRight, 
  Zap,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';

interface TunnelsSectionProps {
  darkMode: boolean;
}

export const TunnelsSection: React.FC<TunnelsSectionProps> = ({ darkMode }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('curl -sSL https://slim.sh/install | sh');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-widest"
        >
          <Zap className="w-3 h-3 fill-emerald-500" />
          Powered by Slim.sh
        </motion.div>
        <h2 className={`text-4xl font-display font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Audit Localhost with <span className="text-emerald-500">Slim Tunnels</span>
        </h2>
        <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
          Don't let local development stop your performance audits. Use Slim to create secure, instant tunnels for your local servers.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: ShieldCheck,
            title: 'Automatic HTTPS',
            desc: 'Slim automatically handles SSL certificates for your local .test domains.'
          },
          {
            icon: Globe,
            title: 'Public Tunnels',
            desc: 'Share your local work with a public .slim.show URL for remote auditing.'
          },
          {
            icon: Terminal,
            title: 'CLI First',
            desc: 'A powerful command-line interface that fits perfectly into your workflow.'
          }
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-8 rounded-[2.5rem] border transition-all hover:shadow-xl ${
              darkMode ? 'bg-slate-900 border-slate-800 hover:border-emerald-500/30' : 'bg-white border-gray-100 hover:border-emerald-200'
            }`}
          >
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
              <feature.icon className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Installation / CLI Section */}
      <div className={`rounded-[3rem] border overflow-hidden ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-12 space-y-8">
            <div className="space-y-4">
              <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Get Started in Seconds</h3>
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Install the Slim CLI and start your first tunnel. It's the easiest way to make your local site accessible to our audit engine.
              </p>
            </div>

            <div className={`p-4 rounded-2xl font-mono text-sm flex items-center justify-between group ${
              darkMode ? 'bg-slate-800 text-emerald-400' : 'bg-gray-100 text-emerald-700'
            }`}>
              <span className="truncate">curl -sSL https://slim.sh/install | sh</span>
              <button 
                onClick={handleCopy}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-200 text-gray-400'
                }`}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">1</div>
                <div>
                  <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Install Slim CLI</p>
                  <p className="text-xs text-gray-500 mt-1">Run the command above in your terminal.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">2</div>
                <div>
                  <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Start a Tunnel</p>
                  <p className="text-xs text-gray-500 mt-1">Run <code className="px-1 bg-emerald-500/10 rounded">slim share 8080</code> to get a public URL.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">3</div>
                <div>
                  <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Run Audit</p>
                  <p className="text-xs text-gray-500 mt-1">Paste your .slim.show URL into the dashboard.</p>
                </div>
              </div>
            </div>

            <a 
              href="https://slim.sh/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-500 hover:underline"
            >
              Read the full documentation
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className={`p-8 lg:p-12 flex items-center justify-center ${
            darkMode ? 'bg-slate-800/50' : 'bg-gray-50'
          }`}>
            <div className={`w-full aspect-video rounded-3xl shadow-2xl overflow-hidden border ${
              darkMode ? 'bg-slate-950 border-slate-800' : 'bg-black border-gray-800'
            }`}>
              <div className="p-4 border-b border-white/10 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                <div className="ml-4 text-[10px] font-mono text-white/30">slim share 8080</div>
              </div>
              <div className="p-6 font-mono text-xs space-y-2">
                <p className="text-emerald-500">➜  ~ slim share 8080</p>
                <p className="text-white/60">Starting tunnel...</p>
                <p className="text-white/60">Local:    http://localhost:8080</p>
                <p className="text-white/60">Remote:   <span className="text-emerald-400 underline">https://my-app.slim.show</span></p>
                <p className="text-white/60">Status:   <span className="text-emerald-500">Online</span></p>
                <div className="pt-4 space-y-1">
                  <p className="text-white/40"># Ready for auditing!</p>
                  <p className="text-white/40"># Copy the remote URL to Slim Audit Dashboard</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
