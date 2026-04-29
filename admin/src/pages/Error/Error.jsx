import './Error.css';

const Error = () => {
  return (
    <div className="error-container">
      <h1 className="error-title">Access Denied</h1>
      <p className="error-message">You do not have the required permissions to view this page.</p>
      <a href="/" className="error-button">Go Back to Login</a>
    </div>
  );
};

export default Error;
