const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    className="h-4 w-4"
  >
    <path
      d="M7 7l10 10M17 7L7 17"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
);

const ModalCloseButton = ({ onClick, variant = "floating", className = "" }) => {
  const variantClass =
    variant === "inline" ? "modal-close-btn-inline" : "modal-close-btn";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      className={`${variantClass} ${className}`.trim()}
    >
      <CloseIcon />
    </button>
  );
};

export default ModalCloseButton;
