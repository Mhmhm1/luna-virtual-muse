
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Trash2 } from 'lucide-react';
import { useLuna } from '@/context/LunaContext';

interface SettingsDialogProps {
  children?: React.ReactNode;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ children }) => {
  const { state, setUserName, resetConversation } = useLuna();
  const [nameInput, setNameInput] = useState(state.userName);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSave = () => {
    setUserName(nameInput);
    setIsOpen(false);
  };
  
  const handleResetConversation = () => {
    if (confirm("Are you sure you want to reset all conversations? This cannot be undone.")) {
      resetConversation();
      setIsOpen(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Luna Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Your Name
            </Label>
            <Input
              id="name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="col-span-3"
              placeholder="How should Luna call you?"
            />
          </div>
          
          <div className="border-t pt-4 mt-2">
            <div className="flex justify-between">
              <Button
                variant="destructive"
                onClick={handleResetConversation}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Reset All Conversations
              </Button>
              
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
