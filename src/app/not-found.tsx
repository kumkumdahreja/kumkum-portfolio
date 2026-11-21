import type { Metadata } from "next";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="grid min-h-[70vh] place-items-center px-5 pt-32 text-center">
      <div>
        <p className="label justify-center">404</p>
        <h1 className="display mt-4 text-6xl">
          This page <em>wandered off.</em>
        </h1>
        <div className="mt-8 flex justify-center">
          <Button href="/">Back home</Button>
        </div>
      </div>
    </section>
  );
}
