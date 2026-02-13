export interface EnhancementResult {
  brightness: number;
  contrast: number;
  saturation: number;
  description: string;
}

export interface AutoEnhanceOptions {
  style?: 'natural' | 'vibrant' | 'professional' | 'passport';
  targetBrightness?: number;
  targetContrast?: number;
}

/**
 * Analyzes an image and suggests optimal enhancement settings
 */
export async function analyzeImage(imageDataUrl: string): Promise<{
  averageBrightness: number;
  hasHighContrast: boolean;
  colorfulness: number;
}> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve({ averageBrightness: 128, hasHighContrast: false, colorfulness: 50 });
        return;
      }

      // Sample at reduced size for performance
      const sampleSize = 100;
      canvas.width = sampleSize;
      canvas.height = sampleSize;
      
      ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
      const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
      const data = imageData.data;

      let totalBrightness = 0;
      let totalSaturation = 0;
      let pixelCount = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Calculate brightness (perceived luminance)
        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
        totalBrightness += brightness;

        // Calculate saturation
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const saturation = max === 0 ? 0 : ((max - min) / max) * 100;
        totalSaturation += saturation;

        pixelCount++;
      }

      const averageBrightness = totalBrightness / pixelCount;
      const averageSaturation = totalSaturation / pixelCount;

      // Determine if image has high contrast
      const hasHighContrast = averageSaturation > 40;

      resolve({
        averageBrightness,
        hasHighContrast,
        colorfulness: averageSaturation,
      });
    };

    img.src = imageDataUrl;
  });
}

/**
 * Generates optimal enhancement settings based on style
 */
export function generateEnhancement(
  analysis: { averageBrightness: number; hasHighContrast: boolean; colorfulness: number },
  options: AutoEnhanceOptions = {}
): EnhancementResult {
  const { style = 'natural', targetBrightness = 120, targetContrast = 110 } = options;

  let brightness = 100;
  let contrast = 100;
  let saturation = 100;
  let description = '';

  const { averageBrightness, hasHighContrast, colorfulness } = analysis;

  // Adjust based on current brightness
  if (averageBrightness < 80) {
    brightness = 120; // Brighten dark images
  } else if (averageBrightness > 180) {
    brightness = 90; // Dim overly bright images
  } else {
    brightness = 100 + (targetBrightness - averageBrightness) / 5;
  }

  // Adjust contrast
  if (hasHighContrast) {
    contrast = 95; // Reduce harsh contrast
  } else {
    contrast = targetContrast;
  }

  // Style-specific adjustments
  switch (style) {
    case 'vibrant':
      saturation = Math.min(130, 100 + (50 - colorfulness) / 2);
      contrast = Math.max(contrast, 115);
      description = 'Enhanced colors and contrast for a vibrant look';
      break;

    case 'professional':
      saturation = 95; // Slightly muted
      contrast = 105;
      brightness = Math.min(brightness, 108);
      description = 'Professional, balanced adjustments';
      break;

    case 'passport':
      saturation = 100; // Neutral colors
      contrast = 105;
      brightness = 110; // Well-lit
      description = 'Optimized for passport photo requirements';
      break;

    case 'natural':
    default:
      saturation = 100 + (50 - colorfulness) / 4;
      description = 'Natural, subtle enhancements';
      break;
  }

  // Clamp values to valid ranges
  brightness = Math.max(50, Math.min(150, Math.round(brightness)));
  contrast = Math.max(50, Math.min(150, Math.round(contrast)));
  saturation = Math.max(0, Math.min(200, Math.round(saturation)));

  return { brightness, contrast, saturation, description };
}

/**
 * Auto-enhance image with specified style
 */
export async function autoEnhance(
  imageDataUrl: string,
  style: 'natural' | 'vibrant' | 'professional' | 'passport' = 'natural'
): Promise<EnhancementResult> {
  const analysis = await analyzeImage(imageDataUrl);
  return generateEnhancement(analysis, { style });
}
