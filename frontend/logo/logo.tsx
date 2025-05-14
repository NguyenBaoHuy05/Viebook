function Logo(w: number, h: number) {
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className="cursor-pointer transition-transform hover:scale-100 rounded-full"
    >
      <circle cx="32" cy="32" r="32" fill="black" />

      <path
        d="M20 24 L32 40 L44 24"
        fill="none"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 15 q2 5 6 0 q2 -4 4 0"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M50 15 q3 5 6 0 q3 -5 6 0"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M15 50 q2 3 4 0 q2 -3 4 0"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M40 45 q3 3 4 0 q3 -5 6 0"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default Logo;
