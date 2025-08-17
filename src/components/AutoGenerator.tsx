import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Flashcard } from "@/pages/Index";

interface AutoGeneratorProps {
  onBack: () => void;
  onFlashcardsGenerated: (flashcards: Flashcard[]) => void;
  existingWords?: string[];
}

const AutoGenerator = ({ onBack, onFlashcardsGenerated, existingWords = [] }: AutoGeneratorProps) => {
  const [difficulty, setDifficulty] = useState<'ISEE'>('ISEE');
  const [nounCount, setNounCount] = useState(3);
  const [adjectiveCount, setAdjectiveCount] = useState(3);
  const [verbCount, setVerbCount] = useState(2);
  const [adverbCount, setAdverbCount] = useState(2);
  const [avoidDuplicates, setAvoidDuplicates] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // ISEE word sets organized by part of speech
  const iseeWordSets = {
    nouns: [
      { word: "accomplice", definition: "A person who helps another commit a crime", example: "The police arrested the thief and his accomplice.", partOfSpeech: "noun" as const },
      { word: "acumen", definition: "The ability to make good judgments and quick decisions", example: "Her business acumen helped the company succeed.", partOfSpeech: "noun" as const },
      { word: "altruism", definition: "Unselfish regard for or devotion to the welfare of others", example: "His altruism led him to volunteer at the shelter.", partOfSpeech: "noun" as const },
      { word: "assertion", definition: "A confident and forceful statement of fact or belief", example: "His assertion about the test results proved correct.", partOfSpeech: "noun" as const },
      { word: "aspiration", definition: "A hope or ambition of achieving something", example: "Her aspiration is to become a doctor.", partOfSpeech: "noun" as const },
      { word: "autonomy", definition: "The right or condition of self-government", example: "The teenager wanted more autonomy in making decisions.", partOfSpeech: "noun" as const },
      { word: "brevity", definition: "Concise and exact use of words in writing or speech", example: "The brevity of her speech made it more powerful.", partOfSpeech: "noun" as const },
      { word: "circumstance", definition: "A fact or condition connected with an event or action", example: "Under no circumstance should you give up.", partOfSpeech: "noun" as const },
      { word: "compliance", definition: "The action of conforming to rules or standards", example: "All students must be in compliance with the dress code.", partOfSpeech: "noun" as const },
      { word: "compromise", definition: "A settlement of differences by mutual concessions", example: "They reached a compromise about the project deadline.", partOfSpeech: "noun" as const },
      { word: "credibility", definition: "The quality of being trusted and believed in", example: "The witness's credibility was questioned in court.", partOfSpeech: "noun" as const },
      { word: "defiance", definition: "Open resistance; bold disobedience", example: "His defiance of the rules got him in trouble.", partOfSpeech: "noun" as const },
      { word: "dilemma", definition: "A situation requiring a choice between equally undesirable alternatives", example: "She faced a dilemma between work and family time.", partOfSpeech: "noun" as const },
      { word: "dissent", definition: "The holding or expression of opinions at variance with those held", example: "The judge filed a dissent from the majority opinion.", partOfSpeech: "noun" as const },
      { word: "empathy", definition: "The ability to understand and share the feelings of another", example: "Good teachers show empathy for their students.", partOfSpeech: "noun" as const },
      { word: "endeavor", definition: "An attempt to achieve a goal", example: "We should endeavor to help those in need.", partOfSpeech: "noun" as const },
      { word: "escalation", definition: "A rapid increase; a rise", example: "The escalation of the argument worried everyone.", partOfSpeech: "noun" as const },
      { word: "essence", definition: "The intrinsic nature or indispensable quality of something", example: "The essence of friendship is trust and loyalty.", partOfSpeech: "noun" as const },
      { word: "excerpt", definition: "A short extract from a film, broadcast, or piece of writing", example: "The teacher read an excerpt from the novel.", partOfSpeech: "noun" as const },
      { word: "exile", definition: "The state of being barred from one's native country", example: "The political leader was forced into exile.", partOfSpeech: "noun" as const },
      { word: "grievance", definition: "A real or imagined wrong or cause for complaint", example: "The employee filed a grievance about working conditions.", partOfSpeech: "noun" as const },
      { word: "hostility", definition: "Hostile behavior; unfriendliness or opposition", example: "There was obvious hostility between the two teams.", partOfSpeech: "noun" as const },
      { word: "ideology", definition: "A system of ideas and ideals forming the basis of policy", example: "Different political parties have different ideologies.", partOfSpeech: "noun" as const },
      { word: "implication", definition: "A conclusion that can be drawn from something", example: "The implication of his statement was clear.", partOfSpeech: "noun" as const },
      { word: "inclination", definition: "A tendency to do something", example: "She has an inclination toward mathematics.", partOfSpeech: "noun" as const },
      { word: "initiative", definition: "The ability to assess and initiate things independently", example: "He showed great initiative in solving the problem.", partOfSpeech: "noun" as const },
      { word: "innovation", definition: "The action or process of innovating", example: "The company is known for its innovation in technology.", partOfSpeech: "noun" as const },
      { word: "integrity", definition: "The quality of being honest and having strong moral principles", example: "Her integrity made her a trusted leader.", partOfSpeech: "noun" as const },
      { word: "intuition", definition: "The ability to understand something immediately", example: "Her intuition told her something was wrong.", partOfSpeech: "noun" as const },
      { word: "jeopardy", definition: "Danger of loss, harm, or failure", example: "The mission put their lives in jeopardy.", partOfSpeech: "noun" as const },
      { word: "jurisdiction", definition: "The official power to make legal decisions", example: "This case falls under federal jurisdiction.", partOfSpeech: "noun" as const },
      { word: "livelihood", definition: "A means of securing the necessities of life", example: "Farming is their primary livelihood.", partOfSpeech: "noun" as const },
      { word: "magnitude", definition: "The great size or extent of something", example: "We didn't understand the magnitude of the problem.", partOfSpeech: "noun" as const },
      { word: "mastery", definition: "Comprehensive knowledge or skill in a subject", example: "His mastery of the piano was evident.", partOfSpeech: "noun" as const },
      { word: "momentum", definition: "The quantity of motion of a moving body", example: "The team gained momentum after their first win.", partOfSpeech: "noun" as const },
      { word: "negligence", definition: "Failure to take proper care in doing something", example: "The accident was caused by negligence.", partOfSpeech: "noun" as const },
      { word: "nostalgia", definition: "A sentimental longing for the past", example: "Looking at old photos filled her with nostalgia.", partOfSpeech: "noun" as const },
      { word: "optimism", definition: "Hopefulness and confidence about the future", example: "Her optimism helped the team stay motivated.", partOfSpeech: "noun" as const },
      { word: "phenomenon", definition: "A fact or situation that is observed to exist", example: "The northern lights are a beautiful phenomenon.", partOfSpeech: "noun" as const },
      { word: "precedent", definition: "An earlier event or action that is regarded as an example", example: "This case could set an important legal precedent.", partOfSpeech: "noun" as const },
      { word: "prosperity", definition: "The state of being prosperous", example: "The country enjoyed a period of prosperity.", partOfSpeech: "noun" as const },
      { word: "rationale", definition: "A set of reasons or a logical basis for a course of action", example: "She explained the rationale behind her decision.", partOfSpeech: "noun" as const },
      { word: "resilience", definition: "The ability to recover quickly from difficulties", example: "The community showed great resilience after the disaster.", partOfSpeech: "noun" as const },
      { word: "scrutiny", definition: "Critical observation or examination", example: "The proposal came under close scrutiny.", partOfSpeech: "noun" as const },
      { word: "solidarity", definition: "Unity or agreement of feeling or action", example: "The workers showed solidarity during the strike.", partOfSpeech: "noun" as const },
      { word: "sophistication", definition: "The quality of being sophisticated", example: "The design showed remarkable sophistication.", partOfSpeech: "noun" as const },
      { word: "speculation", definition: "The forming of a theory without firm evidence", example: "There was much speculation about the company's future.", partOfSpeech: "noun" as const },
      { word: "stamina", definition: "The ability to sustain prolonged physical or mental effort", example: "Marathon runners need great stamina.", partOfSpeech: "noun" as const },
      { word: "strategy", definition: "A plan of action designed to achieve a goal", example: "Their strategy for winning was well-planned.", partOfSpeech: "noun" as const },
      { word: "versatility", definition: "Ability to adapt or be adapted to many different functions", example: "The tool's versatility made it very useful.", partOfSpeech: "noun" as const },
      { word: "vigilance", definition: "The action or state of keeping careful watch", example: "Constant vigilance is needed to prevent accidents.", partOfSpeech: "noun" as const }
    ],
    adjectives: [
      { word: "arbitrary", definition: "Based on random choice or personal whim", example: "The judge's decision seemed arbitrary and unfair.", partOfSpeech: "adjective" as const },
      { word: "benevolent", definition: "Well meaning and kindly", example: "The benevolent teacher helped struggling students.", partOfSpeech: "adjective" as const },
      { word: "comprehensive", definition: "Complete; including all or nearly all elements", example: "The comprehensive exam covers the entire semester.", partOfSpeech: "adjective" as const },
      { word: "debatable", definition: "Open to discussion or argument", example: "Whether homework helps students is debatable.", partOfSpeech: "adjective" as const },
      { word: "deliberate", definition: "Done consciously and intentionally", example: "Her deliberate choice to study paid off.", partOfSpeech: "adjective" as const },
      { word: "detrimental", definition: "Tending to cause harm", example: "Smoking is detrimental to your health.", partOfSpeech: "adjective" as const },
      { word: "feasible", definition: "Possible to do easily or conveniently", example: "The plan seems feasible with our current budget.", partOfSpeech: "adjective" as const },
      { word: "formidable", definition: "Inspiring fear or respect through being impressively powerful", example: "The mountain climber faced a formidable challenge.", partOfSpeech: "adjective" as const },
      { word: "fundamental", definition: "Forming a necessary base or core; central", example: "Reading is fundamental to all learning.", partOfSpeech: "adjective" as const },
      { word: "gracious", definition: "Courteous, kind, and pleasant", example: "The gracious host made everyone feel welcome.", partOfSpeech: "adjective" as const },
      { word: "hypothetical", definition: "Based on a suggested idea rather than known facts", example: "Let's consider a hypothetical situation.", partOfSpeech: "adjective" as const },
      { word: "immense", definition: "Extremely large or great", example: "The immense library contained millions of books.", partOfSpeech: "adjective" as const },
      { word: "impartial", definition: "Treating all rivals or disputants equally; fair", example: "A good judge must remain impartial during trials.", partOfSpeech: "adjective" as const },
      { word: "imperative", definition: "Of vital importance; crucial", example: "It is imperative that you arrive on time.", partOfSpeech: "adjective" as const },
      { word: "indispensable", definition: "Absolutely necessary", example: "Good communication is indispensable in teamwork.", partOfSpeech: "adjective" as const },
      { word: "inevitable", definition: "Certain to happen; unavoidable", example: "Change is inevitable in life.", partOfSpeech: "adjective" as const },
      { word: "innate", definition: "Inborn; natural", example: "She has an innate talent for music.", partOfSpeech: "adjective" as const },
      { word: "innovative", definition: "Featuring new methods; advanced and original", example: "The innovative design won many awards.", partOfSpeech: "adjective" as const },
      { word: "insignificant", definition: "Too small or unimportant to be worth consideration", example: "The error was insignificant and didn't affect the results.", partOfSpeech: "adjective" as const },
      { word: "legitimate", definition: "Conforming to the law or to rules", example: "She had a legitimate reason for being late.", partOfSpeech: "adjective" as const },
      { word: "meticulous", definition: "Showing great attention to detail; very careful", example: "The scientist was meticulous in recording data.", partOfSpeech: "adjective" as const },
      { word: "obsolete", definition: "No longer produced or used; out of date", example: "Typewriters became obsolete with computer technology.", partOfSpeech: "adjective" as const },
      { word: "ominous", definition: "Giving the impression that something bad will happen", example: "The dark clouds looked ominous.", partOfSpeech: "adjective" as const },
      { word: "optimistic", definition: "Hopeful and confident about the future", example: "She remained optimistic despite the challenges.", partOfSpeech: "adjective" as const },
      { word: "perceptive", definition: "Having or showing sensitive insight", example: "The perceptive student noticed the teacher's mood.", partOfSpeech: "adjective" as const },
      { word: "persistent", definition: "Continuing firmly despite difficulty or opposition", example: "His persistent efforts finally paid off.", partOfSpeech: "adjective" as const },
      { word: "plausible", definition: "Seeming reasonable or probable", example: "Her explanation was plausible and convincing.", partOfSpeech: "adjective" as const },
      { word: "predominant", definition: "Present as the strongest or main element", example: "Blue was the predominant color in the painting.", partOfSpeech: "adjective" as const },
      { word: "prominent", definition: "Important; famous", example: "The prominent scientist gave a lecture.", partOfSpeech: "adjective" as const },
      { word: "profound", definition: "Very great or intense; having deep insight", example: "The book had a profound effect on her thinking.", partOfSpeech: "adjective" as const },
      { word: "relevant", definition: "Closely connected or appropriate to what is being done", example: "Please only include relevant information in your report.", partOfSpeech: "adjective" as const },
      { word: "remote", definition: "Far apart in space or time; having very little connection", example: "The village was in a remote mountain area.", partOfSpeech: "adjective" as const },
      { word: "resourceful", definition: "Having the ability to find quick and clever ways to overcome difficulties", example: "The resourceful student found a creative solution.", partOfSpeech: "adjective" as const },
      { word: "substantial", definition: "Of considerable importance, size, or worth", example: "There was substantial improvement in her grades.", partOfSpeech: "adjective" as const },
      { word: "superficial", definition: "Existing or occurring at or on the surface", example: "His knowledge of the subject was only superficial.", partOfSpeech: "adjective" as const },
      { word: "tedious", definition: "Too long, slow, or dull; tiresome", example: "The tedious task took all afternoon to complete.", partOfSpeech: "adjective" as const },
      { word: "transparent", definition: "Easy to perceive or detect; obvious", example: "His motives were completely transparent.", partOfSpeech: "adjective" as const },
      { word: "trivial", definition: "Of little worth or importance", example: "Don't worry about such trivial matters.", partOfSpeech: "adjective" as const },
      { word: "universal", definition: "Applicable to all cases", example: "The need for love is universal among humans.", partOfSpeech: "adjective" as const },
      { word: "versatile", definition: "Able to adapt or be adapted to many different functions", example: "She is a versatile actor who can play many roles.", partOfSpeech: "adjective" as const },
      { word: "vulnerable", definition: "Susceptible to physical or emotional attack or harm", example: "Young children are vulnerable to peer pressure.", partOfSpeech: "adjective" as const }
    ],
    verbs: [
      { word: "abolish", definition: "To do away with completely; to eliminate", example: "The new law will abolish unfair practices.", partOfSpeech: "verb" as const },
      { word: "accelerate", definition: "To increase in speed or rate", example: "The car began to accelerate down the highway.", partOfSpeech: "verb" as const },
      { word: "annex", definition: "To add or attach, especially to a larger or more significant thing", example: "The school will annex a new wing next year.", partOfSpeech: "verb" as const },
      { word: "appease", definition: "To make peace with; to calm or satisfy", example: "She tried to appease her angry friend with an apology.", partOfSpeech: "verb" as const },
      { word: "assimilate", definition: "To take in and understand fully", example: "New students need time to assimilate into the school culture.", partOfSpeech: "verb" as const },
      { word: "coerce", definition: "To persuade someone forcefully to do something", example: "You cannot coerce students into participating.", partOfSpeech: "verb" as const },
      { word: "coincide", definition: "To occur at the same time", example: "The meeting will coincide with the lunch hour.", partOfSpeech: "verb" as const },
      { word: "conceal", definition: "To keep from sight; hide", example: "She tried to conceal her disappointment.", partOfSpeech: "verb" as const },
      { word: "confide", definition: "To tell someone about a secret or private matter", example: "She decided to confide in her best friend.", partOfSpeech: "verb" as const },
      { word: "contemplate", definition: "To think about thoroughly; consider", example: "He likes to contemplate the meaning of life.", partOfSpeech: "verb" as const },
      { word: "culminate", definition: "To reach a climax or point of highest development", example: "Years of practice culminate in tonight's performance.", partOfSpeech: "verb" as const },
      { word: "denounce", definition: "To publicly declare to be wrong or evil", example: "The mayor will denounce the violent protests.", partOfSpeech: "verb" as const },
      { word: "depict", definition: "To represent by drawing, painting, or describing", example: "The painting depicts a peaceful countryside scene.", partOfSpeech: "verb" as const },
      { word: "distort", definition: "To pull or twist out of shape", example: "The funhouse mirrors distort your reflection.", partOfSpeech: "verb" as const },
      { word: "divulge", definition: "To make known; reveal", example: "The spy refused to divulge classified information.", partOfSpeech: "verb" as const },
      { word: "embellish", definition: "To make something more attractive by adding decorative details", example: "She likes to embellish her stories with dramatic details.", partOfSpeech: "verb" as const },
      { word: "endorse", definition: "To declare one's public approval or support of", example: "The newspaper will endorse the best candidate.", partOfSpeech: "verb" as const },
      { word: "enforce", definition: "To compel observance of or compliance with", example: "Police officers enforce traffic laws.", partOfSpeech: "verb" as const },
      { word: "eradicate", definition: "To destroy completely; put an end to", example: "Scientists work to eradicate dangerous diseases.", partOfSpeech: "verb" as const },
      { word: "evade", definition: "To escape or avoid, especially by cleverness", example: "The criminal tried to evade capture.", partOfSpeech: "verb" as const },
      { word: "exemplify", definition: "To be a typical example of", example: "His behavior exemplifies good sportsmanship.", partOfSpeech: "verb" as const },
      { word: "fluctuate", definition: "To rise and fall irregularly in number or amount", example: "Stock prices fluctuate throughout the day.", partOfSpeech: "verb" as const },
      { word: "generate", definition: "To cause something to arise or come about", example: "Wind turbines generate clean electricity.", partOfSpeech: "verb" as const },
      { word: "hinder", definition: "To create difficulties resulting in delay or obstruction", example: "Bad weather will hinder our travel plans.", partOfSpeech: "verb" as const },
      { word: "implement", definition: "To put a decision or plan into effect", example: "The school will implement new safety measures.", partOfSpeech: "verb" as const },
      { word: "improvise", definition: "To create and perform spontaneously without preparation", example: "The actor had to improvise when he forgot his lines.", partOfSpeech: "verb" as const },
      { word: "incorporate", definition: "To take in or include as part of a whole", example: "The new design will incorporate user feedback.", partOfSpeech: "verb" as const },
      { word: "inhibit", definition: "To hinder, restrain, or prevent an action", example: "Shyness can inhibit social interaction.", partOfSpeech: "verb" as const },
      { word: "instill", definition: "To gradually but firmly establish an idea in someone's mind", example: "Good teachers instill confidence in their students.", partOfSpeech: "verb" as const },
      { word: "integrate", definition: "To combine one thing with another to form a whole", example: "The school will integrate technology into all classes.", partOfSpeech: "verb" as const },
      { word: "interpret", definition: "To explain the meaning of information or actions", example: "The translator will interpret the speech.", partOfSpeech: "verb" as const },
      { word: "intervene", definition: "To come between so as to prevent or alter a result", example: "The teacher had to intervene in the argument.", partOfSpeech: "verb" as const },
      { word: "invoke", definition: "To call on something or someone for aid or support", example: "The lawyer will invoke the Fifth Amendment.", partOfSpeech: "verb" as const },
      { word: "justify", definition: "To show or prove to be right or reasonable", example: "Can you justify your absence from class?", partOfSpeech: "verb" as const },
      { word: "manipulate", definition: "To handle or control typically in a skillful manner", example: "Scientists manipulate variables in experiments.", partOfSpeech: "verb" as const },
      { word: "moderate", definition: "To make or become less extreme, intense, or violent", example: "The teacher will moderate the class discussion.", partOfSpeech: "verb" as const },
      { word: "navigate", definition: "To plan and direct the route or course of a ship, aircraft, or other form of transport", example: "Ships navigate using GPS systems.", partOfSpeech: "verb" as const },
      { word: "neutralize", definition: "To render something ineffective by applying an opposite force", example: "The medicine will neutralize the acid.", partOfSpeech: "verb" as const },
      { word: "optimize", definition: "To make the best or most effective use of a situation", example: "We need to optimize our study time.", partOfSpeech: "verb" as const },
      { word: "persevere", definition: "To continue in a course of action despite difficulty", example: "She will persevere until she reaches her goal.", partOfSpeech: "verb" as const },
      { word: "prioritize", definition: "To designate or treat something as more important than other things", example: "Students must prioritize their assignments.", partOfSpeech: "verb" as const },
      { word: "prohibit", definition: "To formally forbid something by law, rule, or other authority", example: "The school will prohibit cell phone use in class.", partOfSpeech: "verb" as const },
      { word: "reconcile", definition: "To restore friendly relations between", example: "They were able to reconcile after their argument.", partOfSpeech: "verb" as const },
      { word: "refute", definition: "To prove a statement or theory to be wrong or false", example: "The scientist will refute the incorrect hypothesis.", partOfSpeech: "verb" as const },
      { word: "relinquish", definition: "To voluntarily cease to keep or claim; give up", example: "He had to relinquish his position as captain.", partOfSpeech: "verb" as const },
      { word: "replenish", definition: "To fill something up again", example: "We need to replenish our water supply.", partOfSpeech: "verb" as const },
      { word: "revoke", definition: "To put an end to the validity of something", example: "The state may revoke his driver's license.", partOfSpeech: "verb" as const },
      { word: "stimulate", definition: "To raise levels of physiological or nervous activity", example: "Exercise can stimulate brain function.", partOfSpeech: "verb" as const },
      { word: "suppress", definition: "To forcibly put an end to", example: "The medication will suppress the symptoms.", partOfSpeech: "verb" as const },
      { word: "terminate", definition: "To bring to an end", example: "The contract will terminate at the end of the year.", partOfSpeech: "verb" as const },
      { word: "validate", definition: "To check or prove the validity or accuracy of something", example: "The test results will validate the theory.", partOfSpeech: "verb" as const }
    ],
    adverbs: [
      { word: "accordingly", definition: "In a way that is appropriate to the particular circumstances", example: "The weather was bad, and accordingly, the game was canceled.", partOfSpeech: "adverb" as const },
      { word: "alternatively", definition: "As another option", example: "You can take the bus or alternatively walk to school.", partOfSpeech: "adverb" as const },
      { word: "consequently", definition: "As a result", example: "It rained heavily; consequently, the picnic was canceled.", partOfSpeech: "adverb" as const },
      { word: "deliberately", definition: "On purpose; intentionally", example: "She deliberately chose the difficult path.", partOfSpeech: "adverb" as const },
      { word: "exclusively", definition: "Solely; only", example: "This club is exclusively for members.", partOfSpeech: "adverb" as const },
      { word: "fundamentally", definition: "In a basic and important way", example: "The two approaches are fundamentally different.", partOfSpeech: "adverb" as const },
      { word: "gradually", definition: "Slowly over a period of time", example: "She gradually improved her piano skills.", partOfSpeech: "adverb" as const },
      { word: "hypothetically", definition: "In a way that is based on a suggested idea rather than known facts", example: "Hypothetically, what would happen if we moved?", partOfSpeech: "adverb" as const },
      { word: "inadvertently", definition: "Without intention; accidentally", example: "He inadvertently deleted the important file.", partOfSpeech: "adverb" as const },
      { word: "inevitably", definition: "In a way that cannot be avoided", example: "The old building will inevitably need repairs.", partOfSpeech: "adverb" as const },
      { word: "initially", definition: "At first", example: "Initially, she was nervous about the presentation.", partOfSpeech: "adverb" as const },
      { word: "meticulously", definition: "In a way that shows great attention to detail", example: "She meticulously planned every detail of the event.", partOfSpeech: "adverb" as const },
      { word: "predominantly", definition: "Mainly; for the most part", example: "The audience was predominantly young adults.", partOfSpeech: "adverb" as const },
      { word: "presumably", definition: "Used to convey that what is asserted is very likely though not known for certain", example: "Presumably, the meeting will start on time.", partOfSpeech: "adverb" as const },
      { word: "previously", definition: "At an earlier time; before", example: "She had previously worked as a teacher.", partOfSpeech: "adverb" as const },
      { word: "specifically", definition: "In a clearly defined or explicit manner", example: "The rule applies specifically to students.", partOfSpeech: "adverb" as const },
      { word: "subsequently", definition: "After a particular thing has happened; afterwards", example: "He graduated and subsequently found a job.", partOfSpeech: "adverb" as const },
      { word: "substantially", definition: "To a great or significant extent", example: "The new method is substantially better.", partOfSpeech: "adverb" as const },
      { word: "traditionally", definition: "In a way that follows tradition", example: "Traditionally, families gather for holidays.", partOfSpeech: "adverb" as const },
      { word: "ultimately", definition: "Finally; in the end", example: "Ultimately, the decision is yours to make.", partOfSpeech: "adverb" as const }
    ]
  };

  const { toast } = useToast();

  const totalCards = nounCount + adjectiveCount + verbCount + adverbCount;

  const setRecommendedProportions = () => {
    setNounCount(3);
    setAdjectiveCount(3);
    setVerbCount(2);
    setAdverbCount(2);
  };

  const generateFlashcards = async () => {
    if (totalCards === 0) {
      toast({
        title: "No cards selected",
        description: "Please select at least one word from any part of speech.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const selectedCards: Flashcard[] = [];

      // Helper function to get random words from a category
      const getRandomWords = (words: any[], count: number) => {
        const availableWords = avoidDuplicates 
          ? words.filter(w => !existingWords.includes(w.word))
          : words;
        
        const shuffled = [...availableWords].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
      };

      // Add words from each part of speech
      if (nounCount > 0) {
        const nouns = getRandomWords(iseeWordSets.nouns, nounCount);
        selectedCards.push(...nouns.map(word => ({
          ...word,
          id: Math.random().toString(36).substr(2, 9),
          difficulty: 'ISEE' as const
        })));
      }

      if (adjectiveCount > 0) {
        const adjectives = getRandomWords(iseeWordSets.adjectives, adjectiveCount);
        selectedCards.push(...adjectives.map(word => ({
          ...word,
          id: Math.random().toString(36).substr(2, 9),
          difficulty: 'ISEE' as const
        })));
      }

      if (verbCount > 0) {
        const verbs = getRandomWords(iseeWordSets.verbs, verbCount);
        selectedCards.push(...verbs.map(word => ({
          ...word,
          id: Math.random().toString(36).substr(2, 9),
          difficulty: 'ISEE' as const
        })));
      }

      if (adverbCount > 0) {
        const adverbs = getRandomWords(iseeWordSets.adverbs, adverbCount);
        selectedCards.push(...adverbs.map(word => ({
          ...word,
          id: Math.random().toString(36).substr(2, 9),
          difficulty: 'ISEE' as const
        })));
      }

      if (selectedCards.length === 0) {
        toast({
          title: "No suitable words found",
          description: "Try adjusting your selection or allowing duplicate words.",
          variant: "destructive",
        });
        return;
      }

      // Shuffle the final selection
      const shuffled = selectedCards.sort(() => 0.5 - Math.random());

      onFlashcardsGenerated(shuffled);
      
      toast({
        title: "Flashcards generated!",
        description: `Created ${shuffled.length} flashcards for you.`,
      });

    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={onBack}
          variant="outline" 
          className="mb-6 bg-white/80 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Generate ISEE Flashcards
          </h1>
          <p className="text-lg text-gray-600">
            Select the proportion of different parts of speech for your flashcard set
          </p>
        </div>

        <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Customize Your Word Set</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Nouns ({nounCount} words)
                </label>
                <Slider
                  value={[nounCount]}
                  onValueChange={(value) => setNounCount(value[0])}
                  max={10}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Adjectives ({adjectiveCount} words)
                </label>
                <Slider
                  value={[adjectiveCount]}
                  onValueChange={(value) => setAdjectiveCount(value[0])}
                  max={10}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Verbs ({verbCount} words)
                </label>
                <Slider
                  value={[verbCount]}
                  onValueChange={(value) => setVerbCount(value[0])}
                  max={10}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Adverbs ({adverbCount} words)
                </label>
                <Slider
                  value={[adverbCount]}
                  onValueChange={(value) => setAdverbCount(value[0])}
                  max={10}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            <div className="text-center">
              <Button 
                onClick={setRecommendedProportions}
                variant="outline"
                className="mb-4"
              >
                Use Recommended (3 adj, 3 nouns, 2 adv, 2 verbs)
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="avoid-duplicates"
                checked={avoidDuplicates}
                onChange={(e) => setAvoidDuplicates(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="avoid-duplicates" className="text-sm text-gray-700">
                Avoid words from previously saved sets
              </label>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Preview:</h3>
              <p className="text-gray-600">
                Total: {totalCards} flashcards
              </p>
              <div className="text-sm text-gray-500 mt-2">
                {nounCount} nouns, {adjectiveCount} adjectives, {verbCount} verbs, {adverbCount} adverbs
              </div>
            </div>

            <Button 
              onClick={generateFlashcards}
              disabled={isGenerating || totalCards === 0}
              className="w-full text-lg py-6 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-semibold"
            >
              {isGenerating ? (
                <div className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  Generating Cards...
                </div>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate {totalCards} Flashcards
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutoGenerator;