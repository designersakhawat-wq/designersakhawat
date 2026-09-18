import type { ServicePackage } from "@/types";

interface PricingSectionProps {
  packages: ServicePackage[];
  showQuote: boolean;
  serviceName: string;
  whatsappBase: string;
  email: string;
}

export default function PricingSection({
  packages,
  showQuote,
  serviceName,
  whatsappBase,
  email,
}: PricingSectionProps) {
  return (
    <section className="section" style={{ background: "var(--bg-base)" }} aria-labelledby="pricing-heading">
      <div className="container">
        {packages.length > 0 && (
          <>
            <span className="section-label">Investment</span>
            <h2 id="pricing-heading" className="section-heading">Pricing Packages</h2>
            <div className={`grid-${Math.min(packages.length, 3)}`} style={{ marginBottom: showQuote ? "var(--space-2xl)" : 0 }}>
              {packages.map((pkg, i) => {
                let features: string[] = [];
                if (Array.isArray(pkg.features_json)) {
                  features = pkg.features_json;
                } else if (typeof pkg.features_json === "string") {
                  try {
                    features = JSON.parse(pkg.features_json);
                  } catch {
                    features = [];
                  }
                }
                const isFeatured = i === Math.floor(packages.length / 2);
                const whatsappMsg = encodeURIComponent(`Hi Sakhawat, I'm interested in the "${pkg.name}" package for ${serviceName}.`);
                const whatsappUrl = `${whatsappBase}?text=${whatsappMsg}`;

                return (
                  <div key={pkg.id} className={`pricing-card ${isFeatured ? "featured" : ""}`}>
                    <h3 className="pricing-name">{pkg.name}</h3>
                    {pkg.price !== null ? (
                      <div className="pricing-price">
                        {pkg.is_starting_from && (
                          <span className="starting-from">Starting from </span>
                        )}
                        <span className="currency">{pkg.currency === "USD" ? "$" : pkg.currency === "BDT" ? "৳" : pkg.currency}</span>
                        {typeof pkg.price === "number" ? pkg.price.toLocaleString() : pkg.price}
                      </div>
                    ) : (
                      <div className="pricing-price" style={{ fontSize: "var(--text-2xl)" }}>
                        Custom Pricing
                      </div>
                    )}
                    {pkg.description && <p className="pricing-desc">{pkg.description}</p>}
                    {features.length > 0 && (
                      <ul className="pricing-features" aria-label="Package features">
                        {features.map((feature, fi) => (
                          <li key={fi} className="pricing-feature">
                            <span className="pricing-feature-check" aria-hidden="true">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`btn ${isFeatured ? "btn-primary" : "btn-outline"}`}
                      style={{ width: "100%", justifyContent: "center" }}
                    >
                      Get This Package
                    </a>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {showQuote && (
          <div style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--accent-border)",
            borderRadius: "var(--radius-xl)",
            padding: "var(--space-2xl)",
            textAlign: "center",
            maxWidth: 600,
            margin: "0 auto",
          }}>
            <h3 style={{ marginBottom: "var(--space-sm)" }}>
              {packages.length > 0 ? "Need Something Custom?" : "Get a Quote"}
            </h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-xl)", maxWidth: "100%" }}>
              {packages.length > 0
                ? "Every project is unique. Let's discuss your specific requirements and create a custom package."
                : `Pricing for ${serviceName} is tailored to each project. Get in touch to discuss your requirements.`
              }
            </p>
            <div style={{ display: "flex", gap: "var(--space-sm)", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href={`${whatsappBase}?text=${encodeURIComponent(`Hi Sakhawat, I'd like a quote for ${serviceName}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                💬 WhatsApp for Quote
              </a>
              <a
                href={`mailto:${email}?subject=${encodeURIComponent(serviceName + " Quote Request")}`}
                className="btn btn-outline"
              >
                ✉️ Email for Quote
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
