import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Sparkles, Users, FileText, Clock } from "lucide-react";

interface Story {
  id: string;
  title: string;
  theme: string;
  lines: number;
  characters: number;
  lastModified: string;
}

const sampleStories: Story[] = [
  {
    id: "1",
    title: "The Pirate Who Wanted Toast",
    theme: "ocean",
    lines: 119,
    characters: 5,
    lastModified: "2 days ago",
  },
  {
    id: "2",
    title: "The Panda's Moonlight Adventure",
    theme: "forest",
    lines: 119,
    characters: 5,
    lastModified: "3 days ago",
  },
  {
    id: "3",
    title: "The Fantasmagorical First Flight",
    theme: "magic",
    lines: 119,
    characters: 2,
    lastModified: "1 week ago",
  },
];

const themeIcons: Record<string, string> = {
  space: "https://files.manuscdn.com/user_upload_by_module/session_file/109885302/prfmyRPZLhJQQGBR.png",
  fantasy: "https://files.manuscdn.com/user_upload_by_module/session_file/109885302/fHWCeGCjMwHLMCWH.png",
  ocean: "https://files.manuscdn.com/user_upload_by_module/session_file/109885302/WoReMuQsvXkPdYrZ.png",
  forest: "https://files.manuscdn.com/user_upload_by_module/session_file/109885302/gozHzfIABJHzZzlq.png",
  magic: "https://files.manuscdn.com/user_upload_by_module/session_file/109885302/wfHSZnTvIkanPoIx.png",
};

function StoryCard({ story }: { story: Story }) {
  return (
    <div className="bg-card rounded-2xl p-5 mb-4 shadow-lg relative overflow-hidden animate-fadeIn hover:scale-[1.02] transition-transform duration-200">
      {/* Theme icon */}
      <div className="absolute top-4 right-4 w-12 h-12 opacity-80">
        <img 
          src={themeIcons[story.theme] || themeIcons.magic} 
          alt={story.theme}
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Title */}
      <h3 className="text-xl font-semibold text-card-foreground mb-3 pr-16">
        {story.title}
      </h3>
      
      {/* Metadata */}
      <div className="flex flex-wrap gap-3 text-sm text-card-foreground/70 mb-4">
        <span className="flex items-center gap-1">
          <FileText className="w-4 h-4" /> {story.lines} lines
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4" /> {story.characters} characters
        </span>
      </div>
      
      {/* Last modified */}
      <p className="text-xs text-card-foreground/50 mb-4 flex items-center gap-1">
        <Clock className="w-3 h-3" /> Last modified: {story.lastModified}
      </p>
      
      {/* Actions */}
      <div className="flex gap-2">
        <Button 
          variant="secondary" 
          size="sm"
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold"
        >
          ✏️ Edit
        </Button>
        <Button 
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md"
        >
          ▶️ Play
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="text-card-foreground/70 hover:text-card-foreground hover:bg-card-foreground/10"
        >
          🗑️
        </Button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 px-6 animate-fadeIn">
      <div className="w-32 h-32 mx-auto mb-6 bg-accent/20 rounded-full flex items-center justify-center">
        <span className="text-6xl">📖</span>
      </div>
      <h3 className="text-2xl font-semibold text-foreground mb-2">
        No Stories Yet!
      </h3>
      <p className="text-muted-foreground mb-6 text-lg">
        Let's create your first magical bedtime adventure!
      </p>
      <Link href="/create">
        <Button 
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Create Your First Story
        </Button>
      </Link>
    </div>
  );
}

export default function Library() {
  const stories = sampleStories;
  
  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-accent/10 to-transparent py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            ✨ DreamStation
          </h1>
          <p className="text-lg text-muted-foreground">
            Your magical bedtime story library
          </p>
        </div>
      </div>
      
      {/* Stories */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-foreground">
            📚 Your Stories
          </h2>
          <Link href="/create">
            <Button 
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              New Story
            </Button>
          </Link>
        </div>
        
        {stories.length > 0 ? (
          stories.map(story => <StoryCard key={story.id} story={story} />)
        ) : (
          <EmptyState />
        )}
      </div>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg flex justify-around py-3 px-4 z-50">
        <Link href="/">
          <button className="flex flex-col items-center gap-1 text-primary">
            <span className="text-2xl">📚</span>
            <span className="text-xs font-semibold">Library</span>
          </button>
        </Link>
        <Link href="/create">
          <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
            <span className="text-2xl">✨</span>
            <span className="text-xs font-semibold">Create</span>
          </button>
        </Link>
        <Link href="/account">
          <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
            <span className="text-2xl">👤</span>
            <span className="text-xs font-semibold">Account</span>
          </button>
        </Link>
      </nav>
    </div>
  );
}
