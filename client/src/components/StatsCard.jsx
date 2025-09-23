"use client";

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  cardClass = "backdrop-blur-xl bg-white/5 border border-white/10",
  textClass = "text-white",
  colors, // ✅ optional gradient colors
}) {
  // If colors are provided, build gradient
  const gradientClass = colors
    ? `bg-gradient-to-r from-[${colors[0]}] to-[${colors[1]}]`
    : "";

  return (
    <div
      className={`flex-1 rounded-2xl p-4 shadow-lg min-h-[120px] ${cardClass} ${gradientClass}`}
    >
      <div className="flex flex-col justify-between h-full">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
          <p className={`${textClass} opacity-70 font-semibold text-sm flex-1`}>
            {title}
          </p>
        </div>

        {/* Value */}
        <p className={`${textClass} font-extrabold text-2xl mb-1`}>{value}</p>

        {/* Subtitle */}
        {subtitle && (
          <p className={`${textClass} opacity-50 font-medium text-xs`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
