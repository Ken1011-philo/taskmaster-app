import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Plan() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Planページです。</h1>
      <div className="flex gap-3">
        <Button>shadcn 黒ボタン</Button>
        <Link to="/Do">
          <Button variant="secondary">Doへ</Button>
        </Link>
      </div>
    </main>
  );
}
