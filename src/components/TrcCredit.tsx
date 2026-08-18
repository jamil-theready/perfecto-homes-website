/**
 * "Designed by The Ready Consult" — footer credit.
 *
 * The mark is the 3x3 dot-grid R from thereadyconsult.com, inlined as SVG so
 * it costs no image request and no client JavaScript. Colour is inherited from
 * whatever the footer sets, so it sits correctly on light and dark grounds
 * alike; the type is set explicitly in CSS so the credit reads identically on
 * every site regardless of how that site styles its own bottom bar.
 *
 * Styles live in src/app/globals.css under "The Ready Consult footer credit".
 */

// 3x3 grid. The R shape is on everywhere except index 5 and 7.
const DOTS = [
  [2.33, 2.33, true],
  [7, 2.33, true],
  [11.67, 2.33, true],
  [2.33, 7, true],
  [7, 7, true],
  [11.67, 7, false],
  [2.33, 11.67, true],
  [7, 11.67, false],
  [11.67, 11.67, true],
] as const;

export default function TrcCredit({
  className = "",
  label = "Designed by",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <a
      href="https://thereadyconsult.com"
      target="_blank"
      rel="noopener"
      className={`trc-credit${className ? ` ${className}` : ""}`}
    >
      <span>{label}</span>
      <span className="trc-credit-lockup">
        <svg
          className="trc-credit-mark"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          aria-hidden="true"
          focusable="false"
        >
          {DOTS.map(([cx, cy, on], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="1.71"
              className={on ? undefined : "trc-off"}
            />
          ))}
        </svg>
        <span className="trc-credit-name">The Ready Consult</span>
      </span>
    </a>
  );
}
