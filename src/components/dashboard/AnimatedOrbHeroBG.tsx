import React, { useRef, useEffect, useState } from "react";
import Box from "@mui/material/Box";

// Simplified version that only shows child orbs
const AnimatedOrbHeroBG = ({
  style = {},
  className = "",
  zIndex = 0,
  visible = true,
  sx = {},
  childIndex = 0,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const childrenGroupRef = useRef<SVGGElement | null>(null);

  // Add ripples state back to fix errors
  const [ripples, setRipples] = useState<{ cx: number; cy: number; r: number; color: string; width: number; opacity: number; }[]>([]);

  useEffect(() => {
    if (!visible) return;
    let animationFrame: number;

    function generateBlobPath(cx: number, cy: number, radius: number, points: number, time: number): string {
      const pts: Array<{x: number, y: number}> = [];
      for (let i = 0; i < points; i++) {
        const angle = (Math.PI * 2 * i) / points;
        // Reduced noise amplitude to make orbs more spherical
        const noise = 
          Math.sin(angle * 2 + time * 0.4) * 0.8 + 
          Math.sin(angle * 3 - time * 0.5) * 0.6 + 
          Math.sin(angle * 5 + time * 0.7) * 0.3;
        const rad = radius + noise;
        pts.push({
          x: cx + Math.cos(angle) * rad,
          y: cy + Math.sin(angle) * rad
        });
      }
      
      let d = "";
      for (let i = 0; i < points; i++) {
        const p0 = pts[(i - 1 + points) % points];
        const p1 = pts[i];
        const p2 = pts[(i + 1) % points];
        const p3 = pts[(i + 2) % points];
        
        if (i === 0) {
          d += `M${p1.x.toFixed(2)},${p1.y.toFixed(2)}`;
        }
        
        const c1x = p1.x + (p2.x - p0.x) / 3;
        const c1y = p1.y + (p2.y - p0.y) / 3;
        const c2x = p2.x - (p3.x - p1.x) / 3;
        const c2y = p2.y - (p3.y - p1.y) / 3;
        
        d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
      }
      
      d += "Z";
      return d;
    }

    // Helper function to convert HSL to Hex
    function hslToHex(h: number, s: number, l: number): string {
      h /= 360; s /= 100; l /= 100;
      let r: number, g: number, b: number;
      if (s === 0) { r = g = b = l; }
      else {
        const hue2rgb = (p: number, q: number, t: number): number => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
      return "#" + [r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, "0")).join("");
    }

    function animate() {
      const svg = svgRef.current;
      if (!svg) return;

      const now = performance.now();
      const childrenGroup = childrenGroupRef.current;
      if (childrenGroup) {
        while (childrenGroup.firstChild) childrenGroup.removeChild(childrenGroup.firstChild);
        for (let i = 0; i < 5; i++) {
          if (childIndex !== null && i !== childIndex) continue;
          
          // Update gradient colors for color shifting - increased brightness
          const baseHue = (i * 67 + now * 0.018) % 360;
          const hue2 = (baseHue + 40 + 20 * Math.sin(now * 0.0007 + i)) % 360;
          const sat = 85 + 10 * Math.sin(now * 0.0005 + i);
          // Increased lightness values for brighter orbs
          const light1 = 75 + 15 * Math.cos(now * 0.0004 + i * 2);
          const light2 = 45 + 15 * Math.sin(now * 0.0006 + i * 3);
          
          const grad0 = svg.querySelector(`#c${i}s0`);
          const grad1 = svg.querySelector(`#c${i}s1`);
          
          if (grad0) grad0.setAttribute("stop-color", hslToHex(baseHue, sat, light1));
          if (grad1) grad1.setAttribute("stop-color", hslToHex(hue2, sat, light2));
          
          // Create blob path
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          const blobPath = generateBlobPath(50, 50, 30, 24, now * 0.0005 + i * 10);
          path.setAttribute("d", blobPath);
          path.setAttribute("fill", `url(#childGrad${i})`);
          path.setAttribute("opacity", "0.98"); // Increased opacity for better visibility
          
          // Add subtle highlight for enhanced 3D effect
          const highlight = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          highlight.setAttribute("cx", "42");
          highlight.setAttribute("cy", "42");
          highlight.setAttribute("r", "8");
          highlight.setAttribute("fill", "rgba(255, 255, 255, 0.25)");
          highlight.setAttribute("filter", "blur(3px)");
          
          childrenGroup.appendChild(path);
          childrenGroup.appendChild(highlight);
        }
      }

      animationFrame = requestAnimationFrame(animate);
    }

    animate();
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [visible, childIndex]);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        zIndex,
        pointerEvents: "none",
        ...sx,
      }}
      style={style}
      className={className}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{ display: "block", background: "transparent" }}
        viewBox="0 0 100 100"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <radialGradient id="childGrad0" cx="30%" cy="30%" r="70%" fx="20%" fy="20%">
            <stop id="c0s0" offset="0%" stopColor="#D6EAFF" />
            <stop id="c0s1" offset="100%" stopColor="#0A4A9F" />
          </radialGradient>
          <radialGradient id="childGrad1" cx="30%" cy="30%" r="70%" fx="20%" fy="20%">
            <stop id="c1s0" offset="0%" stopColor="#D8FFDF" />
            <stop id="c1s1" offset="100%" stopColor="#147A42" />
          </radialGradient>
          <radialGradient id="childGrad2" cx="30%" cy="30%" r="70%" fx="20%" fy="20%">
            <stop id="c2s0" offset="0%" stopColor="#FFD6E0" />
            <stop id="c2s1" offset="100%" stopColor="#9B2F5A" />
          </radialGradient>
          <radialGradient id="childGrad3" cx="30%" cy="30%" r="70%" fx="20%" fy="20%">
            <stop id="c3s0" offset="0%" stopColor="#EDE0FF" />
            <stop id="c3s1" offset="100%" stopColor="#512B7F" />
          </radialGradient>
          <radialGradient id="childGrad4" cx="30%" cy="30%" r="70%" fx="20%" fy="20%">
            <stop id="c4s0" offset="0%" stopColor="#FFF8D6" />
            <stop id="c4s1" offset="100%" stopColor="#8B6800" />
          </radialGradient>
        </defs>
        <g id="particles"></g>
        <g id="children" ref={childrenGroupRef}></g>
        {ripples.map((ripple, idx) => (
          <circle key={idx} cx={ripple.cx} cy={ripple.cy} r={ripple.r} fill="none" stroke={ripple.color} strokeWidth={ripple.width} opacity={ripple.opacity} />
        ))}
      </svg>
    </Box>
  );
};

export default AnimatedOrbHeroBG;
