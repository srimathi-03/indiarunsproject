import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Sparkles, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import JDInputPanel from '../components/ranking/JDInputPanel';
import WeightSliders from '../components/ranking/WeightSliders';
import LoadingOrbit from '../components/ui/LoadingOrbit';
import { seedCandidates } from '../api/client';
import { useStore } from '../store/useStore';
import { TeamMember } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [newMember, setNewMember] = useState({ role: '', skills: '' });
  const [showForm, setShowForm] = useState(false);
  const teamMembers = useStore((state) => state.teamMembers);
  const setTeamMembers = useStore((state) => state.setTeamMembers);
  const submitJDAndRank = useStore((state) => state.submitJDAndRank);
  const isLoading = useStore((state) => state.isLoading);
  const loadingStep = useStore((state) => state.loadingStep);
  const rankingResult = useStore((state) => state.rankingResult);
  const addToast = useStore((state) => state.addToast);

  useEffect(() => {
    if (rankingResult) navigate('/results');
  }, [navigate, rankingResult]);

  const addTeamMember = () => {
    if (!newMember.role.trim()) return;
    const member: TeamMember = {
      role: newMember.role,
      skills: newMember.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
    };
    setTeamMembers([...teamMembers, member]);
    setNewMember({ role: '', skills: '' });
    setShowForm(false);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      submitJDAndRank();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [submitJDAndRank]);

  return (
    <div className="min-h-screen bg-brand-dark px-6 py-24 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-semibold">Define Your Role</h2>
            <p className="mt-2 text-brand-muted">Paste the role and let NeuroRank evaluate the market in context.</p>
          </div>

          <JDInputPanel />

          <div className="rounded-3xl border border-brand-border/70 bg-brand-card/70 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Existing Team</h3>
              <button onClick={() => setShowForm((prev) => !prev)} className="flex items-center gap-2 rounded-full border border-brand-border px-3 py-1 text-sm text-brand-cyan">
                <Plus size={14} /> Add Team Member
              </button>
            </div>

            {showForm ? (
              <div className="space-y-3 rounded-2xl border border-brand-border/70 bg-slate-950/60 p-4">
                <input value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} className="w-full rounded-xl border border-brand-border bg-brand-card px-3 py-2 text-white" placeholder="Role" />
                <input value={newMember.skills} onChange={(e) => setNewMember({ ...newMember, skills: e.target.value })} className="w-full rounded-xl border border-brand-border bg-brand-card px-3 py-2 text-white" placeholder="Skills (comma separated)" />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowForm(false)} className="rounded-full px-3 py-2 text-sm text-brand-muted">Cancel</button>
                  <button onClick={addTeamMember} className="rounded-full bg-brand-purple px-3 py-2 text-sm text-white">Add</button>
                </div>
              </div>
            ) : null}

            <div className="mt-4 space-y-2">
              {teamMembers.length === 0 ? <p className="text-sm text-brand-muted">No team members added yet.</p> : teamMembers.map((member, index) => (
                <div key={`${member.role}-${index}`} className="flex items-center justify-between rounded-2xl border border-brand-border/70 bg-slate-950/60 px-4 py-3">
                  <div>
                    <div className="font-medium text-white">{member.role}</div>
                    <div className="text-sm text-brand-muted">{member.skills.join(', ')}</div>
                  </div>
                  <button onClick={() => setTeamMembers(teamMembers.filter((_, i) => i !== index))} className="text-sm text-brand-danger">Remove</button>
                </div>
              ))}
            </div>
          </div>

          <WeightSliders />

          <button onClick={() => submitJDAndRank()} disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-cyan px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
            {isLoading ? <span className="animate-spin">⏳</span> : <Sparkles size={16} />} {isLoading ? loadingStep : 'Rank Candidates'}
          </button>
          <p className="text-center text-sm text-brand-muted">Keyboard shortcut: Ctrl + Enter</p>
        </div>

        <div className="rounded-3xl border border-brand-border/70 bg-brand-card/70 p-6">
          {!rankingResult && !isLoading ? (
            <div className="flex h-full min-h-[520px] flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full border border-brand-purple/40 bg-brand-purple/10 p-4">
                <Search size={28} className="text-brand-cyan" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Paste a JD and let NeuroRank do the thinking</h3>
              <p className="mt-3 max-w-md text-brand-muted">No candidates found? Seed a demo pool to explore the experience.</p>
              <button onClick={async () => { await seedCandidates(); addToast('success', 'Demo candidates seeded'); }} className="mt-6 rounded-full border border-brand-purple/40 px-4 py-2 text-sm text-brand-cyan">Seed 30 Demo Candidates</button>
            </div>
          ) : null}

          {isLoading ? <LoadingOrbit /> : null}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
