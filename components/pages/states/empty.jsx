import { Frown } from "lucide-react";

export const EmptyState = ({ message = "hello world" }) => (
  <div className="flex flex-col items-center justify-center p-10 text-center space-y-4">
    <Frown size={80} className="text-gray-400" />
    <p variant="body" className="text-gray-600">
      {message}
    </p>
  </div>
);
