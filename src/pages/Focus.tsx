import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Focus() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Focusページです。</h1>
      <div className="flex gap-3">
        <Button>shadcn 黒ボタン</Button>
        <Link to="/Do">
          <Button variant="secondary">Doへ</Button>
        </Link>
      </div>
    </main>
  );
}
