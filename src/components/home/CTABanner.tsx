import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

interface CTABannerProps {
  content?: {
    heading?: string;
    description?: string;
    primary_label?: string;
    primary_href?: string;
    secondary_label?: string;
    secondary_href?: string;
  };
}

export function CTABanner({ content }: CTABannerProps = {}) {
  const heading = content?.heading ?? "רוצים לשמוע עוד?";
  const description = content?.description ?? "בואו להכיר את קשת מקרוב. אנחנו מזמינים אתכם לביקור בבית הספר ולשיחה אישית.";
  const primaryLabel = content?.primary_label ?? "לתהליך ההרשמה";
  const primaryHref = content?.primary_href ?? "/admissions";
  const secondaryLabel = content?.secondary_label ?? "צרו קשר";
  const secondaryHref = content?.secondary_href ?? "/contact";
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with rainbow gradient */}
      <div className="absolute inset-0 bg-sand-900" />
      <div className="absolute inset-0 opacity-10 rainbow-gradient" />

      <Container className="relative">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {heading}
          </h2>
          <p className="text-xl text-sand-300 mb-8 max-w-xl mx-auto">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={primaryHref}>
              <Button size="lg" className="text-lg px-8">
                {primaryLabel}
              </Button>
            </Link>
            <Link href={secondaryHref}>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-white text-white hover:bg-white/10"
              >
                {secondaryLabel}
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
