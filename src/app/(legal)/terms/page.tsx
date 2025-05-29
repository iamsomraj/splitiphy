const TermsPage = () => {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-foreground">
        Terms of Service
      </h1>

      <div className="prose prose-gray dark:prose-invert">
        <section className="mb-6">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            1. Acceptance of Terms
          </h2>
          <p className="text-muted-foreground">
            By accessing and using Splitiphy, you agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do not
            use our service.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            2. Description of Service
          </h2>
          <p className="text-muted-foreground">
            Splitiphy provides a platform for users to track and split expenses
            among groups. We reserve the right to modify or discontinue the
            service at any time.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            3. User Accounts
          </h2>
          <p className="text-muted-foreground">
            You are responsible for maintaining the confidentiality of your
            account information and for all activities that occur under your
            account.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            4. Limitation of Liability
          </h2>
          <p className="text-muted-foreground">
            Splitiphy shall not be liable for any indirect, incidental, special,
            consequential or punitive damages resulting from your use or
            inability to use the service.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">
            5. Changes to Terms
          </h2>
          <p className="text-muted-foreground">
            We reserve the right to modify these terms at any time. Your
            continued use of Splitiphy after such modifications constitutes your
            acceptance of the updated terms.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
