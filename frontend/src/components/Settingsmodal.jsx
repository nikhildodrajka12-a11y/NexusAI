
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  X,
  Settings,
  Volume2,
  VolumeX,
  Crown,
  Sun,
  Moon,
  Minimize2,
  Maximize2,
  Check,
} from "lucide-react";

const SOUND_KEY = "nexusai_sound_enabled";
const THEME_KEY = "nexusai_theme";
const COMPACT_KEY = "nexusai_compact_mode";

function SettingsModal({ open, onClose, userData, onUpgrade }) {
  const [soundOn, setSoundOn] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [compactMode, setCompactMode] = useState(false);

  // --------------------------------------------------
  // LOAD SAVED SETTINGS
  // --------------------------------------------------

  useEffect(() => {
    if (!open) return;

    const savedSound =
      localStorage.getItem(SOUND_KEY) !== "false";

    const savedTheme =
      localStorage.getItem(THEME_KEY) || "dark";

    const savedCompact =
      localStorage.getItem(COMPACT_KEY) === "true";

    setSoundOn(savedSound);
    setTheme(savedTheme);
    setCompactMode(savedCompact);
  }, [open]);

  // --------------------------------------------------
  // APPLY THEME ON APP LOAD
  // --------------------------------------------------

  useEffect(() => {
    const savedTheme =
      localStorage.getItem(THEME_KEY) || "dark";

    document.documentElement.setAttribute(
      "data-theme",
      savedTheme
    );

    document.documentElement.classList.remove(
      "light",
      "dark"
    );

    document.documentElement.classList.add(savedTheme);
  }, []);

  // --------------------------------------------------
  // SOUND
  // --------------------------------------------------

  const toggleSound = () => {
    const next = !soundOn;

    setSoundOn(next);

    localStorage.setItem(
      SOUND_KEY,
      String(next)
    );

    window.dispatchEvent(
      new CustomEvent("nexusai-settings-change", {
        detail: {
          type: "sound",
          value: next,
        },
      })
    );
  };

  // --------------------------------------------------
  // THEME
  // --------------------------------------------------

  const changeTheme = (newTheme) => {
    setTheme(newTheme);

    localStorage.setItem(
      THEME_KEY,
      newTheme
    );

    // Apply immediately
    document.documentElement.setAttribute(
      "data-theme",
      newTheme
    );

    // Keep compatibility with existing CSS
    document.documentElement.classList.remove(
      "light",
      "dark"
    );

    document.documentElement.classList.add(
      newTheme
    );

    // Notify rest of application
    window.dispatchEvent(
      new CustomEvent("nexusai-settings-change", {
        detail: {
          type: "theme",
          value: newTheme,
        },
      })
    );
  };

  // --------------------------------------------------
  // COMPACT MODE
  // --------------------------------------------------

  const toggleCompactMode = () => {
    const next = !compactMode;

    setCompactMode(next);

    localStorage.setItem(
      COMPACT_KEY,
      String(next)
    );

    document.documentElement.classList.toggle(
      "compact-mode",
      next
    );

    window.dispatchEvent(
      new CustomEvent("nexusai-settings-change", {
        detail: {
          type: "compact",
          value: next,
        },
      })
    );
  };

  // --------------------------------------------------
  // CLOSE WITH ESCAPE
  // --------------------------------------------------

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  // --------------------------------------------------
  // MODAL
  // --------------------------------------------------

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="
            fixed
            inset-0
            z-[60]
            flex
            items-center
            justify-center
            bg-black/60
            backdrop-blur-sm
            px-4
          "
          onClick={onClose}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 10,
              scale: 0.98,
            }}
            transition={{
              duration: 0.18,
            }}
            className="
              w-full
              max-w-[380px]
              max-h-[90vh]
              overflow-y-auto
              bg-[#13151c]
              border
              border-white/[0.08]
              rounded-2xl
              p-6
              flex
              flex-col
              gap-5
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* ======================================
                HEADER
            ====================================== */}

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2">

                <div
                  className="
                    w-7
                    h-7
                    rounded-lg
                    bg-indigo-500/10
                    border
                    border-indigo-500/20
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Settings
                    size={13}
                    className="text-indigo-400"
                  />
                </div>

                <h2 className="text-[16px] font-semibold text-slate-100">
                  Settings
                </h2>

              </div>

              <button
                type="button"
                onClick={onClose}
                className="
                  w-7
                  h-7
                  rounded-lg
                  bg-white/[0.05]
                  hover:bg-white/[0.1]
                  flex
                  items-center
                  justify-center
                  border-none
                  cursor-pointer
                "
                aria-label="Close settings"
              >
                <X
                  size={15}
                  className="text-slate-400"
                />
              </button>

            </div>

            {/* ======================================
                ACCOUNT
            ====================================== */}

            <div className="flex flex-col gap-3">

              <span
                className="
                  text-[11.5px]
                  font-medium
                  text-slate-500
                  uppercase
                  tracking-wide
                "
              >
                Account
              </span>

              <div
                className="
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-white/[0.03]
                  p-3.5
                  flex
                  items-center
                  justify-between
                "
              >

                <div>
                  <p className="text-[13.5px] font-medium text-slate-200">
                    {userData?.name || "User"}
                  </p>

                  <p className="text-[11.5px] text-slate-500 capitalize mt-0.5">
                    {userData?.plan || "free"} plan
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onUpgrade?.();
                    onClose?.();
                  }}
                  className="
                    flex
                    items-center
                    gap-1.5
                    px-3
                    py-1.5
                    rounded-lg
                    text-[12px]
                    font-medium
                    text-indigo-300
                    bg-indigo-500/10
                    border
                    border-indigo-500/20
                    hover:bg-indigo-500/20
                    cursor-pointer
                    transition-colors
                  "
                >
                  <Crown size={12} />
                  Manage
                </button>

              </div>

            </div>

            {/* ======================================
                APPEARANCE
            ====================================== */}

            <div className="flex flex-col gap-3">

              <span
                className="
                  text-[11.5px]
                  font-medium
                  text-slate-500
                  uppercase
                  tracking-wide
                "
              >
                Appearance
              </span>

              <div
                className="
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-white/[0.03]
                  p-1.5
                  flex
                  gap-1
                "
              >

                {/* DARK */}

                <button
                  type="button"
                  onClick={() =>
                    changeTheme("dark")
                  }
                  className={`
                    flex-1
                    flex
                    items-center
                    justify-center
                    gap-2
                    py-2.5
                    rounded-lg
                    border-none
                    cursor-pointer
                    transition-all
                    ${
                      theme === "dark"
                        ? "bg-indigo-500 text-white"
                        : "bg-transparent text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]"
                    }
                  `}
                >
                  <Moon size={14} />

                  <span className="text-[12px] font-medium">
                    Dark
                  </span>

                  {theme === "dark" && (
                    <Check size={12} />
                  )}
                </button>

                {/* LIGHT */}

                <button
                  type="button"
                  onClick={() =>
                    changeTheme("light")
                  }
                  className={`
                    flex-1
                    flex
                    items-center
                    justify-center
                    gap-2
                    py-2.5
                    rounded-lg
                    border-none
                    cursor-pointer
                    transition-all
                    ${
                      theme === "light"
                        ? "bg-indigo-500 text-white"
                        : "bg-transparent text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]"
                    }
                  `}
                >
                  <Sun size={14} />

                  <span className="text-[12px] font-medium">
                    Light
                  </span>

                  {theme === "light" && (
                    <Check size={12} />
                  )}
                </button>

              </div>

            </div>

            {/* ======================================
                PREFERENCES
            ====================================== */}

            <div className="flex flex-col gap-3">

              <span
                className="
                  text-[11.5px]
                  font-medium
                  text-slate-500
                  uppercase
                  tracking-wide
                "
              >
                Preferences
              </span>

              {/* SOUND */}

              <button
                type="button"
                onClick={toggleSound}
                className="
                  w-full
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-white/[0.03]
                  hover:bg-white/[0.05]
                  p-3.5
                  flex
                  items-center
                  justify-between
                  cursor-pointer
                  transition-colors
                "
              >

                <div className="flex items-center gap-2.5">

                  {soundOn ? (
                    <Volume2
                      size={15}
                      className="text-slate-400"
                    />
                  ) : (
                    <VolumeX
                      size={15}
                      className="text-slate-400"
                    />
                  )}

                  <div className="text-left">

                    <span className="block text-[13px] text-slate-300">
                      Sound effects
                    </span>

                    <span className="block text-[10.5px] text-slate-600 mt-0.5">
                      {soundOn
                        ? "Enabled"
                        : "Disabled"}
                    </span>

                  </div>

                </div>

                <div
                  className={`
                    w-9
                    h-5
                    rounded-full
                    relative
                    transition-colors
                    ${
                      soundOn
                        ? "bg-indigo-500"
                        : "bg-white/10"
                    }
                  `}
                >
                  <div
                    className={`
                      absolute
                      top-0.5
                      w-4
                      h-4
                      rounded-full
                      bg-white
                      transition-all
                      ${
                        soundOn
                          ? "left-[18px]"
                          : "left-0.5"
                      }
                    `}
                  />
                </div>

              </button>

              {/* COMPACT MODE */}

              <button
                type="button"
                onClick={toggleCompactMode}
                className="
                  w-full
                  rounded-xl
                  border
                  border-white/[0.08]
                  bg-white/[0.03]
                  hover:bg-white/[0.05]
                  p-3.5
                  flex
                  items-center
                  justify-between
                  cursor-pointer
                  transition-colors
                "
              >

                <div className="flex items-center gap-2.5">

                  {compactMode ? (
                    <Minimize2
                      size={15}
                      className="text-slate-400"
                    />
                  ) : (
                    <Maximize2
                      size={15}
                      className="text-slate-400"
                    />
                  )}

                  <div className="text-left">

                    <span className="block text-[13px] text-slate-300">
                      Compact mode
                    </span>

                    <span className="block text-[10.5px] text-slate-600 mt-0.5">
                      {compactMode
                        ? "Less spacing"
                        : "Normal spacing"}
                    </span>

                  </div>

                </div>

                <div
                  className={`
                    w-9
                    h-5
                    rounded-full
                    relative
                    transition-colors
                    ${
                      compactMode
                        ? "bg-indigo-500"
                        : "bg-white/10"
                    }
                  `}
                >
                  <div
                    className={`
                      absolute
                      top-0.5
                      w-4
                      h-4
                      rounded-full
                      bg-white
                      transition-all
                      ${
                        compactMode
                          ? "left-[18px]"
                          : "left-0.5"
                      }
                    `}
                  />
                </div>

              </button>

            </div>

            {/* ======================================
                FOOTER
            ====================================== */}

            <p className="text-center text-[10px] text-slate-600">
              NexusAI Settings
            </p>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SettingsModal;
