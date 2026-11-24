// ===== নামের তালিকা =====
// প্রতিটা নাম: [নাম, অর্থ]
const NAMES = {
  bangla: {
    male: [
      ["আরিফ", "জ্ঞানী"], ["সাজ্জাদ", "সিজদাকারী"], ["রাফি", "উচ্চ মর্যাদার"],
      ["তানভীর", "আলোকিত"], ["ফাহিম", "বুদ্ধিমান"], ["নাফিস", "মূল্যবান"],
      ["সাকিব", "উজ্জ্বল তারা"], ["রিয়াদ", "বাগান"], ["ইমরান", "সমৃদ্ধি"],
      ["আদনান", "স্থায়ী বসতি"], ["শাহরিয়ার", "রাজা"], ["নিলয়", "আশ্রয়"],
      ["অর্ণব", "সমুদ্র"], ["আকাশ", "আকাশ"], ["রাহাত", "শান্তি"],
      ["জুবায়ের", "শক্তিশালী"], ["মাহির", "দক্ষ"], ["আয়ান", "আল্লাহর উপহার"],
    ],
    female: [
      ["নুসরাত", "সাহায্য"], ["তাসনিম", "জান্নাতের ঝর্ণা"], ["মাহি", "চাঁদের মতো"],
      ["আনিকা", "রূপবতী"], ["ফারিহা", "আনন্দিত"], ["সুমাইয়া", "উচ্চ মর্যাদার"],
      ["রাইসা", "নেত্রী"], ["নাবিলা", "মহৎ"], ["তানহা", "একাকী তারা"],
      ["ঐশী", "স্বর্গীয়"], ["মেঘলা", "মেঘে ঢাকা"], ["নদী", "নদী"],
      ["অহনা", "প্রথম আলো"], ["জারা", "ভোরের আলো"], ["লামিয়া", "উজ্জ্বল"],
      ["সাদিয়া", "সৌভাগ্যবতী"], ["ইশরাত", "আনন্দ"], ["মারিয়া", "পবিত্র"],
    ],
  },
  english: {
    male: [
      ["Oliver", "olive tree"], ["Liam", "strong-willed warrior"], ["Ethan", "strong, firm"],
      ["Noah", "rest, comfort"], ["Lucas", "bringer of light"], ["Leo", "lion"],
      ["Henry", "ruler of the home"], ["Jack", "God is gracious"], ["Daniel", "God is my judge"],
      ["Samuel", "heard by God"], ["Ryan", "little king"], ["Adam", "of the earth"],
    ],
    female: [
      ["Olivia", "olive tree"], ["Emma", "whole, universal"], ["Sophia", "wisdom"],
      ["Ava", "life"], ["Mia", "beloved"], ["Luna", "moon"],
      ["Grace", "elegance"], ["Chloe", "blooming"], ["Ella", "light"],
      ["Lily", "pure, innocent"], ["Zoe", "life"], ["Hannah", "grace"],
    ],
  },
};

// Fantasy নাম ছোট ছোট অংশ জোড়া লাগিয়ে বানানো হয়
const FANTASY = {
  start: ["Ael", "Bran", "Cael", "Dra", "Eld", "Fen", "Gal", "Hal", "Ith", "Kael", "Lor", "Myr", "Nyx", "Or", "Ryn", "Syl", "Thal", "Vael", "Zar"],
  middle: ["a", "e", "i", "o", "ae", "ia", "or", "en", "an", ""],
  maleEnd: ["dor", "ric", "thas", "gorn", "mir", "vian", "dris", "nar"],
  femaleEnd: ["wen", "riel", "lyn", "ssa", "thea", "via", "na", "ra"],
  titles: ["the Brave", "of the Mist", "Stormborn", "the Wise", "Shadowstep", "of the Silver Leaf", "Flameheart", "the Wanderer"],
};

// ===== দরকারি HTML উপাদান =====
const nameDisplay = document.getElementById("nameDisplay");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const favBtn = document.getElementById("favBtn");
const historyList = document.getElementById("historyList");
const favList = document.getElementById("favList");
const clearFavBtn = document.getElementById("clearFavBtn");
const toast = document.getElementById("toast");

// ===== অবস্থা (state) =====
let language = "bangla";
let gender = "any";
let currentName = null; // { name, meaning }
let history = [];
let favorites = JSON.parse(localStorage.getItem("favNames") || "[]");

// ===== ছোট সাহায্যকারী ফাংশন =====
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function chooseGender() {
  return gender === "any" ? pick(["male", "female"]) : gender;
}

function makeName() {
  const g = chooseGender();

  if (language === "fantasy") {
    const end = g === "male" ? FANTASY.maleEnd : FANTASY.femaleEnd;
    const first = pick(FANTASY.start) + pick(FANTASY.middle) + pick(end);
    return { name: first, meaning: pick(FANTASY.titles), label: "উপাধি" };
  }

  const [name, meaning] = pick(NAMES[language][g]);
  // একই নাম পরপর দুবার না আসে
  if (currentName && currentName.name === name) return makeName();
  return { name, meaning };
}

function showName(item, animate = true) {
  nameDisplay.innerHTML = "";
  const main = document.createElement("div");
  main.className = "name-main" + (animate ? " pop" : "");
  main.textContent = item.name;
  const meaning = document.createElement("div");
  meaning.className = "name-meaning";
  meaning.textContent = (item.label || "অর্থ") + ": " + item.meaning;
  nameDisplay.append(main, meaning);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

// ===== নাম বানানো (একটু ঘুরিয়ে দেখানোর অ্যানিমেশনসহ) =====
let shuffling = false;
function generate() {
  if (shuffling) return;
  shuffling = true;
  nameDisplay.classList.add("shuffling");

  let ticks = 0;
  const timer = setInterval(() => {
    showName(makeName(), false);
    ticks++;
    if (ticks >= 8) {
      clearInterval(timer);
      nameDisplay.classList.remove("shuffling");
      currentName = makeName();
      showName(currentName, true);
      addToHistory(currentName);
      updateButtons();
      shuffling = false;
    }
  }, 60);
}

// ===== তালিকা আপডেট =====
function renderList(listEl, items, removable) {
  listEl.innerHTML = "";
  if (items.length === 0) {
    listEl.innerHTML = '<li class="empty">এখনো কিছু নেই</li>';
    return;
  }
  items.forEach((item, index) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = item.name;
    li.appendChild(span);
    if (removable) {
      const btn = document.createElement("button");
      btn.className = "remove-fav";
      btn.textContent = "✕";
      btn.title = "সরিয়ে ফেলুন";
      btn.onclick = () => {
        favorites.splice(index, 1);
        saveFavorites();
      };
      li.appendChild(btn);
    }
    listEl.appendChild(li);
  });
}

function addToHistory(item) {
  history.unshift(item);
  history = history.slice(0, 10); // শুধু শেষ ১০টা রাখি
  renderList(historyList, history, false);
}

function saveFavorites() {
  localStorage.setItem("favNames", JSON.stringify(favorites));
  renderList(favList, favorites, true);
  updateButtons();
}

function isFavorite(item) {
  return item && favorites.some((f) => f.name === item.name);
}

function updateButtons() {
  copyBtn.disabled = !currentName;
  favBtn.disabled = !currentName;
  favBtn.textContent = isFavorite(currentName) ? "❤️ সেভ করা" : "🤍 সেভ";
}

// ===== বাটনের কাজ =====
function setupChips(containerId, onChange) {
  const container = document.getElementById(containerId);
  container.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    container.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    onChange(chip.dataset.value);
  });
}

setupChips("languageChips", (value) => (language = value));
setupChips("genderChips", (value) => (gender = value));

generateBtn.addEventListener("click", generate);

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(currentName.name);
    showToast("✅ কপি হয়েছে: " + currentName.name);
  } catch {
    showToast("কপি করা গেল না 😕");
  }
});

favBtn.addEventListener("click", () => {
  if (isFavorite(currentName)) {
    favorites = favorites.filter((f) => f.name !== currentName.name);
    showToast("পছন্দের তালিকা থেকে সরানো হলো");
  } else {
    favorites.unshift(currentName);
    showToast("❤️ সেভ হয়েছে!");
  }
  saveFavorites();
});

clearFavBtn.addEventListener("click", () => {
  if (favorites.length && confirm("সব পছন্দের নাম মুছে ফেলবেন?")) {
    favorites = [];
    saveFavorites();
  }
});

// Space চাপলে নতুন নাম
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    generate();
  }
});

// শুরুতে সেভ করা পছন্দের নাম দেখাই
renderList(favList, favorites, true);
