import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ hover = false, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl shadow-sm border border-sand-200
        ${hover ? "transition-all duration-300 hover:shadow-lg hover:-translate-y-1" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-t-2xl ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
}

export function CardContent({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
