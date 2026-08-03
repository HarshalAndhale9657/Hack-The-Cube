import { createMetadata } from "@/lib/metadata";
import { SectionContainer } from "@/components/layout/section-container";
import { SectionHeading } from "@/components/shared/section-heading";
import { RegistrationForm } from "@/components/blocks/registration-form";
import { siteConfig } from "@/content/site-config";
import { formatDate } from "@/lib/utils";

export const metadata = createMetadata({
  title: "Register",
  description: `Register for ${siteConfig.name} — individual or team registration for the 24-hour national hackathon. Registration fee: ₹${siteConfig.registration.registrationFee}.`,
  path: "/register",
});

export default function RegisterPage() {
  return (
    <SectionContainer>
      <SectionHeading
        overline="Join the Hackathon"
        title="Register Now"
        subtitle={`Secure your spot at ${siteConfig.name}. Registration closes ${formatDate(siteConfig.dates.registrationCloses)}.`}
      />
      <RegistrationForm />
    </SectionContainer>
  );
}
