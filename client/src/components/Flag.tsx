import { useState } from "react";

type Props = {
  code?: string | null;
  size?: number;
  className?: string;
};

export default function Flag({ code, size = 20, className = "" }: Props) {
  const [failed, setFailed] = useState(false);

  if (!code || failed) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded bg-[var(--color-card)] text-xs text-[var(--color-text-muted)] ${className}`}
        style={{ width: size * 1.5, height: size }}
      >
        🏳️
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      alt={code}
      width={size * 1.5}
      height={size}
      className={`inline-block rounded-sm object-cover ${className}`}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}
