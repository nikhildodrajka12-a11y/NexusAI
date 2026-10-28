import React from 'react'
import { AnimatePresence, motion } from "motion/react"
import { X, HelpCircle, MessageCircleQuestion, Keyboard, Mail } from 'lucide-react'

function HelpModal({ open, onClose }) {

  const faqs = [
    {
      icon: MessageCircleQuestion,
      title: "How do agents work?",
      body: "Pick Auto, Chat, Coding, PDF, PPT, Vision, or Search above the message box to steer how your request is handled."
    },
    {
      icon: Keyboard,
      title: "Keyboard shortcuts",
      body: "Enter sends a message, Shift + Enter adds a new line."
    },
    {
      icon: Mail,
      title: "Still stuck?",
      body: "Reach out to support and we'll get back to you as soon as we can."
    },
  ]

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
            className='w-[380px] bg-[#13151c] border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-5'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className='w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center'>
                  <HelpCircle size={13} className='text-indigo-400' />
                </div>
                <h2 className='text-[16px] font-semibold text-slate-100'>Help</h2>
              </div>
              <button
                onClick={onClose}
                className='w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center border-none cursor-pointer'
              >
                <X size={15} className='text-slate-400' />
              </button>
            </div>

            <div className='flex flex-col gap-3'>
              {faqs.map((f) => (
                <div key={f.title} className='flex gap-3'>
                  <div className='w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0'>
                    <f.icon size={14} className='text-slate-400' />
                  </div>
                  <div>
                    <p className='text-[13px] font-medium text-slate-200'>{f.title}</p>
                    <p className='text-[12px] text-slate-500 leading-relaxed mt-0.5'>{f.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default HelpModal