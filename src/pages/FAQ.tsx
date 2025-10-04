import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const FAQ = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 neon-text">Frequently Asked Questions</h1>
        
        <Card className="p-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I submit a battle?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Navigate to the Submit page, select an active battle, and upload your rap submission. 
                Make sure to follow the time limits and content guidelines.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How does voting work?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Each user gets one vote per battle. Listen to both submissions and vote for the one 
                you think deserves to win based on skill, creativity, and delivery.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>What is the leaderboard based on?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                The leaderboard ranks users based on their battle wins, total votes received, 
                and overall performance in tournaments.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Can I edit my submission after posting?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                No, submissions are final once posted. Make sure to review your content 
                before submitting.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>How do tournaments work?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Tournaments are bracket-style competitions where winners advance to the next round. 
                Check the Tournament page for current and upcoming events.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>What happens if I violate the rules?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Violations may result in submission removal, temporary suspension, or permanent ban 
                depending on severity. All actions are logged and reviewed by admins.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>
    </Layout>
  );
};
