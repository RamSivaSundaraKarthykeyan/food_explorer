export default function Skeleton() {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white animate-pulse">
      <div className="h-48 w-full bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}