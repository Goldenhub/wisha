import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import { useAuthStore } from "../stores/authStore";
import Header from "../components/Header";

const EVENT_EMOJIS: Record<string, string> = {
  birthday: "🎂",
  wedding: "💒",
  babyshower: "👶",
  anniversary: "❤️",
  graduation: "🎓",
  other: "🎉",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  const { data: celebrations, isLoading } = useQuery({
    queryKey: ["my-celebrations"],
    queryFn: api.celebrations.getMyCelebrations,
    enabled: isAuthenticated,
  });

  const handleShare = async (celebration: { title: string; slug: string }) => {
    const shareUrl = `${window.location.origin}/c/${celebration.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: celebration.title,
          text: `Join me in celebrating ${celebration.title}!`,
          url: shareUrl,
        });
      } catch (err) {
        console.log(err);
        if ((err as Error).name === "AbortError") return;
      }
    }
    navigator.clipboard.writeText(shareUrl);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/auth?mode=login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 pt-24 pb-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">My Celebrations</h2>
          <button 
            onClick={() => navigate("/create")} 
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Create New
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : celebrations?.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No celebrations yet</h3>
            <p className="text-gray-500 mb-6">Create your first celebration and share the joy!</p>
            <button onClick={() => navigate("/create")} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              Create Celebration
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {celebrations?.map((celebration: { id: number; slug: string; title: string; type: string; eventDate: string; expiresAt: string; confettiCount: number }) => {
              const isExpired = new Date(celebration.expiresAt) < new Date();
              return (
                <div key={celebration.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{EVENT_EMOJIS[celebration.type] || "🎉"}</span>
                      <span className="text-sm text-purple-600 font-medium capitalize">{celebration.type}</span>
                      {isExpired && <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">Memory</span>}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{celebration.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{new Date(celebration.eventDate).toLocaleDateString()}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <span>🎊</span>
                      <span>{celebration.confettiCount} confetti</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/c/${celebration.slug}`)} className="flex-1 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition text-sm font-medium">
                        View
                      </button>
                      {isExpired ? (
                        <button onClick={() => navigate(`/memory/${celebration.slug}`)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition text-sm font-medium">
                          Memory Replay
                        </button>
                      ) : (
                        <button onClick={() => handleShare(celebration)} className="flex-1 px-4 py-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition text-sm font-medium">
                          Share
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
