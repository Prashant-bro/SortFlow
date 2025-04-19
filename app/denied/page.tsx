export default function DeniedPage() {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-3xl font-bold text-red-500">Access Denied</h1>
          <p className="mt-4 text-gray-600">
            You are not authorized to access this app. Please sign up first.
          </p>
        </div>
      </div>
    );
  }
  