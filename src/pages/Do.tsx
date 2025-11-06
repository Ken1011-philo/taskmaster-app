import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Do() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Doページです。</h1>
      <div className="flex gap-3">
        <Button>shadcn 黒ボタン</Button>
        <Link to="/Focus">
          <Button variant="secondary">Focusへ</Button>
        </Link>
      </div>
    </main>
  );
}
