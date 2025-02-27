import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

const Cam = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
      alert("Failed to access webcam.");
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-blue-300 text-white">
      <h1 className="text-3xl font-semibold mb-6">Camera Access</h1>
      
      <div className="flex gap-4">
        <Button onClick={startCamera} className="bg-white text-blue-700 hover:bg-gray-200">
          Open Camera
        </Button>
        {stream && (
          <Button onClick={stopCamera} className="bg-red-500 text-white hover:bg-red-600">
            Close Camera
          </Button>
        )}
      </div>

      <div className="mt-6">
        <video ref={videoRef} autoPlay playsInline className="rounded-lg shadow-lg"></video>
      </div>
    </div>
  );
};

export default Cam;
