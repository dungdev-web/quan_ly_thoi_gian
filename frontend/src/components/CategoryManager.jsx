import { useState, useEffect } from "react";
import { getCategoriesByUser, createCategory } from "../services/categoryService";
import s from "../styles/category.js"
const PALETTE = [
  { bg: "var(--color-background-info)", text: "var(--color-text-info)", border: "var(--color-border-info)" },
  { bg: "#EAF3DE", text: "#27500A", border: "#97C459" },
  { bg: "#FAEEDA", text: "#633806", border: "#EF9F27" },
  { bg: "#FAECE7", text: "#4A1B0C", border: "#F0997B" },
  { bg: "#FBEAF0", text: "#4B1528", border: "#ED93B1" },
  { bg: "#EEEDFE", text: "#26215C", border: "#AFA9EC" },
  { bg: "#E1F5EE", text: "#04342C", border: "#5DCAA5" },
  { bg: "#F1EFE8", text: "#2C2C2A", border: "#B4B2A9" },
];

const ICONS = ["💼", "📚", "🎯", "🔧", "🌟", "🏃", "🎨", "📊", "💡", "📁"];

const getInitials = (name) =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newlyCreated, setNewlyCreated] = useState(null);

  useEffect(() => {
    getCategoriesByUser()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setFetching(false));
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    try {
      const created = await createCategory(newName.trim());
      setCategories((prev) => [...prev, created]);
      setNewlyCreated(created.id);
      setNewName("");
      setShowForm(false);
      setTimeout(() => setNewlyCreated(null), 2500);
    } catch (err) {
      alert("Không thể tạo danh mục: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const palette = PALETTE[selectedColor];

  return (
    <div  style={s.root}>
      {/* Top bar */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 shadow-2xl">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6" style={s.topbar}>
        <div style={s.topbarLeft}>
          <span className="text-3xl font-bold text-white mb-1" style={s.sectionLabel}>Danh mục</span>
          <div className="text-2xl rounded-[50%]" style={s.countBadge}>{categories.length}</div>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          style={{ ...s.btn, ...(showForm ? s.btnMuted : {}) }}
        >
          {showForm ? "✕ Đóng" : "+ Thêm danh mục"}
        </button>
      </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div style={s.formCard}>
          <div style={s.formRow}>
            <div style={s.formLeft}>
              <p style={s.fieldLabel}>Tên danh mục</p>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="VD: Học tập, Công việc..."
                style={s.input}
                autoFocus
              />
              <p style={{ ...s.fieldLabel, marginTop: 16 }}>Biểu tượng</p>
              <div style={s.iconRow}>
                {ICONS.map((icon, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedIcon(i)}
                    style={{
                      ...s.iconBtn,
                      background: selectedIcon === i
                        ? "var(--color-text-primary)"
                        : "var(--color-background-secondary)",
                      border: `0.5px solid ${selectedIcon === i ? "transparent" : "var(--color-border-secondary)"}`,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{icon}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={s.vDivider} />

            <div style={s.formRight}>
              <p style={s.fieldLabel}>Màu sắc</p>
              <div style={s.colorGrid}>
                {PALETTE.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    style={{
                      ...s.colorSwatch,
                      background: c.bg,
                      border: selectedColor === i
                        ? `2px solid ${c.text}`
                        : `0.5px solid ${c.border}`,
                      transform: selectedColor === i ? "scale(1.15)" : "scale(1)",
                    }}
                  />
                ))}
              </div>

              <p style={{ ...s.fieldLabel, marginTop: 16 }}>Xem trước</p>
              <div style={{
                ...s.previewCard,
                background: palette.bg,
                borderColor: palette.border,
              }}>
                <div style={{
                  ...s.previewAvatar,
                  background: palette.border,
                  color: palette.text,
                }}>
                  {newName ? getInitials(newName) : ICONS[selectedIcon]}
                </div>
                <div>
                  <p style={{ ...s.previewName, color: palette.text }}>
                    {newName || "Tên danh mục"}
                  </p>
                  <p style={{ ...s.previewSub, color: palette.text }}>
                    0 công việc
                  </p>
                </div>
              </div>

              <button
                onClick={handleCreate}
                disabled={loading || !newName.trim()}
                style={{
                  ...s.createBtn,
                  opacity: loading || !newName.trim() ? 0.35 : 1,
                }}
              >
                {loading ? "Đang tạo..." : "Tạo danh mục →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Grid */}
      {fetching ? (
        <div style={s.shimmerGrid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={s.shimmerCard} />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div style={s.emptyWrap}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🗂</div>
          <p style={s.emptyTitle}>Chưa có danh mục nào</p>
          <p style={s.emptySub}>Tạo danh mục để phân loại công việc của bạn</p>
          <button onClick={() => setShowForm(true)} style={s.btn}>
            + Tạo danh mục đầu tiên
          </button>
        </div>
      ) : (
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6" style={s.grid}>
          {categories.map((cat, i) => {
            const c = PALETTE[i % PALETTE.length];
            const icon = ICONS[i % ICONS.length];
            const isNew = cat.id === newlyCreated;
            return (
              <div
                key={cat.id}
                style={{
                  ...s.catCard,
                  background: c.bg,
                  borderColor: isNew ? c.text : c.border,
                  borderWidth: isNew ? 2 : 0.5,
                  transform: isNew ? "translateY(-4px)" : "translateY(0)",
                  transition: "all 0.35s cubic-bezier(.34,1.56,.64,1)",
                }}
              >
                {isNew && (
                  <div style={{ ...s.newBadge, background: c.border, color: c.text }}>
                    Mới
                  </div>
                )}
                <div style={{ ...s.catAvatar, background: c.border }}>
                  <span style={{ fontSize: 22 }}>{icon}</span>
                </div>
                <p style={{ ...s.catName, color: c.text }}>{cat.name}</p>
                <p style={{ ...s.catId, color: c.text }}>#{cat.id}</p>
                <div style={{ ...s.catFooter, borderColor: c.border }}>
                  <span style={{ ...s.catStat, color: c.text }}>0 task</span>
                </div>
              </div>
            );
          })}

          <button onClick={() => setShowForm(true)} style={s.addCard}>
            <span style={s.addCardPlus}>+</span>
            <span style={s.addCardText}>Thêm mới</span>
          </button>
        </div>
      )}
    </div>
  );
}

