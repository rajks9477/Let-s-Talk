import { create } from 'zustand';

export type MainTab = 'CHATS' | 'STATUS' | 'COMMUNITIES' | 'CHANNELS' | 'CALLS' | 'PAYMENTS' | 'SETTINGS';

interface UIState {
  activeTab: MainTab;
  isRightDrawerOpen: boolean;
  rightDrawerContent: 'INFO' | 'MEDIA' | 'AI' | 'BUSINESS' | 'ADMIN' | null;

  // Modal Dialogs
  isAuthModalOpen: boolean;
  isCreateGroupOpen: boolean;
  isCreateCommunityOpen: boolean;
  isCreateChannelOpen: boolean;
  isCreatePollOpen: boolean;
  isCreateEventOpen: boolean;
  isStatusCreatorOpen: boolean;
  isMediaStudioOpen: boolean;
  isSendMoneyOpen: boolean;
  isUPIPinOpen: boolean;
  isQRCodeOpen: boolean;
  isChatLockOpen: boolean;
  isSecretCodeModalOpen: boolean;
  isBackupModalOpen: boolean;
  isLinkedDevicesOpen: boolean;
  isAdminDashboardOpen: boolean;

  // Actions
  setActiveTab: (tab: MainTab) => void;
  openRightDrawer: (content: UIState['rightDrawerContent']) => void;
  closeRightDrawer: () => void;
  setModalState: (modal: keyof Omit<UIState, 'activeTab' | 'isRightDrawerOpen' | 'rightDrawerContent' | 'setActiveTab' | 'openRightDrawer' | 'closeRightDrawer' | 'setModalState'>, isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'CHATS',
  isRightDrawerOpen: false,
  rightDrawerContent: null,

  isAuthModalOpen: false,
  isCreateGroupOpen: false,
  isCreateCommunityOpen: false,
  isCreateChannelOpen: false,
  isCreatePollOpen: false,
  isCreateEventOpen: false,
  isStatusCreatorOpen: false,
  isMediaStudioOpen: false,
  isSendMoneyOpen: false,
  isUPIPinOpen: false,
  isQRCodeOpen: false,
  isChatLockOpen: false,
  isSecretCodeModalOpen: false,
  isBackupModalOpen: false,
  isLinkedDevicesOpen: false,
  isAdminDashboardOpen: false,

  setActiveTab: (activeTab) => set({ activeTab }),
  openRightDrawer: (rightDrawerContent) => set({ isRightDrawerOpen: true, rightDrawerContent }),
  closeRightDrawer: () => set({ isRightDrawerOpen: false, rightDrawerContent: null }),
  setModalState: (modal, isOpen) => set({ [modal]: isOpen } as any),
}));
