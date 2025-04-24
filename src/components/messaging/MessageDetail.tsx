
import { useState } from "react";
import { Message } from "./MessagesList";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MessageDetailProps {
  messages: Message[];
  contact: string;
  onReply: (content: string, recipient: string) => void;
  currentUser: string;
}

export const MessageDetail = ({ messages, contact, onReply, currentUser }: MessageDetailProps) => {
  const [replyContent, setReplyContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onReply(replyContent.trim(), contact);
      setReplyContent("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 bg-restaurant-primary">
            <AvatarFallback>
              {contact.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{contact}</h3>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === currentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === currentUser
                    ? 'bg-restaurant-primary text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap break-words">{message.content}</div>
                <div className={`text-xs mt-1 ${
                  message.sender === currentUser ? 'text-white/80' : 'text-gray-500'
                }`}>
                  {formatDistanceToNow(message.timestamp, { addSuffix: true, locale: fr })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="border-t p-4 bg-gray-50">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <Textarea
              placeholder={`Écrire un message à ${contact}...`}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="resize-none bg-white"
              rows={3}
            />
          </div>
          <Button type="submit" disabled={!replyContent.trim()} size="icon" variant="default">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};
