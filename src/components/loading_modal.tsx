interface LoadingModalProps {
  message?: string;
  showSpinner?: boolean;
}

export default function LoadingModal({
  message = "Loading...",
  showSpinner = true,
}: LoadingModalProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {showSpinner && (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#71D285] mx-auto mb-4"></div>
        )}
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}