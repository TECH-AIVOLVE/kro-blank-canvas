import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';

export const Rules = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 neon-text">Rules & Guidelines</h1>
        
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Battle Rules</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Submissions must be original content</li>
              <li>• No hate speech or offensive content</li>
              <li>• Respect your opponents and the community</li>
              <li>• Follow time limits for submissions</li>
              <li>• One submission per battle per user</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Voting Guidelines</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Vote based on skill, creativity, and delivery</li>
              <li>• No vote manipulation or gaming the system</li>
              <li>• Each user gets one vote per battle</li>
              <li>• Votes are final and cannot be changed</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Community Standards</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Maintain a positive and supportive environment</li>
              <li>• Report any violations to moderators</li>
              <li>• Constructive criticism is encouraged</li>
              <li>• Zero tolerance for harassment or bullying</li>
            </ul>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
