import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Calendar, Users, Play, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function SevaProject() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get("id");
  const [donationAmount, setDonationAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");

  const { data: project, isLoading } = useQuery({
    queryKey: ["seva-project", projectId],
    queryFn: () => base44.entities.SEVAProject.filter({ id: projectId }).then(res => res[0]),
    enabled: !!projectId,
  });

  const donateMutation = useMutation({
    mutationFn: async (amount) => {
      return base44.entities.SEVATransaction.create({
        amount: parseFloat(amount),
        cause: project.category,
        cause_name: project.title,
        source: "direct_donation",
        status: "completed",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seva-project", projectId] });
      alert("Thank you for your donation! You're making a real difference.");
    },
  });

  const handleDonate = () => {
    const amount = customAmount || donationAmount;
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid donation amount");
      return;
    }
    donateMutation.mutate(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] p-6 lg:p-10">
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
          <div className="h-96 bg-[#242424] rounded-2xl" />
          <div className="h-8 bg-[#242424] rounded w-2/3" />
          <div className="h-4 bg-[#242424] rounded w-full" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <p className="text-gray-400">Project not found</p>
      </div>
    );
  }

  const progress = (project.raised_amount / project.goal_amount) * 100;
  const daysRemaining = project.end_date 
    ? Math.max(0, Math.ceil((new Date(project.end_date) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* Hero */}
      <div className="relative h-[50vh] overflow-hidden">
        {project.cover_url && (
          <img src={project.cover_url} alt={project.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/60 to-transparent" />
        <Button
          onClick={() => navigate(createPageUrl("SevaHub"))}
          variant="ghost"
          size="icon"
          className="absolute top-6 left-6 text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 -mt-32 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Badge className="bg-[#B51D19]/15 text-[#E8524E] border-[#B51D19]/30">
                {project.category.replace(/_/g, " ")}
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-white">{project.title}</h1>
              <p className="text-xl text-gray-300">{project.community_name} • {project.location}</p>
            </motion.div>

            {/* Story */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-[#242424] border border-[#333] p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-4">The Story</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{project.description}</p>
              
              {project.audio_message_url && (
                <div className="mt-6 p-4 rounded-xl bg-[#2E2E2E] border border-[#333]">
                  <div className="flex items-center gap-3 mb-3">
                    <Play className="w-5 h-5 text-[#FDB910]" />
                    <p className="text-white font-medium">Hear from the Community</p>
                  </div>
                  <audio src={project.audio_message_url} controls className="w-full" />
                </div>
              )}
            </motion.div>

            {/* Updates */}
            {project.updates && project.updates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl bg-[#242424] border border-[#333] p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Project Updates</h2>
                <div className="space-y-6">
                  {project.updates.map((update, i) => (
                    <div key={i} className="border-l-2 border-[#B51D19] pl-4">
                      <p className="text-sm text-gray-500">{new Date(update.date).toLocaleDateString()}</p>
                      <h3 className="text-lg font-semibold text-white mt-1">{update.title}</h3>
                      <p className="text-gray-400 mt-2">{update.content}</p>
                      {update.images && update.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          {update.images.map((img, j) => (
                            <img key={j} src={img} alt="" className="w-full h-32 object-cover rounded-lg" />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Donation Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="sticky top-6 rounded-2xl bg-[#242424] border border-[#333] p-6 space-y-6"
            >
              {/* Progress */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-3xl font-bold text-white">
                    ${project.raised_amount.toLocaleString()}
                  </span>
                  <span className="text-gray-400">
                    of ${project.goal_amount.toLocaleString()}
                  </span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="flex justify-between text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {project.donors_count} donors
                  </span>
                  {daysRemaining !== null && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {daysRemaining} days left
                    </span>
                  )}
                </div>
              </div>

              {/* Donation Options */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-400">Choose an amount:</p>
                <div className="grid grid-cols-2 gap-2">
                  {project.impact_statements && Object.keys(project.impact_statements).map(amount => (
                    <button
                      key={amount}
                      onClick={() => {
                        setDonationAmount(amount);
                        setCustomAmount("");
                      }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        donationAmount === amount
                          ? "border-[#B51D19] bg-[#B51D19]/10"
                          : "border-[#333] hover:border-[#B51D19]/50"
                      }`}
                    >
                      <p className="text-2xl font-bold text-white">${amount}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {project.impact_statements[amount]}
                      </p>
                    </button>
                  ))}
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setDonationAmount("");
                    }}
                    className="bg-[#2E2E2E] border-[#333] text-white"
                  />
                </div>
              </div>

              {/* Donate Button */}
              <Button
                onClick={handleDonate}
                disabled={donateMutation.isPending}
                className="w-full gradient-red text-lg py-6"
              >
                <Heart className="w-5 h-5 mr-2" />
                {donateMutation.isPending ? "Processing..." : "Donate Now"}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                100% of your donation goes directly to the community
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}