import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Task Colab",
  description: "Terms of Service for Task Colab - Read our terms and conditions for using the platform.",
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-background py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 27, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using Task Colab (&quot;the Platform&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you may not access or use the Platform. We reserve the right to modify these Terms at any time, and your continued use of the Platform constitutes acceptance of any modifications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              Task Colab is a marketplace platform that connects Buyers who need projects completed with Problem Solvers who can execute those projects. The Platform facilitates project creation, task management, file submissions, and communication between parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">3. User Accounts</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To use certain features of the Platform, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">4. User Roles and Responsibilities</h2>
            
            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">4.1 Buyers</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Create projects with clear and accurate descriptions</li>
              <li>Review and respond to work requests in a timely manner</li>
              <li>Provide constructive feedback on submissions</li>
              <li>Make payments as agreed upon project completion</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">4.2 Problem Solvers</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Accurately represent skills and capabilities</li>
              <li>Deliver work that meets project requirements</li>
              <li>Meet agreed-upon deadlines</li>
              <li>Communicate proactively about project progress</li>
              <li>Submit original work that does not infringe on third-party rights</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">4.3 Admins</h3>
            <p className="text-muted-foreground leading-relaxed">
              Administrators are responsible for managing users, assigning roles, and ensuring the Platform operates smoothly. Admin actions are subject to these Terms and our internal policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Prohibited Conduct</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Misrepresent your identity or affiliation</li>
              <li>Circumvent Platform fees or payment systems</li>
              <li>Scrape, data mine, or use automated tools without permission</li>
              <li>Interfere with the proper functioning of the Platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong className="text-foreground">Platform Content:</strong> The Platform and its original content, features, and functionality are owned by Task Colab and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">User Content:</strong> You retain ownership of content you submit. By uploading content, you grant us a non-exclusive, worldwide license to use, display, and distribute that content as necessary to operate the Platform. Upon project completion and payment, intellectual property rights transfer as agreed between Buyer and Problem Solver.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">7. Payments and Fees</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>All fees are displayed before transaction completion</li>
              <li>Payments are processed through secure third-party providers</li>
              <li>Refunds are subject to our Refund Policy</li>
              <li>Users are responsible for applicable taxes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">8. Disclaimers</h2>
            <p className="text-muted-foreground leading-relaxed">
              THE PLATFORM IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THAT THE PLATFORM WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE. WE ARE NOT RESPONSIBLE FOR THE QUALITY, ACCURACY, OR LEGALITY OF USER CONTENT OR THE ABILITY OF USERS TO COMPLETE TRANSACTIONS.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">9. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, TASK COLAB SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE PLATFORM.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">10. Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify and hold harmless Task Colab, its affiliates, and their respective officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorney&apos;s fees) arising from your use of the Platform or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">11. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may terminate or suspend your account and access to the Platform immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties. Upon termination, your right to use the Platform will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">12. Dispute Resolution</h2>
            <p className="text-muted-foreground leading-relaxed">
              Any disputes arising from these Terms or your use of the Platform shall first be attempted to be resolved through good-faith negotiation. If negotiation fails, disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">13. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">14. Severability</h2>
            <p className="text-muted-foreground leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">15. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these Terms, please contact us at:
            </p>
            <p className="text-muted-foreground mt-2">
              Email: saminul.amin@gmail.com<br />
              Address: Mirpur, Dhaka, Bangladesh
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
