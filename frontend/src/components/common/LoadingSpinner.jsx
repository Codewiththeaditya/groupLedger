export default function LoadingSpinner({ message = 'Loading...', fullscreen = false }) {
  const wrapperClass = fullscreen
    ? 'd-flex flex-column justify-content-center align-items-center min-vh-100'
    : 'd-flex flex-column justify-content-center align-items-center py-5';

  return (
    <div className={wrapperClass}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">{message}</span>
      </div>
      <p className="mt-3 text-muted mb-0">{message}</p>
    </div>
  );
}
