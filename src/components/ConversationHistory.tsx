
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { HistoryIcon, Trash2 } from 'lucide-react';
import { Symptom, Analysis } from '@/types/health';
import { useHealthBot } from '@/context/HealthBotContext';

interface ConversationRecord {
  id: string;
  created_at: string;
  messages: any[];
  selected_symptoms: Symptom[];
  analysis: Analysis | null;
}

const ConversationHistory: React.FC = () => {
  const { user } = useAuth();
  const { setState } = useHealthBot();
  const [history, setHistory] = useState<ConversationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchHistory = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversation_history')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setHistory(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching history",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && open) {
      fetchHistory();
    }
  }, [user, open]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const deleteConversation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return;
    
    try {
      const { error } = await supabase
        .from('conversation_history')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setHistory(history.filter(conv => conv.id !== id));
      toast({
        title: "Conversation deleted",
        description: "The conversation has been removed from your history.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting conversation",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const loadConversation = (conversation: ConversationRecord) => {
    setState({
      messages: conversation.messages,
      selectedSymptoms: conversation.selected_symptoms,
      lastInteractionTime: Date.now(),
      loading: false,
      selectedDisease: null,
      viewingDoctors: false,
      viewingPrescription: false,
      analysis: conversation.analysis,
    });
    
    setOpen(false);
    
    toast({
      title: "Conversation loaded",
      description: "Previous conversation has been restored.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" title="Conversation History">
          <HistoryIcon className="h-5 w-5 text-emerald-700" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Conversation History</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No conversation history found
            </div>
          ) : (
            <div className="space-y-4 pt-4">
              {history.map((conversation) => (
                <div 
                  key={conversation.id}
                  className="p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium">
                      {formatDate(conversation.created_at)}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => deleteConversation(conversation.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-1 mb-3">
                    <div className="text-xs text-muted-foreground">
                      {conversation.selected_symptoms.length} symptoms discussed
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {conversation.messages.length} messages
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-xs"
                    onClick={() => loadConversation(conversation)}
                  >
                    Resume Conversation
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConversationHistory;
