import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Printer, Edit, RotateCcw, RefreshCw, Save, FolderOpen, Trash2, Key, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Flashcard } from "@/pages/Index";
import { exportFlashcardsToPDF } from "@/utils/pdfExport";

interface FlashcardPreviewProps {
  flashcards: Flashcard[];
  onBack: () => void;
  onEdit: () => void;
  onFlashcardsUpdate?: (flashcards: Flashcard[]) => void;
  isGenerated?: boolean;
}

const FlashcardPreview = ({ flashcards, onBack, onEdit, onFlashcardsUpdate, isGenerated = false }: FlashcardPreviewProps) => {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [currentFlashcards, setCurrentFlashcards] = useState<Flashcard[]>(flashcards);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [editForm, setEditForm] = useState({ word: '', definition: '', example: '', difficulty: 'medium' as Flashcard['difficulty'] });
  const [savedSets, setSavedSets] = useState<{ name: string; cards: Flashcard[] }[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [setName, setSetName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setCurrentFlashcards(flashcards);
  }, [flashcards]);

  useEffect(() => {
    const saved = localStorage.getItem('flashcard-sets');
    if (saved) {
      setSavedSets(JSON.parse(saved));
    }
  }, []);

  const toggleCard = (id: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const flipAllCards = () => {
    if (flippedCards.size === currentFlashcards.length) {
      setFlippedCards(new Set());
    } else {
      setFlippedCards(new Set(currentFlashcards.map(card => card.id)));
    }
  };

  const regenerateCard = async (cardId: string) => {
    const cardToRegenerate = currentFlashcards.find(card => card.id === cardId);
    if (!cardToRegenerate) return;

    // Word bank from AutoGenerator
    const iseeWordSets = {
      nouns: [
        { word: "abstinence", definition: "the practice of restraining oneself from indulging in something", example: "His abstinence from sweets helped him lose weight.", partOfSpeech: "noun" },
        { word: "adulation", definition: "excessive admiration or praise", example: "The celebrity was uncomfortable with the adulation from fans.", partOfSpeech: "noun" },
        { word: "adversity", definition: "difficulties or misfortune", example: "She showed great strength during times of adversity.", partOfSpeech: "noun" },
        { word: "aesthetic", definition: "a set of principles underlying the work of a particular artist or artistic movement", example: "The minimalist aesthetic of the room was very calming.", partOfSpeech: "noun" },
        { word: "affinity", definition: "a natural liking for or attraction to something", example: "She had a natural affinity for mathematics.", partOfSpeech: "noun" },
        { word: "alacrity", definition: "brisk and cheerful readiness", example: "He accepted the invitation with alacrity.", partOfSpeech: "noun" },
        { word: "anecdote", definition: "a short amusing or interesting story about a real incident or person", example: "She told an amusing anecdote about her childhood.", partOfSpeech: "noun" },
        { word: "anomaly", definition: "something that deviates from what is standard or expected", example: "The warm weather in December was an anomaly.", partOfSpeech: "noun" },
        { word: "antipathy", definition: "a strong feeling of dislike", example: "There was clear antipathy between the two rivals.", partOfSpeech: "noun" },
        { word: "apathy", definition: "lack of interest, enthusiasm, or concern", example: "Voter apathy was evident in the low turnout.", partOfSpeech: "noun" },
        { word: "apprehension", definition: "anxiety or fear that something bad will happen", example: "She felt apprehension before the job interview.", partOfSpeech: "noun" },
        { word: "artisan", definition: "a worker in a skilled trade, especially one that involves making things by hand", example: "The artisan crafted beautiful pottery.", partOfSpeech: "noun" },
        { word: "ascetic", definition: "a person who practices severe self-discipline", example: "The monk lived as an ascetic, owning very few possessions.", partOfSpeech: "noun" },
        { word: "asylum", definition: "protection or safety, especially for those fleeing persecution", example: "The refugees sought asylum in a neighboring country.", partOfSpeech: "noun" },
        { word: "audacity", definition: "a willingness to take bold risks", example: "She had the audacity to challenge the CEO's decision.", partOfSpeech: "noun" }
      ],
      adjectives: [
        { word: "abstruse", definition: "difficult to understand; obscure", example: "The professor's lecture on quantum physics was too abstruse for most students.", partOfSpeech: "adjective" },
        { word: "acute", definition: "having a sharp point; extremely serious or severe", example: "The patient suffered from acute pain in his chest.", partOfSpeech: "adjective" },
        { word: "adamant", definition: "refusing to be persuaded or to change one's mind", example: "She was adamant about not moving to another city.", partOfSpeech: "adjective" },
        { word: "adept", definition: "very skilled or proficient at something", example: "He was adept at solving complex mathematical problems.", partOfSpeech: "adjective" },
        { word: "affable", definition: "friendly, good-natured, or easy to talk to", example: "The new teacher was very affable and approachable.", partOfSpeech: "adjective" },
        { word: "affluent", definition: "having a great deal of money; wealthy", example: "They lived in an affluent neighborhood with large houses.", partOfSpeech: "adjective" },
        { word: "aloof", definition: "not friendly or forthcoming; cool and distant", example: "He remained aloof from his colleagues at work.", partOfSpeech: "adjective" },
        { word: "ambiguous", definition: "open to more than one interpretation; unclear", example: "The politician's statement was deliberately ambiguous.", partOfSpeech: "adjective" },
        { word: "amiable", definition: "having or displaying a friendly and pleasant manner", example: "She had an amiable personality that attracted many friends.", partOfSpeech: "adjective" },
        { word: "ample", definition: "large or spacious; more than enough", example: "There was ample time to complete the project.", partOfSpeech: "adjective" },
        { word: "anachronistic", definition: "belonging to a period other than that being portrayed", example: "The knight's wristwatch was anachronistic in the medieval movie.", partOfSpeech: "adjective" },
        { word: "apathetic", definition: "showing or feeling no interest, enthusiasm, or concern", example: "The students seemed apathetic about the upcoming election.", partOfSpeech: "adjective" },
        { word: "archaic", definition: "very old or old-fashioned", example: "The use of 'thou' is archaic in modern English.", partOfSpeech: "adjective" },
        { word: "arduous", definition: "involving or requiring strenuous effort; difficult and tiring", example: "Climbing Mount Everest is an arduous task.", partOfSpeech: "adjective" },
        { word: "articulate", definition: "having or showing the ability to speak fluently and coherently", example: "She was very articulate during the debate.", partOfSpeech: "adjective" }
      ],
      verbs: [
        { word: "abate", definition: "to become less intense or widespread", example: "The storm began to abate by evening.", partOfSpeech: "verb" },
        { word: "abdicate", definition: "to give up power or responsibility", example: "The king chose to abdicate his throne.", partOfSpeech: "verb" },
        { word: "abhor", definition: "to regard with disgust and hatred", example: "She abhors violence in any form.", partOfSpeech: "verb" },
        { word: "abstain", definition: "to restrain oneself from enjoying something", example: "He chose to abstain from alcohol during the party.", partOfSpeech: "verb" },
        { word: "accede", definition: "to agree to a demand, request, or treaty", example: "The government finally acceded to the protesters' demands.", partOfSpeech: "verb" },
        { word: "accentuate", definition: "to make more noticeable or prominent", example: "The lighting accentuated the painting's colors.", partOfSpeech: "verb" },
        { word: "accommodate", definition: "to provide lodging or sufficient space for", example: "The hotel can accommodate up to 500 guests.", partOfSpeech: "verb" },
        { word: "acquiesce", definition: "to accept something reluctantly but without protest", example: "She acquiesced to her parents' wishes about college.", partOfSpeech: "verb" },
        { word: "admonish", definition: "to warn or reprimand someone firmly", example: "The teacher admonished the student for being late.", partOfSpeech: "verb" },
        { word: "advocate", definition: "to publicly recommend or support", example: "She advocates for environmental protection.", partOfSpeech: "verb" },
        { word: "alleviate", definition: "to make suffering, deficiency, or a problem less severe", example: "The medicine helped alleviate his pain.", partOfSpeech: "verb" },
        { word: "allude", definition: "to suggest or call attention to indirectly", example: "She alluded to her past mistakes during the speech.", partOfSpeech: "verb" },
        { word: "amalgamate", definition: "to combine or unite to form one organization or structure", example: "The two companies decided to amalgamate their resources.", partOfSpeech: "verb" },
        { word: "ambush", definition: "to attack suddenly from a hidden position", example: "The soldiers planned to ambush the enemy convoy.", partOfSpeech: "verb" },
        { word: "amplify", definition: "to make larger, greater, or stronger", example: "The microphone amplified her voice across the auditorium.", partOfSpeech: "verb" }
      ],
      adverbs: [
        { word: "abruptly", definition: "suddenly and unexpectedly", example: "The meeting ended abruptly when the fire alarm rang.", partOfSpeech: "adverb" },
        { word: "adroitly", definition: "in a clever or skillful way", example: "She adroitly avoided answering the difficult question.", partOfSpeech: "adverb" },
        { word: "affectionately", definition: "with fondness or love", example: "The grandmother hugged her grandchild affectionately.", partOfSpeech: "adverb" },
        { word: "amiably", definition: "in a friendly and pleasant manner", example: "He greeted everyone amiably at the party.", partOfSpeech: "adverb" },
        { word: "ardently", definition: "with great passion or enthusiasm", example: "She ardently supported the environmental cause.", partOfSpeech: "adverb" },
        { word: "articulately", definition: "in a clear and well-expressed manner", example: "He spoke articulately about the complex issue.", partOfSpeech: "adverb" },
        { word: "astutely", definition: "in a shrewd and perceptive manner", example: "She astutely observed the changes in the market.", partOfSpeech: "adverb" },
        { word: "audaciously", definition: "in a bold and daring manner", example: "He audaciously challenged the authority's decision.", partOfSpeech: "adverb" },
        { word: "austerely", definition: "in a severe or strict manner", example: "The room was decorated austerely with minimal furniture.", partOfSpeech: "adverb" },
        { word: "benevolently", definition: "in a kind and generous manner", example: "The philanthropist donated benevolently to many charities.", partOfSpeech: "adverb" },
        { word: "candidly", definition: "in an honest and straightforward manner", example: "She spoke candidly about her struggles.", partOfSpeech: "adverb" },
        { word: "cautiously", definition: "in a careful and prudent manner", example: "He cautiously approached the sleeping dog.", partOfSpeech: "adverb" },
        { word: "coherently", definition: "in a logical and consistent manner", example: "Despite his injury, he spoke coherently to the paramedics.", partOfSpeech: "adverb" },
        { word: "conscientiously", definition: "in a thorough and responsible manner", example: "She conscientiously completed all her assignments.", partOfSpeech: "adverb" },
        { word: "cordially", definition: "in a warm and friendly manner", example: "The host cordially welcomed all the guests.", partOfSpeech: "adverb" }
      ]
    };

    try {
      // Get all words that match the part of speech and aren't already in the current set
      const existingWords = currentFlashcards.map(c => c.word.toLowerCase());
      const partOfSpeechKey = cardToRegenerate.partOfSpeech + 's' as keyof typeof iseeWordSets; // Convert to plural form
      const matchingWords = iseeWordSets[partOfSpeechKey] || [];
      const availableWords = matchingWords.filter(w => !existingWords.includes(w.word.toLowerCase()));
      
      if (availableWords.length === 0) {
        toast({
          title: "No available words",
          description: `No more ${cardToRegenerate.partOfSpeech} words available in the word bank.`,
          variant: "destructive"
        });
        return;
      }

      // Select a random word from available words
      const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
      
      const updatedCard: Flashcard = {
        ...cardToRegenerate,
        word: randomWord.word,
        definition: randomWord.definition,
        example: randomWord.example,
        partOfSpeech: randomWord.partOfSpeech as Flashcard['partOfSpeech'],
        difficulty: 'ISEE'
      };

      const updatedCards = currentFlashcards.map(card => 
        card.id === cardId ? updatedCard : card
      );
      
      setCurrentFlashcards(updatedCards);
      onFlashcardsUpdate?.(updatedCards);
      
      toast({
        title: "Card regenerated!",
        description: `Generated new ${cardToRegenerate.partOfSpeech}: ${randomWord.word}`,
      });
    } catch (error) {
      console.error('Regeneration error:', error);
      toast({
        title: "Error",
        description: "Failed to regenerate card. Please try again.",
        variant: "destructive"
      });
    }
  };


  const startEdit = (card: Flashcard) => {
    setEditingCard(card);
    setEditForm({
      word: card.word,
      definition: card.definition,
      example: card.example,
      difficulty: card.difficulty
    });
  };

  const saveEdit = () => {
    if (!editingCard) return;
    
    const updatedCards = currentFlashcards.map(card =>
      card.id === editingCard.id
        ? { ...card, ...editForm }
        : card
    );
    
    setCurrentFlashcards(updatedCards);
    onFlashcardsUpdate?.(updatedCards);
    setEditingCard(null);
    
    toast({
      title: "Card updated!",
      description: "Your changes have been saved.",
    });
  };

  const saveSet = () => {
    if (!setName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your set.",
        variant: "destructive"
      });
      return;
    }

    const newSet = { name: setName, cards: currentFlashcards };
    const updatedSets = [...savedSets, newSet];
    setSavedSets(updatedSets);
    localStorage.setItem('flashcard-sets', JSON.stringify(updatedSets));
    
    toast({
      title: "Set saved!",
      description: `"${setName}" has been saved to your collection.`,
    });
    
    setSetName('');
    setSaveDialogOpen(false);
  };

  const loadSet = (set: { name: string; cards: Flashcard[] }) => {
    setCurrentFlashcards(set.cards);
    onFlashcardsUpdate?.(set.cards);
    setLoadDialogOpen(false);
    
    toast({
      title: "Set loaded!",
      description: `Loaded "${set.name}" with ${set.cards.length} cards.`,
    });
  };

  const deleteSet = (setToDelete: { name: string; cards: Flashcard[] }) => {
    const updatedSets = savedSets.filter(set => set.name !== setToDelete.name);
    setSavedSets(updatedSets);
    localStorage.setItem('flashcard-sets', JSON.stringify(updatedSets));
    
    toast({
      title: "Set deleted!",
      description: `"${setToDelete.name}" has been removed.`,
    });
  };


  const handlePDFExport = () => {
    if (currentFlashcards.length === 0) {
      toast({
        title: "No cards to export",
        description: "Please create some flashcards first.",
        variant: "destructive"
      });
      return;
    }

    try {
      exportFlashcardsToPDF(currentFlashcards);
      toast({
        title: "PDF exported!",
        description: "Your flashcards have been exported as a PDF ready for double-sided printing.",
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your flashcards. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      case 'very hard': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ISEE': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 print:bg-white">
        <div className="container mx-auto px-4 py-8 print:p-0">
          <div className="mb-6 print:hidden">
            <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
              <Button 
                onClick={onBack}
                variant="outline" 
                className="bg-white/80 hover:bg-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              
              <div className="flex gap-3 flex-wrap">

                <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="bg-white/80 hover:bg-white">
                      <Save className="w-4 h-4 mr-2" />
                      Save Set
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Save Flashcard Set</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Enter set name"
                        value={setName}
                        onChange={(e) => setSetName(e.target.value)}
                      />
                      <Button onClick={saveSet} className="w-full">Save</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="bg-white/80 hover:bg-white">
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Load Set
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Load Flashcard Set</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {savedSets.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No saved sets found</p>
                      ) : (
                        savedSets.map((set, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <p className="font-medium">{set.name}</p>
                              <p className="text-sm text-gray-500">{set.cards.length} cards</p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => loadSet(set)}>Load</Button>
                              <Button size="sm" variant="destructive" onClick={() => deleteSet(set)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  onClick={onEdit}
                  variant="outline"
                  className="bg-white/80 hover:bg-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit All
                </Button>
                
                <Button 
                  onClick={flipAllCards}
                  variant="outline"
                  className="bg-white/80 hover:bg-white"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Flip All
                </Button>

                <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="bg-white/80 hover:bg-white">
                      <FileDown className="w-4 h-4 mr-2" />
                      Preview Print
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Print Preview - {currentFlashcards.length} cards, {Math.ceil(currentFlashcards.length / 8)} pages</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">
                        This shows how your cards will be arranged for double-sided printing. 8 cards per page (4 per column, 2 columns) with cut lines for easy separation.
                      </p>
                      <div className="border rounded p-4 bg-gray-50">
                        {/* Render preview of cards as they will appear in PDF */}
                        {Array.from({ length: Math.ceil(currentFlashcards.length / 8) }, (_, pageIndex) => (
                          <div key={pageIndex} className="mb-8 p-4 bg-white border-2 border-gray-300 rounded">
                            <h3 className="text-sm font-bold mb-4">Page {pageIndex + 1} - Front Side</h3>
                            <div className="grid grid-cols-2 gap-1">
                              {/* Column 1 */}
                              <div className="border-r border-gray-400">
                                {currentFlashcards.slice(pageIndex * 8, pageIndex * 8 + 4).map((card, cardIndex) => (
                                  <div key={card.id} className="border-b border-gray-400 p-2 text-center h-20 flex flex-col justify-center text-xs last:border-b-0">
                                     <div className="font-bold text-sm">{card.word}</div>
                                     <div className="text-xs text-gray-500">({card.partOfSpeech})</div>
                                  </div>
                                ))}
                              </div>
                              {/* Column 2 */}
                              <div>
                                {currentFlashcards.slice(pageIndex * 8 + 4, (pageIndex + 1) * 8).map((card, cardIndex) => (
                                  <div key={card.id} className="border-b border-gray-400 p-2 text-center h-20 flex flex-col justify-center text-xs last:border-b-0">
                                     <div className="font-bold text-sm">{card.word}</div>
                                     <div className="text-xs text-gray-500">({card.partOfSpeech})</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <h3 className="text-sm font-bold mt-4 mb-4">Page {pageIndex + 1} - Back Side (mirrored for alignment)</h3>
                            <div className="grid grid-cols-2 gap-1">
                              {/* Mirrored - Column 2 definitions come first */}
                              <div className="border-r border-gray-400">
                                {currentFlashcards.slice(pageIndex * 8 + 4, (pageIndex + 1) * 8).map((card, cardIndex) => (
                                  <div key={card.id} className="border-b border-gray-400 p-2 bg-gray-50 h-20 flex flex-col justify-center text-xs last:border-b-0">
                                    <div className="text-xs">
                                      {card.definition.replace(/^\([^)]+\)\s*/, '').substring(0, 40)}...
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {/* Mirrored - Column 1 definitions come second */}
                              <div>
                                {currentFlashcards.slice(pageIndex * 8, pageIndex * 8 + 4).map((card, cardIndex) => (
                                  <div key={card.id} className="border-b border-gray-400 p-2 bg-gray-50 h-20 flex flex-col justify-center text-xs last:border-b-0">
                                    <div className="text-xs">
                                      {card.definition.replace(/^\([^)]+\)\s*/, '').substring(0, 40)}...
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button onClick={handlePDFExport} className="w-full bg-green-500 hover:bg-green-600 text-white">
                        <Printer className="w-4 h-4 mr-2" />
                        Download PDF for Printing
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button 
                  onClick={handlePDFExport}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print Cards
                </Button>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Flashcards</h1>
            <p className="text-gray-600">
              Click on any card to flip it. {isGenerated && "Use the buttons on each card to edit or regenerate individual cards."} Export as PDF for double-sided printing or print directly from your browser!
            </p>
          </div>

          {/* Screen View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:hidden">
            {currentFlashcards.map((card) => {
              const isFlipped = flippedCards.has(card.id);
              return (
                <Card 
                  key={card.id}
                  className="h-64 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0 relative group"
                >
                  <CardContent className="p-6 h-full flex flex-col justify-between relative">
                    {/* Card action buttons - show on hover for generated cards */}
                    {isGenerated && (
                      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white/90 h-8 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(card);
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white/90 h-8 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            regenerateCard(card.id);
                          }}
                        >
                          <RefreshCw className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                    
                    <div 
                      className="h-full cursor-pointer flex flex-col justify-center"
                      onClick={() => toggleCard(card.id)}
                    >
                      {!isFlipped ? (
                        // Front of card
                        <div className="text-center flex flex-col justify-center h-full">
                          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(card.difficulty)}`}>
                            {card.difficulty}
                          </div>
                          <h2 className="text-3xl font-bold text-gray-800 mb-2">{card.word}</h2>
                          <p className="text-sm text-gray-500 mb-2">({card.partOfSpeech})</p>
                          <p className="text-sm text-gray-500">Click to see definition</p>
                        </div>
                      ) : (
                        // Back of card
                        <div className="h-full flex flex-col justify-center">
                          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(card.difficulty)}`}>
                            {card.difficulty}
                          </div>
                          <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Definition:</h3>
                            <p className="text-gray-700 mb-4">{card.definition}</p>
                            {card.example && (
                              <>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Example:</h3>
                                <p className="text-gray-600 italic">"{card.example}"</p>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Print View - Optimized for double-sided cutting */}
          <div className="hidden print:block">
            <div className="print-cards">
              {currentFlashcards.map((card, index) => (
                <div key={card.id} className="page-break-inside-avoid">
                  {/* Front of card */}
                  <div className="flashcard-front bg-white p-4 text-center relative">
                    <div className={`absolute top-1 right-1 px-1 py-0.5 rounded text-xs font-medium ${getDifficultyColor(card.difficulty)}`}>
                      {card.difficulty}
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">{card.word}</h2>
                    <p className="text-sm text-gray-500">({card.partOfSpeech})</p>
                  </div>
                  
                  <div className="cut-line"></div>
                  
                  {/* Back of card - rotated text for proper double-sided alignment */}
                  <div className="flashcard-back bg-gray-50 p-4 relative" style={{ transform: 'rotate(180deg)' }}>
                    <div className="text-center" style={{ transform: 'rotate(180deg)' }}>
                      <div className="mb-2">
                        <h3 className="text-xs font-semibold text-gray-800 mb-1">Definition:</h3>
                        <p className="text-xs text-gray-700 mb-2">{card.definition}</p>
                        {card.example && (
                          <>
                            <h3 className="text-xs font-semibold text-gray-800 mb-1">Example:</h3>
                            <p className="text-xs text-gray-600 italic">"{card.example}"</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {index < currentFlashcards.length - 1 && <div className="cut-line"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Card Dialog */}
      <Dialog open={!!editingCard} onOpenChange={() => setEditingCard(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Flashcard</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Word</label>
              <Input
                value={editForm.word}
                onChange={(e) => setEditForm(prev => ({ ...prev, word: e.target.value }))}
                placeholder="Enter word"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Definition</label>
              <Textarea
                value={editForm.definition}
                onChange={(e) => setEditForm(prev => ({ ...prev, definition: e.target.value }))}
                placeholder="Enter definition"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Example</label>
              <Textarea
                value={editForm.example}
                onChange={(e) => setEditForm(prev => ({ ...prev, example: e.target.value }))}
                placeholder="Enter example sentence"
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Difficulty</label>
              <Select value={editForm.difficulty} onValueChange={(value: Flashcard['difficulty']) => setEditForm(prev => ({ ...prev, difficulty: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="very hard">Very Hard</SelectItem>
                  <SelectItem value="ISEE">ISEE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={saveEdit} className="flex-1">Save Changes</Button>
              <Button variant="outline" onClick={() => setEditingCard(null)} className="flex-1">Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0.5in;
          }
          
          .print-cards {
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
          }
          
          .page-break-inside-avoid {
            break-inside: avoid;
            margin-bottom: 1rem;
          }
          
          .flashcard-front, .flashcard-back {
            width: 3.5in;
            height: 2.5in;
            border: 2px solid #333;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            page-break-inside: avoid;
            box-sizing: border-box;
          }
          
          .cut-line {
            border: 1px dashed #999;
            margin: 0.25rem 0;
          }
        }
      `}</style>
    </>
  );
};

export default FlashcardPreview;
