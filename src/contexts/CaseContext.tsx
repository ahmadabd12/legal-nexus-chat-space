
import React, { createContext, useContext, useState } from 'react';

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    sources?: string[];
    graphNodes?: string[];
    reasoning?: string;
  };
}

export interface Case {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'archived' | 'completed';
  messages: ChatMessage[];
  documents: string[];
  tags: string[];
}

interface CaseContextType {
  cases: Case[];
  currentCase: Case | null;
  loading: boolean;
  createCase: (title: string, description: string) => Promise<Case>;
  loadCase: (caseId: string) => Promise<void>;
  updateCase: (caseId: string, updates: Partial<Case>) => Promise<void>;
  sendMessage: (caseId: string, message: string) => Promise<void>;
  archiveCase: (caseId: string) => Promise<void>;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);

export const CaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<Case[]>([
    {
      id: '1',
      title: 'Contract Dispute Analysis',
      description: 'Analyzing breach of contract claims for XYZ Corp',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-16'),
      status: 'active',
      messages: [
        {
          id: '1',
          type: 'user',
          content: 'What are the key elements of a breach of contract claim?',
          timestamp: new Date('2024-01-15T10:00:00'),
        },
        {
          id: '2',
          type: 'assistant',
          content: 'A breach of contract claim typically requires four key elements: (1) existence of a valid contract, (2) performance by the plaintiff, (3) breach by the defendant, and (4) damages resulting from the breach.',
          timestamp: new Date('2024-01-15T10:01:00'),
          metadata: {
            sources: ['Contract Law Principles §2.1', 'Restatement (Second) of Contracts §235'],
            graphNodes: ['Contract Formation', 'Breach of Contract', 'Damages'],
          },
        },
      ],
      documents: ['contract-xyz-corp.pdf', 'correspondence-2024.pdf'],
      tags: ['contract', 'breach', 'commercial'],
    },
    {
      id: '2',
      title: 'Employment Law Research',
      description: 'Researching wrongful termination claims',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-14'),
      status: 'completed',
      messages: [],
      documents: ['employee-handbook.pdf', 'termination-letter.pdf'],
      tags: ['employment', 'termination', 'labor'],
    },
  ]);
  
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [loading, setLoading] = useState(false);

  const createCase = async (title: string, description: string): Promise<Case> => {
    setLoading(true);
    try {
      const newCase: Case = {
        id: Date.now().toString(),
        title,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
        messages: [],
        documents: [],
        tags: [],
      };
      
      setCases(prev => [newCase, ...prev]);
      setCurrentCase(newCase);
      return newCase;
    } finally {
      setLoading(false);
    }
  };

  const loadCase = async (caseId: string): Promise<void> => {
    setLoading(true);
    try {
      const case_ = cases.find(c => c.id === caseId);
      if (case_) {
        setCurrentCase(case_);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateCase = async (caseId: string, updates: Partial<Case>): Promise<void> => {
    setCases(prev => prev.map(c => 
      c.id === caseId 
        ? { ...c, ...updates, updatedAt: new Date() }
        : c
    ));
    
    if (currentCase?.id === caseId) {
      setCurrentCase(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
    }
  };

  const sendMessage = async (caseId: string, message: string): Promise<void> => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    // Add user message
    await updateCase(caseId, {
      messages: [...(currentCase?.messages || []), userMessage],
    });

    // Simulate AI response
    setTimeout(async () => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Based on your question about "${message}", I've analyzed relevant legal precedents and statutes. Here's what I found...`,
        timestamp: new Date(),
        metadata: {
          sources: ['Sample Statute §123.45', 'Key Case Law v. Example'],
          graphNodes: ['Legal Concept A', 'Related Statute B'],
          reasoning: 'Applied semantic search across legal database and graph reasoning to identify relevant connections.',
        },
      };

      await updateCase(caseId, {
        messages: [...(currentCase?.messages || []), userMessage, aiMessage],
      });
    }, 2000);
  };

  const archiveCase = async (caseId: string): Promise<void> => {
    await updateCase(caseId, { status: 'archived' });
  };

  return (
    <CaseContext.Provider
      value={{
        cases,
        currentCase,
        loading,
        createCase,
        loadCase,
        updateCase,
        sendMessage,
        archiveCase,
      }}
    >
      {children}
    </CaseContext.Provider>
  );
};

export const useCase = () => {
  const context = useContext(CaseContext);
  if (context === undefined) {
    throw new Error('useCase must be used within a CaseProvider');
  }
  return context;
};
