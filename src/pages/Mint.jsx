import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Image, Sparkles, Loader2, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RoyaltySlider from "@/components/mint/RoyaltySlider";
import CulturalMetadata from "@/components/mint/CulturalMetadata";

const STEPS = ["Upload", "Details", "Culture", "Royalties", "Review"];

export default function Mint() {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    media_type: "image",
    price_indi: "",
    royalty_percent: 10,
    seva_allocation: 25,
    culture: "",
    tribe: "",
    language: "",
    cultural_tags: [],
    is_sacred: false,
    tk_label: "none",
    collection_id: "",
  });

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: myArtist } = useQuery({
    queryKey: ["my-artist", user?.email],
    queryFn: () => base44.entities.Artist.filter({ created_by: user.email }, "-created_date", 1),
    enabled: !!user?.email,
  });

  const { data: collections = [] } = useQuery({
    queryKey: ["my-collections", myArtist?.[0]?.id],
    queryFn: () => base44.entities.Collection.filter({ artist_id: myArtist[0].id }),
    enabled: !!myArtist?.[0]?.id,
  });

  const mintMutation = useMutation({
    mutationFn: async (data) => {
      const artist = myArtist?.[0];
      const nftData = {
        ...data,
        price_indi: parseFloat(data.price_indi),
        artist_id: artist?.id || "",
        artist_name: artist?.display_name || user?.full_name || "",
        status: "listed",
        mint_date: new Date().toISOString(),
        owner_email: user?.email,
        views: 0,
        wishlist_count: 0,
        total_sales: 0,
      };
      return base44.entities.NFT.create(nftData);
    },
    onSuccess: () => setStep(5), // success step
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setFormData((prev) => ({ ...prev, image_url: file_url }));
    setUploading(false);
  };

  const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <Sparkles className="w-12 h-12 text-[#B51D19] mb-4" />
        <h2 className="text-2xl font-bold mb-2">Connect to Create</h2>
        <p className="text-gray-400 mb-6">Sign in to mint your indigenous NFTs</p>
        <Button onClick={() => base44.auth.redirectToLogin()} className="gradient-red rounded-xl px-8">
          Connect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Mint NFT</h1>
        <p className="text-gray-400 mb-8">Create and list your indigenous digital art</p>
      </motion.div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                i === step
                  ? "bg-[#B51D19] text-white"
                  : i < step
                  ? "bg-[#B51D19]/20 text-[#B51D19]"
                  : "bg-[#242424] text-gray-600"
              }`}
            >
              {i < step ? <CheckCircle className="w-3 h-3" /> : null}
              <span className="hidden sm:inline">{s}</span>
              <span className="sm:hidden">{i + 1}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? "bg-[#B51D19]" : "bg-[#333]"}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Success State */}
      {step === 5 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
          <div className="w-20 h-20 rounded-full gradient-red mx-auto flex items-center justify-center mb-6 animate-pulse-glow">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2">NFT Minted!</h2>
          <p className="text-gray-400 mb-6">Your art is now listed on Indigena Market</p>
          <Button onClick={() => { setStep(0); setFormData({ title: "", description: "", image_url: "", media_type: "image", price_indi: "", royalty_percent: 10, seva_allocation: 25, culture: "", tribe: "", language: "", cultural_tags: [], is_sacred: false, tk_label: "none", collection_id: "" }); }} variant="outline" className="border-[#333] text-white rounded-xl">
            Mint Another
          </Button>
        </motion.div>
      )}

      {/* Step 0: Upload */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="upload" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="rounded-2xl border-2 border-dashed border-[#333] bg-[#242424] p-8 text-center hover:border-[#B51D19]/40 transition-colors">
              {formData.image_url ? (
                <div className="relative">
                  <img src={formData.image_url} alt="Preview" className="max-h-80 mx-auto rounded-xl object-contain" />
                  <button
                    onClick={() => updateField("image_url", "")}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-black/60 text-white text-xs hover:bg-black/80"
                  >
                    Replace
                  </button>
                </div>
              ) : uploading ? (
                <div className="py-12">
                  <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#B51D19] mb-3" />
                  <p className="text-gray-400">Uploading...</p>
                </div>
              ) : (
                <label className="cursor-pointer block py-12">
                  <Upload className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-lg font-medium text-gray-300">Drop your art here</p>
                  <p className="text-sm text-gray-500 mt-1">Images, video, audio, or 3D models</p>
                  <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,video/*,audio/*" />
                </label>
              )}
            </div>
            {formData.image_url && (
              <div className="mt-4">
                <Label className="text-gray-300 text-xs">Media Type</Label>
                <Select value={formData.media_type} onValueChange={(v) => updateField("media_type", v)}>
                  <SelectTrigger className="bg-[#242424] border-[#333] text-white rounded-xl mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#242424] border-[#333]">
                    <SelectItem value="image" className="text-white">Image</SelectItem>
                    <SelectItem value="video" className="text-white">Video</SelectItem>
                    <SelectItem value="audio" className="text-white">Audio</SelectItem>
                    <SelectItem value="3d_model" className="text-white">3D Model</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 1: Details */}
        {step === 1 && (
          <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-gray-300 text-xs">Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Name your creation"
                className="bg-[#242424] border-[#333] text-white rounded-xl h-12 text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300 text-xs">Story / Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Tell the story behind this art..."
                className="bg-[#242424] border-[#333] text-white rounded-xl min-h-[140px] resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300 text-xs">Price (INDI)</Label>
                <Input
                  type="number"
                  value={formData.price_indi}
                  onChange={(e) => updateField("price_indi", e.target.value)}
                  placeholder="100"
                  className="bg-[#242424] border-[#333] text-white rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300 text-xs">Collection (optional)</Label>
                <Select value={formData.collection_id} onValueChange={(v) => updateField("collection_id", v)}>
                  <SelectTrigger className="bg-[#242424] border-[#333] text-white rounded-xl">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#242424] border-[#333]">
                    <SelectItem value="none" className="text-white">None</SelectItem>
                    {collections.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="text-white">{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Culture */}
        {step === 2 && (
          <motion.div key="culture" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <CulturalMetadata metadata={formData} setMetadata={setFormData} />
          </motion.div>
        )}

        {/* Step 3: Royalties */}
        {step === 3 && (
          <motion.div key="royalties" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <RoyaltySlider
              royalty={formData.royalty_percent}
              setRoyalty={(v) => updateField("royalty_percent", v)}
              sevaAllocation={formData.seva_allocation}
              setSevaAllocation={(v) => updateField("seva_allocation", v)}
            />
          </motion.div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="rounded-2xl bg-[#242424] border border-[#333] overflow-hidden">
              {formData.image_url && (
                <img src={formData.image_url} alt="Preview" className="w-full max-h-64 object-cover" />
              )}
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-bold">{formData.title || "Untitled"}</h2>
                <p className="text-gray-400 text-sm">{formData.description || "No description"}</p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#333]">
                  <div>
                    <p className="text-xs text-gray-500">Price</p>
                    <p className="text-lg font-bold text-[#FDB910]">{formData.price_indi || 0} INDI</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Royalty</p>
                    <p className="text-lg font-bold">{formData.royalty_percent}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">SEVA Impact</p>
                    <p className="text-lg font-bold text-[#2A5C3E]">{formData.seva_allocation}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Culture</p>
                    <p className="text-sm font-medium capitalize">{formData.culture || "Not set"}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      {step < 5 && (
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="border-[#333] text-white rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          {step < 4 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={(step === 0 && !formData.image_url) || (step === 1 && (!formData.title || !formData.price_indi))}
              className="gradient-red rounded-xl"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => mintMutation.mutate(formData)}
              disabled={mintMutation.isPending}
              className="gradient-red rounded-xl px-8"
            >
              {mintMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Mint NFT
            </Button>
          )}
        </div>
      )}
    </div>
  );
}