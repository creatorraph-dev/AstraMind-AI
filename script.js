// =========================
// POLLINATIONS.AI (Bure, Hakuna Akaunti, Hakuna API Key)
// =========================
const API_URL = "https://text.pollinations.ai/openai";

// =========================
// DOM
// =========================
const homeScreen = document.getElementById("homeScreen");
const chatScreen = document.getElementById("chatScreen");

const userInputHome = document.getElementById("userInputHome");
const sendBtnHome = document.getElementById("sendBtnHome");

const userInputChat = document.getElementById("userInputChat");
const sendBtnChat = document.getElementById("sendBtnChat");

const chatMessages = document.getElementById("chatMessages");
const chatTitle = document.getElementById("chatTitle");

const backBtnChat = document.getElementById("backBtnChat");

const historyBtnHome = document.getElementById("historyBtnHome");
const historySidebar = document.getElementById("historySidebar");
const closeSidebar = document.getElementById("closeSidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const historyList = document.getElementById("historyList");

const themeToggleHome = document.getElementById("themeToggleHome");
const themeToggleChat = document.getElementById("themeToggleChat");
const themeIconHome = document.getElementById("themeIconHome");
const themeIconChat = document.getElementById("themeIconChat");

const newChatBtnChat = document.getElementById("newChatBtnChat");

// =========================
// STORAGE
// =========================
const HISTORY_KEY = "astramind_history";
const THEME_KEY = "astramind_theme";

let chats = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
let currentChat = null;

// =========================
// THEME
// =========================
function setTheme(theme) {
  document.body.className = theme === "light" ? "light-theme" : "dark-theme";
  localStorage.setItem(THEME_KEY, theme);
  updateThemeIcons();
}

function toggleTheme() {
  const current = localStorage.getItem(THEME_KEY) || "dark";
  if (current === "dark") { setTheme("light"); } else { setTheme("dark"); }
}

function updateThemeIcons() {
  const isDark = document.body.classList.contains("dark-theme");
  const sun = `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>`;
  const moon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
  themeIconHome.innerHTML = isDark ? moon : sun;
  themeIconChat.innerHTML = isDark ? moon : sun;
}

themeToggleHome.addEventListener("click", toggleTheme);
themeToggleChat.addEventListener("click", toggleTheme);

// =========================
// NAVIGATION
// =========================
function openChat() {
  homeScreen.style.display = "none";
  chatScreen.classList.add("active");
}
function goHome() {
  chatScreen.classList.remove("active");
  homeScreen.style.display = "";
}
backBtnChat.addEventListener("click", goHome);

// =========================
// CHAT HISTORY
// =========================
function saveHistory() { localStorage.setItem(HISTORY_KEY, JSON.stringify(chats)); }
function createNewChat() {
  currentChat = { id: Date.now(), title: "AstraMind AI", messages: [] };
  chats.unshift(currentChat);
  saveHistory(); renderHistory();
  chatMessages.innerHTML = ""; chatTitle.textContent = "AstraMind AI";
  openChat();
}
function addMessage(sender, text) {
  if (!currentChat) createNewChat();
  currentChat.messages.push({ sender, text });
  if (sender === "user" && currentChat.title === "AstraMind AI") {
    currentChat.title = text.slice(0, 35);
  }
  saveHistory(); renderHistory(); renderMessages();
}
function formatAIMessage(text) {
  const safe = escapeHTML(text);
  const paragraphs = safe.split(/\n\n+/);
  return paragraphs.map(p => { p = p.trim(); return p ? `<p>${p.replace(/\n/g, '<br>')}</p>` : ''; }).join('');
}
function renderMessages() {
  if (!currentChat) return;
  chatMessages.innerHTML = "";
  currentChat.messages.forEach(msg => {
    const div = document.createElement("div");
    div.className = `message ${msg.sender}`;
    const formattedText = msg.sender === "ai" ? formatAIMessage(msg.text) : escapeHTML(msg.text);
    div.innerHTML = `
      <div class="label">${msg.sender === "user" ? "You" : "AstraMind"}</div>
      <div>${formattedText}</div>
      ${msg.sender === "ai" ? `<button class="copy-btn">Copy</button>` : ""}
    `;
    const copy = div.querySelector(".copy-btn");
    if (copy) {
      copy.onclick = () => {
        navigator.clipboard.writeText(msg.text);
        copy.textContent = "Copied";
        setTimeout(() => { copy.textContent = "Copy"; }, 1500);
      };
    }
    chatMessages.appendChild(div);
  });
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function renderHistory() {
  historyList.innerHTML = "";
  chats.forEach(chat => {
    const item = document.createElement("div");
    item.className = "history-item"; item.textContent = chat.title;
    item.onclick = () => {
      currentChat = chat; chatTitle.textContent = chat.title;
      renderMessages(); closeHistoryPanel(); openChat();
    };
    historyList.appendChild(item);
  });
}

// Sidebar
function openHistoryPanel() { historySidebar.classList.add("open"); sidebarOverlay.classList.add("show"); }
function closeHistoryPanel() { historySidebar.classList.remove("open"); sidebarOverlay.classList.remove("show"); }
historyBtnHome.addEventListener("click", openHistoryPanel);
closeSidebar.addEventListener("click", closeHistoryPanel);
sidebarOverlay.addEventListener("click", closeHistoryPanel);

// =========================
// POLLINATIONS.AI (HAKUNA PUTER WALA API KEY)
// =========================
async function askGemini(prompt) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai",
        messages: [
          { role: "system", content: "You are AstraMind AI, a helpful assistant. Keep answers simple." },
          { role: "user", content: prompt }
        ]
      })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const text = data.choices[0].message.content;
    addMessage("ai", text);
  } catch (err) {
    addMessage("ai", "Error: " + err.message);
  }
}

// =========================
// SEND
// =========================
function sendFromHome() {
  const text = userInputHome.value.trim();
  if (!text) return;
  userInputHome.value = "";
  openChat();
  addMessage("user", text);
  askGemini(text);
}
function sendFromChat() {
  const text = userInputChat.value.trim();
  if (!text) return;
  userInputChat.value = "";
  addMessage("user", text);
  askGemini(text);
}

sendBtnHome.addEventListener("click", sendFromHome);
sendBtnChat.addEventListener("click", sendFromChat);
userInputHome.addEventListener("keypress", e => { if (e.key === "Enter") sendFromHome(); });
userInputChat.addEventListener("keypress", e => { if (e.key === "Enter") sendFromChat(); });
newChatBtnChat.addEventListener("click", createNewChat);

// Category & Example
document.querySelectorAll(".cat-btn").forEach(btn => {
  btn.onclick = () => { userInputHome.value = btn.dataset.prefix; userInputHome.focus(); };
});
document.querySelectorAll(".example-item").forEach(item => {
  item.onclick = () => { userInputHome.value = item.dataset.query; sendFromHome(); };
});

// Helper
function escapeHTML(text) { const div = document.createElement("div"); div.textContent = text; return div.innerHTML; }

// Init
const savedTheme = localStorage.getItem(THEME_KEY) || "dark";
setTheme(savedTheme);
renderHistory();
