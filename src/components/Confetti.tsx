export function Confetti() {
  const pieces = Array.from({ length: 60 });
  const colors = ["#F4C20D", "#1B7F3A", "#FFFFFF", "#0E0E0E", "#F2A900"];
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.8;
        const dur = 1.6 + Math.random() * 1.4;
        const size = 6 + Math.random() * 8;
        const color = colors[i % colors.length];
        return (
          <span
            key={i}
            style={{
              left: `${left}%`,
              width: size,
              height: size * 1.6,
              background: color,
              animation: `confetti-fall ${dur}s ${delay}s linear forwards`,
              position: "absolute",
              top: 0,
              borderRadius: 2,
            }}
          />
        );
      })}
    </div>
  );
}
