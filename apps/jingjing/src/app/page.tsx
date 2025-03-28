
import TopNav from "@/components/TopNav";

export default function Index() {
  return (
    <div className="grid grid-rows-layout grid-cols-1 min-h-screen">
      <header className="bg-gray-200 p-4">
        <TopNav />
      </header>
      <article className="flex-grow p-4">
        <h1 className="text-4xl font-bold text-center text-blue-600">
          Welcome to jingjing!
        </h1>
      </article>
      <aside className="bg-gray-100 p-4">Aside</aside>
      <footer className="bg-gray-200 p-4">Footer</footer>
    </div>
  );
}
