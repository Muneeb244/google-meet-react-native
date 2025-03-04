import {create} from 'zustand';
import {createJSONStorage} from 'zustand/middleware';
import {mmkvStorage} from './storage';

export const useLiveMeetStore = create()(
  (set, get) => ({
    sessionId: null,
    participants: [],
    micOn: false,
    videoOn: false,

    clear: () =>
      set({
        sessionId: null,
        participants: [],
      }),

    addSessionId: id => {
      set({sessionId: id});
    },
    removeSessionId: () => {
      set({sessionId: null});
    },
    addParticipant: participant => {
      const {participants} = get();
      if (!participants.find(p => p.userId === participant?.userId)) {
        set({participants: [...participants, participant]});
      }
    },
    removeParticipant: participant => {
      const {participants} = get();
      set({
        participants: participants.filter(
          p => p.userId !== participant?.userId,
        ),
      });
    },
    updateParticipant: updatedParticipant => {
      const {participants} = get();
      set({
        participants: participants.map(p =>
          p.userId === updatedParticipant.userId
            ? {
                ...p,
                micOn: updatedParticipant.micOn,
                videoOn: updatedParticipant.videoOn,
              }
            : p,
        ),
      });
    },

    setStreamURL: (participantId, streamURL) => {
      const {participants} = get();
      const updatedParticipant = participants.map(p => {
        if (p.userId === participantId) {
          return {...p, streamURL};
        }
        return p;
      });

      // if(!participants.some(p => p.userId === participantId)) {
      //     updatedParticipant.push({id: participantId, streamURL})
      // }

      set({participants: updatedParticipant});
    },

    toggle: type => {
      if (type === 'mic') {
        set(state => ({micOn: !state.micOn}));
      } else if (type === 'video') {
        set(state => ({videoOn: !state.videoOn}));
      }
    },
  }),
  {
    name: 'live-meet-storage',
    storage: createJSONStorage(() => mmkvStorage),
  },
);
