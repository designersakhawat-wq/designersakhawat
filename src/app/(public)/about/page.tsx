import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import ContactCTA from "@/components/public/ContactCTA";
import FloatingWhatsApp from "@/components/public/FloatingWhatsApp";
import AboutInteractiveExperience from "@/components/public/AboutInteractiveExperience";
import { getSettings } from "@/lib/db/settings";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings(["site_name", "seo_default_description"]);
  return {
    title: `About Md Sakhawat Hossain | Senior Brand & UI/UX Designer`,
    description: "Learn about Md Sakhawat Hossain — creative graphic designer with 3+ years of experience delivering 590+ successful branding, packaging, and digital projects worldwide.",
  };
}

export default async function AboutPage() {
  const settings = await getSettings([
    "site_name", "site_tagline", "about_bio",
    "contact_whatsapp_url", "contact_email",
    "social_facebook", "social_instagram", "social_linkedin", "social_behance", "social_youtube",
    "contact_location",
  ]);

  return (
    <>
      <Navbar />
      <main>
        <AboutInteractiveExperience settings={settings} />

        <ContactCTA
          whatsappUrl={settings.contact_whatsapp_url || "https://wa.me/8801781955355"}
          email={settings.contact_email || "designersakhawat86@gmail.com"}
        />
      </main>
      <Footer settings={settings} />
      <FloatingWhatsApp number="8801781955355" />
    </>
  );
}
