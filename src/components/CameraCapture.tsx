import { useState, useRef, useEffect } from 'react';
import { Camera, X, RotateCw, Circle, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from './ui/badge';

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageData: string) => void;
}

export function CameraCapture({ isOpen, onClose, onCapture }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 1920 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setCameraError('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flip horizontally for selfie mode
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/png');
    setCapturedImage(imageData);
  };

  const handleCountdownCapture = () => {
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          handleCapture();
          return null;
        }
        return prev! - 1;
      });
    }, 1000);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      setCapturedImage(null);
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    setCapturedImage(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden bg-gray-900/95 backdrop-blur-xl border-white/20 text-white p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <DialogTitle className="text-white">Camera Capture</DialogTitle>
            </div>
            <Button
              onClick={toggleCamera}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl"
            >
              <RotateCw className="w-4 h-4 mr-2" />
              Flip
            </Button>
          </div>
        </DialogHeader>

        <div className="relative aspect-[3/4] bg-black">
          {cameraError ? (
            <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
              <div>
                <Camera className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <p className="text-white/80">{cameraError}</p>
                <Button
                  onClick={startCamera}
                  className="mt-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured photo from camera"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Guidelines */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] aspect-[3/4] border-2 border-cyan-400/60 rounded-2xl">
                  <div className="absolute top-[15%] left-0 right-0 h-0.5 bg-cyan-400/60" />
                  <div className="absolute top-[60%] left-0 right-0 h-0.5 bg-cyan-400/60" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-cyan-400/90 text-white text-xs px-3 py-1 rounded-b-lg">
                    Align face within frame
                  </div>
                </div>
              </div>

              {/* Countdown */}
              <AnimatePresence>
                {countdown !== null && (
                  <motion.div
                    initial={{ scale: 2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                  >
                    <div className="text-white text-9xl font-bold">{countdown}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        <div className="p-6 space-y-4">
          {capturedImage ? (
            <div className="flex gap-3">
              <Button
                onClick={handleRetake}
                variant="outline"
                className="flex-1 bg-white/5 hover:bg-white/10 text-white border-white/20 rounded-xl"
              >
                <X className="w-4 h-4 mr-2" />
                Retake
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl"
              >
                <Check className="w-4 h-4 mr-2" />
                Use Photo
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                onClick={handleCountdownCapture}
                variant="outline"
                className="flex-1 bg-white/5 hover:bg-white/10 text-white border-white/20 rounded-xl"
              >
                <span className="mr-2">⏱️</span>
                3s Timer
              </Button>
              <Button
                onClick={handleCapture}
                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-xl"
              >
                <Circle className="w-4 h-4 mr-2 fill-current" />
                Capture
              </Button>
            </div>
          )}

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-white/20 p-4">
            <div className="flex items-start gap-3">
              <Badge className="bg-cyan-500/30 text-cyan-200 border-cyan-400/50 mt-0.5">
                Tips
              </Badge>
              <div className="text-sm text-white/80 space-y-1">
                <p>• Position your face within the guidelines</p>
                <p>• Ensure good lighting from the front</p>
                <p>• Use timer for hands-free capture</p>
                <p>• Flip camera to use back camera</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
