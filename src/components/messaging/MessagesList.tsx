
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

interface MessagesListProps {
  messages: Message[];
  onMessageSelect: (message: Message) => void;
  currentUser: string;
}

export const MessagesList = ({ messages, onMessageSelect, currentUser }: MessagesListProps) => {
  return (
    <div className="overflow-y-auto h-[calc(100vh-250px)]">
      <ul className="divide-y divide-gray-200">
        {messages.map((message) => {
          const isReceived = message.recipient === currentUser;
          return (
            <li 
              key={message.id} 
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!message.read && isReceived ? 'bg-blue-50' : ''}`}
              onClick={() => onMessageSelect(message)}
            >
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={message.senderAvatar} alt={message.sender} />
                  <AvatarFallback>{message.sender.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {isReceived ? message.sender : message.recipient}
                    </p>
                    <div className="flex items-center">
                      {!message.read && isReceived && (
                        <Badge variant="default" className="mr-2">Nouveau</Badge>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(message.timestamp, { addSuffix: true, locale: fr })}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{message.content}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
