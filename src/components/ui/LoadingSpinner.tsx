export default function LoadingSpinner() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1e3c72] to-[#2a5298] flex items-center justify-center overflow-hidden">
        <style>
          {`
            @keyframes cube-spin {
              0% {
                transform: rotate3d(1, 1, 0, 0deg);
              }
              100% {
                transform: rotate3d(1, 1, 0, 360deg);
              }
            }
          `}
        </style>
  
        <div className="relative w-[100px] h-[100px] transform-gpu" 
             style={{
               transformStyle: 'preserve-3d',
               animation: 'cube-spin 4s infinite linear'
             }}>
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className={`
                absolute w-[100px] h-[100px] 
                bg-white/10 border-2 border-white/50
                shadow-[0_0_20px_rgba(255,255,255,0.5)]
                backdrop-blur-sm
                ${index === 0 ? 'animate-pulse' : ''}
              `}
              style={{
                transform: [
                  'rotateX(0deg) translateZ(50px)',
                  'rotateY(90deg) translateZ(50px)',
                  'rotateY(180deg) translateZ(50px)',
                  'rotateY(-90deg) translateZ(50px)',
                  'rotateX(90deg) translateZ(50px)',
                  'rotateX(-90deg) translateZ(50px)',
                ][index],
                transformOrigin: 'center',
              }}
            />
          ))}
        </div>
      </div>
    );
  }