(() => {
    const LMS_IDENTIFIER = 'smartlead.hallym.ac.kr';

    function checkLMS() {
        return window.location.hostname.includes(LMS_IDENTIFIER);
    }

    function createStyleElement() {
        const style = document.createElement('style');
        style.textContent = `
            #lms-helper-summary {
                position: fixed;
                top: 10px;
                right: 10px;
                background: white;
                border: 1px solid #ddd;
                padding: 10px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                z-index: 9999;
                max-width: 300px;
                overflow-y: auto;
                max-height: 80vh;
            }
            .course-summary {
                margin-bottom: 10px;
                padding-bottom: 10px;
                border-bottom: 1px solid #eee;
            }
            .course-summary:last-child {
                border-bottom: none;
            }
        `;
        return style;
    }

    function insertSummaryBlock() {
        const summaryBlock = document.createElement('div');
        summaryBlock.id = 'lms-helper-summary';
        summaryBlock.innerHTML = `
            <h2>강의 요약</h2>
            <div id="lms-helper-content"></div>
        `;
        document.body.appendChild(summaryBlock);
        return summaryBlock;
    }

    function fetchCourseInfo() {
        const courseLinks = [...document.querySelectorAll('.course-link')];
        return Promise.all(courseLinks.map(link => 
            fetch(link.href)
                .then(res => res.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    return {
                        title: link.querySelector('.course-title h3')?.textContent || '제목 없음',
                        progress: doc.querySelector('.course-progress')?.textContent || '진행률 정보 없음',
                        nextDeadline: doc.querySelector('.next-deadline')?.textContent || '마감일 정보 없음'
                    };
                })
        ));
    }

    function renderSummary(courses) {
        const content = document.getElementById('lms-helper-content');
        content.innerHTML = courses.map(course => `
            <div class="course-summary">
                <h3>${course.title}</h3>
                <p>진행률: ${course.progress}</p>
                <p>다음 마감일: ${course.nextDeadline}</p>
            </div>
        `).join('');
    }

    function init() {
        if (checkLMS()) {
            document.head.appendChild(createStyleElement());
            insertSummaryBlock();
            fetchCourseInfo().then(renderSummary);
        }
    }

    init();
})();