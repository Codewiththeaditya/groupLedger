import Navbar from '../../components/layout/Navbar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />

      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <span className="badge text-bg-success mb-3">Protected route</span>
                <h1 className="h3 mb-3">Hi, {user?.name}</h1>
                <p className="text-muted mb-4">
                  You are logged in as <strong>{user?.email}</strong>. Groups, expenses, and
                  settlements will appear here in the next steps.
                </p>

                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="border rounded p-3 h-100">
                      <h2 className="h6">Groups</h2>
                      <p className="small text-muted mb-0">Create roommate or trip groups.</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="border rounded p-3 h-100">
                      <h2 className="h6">Expenses</h2>
                      <p className="small text-muted mb-0">Track who paid for what.</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="border rounded p-3 h-100">
                      <h2 className="h6">Settlements</h2>
                      <p className="small text-muted mb-0">Mark debts as paid.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
