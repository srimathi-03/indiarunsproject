import { create } from 'zustand';
import { User, RankingResult, RankedCandidate, TeamMember, Toast, WeightConfig } from '../types';
import { getMe } from '../api/client';

interface StoreState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;

  jdText: string;
  jobTitle: string;
  teamMembers: TeamMember[];
  weights: WeightConfig;
  setJdText: (text: string) => void;
  setJobTitle: (title: string) => void;
  setTeamMembers: (members: TeamMember[]) => void;
  setWeights: (weights: Partial<WeightConfig>) => void;
  normalizeWeights: () => void;

  isLoading: boolean;
  loadingStep: string;
  currentJobId: string | null;
  rankingResult: RankingResult | null;
  rankingHistory: RankingResult[];
  selectedCandidate: RankedCandidate | null;
  setLoading: (loading: boolean, step?: string) => void;
  setRankingResult: (result: RankingResult) => void;
  setSelectedCandidate: (candidate: RankedCandidate | null) => void;

  toasts: Toast[];
  addToast: (type: Toast['type'], message: string) => void;
  removeToast: (id: string) => void;

  submitJDAndRank: () => Promise<void>;
}

const initialWeights: WeightConfig = {
  semantic: 35,
  experience: 25,
  trajectory: 20,
  behavioral: 10,
  teamValue: 10
};

export const useStore = create<StoreState>((set, get) => ({
  token: localStorage.getItem('nr_token'),
  user: null,
  setAuth: (token, user) => {
    localStorage.setItem('nr_token', token);
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('nr_token');
    set({ token: null, user: null, rankingResult: null, selectedCandidate: null });
  },

  jdText: '',
  jobTitle: '',
  teamMembers: [],
  weights: initialWeights,
  setJdText: (jdText) => set({ jdText }),
  setJobTitle: (jobTitle) => set({ jobTitle }),
  setTeamMembers: (teamMembers) => set({ teamMembers }),
  setWeights: (weights) => set((state) => ({ weights: { ...state.weights, ...weights } })),
  normalizeWeights: () => {
    const { weights } = get();
    const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
    if (total === 0) return;
    const normalized: WeightConfig = {
      semantic: 0,
      experience: 0,
      trajectory: 0,
      behavioral: 0,
      teamValue: 0
    };
    (Object.keys(weights) as Array<keyof WeightConfig>).forEach((key) => {
      normalized[key] = Number(((weights[key] / total) * 100).toFixed(2));
    });
    set({ weights: normalized });
  },

  isLoading: false,
  loadingStep: 'Idle',
  currentJobId: null,
  rankingResult: null,
  rankingHistory: [],
  selectedCandidate: null,
  setLoading: (isLoading, loadingStep = 'Working...') => set({ isLoading, loadingStep }),
  setRankingResult: (rankingResult) => set({ rankingResult }),
  setSelectedCandidate: (selectedCandidate) => set({ selectedCandidate }),

  toasts: [],
  addToast: (type, message) => {
    const id = Math.random().toString(36).slice(2);
    set((state) => ({ toasts: [...state.toasts, { id, type, message }] }));
    setTimeout(() => get().removeToast(id), 4000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),

  submitJDAndRank: async () => {
    const { jdText, jobTitle, teamMembers, weights } = get();
    if (jdText.length < 100) {
      get().addToast('error', 'Please paste a more detailed job description.');
      return;
    }

    get().setLoading(true, 'Parsing job description...');
    try {
      const jobResponse = await (await import('../api/client')).createJob({
        title: jobTitle || 'AI Engineering Role',
        description: jdText,
        teamMembers
      });
      const jobId = jobResponse.data.data._id;
      set({ currentJobId: jobId });

      get().setLoading(true, 'Searching talent pool...');
      const rankingResponse = await (await import('../api/client')).runRanking({
        jobId,
        weightOverrides: weights
      });

      get().setLoading(true, 'Running AI analysis...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      get().setRankingResult(rankingResponse.data.data);
      get().setLoading(false, 'Done');
      get().addToast('success', `Ranked ${rankingResponse.data.data.rankedCandidates.length} candidates in ${rankingResponse.data.data.processingTimeMs}ms`);
      window.location.href = '/results';
    } catch (err: any) {
      get().setLoading(false, 'Error');
      get().addToast('error', err.message || 'Unable to rank candidates right now.');
    }
  }
}));

export const initializeAuth = async () => {
  const { token } = useStore.getState();
  if (!token) return;
  try {
    const response = await getMe();
    useStore.setState({ user: response.data.data.user });
  } catch {
    useStore.getState().logout();
  }
};
