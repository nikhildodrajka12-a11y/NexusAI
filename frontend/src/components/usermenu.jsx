import React from 'react'
import { AnimatePresence, motion } from "motion/react"
import { Sparkles, SlidersHorizontal, User, Settings, HelpCircle, LogOut, ChevronRight } from 'lucide-react'

function UserMenu({
  open,
  onClose,
  userData,
  imageError,
  onUpgrade,
  onPersonalization,
  onProfile,
  onSettings,
  onHelp,
  onLogout
}) {

  const initials = (userData?.name || "U")
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join("") || "U"

  const items = [
    { key: "upgrade", icon: Sparkles, label: "Upgrade plan", onClick: onUpgrade },
    { key: "personalization", icon: SlidersHorizontal, label: "Personalization", onClick: onPersonalization },
    { key: "profile", icon: User, label: "Profile", onClick: onProfile },
    { key: "settings", icon: Settings, label: "Settings", onClick: onSettings },
  ]

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className='fixed inset-0 z-40' onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className='fixed bottom-20 left-3 z-50 w-72 bg-[#1a1c24] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden'
          >
            <button
              onClick={() => { onProfile(); onClose(); }}
              className='w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.05] transition-colors duration-150 border-none bg-transparent cursor-pointer text-left'
            >
              {(userData?.avatar && !imageError) ? (
                <img
                  src={userData.avatar}
                  className='w-9 h-9 rounded-full object-cover border-2 border-indigo-500/25 shrink-0'
                  alt='avatar'
                />
              ) : (
                <div className='w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[12px] font-semibold text-white shrink-0'>
                  {initials}
                </div>
              )}
              <div className='flex-1 min-w-0'>
                <p className='text-[14px] font-semibold text-slate-100 truncate'>{userData?.name || "User"}</p>
                <p className='text-[11.5px] text-slate-500 capitalize'>{userData?.plan || "free"}</p>
              </div>
              <ChevronRight size={16} className='text-slate-600 shrink-0' />
            </button>

            <div className='h-px bg-white/[0.06] mx-2' />

            <div className='py-1.5'>
              {items.map((item) => (
                <button
                  key={item.key}
                  onClick={() => { item.onClick?.(); onClose(); }}
                  className='w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] text-slate-300 hover:bg-white/[0.05] hover:text-slate-100 transition-colors duration-150 border-none bg-transparent cursor-pointer text-left'
                >
                  <item.icon size={16} className='text-slate-500 shrink-0' />
                  {item.label}
                </button>
              ))}
            </div>

            <div className='h-px bg-white/[0.06] mx-2' />

            <div className='py-1.5'>
              <button
                onClick={() => { onHelp?.(); onClose(); }}
                className='w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] text-slate-300 hover:bg-white/[0.05] hover:text-slate-100 transition-colors duration-150 border-none bg-transparent cursor-pointer text-left'
              >
                <HelpCircle size={16} className='text-slate-500 shrink-0' />
                Help
              </button>
              <button
                onClick={() => { onLogout?.(); onClose(); }}
                className='w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] text-red-400 hover:bg-red-500/10 transition-colors duration-150 border-none bg-transparent cursor-pointer text-left'
              >
                <LogOut size={16} className='shrink-0' />
                Log out
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default UserMenu