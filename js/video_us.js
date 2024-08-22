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

    function blockWebSocket() {
        window.WebSocket = function() {
            console.log("WebSocket connection blocked");
            return {
                send: function() {},
                close: function() {}
            };
        };
    }

    function manipulateStorage() {
        function createProxyStorage(originalStorage) {
            return new Proxy(originalStorage, {
                set: function (target, key, value) {
                    if (key === 'multipleVideoDetected' || key.includes('video') || key.includes('player')) {
                        console.log('Prevented setting:', key);
                        return true;
                    }
                    return Reflect.set(target, key, value);
                },
                get: function(target, key) {
                    if (key === 'multipleVideoDetected' || key.includes('video') || key.includes('player')) {
                        console.log('Prevented getting:', key);
                        return null;
                    }
                    return Reflect.get(target, key);
                }
            });
        }

        Object.defineProperty(window, 'localStorage', {
            value: createProxyStorage(localStorage)
        });

        Object.defineProperty(window, 'sessionStorage', {
            value: createProxyStorage(sessionStorage)
        });
        //session과 local Storage을 건드려  출석이 인정이 안되지 않을까?
    }

    function preventCheckerFunction() {
        Object.defineProperty(window, 'remote_vod_pause', {
            writable: false,
            value: function() {
                console.log('remote_vod_pause has been overridden.');
            },
        });

        if (typeof learningCheckerV2 !== 'undefined') {
            learningCheckerV2.remoteVodPause = function(socket) {
                console.log("다중 비디오 감지 기능이 비활성화되었습니다.");
            };
        }
    }

    function insertElement() {
        const footer = document.getElementById('vod_footer');
        console.log(footer);

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
        console.warn("jwplayer is not defined. Skipping removeSeekListener.");
    }

    blockWebSocket();
    manipulateStorage();
    insertStyle();
    insertElement();
    preventCheckerFunction();
    removeSeekListener();
    console.log('Video Plugin Initialized with WebSocket blocking and Storage manipulation!');
})();