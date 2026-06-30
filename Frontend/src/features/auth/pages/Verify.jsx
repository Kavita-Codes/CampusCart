

const Verify = () => {
  return (
    // Outer container to center the content on the screen
    <div className="min-h-screen flex items-center justify-center bg-purple-100 p-4">
      
      {/* Card container */}
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        
        {/* Header section with icon */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-3xl">✅</span>
          <h2 className="text-2xl font-bold text-purple-700">
            Check Your Email
          </h2>
        </div>
        
        {/* Description text */}
        <p className="text-gray-600">
          We've sent you an email to verify your account. 
          Please check your inbox and click the verification link.
        </p>
        
      </div>
    </div>
  );
};

export default Verify;