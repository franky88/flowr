import { apiFetch } from "@/lib/api";

export default async function TestPage() {
  const data = await apiFetch("/v1/whoami");

  return (
    <pre className="p-6 bg-gray-100 rounded">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
