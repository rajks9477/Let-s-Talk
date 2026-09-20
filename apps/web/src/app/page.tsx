'use client';

import React, { useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { useChatStore } from '@/stores/chatStore';
import { useCallStore } from '@/stores/callStore';

// Navigation
import { SidebarNav } from '@/components/navigation/SidebarNav';
import { TopAppBar } from '@/components/navigation/TopAppBar';
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav';

// Primary Tab Views
import { ChatList } from '@/components/chat/ChatList';
import { StatusTab } from '@/components/status/StatusTab';
import { CommunitiesTab } from '@/components/communities/CommunitiesTab';
import { ChannelsTab } from '@/components/channels/ChannelsTab';
import { CallsTab } from '@/components/calls/CallsTab';
import { PaymentsTab } from '@/components/payments/PaymentsTab';
import { SettingsTab } from '@/components/settings/SettingsTab';

// Central Chat Workspace
import { ChatArea } from '@/components/chat/ChatArea';

// Right Drawers
import { ChatInfoDrawer } from '@/components/chat/ChatInfoDrawer';
import { AIAssistantDrawer } from '@/components/ai/AIAssistantDrawer';

// Modals & Overlays
import { AuthModal } from '@/components/auth/AuthModal';
import { NewChatModal } from '@/components/modals/NewChatModal';
import { CallModal } from '@/components/calls/CallModal';
import { IncomingCallBanner } from '@/components/calls/IncomingCallBanner';
import { StatusCreatorModal } from '@/components/status/StatusCreatorModal';
import { StatusViewerModal } from '@/components/status/StatusViewerModal';
import { MediaStudioModal } from '@/components/media/MediaStudioModal';
import { SendMoneyModal } from '@/components/payments/SendMoneyModal';
import { UPIPinModal } from '@/components/payments/UPIPinModal';
import { PaymentQRCodeModal } from '@/components/payments/PaymentQRCodeModal';
import { SecretCodeModal } from '@/components/privacy/SecretCodeModal';
import { CreatePollModal } from '@/components/chat/CreatePollModal';
import { CreateEventModal } from '@/components/chat/CreateEventModal';
import { CreateGroupModal } from '@/components/groups/CreateGroupModal';
import { CreateChannelModal } from '@/components/channels/CreateChannelModal';
import { BackupModal } from '@/components/settings/BackupModal';
import { LinkedDevicesModal } from '@/components/settings/LinkedDevicesModal';
import { AdminDashboardModal } from '@/components/admin/AdminDashboardModal';
import { BusinessProfileModal } from '@/components/business/BusinessProfileModal';

export default function Home() {
  // Initialize Realtime WebSocket
  useSocket();

  const { isAuthenticated, loadStoredAuth, setUser, user } = useAuthStore();
  const {
    activeTab,
    isRightDrawerOpen,
    rightDrawerContent,
    isAuthModalOpen,
    isNewChatOpen,
    isCreateGroupOpen,
    isCreateChannelOpen,
    isCreatePollOpen,
    isCreateEventOpen,
    isStatusCreatorOpen,
    isMediaStudioOpen,
    isSendMoneyOpen,
    isUPIPinOpen,
    isQRCodeOpen,
    isSecretCodeModalOpen,
    isBackupModalOpen,
    isLinkedDevicesOpen,
    isAdminDashboardOpen,
    setModalState,
  } = useUIStore();

  const { activeChat, setActiveChat } = useChatStore();
  const { activeCall, incomingCall } = useCallStore();

  // Load auth state on initial mount
  useEffect(() => {
    loadStoredAuth();
    const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!stored) {
      // Auto-open phone login modal on fresh visit so user can enter their own number
      setModalState('isAuthModalOpen', true);
    }
  }, [loadStoredAuth, setModalState]);

  // Render Left/Center Tab View
  const renderTabContent = () => {
    switch (activeTab) {
      case 'CHATS':
        return <ChatList />;
      case 'STATUS':
        return <StatusTab />;
      case 'COMMUNITIES':
        return <CommunitiesTab />;
      case 'CHANNELS':
        return <ChannelsTab />;
      case 'CALLS':
        return <CallsTab />;
      case 'PAYMENTS':
        return <PaymentsTab />;
      case 'SETTINGS':
        return <SettingsTab />;
      default:
        return <ChatList />;
    }
  };

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-[#F5EFE6] font-sans text-[#0F172A] antialiased selection:bg-[#1E3A8A]/20 selection:text-[#1E3A8A]">
      {/* 1. Left Navigation Rail (Luxury Navy Blue) */}
      <div className="hidden md:flex md:w-[60px] flex-shrink-0 flex-col z-30 shadow-md">
        <SidebarNav />
      </div>

      {/* 2. Main Center-Left List Panel (Warm Light Cream) */}
      <section
        className={`flex flex-col h-full bg-[#FAF8F2] border-r border-[#E2D8C7] transition-all duration-300 z-20 ${
          activeChat ? 'hidden md:flex md:w-[380px] lg:w-[410px] flex-shrink-0' : 'w-full md:w-[380px] lg:w-[410px] flex-shrink-0'
        }`}
      >
        <TopAppBar />
        <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-[#FAF8F2]">
          {renderTabContent()}
        </div>
      </section>

      {/* 3. Central Chat Workspace (Warm Cream Wallpaper) */}
      <section
        className={`flex-1 flex flex-col h-full relative overflow-hidden bg-[#F5EFE6] z-10 ${
          !activeChat ? 'hidden md:flex' : 'flex w-full'
        }`}
      >
        <ChatArea />
      </section>

      {/* 4. Right Side Drawers (Light Cream & Navy Drawer) */}
      {isRightDrawerOpen && (
        <aside className="w-full md:w-[380px] lg:w-[420px] h-full flex-shrink-0 border-l border-[#E2D8C7] bg-[#FAF8F2] flex flex-col z-30 shadow-2xl transition-all duration-300">
          {rightDrawerContent === 'INFO' && <ChatInfoDrawer />}
          {rightDrawerContent === 'AI' && <AIAssistantDrawer />}
          {rightDrawerContent === 'BUSINESS' && (
            <BusinessProfileModal
              business={{
                id: 'biz_01',
                businessName: 'Luxe Aura Tech',
                category: 'Software & Technology',
                description: 'Official enterprise support and luxury gadgets.',
                address: 'Silicon Valley, CA, USA',
                website: 'https://letstalk.example.com',
                email: 'support@letstalk.example.com',
                hours: 'Mon-Fri 09:00 - 18:00 PST',
                catalog: [
                  {
                    id: 'p1',
                    name: 'Aura Quantum Earbuds Pro',
                    price: 199.99,
                    description: 'Spatial audio with zero-latency lossless streaming.',
                    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
                  },
                  {
                    id: 'p2',
                    name: 'Titanium Smartwatch Ultra',
                    price: 349.0,
                    description: 'Military-grade rugged chassis with 14-day battery life.',
                    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
                  },
                ],
              }}
              onClose={() => useUIStore.getState().closeRightDrawer()}
            />
          )}
        </aside>
      )}

      {/* 5. Mobile Bottom Navigation Bar (Visible only on mobile devices when not in an active chat) */}
      {!activeChat && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F2] border-t border-[#E2D8C7]">
          <MobileBottomNav />
        </div>
      )}

      {/* --- FLOATING / MODAL DIALOGS --- */}

      {/* Authentication Modal */}
      {isAuthModalOpen && <AuthModal />}

      {/* Start New Chat / Search Contact by Phone */}
      {isNewChatOpen && <NewChatModal />}

      {/* Incoming Call Banner & Active Call Modal */}
      {incomingCall && <IncomingCallBanner />}
      {activeCall && <CallModal />}

      {/* Status Stories Modals */}
      {isStatusCreatorOpen && <StatusCreatorModal />}
      <StatusViewerModal />

      {/* Media & Canvas Studio */}
      {isMediaStudioOpen && (
        <MediaStudioModal
          initialImage="https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=800"
          onSave={(editedDataUrl) => {
            setModalState('isMediaStudioOpen', false);
          }}
          onClose={() => setModalState('isMediaStudioOpen', false)}
        />
      )}

      {/* UPI / India Payments Flow Modals */}
      {isSendMoneyOpen && <SendMoneyModal />}
      {isUPIPinOpen && (
        <UPIPinModal
          recipientName="Sarah Jenkins"
          amount="450.00"
          onComplete={(pin) => {
            setModalState('isUPIPinOpen', false);
          }}
          onClose={() => setModalState('isUPIPinOpen', false)}
        />
      )}
      {isQRCodeOpen && <PaymentQRCodeModal />}

      {/* Vault / Chat Lock Secret Code Modal */}
      {isSecretCodeModalOpen && <SecretCodeModal />}

      {/* Creation Modals */}
      {isCreatePollOpen && <CreatePollModal />}
      {isCreateEventOpen && <CreateEventModal />}
      {isCreateGroupOpen && <CreateGroupModal />}
      {isCreateChannelOpen && <CreateChannelModal />}

      {/* Settings & Device Management Modals */}
      {isBackupModalOpen && <BackupModal />}
      {isLinkedDevicesOpen && <LinkedDevicesModal />}
      {isAdminDashboardOpen && <AdminDashboardModal />}
    </main>
  );
}
