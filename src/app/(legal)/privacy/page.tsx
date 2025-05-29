const PrivacyPage = () => {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-foreground">
        Privacy Policy
      </h1>

      <div className="prose prose-gray dark:prose-invert">
        <section className="mb-6">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            1. Information We Collect
          </h2>
          <p className="text-muted-foreground">
            We collect information you provide directly to us when you create an
            account, use our services, or communicate with us. This may include
            personal information such as your name, email address, and payment
            information.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            2. How We Use Information
          </h2>
          <p className="text-muted-foreground">
            We use the information we collect to provide, maintain, and improve
            our services, communicate with you, and personalize your experience.
            We may also use the information for analytics and research purposes.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            3. Sharing of Information
          </h2>
          <p className="text-muted-foreground">
            We do not sell your personal information. We may share information
            with third-party service providers who perform services on our
            behalf, such as payment processing and analytics.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            4. Data Security
          </h2>
          <p className="text-muted-foreground">
            We implement reasonable measures to protect your information from
            unauthorized access, alteration, and destruction. However, no
            security system is impenetrable, and we cannot guarantee the
            security of our systems.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            5. Your Rights
          </h2>
          <p className="text-muted-foreground">
            Depending on your location, you may have rights regarding your
            personal information, such as the right to access, correct, or
            delete your data. Contact us to exercise these rights.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
