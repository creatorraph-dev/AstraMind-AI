// =========================
// CONFIG
// =========================
// Hakuna API key inayohitajika! Puter.js ni bure.


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
  document.body.className =
    theme === "light"
      ? "light-theme"
      : "dark-theme";

  localStorage.setItem(THEME_KEY, theme);
  updateThemeIcons();
}

function toggleTheme() {
  const current =
    localStorage.getItem(THEME_KEY) || "dark";

  if (current === "dark") {
    setTheme("light");
  } else {
    setTheme("dark");
  }
}

function updateThemeIcons() {
  const isDark =
    document.body.classList.contains("dark-theme");

  const sun = `
  <circle cx="12" cy="12" r="5"/>
  <line x1="12" y1="1" x2="12" y2="3"/>
  <line x1="12" y1="21" x2="12" y2="23"/>
  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
  <line x1="1" y1="12" x2="3" y2="12"/>
  <line x1="21" y1="12" x2="23" y2="12"/>
  `;

  const moon = `
  <path d="M21 12.79A9 9 0 1 1 11.21 3
  7 7 0 0 0 21 12.79z"/>
  `;

  // opposite icon
  themeIconHome.innerHTML =
    isDark ? sun : moon;

  themeIconChat.innerHTML =
    isDark ? sun : moon;
}

themeToggleHome.addEventListener(
  "click",
  toggleTheme
);

themeToggleChat.addEventListener(
  "click",
  toggleTheme
);


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

backBtnChat.addEventListener(
  "click",
  goHome
);


// =========================
// CHAT HISTORY
// =========================
function saveHistory() {
  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(chats)
  );
}

function createNewChat() {
  currentChat = {
    id: Date.now(),
    title: "AstraMind AI", // Badilishwa kutoka "New Chat" kuwa jina sahihi
    messages: []
  };

  chats.unshift(currentChat);

  saveHistory();
  renderHistory();

  chatMessages.innerHTML = "";
  chatTitle.textContent = "AstraMind AI"; // Badilishwa kutoka "New Chat"

  openChat();
}

function addMessage(sender, text) {
  if (!currentChat) {
    createNewChat();
  }

  const msg = {
    sender,
    text
  };

  currentChat.messages.push(msg);

  if (
    sender === "user" &&
    currentChat.title === "AstraMind AI"
  ) {
    currentChat.title =
      text.slice(0, 35);
  }

  saveHistory();
  renderHistory();
  renderMessages();
}

function renderMessages() {
  if (!currentChat) return;
  chatMessages.innerHTML = "";
  currentChat.messages.forEach(msg => {
    const div = document.createElement("div");
    div.className = `message ${msg.sender}`;
    
    // Kwa ujumbe wa AI, tengeneza aya na mistari
    const formattedText = msg.sender === "ai" ? formatAIMessage(msg.text) : escapeHTML(msg.text);
    
    div.innerHTML = `
      <div class="label">
        ${msg.sender === "user" ? "You" : "AstraMind"}
      </div>
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

// Kazi ya kupanga maandishi ya AI kuwa na aya na mistari
function formatAIMessage(text) {
  // Salama kwanza
  const safe = escapeHTML(text);
  // Gawanya kwa mistari miwili mipya (aya)
  const paragraphs = safe.split(/\n\n+/);
  // Kila aya, geuza mistari mipya kuwa <br>
  const formatted = paragraphs.map(p => {
    // Ondoa nafasi za mwanzoni/mwisho
    p = p.trim();
    if (!p) return '';
    // Badilisha \n moja kuwa <br>
    return `<p>${p.replace(/\n/g, '<br>')}</p>`;
  }).join('');
  return formatted;
}

function renderHistory() {
  historyList.innerHTML = "";

  chats.forEach(chat => {
    const item =
      document.createElement("div");

    item.className =
      "history-item";

    item.textContent =
      chat.title;

    item.onclick = () => {
      currentChat = chat;

      chatTitle.textContent =
        chat.title;

      renderMessages();

      closeHistoryPanel();

      openChat();
    };

    historyList.appendChild(item);
  });
}


// =========================
// SIDEBAR
// =========================
function openHistoryPanel() {
  historySidebar.classList.add(
    "open"
  );

  sidebarOverlay.classList.add(
    "show"
  );
}

function closeHistoryPanel() {
  historySidebar.classList.remove(
    "open"
  );

  sidebarOverlay.classList.remove(
    "show"
  );
}

historyBtnHome.addEventListener(
  "click",
  openHistoryPanel
);

closeSidebar.addEventListener(
  "click",
  closeHistoryPanel
);

sidebarOverlay.addEventListener(
  "click",
  closeHistoryPanel
);


// =========================
// PUTER AI (Bure, Hakuna Kikomo)
// =========================
async function askGemini(prompt) {
  try {
    // Hakikisha Puter.js imepakiwa. Kama haipo, subiri.
    if (!window.puter || !puter.ai) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const response = await puter.ai.chat(prompt, {
      model: "gpt-4o-mini", // Unaweza kubadilisha model (mfano: gpt-4o, claude-sonnet-4, gemini-2.0-flash)
      systemMessage: "You are AstraMind AI, a helpful and friendly assistant. Keep answers clear and simple."
    });

    const text = response.message.content;
    addMessage("ai", text);

  } catch (err) {
    addMessage(
      "ai",
      "Error: " + err.message
    );
  }
}


// =========================
// SEND
// =========================
function sendFromHome() {
  const text =
    userInputHome.value.trim();

  if (!text) return;

  userInputHome.value = "";

  openChat();

  addMessage(
    "user",
    text
  );

  askGemini(text);
}

function sendFromChat() {
  const text =
    userInputChat.value.trim();

  if (!text) return;

  userInputChat.value = "";

  addMessage(
    "user",
    text
  );

  askGemini(text);
}

sendBtnHome.addEventListener(
  "click",
  sendFromHome
);

sendBtnChat.addEventListener(
  "click",
  sendFromChat
);

userInputHome.addEventListener(
  "keypress",
  e => {
    if (e.key === "Enter") {
      sendFromHome();
    }
  }
);

userInputChat.addEventListener(
  "keypress",
  e => {
    if (e.key === "Enter") {
      sendFromChat();
    }
  }
);


// =========================
// NEW CHAT BUTTON
// =========================
newChatBtnChat.addEventListener(
  "click",
  createNewChat
);


// =========================
// CATEGORY BUTTONS
// =========================
document
.querySelectorAll(".cat-btn")
.forEach(btn => {
  btn.onclick = () => {
    userInputHome.value =
      btn.dataset.prefix;

    userInputHome.focus();
  };
});

document
.querySelectorAll(".example-item")
.forEach(item => {
  item.onclick = () => {
    userInputHome.value =
      item.dataset.query;

    sendFromHome();
  };
});


// =========================
// HELPERS
// =========================
function escapeHTML(text) {
  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}


// =========================
// INIT
// =========================
const savedTheme =
  localStorage.getItem(
    THEME_KEY
  ) || "dark";

setTheme(savedTheme);

renderHistory();
