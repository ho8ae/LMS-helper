(() => {
    function insertStyle() {
        const style = document.createElement('style');
        style.textContent = `
        .cp-speedy {
            position:relative;
            float:right;
            height: 100%;
            display:flex;
            margin-right: 8px;
            z-index: 1000;
        }
        .cp-text {
            color: #d6d6d6;
            line-height: 42px;
        }
        .cp-grouped-button {
            display:flex;
            align-items: center;
        }
        .cp-grouped-button > button {
            outline:none;
            border: none;
            background: none;
            padding: 4px 8px;
            color: #ccc;
        }
        .cp-grouped-button > button.selected {
            color: #2d67c5;
            font-weight: bold;
            border-bottom: 2px solid #2d67c5;
        }
      `;
        document.head.appendChild(style);
    }

    function closeSocket() {
        if (window.socket) {
            window.socket.close();
        }
    }

    function preventCheckerFunction() {
        Object.defineProperty(window, 'remote_vod_pause', {
            writable: false,
            value: closeSocket,
        });
        closeSocket();
    }

    function insertElement() {
        const footer = document.getElementById('vod_footer');
        console.log(footer); // footer 요소 확인

        if (!footer) {
            console.error("Element with ID 'vod_footer' not found.");
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'cp-speedy';

        const text = document.createElement('span');
        text.className = 'cp-text';
        text.textContent = '배속 : ';
        wrapper.appendChild(text);

        const groupedButton = document.createElement('div');
        groupedButton.className = 'cp-grouped-button';

        const speeds = [0.6, 0.8, 1, 1.2, 1.5, 1.7, 2.0];
        speeds.forEach((speed, index) => {
            const button = document.createElement('button');
            if (index === 2) {
                button.className = 'selected';
            }
            button.textContent = speed;
            button.addEventListener('click', handleButtonClick);
            groupedButton.appendChild(button);
        });

        wrapper.appendChild(groupedButton);
        footer.appendChild(wrapper);
    }

    function handleButtonClick(e) {
        const target = e.currentTarget || e.target;
        const buttons = [...document.querySelectorAll('.cp-grouped-button > button')];
        buttons.forEach(button => {
            if (target === button) {
                setPlaySpeed(button.textContent);
                button.className = 'selected';
            } else {
                button.className = '';
            }
        });
    }

    function setPlaySpeed(speed) {
        const video = document.querySelector('video');
        if (video) {
            video.playbackRate = Number(speed);
            console.log(`Playback rate set to ${speed}`);
        } else {
            console.warn("Video element not found.");
        }
    }

    function removeSeekListener() {
        // jwplayer 관련 기능을 제거하거나 유지할 필요가 없으므로 아무것도 하지 않음
        console.warn("jwplayer is not defined. Skipping removeSeekListener.");
    }

    insertStyle();
    insertElement();
    preventCheckerFunction();
    removeSeekListener();
    console.log('Video Plugin Initialized!');
})();
