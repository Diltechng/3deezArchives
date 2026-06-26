const LoadingSpinner = ({ radius=10, width=3 }) => (
  <div
    className="rounded-full border border-border-2 border-t-accent animate-spin"
    style={{
      height: `${radius*4}px`,
      width: `${radius*4}px`,
      borderWidth: `${width}px`
    }}
  />
);

export default LoadingSpinner;