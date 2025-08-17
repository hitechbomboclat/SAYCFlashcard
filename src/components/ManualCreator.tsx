
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Flashcard } from "@/pages/Index";

interface ManualCreatorProps {
  onBack: () => void;
  onFlashcardsCreated: (flashcards: Flashcard[]) => void;
  existingFlashcards: Flashcard[];
  onAddFlashcard: (flashcard: Flashcard) => void;
}

const ManualCreator = ({ onBack, onFlashcardsCreated, existingFlashcards, onAddFlashcard }: ManualCreatorProps) => {
  const [currentCard, setCurrentCard] = useState({
    word: '',
    definition: '',
    example: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    partOfSpeech: 'noun' as 'noun' | 'adjective' | 'verb' | 'adverb'
  });
  const [localFlashcards, setLocalFlashcards] = useState<Flashcard[]>(existingFlashcards);

  const addCard = () => {
    if (!currentCard.word || !currentCard.definition) return;

    const newCard: Flashcard = {
      id: Date.now().toString(),
      ...currentCard
    };

    setLocalFlashcards(prev => [...prev, newCard]);
    onAddFlashcard(newCard);
    setCurrentCard({
      word: '',
      definition: '',
      example: '',
      difficulty: 'medium',
      partOfSpeech: 'noun'
    });
  };

  const removeCard = (id: string) => {
    setLocalFlashcards(prev => prev.filter(card => card.id !== id));
  };

  const finishCreating = () => {
    onFlashcardsCreated(localFlashcards);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            onClick={onBack}
            variant="outline" 
            className="mb-4 bg-white/80 hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Create Your Flashcards</h1>
          <p className="text-gray-600">Add words, definitions, and example sentences to build your custom deck.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Card Creator Form */}
          <Card className="bg-white/80 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">Add New Card</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Word</label>
                <Input
                  value={currentCard.word}
                  onChange={(e) => setCurrentCard(prev => ({ ...prev, word: e.target.value }))}
                  placeholder="Enter the word to learn"
                  className="text-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Definition</label>
                <Textarea
                  value={currentCard.definition}
                  onChange={(e) => setCurrentCard(prev => ({ ...prev, definition: e.target.value }))}
                  placeholder="What does this word mean?"
                  className="text-lg resize-none"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Example Sentence (Optional)</label>
                <Textarea
                  value={currentCard.example}
                  onChange={(e) => setCurrentCard(prev => ({ ...prev, example: e.target.value }))}
                  placeholder="Use the word in a sentence"
                  className="text-lg resize-none"
                  rows={2}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Part of Speech</label>
                <Select value={currentCard.partOfSpeech} onValueChange={(value: 'noun' | 'adjective' | 'verb' | 'adverb') => 
                  setCurrentCard(prev => ({ ...prev, partOfSpeech: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="noun">Noun</SelectItem>
                    <SelectItem value="adjective">Adjective</SelectItem>
                    <SelectItem value="verb">Verb</SelectItem>
                    <SelectItem value="adverb">Adverb</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              
              <Button 
                onClick={addCard}
                disabled={!currentCard.word || !currentCard.definition}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Card
              </Button>
            </CardContent>
          </Card>

          {/* Cards List */}
          <Card className="bg-white/80 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800 flex items-center justify-between">
                Your Cards ({localFlashcards.length})
                {localFlashcards.length > 0 && (
                  <Button 
                    onClick={finishCreating}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    Preview & Print
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {localFlashcards.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No cards created yet. Add your first card to get started!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {localFlashcards.map((card) => (
                    <div key={card.id} className="border rounded-lg p-4 bg-white/50">
                       <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{card.word}</h3>
                          <span className="text-sm text-gray-500">{card.partOfSpeech}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(card.difficulty)}`}>
                            {card.difficulty}
                          </span>
                          <Button
                            onClick={() => removeCard(card.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{card.definition}</p>
                      {card.example && (
                        <p className="text-sm text-gray-500 italic">"{card.example}"</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManualCreator;
