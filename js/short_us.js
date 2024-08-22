(() => {
    const PROTOCOL = location.protocol;
    const HOST = location.host;
    const BASE_URL = `${PROTOCOL}//${HOST}/`;
    const SHORTCUTS = {
      '과제': 'mod/assign/',
      '파일': 'mod/ubfile/',
      '동영상': 'mod/vod/',
      '퀴즈': 'mod/quiz/'
    };
  
    function insertShortcutButton(parent, id) {
      const statusDiv = parent.querySelector('.course-status');
      if (!statusDiv) {
        const newStatusDiv = document.createElement('div');
        newStatusDiv.className = 'course-status';
        parent.appendChild(newStatusDiv);
      }
  
      const buttonGroup = document.createElement('div');
      buttonGroup.className = 'cp-short-group';
      Object.entries(SHORTCUTS).forEach(([key, value]) => {
        const button = document.createElement('a');
        button.textContent = key;
        button.href = `${BASE_URL}${value}${id}`;
        button.className = 'btn btn-sm btn-secondary mr-1';
        buttonGroup.appendChild(button);
      });
  
      const targetDiv = parent.querySelector('.course-status') || parent;
      targetDiv.appendChild(buttonGroup);
    }
  
    function applyShortcuts() {
      const courseBoxes = document.querySelectorAll('.course-box');
      courseBoxes.forEach((courseBox) => {
        const link = courseBox.querySelector('a.course-link');
        if (link) {
          const href = link.getAttribute('href');
          const match = href.match(/\?id=([0-9]{1,7})/);
          if (match) {
            const id = match[0];
            insertShortcutButton(courseBox, id);
          }
        }
      });
    }
  
    // 페이지가 대시보드인지 확인
    if (location.pathname.includes('/dashboard.php')) {
      // DOM이 로드된 후 초기화 함수 실행
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyShortcuts);
      } else {
        applyShortcuts();
      }
      console.log('Shortcut Plugin initialized on dashboard!');
    }
  })();