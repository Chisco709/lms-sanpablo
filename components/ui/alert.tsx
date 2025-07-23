// Simple Alert placeholder
export default function Alert({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-yellow-200 text-yellow-800 p-3 rounded-md border border-yellow-400">
      {children}
    </div>
  );
}

export const AlertTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="font-bold mb-1">{children}</div>
);

export const AlertDescription = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm">{children}</div>
);
