import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';

export const Terms = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 neon-text">Terms of Service</h1>
        
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using The Battle App, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li>• You must be at least 13 years old to use this service</li>
              <li>• You are responsible for maintaining account security</li>
              <li>• You must not use the platform for illegal activities</li>
              <li>• You own the content you submit but grant us license to display it</li>
              <li>• You must respect intellectual property rights</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Prohibited Activities</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Harassment, bullying, or threatening behavior</li>
              <li>• Posting offensive, hateful, or discriminatory content</li>
              <li>• Attempting to manipulate voting or rankings</li>
              <li>• Impersonating other users or entities</li>
              <li>• Distributing malware or harmful code</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Content Rights</h2>
            <p className="text-muted-foreground">
              You retain all rights to your original content. By submitting content, you grant us 
              a worldwide, non-exclusive, royalty-free license to use, reproduce, and display 
              your content on our platform.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Termination</h2>
            <p className="text-muted-foreground">
              We reserve the right to terminate or suspend access to our service immediately, 
              without prior notice, for conduct that we believe violates these Terms of Service.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
            <p className="text-muted-foreground">
              The service is provided "as is" without warranty of any kind. We do not guarantee 
              the service will be uninterrupted, secure, or error-free.
            </p>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
