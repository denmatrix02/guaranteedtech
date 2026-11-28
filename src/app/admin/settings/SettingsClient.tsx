"use client";

import React, { useState } from "react";
import { Save, AlertCircle, Building2, Shield, Phone, Globe, DollarSign, Store } from "lucide-react";

export function SettingsClient({ initialSettings }: { initialSettings: Record<string, any> }) {
  const [activeTab, setActiveTab] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // General Settings
  const gen = initialSettings.general || {};
  const [storeName, setStoreName] = useState(gen.storeName || "GuaranteedTech");
  const [tagline, setTagline] = useState(gen.tagline || "Certified Computers, Laptops & IT Hardware in Nigeria");
  const [supportPhone, setSupportPhone] = useState(gen.supportPhone || "+2348067150130");
  const [whatsappNumber, setWhatsappNumber] = useState(gen.whatsappNumber || "2348067150130");
  const [supportEmail, setSupportEmail] = useState(gen.supportEmail || "guarateedtech17@gmail.com");
  const [defaultDeliveryFee, setDefaultDeliveryFee] = useState(String(gen.defaultDeliveryFee || 4500));
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(String(gen.freeDeliveryThreshold || 500000));
  const [announcementText, setAnnouncementText] = useState(gen.announcementText || "⚡ FAST NATIONWIDE DELIVERY VIA GIG LOGISTICS • INSPECT BEFORE PAYMENT ON DELIVERY");
  const [announcementLink, setAnnouncementLink] = useState(gen.announcementLink || "/shop");
  const [announcementEnabled, setAnnouncementEnabled] = useState(gen.announcementEnabled !== undefined ? gen.announcementEnabled : true);

  // Showrooms
  const branches = initialSettings.branches || [
    {
      id: "azikiwe",
      name: "Flagship Showroom (Azikiwe Road)",
      address: "111/113 Azikiwe Road, Aba, Abia State",
      phone: "+2348067150130",
      hours: "Mon - Sat: 8:00 AM - 6:00 PM",
    },
    {
      id: "asa_road",
      name: "Town Hall Tech Hub (Asa Road)",
      address: "No. 2 Asa Road (Beside Aba Town Hall), Aba, Abia State",
      phone: "+2348067150130",
      hours: "Mon - Sat: 8:30 AM - 5:30 PM",
    },
  ];
  const [branch1Address, setBranch1Address] = useState(branches[0]?.address || "111/113 Azikiwe Road, Aba, Abia State");
  const [branch1Hours, setBranch1Hours] = useState(branches[0]?.hours || "Mon - Sat: 8:00 AM - 6:00 PM");
  const [branch2Address, setBranch2Address] = useState(branches[1]?.address || "No. 2 Asa Road (Beside Aba Town Hall), Aba, Abia State");
  const [branch2Hours, setBranch2Hours] = useState(branches[1]?.hours || "Mon - Sat: 8:30 AM - 5:30 PM");

  // Warranty Defaults
  const war = initialSettings.warranty_defaults || {};
  const [refurbishedMonths, setRefurbishedMonths] = useState(String(war.refurbishedMonths || 3));
  const [refurbishedTerms, setRefurbishedTerms] = useState(war.refurbishedTerms || "3-Month Comprehensive GTC Hardware Warranty with free parts & labor");
  const [openBoxMonths, setOpenBoxMonths] = useState(String(war.openBoxMonths || 6));
  const [openBoxTerms, setOpenBoxTerms] = useState(war.openBoxTerms || "6-Month Comprehensive GTC Hardware Warranty with direct replacement coverage");
  const [brandNewMonths, setBrandNewMonths] = useState(String(war.brandNewMonths || 12));
  const [brandNewTerms, setBrandNewTerms] = useState(war.brandNewTerms || "1-Year Official Manufacturer Warranty with authorized service center support");

  // Social Links
  const soc = initialSettings.social_links || {};
  const [facebook, setFacebook] = useState(soc.facebook || "https://www.facebook.com/share/1VKj3gkgd2/?mibextid=wwXIfr");
  const [instagram, setInstagram] = useState(soc.instagram || "https://www.instagram.com/guaranteed_tech/");
  const [whatsapp, setWhatsapp] = useState(soc.whatsapp || "https://wa.me/2348067150130");

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const saveSetting = async (key: string, value: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save settings");
      showToast("success", `Settings [${key}] updated successfully.`);
    } catch (err: any) {
      showToast("error", err.message || "Failed to save settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    saveSetting("general", {
      storeName,
      tagline,
      supportPhone,
      whatsappNumber,
      supportEmail,
      defaultDeliveryFee: parseFloat(defaultDeliveryFee) || 4500,
      freeDeliveryThreshold: parseFloat(freeDeliveryThreshold) || 500000,
      announcementText,
      announcementLink,
      announcementEnabled,
    });
  };

  const handleSaveBranches = (e: React.FormEvent) => {
    e.preventDefault();
    saveSetting("branches", [
      {
        id: "azikiwe",
        name: "Flagship Showroom (Azikiwe Road)",
        address: branch1Address,
        phone: supportPhone,
        hours: branch1Hours,
        isPrimary: true,
      },
      {
        id: "asa_road",
        name: "Town Hall Tech Hub (Asa Road)",
        address: branch2Address,
        phone: supportPhone,
        hours: branch2Hours,
        isPrimary: false,
      },
    ]);
  };

  const handleSaveWarranty = (e: React.FormEvent) => {
    e.preventDefault();
    saveSetting("warranty_defaults", {
      refurbishedMonths: parseInt(refurbishedMonths, 10) || 3,
      refurbishedTerms,
      openBoxMonths: parseInt(openBoxMonths, 10) || 6,
      openBoxTerms,
      brandNewMonths: parseInt(brandNewMonths, 10) || 12,
      brandNewTerms,
    });
  };

  const handleSaveSocial = (e: React.FormEvent) => {
    e.preventDefault();
    saveSetting("social_links", {
      facebook,
      instagram,
      whatsapp,
    });
  };

  return (
    <div className="space-y-6 font-sans">
      {toast && (
        <div
          className={`p-3.5 rounded text-xs flex items-center justify-between gap-2 shadow-xs transition-all ${
            toast.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <span className="font-light">{toast.text}</span>
          <button onClick={() => setToast(null)} className="font-bold text-slate-400">&times;</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 bg-white px-2 pt-2 rounded-t">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs uppercase tracking-wider font-light whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
            activeTab === "general"
              ? "border-[#FFB200] text-slate-900 font-normal bg-amber-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>General &amp; Announcement Bar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("branches")}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs uppercase tracking-wider font-light whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
            activeTab === "branches"
              ? "border-[#FFB200] text-slate-900 font-normal bg-amber-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Physical Showrooms</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("warranty")}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs uppercase tracking-wider font-light whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
            activeTab === "warranty"
              ? "border-[#FFB200] text-slate-900 font-normal bg-amber-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Warranty Policy Defaults</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("social")}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs uppercase tracking-wider font-light whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
            activeTab === "social"
              ? "border-[#FFB200] text-slate-900 font-normal bg-amber-50/50"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Social Media Channels</span>
        </button>
      </div>

      {/* General Settings */}
      {activeTab === "general" && (
        <form onSubmit={handleSaveGeneral} className="bg-white p-6 sm:p-8 rounded-b border border-t-0 border-[#EBEBEB] space-y-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                Business &amp; Store Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-[#FFB200]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                Store Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-[#FFB200]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                Customer Care Phone
              </label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                WhatsApp Hotline
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">
                Official Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800"
              />
            </div>
          </div>

          {/* Announcement Bar Section */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="font-normal uppercase tracking-wider text-slate-800">
              Storefront Top Announcement Bar
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                  Ticker Announcement Message
                </label>
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                  Ticker Destination Link
                </label>
                <input
                  type="text"
                  value={announcementLink}
                  onChange={(e) => setAnnouncementLink(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={announcementEnabled}
                onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                className="rounded border-slate-300 text-[#FFB200]"
              />
              <span>Enable top announcement bar across all public storefront pages</span>
            </label>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 font-normal uppercase tracking-[0.14em] rounded-full flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save General Settings
            </button>
          </div>
        </form>
      )}

      {/* Showrooms */}
      {activeTab === "branches" && (
        <form onSubmit={handleSaveBranches} className="bg-white p-6 sm:p-8 rounded-b border border-t-0 border-[#EBEBEB] space-y-6 text-xs">
          <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-3">
            <h3 className="font-normal uppercase tracking-wider text-slate-800">
              Branch 1: Flagship Showroom (Azikiwe Road)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                  Physical Street Address
                </label>
                <input
                  type="text"
                  value={branch1Address}
                  onChange={(e) => setBranch1Address(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                  Opening Hours
                </label>
                <input
                  type="text"
                  value={branch1Hours}
                  onChange={(e) => setBranch1Hours(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-3">
            <h3 className="font-normal uppercase tracking-wider text-slate-800">
              Branch 2: Town Hall Tech Hub (Asa Road)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                  Physical Street Address
                </label>
                <input
                  type="text"
                  value={branch2Address}
                  onChange={(e) => setBranch2Address(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                  Opening Hours
                </label>
                <input
                  type="text"
                  value={branch2Hours}
                  onChange={(e) => setBranch2Hours(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 font-normal uppercase tracking-[0.14em] rounded-full flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Showrooms
            </button>
          </div>
        </form>
      )}

      {/* Warranty Defaults */}
      {activeTab === "warranty" && (
        <form onSubmit={handleSaveWarranty} className="bg-white p-6 sm:p-8 rounded-b border border-t-0 border-[#EBEBEB] space-y-6 text-xs">
          <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-3">
            <h3 className="font-normal uppercase tracking-wider text-slate-800">
              Refurbished Hardware Warranty Structure
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                  Duration (Months)
                </label>
                <input
                  type="number"
                  value={refurbishedMonths}
                  onChange={(e) => setRefurbishedMonths(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                  Default Coverage Statement
                </label>
                <input
                  type="text"
                  value={refurbishedTerms}
                  onChange={(e) => setRefurbishedTerms(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-3">
            <h3 className="font-normal uppercase tracking-wider text-slate-800">
              Open Box Hardware Warranty Structure
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                  Duration (Months)
                </label>
                <input
                  type="number"
                  value={openBoxMonths}
                  onChange={(e) => setOpenBoxMonths(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                  Default Coverage Statement
                </label>
                <input
                  type="text"
                  value={openBoxTerms}
                  onChange={(e) => setOpenBoxTerms(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-3">
            <h3 className="font-normal uppercase tracking-wider text-slate-800">
              Brand New (Factory Sealed) Warranty Structure
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                  Duration (Months)
                </label>
                <input
                  type="number"
                  value={brandNewMonths}
                  onChange={(e) => setBrandNewMonths(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                  Default Coverage Statement
                </label>
                <input
                  type="text"
                  value={brandNewTerms}
                  onChange={(e) => setBrandNewTerms(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 font-normal uppercase tracking-[0.14em] rounded-full flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Warranty Defaults
            </button>
          </div>
        </form>
      )}

      {/* Social Media */}
      {activeTab === "social" && (
        <form onSubmit={handleSaveSocial} className="bg-white p-6 sm:p-8 rounded-b border border-t-0 border-[#EBEBEB] space-y-6 text-xs">
          <div>
            <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
              Facebook Page URL
            </label>
            <input
              type="url"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
              Instagram Profile URL
            </label>
            <input
              type="url"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
              WhatsApp Direct Chat Link
            </label>
            <input
              type="url"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 font-normal uppercase tracking-[0.14em] rounded-full flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Social Channels
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
