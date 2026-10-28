import React, { useEffect, useState } from 'react'
import { X, Image as ImageIcon, Presentation, FileText, ExternalLink } from 'lucide-react'
import { getConversations } from '../features/getConversations'
import getMessages from '../features/getMessages'

const DOWNLOAD_LINK_RE = /\[Download (?:PPT|PDF)\]\((.*?)\)/

function LibraryModal({ open, onClose }) {
    const [loading, setLoading] = useState(false)
    const [tab, setTab] = useState("files") // "files" | "images"
    const [files, setFiles] = useState([])
    const [images, setImages] = useState([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        if (!open || loaded) return

        const load = async () => {
            setLoading(true)
            try {
                const conversations = await getConversations()

                const allMessages = await Promise.all(
                    (conversations || []).map(async (conv) => {
                        const msgs = await getMessages(conv._id)
                        return (msgs || []).map((m) => ({ ...m, conversationTitle: conv.title || "Untitled chat" }))
                    })
                )

                const flat = allMessages.flat()

                const fileItems = []
                const imageItems = []

                flat.forEach((m) => {
                    if (Array.isArray(m.artifacts)) {
                        m.artifacts
                            .filter((a) => a.type === "ppt" || a.type === "pdf")
                            .forEach((a) => {
                                const linkMatch = m.content?.match(DOWNLOAD_LINK_RE)
                                fileItems.push({
                                    id: a.id,
                                    type: a.type,
                                    title: a.title || "Untitled",
                                    conversationTitle: m.conversationTitle,
                                    createdAt: m.createdAt,
                                    downloadUrl: linkMatch?.[1] || null,
                                })
                            })
                    }

                    if (Array.isArray(m.images)) {
                        m.images.forEach((url, i) => {
                            imageItems.push({
                                id: `${m._id || m.createdAt}-${i}`,
                                url,
                                conversationTitle: m.conversationTitle,
                                createdAt: m.createdAt,
                            })
                        })
                    }
                })

                fileItems.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                imageItems.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))

                setFiles(fileItems)
                setImages(imageItems)
                setLoaded(true)
            } catch (error) {
                console.log("Library load error:", error)
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [open, loaded])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
            <div className="fixed inset-0 bg-black/55" />

            <div
                className="relative w-full max-w-[720px] h-[560px] max-h-[85vh] bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                    <div className="text-white text-[15px] font-semibold">Library</div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center border-none cursor-pointer">
                        <X size={16} className="text-slate-300" />
                    </button>
                </div>

                <div className="flex gap-1 px-5 pt-3">
                    <button
                        onClick={() => setTab("files")}
                        className={`px-3 py-1.5 rounded-lg text-[12.5px] font-medium border-none cursor-pointer transition-colors duration-150 ${tab === "files" ? "bg-indigo-500/15 text-indigo-300" : "bg-transparent text-slate-500 hover:text-slate-300"}`}
                    >
                        Presentations & Docs ({files.length})
                    </button>
                    <button
                        onClick={() => setTab("images")}
                        className={`px-3 py-1.5 rounded-lg text-[12.5px] font-medium border-none cursor-pointer transition-colors duration-150 ${tab === "images" ? "bg-indigo-500/15 text-indigo-300" : "bg-transparent text-slate-500 hover:text-slate-300"}`}
                    >
                        Images ({images.length})
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5">
                    {loading && (
                        <div className="text-slate-500 text-[13px] text-center py-10">Loading your library…</div>
                    )}

                    {!loading && tab === "files" && (
                        files.length === 0 ? (
                            <EmptyState text="No presentations or PDFs generated yet." />
                        ) : (
                            <div className="flex flex-col gap-2">
                                {files.map((f) => (
                                    <div key={f.id} className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                        <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-300 shrink-0">
                                            {f.type === "ppt" ? <Presentation size={16} /> : <FileText size={16} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-medium text-slate-200 truncate">{f.title}</p>
                                            <p className="text-[11px] text-slate-600">{f.conversationTitle}</p>
                                        </div>
                                        {f.downloadUrl ? (
                                            <a
                                                href={f.downloadUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-1 text-[12px] text-indigo-300 hover:text-indigo-200 shrink-0"
                                            >
                                                Open <ExternalLink size={12} />
                                            </a>
                                        ) : (
                                            <span className="text-[11px] text-slate-600 shrink-0">Link expired</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )
                    )}

                    {!loading && tab === "images" && (
                        images.length === 0 ? (
                            <EmptyState text="No images uploaded or generated yet." />
                        ) : (
                            <div className="grid grid-cols-3 gap-3">
                                {images.map((img) => (
                                    <a key={img.id} href={img.url} target="_blank" rel="noreferrer" className="block aspect-square rounded-lg overflow-hidden bg-white/[0.03] border border-white/[0.06]">
                                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                                    </a>
                                ))}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

function EmptyState({ text }) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center gap-2 text-slate-600 py-10">
            <ImageIcon size={26} className="text-slate-700" />
            <p className="text-[12.5px]">{text}</p>
        </div>
    )
}

export default LibraryModal