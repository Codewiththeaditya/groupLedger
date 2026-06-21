import { Link } from 'react-router-dom';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <h1 className="h3 mb-2">{title}</h1>
                  <p className="text-muted mb-0">{subtitle}</p>
                </div>
                {children}
              </div>
            </div>

            <p className="text-center text-muted small mt-3 mb-0">
              Split expenses with your roommates and friends.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthFooterLink({ text, linkText, to }) {
  return (
    <p className="text-center mt-4 mb-0">
      {text}{' '}
      <Link to={to} className="text-decoration-none">
        {linkText}
      </Link>
    </p>
  );
}
