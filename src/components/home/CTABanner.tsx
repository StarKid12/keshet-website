import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function CTABanner() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with rainbow gradient */}
      <div className="absolute inset-0 bg-sand-900" />
      <div className="absolute inset-0 opacity-10 rainbow-gradient" />

      <Container className="relative">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            רוצים לשמוע עוד?
          </h2>
          <p className="text-xl text-sand-300 mb-8 max-w-xl mx-auto">
            בואו להכיר את קשת מקרוב. אנחנו מזמינים אתכם לביקור בבית הספר
            ולשיחה אישית.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/admissions">
              <Button size="lg" className="text-lg px-8">
                לתהליך ההרשמה
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-white text-white hover:bg-white/10"
              >
                צרו קשר
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
