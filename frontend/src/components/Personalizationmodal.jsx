import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { X, SlidersHorizontal } from 'lucide-react'

const STORAGE_KEY = "nexusai_custom_instructions"

function PersonalizationModal({ open, onClose }) {
  const [instructions, setInstructions] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (open) {
      setInstructions(localStorage.getItem(STORAGE_KEY) || "")
      setSaved(false)
    }
  }, [open])

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, instructions.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 1600)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur'
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className='w-[420px] bg-[#13151c] border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-4'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className='w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center'>
                  <SlidersHorizontal size={13} className='text-indigo-400' />
                </div>
                <h2 className='text-[16px] font-semibold text-slate-100'>Personalization</h2>
              </div>
              <button
                onClick={onClose}
                className='w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center border-none cursor-pointer'
              >
                <X size={15} className='text-slate-400' />
              </button>
            </div>

            <p className='text-[12.5px] text-slate-500 leading-relaxed'>
              Tell NexusAI anything you'd like it to keep in mind when replying — your tone preference, things you already know, or how detailed you want answers to be.
            </p>

            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Keep answers concise, I prefer code in Python, I'm a beginner..."
              rows={5}
              maxLength={800}
              className='w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-3 text-[13.5px] text-slate-200 placeholder:text-slate-600 outline-none focus:border-indigo-500/40 resize-none leading-relaxed transition-colors duration-150'
            />

            <div className='flex items-center justify-between'>
              <span className='text-[11px] text-slate-600'>{instructions.length}/800</span>
              <button
                onClick={handleSave}
                className='px-4 py-2 rounded-xl text-[13px] font-medium text-white bg-gradient-to-br from-indigo-500 to-violet-700 hover:opacity-90 border-none cursor-pointer transition-opacity duration-150'
              >
                {saved ? "Saved" : "Save"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PersonalizationModal