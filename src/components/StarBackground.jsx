import { useEffect, useRef, useState } from "react";

export const StarBackground = () => {
  const canvasRef = useRef(null);

  const [stars, setStars] = useState([]);
  const [meteors, setMeteors] = useState([]);

  useEffect(() => {
    generateStars();
    generateMeteors();
    startFireworks();
  }, []);

  const generateStars = () => {
    setStars([]);
  };

  const generateMeteors = () => {
    setMeteors([]);
  };

  const startFireworks = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fireworks = [];
    const particles = [];

    const colors = [
      "#ff3b3b",
      "#ffd93b",
      "#3bff8c",
      "#3bbdff",
      "#c73bff",
      "#ff8c3b"
    ];

    class Firework {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * canvas.height * 0.4 + 80;
        this.speed = 2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.trail = [];
      }

      update() {
        this.trail.push({ x: this.x, y: this.y });

        if (this.trail.length > 8) this.trail.shift();

        this.y -= this.speed;

        if (this.y <= this.targetY) {
          explode(this.x, this.y, this.color);
          fireworks.splice(fireworks.indexOf(this), 1);
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.trail[0]?.x || this.x, this.trail[0]?.y || this.y);

        for (let p of this.trail) {
          ctx.lineTo(p.x, p.y);
        }

        ctx.strokeStyle = this.color;
        ctx.stroke();
      }
    }

    class Particle {
      constructor(x, y, color) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;

        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.alpha = 1;
        this.decay = Math.random() * 0.004 + 0.002;

        this.color = color;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        this.vy += 0.01;

        this.alpha -= this.decay;
      }

      draw() {
        ctx.globalAlpha = this.alpha;

        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.globalAlpha = 1;
      }
    }

    function explode(x, y, color) {
      for (let i = 0; i < 120; i++) {
        particles.push(new Particle(x, y, color));
      }
    }

    function animate() {
      requestAnimationFrame(animate);

      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.02) {
        fireworks.push(new Firework());
      }

      fireworks.forEach((f) => {
        f.update();
        f.draw();
      });

      particles.forEach((p, i) => {
        p.update();
        p.draw();

        if (p.alpha <= 0) particles.splice(i, 1);
      });
    }

    animate();
  };

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};