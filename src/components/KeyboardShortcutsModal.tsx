import { X, Keyboard } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const shortcuts = [
    {
      category: 'Zoom',
      items: [
        { keys: ['+', '='], description: 'Zoom in' },
        { keys: ['-'], description: 'Zoom out' },
      ],
    },
    {
      category: 'Rotation',
      items: [
        { keys: [']'], description: 'Rotate clockwise' },
        { keys: ['['], description: 'Rotate counter-clockwise' },
      ],
    },
    {
      category: 'Position',
      items: [
        { keys: ['↑'], description: 'Move photo up' },
        { keys: ['↓'], description: 'Move photo down' },
        { keys: ['←'], description: 'Move photo left' },
        { keys: ['→'], description: 'Move photo right' },
      ],
    },
    {
      category: 'Other',
      items: [
        { keys: ['Ctrl/Cmd', 'R'], description: 'Reset all adjustments' },
        { keys: ['?'], description: 'Show this help dialog' },
      ],
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Keyboard className="w-5 h-5 text-white" />
            </div>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {shortcuts.map((section) => (
            <div key={section.category}>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-gray-700">{item.description}</span>
                    <div className="flex gap-2">
                      {item.keys.map((key, keyIndex) => (
                        <div key={keyIndex} className="flex items-center gap-1">
                          {keyIndex > 0 && (
                            <span className="text-gray-400 text-xs">+</span>
                          )}
                          <Badge
                            variant="outline"
                            className="font-mono px-2 py-1 bg-white border-2 border-gray-300 text-gray-700"
                          >
                            {key}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white">💡</span>
            </div>
            <div>
              <h4 className="text-blue-900 mb-1">Pro Tip</h4>
              <p className="text-sm text-blue-800">
                You can also drag the photo with your mouse to reposition it. 
                Use these keyboard shortcuts for precise adjustments!
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
