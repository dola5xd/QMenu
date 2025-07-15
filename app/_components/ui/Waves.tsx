function Waves({
  className,
  color = "#fef8e8",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <span className={`w-full absolute ${className}`}>
      <svg
        width="100%"
        height="100%"
        id="svg"
        viewBox="0 0 1440 350"
        xmlns="http://www.w3.org/2000/svg"
        className="transition duration-300 ease-in-out delay-150"
      >
        <path
          d="M 0,400 L 0,150 C 92.28205128205127,198.13076923076923 184.56410256410254,246.26153846153846 274,221 C 363.43589743589746,195.73846153846154 450.0256410256411,97.08461538461538 514,91 C 577.9743589743589,84.91538461538462 619.3333333333333,171.40000000000003 692,205 C 764.6666666666667,238.59999999999997 868.6410256410259,219.31538461538463 948,202 C 1027.3589743589741,184.68461538461537 1082.102564102564,169.33846153846153 1160,161 C 1237.897435897436,152.66153846153847 1338.948717948718,151.33076923076925 1440,150 L 1440,400 L 0,400 Z"
          stroke="none"
          strokeWidth="0"
          fill={color}
          fillOpacity="1"
          className="transition-all duration-300 ease-in-out delay-150 path-0"
          transform="rotate(-180 720 25)"
        ></path>
      </svg>
    </span>
  );
}

export default Waves;
