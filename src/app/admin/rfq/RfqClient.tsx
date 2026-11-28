"use client";

import React, { useState } from "react";
import { formatNaira } from "@/lib/currency";
import { Briefcase, Phone, Mail, CheckCircle2, Clock, Trash2, Edit2, FileText, Send } from "lucide-react";

export function RfqClient({ initialRfqs }: { initialRfqs: any[] }) {
  const [rfqs, setRfqs] = useState(initialRfqs);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [editingRfq, setEditingRfq] = useState<any | null>(null);
  const [statusVal, setStatusVal] = useState("NEW");
  const [notesVal, setNotesVal] = useState("");
  const [staffVal, setStaffVal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenEdit = (rfq: any) => {
    setEditingRfq(rfq);
    setStatusVal(rfq.status);
    setNotesVal(rfq.internalNotes || "");
    setStaffVal(rfq.assignedStaff || "");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRfq) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/rfq/${editingRfq.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: statusVal,
          internalNotes: notesVal,
          assignedStaff: staffVal,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Update failed");

      setRfqs((prev) =>
        prev.map((r) => (r.id === editingRfq.id ? { ...r, ...data.rfq } : r))
      );
      showToast("success", `RFQ ${editingRfq.rfqNumber} updated.`);
      setEditingRfq(null);
    } catch (err: any) {
      showToast("error", err.message || "Failed to update RFQ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, rfqNumber: string) => {
    if (!confirm(`Delete ${rfqNumber}?`)) return;

    try {
      const res = await fetch(`/api/admin/rfq/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Delete failed");

      setRfqs((prev) => prev.filter((r) => r.id !== id));
      showToast("success", "RFQ record removed.");
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete RFQ.");
    }
  };

  const filtered = rfqs.filter((r) => {
    if (selectedStatus !== "ALL" && r.status !== selectedStatus) return false;
    return true;
  });

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

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:border-[#FFB200]"
        >
          <option value="ALL">All RFQ Statuses ({rfqs.length})</option>
          <option value="NEW">New Submissions</option>
          <option value="REVIEWING">In Review</option>
          <option value="QUOTATION_SENT">Quotation Sent</option>
          <option value="NEGOTIATING">Negotiating</option>
          <option value="APPROVED">Approved &amp; Contracted</option>
          <option value="COMPLETED">Fulfillment Complete</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded border border-[#EBEBEB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-light uppercase tracking-[0.16em] text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">RFQ Number</th>
                <th className="py-3 px-4">Company &amp; Lead</th>
                <th className="py-3 px-4">Requested Hardware</th>
                <th className="py-3 px-4">Qty &amp; Budget</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-light text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 italic">
                    No corporate procurement RFQs recorded yet.
                  </td>
                </tr>
              ) : (
                filtered.map((rfq) => {
                  const whatsappUrl = `https://wa.me/${rfq.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Hello ${rfq.customerName}, GuaranteedTech Corporate Sales regarding your procurement request (${rfq.rfqNumber}).`
                  )}`;

                  return (
                    <tr key={rfq.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-800 font-normal">
                        {rfq.rfqNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-normal text-slate-800 block">{rfq.companyName}</span>
                        <span className="text-[11px] text-slate-500 block">{rfq.customerName}</span>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                          <span>{rfq.email}</span>
                          <span>•</span>
                          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">
                            WhatsApp
                          </a>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-normal text-slate-700 block">
                          {rfq.requestType.replace(/_/g, " ")}
                        </span>
                        <span className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                          {rfq.requestedItems}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-normal text-slate-800 block">{rfq.quantity} Units</span>
                        <span className="text-[11px] text-slate-500 block">
                          {rfq.targetBudget ? formatNaira(rfq.targetBudget) : "Negotiable"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-light ${
                            rfq.status === "NEW"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : rfq.status === "QUOTATION_SENT"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : rfq.status === "APPROVED" || rfq.status === "COMPLETED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {rfq.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(rfq.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(rfq)}
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition-colors"
                            title="Update Status / Notes"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(rfq.id, rfq.rfqNumber)}
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit RFQ Status Modal */}
      {editingRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-lg border border-slate-200 w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-normal uppercase tracking-wider text-slate-800">
                Update RFQ {editingRfq.rfqNumber}
              </h3>
              <button
                onClick={() => setEditingRfq(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                  Procurement Pipeline Status
                </label>
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800"
                >
                  <option value="NEW">NEW - Newly Received</option>
                  <option value="REVIEWING">REVIEWING - Engineering Analysis</option>
                  <option value="QUOTATION_SENT">QUOTATION_SENT - Proforma Dispatched</option>
                  <option value="NEGOTIATING">NEGOTIATING - Commercial Terms</option>
                  <option value="APPROVED">APPROVED - Purchase Order Issued</option>
                  <option value="COMPLETED">COMPLETED - Hardware Delivered</option>
                  <option value="REJECTED">REJECTED - Declined</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                  Assigned Account Representative
                </label>
                <input
                  type="text"
                  value={staffVal}
                  onChange={(e) => setStaffVal(e.target.value)}
                  placeholder="e.g. Victor (Executive Ops)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                  Internal Operations Notes
                </label>
                <textarea
                  rows={3}
                  value={notesVal}
                  onChange={(e) => setNotesVal(e.target.value)}
                  placeholder="Add notes on unit allocations, pricing negotiations, and payment terms..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingRfq(null)}
                  className="px-4 py-2 border border-slate-200 rounded-full text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 font-normal rounded-full transition-colors cursor-pointer"
                >
                  {isSubmitting ? "Updating..." : "Save RFQ Updates"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
