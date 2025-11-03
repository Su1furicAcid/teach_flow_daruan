import { create } from 'zustand';

interface Conversation {
    id: number;  // 全局id主键
    conversationId: number;
    title: string;
    type: 'ppt' | 'syllabus' | 'agent';
    timestamp: string;
}

interface ConversationState {
    conversations: Conversation[];
    addConversation: (conversation: Conversation) => void;
    deleteConversation: (id: number) => void;
    updateConversation: (id: number, title: string) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
    conversations: [],
    addConversation: (conversation) => set((state) => ({
        conversations: [...state.conversations, conversation]
    })),
    deleteConversation: (id) => set((state) => ({
        conversations: state.conversations.filter((conversation) => conversation.id !== id)
    })),
    updateConversation: (id, title) => set((state) => ({
        conversations: state.conversations.map((conversation) =>
            conversation.id === id ? { ...conversation, title } : conversation
        )
    }))
}))