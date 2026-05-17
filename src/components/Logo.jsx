export default function Logo({ className = "", size = "normal" }) {
  const sizes = {
    small: { fontSize: "20px", sparkScale: 0.5 },
    normal: { fontSize: "28px", sparkScale: 0.6 },
    large: { fontSize: "48px", sparkScale: 0.8 }
  };
  
  const { fontSize, sparkScale } = sizes[size] || sizes.normal;
  
  return (
    <svg 
      className={className}
      viewBox="0 0 280 50" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Task Buddies"
    >
      <style>{`
        .logo-text { 
          font-family: Georgia, 'Times New Roman', serif; 
          font-weight: 800; 
        }
      `}</style>
      
      <text 
        className="logo-text" 
        x="140" 
        y="32" 
        textAnchor="middle" 
        fontSize={fontSize}
        fill="#24130D"
      >
        Task Buddies
      </text>
      
      <g transform={`translate(240 10) scale(${sparkScale})`}>
        <g fill="#F0A275" stroke="none">
          <path d="M0,-18 C3,-6 6,-3 18,0 C6,3 3,6 0,18 C-3,6 -6,3 -18,0 C-6,-3 -3,-6 0,-18 Z"/>
          <circle cx="24" cy="-17" r="4"/>
          <circle cx="-22" cy="20" r="3.5"/>
        </g>
      </g>
    </svg>
  );
}
