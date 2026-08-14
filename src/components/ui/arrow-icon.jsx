const rotations = {
  down: 0,
  left: 90,
  up: 180,
  right: 270,
}

export function ArrowIcon({
  direction = 'down',
  size = 24,
  className,
  ...props
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6.5332 15.1406L6.5332 11.501L2.89551 11.501L2.89551 7.85938L6.53613 7.85938L6.53613 11.5L10.1738 11.5L10.1738 15.1406L6.5332 15.1406ZM17.4609 11.501L17.4609 15.1406L13.8232 15.1406L13.8232 18.7813L10.1826 18.7813L10.1826 15.1406L13.8203 15.1406L13.8203 11.5L17.4609 11.5L17.4609 7.85938L21.1016 7.85938L21.1016 11.501L17.4609 11.501Z"
        fill="currentColor"
        transform={`rotate(${rotations[direction] ?? rotations.down} 12 12)`}
      />
    </svg>
  )
}
