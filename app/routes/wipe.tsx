import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
  const { auth, isLoading, error, fs, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadFiles = async () => {
    const files = (await fs.readDir("./")) as FSItem[];
    setFiles(files);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading]);

  const handleDelete = async () => {
    setIsDeleting(true);
    files.forEach(async (file) => {
      await fs.delete(file.path);
    });
    await kv.flush();
    await loadFiles();
    setIsDeleting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800">
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 max-w-md">
          <p className="text-red-400 font-semibold">Error occurred</p>
          <p className="text-red-300 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Data Management</h1>
          <p className="text-slate-400">
            Account:{" "}
            <span className="text-blue-400 font-semibold">
              {auth.user?.username}
            </span>
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-slate-100">
            Existing Files
          </h2>

          {files.length > 0 ? (
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 bg-slate-700/30 hover:bg-slate-700/50 transition-colors rounded-md p-3 border border-slate-600/50"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-slate-200">{file.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">No files found</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleDelete}
            disabled={isDeleting || files.length === 0}
            className="bg-red-600 hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-500/50 flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Wiping...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Wipe App Data
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WipeApp;
