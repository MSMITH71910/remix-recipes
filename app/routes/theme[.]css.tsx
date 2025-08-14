import { themeCookie } from "~/cookies";
import type { LoaderFunctionArgs } from "react-router";

function getTheme(color: string) {
  switch (color) {
    case "red": {
      return {
        colorPrimary: "#f22524",
        colorPrimaryLight: "#f56665",
        textColor: "#000000", // BLACK text contrasts with red
        contrastText: "#1a1a1a",
      };
    }
    case "orange": {
      return {
        colorPrimary: "#ff4b00",
        colorPrimaryLight: "#ff814d", 
        textColor: "#000000", // BLACK text contrasts with orange
        contrastText: "#1a1a1a",
      };
    }
    case "yellow": {
      return {
        colorPrimary: "#cc9800",
        colorPrimaryLight: "#ffbf00",
        textColor: "#000000", // BLACK text contrasts with yellow
        contrastText: "#1a1a1a",
      };
    }
    case "blue": {
      return {
        colorPrimary: "#01a3e1", 
        colorPrimaryLight: "#30c5fe",
        textColor: "#ffff00", // BRIGHT YELLOW text contrasts with blue
        contrastText: "#1a1a1a",
      };
    }
    case "purple": {
      return {
        colorPrimary: "#5325c0",
        colorPrimaryLight: "#8666d2",
        textColor: "#00ff00", // BRIGHT GREEN text contrasts with purple
        contrastText: "#1a1a1a",
      };
    }
    default: {
      return {
        colorPrimary: "#00743e",
        colorPrimaryLight: "#4c9d77",
        textColor: "#ffff00", // BRIGHT YELLOW text contrasts with green
        contrastText: "#1a1a1a",
      };
    }
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("cookie");
  const cookieValue = await themeCookie.parse(cookieHeader);

  const theme = getTheme(cookieValue);

  const data = `
    :root {
      --color-primary: ${theme.colorPrimary};
      --color-primary-light: ${theme.colorPrimaryLight};
      --text-color: ${theme.textColor};
      --contrast-text: ${theme.contrastText};
    }
    
    /* Apply theme colors to page backgrounds and elements */
    body {
      background: linear-gradient(135deg, ${theme.colorPrimaryLight}10, ${theme.colorPrimary}15);
      min-height: 100vh;
      color: ${theme.contrastText};
    }
    
    /* Navigation background */
    nav {
      background: linear-gradient(90deg, ${theme.colorPrimary}, ${theme.colorPrimaryLight}) !important;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    /* MAXIMUM SPECIFICITY - Override Tailwind CSS utilities */
    html body nav.bg-white.shadow-md.border-b *,
    html body nav.bg-white.shadow-md.border-b span,
    html body nav.bg-white.shadow-md.border-b a,
    html body nav.bg-white.shadow-md.border-b div,
    html body nav.bg-white.shadow-md.border-b button,
    html body nav div div div span.text-xl.font-bold.text-gray-900,
    html body nav div div div a.text-gray-600.hover\\:text-primary.font-medium.transition-colors,
    html body nav .text-gray-600,
    html body nav .text-gray-900,
    html body nav .text-white,
    html body nav .bg-primary span,
    html body nav span,
    html body nav a,
    html body nav div,
    html body nav *,
    html nav *,
    body nav *,
    nav * {
      color: ${theme.textColor} !important;
      fill: ${theme.textColor} !important;
      stroke: ${theme.textColor} !important;
      text-shadow: ${
        theme.textColor === '#000000' 
          ? '2px 2px 4px rgba(255,255,255,0.9)' // White shadow for black text
          : theme.textColor === '#ffff00' 
          ? '2px 2px 4px rgba(0,0,0,0.9)' // Black shadow for yellow text  
          : '2px 2px 4px rgba(0,0,0,0.9)' // Black shadow for green text
      } !important;
      font-weight: 700 !important;
    }
    
    /* Force SVG colors to match text */
    nav svg, nav svg *, nav path {
      fill: ${theme.textColor} !important;
      stroke: ${theme.textColor} !important;
      color: ${theme.textColor} !important;
    }
    
    /* Hover states for navigation */
    nav a:hover, nav button:hover, nav *:hover {
      color: ${theme.textColor === '#000000' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)'} !important;
      text-decoration: none !important;
      text-shadow: ${theme.textColor === '#000000' ? '0 1px 3px rgba(255,255,255,0.7)' : '0 1px 3px rgba(0,0,0,0.7)'} !important;
    }
    
    /* Navigation buttons and badges */
    nav .bg-primary, nav .bg-primary *, nav button {
      background-color: ${theme.textColor === '#000000' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'} !important;
      border: 1px solid ${theme.textColor === '#000000' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)'} !important;
      color: ${theme.textColor} !important;
    }
    
    /* Card backgrounds with theme tint */
    .bg-white {
      background: linear-gradient(135deg, white, ${theme.colorPrimaryLight}08) !important;
      border: 1px solid ${theme.colorPrimary}20;
      color: ${theme.contrastText} !important;
    }
    
    /* Text colors for content */
    .text-gray-900, .text-gray-800, .text-gray-700, .text-gray-600 {
      color: ${theme.contrastText} !important;
    }
    
    h1, h2, h3, h4, h5, h6, p, span, div, label {
      color: ${theme.contrastText} !important;
    }
    
    /* Buttons and interactive elements */
    .bg-primary {
      background: linear-gradient(135deg, ${theme.colorPrimary}, ${theme.colorPrimaryLight}) !important;
      color: ${theme.textColor} !important;
    }
    
    .hover\\:bg-primary:hover {
      background: linear-gradient(135deg, ${theme.colorPrimaryLight}, ${theme.colorPrimary}) !important;
      color: ${theme.textColor} !important;
    }
    
    /* Input fields */
    input, textarea, select {
      background: white !important;
      color: ${theme.contrastText} !important;
      border-color: ${theme.colorPrimary}40 !important;
    }
    
    input:focus, textarea:focus, select:focus {
      border-color: ${theme.colorPrimary} !important;
      box-shadow: 0 0 0 2px ${theme.colorPrimary}20 !important;
    }
    
    /* Recipe cards hover effect */
    .shadow-md:hover {
      box-shadow: 0 10px 25px ${theme.colorPrimary}30 !important;
      transform: translateY(-2px);
      transition: all 0.3s ease;
    }
    
    /* Settings theme selection */
    .border-primary {
      border-color: ${theme.colorPrimary} !important;
      background: ${theme.colorPrimaryLight}20 !important;
    }
  `;

  return new Response(data, {
    headers: { 
      "content-type": "text/css",
      "cache-control": "no-cache, no-store, must-revalidate",
      "pragma": "no-cache",
      "expires": "0"
    },
  });
}