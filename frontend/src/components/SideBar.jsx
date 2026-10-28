
import React, { useEffect, useState } from "react";
import {
    Coins,
    LogOut,
    Menu,
    MessageSquare,
    PanelLeftIcon,
    PanelRight,
    PenSquare,
    Plus,
    User,
    X,
    Search,
    Library,
    Settings as SettingsIcon,
    Crown
} from "lucide-react";

import { getConversations } from "../features/getConversations";
import { useDispatch, useSelector } from "react-redux";
import {
    addConversation,
    setConversations,
    setSelectedConversation
} from "../redux/conversationSlice";

import { createConversation } from "../features/createConversation";
import logOut from "../features/logOut";
import { setUserdata } from "../redux/userSlice";

import BillingDrawer from "./BillingDrawer";
import UserMenu from "./usermenu";
import ProfileModal from "./Profilemodal";
import PersonalizationModal from "./Personalizationmodal";
import SettingsModal from "./Settingsmodal";
import HelpModal from "./Helpmodal";
import LibraryModal from "./Librarymodal";


function SideBar() {

    // =====================================================
    // BASIC SIDEBAR STATE
    // =====================================================

    const [collapsed, setCollapsed] = useState(false);

    const dispatch = useDispatch();

    const [imageError, setImageError] = useState(false);

    const {
        conversations,
        selectedConversation
    } = useSelector(
        state => state.conversation
    );

    const {
        userData
    } = useSelector(
        state => state.user
    );


    // =====================================================
    // MODAL STATES
    // =====================================================

    const [showBilling, setShowBilling] = useState(false);

    const [mobileOpen, setMobileOpen] = useState(false);

    const [showUserMenu, setShowUserMenu] = useState(false);

    const [showProfile, setShowProfile] = useState(false);

    const [showPersonalization, setShowPersonalization] =
        useState(false);

    const [showSettings, setShowSettings] =
        useState(false);

    const [showHelp, setShowHelp] =
        useState(false);

    const [showLibrary, setShowLibrary] =
        useState(false);


    // =====================================================
    // SEARCH
    // =====================================================

    const [searchOpen, setSearchOpen] =
        useState(false);

    const [searchQuery, setSearchQuery] =
        useState("");


    const visibleConversations =
        searchQuery.trim()
            ? conversations.filter(
                c =>
                    (c.title || "")
                        .toLowerCase()
                        .includes(
                            searchQuery
                                .toLowerCase()
                        )
            )
            : conversations;


    // =====================================================
    // GET CONVERSATIONS
    // =====================================================

    useEffect(() => {

        const getConv = async () => {

            try {

                const data =
                    await getConversations();

                dispatch(
                    setConversations(data)
                );

            } catch (error) {

                console.error(
                    "Failed to load conversations:",
                    error
                );

            }

        };

        getConv();

    }, [userData?._id, dispatch]);


    // =====================================================
    // CREATE NEW CONVERSATION
    // =====================================================

    const handleCreateConversation =
        async () => {

            try {

                const data =
                    await createConversation();

                dispatch(
                    addConversation(data)
                );

                dispatch(
                    setSelectedConversation(
                        data
                    )
                );

            } catch (error) {

                console.error(
                    "Failed to create conversation:",
                    error
                );

            }

        };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        logOut();

        dispatch(
            setUserdata(null)
        );

        setShowUserMenu(false);

    };


    // =====================================================
    // CLOSE ALL ACCOUNT MODALS
    // =====================================================

    const closeAccountMenu = () => {

        setShowUserMenu(false);

    };


    // =====================================================
    // SHARED ACCOUNT OVERLAYS
    //
    // IMPORTANT:
    // These are outside the sidebar layout.
    // Therefore they NEVER push the bottom section
    // or move the sidebar content.
    // =====================================================

    const accountOverlays = (
        <>

            {/* =========================================
                ORIGINAL USER MENU
            ========================================= */}

            <UserMenu
                open={showUserMenu}

                onClose={() =>
                    setShowUserMenu(false)
                }

                userData={userData}

                imageError={imageError}

                onUpgrade={() => {
                    setShowBilling(true);
                    setShowUserMenu(false);
                }}

                onPersonalization={() => {
                    setShowPersonalization(true);
                    setShowUserMenu(false);
                }}

                onProfile={() => {
                    setShowProfile(true);
                    setShowUserMenu(false);
                }}

                onSettings={() => {
                    setShowSettings(true);
                    setShowUserMenu(false);
                }}

                onHelp={() => {
                    setShowHelp(true);
                    setShowUserMenu(false);
                }}

                onLogout={handleLogout}
            />


            {/* =========================================
                BILLING
            ========================================= */}

            <BillingDrawer
                open={showBilling}

                onClose={() =>
                    setShowBilling(false)
                }
            />


            {/* =========================================
                PROFILE
            ========================================= */}

            <ProfileModal
                open={showProfile}

                onClose={() =>
                    setShowProfile(false)
                }

                userData={userData}
            />


            {/* =========================================
                PERSONALIZATION
            ========================================= */}

            <PersonalizationModal
                open={showPersonalization}

                onClose={() =>
                    setShowPersonalization(false)
                }
            />


            {/* =========================================
                SETTINGS
            ========================================= */}

            <SettingsModal
                open={showSettings}

                onClose={() =>
                    setShowSettings(false)
                }

                userData={userData}

                onUpgrade={() => {
                    setShowBilling(true);
                    setShowSettings(false);
                }}
            />


            {/* =========================================
                HELP
            ========================================= */}

            <HelpModal
                open={showHelp}

                onClose={() =>
                    setShowHelp(false)
                }
            />


            {/* =========================================
                LIBRARY
            ========================================= */}

            <LibraryModal
                open={showLibrary}

                onClose={() =>
                    setShowLibrary(false)
                }
            />

        </>
    );


    // =====================================================
    // COLLAPSED SIDEBAR
    // =====================================================

    if (collapsed) {

        return (
            <>

                <div
                    className="
                        hidden
                        lg:flex
                        flex-col
                        items-center
                        w-[56px]
                        h-screen
                        bg-[#0d0f14]
                        border-r
                        border-white/[0.06]
                        py-4
                        gap-1
                        shrink-0
                    "
                >

                    {/* EXPAND SIDEBAR */}

                    <button
                        className="
                            flex
                            items-center
                            justify-center
                            w-9
                            h-9
                            rounded-xl
                            text-slate-500
                            hover:text-slate-200
                            hover:bg-white/[0.05]
                            transition-colors
                            duration-150
                            bg-transparent
                            border-none
                            cursor-pointer
                            mb-1
                        "
                        onClick={() =>
                            setCollapsed(false)
                        }
                    >
                        <PanelRight size={18} />
                    </button>


                    {/* NEW CHAT */}

                    <button
                        className="
                            flex
                            items-center
                            justify-center
                            w-9
                            h-9
                            rounded-xl
                            text-slate-500
                            hover:text-slate-200
                            hover:bg-white/[0.05]
                            transition-colors
                            duration-150
                            bg-transparent
                            border-none
                            cursor-pointer
                        "
                        onClick={() => {
                            dispatch(
                                setSelectedConversation(
                                    null
                                )
                            );
                        }}
                    >
                        <Plus size={17} />
                    </button>


                    {/* CONVERSATIONS */}

                    <div
                        className="
                            flex-1
                            overflow-y-auto
                            px-2.5
                            pb-2
                            [scrollbar-width:none]
                            [&::-webkit-scrollbar]:hidden
                            pt-5
                        "
                    >

                        {conversations.map(
                            (conv, i) => {

                                const isActive =
                                    selectedConversation?._id ==
                                    conv?._id;

                                return (
                                    <div
                                        key={
                                            conv?._id ??
                                            i
                                        }

                                        onClick={() =>
                                            dispatch(
                                                setSelectedConversation(
                                                    conv
                                                )
                                            )
                                        }

                                        className={`
                                            flex
                                            items-center
                                            gap-2.5
                                            cursor-pointer
                                            mb-0.5
                                            px-3
                                            py-2.5
                                            rounded-[10px]
                                            border
                                            transition-colors
                                            duration-150

                                            ${
                                                isActive
                                                    ? "bg-indigo-500/10 border-indigo-500/[0.18]"
                                                    : "bg-transparent border-transparent"
                                            }
                                        `}
                                    >

                                        <div
                                            className={`
                                                flex
                                                items-center
                                                justify-center
                                                shrink-0
                                                w-[20px]
                                                h-[20px]
                                                rounded-lg

                                                ${
                                                    isActive
                                                        ? "bg-indigo-500/15 text-indigo-400"
                                                        : "bg-white/[0.05] text-slate-500"
                                                }
                                            `}
                                        >
                                            <MessageSquare
                                                size={13}
                                            />
                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>


                    {/* COLLAPSED USER BUTTON
                        EXACT SAME BOTTOM POSITION
                    */}

                    <button
                        onClick={() =>
                            userData &&
                            setShowUserMenu(
                                v => !v
                            )
                        }

                        className="
                            relative
                            shrink-0
                            border-none
                            bg-transparent
                            p-0
                            cursor-pointer
                        "
                    >

                        {
                            userData?.avatar &&
                            !imageError

                                ?

                                <img
                                    className="
                                        w-9
                                        h-9
                                        rounded-[10px]
                                        object-cover
                                        border-2
                                        border-indigo-500/25
                                    "
                                    src={
                                        userData.avatar
                                    }
                                    alt="profile"
                                    onError={() =>
                                        setImageError(
                                            true
                                        )
                                    }
                                />

                                :

                                <div
                                    className="
                                        w-9
                                        h-9
                                        rounded-[10px]
                                        bg-white/[0.06]
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >
                                    <User
                                        size={15}
                                        className="text-slate-400"
                                    />
                                </div>
                        }

                    </button>

                </div>


                {accountOverlays}

            </>
        );
    }


    // =====================================================
    // NORMAL SIDEBAR
    // =====================================================

    return (
        <>

            {/* =========================================
                MOBILE OPEN BUTTON
            ========================================= */}

            <button
                className="
                    lg:hidden
                    fixed
                    top-3.5
                    left-4
                    z-50
                    flex
                    items-center
                    justify-center
                    w-8
                    h-8
                    rounded-lg
                    bg-[#0d0f14]
                    border
                    border-white/[0.06]
                    text-slate-400
                    hover:text-slate-200
                    transition-colors
                    duration-150
                    cursor-pointer
                "

                onClick={() =>
                    setMobileOpen(true)
                }
            >
                <Menu size={14} />
            </button>


            {/* MOBILE OVERLAY */}

            {mobileOpen && (

                <div
                    onClick={() =>
                        setMobileOpen(false)
                    }

                    className="
                        lg:hidden
                        fixed
                        inset-0
                        z-40
                        bg-black/50
                        backdrop-blur-sm
                    "
                />

            )}


            {/* =========================================
                SIDEBAR
                IMPORTANT:
                HEIGHT / WIDTH / POSITION UNCHANGED
            ========================================= */}

            <div
                className={`
                    fixed
                    lg:static
                    inset-y-0
                    left-0
                    z-50

                    w-[270px]
                    h-screen
                    shrink-0

                    bg-[#0d0f14]

                    border-r
                    border-white/[0.06]

                    transition-transform
                    duration-250

                    ${
                        mobileOpen
                            ? "translate-x-0"
                            : "-translate-x-full lg:translate-x-0"
                    }
                `}
            >

                <div
                    className="
                        flex
                        flex-col
                        h-full
                    "
                >

                    {/* =================================
                        HEADER
                    ================================= */}

                    <div
                        className="
                            flex
                            items-center
                            gap-2.5
                            px-4
                            py-4
                            border-b
                            border-white/[0.06]
                        "
                    >

                        {/* COLLAPSE */}

                        <div
                            className="
                                hidden
                                lg:flex
                                items-center
                                justify-center
                                w-7
                                h-7
                                rounded-lg
                                text-slate-500
                                hover:text-slate-200
                                hover:bg-white/[0.05]
                                transition-colors
                                duration-150
                                bg-transparent
                                border-none
                                cursor-pointer
                            "

                            onClick={() =>
                                setCollapsed(true)
                            }
                        >
                            <PanelLeftIcon
                                size={17}
                            />
                        </div>


                        {/* MOBILE CLOSE */}

                        <button
                            onClick={() =>
                                setMobileOpen(false)
                            }

                            className="
                                lg:hidden
                                flex
                                items-center
                                justify-center
                                w-7
                                h-7
                                rounded-lg
                                text-slate-500
                                hover:text-slate-200
                                hover:bg-white/[0.05]
                                transition-colors
                                duration-150
                                bg-transparent
                                border-none
                                cursor-pointer
                            "
                        >
                            <X size={16} />
                        </button>


                        {/* LOGO */}

                        <span
                            className="
                                text-[16px]
                                font-semibold
                                text-slate-100
                                tracking-tight
                                flex-1
                            "
                        >
                            NexusAI
                        </span>


                        {/* PLAN */}

                        <span
                            className="
                                text-[10px]
                                font-medium
                                text-indigo-400
                                bg-indigo-500/10
                                border
                                border-indigo-500/20
                                px-2
                                py-0.5
                                rounded-full
                                tracking-wide
                            "
                        >
                            {userData?.plan ||
                                "free"}
                        </span>


                        {/* NEW CHAT ICON */}

                        <button
                            className="
                                flex
                                items-center
                                justify-center
                                w-7
                                h-7
                                rounded-lg
                                text-slate-500
                                hover:text-slate-200
                                hover:bg-white/[0.05]
                                transition-colors
                                duration-150
                                bg-transparent
                                border-none
                                cursor-pointer
                            "

                            onClick={() =>
                                dispatch(
                                    setSelectedConversation(
                                        null
                                    )
                                )
                            }
                        >
                            <PenSquare
                                size={14}
                            />
                        </button>

                    </div>


                    {/* =================================
                        UPGRADED UPPER SECTION
                        
                        ONLY ADDING THIS SECTION.
                        BOTTOM SECTION IS NOT TOUCHED.
                    ================================= */}

                    <div
                        className="
                            px-3
                            pt-4
                            pb-2
                            flex
                            flex-col
                            gap-1
                        "
                    >

                        {/* NEW */}

                        <button
                            className="
                                w-full
                                flex
                                items-center
                                gap-2.5
                                text-[13.5px]
                                font-medium
                                text-white

                                bg-linear-to-br
                                from-indigo-500
                                to-violet-700

                                rounded-xl
                                px-3
                                py-[10px]

                                border-none
                                cursor-pointer

                                hover:opacity-90

                                transition-opacity
                                duration-150
                            "

                            onClick={() => {

                                dispatch(
                                    setSelectedConversation(
                                        null
                                    )
                                );

                                if (mobileOpen) {
                                    setMobileOpen(
                                        false
                                    );
                                }

                            }}
                        >
                            <Plus size={15} />
                            New
                        </button>


                        {/* SEARCH */}

                        <button
                            className="
                                w-full
                                flex
                                items-center
                                gap-2.5
                                text-[13.5px]
                                font-medium
                                text-slate-300
                                rounded-xl
                                px-3
                                py-[9px]
                                border-none
                                bg-transparent
                                cursor-pointer
                                hover:bg-white/[0.05]
                                hover:text-slate-100
                                transition-colors
                                duration-150
                            "

                            onClick={() =>
                                setSearchOpen(
                                    v => !v
                                )
                            }
                        >
                            <Search
                                size={15}
                                className="text-slate-500"
                            />

                            Search chats
                        </button>


                        {/* SEARCH INPUT */}

                        {searchOpen && (

                            <input
                                autoFocus
                                value={
                                    searchQuery
                                }

                                onChange={e =>
                                    setSearchQuery(
                                        e.target.value
                                    )
                                }

                                placeholder="Search by title…"

                                className="
                                    w-full
                                    text-[12.5px]
                                    text-slate-200
                                    bg-white/[0.05]
                                    border
                                    border-white/[0.08]
                                    rounded-lg
                                    px-3
                                    py-2
                                    outline-none
                                    focus:border-indigo-500/40
                                "
                            />

                        )}


                        {/* LIBRARY */}

                        <button
                            className="
                                w-full
                                flex
                                items-center
                                gap-2.5
                                text-[13.5px]
                                font-medium
                                text-slate-300
                                rounded-xl
                                px-3
                                py-[9px]
                                border-none
                                bg-transparent
                                cursor-pointer
                                hover:bg-white/[0.05]
                                hover:text-slate-100
                                transition-colors
                                duration-150
                            "

                            onClick={() =>
                                setShowLibrary(
                                    true
                                )
                            }
                        >
                            <Library
                                size={15}
                                className="text-slate-500"
                            />

                            Library
                        </button>


                        {/* SETTINGS */}

                        <button
                            className="
                                w-full
                                flex
                                items-center
                                gap-2.5
                                text-[13.5px]
                                font-medium
                                text-slate-300
                                rounded-xl
                                px-3
                                py-[9px]
                                border-none
                                bg-transparent
                                cursor-pointer
                                hover:bg-white/[0.05]
                                hover:text-slate-100
                                transition-colors
                                duration-150
                            "

                            onClick={() =>
                                setShowSettings(
                                    true
                                )
                            }
                        >
                            <SettingsIcon
                                size={15}
                                className="text-slate-500"
                            />

                            Customize
                        </button>


                        {/* UPGRADE */}

                        <button
                            className="
                                w-full
                                flex
                                items-center
                                justify-between
                                text-[13.5px]
                                font-medium
                                text-slate-300
                                rounded-xl
                                px-3
                                py-[9px]
                                border-none
                                bg-transparent
                                cursor-pointer
                                hover:bg-white/[0.05]
                                hover:text-slate-100
                                transition-colors
                                duration-150
                            "

                            onClick={() =>
                                setShowcodeing(
                                    true
                                )
                            }
                        >

                            <span
                                className="
                                    flex
                                    items-center
                                    gap-2.5
                                "
                            >
                                <Crown
                                    size={15}
                                    className="text-slate-500"
                                />

                                Code
                            </span>


                            {
                                (
                                    !userData?.plan ||
                                    userData.plan ===
                                    "free"
                                ) && (

                                    <span
                                        className="
                                            text-[10px]
                                            font-medium
                                            text-indigo-300
                                            bg-indigo-500/15
                                            border
                                            border-indigo-500/25
                                            px-2
                                            py-0.5
                                            rounded-full
                                        "
                                    >
                                        Plus
                                    </span>

                                )
                            }

                        </button>

                    </div>


                    {/* =================================
                        RECENTS
                    ================================= */}

                    {
                        conversations.length === 0

                            ?

                            <div
                                className="
                                    px-5
                                    pt-4
                                    pb-1.5
                                    text-[10.5px]
                                    font-semibold
                                    uppercase
                                    tracking-widest
                                    text-slate-600
                                "
                            >
                                No Recent Conversations
                            </div>

                            :

                            <div
                                className="
                                    px-5
                                    pt-4
                                    pb-1.5
                                    text-[10.5px]
                                    font-semibold
                                    uppercase
                                    tracking-widest
                                    text-slate-600
                                "
                            >
                                Recents
                            </div>
                    }


                    {/* =================================
                        CONVERSATIONS
                        
                        flex-1 means this takes remaining
                        space and DOES NOT MOVE bottom
                        account section.
                    ================================= */}

                    <div
                        className="
                            flex-1
                            overflow-y-auto
                            px-2.5
                            pb-2
                            [scrollbar-width:none]
                            [&::-webkit-scrollbar]:hidden
                        "
                    >

                        {
                            visibleConversations?.map(
                                (conv, i) => {

                                    const isActive =
                                        selectedConversation?._id ==
                                        conv?._id;

                                    return (

                                        <div
                                            key={
                                                conv?._id ??
                                                i
                                            }

                                            onClick={() =>
                                                dispatch(
                                                    setSelectedConversation(
                                                        conv
                                                    )
                                                )
                                            }

                                            className={`
                                                flex
                                                items-center
                                                gap-2.5
                                                cursor-pointer
                                                mb-0.5
                                                px-3
                                                py-2.5
                                                rounded-[10px]
                                                border
                                                transition-colors
                                                duration-150

                                                ${
                                                    isActive
                                                        ? "bg-indigo-500/10 border-indigo-500/[0.18]"
                                                        : "bg-transparent border-transparent"
                                                }
                                            `}
                                        >

                                            <div
                                                className={`
                                                    flex
                                                    items-center
                                                    justify-center
                                                    shrink-0
                                                    w-[28px]
                                                    h-[28px]
                                                    rounded-lg
                                                    transition-colors
                                                    duration-150

                                                    ${
                                                        isActive
                                                            ? "bg-indigo-500/15 text-indigo-400"
                                                            : "bg-white/[0.05] text-slate-500"
                                                    }
                                                `}
                                            >
                                                <MessageSquare
                                                    size={13}
                                                />
                                            </div>


                                            <span
                                                className={`
                                                    text-[13px]
                                                    font-medium
                                                    truncate

                                                    ${
                                                        isActive
                                                            ? "text-slate-100"
                                                            : "text-slate-300"
                                                    }
                                                `}
                                            >
                                                {
                                                    conv?.title ||
                                                    "New Chat"
                                                }
                                            </span>

                                        </div>

                                    );
                                }
                            )
                        }

                    </div>


                    {/* =================================
                        BOTTOM USER SECTION
                        
                        IMPORTANT:
                        THIS IS THE ORIGINAL STYLE.
                        DO NOT MOVE IT.
                    ================================= */}

                    <div
                        className="
                            mx-2.5
                            h-px
                            bg-white/[0.06]
                        "
                    />

                    <div
                        className="
                            px-3.5
                            py-3.5
                        "
                    >

                        {
                            userData

                                ?

                                <button
                                    onClick={() =>
                                        setShowUserMenu(
                                            v => !v
                                        )
                                    }

                                    className="
                                        w-full
                                        flex
                                        items-center
                                        gap-2.5
                                        cursor-pointer
                                        rounded-xl
                                        px-3
                                        py-2.5
                                        hover:bg-white/[0.05]
                                        transition-colors
                                        duration-150
                                        border-none
                                        bg-transparent
                                        text-left
                                    "
                                >

                                    {/* AVATAR */}

                                    <div
                                        className="
                                            relative
                                            shrink-0
                                        "
                                    >

                                        {
                                            userData?.avatar &&
                                            !imageError

                                                ?

                                                <img
                                                    className="
                                                        w-9
                                                        h-9
                                                        rounded-[10px]
                                                        object-cover
                                                        border-2
                                                        border-indigo-500/25
                                                    "

                                                    src={
                                                        userData.avatar
                                                    }

                                                    alt="profile"

                                                    onError={() =>
                                                        setImageError(
                                                            true
                                                        )
                                                    }
                                                />

                                                :

                                                <div
                                                    className="
                                                        w-9
                                                        h-9
                                                        rounded-[10px]
                                                        bg-white/[0.06]
                                                        flex
                                                        items-center
                                                        justify-center
                                                    "
                                                >
                                                    <User
                                                        size={15}
                                                        className="text-slate-400"
                                                    />
                                                </div>
                                        }

                                    </div>


                                    {/* USER INFO */}

                                    <div
                                        className="
                                            flex-1
                                            min-w-0
                                        "
                                    >

                                        <p
                                            className="
                                                text-[13.5px]
                                                font-semibold
                                                text-slate-100
                                                truncate
                                            "
                                        >
                                            {
                                                userData?.name ||
                                                "user"
                                            }
                                        </p>


                                        <p
                                            className="
                                                text-[11px]
                                                text-slate-600
                                                mt-px
                                                capitalize
                                            "
                                        >
                                            {
                                                userData?.plan ||
                                                "free"
                                            } plan
                                        </p>

                                    </div>

                                </button>

                                :

                                <button
                                    className="
                                        w-full
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        text-sm
                                        font-medium
                                        text-slate-200
                                        bg-white/[0.05]
                                        border
                                        border-white/[0.08]
                                        rounded-xl
                                        py-[11px]
                                        cursor-pointer
                                        hover:bg-white/[0.08]
                                        transition-colors
                                        duration-150
                                    "
                                >
                                    Login
                                </button>
                        }

                    </div>

                </div>

            </div>


            {/* =========================================
                ALL OVERLAYS
            ========================================= */}

            {accountOverlays}

        </>
    );
}


export default SideBar;