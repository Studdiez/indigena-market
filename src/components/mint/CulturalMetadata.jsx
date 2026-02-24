import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Shield, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TK_LABELS = [
  { value: "none", label: "No Label" },
  { value: "tk_open", label: "TK Open – Free to use" },
  { value: "tk_community", label: "TK Community – Community use" },
  { value: "tk_restricted", label: "TK Restricted – Limited use" },
];

export default function CulturalMetadata({ metadata, setMetadata }) {
  const updateField = (field, value) => {
    setMetadata({ ...metadata, [field]: value });
  };

  const addTag = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      const tags = metadata.cultural_tags || [];
      if (!tags.includes(e.target.value.trim())) {
        updateField("cultural_tags", [...tags, e.target.value.trim()]);
      }
      e.target.value = "";
    }
  };

  const removeTag = (tag) => {
    updateField("cultural_tags", (metadata.cultural_tags || []).filter((t) => t !== tag));
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-300 text-xs">Culture</Label>
          <Select value={metadata.culture || ""} onValueChange={(v) => updateField("culture", v)}>
            <SelectTrigger className="bg-[#1A1A1A] border-[#333] text-white rounded-xl">
              <SelectValue placeholder="Select culture" />
            </SelectTrigger>
            <SelectContent className="bg-[#242424] border-[#333]">
              <SelectItem value="maori" className="text-white">Māori</SelectItem>
              <SelectItem value="aboriginal" className="text-white">Aboriginal</SelectItem>
              <SelectItem value="pacific_islander" className="text-white">Pacific Islander</SelectItem>
              <SelectItem value="other" className="text-white">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300 text-xs">Tribe / Nation</Label>
          <Input
            value={metadata.tribe || ""}
            onChange={(e) => updateField("tribe", e.target.value)}
            placeholder="e.g. Ngāi Tahu"
            className="bg-[#1A1A1A] border-[#333] text-white rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300 text-xs">Language</Label>
          <Input
            value={metadata.language || ""}
            onChange={(e) => updateField("language", e.target.value)}
            placeholder="e.g. Te Reo Māori"
            className="bg-[#1A1A1A] border-[#333] text-white rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300 text-xs">Traditional Knowledge Label</Label>
          <Select value={metadata.tk_label || "none"} onValueChange={(v) => updateField("tk_label", v)}>
            <SelectTrigger className="bg-[#1A1A1A] border-[#333] text-white rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#242424] border-[#333]">
              {TK_LABELS.map((l) => (
                <SelectItem key={l.value} value={l.value} className="text-white">{l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cultural Tags */}
      <div className="space-y-2">
        <Label className="text-gray-300 text-xs flex items-center gap-1.5">
          <Tag className="w-3 h-3" /> Cultural Tags
        </Label>
        <Input
          placeholder="Type a tag and press Enter..."
          onKeyDown={addTag}
          className="bg-[#1A1A1A] border-[#333] text-white rounded-xl"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {(metadata.cultural_tags || []).map((tag) => (
            <Badge
              key={tag}
              className="bg-[#B51D19]/15 text-[#E8524E] border border-[#B51D19]/30 cursor-pointer hover:bg-[#B51D19]/25"
              onClick={() => removeTag(tag)}
            >
              {tag} ×
            </Badge>
          ))}
        </div>
      </div>

      {/* Sacred Toggle */}
      <div className="flex items-center justify-between rounded-xl bg-[#1A1A1A] border border-[#333] p-4">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-[#FDB910]" />
          <div>
            <p className="text-sm font-medium">Sacred / Restricted Content</p>
            <p className="text-xs text-gray-500">Requires elder approval for access</p>
          </div>
        </div>
        <Switch
          checked={metadata.is_sacred || false}
          onCheckedChange={(v) => updateField("is_sacred", v)}
        />
      </div>
    </div>
  );
}