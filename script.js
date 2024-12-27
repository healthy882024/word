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

    let currentDate = new Date();

    // 原始单词数据
    const wordData = {
        "2024-12-25": [
            {
                word: "puppet",
                pronunciation: "/ˈpʌpɪt/",
                definition: "木偶，傀儡",
                example: {
                    en: "The political & legacy media  <span style='color: green;'>puppets</span>  all got their new instructions yesterday and are now <span style='color:blue;'>parroting</span> the same message to drive a <span style='color:purple;'>wedge</span> between @realDonaldTrump and me.",
                    zh: "所有政治和传统媒体的傀儡们昨天都收到了新的指示，现在它们正在重复同样的信息，试图在我和@realDonaldTrump之间制造分裂。"
                }
            }, {
                word: "Parrot",
                pronunciation: "/ˈpærət/",
                definition: "鹦鹉",
                example: {
                    en: "The parrot is known for its ability to mimic sounds.",
                    zh: "鹦鹉因其模仿声音的能力而闻名。。"
                }
            }, {
                word: "Wedge",
                pronunciation: "/wɛdʒ/",
                definition: "（人或事物之间的）隔阂、裂痕：比喻用法",
                example: {
                    en: "The scandal created a wedge between the political allies.",
                    zh: "丑闻在政治盟友之间制造了裂痕。"
                }
            }, {
                word: "Mimic",
                pronunciation: "/ˈmɪmɪk/",
                definition: "模仿",
                example: {
                    en: "The comedian is known as a great mimic, often imitating famous personalities.",
                    zh: "这位喜剧演员因擅长模仿而闻名，经常模仿著名人物。"
                }
            }, {
                word: "Allies",
                pronunciation: "/ˈælaɪz/",
                definition: "盟友",
                example: {

                    en: "During World War II, the United States and the United Kingdom were allies in the fight against Nazi Germany.",
                    zh: "在第二次世界大战期间，美国和英国是联合对抗纳粹德国的盟友。"
                }
            }, {
                word: "Ally",
                pronunciation: "/ˈælaɪ/",
                definition: "盟友（单数形式）",
                example: {

                    en: "She is my ally in the battle for justice.",
                    zh: "她是我在追求正义斗争中的盟友。"
                }
            }, {
                word: "Alliance",
                pronunciation: "/əˈlaɪəns/",
                definition: "联盟",
                example: {

                    en: "The two nations formed an alliance to fight against the common enemy.",
                    zh: "两个国家结成联盟共同对抗共同的敌人。"
                }
            }
        ],
        "2024-12-26": [
            {
                word: "hello",
                pronunciation: "/ˈhɛləʊ/",
                definition: "A greeting",
                example: {
                    en: "Hello! How are you?",
                    zh: "你好！你怎么样？"
                }
            },
            {
                word: "banana",
                pronunciation: "/bəˈnɑːnə/",
                definition: "A yellow fruit",
                example: {
                    en: "Bananas are rich in potassium.",
                    zh: "香蕉富含钾元素。"
                }
            }
        ],
        "2024-12-27": [
            {
                word: "hello",
                pronunciation: "/ˈhɛləʊ/",
                definition: "A greeting",
                example: {
                    en: "HI! How are you?",
                    zh: "你好！你怎么样？"
                }
            },
            {
                word: "banana",
                pronunciation: "/bəˈnɑːnə/",
                definition: "A yellow fruit",
                example: {
                    en: "Bananas are rich in potassium.",
                    zh: "香蕉富含钾元素。"
                }
            }
        ]
    };

    // 用于存储每个单词的出现次数
    const wordCountMap = {};

    // 遍历 wordData 计算每个单词的出现次数，并为其标记出现顺序
    Object.keys(wordData).forEach(date => {
        wordData[date].forEach(entry => {
            const word = entry.word;

            // 如果单词已经出现过，增加计数
            if (wordCountMap[word]) {
                wordCountMap[word]++;
            } else {
                wordCountMap[word] = 1;
            }

            // 给每个单词添加 count 字段，表示该单词的重复出现次数（从第二次开始才标记）
            entry.count = wordCountMap[word] > 1 ? wordCountMap[word] - 1 : 0;  // 第二次出现及之后，count 从 1 开始
        });
    });

    // 输出更新后的 wordData 以验证结果
    console.log(wordData);

    // 以下为现有的代码，负责加载年份、月份、渲染日历等
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

    // 渲染星期标题
    function renderWeekdays() {
        const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
        calendarHeaderDays.innerHTML = weekDays.map(day => `<th>${day}</th>`).join('');
    }

    // 渲染日历
    function renderCalendar() {
        const year = parseInt(yearSelect.value);
        const month = parseInt(monthSelect.value);
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const totalDays = lastDay.getDate();
        const firstDayOfWeek = firstDay.getDay();

        calendarBody.innerHTML = "";
        const fragment = document.createDocumentFragment();

        // 填充日期
        let tr = document.createElement("tr");
        for (let i = 0; i < firstDayOfWeek; i++) {
            tr.appendChild(document.createElement("td"));
        }

        for (let day = 1; day <= totalDays; day++) {
            const td = document.createElement("td");
            td.classList.add("day");

            // 日期部分
            const dayContainer = document.createElement("div");
            dayContainer.classList.add("day-date");
            dayContainer.textContent = day;

            // 获取当天的单词数量
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const wordCount = wordData[dateKey] ? wordData[dateKey].length : 0;

            // 单词数量显示
            const wordCountElement = document.createElement("div");
            wordCountElement.classList.add("day-word-count");
            wordCountElement.textContent = wordCount > 0 ? wordCount : '-';

            td.appendChild(dayContainer);
            td.appendChild(wordCountElement);
            td.addEventListener("click", () => showWordDetails(year, month, day));

            tr.appendChild(td);

            // 每一行添加 7 个日期
            if ((firstDayOfWeek + day) % 7 === 0) {
                fragment.appendChild(tr);
                tr = document.createElement("tr");
            }
        }

        // 添加剩余日期
        if (tr.children.length > 0) {
            fragment.appendChild(tr);
        }

        calendarBody.appendChild(fragment);
    }

    // 显示单词详情
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
            ${word.word} <span class="word-pronunciation">${word.pronunciation}</span>
        </span>
        <div class="word-details" id="details-${index + 1}">
            <p class="word-definition">${word.definition}</p> 
            <p class="word-example">  
                ${word.example.en}<br> 
                ${word.example.zh}
            </p>
        </div>
    </li>
`).join('');


        modal.style.display = "block";

        // 给每个单词添加点击事件来显示详细信息
        const wordItems = document.querySelectorAll(".word-item");
        wordItems.forEach(item => {
            item.addEventListener("click", function () {
                const wordDetails = item.nextElementSibling;  // 获取当前单词的详情

                // 切换该单词的详情展开/折叠
                wordDetails.classList.toggle("show");
            });
        });

        // 给已展开的单词详情添加点击事件来折叠它
        const wordDetails = document.querySelectorAll(".word-details");
        wordDetails.forEach(detail => {
            detail.addEventListener("click", function (event) {
                // 阻止事件冒泡到单词
                event.stopPropagation();
                // 通过点击详情来折叠它
                detail.classList.remove("show");
            });
        });
    }

    // 关闭 modal
    closeModalButton.addEventListener("click", () => modal.style.display = "none");

    // 点击窗口外部关闭 modal
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
    renderWeekdays();  // 渲染星期标题
    renderCalendar();
});
