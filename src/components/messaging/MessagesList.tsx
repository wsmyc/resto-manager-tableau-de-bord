
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export interface Message {
  id: number;
  sender: string;
  senderAvatar?: string;
  recipient: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  contact: string;
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
}

interface MessagesListProps {
  conversations: Conversation[];
  onConversationSelect: (contact: string) => void;
  selectedContact: string | null;
  currentUser: string;
}

export const MessagesList = ({ conversations, onConversationSelect, selectedContact, currentUser }: MessagesListProps) => {
  return (
    <div className="overflow-y-auto h-[calc(100vh-250px)]">
      <ul className="divide-y divide-gray-200">
        {conversations.map((conversation) => (
          <li 
            key={conversation.contact}
            className={`hover:bg-gray-100 cursor-pointer transition-colors ${
              selectedContact === conversation.contact ? 'bg-gray-100' : ''
            }`}
            onClick={() => onConversationSelect(conversation.contact)}
          >
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10 bg-restaurant-primary">
                  <AvatarFallback>
                    {conversation.contact.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {conversation.contact}
                    </p>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {formatDistanceToNow(conversation.lastMessage.timestamp, { addSuffix: true, locale: fr })}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-gray-500 truncate">
                      {conversation.lastMessage.sender === currentUser ? 
                        `Vous: ${conversation.lastMessage.content}` : 
                        conversation.lastMessage.content
                      }
                    </p>
                    {conversation.unreadCount > 0 && (
                      <Badge variant="default" className="ml-2 bg-restaurant-primary">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
