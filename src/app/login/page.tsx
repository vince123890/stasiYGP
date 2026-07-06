"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Church } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError("Email atau password salah.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <Card className="w-full max-w-sm p-8">
        <div className="flex items-center gap-2 font-display text-lg text-parish-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-parish-600 text-white">
            <Church size={18} />
          </span>
          Login Admin
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-parish-800">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-parish-200 px-3 py-2 text-sm outline-none focus:border-parish-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-parish-800">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-parish-200 px-3 py-2 text-sm outline-none focus:border-parish-500"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full justify-center" size="md">
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>
      </Card>
    </Container>
  );
}
