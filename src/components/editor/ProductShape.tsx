"use client";

interface ProductShapeProps {
  shape: string;
  color: string;
  children?: React.ReactNode;
}

export default function ProductShape({ shape, color, children }: ProductShapeProps) {
  const dark = adjustColor(color, -18);
  const darker = adjustColor(color, -30);
  const light = adjustColor(color, 10);
  const shadow = adjustColor(color, -40);
  const uid = `ps-${shape}-${color.replace("#", "")}`;

  const renderShape = () => {
    switch (shape) {
      case "tshirt":
        return (
          <svg viewBox="0 0 400 480" className="product-svg">
            <defs>
              <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={light} />
                <stop offset="50%" stopColor={color} />
                <stop offset="100%" stopColor={dark} />
              </linearGradient>
              <linearGradient id={`${uid}-sleeve`} x1="0" y1="0" x2="1" y2="0.8">
                <stop offset="0%" stopColor={color} />
                <stop offset="100%" stopColor={dark} />
              </linearGradient>
              <filter id={`${uid}-shadow`}><feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.12" /></filter>
            </defs>
            {/* Main body */}
            <path
              d="M100,8 L155,8 C162,38 185,58 200,62 C215,58 238,38 245,8 L300,8 L375,78 L338,118 L302,98 L302,450 C302,458 294,466 284,466 L116,466 C106,466 98,458 98,450 L98,98 L62,118 L25,78 Z"
              fill={`url(#${uid}-body)`}
              filter={`url(#${uid}-shadow)`}
              stroke="rgba(0,0,0,0.05)"
              strokeWidth="1.5"
            />
            {/* Left sleeve shade */}
            <path d="M100,8 L25,78 L62,118 L98,98 L98,50 Z" fill={`url(#${uid}-sleeve)`} opacity="0.5" />
            {/* Right sleeve shade */}
            <path d="M300,8 L375,78 L338,118 L302,98 L302,50 Z" fill={`url(#${uid}-sleeve)`} opacity="0.5" />
            {/* Collar / neckline */}
            <path d="M155,8 C162,38 185,58 200,62 C215,58 238,38 245,8" fill="none" stroke={darker} strokeWidth="3" strokeLinecap="round" />
            <path d="M155,8 C162,34 185,52 200,56 C215,52 238,34 245,8" fill="none" stroke={shadow} strokeWidth="1" opacity="0.2" />
            {/* Shoulder stitching */}
            <line x1="98" y1="50" x2="155" y2="10" stroke={darker} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.3" />
            <line x1="302" y1="50" x2="245" y2="10" stroke={darker} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.3" />
            {/* Bottom hem */}
            <path d="M98,450 C98,458 106,466 116,466 L284,466 C294,466 302,458 302,450" fill="none" stroke={darker} strokeWidth="2" opacity="0.4" />
            {/* Sleeve hems */}
            <line x1="56" y1="114" x2="98" y2="94" stroke={darker} strokeWidth="1.5" opacity="0.3" />
            <line x1="344" y1="114" x2="302" y2="94" stroke={darker} strokeWidth="1.5" opacity="0.3" />
            {/* Side seams */}
            <line x1="98" y1="98" x2="98" y2="450" stroke={darker} strokeWidth="0.6" strokeDasharray="4 4" opacity="0.15" />
            <line x1="302" y1="98" x2="302" y2="450" stroke={darker} strokeWidth="0.6" strokeDasharray="4 4" opacity="0.15" />
            {/* Fabric texture highlights */}
            <rect x="140" y="100" width="120" height="0.5" fill="white" opacity="0.08" />
            <rect x="140" y="180" width="120" height="0.5" fill="white" opacity="0.06" />
            <rect x="140" y="260" width="120" height="0.5" fill="white" opacity="0.04" />
            {/* Design area */}
            <rect x="132" y="85" width="136" height="175" fill="none" stroke="rgba(108,92,231,0.18)" strokeWidth="1" strokeDasharray="5 4" rx="4" />
          </svg>
        );
      case "hoodie":
        return (
          <svg viewBox="0 0 420 500" className="product-svg">
            <defs>
              <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0.8" y2="1">
                <stop offset="0%" stopColor={light} />
                <stop offset="50%" stopColor={color} />
                <stop offset="100%" stopColor={dark} />
              </linearGradient>
              <linearGradient id={`${uid}-hood`} x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor={dark} />
                <stop offset="100%" stopColor={color} />
              </linearGradient>
              <filter id={`${uid}-shadow`}><feDropShadow dx="0" dy="4" stdDeviation="10" floodOpacity="0.14" /></filter>
            </defs>
            {/* Main body */}
            <path
              d="M105,28 L148,4 C158,42 183,62 200,68 L200,68 C217,62 242,42 252,4 L315,28 L388,98 L350,138 L314,118 L314,470 C314,478 306,486 296,486 L124,486 C114,486 106,478 106,470 L106,118 L70,138 L32,98 Z"
              fill={`url(#${uid}-body)`}
              filter={`url(#${uid}-shadow)`}
              stroke="rgba(0,0,0,0.05)"
              strokeWidth="1.5"
            />
            {/* Hood */}
            <path d="M148,4 C155,32 178,52 200,60 C222,52 245,32 252,4 L228,4 C222,22 214,34 200,40 C186,34 178,22 172,4 Z" fill={`url(#${uid}-hood)`} stroke={darker} strokeWidth="1" />
            {/* Hood inner shadow */}
            <path d="M172,4 C178,22 186,34 200,40 C214,34 222,22 228,4" fill="none" stroke={shadow} strokeWidth="1.5" opacity="0.25" />
            {/* Drawstrings */}
            <line x1="190" y1="60" x2="185" y2="120" stroke={darker} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="210" y1="60" x2="215" y2="120" stroke={darker} strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="185" cy="122" r="2.5" fill={darker} />
            <circle cx="215" cy="122" r="2.5" fill={darker} />
            {/* Front pocket */}
            <path d="M148,330 L148,375 C148,382 154,388 162,388 L258,388 C266,388 272,382 272,375 L272,330" fill={dark} stroke={darker} strokeWidth="1" opacity="0.7" />
            <line x1="210" y1="330" x2="210" y2="388" stroke={darker} strokeWidth="0.8" opacity="0.4" />
            {/* Front center zipper / seam */}
            <line x1="210" y1="68" x2="210" y2="486" stroke={darker} strokeWidth="0.8" strokeDasharray="6 3" opacity="0.15" />
            {/* Sleeve seams */}
            <line x1="106" y1="118" x2="148" y2="8" stroke={darker} strokeWidth="0.7" strokeDasharray="3 3" opacity="0.2" />
            <line x1="314" y1="118" x2="252" y2="8" stroke={darker} strokeWidth="0.7" strokeDasharray="3 3" opacity="0.2" />
            {/* Waistband */}
            <rect x="106" y="440" width="208" height="16" fill={dark} opacity="0.5" rx="2" />
            {/* Cuff bands */}
            <line x1="65" y1="134" x2="106" y2="114" stroke={darker} strokeWidth="2" opacity="0.3" />
            <line x1="355" y1="134" x2="314" y2="114" stroke={darker} strokeWidth="2" opacity="0.3" />
            {/* Design area */}
            <rect x="130" y="100" width="160" height="210" fill="none" stroke="rgba(108,92,231,0.18)" strokeWidth="1" strokeDasharray="5 4" rx="4" />
          </svg>
        );
      case "cap":
        return (
          <svg viewBox="0 0 400 320" className="product-svg">
            <defs>
              <linearGradient id={`${uid}-crown`} x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor={light} />
                <stop offset="70%" stopColor={color} />
                <stop offset="100%" stopColor={dark} />
              </linearGradient>
              <linearGradient id={`${uid}-brim`} x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor={dark} />
                <stop offset="100%" stopColor={darker} />
              </linearGradient>
              <filter id={`${uid}-shadow`}><feDropShadow dx="0" dy="5" stdDeviation="8" floodOpacity="0.15" /></filter>
            </defs>
            {/* Headband / sweatband */}
            <ellipse cx="200" cy="228" rx="168" ry="38" fill={darker} stroke="rgba(0,0,0,0.08)" strokeWidth="1.5" />
            {/* Crown */}
            <path d="M42,228 C42,120 120,38 200,38 C280,38 358,120 358,228" fill={`url(#${uid}-crown)`} filter={`url(#${uid}-shadow)`} stroke="rgba(0,0,0,0.06)" strokeWidth="1.5" />
            {/* Crown panels (seams) */}
            <path d="M200,22 L200,228" stroke={darker} strokeWidth="0.8" opacity="0.2" />
            <path d="M120,60 C140,130 170,200 140,228" stroke={darker} strokeWidth="0.6" strokeDasharray="3 3" opacity="0.15" />
            <path d="M280,60 C260,130 230,200 260,228" stroke={darker} strokeWidth="0.6" strokeDasharray="3 3" opacity="0.15" />
            {/* Top button */}
            <circle cx="200" cy="36" r="6" fill={darker} stroke={shadow} strokeWidth="1" />
            {/* Brim */}
            <path d="M32,228 C60,288 340,288 368,228 C355,265 45,265 32,228Z" fill={`url(#${uid}-brim)`} stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
            {/* Brim stitching */}
            <path d="M50,240 C75,275 325,275 350,240" fill="none" stroke={shadow} strokeWidth="0.8" strokeDasharray="3 2" opacity="0.25" />
            {/* Eyelets */}
            <circle cx="120" cy="130" r="3" fill="none" stroke={darker} strokeWidth="1.2" opacity="0.3" />
            <circle cx="280" cy="130" r="3" fill="none" stroke={darker} strokeWidth="1.2" opacity="0.3" />
            {/* Design area */}
            <rect x="132" y="80" width="136" height="105" fill="none" stroke="rgba(108,92,231,0.18)" strokeWidth="1" strokeDasharray="5 4" rx="4" />
          </svg>
        );
      case "mug":
        return (
          <svg viewBox="0 0 400 390" className="product-svg">
            <defs>
              <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="0.5">
                <stop offset="0%" stopColor={light} />
                <stop offset="40%" stopColor={color} />
                <stop offset="100%" stopColor={dark} />
              </linearGradient>
              <linearGradient id={`${uid}-inner`} x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor={darker} />
                <stop offset="100%" stopColor={shadow} />
              </linearGradient>
              <filter id={`${uid}-shadow`}><feDropShadow dx="3" dy="5" stdDeviation="8" floodOpacity="0.15" /></filter>
            </defs>
            {/* Mug body */}
            <path d="M62,55 L62,310 C62,332 80,350 110,350 L230,350 C260,350 278,332 278,310 L278,55 Z" fill={`url(#${uid}-body)`} filter={`url(#${uid}-shadow)`} stroke="rgba(0,0,0,0.05)" strokeWidth="1.5" />
            {/* Inner rim (top opening) */}
            <ellipse cx="170" cy="55" rx="108" ry="14" fill={`url(#${uid}-inner)`} stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
            {/* Outer rim highlight */}
            <ellipse cx="170" cy="50" rx="112" ry="10" fill="none" stroke={light} strokeWidth="2" opacity="0.4" />
            {/* Handle */}
            <path d="M278,120 C320,118 348,155 348,200 C348,250 320,285 278,282" fill="none" stroke={dark} strokeWidth="16" strokeLinecap="round" />
            <path d="M278,125 C315,123 340,155 340,200 C340,245 315,278 278,278" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" />
            {/* Bottom shadow */}
            <ellipse cx="170" cy="352" rx="95" ry="6" fill={shadow} opacity="0.15" />
            {/* Body highlight streak */}
            <path d="M88,70 L88,330" stroke="white" strokeWidth="3" opacity="0.1" strokeLinecap="round" />
            {/* Ceramic texture */}
            <path d="M100,60 L100,340" stroke={darker} strokeWidth="0.5" opacity="0.06" />
            <path d="M240,60 L240,340" stroke={darker} strokeWidth="0.5" opacity="0.06" />
            {/* Design area */}
            <rect x="90" y="85" width="160" height="210" fill="none" stroke="rgba(108,92,231,0.18)" strokeWidth="1" strokeDasharray="5 4" rx="4" />
          </svg>
        );
      case "tumbler":
        return (
          <svg viewBox="0 0 300 460" className="product-svg">
            <defs>
              <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="0.5">
                <stop offset="0%" stopColor={light} />
                <stop offset="45%" stopColor={color} />
                <stop offset="100%" stopColor={dark} />
              </linearGradient>
              <linearGradient id={`${uid}-lid`} x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor={darker} />
                <stop offset="100%" stopColor={shadow} />
              </linearGradient>
              <filter id={`${uid}-shadow`}><feDropShadow dx="2" dy="4" stdDeviation="8" floodOpacity="0.14" /></filter>
            </defs>
            {/* Main body — tapered shape */}
            <path d="M82,40 L72,415 C72,432 92,448 150,448 C208,448 228,432 228,415 L218,40 Z" fill={`url(#${uid}-body)`} filter={`url(#${uid}-shadow)`} stroke="rgba(0,0,0,0.05)" strokeWidth="1.5" />
            {/* Lid */}
            <rect x="78" y="18" width="144" height="26" rx="6" fill={`url(#${uid}-lid)`} stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
            {/* Lid handle */}
            <rect x="125" y="4" width="50" height="18" rx="5" fill={darker} stroke={shadow} strokeWidth="1" />
            {/* Siphole */}
            <ellipse cx="150" cy="12" rx="10" ry="4" fill={shadow} opacity="0.6" />
            {/* Bottom band */}
            <path d="M72,380 L228,380" stroke={darker} strokeWidth="8" strokeLinecap="round" opacity="0.4" />
            {/* Metal ring accent */}
            <rect x="76" y="365" width="148" height="3" fill="white" opacity="0.12" rx="1.5" />
            {/* Body highlight */}
            <path d="M100,50 L92,400" stroke="white" strokeWidth="3" opacity="0.08" strokeLinecap="round" />
            {/* Insulation double-wall line */}
            <path d="M85,45 L75,410" stroke={darker} strokeWidth="0.6" opacity="0.1" />
            <path d="M215,45 L225,410" stroke={darker} strokeWidth="0.6" opacity="0.1" />
            {/* Design area */}
            <rect x="88" y="65" width="124" height="290" fill="none" stroke="rgba(108,92,231,0.18)" strokeWidth="1" strokeDasharray="5 4" rx="4" />
          </svg>
        );
      case "totebag":
        return (
          <svg viewBox="0 0 360 460" className="product-svg">
            <defs>
              <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0.7" y2="1">
                <stop offset="0%" stopColor={light} />
                <stop offset="50%" stopColor={color} />
                <stop offset="100%" stopColor={dark} />
              </linearGradient>
              <filter id={`${uid}-shadow`}><feDropShadow dx="0" dy="5" stdDeviation="10" floodOpacity="0.14" /></filter>
            </defs>
            {/* Handles */}
            <path d="M115,10 C115,50 115,65 115,90" fill="none" stroke={darker} strokeWidth="10" strokeLinecap="round" />
            <path d="M245,10 C245,50 245,65 245,90" fill="none" stroke={darker} strokeWidth="10" strokeLinecap="round" />
            {/* Handle inner */}
            <path d="M115,12 C115,48 115,64 115,88" fill="none" stroke={dark} strokeWidth="6" strokeLinecap="round" />
            <path d="M245,12 C245,48 245,64 245,88" fill="none" stroke={dark} strokeWidth="6" strokeLinecap="round" />
            {/* Bag body */}
            <path d="M42,88 L318,88 L298,435 C298,442 290,448 280,448 L80,448 C70,448 62,442 62,435 Z" fill={`url(#${uid}-body)`} filter={`url(#${uid}-shadow)`} stroke="rgba(0,0,0,0.05)" strokeWidth="1.5" />
            {/* Top seam */}
            <line x1="42" y1="94" x2="318" y2="94" stroke={darker} strokeWidth="2" opacity="0.3" />
            {/* Canvas texture stitching */}
            <path d="M46,95 L66,442" stroke={darker} strokeWidth="0.6" strokeDasharray="4 4" opacity="0.12" />
            <path d="M314,95 L294,442" stroke={darker} strokeWidth="0.6" strokeDasharray="4 4" opacity="0.12" />
            {/* Bottom gusset */}
            <line x1="68" y1="440" x2="292" y2="440" stroke={darker} strokeWidth="1.5" opacity="0.25" />
            {/* Fabric fold shadow */}
            <path d="M180,90 L175,445" stroke={darker} strokeWidth="0.5" opacity="0.08" />
            {/* Design area */}
            <rect x="80" y="120" width="200" height="270" fill="none" stroke="rgba(108,92,231,0.18)" strokeWidth="1" strokeDasharray="5 4" rx="4" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 400 480" className="product-svg">
            <defs>
              <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={light} />
                <stop offset="50%" stopColor={color} />
                <stop offset="100%" stopColor={dark} />
              </linearGradient>
              <filter id={`${uid}-shadow`}><feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.12" /></filter>
            </defs>
            <path
              d="M100,8 L155,8 C162,38 185,58 200,62 C215,58 238,38 245,8 L300,8 L375,78 L338,118 L302,98 L302,450 C302,458 294,466 284,466 L116,466 C106,466 98,458 98,450 L98,98 L62,118 L25,78 Z"
              fill={`url(#${uid}-body)`}
              filter={`url(#${uid}-shadow)`}
              stroke="rgba(0,0,0,0.05)"
              strokeWidth="1.5"
            />
            <path d="M155,8 C162,38 185,58 200,62 C215,58 238,38 245,8" fill="none" stroke={darker} strokeWidth="3" strokeLinecap="round" />
            <rect x="132" y="85" width="136" height="175" fill="none" stroke="rgba(108,92,231,0.18)" strokeWidth="1" strokeDasharray="5 4" rx="4" />
          </svg>
        );
    }
  };

  return (
    <div className="product-shape-container">
      {renderShape()}
      {children}
      <style jsx>{`
        .product-shape-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .product-shape-container :global(.product-svg) {
          width: 85%;
          height: 85%;
          filter: drop-shadow(0 8px 24px rgba(0,0,0,0.1));
          transition: filter 0.3s ease;
        }
        .product-shape-container:hover :global(.product-svg) {
          filter: drop-shadow(0 12px 32px rgba(0,0,0,0.14));
        }
      `}</style>
    </div>
  );
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
