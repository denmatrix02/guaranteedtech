import React from "react";
import prisma from "@/lib/prisma";
import {
  MessageSquare,
  Phone,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.productEnquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-slate-100">
        <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
          Customer Enquiries &amp; Quotation Requests
        </h1>
        <p className="text-xs font-extralight text-slate-400 mt-1">
          Respond to corporate equipment RFQs, hardware availability inquiries, and custom sourcing requests.
        </p>
      </div>

      <div className="bg-white rounded border border-[#EBEBEB] overflow-hidden">
        <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-normal text-slate-800 uppercase tracking-[0.16em]">
            Logged Enquiries ({enquiries.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-light uppercase tracking-[0.16em] text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Message / Requirements</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Direct Response</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-light text-slate-700">
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400 italic font-extralight">
                    No customer enquiries logged yet.
                  </td>
                </tr>
              ) : (
                enquiries.map((enq: any) => {
                  const whatsappReplyUrl = `https://wa.me/${enq.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Hello ${enq.name}, GuaranteedTech customer support following up on your inquiry.`
                  )}`;
                  return (
                    <tr key={enq.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-normal text-slate-800 block">{enq.name}</span>
                        <span className="text-slate-400 text-[10px] block">{enq.phone}</span>
                        <span className="text-slate-500 text-[11px] font-extralight">{enq.email}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-light uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                          {enq.enquiryType}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-sm">
                        <p className="text-slate-600 font-light line-clamp-2 leading-relaxed">
                          {enq.message}
                        </p>
                        {enq.product && (
                          <span className="text-[10px] text-amber-700 font-normal block mt-1">
                            Product: {enq.product.name}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-light uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                          {enq.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 text-[11px] font-extralight">
                        {new Date(enq.createdAt).toLocaleDateString("en-NG")}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={whatsappReplyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-light text-[10px] uppercase tracking-wider rounded-full inline-flex items-center gap-1 transition-colors shadow-xs"
                        >
                          <Phone className="w-3 h-3" /> Reply on WhatsApp
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
