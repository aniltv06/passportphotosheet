import { useState } from 'react';
import { QrCode, Download, User, Mail, Phone, Building, Link as LinkIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'motion/react';
import { Badge } from './ui/badge';
import { generateQRCode, generateVCardString, downloadQRCode } from '../utils/qrcode';

interface QRCodeGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string; // Changed from photoImage to match usage
}

export function QRCodeGenerator({ isOpen, onClose, imageUrl }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [website, setWebsite] = useState('');
  const [customText, setCustomText] = useState('');
  const [includePhoto, setIncludePhoto] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  // Compress image to tiny thumbnail for QR code embedding
  const compressImageForQR = async (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Create a tiny canvas (80x80 for passport photos)
        const canvas = document.createElement('canvas');
        const maxSize = 80; // Very small to fit in QR code

        // Calculate dimensions maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Draw and compress heavily
        ctx.drawImage(img, 0, 0, width, height);

        // Use very low quality (0.3 = 30%) to minimize size
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.3);

        // Extract base64 data without the data:image/jpeg;base64, prefix
        const base64Data = compressedDataUrl.split(',')[1];
        resolve(base64Data);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageUrl;
    });
  };

  const handleGenerateVCard = async () => {
    setIsCompressing(true);
    try {
      let photoData: string | undefined;

      // Compress photo if available and user wants to include it
      if (includePhoto && imageUrl) {
        photoData = await compressImageForQR(imageUrl);
      }

      const vcard = generateVCardString({
        firstName,
        lastName,
        email,
        phone,
        organization,
        photo: photoData, // Add photo data
      });

      const url = await generateQRCode(vcard, 300);
      setQrCodeUrl(url);
    } catch (error) {
      console.error('Error generating vCard with photo:', error);
      alert('Failed to generate QR code. Try without photo or with a smaller image.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleGenerateURL = async () => {
    const url = await generateQRCode(website, 300);
    setQrCodeUrl(url);
  };

  const handleGenerateText = async () => {
    const url = await generateQRCode(customText, 300);
    setQrCodeUrl(url);
  };

  const handleDownload = () => {
    if (qrCodeUrl) {
      downloadQRCode(qrCodeUrl, 'passport-qrcode.png');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gray-900/95 backdrop-blur-xl border-white/20 text-white">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-white">QR Code Generator</DialogTitle>
          </div>
        </DialogHeader>

        <div className="mt-6">
          <Tabs defaultValue="vcard" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 p-1 rounded-xl">
              <TabsTrigger 
                value="vcard"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-lg"
              >
                <User className="w-4 h-4 mr-2" />
                vCard
              </TabsTrigger>
              <TabsTrigger 
                value="url"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-lg"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                Website
              </TabsTrigger>
              <TabsTrigger 
                value="text"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-lg"
              >
                Text
              </TabsTrigger>
            </TabsList>

            {/* vCard Tab */}
            <TabsContent value="vcard" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-white/90 mb-2 block">
                    <User className="w-4 h-4 inline mr-2" />
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-white/10 border-white/20 text-white rounded-xl"
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-white/90 mb-2 block">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-white/10 border-white/20 text-white rounded-xl"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-white/90 mb-2 block">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white rounded-xl"
                  placeholder="john.doe@example.com"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-white/90 mb-2 block">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-white/10 border-white/20 text-white rounded-xl"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="organization" className="text-white/90 mb-2 block">
                  <Building className="w-4 h-4 inline mr-2" />
                  Organization
                </Label>
                <Input
                  id="organization"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="bg-white/10 border-white/20 text-white rounded-xl"
                  placeholder="Company Name"
                />
              </div>

              {/* Include Photo Option */}
              {imageUrl && (
                <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl border border-white/20 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white/30">
                        <img src={imageUrl} alt="Photo preview thumbnail" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <Label htmlFor="includePhoto" className="text-white font-medium cursor-pointer">
                          Include Photo in vCard
                        </Label>
                        <p className="text-xs text-white/60">80×80px compressed thumbnail</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      id="includePhoto"
                      checked={includePhoto}
                      onChange={(e) => setIncludePhoto(e.target.checked)}
                      className="w-5 h-5 rounded border-white/30 bg-white/10 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={handleGenerateVCard}
                disabled={isCompressing}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl disabled:opacity-50"
              >
                <QrCode className="w-4 h-4 mr-2" />
                {isCompressing ? 'Compressing Photo...' : 'Generate vCard QR Code'}
              </Button>
            </TabsContent>

            {/* URL Tab */}
            <TabsContent value="url" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="website" className="text-white/90 mb-2 block">
                  <LinkIcon className="w-4 h-4 inline mr-2" />
                  Website URL
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="bg-white/10 border-white/20 text-white rounded-xl"
                  placeholder="https://example.com"
                />
              </div>

              <Button
                onClick={handleGenerateURL}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Generate URL QR Code
              </Button>
            </TabsContent>

            {/* Text Tab */}
            <TabsContent value="text" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="customText" className="text-white/90 mb-2 block">
                  Custom Text
                </Label>
                <textarea
                  id="customText"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full h-32 bg-white/10 border border-white/20 text-white rounded-xl p-3 resize-none"
                  placeholder="Enter any text to encode in QR code..."
                />
              </div>

              <Button
                onClick={handleGenerateText}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Generate Text QR Code
              </Button>
            </TabsContent>
          </Tabs>

          {/* QR Code Display */}
          {qrCodeUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 p-8"
            >
              <div className="text-center">
                <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-400/50">
                  QR Code Generated Successfully!
                </Badge>
                
                <div className="inline-block bg-white p-6 rounded-2xl shadow-2xl mb-6">
                  <img src={qrCodeUrl} alt="Generated QR Code" className="w-64 h-64" />
                </div>

                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button>
                </div>

                <p className="text-sm text-white/60 mt-4">
                  Scan this QR code with your phone to access the information
                </p>
              </div>
            </motion.div>
          )}

          {/* Info Section */}
          <div className="mt-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl border border-white/20 p-4">
            <h4 className="text-white mb-2 flex items-center gap-2">
              <span className="text-xl">💡</span>
              Use Cases
            </h4>
            <ul className="text-sm text-white/80 space-y-1">
              <li>• Add QR code to passport photos for digital ID cards</li>
              <li>• Create business cards with contact information</li>
              <li>• Share portfolio or LinkedIn profile</li>
              <li>• Emergency contact information</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
