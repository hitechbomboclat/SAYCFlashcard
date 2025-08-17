
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Sparkles, Printer } from "lucide-react";
import ManualCreator from "@/components/ManualCreator";
import AutoGenerator from "@/components/AutoGenerator";
import FlashcardPreview from "@/components/FlashcardPreview";

export interface Flashcard {
  id: string;
  word: string;
  definition: string;
  example: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'very hard' | 'ISEE';
  partOfSpeech: 'noun' | 'adjective' | 'verb' | 'adverb';
}

const Index = () => {
  const [mode, setMode] = useState<'select' | 'manual' | 'auto' | 'preview'>('select');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const handleFlashcardsCreated = (newFlashcards: Flashcard[]) => {
    setFlashcards(newFlashcards);
    setMode('preview');
  };

  const addFlashcard = (flashcard: Flashcard) => {
    setFlashcards(prev => [...prev, flashcard]);
  };

  if (mode === 'preview') {
    return (
      <FlashcardPreview 
        flashcards={flashcards} 
        onBack={() => setMode('select')}
        onEdit={() => setMode('manual')}
        onFlashcardsUpdate={setFlashcards}
        isGenerated={true}
      />
    );
  }

  if (mode === 'manual') {
    return (
      <ManualCreator 
        onBack={() => setMode('select')}
        onFlashcardsCreated={handleFlashcardsCreated}
        existingFlashcards={flashcards}
        onAddFlashcard={addFlashcard}
      />
    );
  }

  if (mode === 'auto') {
    // Get all existing words from saved sets
    const savedSets = JSON.parse(localStorage.getItem('flashcard-sets') || '[]');
    const existingWords = savedSets.flatMap((set: any) => 
      set.cards.map((card: any) => card.word)
    );
    
    return (
      <AutoGenerator 
        onBack={() => setMode('select')}
        onFlashcardsGenerated={handleFlashcardsCreated}
        existingWords={existingWords}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Jordan's Flashcard Factory
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The greatest tutor in SAYC history has created a website for easy flashcard making and soon to be online flashcard access.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <PlusCircle className="w-24 h-24 mx-auto text-blue-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Your Own</h2>
                <p className="text-gray-600">
                  Add your own words, definitions, and example sentences. Perfect for specific vocabulary lists!
                </p>
              </div>
              <Button 
                onClick={() => setMode('manual')}
                className="w-full text-lg py-6 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold"
              >
                Start Creating
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <Sparkles className="w-24 h-24 mx-auto text-purple-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Auto Generate</h2>
                <p className="text-gray-600">
                  Let Jordan make flashcards from the ISEE word bank. No AI involved!
                </p>
              </div>
              <Button 
                onClick={() => setMode('auto')}
                className="w-full text-lg py-6 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-semibold"
              >
                Generate Cards
              </Button>
            </CardContent>
          </Card>
        </div>

        {flashcards.length > 0 && (
          <div className="text-center mt-12">
            <Card className="inline-block bg-white/80 backdrop-blur-sm border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Printer className="w-6 h-6 text-green-500" />
                  <span className="text-lg font-semibold text-gray-800">
                    You have {flashcards.length} flashcard{flashcards.length !== 1 ? 's' : ''} ready!
                  </span>
                </div>
                <Button 
                  onClick={() => setMode('preview')}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold"
                >
                  View & Print Cards
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
