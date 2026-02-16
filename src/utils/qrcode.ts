// QR Code generation utility
export interface QRCodeData {
  type: 'vcard' | 'url' | 'text' | 'contact';
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    organization?: string;
    url?: string;
    text?: string;
    photo?: string; // Base64 encoded photo data
  };
}

export function generateVCardString(data: QRCodeData['data']): string {
  let vcard = `BEGIN:VCARD
VERSION:3.0
FN:${data.firstName || ''} ${data.lastName || ''}
N:${data.lastName || ''};${data.firstName || ''};;;
EMAIL:${data.email || ''}
TEL:${data.phone || ''}
ORG:${data.organization || ''}`;

  // Add photo if provided
  if (data.photo) {
    vcard += `\nPHOTO;ENCODING=B;TYPE=JPEG:${data.photo}`;
  }

  vcard += `\nEND:VCARD`;

  return vcard;
}

export function generateQRCodeDataURL(text: string, size: number = 200): Promise<string> {
  return new Promise((resolve) => {
    // Use qr-code-styling library or QRCode.js
    // For now, we'll use a data URL approach with canvas
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      resolve('');
      return;
    }

    // Simple QR code placeholder - in production use proper QR library
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    ctx.fillStyle = '#000000';
    // This is a simplified version - use qrcode.js or similar in production
    const qrText = text.substring(0, 50);
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('QR Code', size / 2, size / 2);
    ctx.fillText(qrText, size / 2, size / 2 + 20);
    
    resolve(canvas.toDataURL());
  });
}

// We'll use the qrcode library
import QRCode from 'qrcode';

export async function generateQRCode(text: string, size: number = 200): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
  } catch (error) {
    console.error('QR Code generation failed:', error);
    return '';
  }
}

export function downloadQRCode(dataUrl: string, filename: string = 'qrcode.png') {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
