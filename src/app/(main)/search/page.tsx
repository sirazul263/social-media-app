import { TrendsSidebar } from "@/components/trends-sidebar";
import { Metadata } from "next";

interface PageProps {
  searchParams: { q: string };
}

export async function generateMetaData({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { q } = await searchParams;

  return {
    title: `Search result for : ${q}`,
  };
}
const SearchResults = async ({ searchParams }: PageProps) => {
  const { q } = await searchParams;

  return (
    <main className="w-full min-w-0 flex gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">
            Search results for &quot;{q}&quot;
          </h1>
        </div>
      </div>
      <TrendsSidebar />
    </main>
  );
};

export default SearchResults;
