
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessagesList, Message } from "@/components/messaging/MessagesList";
import { MessageDetail } from "@/components/messaging/MessageDetail";
import { ComposeMessage } from "@/components/messaging/ComposeMessage";
import { Plus, MessageCircle, Mail } from "lucide-react";
import { toast } from "sonner";

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
}

interface Conversation {
  contact: string;
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
}

const mockEmployees: Employee[] = [
  { id: 1, firstName: "Jean", lastName: "Dupont", role: "Chef" },
  { id: 2, firstName: "Marie", lastName: "Laurent", role: "Serveur" },
  { id: 3, firstName: "Philippe", lastName: "Martin", role: "Serveur" },
  { id: 4, firstName: "Sophie", lastName: "Bernard", role: "Chef" },
  { id: 5, firstName: "Lucas", lastName: "Petit", role: "Serveur" },
];

const mockMessages: Message[] = [
  {
    id: 1,
    sender: "Jean Dupont",
    recipient: "Manager",
    content: "Bonjour, nous avons un problème avec la livraison des légumes. Pourriez-vous contacter le fournisseur ?",
    timestamp: new Date(Date.now() - 3600000 * 2),
    read: true,
  },
  {
    id: 2,
    sender: "Marie Laurent",
    recipient: "Manager",
    content: "Je ne pourrai pas assurer mon service demain soir pour des raisons personnelles. Pourriez-vous trouver un remplaçant ?",
    timestamp: new Date(Date.now() - 3600000 * 5),
    read: false,
  },
  {
    id: 3,
    sender: "Manager",
    recipient: "Philippe Martin",
    content: "Merci pour ton excellent travail hier soir. Le client était très satisfait du service.",
    timestamp: new Date(Date.now() - 3600000 * 24),
    read: true,
  },
  {
    id: 4,
    sender: "Sophie Bernard",
    recipient: "Manager",
    content: "Nous manquons de certains ingrédients pour le menu du jour. Voici la liste des produits à commander d'urgence...",
    timestamp: new Date(Date.now() - 3600000 * 28),
    read: false,
  },
  {
    id: 5,
    sender: "Manager",
    recipient: "Jean Dupont",
    content: "La réunion d'équipe est reportée à jeudi 10h. Peux-tu informer ton équipe ?",
    timestamp: new Date(Date.now() - 3600000 * 48),
    read: true,
  },
];

const Messagerie = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [conversations, setConversations] = useState<{ [key: string]: Conversation }>({});
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const currentUser = "Manager";

  useEffect(() => {
    const loadMessages = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Organize messages into conversations
      const newConversations: { [key: string]: Conversation } = {};
      
      messages.forEach(message => {
        const contact = message.sender === currentUser ? message.recipient : message.sender;
        
        if (!newConversations[contact]) {
          newConversations[contact] = {
            contact,
            messages: [],
            lastMessage: message,
            unreadCount: 0
          };
        }
        
        newConversations[contact].messages.push(message);
        if (!message.read && message.recipient === currentUser) {
          newConversations[contact].unreadCount++;
        }
      });
      
      // Sort messages within each conversation
      Object.values(newConversations).forEach(conversation => {
        conversation.messages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        conversation.lastMessage = conversation.messages[0];
      });
      
      setConversations(newConversations);
      setIsLoading(false);
    };
    
    loadMessages();
  }, [messages, currentUser]);

  const handleMessageSelect = (contact: string) => {
    setSelectedContact(contact);
    setIsComposing(false);
    
    // Mark messages as read
    if (conversations[contact]) {
      const updatedMessages = messages.map(m => 
        (!m.read && m.sender === contact && m.recipient === currentUser)
          ? { ...m, read: true }
          : m
      );
      setMessages(updatedMessages);
    }
  };

  const handleCompose = () => {
    setIsComposing(true);
    setSelectedContact(null);
  };

  const handleSendMessage = (recipientId: number, content: string) => {
    const recipient = mockEmployees.find(emp => emp.id === recipientId);
    if (!recipient) return;
    
    const recipientName = `${recipient.firstName} ${recipient.lastName}`;
    
    const newMessage: Message = {
      id: Date.now(),
      sender: currentUser,
      recipient: recipientName,
      content,
      timestamp: new Date(),
      read: false,
    };
    
    setMessages([newMessage, ...messages]);
    setIsComposing(false);
    setSelectedContact(recipientName);
    toast.success(`Message envoyé à ${recipientName}`);
  };

  const handleReply = (content: string, recipient: string) => {
    const newMessage: Message = {
      id: Date.now(),
      sender: currentUser,
      recipient,
      content,
      timestamp: new Date(),
      read: false,
    };
    
    setMessages([newMessage, ...messages]);
    toast.success(`Réponse envoyée à ${recipient}`);
  };

  const sortedConversations = Object.values(conversations).sort(
    (a, b) => b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime()
  );

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader className="border-b pb-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Mail className="h-6 w-6 mr-2 text-restaurant-primary" />
              <CardTitle className="text-xl font-semibold text-restaurant-primary">Messagerie</CardTitle>
            </div>
            <Button onClick={handleCompose} variant="default">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Message
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-220px)]">
            <div className="border-r bg-gray-50">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-restaurant-accent"></div>
                </div>
              ) : (
                <MessagesList 
                  conversations={sortedConversations}
                  onConversationSelect={handleMessageSelect}
                  selectedContact={selectedContact}
                  currentUser={currentUser}
                />
              )}
            </div>
            <div className="md:col-span-2 bg-white">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Chargement des messages...</p>
                </div>
              ) : isComposing ? (
                <ComposeMessage 
                  employees={mockEmployees}
                  onSend={handleSendMessage}
                  onCancel={() => setIsComposing(false)}
                />
              ) : selectedContact && conversations[selectedContact] ? (
                <MessageDetail 
                  messages={conversations[selectedContact].messages}
                  contact={selectedContact}
                  onReply={handleReply}
                  currentUser={currentUser}
                />
              ) : (
                <div className="flex flex-col justify-center items-center h-full text-center p-4">
                  <MessageCircle className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">Sélectionnez une conversation</h3>
                  <p className="text-gray-500 max-w-md mt-2">
                    Choisissez une conversation dans la liste ou créez un nouveau message.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Messagerie;
