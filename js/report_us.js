(() => {
    const PROTOCOL = location.protocol;
    const HOST = location.host;
    const BASE_URL = `${PROTOCOL}//${HOST}/mod/assign/`;
  
    function checkLangKor() {
      const element = document.querySelector('.user-info-shortcut > li > a');
      return element ? element.textContent === '파일 관리' : false;
    }
  
    function insertReportLabel(courseBox, id) {
      const numId = id.split('=')[1];
      const elementId = `cp-report-${numId}`;
      const before = document.getElementById(elementId);
      if (before) {
        before.remove();
      }
  
      return fetch(`${BASE_URL}${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then(text => {
          const tbody = text.split('tbody');
          let textValue = checkLangKor() ? '미제출 과제 : ' : '미제출 과제 : ';
          let isAccent = false;
          if (tbody.length === 3) {
            const [, html] = tbody;
            const inProgress = (html.match(/\>(미제출|No\ssubmission)\</g) || []).length;
            textValue += inProgress;
            isAccent = inProgress > 0;
          } else {
            textValue += `-`;
          }
  
          const p = document.createElement('p');
          p.id = elementId;
          p.className = `cp-report-label`;
          if (isAccent) {
            p.classList.add('accent');
          }
          p.textContent = textValue;
  
          const courseStatus = courseBox.querySelector('.course-status');
          if (courseStatus) {
            courseStatus.appendChild(p);
          }
  
          return p;
        })
        .catch(error => {
          console.error(`Error fetching data for course ID ${id}:`, error);
          return null;
        });
    }
  
    function applyReports() {
      const courseBoxes = document.querySelectorAll('.course-box');
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