
const dictionary = {
    "محبت": "پیار، الفت، عشق",
    "علم": "جانکاری، معرفت، دانش",
    "کتاب": "تحریری معلومات کا مجموعہ",
    "ادب": "زبان و بیان کا فن اور علمی و تخلیقی تحریریں",
    "شاعری": "خیالات اور جذبات کو منظوم انداز میں بیان کرنا",
    "خوبصورت": "حسین، دلکش، پیارا",
    "تحقیق": "کسی موضوع کی منظم اور گہری چھان بین",
    "زبان": "اظہارِ خیال اور رابطے کا ذریعہ",
    "قلم": "لکھنے کا آلہ",
    "دوستی": "رفاقت، یاری، محبت"
};

const library = [
    "اردو زبان کا تعارف",
    "اردو نثر کی تاریخ",
    "اردو افسانہ اور ناول",
    "اردو تنقید",
    "اردو کلاسیکی ادب",
    "اردو جدید ادب",
    "اردو داستان"
];

const poets = [
    "مرزا غالب — کلاسیکی اردو شاعری",
    "علامہ اقبال — فلسفیانہ اور فکری شاعری",
    "میر تقی میر — غزل کے عظیم شاعر",
    "فیض احمد فیض — جدید اردو شاعری",
    "احمد فراز — رومانوی شاعری"
];

const grammar = [
    "اسم: کسی شخص، جگہ یا چیز کا نام",
    "فعل: کسی کام یا عمل کو ظاہر کرنے والا لفظ",
    "حرف: الفاظ کو آپس میں ملانے والا لفظ",
    "واحد: ایک شخص یا چیز",
    "جمع: ایک سے زیادہ اشخاص یا چیزیں",
    "مذکر: نر یا مرد کے لیے استعمال ہونے والی جنس",
    "مونث: مادہ یا عورت کے لیے استعمال ہونے والی جنس"
];

function showPage(page) {
    document.querySelectorAll(".page").forEach(p =>
        p.classList.add("hidden")
    );

    document.getElementById(page).classList.remove("hidden");

    document.querySelectorAll(".nav").forEach(n =>
        n.classList.toggle("active", n.dataset.page === page)
    );

    document.getElementById("pageTitle").textContent =
        document.querySelector(`[data-page="${page}"]`)?.textContent.trim()
        || "Dashboard";
}

document.querySelectorAll(".nav").forEach(button => {
    button.addEventListener("click", () =>
        showPage(button.dataset.page)
    );
});

function searchWord(value) {
    const results = document.getElementById("dictionaryResults");
    results.innerHTML = "";

    const word = value.trim();

    if (!word) return;

    const matches = Object.entries(dictionary).filter(([key]) =>
        key.includes(word)
    );

    if (!matches.length) {
        results.innerHTML =
            '<div class="result-item">اس ڈیمو لغت میں یہ لفظ موجود نہیں۔</div>';
        return;
    }

    matches.forEach(([key, meaning]) => {
        results.innerHTML += `
            <div class="result-item">
                <strong>${key}</strong>
                <p>${meaning}</p>
            </div>
        `;
    });
}

function renderList(id, items) {
    document.getElementById(id).innerHTML = items.map(item =>
        `<div class="result-item">${item}</div>`
    ).join("");
}

renderList("libraryContent", library);
renderList("poetryContent", poets);
renderList("grammarContent", grammar);

function askAI() {
    const input = document.getElementById("question");
    const question = input.value.trim();

    if (!question) return;

    const chat = document.getElementById("chatBox");

    chat.innerHTML += `
        <div class="user-message">${escapeHTML(question)}</div>
    `;

    input.value = "";

    const answer = getDemoAnswer(question);

    chat.innerHTML += `
        <div class="bot-message">${answer}</div>
    `;

    chat.scrollTop = chat.scrollHeight;
}

function getDemoAnswer(question) {
    if (question.includes("غالب")) {
        return "مرزا غالب اردو اور فارسی کے عظیم شاعر تھے۔ ان کی شاعری میں فلسفہ، عشق اور انسانی جذبات نمایاں ہیں۔ یہ ایک ابتدائی ڈیمو جواب ہے۔";
    }

    if (question.includes("اقبال")) {
        return "علامہ محمد اقبال شاعر، مفکر اور فلسفی تھے۔ ان کی شاعری میں خودی، عمل اور بیداری کا تصور اہم ہے۔ یہ ایک ابتدائی ڈیمو جواب ہے۔";
    }

    if (question.includes("اردو")) {
        return "اردو ایک اہم ہند آریائی زبان ہے جس کی تشکیل برصغیر کے مختلف لسانی اور تہذیبی روابط سے ہوئی۔ یہ ایک مختصر ڈیمو جواب ہے۔";
    }

    return "آپ کا سوال موصول ہوگیا ہے۔ حقیقی AI Research کے لیے اس ایپ کو AI API کے ساتھ منسلک کرنا ضروری ہے۔ فی الحال یہ ڈیمو موڈ میں ہے۔";
}

function escapeHTML(text) {
    return text.replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

document.getElementById("question").addEventListener("keydown", e => {
    if (e.key === "Enter") askAI();
});

function saveNote() {
    const input = document.getElementById("noteInput");
    const note = input.value.trim();

    if (!note) return;

    const notes = JSON.parse(
        localStorage.getItem("urduNotes") || "[]"
    );

    notes.push(note);
    localStorage.setItem("urduNotes", JSON.stringify(notes));

    input.value = "";
    displayNotes();
}

function displayNotes() {
    const notes = JSON.parse(
        localStorage.getItem("urduNotes") || "[]"
    );

    document.getElementById("savedNotes").innerHTML =
        notes.map((note, index) => `
            <div class="result-item">
                ${escapeHTML(note)}
                <button onclick="deleteNote(${index})">Delete</button>
            </div>
        `).join("");
}

function deleteNote(index) {
    const notes = JSON.parse(
        localStorage.getItem("urduNotes") || "[]"
    );

    notes.splice(index, 1);
    localStorage.setItem("urduNotes", JSON.stringify(notes));
    displayNotes();
}

displayNotes();
