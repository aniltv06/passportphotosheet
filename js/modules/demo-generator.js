/**
 * Demo Photo Generator Module
 * Generates a sample passport-style photo for demonstration
 */

/**
 * Generate a demo passport photo
 * @returns {Promise<HTMLImageElement>} Generated demo image
 */
export async function generateDemoPhoto() {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 600, 600);
        gradient.addColorStop(0, '#e8f4f8');
        gradient.addColorStop(1, '#d4e8f0');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 600, 600);

        // Draw face components
        drawHead(ctx);
        drawHair(ctx);
        drawFacialFeatures(ctx);
        drawNeckAndShoulders(ctx);

        // Convert canvas to image
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = canvas.toDataURL('image/png');
    });
}

/**
 * Draw head
 */
function drawHead(ctx) {
    // Head
    ctx.fillStyle = '#ffd4a3';
    ctx.beginPath();
    ctx.ellipse(300, 350, 130, 135, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = '#f5c897';
    // Left ear
    ctx.beginPath();
    ctx.ellipse(175, 330, 18, 35, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e8b885';
    ctx.beginPath();
    ctx.ellipse(180, 330, 8, 20, -0.15, 0, Math.PI * 2);
    ctx.fill();

    // Right ear
    ctx.fillStyle = '#f5c897';
    ctx.beginPath();
    ctx.ellipse(425, 330, 18, 35, 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e8b885';
    ctx.beginPath();
    ctx.ellipse(420, 330, 8, 20, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Face shading for depth
    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    ctx.beginPath();
    ctx.ellipse(210, 350, 40, 100, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(390, 350, 40, 100, 0.2, 0, Math.PI * 2);
    ctx.fill();
}

/**
 * Draw hair
 */
function drawHair(ctx) {
    ctx.fillStyle = '#4a3428';

    // Main hair mass
    ctx.beginPath();
    ctx.ellipse(300, 200, 155, 135, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair sides
    ctx.beginPath();
    ctx.ellipse(200, 280, 45, 75, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(400, 280, 45, 75, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Front hairline
    ctx.beginPath();
    ctx.moveTo(230, 235);
    ctx.quadraticCurveTo(265, 250, 300, 252);
    ctx.quadraticCurveTo(335, 250, 370, 235);
    ctx.quadraticCurveTo(340, 218, 300, 215);
    ctx.quadraticCurveTo(260, 218, 230, 235);
    ctx.fill();

    // Hair texture
    ctx.strokeStyle = '#3a2820';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    // Left side strands
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(235 + i * 15, 240);
        ctx.quadraticCurveTo(245 + i * 15, 260, 240 + i * 15, 280);
        ctx.stroke();
    }

    // Right side strands
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(325 + i * 15, 240);
        ctx.quadraticCurveTo(335 + i * 15, 260, 340 + i * 15, 280);
        ctx.stroke();
    }
}

/**
 * Draw facial features
 */
function drawFacialFeatures(ctx) {
    // Eyebrows
    ctx.fillStyle = '#3a2820';
    ctx.beginPath();
    ctx.ellipse(255, 300, 25, 4, -0.09, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(345, 300, 25, 4, 0.09, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    drawEyes(ctx);

    // Nose
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.beginPath();
    ctx.ellipse(300, 375, 4, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(300, 350);
    ctx.lineTo(300, 373);
    ctx.stroke();

    // Mouth
    ctx.strokeStyle = '#d4766a';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(300, 400, 24, 0, Math.PI, false);
    ctx.stroke();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(290, 400);
    ctx.lineTo(310, 400);
    ctx.stroke();

    // Cheeks
    ctx.fillStyle = 'rgba(255, 182, 193, 0.4)';
    ctx.beginPath();
    ctx.ellipse(220, 385, 16, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(380, 385, 16, 11, 0, 0, Math.PI * 2);
    ctx.fill();
}

/**
 * Draw eyes
 */
function drawEyes(ctx) {
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#ffffff';

    // Left eye
    ctx.beginPath();
    ctx.ellipse(255, 335, 24, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Right eye
    ctx.beginPath();
    ctx.ellipse(345, 335, 24, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Iris
    const irisGradient = ctx.createRadialGradient(255, 340, 0, 255, 340, 16);
    irisGradient.addColorStop(0, '#4a90e2');
    irisGradient.addColorStop(1, '#2e5c8a');
    ctx.fillStyle = irisGradient;
    ctx.beginPath();
    ctx.arc(255, 340, 16, 0, Math.PI * 2);
    ctx.fill();

    const irisGradient2 = ctx.createRadialGradient(345, 340, 0, 345, 340, 16);
    irisGradient2.addColorStop(0, '#4a90e2');
    irisGradient2.addColorStop(1, '#2e5c8a');
    ctx.fillStyle = irisGradient2;
    ctx.beginPath();
    ctx.arc(345, 340, 16, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(255, 340, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(345, 340, 8, 0, Math.PI * 2);
    ctx.fill();

    // Eye shine
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(250, 333, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(340, 333, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(260, 345, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(350, 345, 3, 0, Math.PI * 2);
    ctx.fill();
}

/**
 * Draw neck and shoulders
 */
function drawNeckAndShoulders(ctx) {
    // Neck
    ctx.fillStyle = '#ffc999';
    ctx.beginPath();
    ctx.moveTo(250, 495);
    ctx.lineTo(250, 545);
    ctx.quadraticCurveTo(300, 565, 350, 545);
    ctx.lineTo(350, 495);
    ctx.closePath();
    ctx.fill();

    // Shoulders/Shirt
    ctx.fillStyle = '#4a6fa5';
    ctx.beginPath();
    ctx.moveTo(0, 600);
    ctx.quadraticCurveTo(100, 510, 250, 535);
    ctx.lineTo(250, 550);
    ctx.quadraticCurveTo(300, 565, 350, 550);
    ctx.lineTo(350, 535);
    ctx.quadraticCurveTo(500, 510, 600, 600);
    ctx.lineTo(600, 600);
    ctx.lineTo(0, 600);
    ctx.closePath();
    ctx.fill();

    // Collar
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(260, 550);
    ctx.lineTo(270, 590);
    ctx.lineTo(330, 590);
    ctx.lineTo(340, 550);
    ctx.closePath();
    ctx.fill();
}
