import { HeroBlock } from "@/components/blocks/hero-block";
import { VideoFacade } from "@/components/blocks/video-facade";
import { EventInfoBlock } from "@/components/blocks/event-info-block";
import { IndustryCarousel } from "@/components/blocks/industry-carousel";
import { SpeakerGrid } from "@/components/blocks/speaker-grid";
import { TimelineRail } from "@/components/blocks/timeline-rail";
import { PrizePodium } from "@/components/blocks/prize-podium";
import { ProblemStatementsBlock } from "@/components/blocks/problem-statements-block";
import { SponsorGrid } from "@/components/blocks/sponsor-grid";
import { TeamGrid } from "@/components/blocks/team-grid";
import { LeadershipGrid } from "@/components/blocks/leadership-grid";
import { VenueBlock } from "@/components/blocks/venue-block";
import { GalleryGrid } from "@/components/blocks/gallery-grid";
import { FAQAccordion } from "@/components/blocks/faq-accordion";
import { SectionContainer } from "@/components/layout/section-container";
import { SectionHeading } from "@/components/shared/section-heading";
import { GradientDivider } from "@/components/shared/gradient-divider";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { speakers } from "@/content/speakers";
import { timelineEvents } from "@/content/timeline";
import { prizePool } from "@/content/prizes";
import { teamMembers, leadershipMembers } from "@/content/team";
import { faqs } from "@/content/faqs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SinglePageHome() {
  return (
    <>
      {/* 01. Hero Section — CSI Club Presents */}
      <HeroBlock />

      {/* 01. Full-Screen Hype Trailer */}
      <section id="video" className="w-full overflow-hidden">
        <VideoFacade title="Hack the Cube 2026 Trailer" />
      </section>

      <GradientDivider />

      {/* 04. Learn & Engage — Technical Talk Show & Keynotes */}
      <SectionContainer id="speakers">
        <SectionHeading
          number="04"
          overline="Learn & Engage"
          title="Technical Talk Show & Keynotes"
          subtitle="Industry leaders, founders, and CTOs sharing deep insights and technological roadmaps"
        />
        <SpeakerGrid speakers={speakers} />
      </SectionContainer>

      <GradientDivider />

      {/* 12. Highlights — Last Year's Memories (Self-contained Sticky Scroll Section) */}
      <GalleryGrid />

      <GradientDivider />

      {/* 02. Understand — About the Hackathon */}
      <SectionContainer id="about">
        <SectionHeading
          number="02"
          overline="Understand"
          title="About the Hackathon"
          subtitle="Discover the mission, vision, and objectives behind Hack the Cube 2026"
        />
        <EventInfoBlock />
      </SectionContainer>

      <GradientDivider />

      {/* 03. Explore Tracks — Industry Innovation Domains */}
      <SectionContainer id="tracks">
        <SectionHeading
          number="03"
          overline="Explore Tracks"
          title="Industry Innovation Domains"
          subtitle="Swipe through our specialized challenge tracks engineered for maximum impact"
        />
        <IndustryCarousel />
      </SectionContainer>

      <GradientDivider />

      {/* 05. Schedule — 24-Hour Event Itinerary */}
      <SectionContainer id="timeline">
        <SectionHeading
          number="05"
          overline="Schedule"
          title="24-Hour Event Itinerary"
          subtitle="From inauguration and talk show to non-stop hacking and final judging"
        />
        <TimelineRail events={timelineEvents} />
      </SectionContainer>

      <GradientDivider />

      {/* 06. Rewards & Perks — ₹3,00,000+ Prize Pool */}
      <SectionContainer id="prizes">
        <SectionHeading
          number="06"
          overline="Rewards & Perks"
          title="₹3,00,000+ Prize Pool"
          subtitle="Cash rewards, internship opportunities, incubation access, and goodies for all teams"
        />
        <PrizePodium prizePool={prizePool} />
      </SectionContainer>

      <GradientDivider />

      {/* 07. Challenges — Problem Statements */}
      <SectionContainer id="problems">
        <SectionHeading
          number="07"
          overline="Challenges"
          title="Problem Statements"
          subtitle="Released on the day of the hackathon — stay tuned!"
        />
        <ProblemStatementsBlock />
      </SectionContainer>

      <GradientDivider />

      {/* 08. Partnership — Backed by Industry Leaders */}
      <SectionContainer id="sponsors">
        <SectionHeading
          number="08"
          overline="Partnership"
          title="Backed by Industry Leaders"
          subtitle="Our sponsors powering Hack the Cube 2026"
        />
        <SponsorGrid />
      </SectionContainer>

      <GradientDivider />

      {/* 09. Organizers — Meet the Team */}
      <SectionContainer id="team">
        <SectionHeading
          number="09"
          overline="Organizers"
          title="Meet the Team"
          subtitle="The student leads and faculty advisors behind CSI Club's flagship hackathon"
        />
        <div className="w-full space-y-12">
          <div>
            <h3 className="text-overline text-orange-500 mb-6 text-center font-mono">Core Organizers</h3>
            <TeamGrid members={teamMembers} category="core" />
          </div>
          <div>
            <h3 className="text-overline text-orange-500 mb-6 text-center font-mono">Faculty Coordinators</h3>
            <TeamGrid members={teamMembers} category="faculty-coordinator" />
          </div>
          <div>
            <h3 className="text-overline text-orange-500 mb-6 text-center font-mono">Student Coordinators</h3>
            <TeamGrid members={teamMembers} category="student-coordinator" />
          </div>
        </div>
      </SectionContainer>

      <GradientDivider />

      {/* 10. Institutional Guidance — College Leadership */}
      <SectionContainer id="leadership">
        <SectionHeading
          number="10"
          overline="Institutional Guidance"
          title="College Leadership"
          subtitle="Messages of encouragement from our Director and Head of Department"
        />
        <LeadershipGrid members={leadershipMembers} />
      </SectionContainer>

      <GradientDivider />

      {/* 11. Location & Facilities — Venue & Logistics */}
      <SectionContainer id="venue">
        <SectionHeading
          number="11"
          overline="Location & Facilities"
          title="Venue & Logistics"
          subtitle="Campus address, inauguration auditorium, 24/7 computing facility, and WiFi details"
        />
        <VenueBlock />
      </SectionContainer>

      <GradientDivider />

      {/* 13. Answers — Frequently Asked Questions */}
      <SectionContainer id="faq">
        <SectionHeading
          number="13"
          overline="Answers"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about registration, eligibility, food, and venue access"
        />
        <FAQAccordion faqs={faqs} />
      </SectionContainer>

      <GradientDivider />

      {/* Final CTA Section */}
      <SectionContainer id="register">
        <ScrollReveal>
          <div className="text-center py-8">
            <SectionHeading
              overline="Ready to Build?"
              title="Join Hack the Cube 2026"
              subtitle="Registration spots are limited. Secure your spot now and compete for ₹3,00,000+ in prizes."
            />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <Link href="/register" className="btn-primary text-lg px-10 py-4">
                Register Now
                <ArrowRight size={20} />
              </Link>
              <a
                href="#faq"
                className="btn-secondary px-8 py-3.5"
              >
                Read FAQs
              </a>
            </div>
          </div>
        </ScrollReveal>
      </SectionContainer>
    </>
  );
}
