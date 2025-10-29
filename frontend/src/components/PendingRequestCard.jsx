import React, { useState } from "react";
import { motion } from "framer-motion";

export default function PendingRequestCard({
  request,
  onApprove,
  onReject,
}) {
  const [loading, setLoading] = useState(false);
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = async () => {
    setLoading(true);
    try {
      await onApprove(request._id);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    setLoading(true);
    try {
      await onReject(request._id, rejectionReason);
      setShowRejectionForm(false);
      setRejectionReason("");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      className="border border-white/20 rounded-2xl p-6 bg-gradient-to-br from-white/10 to-white/5 hover:bg-white/15 transition-all shadow-xl hover:shadow-2xl"
      whileHover={{ scale: 1.01 }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white">{request.name}</h3>
          <p className="text-sm text-white/60 mt-2">
            Department: <span className="font-medium text-white/80">{request.department}</span>
          </p>
          <p className="text-sm text-white/60 mt-1">
            Email: <span className="font-medium text-white/80">{request.email}</span>
          </p>
        </div>
        <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 px-4 py-1.5 rounded-full text-xs font-semibold">
          PENDING
        </span>
      </div>

      {/* Metadata */}
      <div className="border-t border-white/10 pt-4 mb-5 text-sm text-white/60">
        <p>
          Requested by: <span className="font-medium text-white/80">{request.requestedBy?.username}</span>
        </p>
        <p className="mt-1">On: {formatDate(request.createdAt)}</p>
      </div>

      {/* Rejection Form */}
      {showRejectionForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white/5 border border-red-500/20 p-4 rounded-xl mb-5"
        >
          <label className="block text-sm font-semibold text-white mb-3">
            Rejection Reason
          </label>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Explain why this faculty is being rejected..."
            className="w-full px-4 py-3 border border-white/20 rounded-lg bg-white/5 text-white placeholder-white/40 focus:ring-2 focus:ring-white/40 focus:bg-white/10 transition-all text-sm"
            rows="3"
          />
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleApprove}
          disabled={loading || showRejectionForm}
          className="flex items-center gap-2 px-6 py-3 bg-green-500/20 border border-green-500/40 text-green-300 rounded-xl hover:bg-green-500/30 hover:border-green-500/60 transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <span>✓</span>
          )}
          Approve
        </button>

        {showRejectionForm ? (
          <>
            <button
              onClick={handleReject}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-red-600/30 border border-red-500/60 text-red-300 rounded-xl hover:bg-red-600/40 hover:border-red-500/80 transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <span>⚠</span>
              )}
              Confirm Reject
            </button>
            <button
              onClick={() => {
                setShowRejectionForm(false);
                setRejectionReason("");
              }}
              disabled={loading}
              className="px-6 py-3 bg-white/10 border border-white/20 text-white/80 hover:text-white hover:bg-white/15 rounded-xl transition-all font-semibold text-sm disabled:opacity-50"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowRejectionForm(true)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/20 border border-red-500/40 text-red-300 rounded-xl hover:bg-red-500/30 hover:border-red-500/60 transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>✕</span>
            Reject
          </button>
        )}
      </div>
    </motion.div>
  );
}