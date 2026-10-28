import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X, User, Pencil, Check } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setUserdata } from '../redux/userSlice'

function ProfileModal({ open, onClose, userData }) {
    const dispatch = useDispatch()

    const [editing, setEditing] = useState(false)
    const [name, setName] = useState(userData?.name || '')
    const [saving, setSaving] = useState(false)
    const [imageError, setImageError] = useState(false)

    // Sync profile data whenever modal opens
    useEffect(() => {
        if (open) {
            setName(userData?.name || '')
            setEditing(false)
            setImageError(false)
        }
    }, [open, userData?.name])

    const handleSave = async () => {
        const newName = name.trim()

        if (!newName) {
            return
        }

        // Nothing changed
        if (newName === userData?.name) {
            setEditing(false)
            return
        }

        setSaving(true)

        try {
            // Update Redux for the current session
            dispatch(
                setUserdata({
                    ...userData,
                    name: newName
                })
            )

            setEditing(false)
        } catch (error) {
            console.error('Profile update error:', error)
        } finally {
            setSaving(false)
        }
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                        className="w-full max-w-[360px] bg-[#13151c] border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-5"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-[16px] font-semibold text-slate-100">
                                Profile
                            </h2>

                            <button
                                onClick={onClose}
                                className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center border-none cursor-pointer"
                            >
                                <X
                                    size={15}
                                    className="text-slate-400"
                                />
                            </button>
                        </div>

                        {/* Avatar */}
                        <div className="flex flex-col items-center gap-2">
                            {userData?.avatar && !imageError ? (
                                <img
                                    src={userData.avatar}
                                    onError={() => setImageError(true)}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/25"
                                    alt="Profile"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                    <User
                                        size={24}
                                        className="text-indigo-400"
                                    />
                                </div>
                            )}

                            {userData?.email && (
                                <span className="text-[11.5px] text-slate-500">
                                    {userData.email}
                                </span>
                            )}
                        </div>

                        {/* Name */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11.5px] font-medium text-slate-500 uppercase tracking-wide">
                                Display name
                            </label>

                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={name}
                                    disabled={!editing || saving}
                                    onChange={(e) => setName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSave()
                                        }

                                        if (e.key === 'Escape') {
                                            setName(userData?.name || '')
                                            setEditing(false)
                                        }
                                    }}
                                    className="flex-1 bg-white/[0.04] border border-white/[0.08] disabled:opacity-60 rounded-xl px-3 py-2.5 text-[13.5px] text-slate-200 outline-none focus:border-indigo-500/40 transition-colors duration-150"
                                />

                                <button
                                    onClick={() => {
                                        if (editing) {
                                            handleSave()
                                        } else {
                                            setEditing(true)
                                        }
                                    }}
                                    disabled={saving}
                                    className="w-9 h-9 shrink-0 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center border-none cursor-pointer disabled:opacity-50"
                                >
                                    {editing ? (
                                        <Check
                                            size={15}
                                            className="text-emerald-400"
                                        />
                                    ) : (
                                        <Pencil
                                            size={13.5}
                                            className="text-slate-400"
                                        />
                                    )}
                                </button>
                            </div>

                            {editing && (
                                <p className="text-[10px] text-slate-600 mt-1">
                                    Press Enter to save or Escape to cancel
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11.5px] font-medium text-slate-500 uppercase tracking-wide">
                                Email
                            </label>

                            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-[13.5px] text-slate-400">
                                {userData?.email || 'Not available'}
                            </div>
                        </div>

                        {/* Plan */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[11.5px] font-medium text-slate-500 uppercase tracking-wide">
                                Plan
                            </label>

                            <div className="flex items-center justify-between bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5">
                                <span className="text-[13.5px] text-slate-300 capitalize">
                                    {userData?.plan || 'free'}
                                </span>

                                <span className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-full capitalize">
                                    {userData?.plan || 'free'}
                                </span>
                            </div>
                        </div>

                        {/* Save button */}
                        {editing && (
                            <button
                                onClick={handleSave}
                                disabled={saving || !name.trim()}
                                className="w-full py-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-700 text-white text-sm font-medium border-none cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save changes'}
                            </button>
                        )}

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default ProfileModal