// src/components/Logo.tsx
import { useLocation } from "react-router-dom";

const Logo = () => {
  const { pathname } = useLocation();
  const showHD = pathname === "/signup" || pathname === "/login";

  return (
    <div className="fixed z-50 top-4 left-4 w-fit flex items-center justify-center sm:left-1/4 sm:-translate-x-1/2 sm:top-2">
      {/* Radiating Lines */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute w-full h-full animate-spin-slow">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-4 bg-blue-400"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${i * 30}deg) translate(130%)`,
                transformOrigin: "center",
                borderRadius: "2px",
              }}
            />
          ))}
        </div>
        <div className="w-12 h-12 rounded-full border-[6px] border-blue-500 flex items-center justify-center bg-white" />
      </div>

      {/* HD Text (conditionally rendered) */}
      {showHD && (
        <span className="ml-2 text-xl font-bold text-blue-600">HD</span>
      )}
    </div>
  );
};

export default Logo;
