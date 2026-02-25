import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Image, Video, Mic, Package, Palette, BookOpen,
  Briefcase, TreePine, Wrench, ArrowLeft, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import VoiceRecorder from "@/components/creator/VoiceRecorder";

const PILLARS = [
  { id: "digital_art", icon: Palette, label: "Digital Art", entity: "NFT" },
  { id: "physical", icon: Package, label: "Physical Item", entity: "PhysicalItem" },
  { id: "course", icon: BookOpen, label: "Course", entity: "Course" },
  { id: "service", icon: Briefcase, label: "Service", entity: "FreelanceGig" },
  { id: "land_food", icon: TreePine, label: "Land & Food", entity: "FoodProduct" },
  { id: "materials", icon: Wrench, label: "Materials", entity: "Material" },
];

export default function CreatorAddListing() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [pillar, setPillar] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price_indi: "",
    image_url: "",
    voice_story_url: "",
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const entity = PILLARS.find(p => p.id === pillar)?.entity;
      if (!entity) throw new Error("Invalid pillar");
      return base44.entities[entity].create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-nfts"] });
      navigate(createPageUrl("CreatorListings"));
    },
  });

  const handlePillarSelect = (pillarId) => {
    setPillar(pillarId);
    setStep(2);
  };

  const handleSubmit = () => {
    const data = {
      ...formData,
      price_indi: parseFloat(formData.price_indi),
      status: navigator.onLine ? "listed" : "draft",
    };
    createMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] p-6 lg:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => step > 1 ? setStep(step - 1) : navigate(createPageUrl("CreatorDashboard"))}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Add New Listing</h1>
            <p className="text-gray-400">Step {step} of 4</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${
                i <= step ? "bg-[#B51D19]" : "bg-[#333]"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Choose Pillar */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-xl font-semibold text-white mb-6">What are you listing?</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {PILLARS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handlePillarSelect(p.id)}
                      className="p-6 rounded-2xl bg-[#242424] border-2 border-[#333] hover:border-[#B51D19] transition-all group"
                    >
                      <Icon className="w-12 h-12 text-gray-400 group-hover:text-[#B51D19] mx-auto mb-3 transition-colors" />
                      <p className="text-white font-medium">{p.label}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Add Media */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-white">Add Media</h2>
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Photo *</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1 h-32 bg-[#242424] border-2 border-dashed border-[#333] hover:border-[#B51D19]">
                    <div className="flex flex-col items-center gap-2">
                      <Image className="w-8 h-8 text-gray-400" />
                      <span className="text-sm">Take Photo / Upload</span>
                    </div>
                  </Button>
                </div>
                <Input
                  type="url"
                  placeholder="Or paste image URL"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="mt-2 bg-[#242424] border-[#333] text-white"
                />
              </div>

              {/* Voice Story */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Voice Story (Optional but Recommended)
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Tell the story of this piece. Who made it? What does it mean?
                </p>
                <VoiceRecorder
                  onRecordingComplete={(url) => setFormData({ ...formData, voice_story_url: url })}
                />
              </div>

              <Button onClick={() => setStep(3)} className="w-full gradient-red">
                Continue
              </Button>
            </motion.div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-white">Add Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Title *</label>
                <Input
                  placeholder="Name of your work"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-[#242424] border-[#333] text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <Textarea
                  placeholder="Tell us more about this piece..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-[#242424] border-[#333] text-white min-h-32"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Price (INDI) *</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.price_indi}
                  onChange={(e) => setFormData({ ...formData, price_indi: e.target.value })}
                  className="bg-[#242424] border-[#333] text-white text-2xl font-bold"
                />
              </div>

              <Button onClick={() => setStep(4)} className="w-full gradient-red">
                Continue
              </Button>
            </motion.div>
          )}

          {/* Step 4: Review & Publish */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-white">Review & Publish</h2>
              
              <div className="rounded-2xl bg-[#242424] border border-[#333] p-6 space-y-4">
                {formData.image_url && (
                  <img src={formData.image_url} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                )}
                <div>
                  <h3 className="text-xl font-bold text-white">{formData.title || "Untitled"}</h3>
                  <p className="text-gray-400 mt-2">{formData.description}</p>
                </div>
                <div className="pt-4 border-t border-[#333]">
                  <p className="text-2xl font-bold text-[#FDB910]">{formData.price_indi} INDI</p>
                </div>
              </div>

              {!navigator.onLine && (
                <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-sm">
                  You're offline. This listing will be saved locally and published when you're back online.
                </div>
              )}

              <Button 
                onClick={handleSubmit} 
                disabled={createMutation.isPending}
                className="w-full gradient-red"
              >
                {createMutation.isPending ? "Publishing..." : navigator.onLine ? "Publish Now" : "Save for Later"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}