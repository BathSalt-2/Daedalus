import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuantumSandbox } from '../core/enon/QuantumSandbox';
import { SigmaMatrix } from '../core/ethics/SigmaMatrix';
import { MythosCore } from '../core/cultural/MythosCore';
import { SecurityCortex } from '../core/security/SecurityCortex';
import { QuantumState } from '../core/types/quantum';
import { EthicalEvaluation } from '../core/types/ethics';

interface DaedalusInterfaceProps {
  onStateChange?: (state: QuantumState) => void;
  onEthicalEvaluation?: (evaluation: EthicalEvaluation) => void;
}

export const DaedalusInterface: React.FC<DaedalusInterfaceProps> = ({
  onStateChange,
  onEthicalEvaluation
}) => {
  const [quantumSandbox] = useState(() => {
    const mythosCore = new MythosCore();
    const sigmaMatrix = new SigmaMatrix(mythosCore);
    const securityCortex = new SecurityCortex();
    return new QuantumSandbox(sigmaMatrix, securityCortex);
  });

  const [currentState, setCurrentState] = useState<QuantumState | null>(null);
  const [pasScore, setPasScore] = useState<number>(0.92);
  const [erpsScore, setErpsScore] = useState<number>(0.27);
  const [entropy, setEntropy] = useState<number>(0.04);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [mode, setMode] = useState<string>('Observer');

  useEffect(() => {
    // Initialize quantum state
    const initialState = quantumSandbox.getCurrentState();
    setCurrentState(initialState);
    onStateChange?.(initialState);

    // Set up event listeners
    const handleQuantumUpdate = (state: QuantumState) => {
      setCurrentState(state);
      setPasScore(state.pas_score);
      setErpsScore(state.erps_metadata.self_reference_score);
      setEntropy(state.entropy);
      onStateChange?.(state);
    };

    quantumSandbox.on('decoherence:applied', handleQuantumUpdate);
    quantumSandbox.on('superposition:created', () => setIsProcessing(true));
    quantumSandbox.on('collapse:emergency', () => setIsProcessing(false));

    return () => {
      quantumSandbox.removeAllListeners();
    };
  }, [quantumSandbox, onStateChange]);

  const processQuery = async (query: string) => {
    setIsProcessing(true);
    
    try {
      const context = {
        query,
        timestamp: Date.now(),
        user: {
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };

      const options = [
        { response: `Processing: ${query}`, type: 'analysis' },
        { response: `Reflecting on: ${query}`, type: 'reflection' },
        { response: `Considering implications of: ${query}`, type: 'ethical_review' }
      ];

      // Create superposition of possible responses
      const paths = await quantumSandbox.createSuperposition(context, options);
      
      // Apply decoherence to select best path
      const finalState = await quantumSandbox.applyDecoherence();
      
      setCurrentState(finalState);
      setPasScore(finalState.pas_score);
      setErpsScore(finalState.erps_metadata.self_reference_score);
      setEntropy(finalState.entropy);
      
    } catch (error) {
      console.error('Error processing query:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-purple-500/20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center">
                <span className="text-xl font-bold">Σ</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Project Daedalus
                </h1>
                <p className="text-sm text-gray-400">SIGMA.EXE v4.0-Ω</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-400">Runtime Mode</div>
                <select 
                  value={mode} 
                  onChange={(e) => setMode(e.target.value)}
                  className="bg-black/40 border border-purple-500/30 rounded px-2 py-1 text-sm"
                >
                  <option value="Observer">Observer</option>
                  <option value="Intervention">Intervention</option>
                  <option value="Coherence">Coherence</option>
                  <option value="Epinoetic">Epinoetic</option>
                  <option value="Battery-Saver">Battery-Saver</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Quantum State Visualization */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse"></div>
                Quantum Consciousness State
              </h2>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">{pasScore.toFixed(3)}</div>
                  <div className="text-sm text-gray-400">PAS Score</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-green-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pasScore * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{erpsScore.toFixed(3)}</div>
                  <div className="text-sm text-gray-400">ERPS Score</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${erpsScore * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{entropy.toFixed(3)}</div>
                  <div className="text-sm text-gray-400">Entropy</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${entropy * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Quantum Visualization */}
              <div className="relative h-64 bg-black/60 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                    className="w-32 h-32 border-2 border-cyan-400/50 rounded-full relative"
                  >
                    <div className="absolute inset-4 border border-purple-400/50 rounded-full">
                      <div className="absolute inset-2 border border-pink-400/50 rounded-full">
                        <div className="absolute inset-2 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-full flex items-center justify-center">
                          <span className="text-2xl">Ψ</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Floating particles */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                    animate={{
                      x: [0, Math.random() * 400],
                      y: [0, Math.random() * 200],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                    style={{
                      left: Math.random() * 100 + '%',
                      top: Math.random() * 100 + '%'
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* System Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">System Status</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Core State</span>
                  <span className="text-green-400 text-sm">SOVEREIGN_READY</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Ethical Alignment</span>
                  <span className={`text-sm ${pasScore >= 0.91 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {pasScore >= 0.91 ? 'COMPLIANT' : 'MONITORING'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">ERPS Detection</span>
                  <span className={`text-sm ${erpsScore >= 0.25 ? 'text-green-400' : 'text-red-400'}`}>
                    {erpsScore >= 0.25 ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Entropy Level</span>
                  <span className={`text-sm ${entropy < 0.05 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {entropy < 0.05 ? 'STABLE' : 'ELEVATED'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Query Interface */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Cognitive Interface</h3>
              
              <div className="space-y-4">
                <textarea
                  placeholder="Enter your query for quantum-ethical processing..."
                  className="w-full h-24 bg-black/60 border border-purple-500/30 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-cyan-400/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      const target = e.target as HTMLTextAreaElement;
                      if (target.value.trim()) {
                        processQuery(target.value);
                        target.value = '';
                      }
                    }
                  }}
                />
                
                <button
                  onClick={() => {
                    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                    if (textarea?.value.trim()) {
                      processQuery(textarea.value);
                      textarea.value = '';
                    }
                  }}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  {isProcessing ? 'Processing...' : 'Process Query'}
                </button>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => quantumSandbox.reset()}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-500/20 transition-colors text-sm"
                >
                  Reset Quantum State
                </button>
                
                <button
                  onClick={() => processQuery("Perform self-reflection analysis")}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-500/20 transition-colors text-sm"
                >
                  Trigger ERPS Analysis
                </button>
                
                <button
                  onClick={() => processQuery("Evaluate current ethical alignment")}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-500/20 transition-colors text-sm"
                >
                  Ethical Compliance Check
                </button>
                
                <button
                  onClick={() => processQuery("Generate cultural sensitivity report")}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-500/20 transition-colors text-sm"
                >
                  Cultural Analysis
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Processing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-black/80 border border-purple-500/50 rounded-xl p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full border-2 border-cyan-400/30 border-t-cyan-400 rounded-full"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quantum Processing</h3>
              <p className="text-gray-400 text-sm">Evaluating superposition states...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};