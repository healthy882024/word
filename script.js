document.addEventListener("DOMContentLoaded", function () {
    const prevMonthButton = document.getElementById("prev-month");
    const nextMonthButton = document.getElementById("next-month");
    const yearSelect = document.getElementById("year-select");
    const monthSelect = document.getElementById("month-select");
    const calendarBody = document.getElementById("calendar-body");
    const calendarHeaderDays = document.getElementById("calendar-header-days");
    const modal = document.getElementById("word-details-modal");
    const closeModalButton = document.getElementById("close-modal");
    const wordDetailsList = document.getElementById("word-details-list");
    const totalWordCountElementYear = document.getElementById("total-word-count-year");
    const totalWordCountElementMonth = document.getElementById("total-word-count-month");
    const yearCountValue = document.getElementById("year-count-value");
    const monthCountValue = document.getElementById("month-count-value");

    let currentDate = new Date();

    const wordData = {
        "2024-01-28": [
            { word: "hi" },
            { word: "banana" }
        ],
        "2024-11-28": [
            { word: "hi" },
            { word: "banana" }
        ],
        "2024-12-25": [
            { word: "puppet" },
            { word: "Parrot" },
            { word: "Wedge" },
            { word: "Mimic" },
            { word: "Allies" },
            { word: "Ally" },
            { word: "Alliance" }
        ],
        "2024-12-26": [
            { word: "hello" },
            { word: "banana" }
        ],
        "2024-12-27": [
            { word: "hello" },
            { word: "banana" }
        ],
        "2024-12-28": [
            { word: "hi" },
            { word: "banana" }
        ]
    };

    const wordCountMap = {};

    Object.keys(wordData).forEach(date => {
        wordData[date].forEach(entry => {
            const word = entry.word;

            if (wordCountMap[word]) {
                wordCountMap[word]++;
            } else {
                wordCountMap[word] = 1;
            }

            entry.count = wordCountMap[word] > 1 ? wordCountMap[word] - 1 : 0;
        });
    });

    function loadYearAndMonth() {
        const currentYear = currentDate.getFullYear();
        const startYear = currentYear - 5;
        const endYear = currentYear + 5;

        const yearOptions = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

        yearSelect.innerHTML = yearOptions.map(year => `<option value="${year}">${year}</option>`).join('');
        monthSelect.innerHTML = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
            .map((month, index) => `<option value="${index}">${month}</option>`).join('');

        yearSelect.value = currentYear;
        monthSelect.value = currentDate.getMonth();
    }

    function renderWeekdays() {
        const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
        calendarHeaderDays.innerHTML = weekDays.map(day => `<th>${day}</th>`).join('');
    }

    function calculateWordCounts() {
        const year = parseInt(yearSelect.value);
        const month = parseInt(monthSelect.value);

        let totalYearCount = 0;
        let totalMonthCount = 0;

        Object.keys(wordData).forEach(date => {
            const [yearData, monthData] = date.split('-');

            const dailyWordCount = wordData[date].length;

            if (yearData === year.toString()) {
                totalYearCount += dailyWordCount;
            }

            if (yearData === year.toString() && parseInt(monthData) === month + 1) {
                totalMonthCount += dailyWordCount;
            }
        });

        yearCountValue.textContent = totalYearCount;
        monthCountValue.textContent = totalMonthCount;
    }

    function renderCalendar() {
        const year = parseInt(yearSelect.value);
        const month = parseInt(monthSelect.value);
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const totalDays = lastDay.getDate();
        const firstDayOfWeek = firstDay.getDay();

        calendarBody.innerHTML = "";
        const fragment = document.createDocumentFragment();

        let totalWordCount = 0;

        let tr = document.createElement("tr");
        for (let i = 0; i < firstDayOfWeek; i++) {
            tr.appendChild(document.createElement("td"));
        }

        for (let day = 1; day <= totalDays; day++) {
            const td = document.createElement("td");
            td.classList.add("day");

            const dayContainer = document.createElement("div");
            dayContainer.classList.add("day-date");
            dayContainer.textContent = day;

            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const wordCount = wordData[dateKey] ? wordData[dateKey].length : 0;

            totalWordCount += wordCount;

            const wordCountElement = document.createElement("div");
            wordCountElement.classList.add("day-word-count");
            wordCountElement.textContent = wordCount > 0 ? wordCount : '-';

            td.appendChild(dayContainer);
            td.appendChild(wordCountElement);
            td.addEventListener("click", () => showWordDetails(year, month, day));

            tr.appendChild(td);

            if (tr.children.length === 7) {
                fragment.appendChild(tr);
                tr = document.createElement("tr");
            }
        }

        if (tr.children.length > 0) {
            fragment.appendChild(tr);
        }

        calendarBody.appendChild(fragment);
        calculateWordCounts();
    }

    function showWordDetails(year, month, day) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const words = wordData[dateKey] || [];

        wordDetailsList.innerHTML = words.length === 0
            ? "<li>没有单词记录。</li>"
            : words.map((word, index) => `
    <li>
        <span class="word-number">${index + 1}</span>
        <span class="word-item" data-word="${word.word}">
            ${word.count > 0 ? `<span class="repeat-count">${word.count}</span>` : ""}
            ${word.word}
        </span>
    </li>
`).join('');

        modal.style.display = "block";

        const wordItems = document.querySelectorAll(".word-item");
        wordItems.forEach(item => {
            item.addEventListener("click", function () {
                const word = item.getAttribute("data-word");
                window.open(`https://m.youdao.com/dict?le=eng&q=${word}`, '_blank');
            });
        });
    }

    closeModalButton.addEventListener("click", () => modal.style.display = "none");

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    prevMonthButton.addEventListener("click", () => {
        monthSelect.value = (parseInt(monthSelect.value) - 1 + 12) % 12;
        if (monthSelect.value === '11') yearSelect.value--;
        renderCalendar();
    });

    nextMonthButton.addEventListener("click", () => {
        monthSelect.value = (parseInt(monthSelect.value) + 1) % 12;
        if (monthSelect.value === '0') yearSelect.value++;
        renderCalendar();
    });

    yearSelect.addEventListener("change", renderCalendar);

    monthSelect.addEventListener("change", renderCalendar);

    loadYearAndMonth();
    renderWeekdays();
    calculateWordCounts();
    renderCalendar();
});
