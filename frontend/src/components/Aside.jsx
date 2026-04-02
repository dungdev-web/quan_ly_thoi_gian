import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../Tempo-removebg-preview.png";
import { logoutUser, checkLogin } from "../services/authService";
import { getCategoriesByUser } from "../services/categoryService";
import { getTodos } from "../services/todoService";

const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/home",
    icon: (color) => (
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    key: "create",
    label: "Create",
    path: "/create",
    badge: "New",
    icon: (color) => (
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    key: "productivity",
    label: "Productivity",
    path: "/productivity",
    icon: (color) => (
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <rect x="2" y="3" width="6" height="18" />
        <rect x="9" y="8" width="6" height="13" />
        <rect x="16" y="13" width="6" height="8" />
      </svg>
    ),
  },
  {
    key: "archived",
    label: "Archived",
    path: "/archived",
    icon: (color) => (
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <polyline points="21 8 21 21 3 21 3 8" />
        <rect x="1" y="3" width="22" height="5" />
      </svg>
    ),
  },
  {
    key: "categories",
    label: "Category",
    path: "/categories",
    icon: (color) => (
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

const CAT_COLORS = [
  "#3B6D11",
  "#185FA5",
  "#993556",
  "#534AB7",
  "#854F0B",
  "#0F6E56",
];
const CAT_BG = [
  "#EAF3DE",
  "#E6F1FB",
  "#FBEAF0",
  "#EEEDFE",
  "#FAEEDA",
  "#E1F5EE",
];

const STATUS_LABEL = {
  todo: "Chưa làm",
  inprogress: "Đang làm",
  done: "Hoàn thành",
};
const STATUS_COLOR = { todo: "#aaa", inprogress: "#f5a623", done: "#3B6D11" };

export default function Aside() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [categories, setCategories] = useState([]);
  const [todos, setTodos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = React.useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handler = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setIsCollapsed(true); // auto collapse trên mobile
    };
    window.addEventListener("resize", handler);
    handler();
    return () => window.removeEventListener("resize", handler);
  }, []);
  useEffect(() => {
    checkLogin()
      .then((d) => setUser(d.user))
      .catch(console.error);
    getCategoriesByUser().then(setCategories).catch(console.error);
    getTodos().then(setTodos).catch(console.error);
  }, []);

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isCollapsed) setIsCollapsed(false);
        setTimeout(() => searchRef.current?.focus(), 100);
      }
      if (e.key === "Escape") {
        setSearchQuery("");
        setSearchFocused(false);
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isCollapsed]);

  const searchResults =
    searchQuery.trim().length >= 1
      ? todos
          .filter(
            (t) =>
              t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.description?.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .slice(0, 6)
      : [];

  const showDropdown = searchFocused && searchQuery.trim().length >= 1;

  const handleSelectResult = (todo) => {
    setSearchQuery("");
    setSearchFocused(false);
    navigate("/create", { state: { highlightTodoId: todo.id } });
  };

  const logout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const isActive = (path) => location.pathname === path;

  const todayDone = todos.filter((t) => t.status === "done").length;
  const todayTotal = todos.length;
  const focusHours = Math.floor(
    todos.reduce((acc, t) => acc + (t.estimatedMinutes || 0), 0) / 60,
  );

  const getCatTaskCount = (catId) =>
    todos.filter((t) => t.categoryId === catId).length;
  const getCatDoneCount = (catId) =>
    todos.filter((t) => t.categoryId === catId && t.status === "done").length;

  return (
    <aside
      style={{
        ...s.sidebar,
        ...(isCollapsed ? s.sidebarCollapsed : s.sidebarExpanded),
        ...(isMobile
          ? {
              position: "fixed",
              left: 0,
              top: 0,
              zIndex: 50,
              height: "100vh",
              boxShadow: isCollapsed ? "none" : "4px 0 24px rgba(0,0,0,0.10)",
            }
          : {}),
      }}
    >
      {/* Header */}
      <div style={{ ...s.header, ...(isCollapsed ? s.headerCollapsed : {}) }}>
        {/* Logo — hidden when collapsed */}
        {!isCollapsed && (
          <div style={s.logoRow}>
            <div>
              <img
                src={logo}
                alt="logo"
                style={{ width: 100, height: 50, objectFit: "contain" }}
              />
            </div>
            {/* <div>
              <p style={s.logoName}>Tempo</p>
              <p style={s.logoSub}>Workspace</p>
            </div> */}
          </div>
        )}

        {/* Toggle button — centered when collapsed */}
        <button style={s.toggleBtn} onClick={() => setIsCollapsed((v) => !v)}>
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#999"
            strokeWidth="2.5"
          >
            {isCollapsed ? (
              // Arrow right to expand
              <>
                <line x1="5" y1="6" x2="19" y2="6" />
                <line x1="5" y1="12" x2="19" y2="12" />
                <line x1="5" y1="18" x2="19" y2="18" />
              </>
            ) : (
              // 3 lines to collapse
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div style={s.searchWrap}>
          <div style={{ position: "relative" }}>
            <div
              style={{
                ...s.searchBox,
                borderColor: searchFocused ? "#f5a623" : "#ede9e2",
                boxShadow: searchFocused ? "0 0 0 2px #f5a62322" : "none",
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke={searchFocused ? "#f5a623" : "#ccc"}
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                placeholder="Tìm kiếm task..."
                style={s.searchInput}
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  style={s.searchClear}
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#bbb"
                    strokeWidth="2.5"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              ) : (
                <span style={s.searchKbd}>⌘K</span>
              )}
            </div>

            {/* Dropdown results */}
            {showDropdown && (
              <div style={s.searchDropdown}>
                {searchResults.length === 0 ? (
                  <div style={s.searchEmpty}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ddd"
                      strokeWidth="2"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <span style={{ fontSize: 12, color: "#ccc" }}>
                      Không tìm thấy kết quả
                    </span>
                  </div>
                ) : (
                  <>
                    <p style={s.dropdownLabel}>
                      {searchResults.length} kết quả
                    </p>
                    {searchResults.map((todo) => (
                      <button
                        key={todo.id}
                        onMouseDown={() => handleSelectResult(todo)}
                        style={s.resultItem}
                      >
                        <div
                          style={{
                            ...s.resultDot,
                            background: STATUS_COLOR[todo.status] || "#aaa",
                          }}
                        />
                        <div style={s.resultInfo}>
                          <p style={s.resultTitle}>{todo.title}</p>
                          <p style={s.resultMeta}>
                            <span style={{ color: STATUS_COLOR[todo.status] }}>
                              {STATUS_LABEL[todo.status] || todo.status}
                            </span>
                            {todo.dueDate && (
                              <span style={{ color: "#ccc" }}>
                                {" · "}
                                {new Date(todo.dueDate).toLocaleDateString(
                                  "vi-VN",
                                )}
                              </span>
                            )}
                          </p>
                        </div>
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#ddd"
                          strokeWidth="2"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={s.nav}>
        {!isCollapsed && <p style={s.sectionLabel}>MENU</p>}
        <ul style={s.navList}>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => navigate(item.path)}
                  style={{
                    ...s.navBtn,
                    ...(active ? s.navBtnActive : {}),
                    justifyContent: isCollapsed ? "center" : "flex-start",
                  }}
                  title={isCollapsed ? item.label : ""}
                >
                  <div
                    style={{ ...s.navIcon, ...(active ? s.navIconActive : {}) }}
                  >
                    {item.icon(active ? "#fff" : "#aaa")}
                  </div>
                  {!isCollapsed && (
                    <>
                      <span
                        style={{
                          ...s.navLabel,
                          ...(active ? s.navLabelActive : {}),
                        }}
                      >
                        {item.label}
                      </span>
                      {item.badge && !active && (
                        <span style={s.badge}>{item.badge}</span>
                      )}
                      {active && item.key === "categories" && (
                        <span style={s.activeBadge}>{categories.length}</span>
                      )}
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Categories list */}
        {!isCollapsed && categories.length > 0 && (
          <>
            <div style={s.catHeader}>
              <p style={s.sectionLabel}>DANH MỤC</p>
              <button
                style={s.addCatBtn}
                onClick={() => navigate("/categories")}
                title="Thêm danh mục"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#bbb"
                  strokeWidth="2.5"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
            <ul style={{ ...s.navList, marginBottom: 12 }}>
              {categories.slice(0, 5).map((cat, i) => {
                const color = CAT_COLORS[i % CAT_COLORS.length];
                const bg = CAT_BG[i % CAT_BG.length];
                const total = getCatTaskCount(cat.id);
                const done = getCatDoneCount(cat.id);
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => navigate("/categories")}
                      style={s.catBtn}
                    >
                      <div style={{ ...s.catDot, background: color }} />
                      <span style={s.catLabel}>{cat.name}</span>
                      <div style={s.catRight}>
                        <div style={{ ...s.catBar, background: bg }}>
                          <div
                            style={{
                              ...s.catBarFill,
                              width: `${pct}%`,
                              background: color,
                            }}
                          />
                        </div>
                        <span style={s.catCount}>{total}</span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {/* Stats mini card */}
        {!isCollapsed && (
          <div style={s.statsCard}>
            <p style={s.sectionLabel}>HÔM NAY</p>
            <div style={s.statsRow}>
              <div style={s.statItem}>
                <p style={s.statNum}>{todayTotal}</p>
                <p style={s.statLabel}>Task</p>
              </div>
              <div style={s.statDivider} />
              <div style={s.statItem}>
                <p style={{ ...s.statNum, color: "#f5a623" }}>{todayDone}</p>
                <p style={s.statLabel}>Done</p>
              </div>
              <div style={s.statDivider} />
              <div style={s.statItem}>
                <p style={{ ...s.statNum, color: "#3B6D11" }}>{focusHours}h</p>
                <p style={s.statLabel}>Focus</p>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Footer / User */}
      <div style={s.footer}>
        {isCollapsed ? (
          <div style={s.avatarOnly} title={user?.username}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        ) : (
          <div style={s.userCard}>
            <div style={s.userAvatar}>
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div style={s.userInfo}>
              <p style={s.userName}>{user?.username}</p>
              <div style={s.onlineRow}>
                <div style={s.onlineDot} />
                <p style={s.onlineLabel}>Online</p>
              </div>
            </div>
            <button onClick={logout} style={s.logoutBtn} title="Đăng xuất">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ccc"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

const s = {
  sidebar: {
    background: "#ffffff",
    borderRight: "0.5px solid #ede9e2",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    overflow: "hidden",
    transition:
      "width 0.25s cubic-bezier(.4,0,.2,1), min-width 0.25s cubic-bezier(.4,0,.2,1)",
  },
  sidebarExpanded: {
    width: 280,
    minWidth: 240,
  },
  sidebarCollapsed: {
    width: 60,
    minWidth: 60,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 14px 12px",
    borderBottom: "0.5px solid #f0ede8",
    minHeight: 64,
  },
  headerCollapsed: {
    justifyContent: "center",
    padding: "18px 0 12px",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    overflow: "hidden",
  },
  logoMark: {
    width: 30,
    height: 30,
    background: "#f5a623",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoName: {
    margin: 0,
    fontSize: 13,
    fontWeight: 700,
    color: "#111",
    letterSpacing: "-0.3px",
    lineHeight: 1.2,
  },
  logoSub: {
    margin: 0,
    fontSize: 10,
    color: "#bbb",
    letterSpacing: "0.02em",
  },
  toggleBtn: {
    width: 50,
    height: 26,
    borderRadius: 7,
    background: "#f5f4f1",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  },
  searchWrap: {
    padding: "10px 12px",
  },
  searchBox: {
    background: "#f7f6f3",
    borderRadius: 9,
    padding: "0px 10px",
    display: "flex",
    alignItems: "center",
    gap: 7,
    border: "1px solid #ede9e2",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  searchInput: {
    flex: 1,
    border: "none",
    background: "transparent",
    outline: "none",
    fontSize: 12,
    color: "#444",
    fontFamily: "inherit",
    minWidth: 0,
  },
  searchClear: {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: 2,
    borderRadius: 4,
  },
  searchDropdown: {
    position: "absolute",
    top: "calc(100% + 6px)",
    left: 0,
    right: 0,
    background: "#fff",
    border: "0.5px solid #ede9e2",
    borderRadius: 10,
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    zIndex: 100,
    overflow: "hidden",
    padding: "6px 0",
  },
  dropdownLabel: {
    margin: 0,
    padding: "2px 12px 6px",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "#ccc",
  },
  searchEmpty: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px",
    justifyContent: "center",
  },
  resultItem: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 9,
    padding: "8px 12px",
    background: "none",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    transition: "background 0.1s",
  },
  resultDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
  },
  resultInfo: {
    flex: 1,
    minWidth: 0,
  },
  resultTitle: {
    margin: 0,
    fontSize: 12,
    fontWeight: 600,
    color: "#222",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  resultMeta: {
    margin: 0,
    fontSize: 11,
    color: "#aaa",
  },
  searchKbd: {
    fontSize: 10,
    color: "#ddd",
    background: "#eee",
    padding: "1px 5px",
    borderRadius: 4,
  },
  nav: {
    flex: 1,
    padding: "0 8px",
    overflowY: "auto",
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "#ccc",
    margin: "10px 0 5px 6px",
  },
  navList: {
    listStyle: "none",
    margin: "0 0 4px",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
  navBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "7px 8px",
    borderRadius: 8,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    transition: "background 0.15s",
    textAlign: "left",
  },
  navBtnActive: {
    background: "#fff8ee",
    border: "0.5px solid #fde68a",
  },
  navIcon: {
    width: 28,
    height: 28,
    borderRadius: 7,
    background: "#f5f4f1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "background 0.15s",
  },
  navIconActive: {
    background: "#f5a623",
  },
  navLabel: {
    fontSize: 13,
    color: "#888",
    fontWeight: 500,
    flex: 1,
    letterSpacing: "-0.1px",
  },
  navLabelActive: {
    color: "#b45309",
    fontWeight: 700,
  },
  badge: {
    background: "#fef3c7",
    color: "#d97706",
    fontSize: 10,
    fontWeight: 700,
    padding: "1px 6px",
    borderRadius: 20,
  },
  activeBadge: {
    background: "#f5a623",
    color: "#fff",
    fontSize: 10,
    fontWeight: 700,
    padding: "1px 7px",
    borderRadius: 20,
  },
  catHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 6,
  },
  addCatBtn: {
    width: 45,
    height: 18,
    borderRadius: 5,
    background: "#f5f4f1",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    marginBottom: 5,
  },
  catBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 10px",
    borderRadius: 8,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
  },
  catDot: {
    width: 8,
    height: 8,
    borderRadius: 3,
    flexShrink: 0,
  },
  catLabel: {
    fontSize: 12,
    color: "#666",
    flex: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  catRight: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    flexShrink: 0,
  },
  catBar: {
    width: 32,
    height: 3,
    borderRadius: 2,
    overflow: "hidden",
  },
  catBarFill: {
    height: "100%",
    borderRadius: 2,
    transition: "width 0.4s ease",
  },
  catCount: {
    fontSize: 10,
    color: "#bbb",
    fontWeight: 600,
    minWidth: 10,
    textAlign: "right",
  },
  statsCard: {
    margin: "4px 0 10px",
    padding: "10px 12px",
    background: "#f7f6f3",
    borderRadius: 10,
    border: "0.5px solid #ede9e2",
  },
  statsRow: {
    display: "flex",
    gap: 0,
  },
  statItem: {
    flex: 1,
    textAlign: "center",
  },
  statNum: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
    color: "#111",
    letterSpacing: "-0.5px",
    lineHeight: 1.2,
  },
  statLabel: {
    margin: 0,
    fontSize: 10,
    color: "#bbb",
  },
  statDivider: {
    width: 0.5,
    background: "#e8e5df",
    margin: "2px 0",
  },
  footer: {
    padding: "10px 10px 14px",
    borderTop: "0.5px solid #f0ede8",
    display: "flex",
    justifyContent: "center",
  },
  userCard: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    padding: "9px 10px",
    borderRadius: 9,
    background: "#f7f6f3",
    border: "0.5px solid #ede9e2",
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    background: "#f5a623",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    color: "#fff",
    flexShrink: 0,
  },
  avatarOnly: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    background: "#f5a623",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    color: "#fff",
    margin: "0 auto",
    cursor: "pointer",
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    margin: 0,
    fontSize: 12,
    fontWeight: 600,
    color: "#222",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    letterSpacing: "-0.1px",
  },
  onlineRow: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#22c55e",
  },
  onlineLabel: {
    margin: 0,
    fontSize: 10,
    color: "#aaa",
  },
  logoutBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    borderRadius: 6,
    flexShrink: 0,
  },
};
