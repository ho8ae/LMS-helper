(() => {
    const PROTOCOL = location.protocol;
    const HOST = location.host;
    const ASSIGN_BASE_URL = `${PROTOCOL}//${HOST}/mod/assign/`;
    const QUIZ_BASE_URL = `${PROTOCOL}//${HOST}/mod/quiz/`;
  
    function checkLangKor() {
      const element = document.querySelector('.user-info-shortcut > li > a');
      return element ? element.textContent === '파일 관리' : false;
    }
  
    async function fetchData(url) {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    }
  
    function countUnsubmittedAssignments(html) {
      const tbody = html.split('tbody');
      if (tbody.length === 3) {
        const [, content] = tbody;
        return (content.match(/\>(미제출|No\ssubmission)\</g) || []).length;
      }
      return 0;
    }
  
    function countUnattemptedQuizzes(html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const emptyCells = doc.querySelectorAll('td.cell.c3.lastcol:empty');
      return emptyCells.length;
    }
  
    async function insertReportLabel(courseBox, id) {
      const numId = id.split('=')[1];
      const elementId = `cp-report-${numId}`;
      const before = document.getElementById(elementId);
      if (before) {
        before.remove();
      }
  
      try {
        const [assignHtml, quizHtml] = await Promise.all([
          fetchData(`${ASSIGN_BASE_URL}${id}`),
          fetchData(`${QUIZ_BASE_URL}${id}`)
        ]);
  
        const unsubmittedAssignments = countUnsubmittedAssignments(assignHtml);
        const unattemptedQuizzes = countUnattemptedQuizzes(quizHtml);
  
        const isKorean = checkLangKor();
        const assignText = isKorean ? '미제출 과제 : ' : 'Unsubmitted assignments : ';
        const quizText = isKorean ? '미응시 퀴즈 : ' : 'Unattempted quizzes : ';
  
        const p = document.createElement('p');
        p.id = elementId;
        p.className = 'cp-report-label';
        p.innerHTML = `${assignText}${unsubmittedAssignments} | ${quizText}${unattemptedQuizzes}`;
  
        if (unsubmittedAssignments > 0 || unattemptedQuizzes > 0) {
          p.classList.add('accent');
        }
  
        const courseStatus = courseBox.querySelector('.course-status');
        if (courseStatus) {
          courseStatus.appendChild(p);
        }
  
        return p;
      } catch (error) {
        console.error(`Error fetching data for course ID ${id}:`, error);
        return null;
      }
    }
  
    function applyReports() {
      const courseBoxes = document.querySelectorAll('.course-box');
      console.log('Applying reports to course boxes:', courseBoxes.length);
      courseBoxes.forEach((courseBox) => {
        const link = courseBox.querySelector('a.course-link');
        if (link) {
          const href = link.getAttribute('href');
          const match = href.match(/\?id=([0-9]{1,7})/);
          if (match) {
            const id = match[0];
            insertReportLabel(courseBox, id);
          }
        }
      });
    }
  
    // 페이지가 대시보드인지 확인
    if (location.pathname.includes('/dashboard.php')) {
      // DOM이 로드된 후 초기화 함수 실행
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyReports);
      } else {
        applyReports();
      }
      console.log('Report Plugin initialized on dashboard!');
    }
  })();