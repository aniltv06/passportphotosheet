import { useState, useEffect } from 'react';
import { History, Trash2, Download, RotateCcw, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from './ui/badge';
import { getHistory, deleteHistoryItem, clearHistory, PhotoSession } from '../utils/history';
import { formatDistanceToNow } from 'date-fns';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadSession: (session: PhotoSession) => void;
}

export function HistoryPanel({ isOpen, onClose, onLoadSession }: HistoryPanelProps) {
  const [history, setHistory] = useState<PhotoSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<PhotoSession | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = () => {
    setHistory(getHistory());
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteHistoryItem(id);
    loadHistory();
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      clearHistory();
      loadHistory();
    }
  };

  const handleLoad = (session: PhotoSession) => {
    onLoadSession(session);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden bg-gray-900/95 backdrop-blur-xl border-white/20 text-white flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <History className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-white">Edit History</DialogTitle>
                <p className="text-sm text-white/60">
                  {history.length} {history.length === 1 ? 'session' : 'sessions'} saved
                </p>
              </div>
            </div>
            {history.length > 0 && (
              <Button
                onClick={handleClearAll}
                variant="outline"
                size="sm"
                className="bg-red-500/20 border-red-400/50 text-red-300 hover:bg-red-500/30 rounded-xl"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto mt-6 pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {history.length === 0 ? (
            <div className="text-center py-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                  <History className="w-12 h-12 text-white/40" />
                </div>
                <p className="text-xl text-white mb-2">No History Yet</p>
                <p className="text-sm text-white/60">
                  Your edited photos will appear here for quick access
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {history.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSession(session)}
                      className="w-full bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border-2 border-white/20 hover:border-white/40 overflow-hidden transition-all"
                    >
                      {/* Thumbnail */}
                      <div className="aspect-[3/4] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 relative overflow-hidden">
                        <img
                          src={session.thumbnail}
                          alt={`Photo session from ${new Date(session.timestamp).toLocaleDateString()}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Delete button */}
                        <button
                          onClick={(e) => handleDelete(session.id, e)}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>

                      {/* Info */}
                      <div className="p-3 text-left">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-indigo-500/30 text-indigo-200 border-indigo-400/50 text-xs">
                            {session.settings.passportSize}
                          </Badge>
                          <span className="text-xs text-white/60">
                            {formatDistanceToNow(session.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                        <div className="flex gap-1 text-xs text-white/70">
                          <span>Z: {session.settings.zoom}%</span>
                          <span>•</span>
                          <span>R: {session.settings.rotation}°</span>
                        </div>
                      </div>
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Session Detail Modal */}
        {selectedSession && (
          <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
            <DialogContent className="max-w-2xl bg-gray-900/95 backdrop-blur-xl border-white/20 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Session Details</DialogTitle>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                {/* Preview */}
                <div>
                  <img
                    src={selectedSession.thumbnail}
                    alt={`Session preview from ${new Date(selectedSession.timestamp).toLocaleDateString()}`}
                    className="w-full rounded-2xl shadow-2xl border border-white/20"
                  />
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white/80 text-sm mb-3">Settings</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-white/60">Size</span>
                        <Badge className="bg-white/20 text-white border-white/30">
                          {selectedSession.settings.passportSize}
                        </Badge>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-white/60">Background</span>
                        <span className="text-white">{selectedSession.settings.backgroundColor}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-white/60">Zoom</span>
                        <span className="text-white">{selectedSession.settings.zoom}%</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-white/60">Rotation</span>
                        <span className="text-white">{selectedSession.settings.rotation}°</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-white/60">Brightness</span>
                        <span className="text-white">{selectedSession.settings.brightness}%</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-white/60">Contrast</span>
                        <span className="text-white">{selectedSession.settings.contrast}%</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-white/60">Created</span>
                        <span className="text-white text-xs">
                          {formatDistanceToNow(selectedSession.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => handleLoad(selectedSession)}
                      className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Load Session
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}
