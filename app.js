// Translations Dictionary
const i18n = {
    ko: {
        appName: "나만의 대학생활 가이드",
        onboardingTitle: "환영합니다!",
        onboardingDesc: "성공적인 대학 생활을 위한 맞춤 설정을 시작합니다.",
        selectLang: "언어 선택 (Language)",
        selectGrade: "학년 선택",
        freshman: "신입생 (1학년)",
        sophomore: "2학년",
        selectInterest: "관심사 (다중 선택 가능)",
        interestScholarship: "장학금",
        interestClub: "동아리",
        interestAcademics: "학사일정",
        startBtn: "시작하기",
        dashGreeting: "안녕하세요!",
        dashSubGreeting: "오늘의 맞춤형 대학 생활 정보를 확인하세요.",
        recommended: "추천 정보",
        personalized: "맞춤형",
        importantDates: "주요 일정",
        quickLinks: "빠른 접근",
        notices: "학교 공지",
        scholarshipMenu: "장학금",
        clubsMenu: "동아리",
        qnaMenu: "상담/Q&A"
    },
    en: {
        appName: "College Adapter",
        onboardingTitle: "Welcome!",
        onboardingDesc: "Let's set up your personalized college life guide.",
        selectLang: "Language",
        selectGrade: "Select Grade",
        freshman: "Freshman (1st Year)",
        sophomore: "Sophomore (2nd Year)",
        selectInterest: "Interests (Multiple selection)",
        interestScholarship: "Scholarships",
        interestClub: "Clubs",
        interestAcademics: "Academics",
        startBtn: "Get Started",
        dashGreeting: "Hello!",
        dashSubGreeting: "Check out your personalized college info for today.",
        recommended: "Recommended",
        personalized: "Personalized",
        importantDates: "Important Dates",
        quickLinks: "Quick Links",
        notices: "Notices",
        scholarshipMenu: "Scholarships",
        clubsMenu: "Clubs",
        qnaMenu: "Q&A"
    }
};

let currentLang = 'ko';

// DOM Elements
const langToggleBtn = document.getElementById('langToggle');
const langSelect = document.getElementById('langSelect');
const startBtn = document.getElementById('startBtn');
const onboardingView = document.getElementById('onboardingView');
const dashboardView = document.getElementById('dashboardView');
const navbar = document.getElementById('navbar');
const recommendationList = document.getElementById('recommendationList');
const calendarList = document.getElementById('calendarList');
const detailModal = document.getElementById('detailModal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

// Update UI Language
function updateLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[lang][key]) {
            el.textContent = i18n[lang][key];
        }
    });
    // Update Greeting if user exists
    const userGrade = localStorage.getItem('grade');
    if (userGrade && !onboardingView.classList.contains('active')) {
        const greeting = document.querySelector('[data-i18n="dashGreeting"]');
        const role = userGrade === 'freshman' ? (lang === 'ko' ? '신입생님' : 'Freshman') : (lang === 'ko' ? '재학생님' : 'Student');
        greeting.textContent = lang === 'ko' ? `안녕하세요, ${role}!` : `Hello, ${role}!`;
    }
}

// Event Listeners
langToggleBtn.addEventListener('click', () => {
    updateLanguage(currentLang === 'ko' ? 'en' : 'ko');
});

langSelect.addEventListener('change', (e) => {
    updateLanguage(e.target.value);
});

startBtn.addEventListener('click', () => {
    // Save Onboarding Data
    const grade = document.getElementById('gradeSelect').value;
    const interests = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
    
    localStorage.setItem('grade', grade);
    localStorage.setItem('interests', JSON.stringify(interests));
    
    // Transition to Dashboard
    onboardingView.classList.add('hidden');
    onboardingView.classList.remove('active');
    
    navbar.classList.remove('hidden');
    dashboardView.classList.remove('hidden');
    dashboardView.classList.add('active');
    
    loadDashboardData();
    updateLanguage(currentLang);
});

// Close Modal
closeModal.addEventListener('click', () => {
    detailModal.classList.add('hidden');
});

// Mock Data Loaders
function loadDashboardData() {
    const interests = JSON.parse(localStorage.getItem('interests') || '[]');
    
    // Recommendations based on interests
    const mockRecs = [];
    if (interests.includes('scholarship')) {
        mockRecs.push({ ko: "외국인 유학생 성적우수 장학금 신청 안내", en: "Application for International Student Merit Scholarship" });
    }
    if (interests.includes('club')) {
        mockRecs.push({ ko: "글로벌 교류 동아리 신입 부원 모집", en: "Global Exchange Club Recruiting New Members" });
    }
    if (interests.includes('academics')) {
        mockRecs.push({ ko: "2026학년도 1학기 수강신청 가이드", en: "Course Registration Guide for Spring 2026" });
    }
    if (mockRecs.length === 0) {
        mockRecs.push({ ko: "학교 생활 적응을 위한 오리엔테이션 자료", en: "Orientation Materials for Campus Life Adaptation" });
    }

    recommendationList.innerHTML = mockRecs.map(rec => 
        `<div class="rec-item" onclick="openModal('${rec.ko}', '${rec.en}')">
            <h4>${currentLang === 'ko' ? rec.ko : rec.en}</h4>
        </div>`
    ).join('');

    // Calendar Data
    const mockCal = [
        { date: "05/10", ko: "수강신청 변경 기간", en: "Course Add/Drop Period" },
        { date: "05/15", ko: "장학금 서류 제출 마감", en: "Scholarship Docs Deadline" },
        { date: "06/08", ko: "기말고사 시작", en: "Final Exams Begin" }
    ];

    calendarList.innerHTML = mockCal.map(cal => 
        `<li class="cal-item">
            <span>${currentLang === 'ko' ? cal.ko : cal.en}</span>
            <span class="date">${cal.date}</span>
        </li>`
    ).join('');
}

function openModal(titleKo, titleEn) {
    modalTitle.textContent = currentLang === 'ko' ? titleKo : titleEn;
    modalBody.textContent = currentLang === 'ko' 
        ? "상세 정보가 이곳에 표시됩니다. (백엔드 API 연동 필요)" 
        : "Detailed information will be displayed here. (Requires backend API integration)";
    detailModal.classList.remove('hidden');
}

// Initial Setup
updateLanguage('ko');
