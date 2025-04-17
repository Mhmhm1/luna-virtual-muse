
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AudioProvider } from "@/context/AudioContext";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <AudioProvider>
      <div className="flex h-screen items-center justify-center bg-gradient-radial from-emerald-50 via-white to-white">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-emerald-700">404</h1>
          <h2 className="mt-2 text-2xl font-medium text-emerald-600">Page Not Found</h2>
          <p className="mt-4 text-gray-600">Sorry, the page you are looking for does not exist.</p>
          <Button 
            className="mt-6 bg-emerald-600 hover:bg-emerald-700"
            onClick={() => navigate('/')}
          >
            Go Home
          </Button>
        </div>
      </div>
    </AudioProvider>
  );
}
