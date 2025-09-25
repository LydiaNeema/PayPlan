"use client";

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  cardClass = "backdrop-blur-xl bg-white/5 border border-white/10",
  textClass = "text-white",
  color, // Single color for icon & border
}) {
  return (
    <div
      className={`flex-1 rounded-2xl p-4 shadow-lg min-h-[120px]`}
      style={{
        borderColor: color,
        borderWidth: "1.5px",
      }}
    >      
      <div className="flex flex-col justify-between h-full">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 flex items-center justify-center" style={{ color }}>
            {icon}
          </div>
          <p className={`${textClass} opacity-70 font-semibold text-sm flex-1`}>
            {title}
          </p>
        </div>

        <p className={`${textClass} font-extrabold text-2xl mb-1`}>{value}</p>

        {subtitle && (
          <p className={`${textClass} opacity-50 font-medium text-xs`}>
            {subtitle}
          </p>
        )}
      </div>
      
    </div>
  );
}
