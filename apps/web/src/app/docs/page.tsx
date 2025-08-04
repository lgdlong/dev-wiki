export default function DocsPage() {
  const BACKEND_LOCAL_HOST = "http://localhost:8000";
  const API_DOCS_URL = `${BACKEND_LOCAL_HOST}/api/docs`;
  return (
    <div>
      <h1>Dev Wiki Document</h1>
      <a className="text-blue-500" href={API_DOCS_URL}>
        API Docs
      </a>
    </div>
  );
}
