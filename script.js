class WrappingPaperTear {
    constructor() {
        this.canvas = document.getElementById('wrapping-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.giftImage = document.getElementById('gift-image');
        this.instructions = document.querySelector('.instructions');
        
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.totalPixels = 0;
        this.erasedPixels = 0;
        this.erasedPercentage = 0;
        this.confettiParticles = [];
        this.confettiActive = false;
        
        this.setupCanvas();
        this.setupEventListeners();
        this.startConfettiAnimation();
    }
    
    setupCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        // Set canvas size to match container
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Ensure canvas covers the entire container
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        
        // Calculate total pixels for percentage tracking
        this.totalPixels = this.canvas.width * this.canvas.height;
        
        // Create the initial wrapping paper with a small delay to ensure proper sizing
        setTimeout(() => {
            this.createWrappingPaper();
        }, 10);
    }
    
    createWrappingPaper() {
        // Clear the canvas first
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Create a colorful wrapping paper pattern
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add decorative patterns
        this.addWrappingPattern();
    }
    
    addWrappingPattern() {
        const patternSize = 40;
        const colors = ['#f39c12', '#e67e22', '#d35400', '#c0392b'];
        
        // Draw diagonal stripes
        for (let i = 0; i < this.canvas.width + this.canvas.height; i += patternSize) {
            this.ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i - this.canvas.height, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Add some decorative circles
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const radius = Math.random() * 15 + 5;
            
            this.ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            this.ctx.globalAlpha = 0.7;
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.globalAlpha = 1;
        
        // Add some sparkle effects
        this.addSparkles();
    }
    
    addSparkles() {
        this.ctx.fillStyle = '#f1c40f';
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 4 + 2;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, y - size);
            this.ctx.lineTo(x + size, y);
            this.ctx.lineTo(x, y + size);
            this.ctx.lineTo(x - size, y);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }
    
    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));
        
        // Touch events
        this.canvas.addEventListener('touchstart', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchend', this.stopDrawing.bind(this));
        
        // Prevent default touch behaviors
        this.canvas.addEventListener('touchstart', (e) => e.preventDefault());
        this.canvas.addEventListener('touchmove', (e) => e.preventDefault());
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.setupCanvas();
        });
    }
    
    getEventPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        if (e.touches && e.touches[0]) {
            return {
                x: (e.touches[0].clientX - rect.left) * scaleX,
                y: (e.touches[0].clientY - rect.top) * scaleY
            };
        } else {
            return {
                x: (e.clientX - rect.left) * scaleX,
                y: (e.clientY - rect.top) * scaleY
            };
        }
    }
    
    handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                         e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }
    
    startDrawing(e) {
        this.isDrawing = true;
        const pos = this.getEventPos(e);
        this.lastX = pos.x;
        this.lastY = pos.y;
        
        // Hide instructions on first interaction
        if (!this.instructions.classList.contains('hidden')) {
            this.instructions.classList.add('hidden');
        }
    }
    
    draw(e) {
        if (!this.isDrawing) return;
        
        const pos = this.getEventPos(e);
        
        // Use composite operation to erase
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.lineWidth = 30;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();
        
        this.lastX = pos.x;
        this.lastY = pos.y;
        
        // Reset composite operation
        this.ctx.globalCompositeOperation = 'source-over';
        
        // Check how much has been erased
        this.checkErasedPercentage();
    }
    
    stopDrawing() {
        this.isDrawing = false;
    }
    
    checkErasedPercentage() {
        // Get image data to count erased pixels
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        let transparentPixels = 0;
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] === 0) { // Alpha channel is 0 (transparent)
                transparentPixels++;
            }
        }
        
        this.erasedPercentage = (transparentPixels / this.totalPixels) * 100;
        
        // If 50% or more is erased, start auto-reveal
        if (this.erasedPercentage >= 50 && !this.canvas.classList.contains('fade-out')) {
            this.autoReveal();
        }
    }
    
    autoReveal() {
        this.canvas.classList.add('fade-out');
        
        // Play sound effect
        this.playCelebrationSound();
        
        // Start confetti effect
        this.startConfetti();
        
        // Remove canvas after fade animation completes
        setTimeout(() => {
            this.canvas.style.display = 'none';
        }, 1000);
    }
    
    playCelebrationSound() {
        try {
            // Create audio context
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create a celebratory sound with multiple frequencies
            const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C (C major chord)
            
            frequencies.forEach((freq, index) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                oscillator.type = 'sine';
                
                // Create envelope for each note
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5 + index * 0.1);
                
                oscillator.start(audioContext.currentTime + index * 0.1);
                oscillator.stop(audioContext.currentTime + 0.5 + index * 0.1);
            });
            
            // Add a final "pop" sound
            setTimeout(() => {
                const popOscillator = audioContext.createOscillator();
                const popGain = audioContext.createGain();
                
                popOscillator.connect(popGain);
                popGain.connect(audioContext.destination);
                
                popOscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                popOscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
                popOscillator.type = 'square';
                
                popGain.gain.setValueAtTime(0.2, audioContext.currentTime);
                popGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                
                popOscillator.start(audioContext.currentTime);
                popOscillator.stop(audioContext.currentTime + 0.1);
            }, 600);
            
        } catch (error) {
            console.log('Audio not supported or blocked by browser');
        }
    }
    
    startConfettiAnimation() {
        const animate = () => {
            this.updateConfetti();
            this.drawConfetti();
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    startConfetti() {
        this.confettiActive = true;
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        // Create confetti particles around the image
        for (let i = 0; i < 80; i++) {
            const particle = {
                x: rect.width / 2 + (Math.random() - 0.5) * rect.width * 0.8,
                y: rect.height / 2 + (Math.random() - 0.5) * rect.height * 0.8,
                vx: (Math.random() - 0.5) * 8,
                vy: -Math.random() * 6 - 2,
                gravity: 0.2,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.2,
                size: Math.random() * 8 + 4,
                color: this.getRandomColor(),
                life: 1.0,
                decay: 0.008
            };
            this.confettiParticles.push(particle);
        }
    }
    
    getRandomColor() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    updateConfetti() {
        if (!this.confettiActive) return;
        
        for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
            const particle = this.confettiParticles[i];
            
            // Update physics
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += particle.gravity;
            particle.rotation += particle.rotationSpeed;
            particle.life -= particle.decay;
            
            // Remove dead particles
            if (particle.life <= 0 || particle.y > this.canvas.height + 100) {
                this.confettiParticles.splice(i, 1);
            }
        }
        
        // Stop confetti after a while
        if (this.confettiParticles.length === 0 && this.confettiActive) {
            this.confettiActive = false;
        }
    }
    
    drawConfetti() {
        if (!this.confettiActive || this.confettiParticles.length === 0) return;
        
        // Create a separate canvas for confetti that overlays the main canvas
        let confettiCanvas = document.getElementById('confetti-canvas');
        if (!confettiCanvas) {
            confettiCanvas = document.createElement('canvas');
            confettiCanvas.id = 'confetti-canvas';
            confettiCanvas.style.position = 'absolute';
            confettiCanvas.style.top = '0';
            confettiCanvas.style.left = '0';
            confettiCanvas.style.width = '100%';
            confettiCanvas.style.height = '100%';
            confettiCanvas.style.pointerEvents = 'none';
            confettiCanvas.style.zIndex = '20';
            this.canvas.parentElement.appendChild(confettiCanvas);
        }
        
        const confettiCtx = confettiCanvas.getContext('2d');
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        // Set canvas size
        confettiCanvas.width = rect.width;
        confettiCanvas.height = rect.height;
        
        // Clear and draw particles
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        
        this.confettiParticles.forEach(particle => {
            confettiCtx.save();
            confettiCtx.globalAlpha = particle.life;
            confettiCtx.fillStyle = particle.color;
            confettiCtx.translate(particle.x, particle.y);
            confettiCtx.rotate(particle.rotation);
            
            // Draw confetti piece (rectangle)
            confettiCtx.fillRect(-particle.size/2, -particle.size/4, particle.size, particle.size/2);
            
            confettiCtx.restore();
        });
    }
    
    // Method to reset the wrapping paper (useful for testing)
    reset() {
        this.canvas.style.display = 'block';
        this.canvas.classList.remove('fade-out');
        this.instructions.classList.remove('hidden');
        this.confettiParticles = [];
        this.confettiActive = false;
        
        // Remove confetti canvas if it exists
        const confettiCanvas = document.getElementById('confetti-canvas');
        if (confettiCanvas) {
            confettiCanvas.remove();
        }
        
        this.createWrappingPaper();
        this.erasedPercentage = 0;
    }
}

// Initialize the wrapping paper tear effect when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait for images to load
    const giftImage = document.getElementById('gift-image');
    if (giftImage.complete) {
        new WrappingPaperTear();
    } else {
        giftImage.addEventListener('load', () => {
            new WrappingPaperTear();
        });
    }
});

// Add a reset button for testing (optional)
document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        // Reset functionality - you can add a reset button if needed
        location.reload();
    }
});
