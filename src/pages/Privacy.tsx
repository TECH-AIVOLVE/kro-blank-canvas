import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';

export const Privacy = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 neon-text">Privacy Policy</h1>
        
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="text-muted-foreground">
              We collect information you provide directly to us, including username, email address, 
              and content submissions. We also collect usage data to improve our platform.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li>• To provide and maintain our services</li>
              <li>• To notify you about changes to our service</li>
              <li>• To provide customer support</li>
              <li>• To detect, prevent and address technical issues</li>
              <li>• To improve user experience</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your personal information. 
              However, no method of transmission over the internet is 100% secure.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="text-muted-foreground">
              You have the right to access, update, or delete your personal information at any time. 
              Contact us if you wish to exercise these rights.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update our Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page.
            </p>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
