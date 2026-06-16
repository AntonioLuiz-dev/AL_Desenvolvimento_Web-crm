import { useState, useEffect, useCallback } from "react";
import logoImg from "./assets/AL Desenvolvmento Web (estiloso3).png";

const C = {
  bg: "#070C18", surface: "#0D1525", card: "#111E35", border: "#1A2B4A",
  primary: "#1B5CF6", teal: "#00D4CC", text: "#E8EDF5", muted: "#6B7FA3",
  success: "#22C55E", warning: "#F59E0B", danger: "#EF4444", whatsapp: "#25D366",
};

const STATUS_CONFIG = {
  lead:      { label: "Lead",         color: "#6B7FA3", bg: "#1A2440" },
  proposta:  { label: "Proposta",     color: "#F59E0B", bg: "#2A1F0A" },
  andamento: { label: "Em Andamento", color: "#1B5CF6", bg: "#0A1535" },
  concluido: { label: "Concluído",    color: "#22C55E", bg: "#0A2010" },
  arquivado: { label: "Arquivado",    color: "#6B7FA3", bg: "#151515" },
};

const NICHO_OPTIONS = [
  "Alimentação", "Beleza e Estética", "Saúde", "Educação",
  "Moda e Vestuário", "Festas e Eventos", "Imóveis", "Advocacia",
  "Fitness e Personal", "Tecnologia", "Religioso", "Outro",
];

const EMPTY_FORM = {
  name: "", email: "", phones: [""], city: "",
  nicho: "", status: "lead", value: "", notes: "", instagram: "",
};

const TOKEN_KEY = "al-crm-token";

// ---- Hook responsividade ----
function useIsMobile(bp = 640) {
  const [mobile, setMobile] = useState(() => window.innerWidth < bp);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < bp);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [bp]);
  return mobile;
}

// ---- API ----
function getToken() { return localStorage.getItem(TOKEN_KEY); }

async function api(method, path, body) {
  const res = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    window.location.reload();
    return null;
  }
  return res.json();
}

// ---- Helpers ----
function fmt(v) {
  return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function initials(name) {
  return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

// ---- WhatsApp helpers ----
function cleanPhone(phone) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("55") ? digits : `55${digits}`;
}

function buildWaUrl(phone, message) {
  const p = cleanPhone(phone);
  if (p.length < 12) return null;
  return `https://wa.me/${p}?text=${encodeURIComponent(message)}`;
}

function msgApresentacao(client) {
  const firstName = client.name.split(" ")[0];
  const nichoLine = client.nicho ? `do segmento de *${client.nicho}* ` : "";
  return [
    `Olá, ${firstName}! 👋`,
    ``,
    `Meu nome é Antonio Luiz, da *AL Desenvolvimento Web*. Tenho uma pergunta importante para o seu negócio ${nichoLine}🤔`,
    ``,
    `*Você está perdendo clientes para a concorrência agora mesmo?*`,
    ``,
    `A realidade do mercado digital hoje:`,
    `🔴 97% dos consumidores pesquisam no Google antes de comprar`,
    `🔴 70% escolhem a empresa que aparece primeiro online`,
    `🔴 Sites não profissionais afastam 75% dos visitantes em segundos`,
    ``,
    `_Isso significa que, sem presença digital de qualidade, você entrega seus clientes para a concorrência — de graça — todos os dias._`,
    ``,
    `Mas ainda dá tempo de virar esse jogo! 🎯`,
    ``,
    `Com o site certo, seu negócio vai:`,
    `✅ Aparecer no Google quando seu cliente pesquisar`,
    `✅ Transmitir confiança e profissionalismo 24h por dia`,
    `✅ Receber novos contatos enquanto você foca no que faz de melhor`,
    `✅ Sair na frente da concorrência no digital`,
    ``,
    `*Nossos clientes relatam, em média, 40% mais contatos nos primeiros 90 dias.*`,
    ``,
    `Posso preparar uma *análise gratuita* do potencial online do seu negócio, sem nenhum compromisso?`,
    ``,
    `É só responder aqui! 🚀`,
    ``,
    `_Antonio Luiz | AL Desenvolvimento Web_`,
  ].join("\n");
}

function msgOrcamento(client, service, value, deadline, items) {
  const firstName = client.name.split(" ")[0];
  const itemLines = items
    .split("\n")
    .filter(l => l.trim())
    .map(l => `   • ${l.trim()}`)
    .join("\n");
  return [
    `Olá, ${firstName}! 🚀`,
    ``,
    `Como combinamos, segue a proposta para o seu projeto:`,
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `💼 *PROPOSTA COMERCIAL*`,
    `━━━━━━━━━━━━━━━━━━`,
    ``,
    `📋 *Serviço:* ${service}`,
    `💰 *Investimento:* R$ ${value}`,
    `⏱️ *Prazo de entrega:* ${deadline}`,
    ``,
    `*O que você vai receber:*`,
    itemLines,
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `✅ Suporte pós-entrega incluído`,
    `✅ Garantia de satisfação`,
    `✅ Condições de pagamento facilitadas`,
    ``,
    `⏰ *Validade desta proposta: 7 dias*`,
    ``,
    `Para aprovar e darmos início, é só responder *"APROVADO"* aqui! 💪`,
    ``,
    `Qualquer dúvida, estou à disposição.`,
    ``,
    `_Antonio Luiz | AL Desenvolvimento Web_`,
  ].join("\n");
}

// ---- Componentes base ----

function Avatar({ name, size = 36 }) {
  const palette = ["#1B5CF6", "#00D4CC", "#A855F7", "#F59E0B", "#22C55E"];
  const color = palette[name.charCodeAt(0) % palette.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.33, fontWeight: 700, color: "#fff", flexShrink: 0,
      fontFamily: "'Syne', sans-serif",
    }}>{initials(name)}</div>
  );
}

function Badge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.lead;
  return (
    <span style={{
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30`,
      padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
    }}>{cfg.label}</span>
  );
}

function NichoBadge({ nicho }) {
  if (!nicho) return null;
  return (
    <span style={{
      background: C.teal + "15", color: C.teal, border: `1px solid ${C.teal}30`,
      padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
    }}>{nicho}</span>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
      padding: "18px 20px", display: "flex", flexDirection: "column", gap: 6,
    }}>
      <span style={{ color: C.muted, fontSize: 12, fontWeight: 500 }}>{label}</span>
      <span style={{ color: color || C.text, fontSize: 24, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>{value}</span>
      {sub && <span style={{ color: C.muted, fontSize: 12 }}>{sub}</span>}
    </div>
  );
}

// ---- Tela de Login ----

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    if (!email || !password) { setError("Preencha e-mail e senha."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Erro ao fazer login."); return; }
      localStorage.setItem(TOKEN_KEY, data.token);
      onLogin();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%", background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: 10, padding: "12px 16px", color: C.text, fontSize: 15,
    outline: "none", fontFamily: "'Outfit', sans-serif", boxSizing: "border-box",
  };

  return (
    <div style={{
      background: C.bg, minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 20,
        padding: 40, width: "100%", maxWidth: 400,
      }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <img src={logoImg} alt="AL Desenvolvimento Web" style={{ height: 72, width: "auto", objectFit: "contain", marginBottom: 16 }} />
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: C.text }}>
            AL Desenvolvimento Web
          </h1>
          <p style={{ color: C.muted, fontSize: 14, marginTop: 6 }}>Acesse o seu CRM</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ color: C.muted, fontSize: 12, fontWeight: 500, display: "block", marginBottom: 6 }}>E-mail</label>
            <input style={inputStyle} type="email" placeholder="seu@email.com" value={email}
              onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          <div>
            <label style={{ color: C.muted, fontSize: 12, fontWeight: 500, display: "block", marginBottom: 6 }}>Senha</label>
            <input style={inputStyle} type="password" placeholder="••••••••" value={password}
              onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          {error && (
            <div style={{
              background: C.danger + "15", border: `1px solid ${C.danger}30`,
              borderRadius: 8, padding: "10px 14px", color: C.danger, fontSize: 13,
            }}>{error}</div>
          )}
          <button onClick={handleLogin} disabled={loading} style={{
            background: loading ? C.border : `linear-gradient(135deg, ${C.primary}, ${C.teal})`,
            border: "none", color: "#fff", padding: "14px", borderRadius: 10,
            cursor: loading ? "not-allowed" : "pointer", fontSize: 15, fontWeight: 600,
            fontFamily: "'Syne', sans-serif", marginTop: 4,
          }}>{loading ? "Entrando..." : "Entrar"}</button>
        </div>
      </div>
    </div>
  );
}

// ---- Modal de Cadastro ----

function Modal({ client, onClose, onSave }) {
  const isMobile = useIsMobile();
  const [form, setForm] = useState(() => {
    if (!client) return { ...EMPTY_FORM };
    const phones = client.phones?.length ? client.phones
      : client.phone ? [client.phone] : [""];
    return { ...client, phones };
  });
  const [saving, setSaving] = useState(false);

  function set(k, v) { setForm(p => ({ ...p, [k]: v })); }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    await onSave({ ...form, value: parseFloat(form.value) || 0 });
    setSaving(false);
    onClose();
  }

  const inp = {
    width: "100%", background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: 8, padding: "10px 14px", color: C.text, fontSize: 14,
    outline: "none", boxSizing: "border-box", fontFamily: "'Outfit', sans-serif",
  };
  const lbl = { color: C.muted, fontSize: 12, marginBottom: 4, display: "block", fontWeight: 500 };

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "#00000099", display: "flex",
        alignItems: isMobile ? "flex-end" : "center", justifyContent: "center",
        zIndex: 1000, padding: isMobile ? 0 : 20,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: isMobile ? "20px 20px 0 0" : 16,
        width: "100%", maxWidth: isMobile ? "100%" : 520,
        maxHeight: isMobile ? "94vh" : "90vh", overflowY: "auto",
        padding: isMobile ? "8px 16px 24px" : 28,
      }}>
        {isMobile && (
          <div style={{ width: 40, height: 4, background: C.border, borderRadius: 2, margin: "12px auto 20px" }} />
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ color: C.text, fontSize: 18, fontFamily: "'Syne', sans-serif", margin: 0 }}>
            {client ? "Editar Cliente" : "Novo Cliente"}
          </h2>
          {!isMobile && (
            <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20 }}>✕</button>
          )}
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
            <div>
              <label style={lbl}>Nome *</label>
              <input style={inp} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Nome do cliente" />
            </div>
            <div>
              <label style={lbl}>Cidade</label>
              <input style={inp} value={form.city} onChange={e => set("city", e.target.value)} placeholder="Magé, RJ" />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
            <div>
              <label style={lbl}>E-mail</label>
              <input style={inp} value={form.email} onChange={e => set("email", e.target.value)} placeholder="email@exemplo.com" />
            </div>
            <div>
              <label style={lbl}>Telefone(s)</label>
              {form.phones.map((ph, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: i < form.phones.length - 1 ? 6 : 0 }}>
                  <input
                    style={{ ...inp, flex: 1 }}
                    value={ph}
                    onChange={e => {
                      const updated = [...form.phones];
                      updated[i] = e.target.value;
                      set("phones", updated);
                    }}
                    placeholder="(21) 99999-0000"
                  />
                  {form.phones.length > 1 && (
                    <button type="button"
                      onClick={() => set("phones", form.phones.filter((_, j) => j !== i))}
                      style={{
                        background: C.danger + "15", border: `1px solid ${C.danger}30`,
                        color: C.danger, borderRadius: 8, cursor: "pointer", fontSize: 16,
                        padding: "0 10px", flexShrink: 0,
                      }}>−</button>
                  )}
                </div>
              ))}
              <button type="button"
                onClick={() => set("phones", [...form.phones, ""])}
                style={{
                  background: "none", border: `1px dashed ${C.border}`, color: C.muted,
                  borderRadius: 8, cursor: "pointer", fontSize: 12, padding: "5px 10px",
                  marginTop: 6, width: "100%",
                }}>+ telefone</button>
            </div>
          </div>

          <div>
            <label style={lbl}>Instagram</label>
            <input style={inp} value={form.instagram || ""} onChange={e => set("instagram", e.target.value)} placeholder="@usuario" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <label style={lbl}>Nicho</label>
              <select style={inp} value={form.nicho} onChange={e => set("nicho", e.target.value)}>
                <option value="">Selecionar...</option>
                {NICHO_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Status</label>
              <select style={inp} value={form.status} onChange={e => set("status", e.target.value)}>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div style={isMobile ? { gridColumn: "1 / -1" } : {}}>
              <label style={lbl}>Valor (R$)</label>
              <input style={inp} type="number" value={form.value} onChange={e => set("value", e.target.value)} placeholder="0" />
            </div>
          </div>

          <div>
            <label style={lbl}>Observações</label>
            <textarea
              style={{ ...inp, minHeight: 80, resize: "vertical" }}
              value={form.notes || ""}
              onChange={e => set("notes", e.target.value)}
              placeholder="Detalhes do projeto, preferências, histórico..."
            />
          </div>
        </div>

        <div style={{
          display: "flex", gap: 10, marginTop: 20,
          justifyContent: isMobile ? "stretch" : "flex-end",
          flexDirection: isMobile ? "column-reverse" : "row",
        }}>
          <button onClick={onClose} style={{
            background: "none", border: `1px solid ${C.border}`, color: C.muted,
            padding: "12px 20px", borderRadius: 8, cursor: "pointer", fontSize: 14,
          }}>Cancelar</button>
          <button onClick={handleSave} disabled={saving} style={{
            background: saving ? C.border : C.primary,
            border: "none", color: "#fff", padding: "12px 24px",
            borderRadius: 8, cursor: saving ? "not-allowed" : "pointer",
            fontSize: 14, fontWeight: 600,
          }}>{saving ? "Salvando..." : "Salvar"}</button>
        </div>
      </div>
    </div>
  );
}

// ---- Modal WhatsApp ----

function WhatsAppModal({ client, onClose }) {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState("apresentacao");
  const [phoneIdx, setPhoneIdx] = useState(0);
  const [service, setService] = useState("");
  const [value, setValue] = useState(client.value > 0 ? String(client.value) : "");
  const [deadline, setDeadline] = useState("15 dias úteis");
  const [items, setItems] = useState(
    "Site profissional responsivo\nDomínio e hospedagem no 1° ano\nSEO básico configurado\nSuport técnico por 30 dias"
  );

  const phones = (client.phones?.length ? client.phones : client.phone ? [client.phone] : []).filter(Boolean);
  const message = tab === "apresentacao"
    ? msgApresentacao(client)
    : msgOrcamento(client, service, value, deadline, items);
  const selectedPhone = phones[phoneIdx] || "";
  const waUrl = buildWaUrl(selectedPhone, message);

  const inp = {
    width: "100%", background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: 8, padding: "10px 14px", color: C.text, fontSize: 14,
    outline: "none", boxSizing: "border-box", fontFamily: "'Outfit', sans-serif",
  };
  const lbl = { color: C.muted, fontSize: 12, fontWeight: 500, display: "block", marginBottom: 4 };

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "#00000099", display: "flex",
        alignItems: isMobile ? "flex-end" : "center", justifyContent: "center",
        zIndex: 1100, padding: isMobile ? 0 : 20,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: isMobile ? "20px 20px 0 0" : 16,
        width: "100%", maxWidth: isMobile ? "100%" : 560,
        maxHeight: isMobile ? "94vh" : "90vh", overflowY: "auto",
        padding: isMobile ? "8px 16px 24px" : 28,
      }}>
        {isMobile && (
          <div style={{ width: 40, height: 4, background: C.border, borderRadius: 2, margin: "12px auto 20px" }} />
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ color: C.text, fontSize: 18, fontFamily: "'Syne', sans-serif", margin: 0 }}>
            📲 WhatsApp — {client.name.split(" ")[0]}
          </h2>
          {!isMobile && (
            <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20 }}>✕</button>
          )}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[
            { id: "apresentacao", label: "✨ Apresentação" },
            { id: "orcamento",    label: "💼 Orçamento" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1,
              background: tab === t.id ? C.whatsapp + "20" : "none",
              border: `1px solid ${tab === t.id ? C.whatsapp + "60" : C.border}`,
              color: tab === t.id ? C.whatsapp : C.muted,
              padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
            }}>{t.label}</button>
          ))}
        </div>

        {tab === "orcamento" && (
          <div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={lbl}>Serviço</label>
              <input style={inp} value={service} onChange={e => setService(e.target.value)}
                placeholder="Ex: Site institucional responsivo" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
              <div>
                <label style={lbl}>Valor (ex: 1.500,00)</label>
                <input style={inp} value={value} onChange={e => setValue(e.target.value)} placeholder="1.500,00" />
              </div>
              <div>
                <label style={lbl}>Prazo</label>
                <input style={inp} value={deadline} onChange={e => setDeadline(e.target.value)} placeholder="15 dias úteis" />
              </div>
            </div>
            <div>
              <label style={lbl}>O que está incluso (uma por linha)</label>
              <textarea style={{ ...inp, minHeight: 80, resize: "vertical" }}
                value={items} onChange={e => setItems(e.target.value)} />
            </div>
          </div>
        )}

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, marginBottom: 16 }}>
          <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
            Prévia da mensagem
          </div>
          <pre style={{
            color: C.text, fontSize: 12, lineHeight: 1.65, whiteSpace: "pre-wrap",
            margin: 0, fontFamily: "'Outfit', sans-serif", maxHeight: 220, overflowY: "auto",
          }}>{message}</pre>
        </div>

        {phones.length > 1 && (
          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Enviar para</label>
            <select style={inp} value={phoneIdx} onChange={e => setPhoneIdx(Number(e.target.value))}>
              {phones.map((ph, i) => <option key={i} value={i}>{ph}</option>)}
            </select>
          </div>
        )}

        {phones.length === 1 && (
          <div style={{ marginBottom: 14, color: C.muted, fontSize: 13 }}>
            Enviando para: <strong style={{ color: C.text }}>{phones[0]}</strong>
          </div>
        )}

        {phones.length === 0 && (
          <div style={{
            background: C.warning + "15", border: `1px solid ${C.warning}30`,
            borderRadius: 8, padding: "10px 14px", color: C.warning, fontSize: 13, marginBottom: 16,
          }}>
            ⚠️ Este cliente não tem telefone cadastrado. Edite o cadastro para adicionar.
          </div>
        )}

        <div style={{
          display: "flex", gap: 10,
          justifyContent: isMobile ? "stretch" : "flex-end",
          flexDirection: isMobile ? "column-reverse" : "row",
        }}>
          <button onClick={onClose} style={{
            background: "none", border: `1px solid ${C.border}`, color: C.muted,
            padding: "12px 20px", borderRadius: 8, cursor: "pointer", fontSize: 14,
          }}>Cancelar</button>
          {waUrl ? (
            <a href={waUrl} target="_blank" rel="noreferrer" onClick={onClose} style={{
              background: `linear-gradient(135deg, ${C.whatsapp}, #128C7E)`,
              border: "none", color: "#fff", padding: "12px 24px", borderRadius: 8,
              fontSize: 14, fontWeight: 600, textDecoration: "none",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>📲 Abrir WhatsApp</a>
          ) : (
            <button disabled style={{
              background: C.border, border: "none", color: C.muted,
              padding: "12px 24px", borderRadius: 8, cursor: "not-allowed", fontSize: 14, fontWeight: 600,
            }}>Sem telefone</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- Card de Cliente ----

function ClientCard({ client, onEdit, onDelete, onWhatsApp }) {
  const [expanded, setExpanded] = useState(false);
  const phones = (client.phones?.length ? client.phones : client.phone ? [client.phone] : []).filter(Boolean);

  return (
    <div
      style={{
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
        padding: 16, cursor: "pointer", transition: "border-color 0.2s",
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = C.primary + "60"}
      onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
      onClick={() => setExpanded(p => !p)}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <Avatar name={client.name} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <span style={{
              color: C.text, fontWeight: 600, fontSize: 15, fontFamily: "'Syne', sans-serif",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0,
            }}>{client.name}</span>
            <span style={{ color: C.teal, fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", flexShrink: 0 }}>{fmt(client.value)}</span>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
            <Badge status={client.status} />
            <NichoBadge nicho={client.nicho} />
          </div>
          {client.city && <div style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>📍 {client.city}</div>}
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
          {client.email && <div style={{ color: C.muted, fontSize: 13, marginBottom: 6 }}>✉ {client.email}</div>}
          {phones.map((ph, i) => (
            <div key={i} style={{ color: C.muted, fontSize: 13, marginBottom: 6 }}>📞 {ph}</div>
          ))}
          {client.instagram && (
            <div style={{ fontSize: 13, marginBottom: 6 }}>
              <a
                href={`https://instagram.com/${client.instagram.replace(/^@/, "")}`}
                target="_blank" rel="noreferrer"
                style={{ color: C.teal, textDecoration: "none" }}
                onClick={e => e.stopPropagation()}
              >📸 {client.instagram.startsWith("@") ? client.instagram : `@${client.instagram}`}</a>
            </div>
          )}
          {client.notes && (
            <div style={{
              background: C.surface, borderRadius: 8, padding: "10px 12px",
              color: C.muted, fontSize: 13, marginTop: 8, lineHeight: 1.5,
            }}>{client.notes}</div>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            <button onClick={e => { e.stopPropagation(); onEdit(client); }} style={{
              background: C.primary + "20", border: `1px solid ${C.primary}40`,
              color: C.primary, padding: "7px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13,
            }}>✏️ Editar</button>
            <button onClick={e => { e.stopPropagation(); onWhatsApp(client); }} style={{
              background: C.whatsapp + "15", border: `1px solid ${C.whatsapp}40`,
              color: C.whatsapp, padding: "7px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600,
            }}>📲 WhatsApp</button>
            <button onClick={e => { e.stopPropagation(); onDelete(client.id); }} style={{
              background: C.danger + "15", border: `1px solid ${C.danger}30`,
              color: C.danger, padding: "7px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13,
            }}>🗑️ Remover</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Coluna do Pipeline ----

function PipelineColumn({ status, clients, onEdit, onDelete, onWhatsApp }) {
  const cfg = STATUS_CONFIG[status];
  const total = clients.reduce((s, c) => s + (c.value || 0), 0);
  return (
    <div style={{ minWidth: 260, maxWidth: 280, flexShrink: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "0 4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.color }} />
          <span style={{ color: cfg.color, fontWeight: 600, fontSize: 13 }}>{cfg.label}</span>
          <span style={{ background: cfg.bg, color: cfg.color, borderRadius: 20, padding: "1px 8px", fontSize: 11, fontWeight: 700 }}>
            {clients.length}
          </span>
        </div>
        {total > 0 && <span style={{ color: C.muted, fontSize: 12 }}>{fmt(total)}</span>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 80 }}>
        {clients.map(c => (
          <ClientCard key={c.id} client={c} onEdit={onEdit} onDelete={onDelete} onWhatsApp={onWhatsApp} />
        ))}
        {clients.length === 0 && (
          <div style={{
            border: `1px dashed ${C.border}`, borderRadius: 12, padding: 24,
            textAlign: "center", color: C.muted, fontSize: 13,
          }}>Sem clientes</div>
        )}
      </div>
    </div>
  );
}

// ---- App Principal ----

export default function App() {
  const isMobile = useIsMobile();
  const [authed, setAuthed] = useState(!!getToken());
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("dashboard");
  const [modal, setModal] = useState(null);
  const [whatsappClient, setWhatsappClient] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const loadClients = useCallback(async () => {
    setLoading(true);
    const data = await api("GET", "/api/clients");
    if (data) setClients(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) loadClients();
  }, [authed, loadClients]);

  async function handleSave(form) {
    if (form.id) {
      await api("PUT", "/api/clients", form);
      setClients(prev => prev.map(c => c.id === form.id ? { ...c, ...form } : c));
    } else {
      const created = await api("POST", "/api/clients", form);
      if (created) setClients(prev => [created, ...prev]);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Remover este cliente?")) return;
    await api("DELETE", `/api/clients?id=${id}`);
    setClients(prev => prev.filter(c => c.id !== id));
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    setAuthed(false);
  }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const filtered = clients.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.city || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === "andamento").length,
    leads: clients.filter(c => c.status === "lead" || c.status === "proposta").length,
    receita: clients.filter(c => c.status === "concluido").reduce((s, c) => s + c.value, 0),
    pipeline: clients.filter(c => !["concluido", "arquivado"].includes(c.status)).reduce((s, c) => s + c.value, 0),
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "◈" },
    { id: "pipeline",  label: "Pipeline",  icon: "⊞" },
    { id: "clientes",  label: "Clientes",  icon: "◉" },
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Outfit', sans-serif", color: C.text }}>

      {/* Header */}
      <div style={{
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        padding: isMobile ? "0 14px" : "0 24px",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        {/* Linha principal */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 12 }}>
            <img src={logoImg} alt="AL Desenvolvimento Web"
              style={{ height: isMobile ? 30 : 36, width: "auto", objectFit: "contain" }} />
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: isMobile ? 13 : 15 }}>
                {isMobile ? "AL Dev Web" : "AL Desenvolvimento Web"}
              </div>
              <div style={{ color: C.muted, fontSize: 10 }}>CRM</div>
            </div>
          </div>

          {!isMobile && (
            <nav style={{ display: "flex", gap: 4 }}>
              {navItems.map(n => (
                <button key={n.id} onClick={() => setView(n.id)} style={{
                  background: view === n.id ? C.primary + "20" : "none",
                  border: view === n.id ? `1px solid ${C.primary}40` : "1px solid transparent",
                  color: view === n.id ? C.primary : C.muted,
                  padding: "6px 14px", borderRadius: 8, cursor: "pointer",
                  fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 6,
                }}>
                  <span>{n.icon}</span>{n.label}
                </button>
              ))}
            </nav>
          )}

          <div style={{ display: "flex", gap: isMobile ? 6 : 10 }}>
            <button onClick={() => setModal({ isNew: true })} style={{
              background: `linear-gradient(135deg, ${C.primary}, ${C.teal})`,
              border: "none", color: "#fff",
              padding: isMobile ? "8px 12px" : "8px 18px",
              borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
              fontFamily: "'Syne', sans-serif",
            }}>{isMobile ? "＋" : "+ Novo Cliente"}</button>
            <button onClick={handleLogout} style={{
              background: "none", border: `1px solid ${C.border}`, color: C.muted,
              padding: "8px 10px", borderRadius: 8, cursor: "pointer", fontSize: 12,
            }}>{isMobile ? "↩" : "Sair"}</button>
          </div>
        </div>

        {/* Nav mobile (segunda linha) */}
        {isMobile && (
          <div style={{ display: "flex", gap: 4, paddingBottom: 8 }}>
            {navItems.map(n => (
              <button key={n.id} onClick={() => setView(n.id)} style={{
                flex: 1,
                background: view === n.id ? C.primary + "20" : "none",
                border: view === n.id ? `1px solid ${C.primary}40` : "1px solid transparent",
                color: view === n.id ? C.primary : C.muted,
                padding: "6px 4px", borderRadius: 8, cursor: "pointer",
                fontSize: 11, fontWeight: 500,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              }}>
                <span style={{ fontSize: 13 }}>{n.icon}</span>
                {n.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div style={{ padding: isMobile ? "14px 12px" : 24, maxWidth: 1400, margin: "0 auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 80, color: C.muted, fontSize: 15 }}>
            Carregando dados...
          </div>
        ) : (
          <>
            {/* DASHBOARD */}
            {view === "dashboard" && (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? 20 : 24, fontWeight: 700 }}>Dashboard</h1>
                  <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Visão geral do negócio</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 20 }}>
                  <StatCard label="Total de Clientes" value={stats.total} />
                  <StatCard label="Em Andamento"      value={stats.active}       color={C.primary} sub="projetos ativos" />
                  <StatCard label="Leads / Propostas" value={stats.leads}        color={C.warning}  sub="a converter" />
                  <StatCard label="Receita Fechada"   value={fmt(stats.receita)} color={C.success} />
                  <StatCard label="Pipeline Aberto"   value={fmt(stats.pipeline)} color={C.teal}    sub="potencial" />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, marginBottom: 16 }}>Clientes por Status</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                        const count = clients.filter(c => c.status === key).length;
                        const pct = clients.length ? (count / clients.length) * 100 : 0;
                        return (
                          <div key={key}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                              <span style={{ color: cfg.color, fontSize: 13, fontWeight: 500 }}>{cfg.label}</span>
                              <span style={{ color: C.muted, fontSize: 13 }}>{count}</span>
                            </div>
                            <div style={{ height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${pct}%`, background: cfg.color, borderRadius: 3, transition: "width 0.5s" }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, marginBottom: 16 }}>Clientes por Nicho</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {Array.from(new Set(clients.map(c => c.nicho).filter(Boolean))).map(nicho => {
                        const group = clients.filter(c => c.nicho === nicho);
                        const revenue = group.reduce((s, c) => s + c.value, 0);
                        const pct = clients.length ? (group.length / clients.length) * 100 : 0;
                        return (
                          <div key={nicho}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                              <span style={{ color: C.teal, fontSize: 13, fontWeight: 500 }}>{nicho}</span>
                              <span style={{ color: C.muted, fontSize: 12 }}>{group.length} · {fmt(revenue)}</span>
                            </div>
                            <div style={{ height: 5, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${pct}%`, background: C.teal, borderRadius: 3, transition: "width 0.5s" }} />
                            </div>
                          </div>
                        );
                      })}
                      {clients.filter(c => c.nicho).length === 0 && (
                        <span style={{ color: C.muted, fontSize: 13 }}>Nenhum nicho cadastrado ainda.</span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, marginTop: 16 }}>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, marginBottom: 14 }}>Clientes Recentes</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[...clients].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")).slice(0, 5).map(c => (
                      <div key={c.id} style={{
                        display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
                        background: C.surface, borderRadius: 10,
                      }}>
                        <Avatar name={c.name} size={32} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                          <div style={{ color: C.muted, fontSize: 12 }}>{c.city}</div>
                        </div>
                        <Badge status={c.status} />
                        <span style={{ color: C.teal, fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" }}>{fmt(c.value)}</span>
                      </div>
                    ))}
                    {clients.length === 0 && (
                      <p style={{ color: C.muted, fontSize: 13 }}>Nenhum cliente cadastrado ainda.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PIPELINE */}
            {view === "pipeline" && (
              <div>
                <div style={{ marginBottom: 20 }}>
                  <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? 20 : 24, fontWeight: 700 }}>Pipeline</h1>
                  <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Acompanhe o avanço de cada cliente</p>
                </div>
                <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 16 }}>
                  {Object.keys(STATUS_CONFIG).map(status => (
                    <PipelineColumn
                      key={status} status={status}
                      clients={clients.filter(c => c.status === status)}
                      onEdit={c => setModal({ client: c })}
                      onDelete={handleDelete}
                      onWhatsApp={setWhatsappClient}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* CLIENTES */}
            {view === "clientes" && (
              <div>
                <div style={{ marginBottom: 14 }}>
                  <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: isMobile ? 20 : 24, fontWeight: 700 }}>Clientes</h1>
                  <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>{filtered.length} de {clients.length} clientes</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr auto", gap: 10, marginBottom: 16 }}>
                  <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar por nome ou cidade..."
                    style={{
                      background: C.card, border: `1px solid ${C.border}`, borderRadius: 8,
                      padding: "10px 14px", color: C.text, fontSize: 13, outline: "none",
                      fontFamily: "'Outfit', sans-serif", width: "100%", boxSizing: "border-box",
                    }}
                  />
                  <select
                    value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    style={{
                      background: C.card, border: `1px solid ${C.border}`, borderRadius: 8,
                      padding: "10px 14px", color: C.text, fontSize: 13, outline: "none",
                      cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    <option value="all">Todos os status</option>
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
                  {filtered.map(c => (
                    <ClientCard key={c.id} client={c}
                      onEdit={cl => setModal({ client: cl })}
                      onDelete={handleDelete}
                      onWhatsApp={setWhatsappClient}
                    />
                  ))}
                  {filtered.length === 0 && (
                    <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 48, color: C.muted }}>
                      Nenhum cliente encontrado.
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {modal && (
        <Modal
          client={modal.client || null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {whatsappClient && (
        <WhatsAppModal
          client={whatsappClient}
          onClose={() => setWhatsappClient(null)}
        />
      )}
    </div>
  );
}
