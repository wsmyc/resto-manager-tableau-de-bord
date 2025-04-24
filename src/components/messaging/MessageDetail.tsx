
import { useState } from "react";
import { Message } from "./MessagesList";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageDetailProps {
  message: Message;
  onReply: (content: string, recipient: string) => void;
  currentUser: string;
}

export const MessageDetail = ({ message, onReply, currentUser }: MessageDetailProps) => {
  const [replyContent, setReplyContent] = useState("");
  const recipient = message.sender === currentUser ? message.recipient : message.sender;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onReply(replyContent.trim(), recipient);
      setReplyContent("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4">
        <div className="flex items-center space-x-3 mb-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={message.senderAvatar} alt={message.sender} />
            <AvatarFallback>{message.sender.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{message.sender}</h3>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(message.timestamp, { addSuffix: true, locale: fr })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>

      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <Textarea
              placeholder={`Répondre à ${recipient}...`}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
          <Button type="submit" disabled={!replyContent.trim()} size="icon">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};
