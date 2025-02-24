
import { SignIn } from "@clerk/clerk-react";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        <SignIn 
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          redirectUrl="/student-dashboard"
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              card: "glass-card rounded-2xl animate-fade-in",
              headerTitle: "text-2xl font-semibold",
              headerSubtitle: "text-gray-500",
            },
          }}
        />
      </div>
    </div>
  );
};

export default Index;
