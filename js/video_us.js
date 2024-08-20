(() => {
    function insertStyle() {
      const style = document.createElement('style')
      style.textContent = `
        .cp-speedy{
          position:relative;
          float:right;
          height: 100%;
          display:flex;
          margin-right: 8px;
        }
        .cp-text {
          color: #d6d6d6;
          line-height: 42px;
        }
        .cp-grouped-button {
          display:flex;
          align-items: center;
        }
        .cp-grouped-button > button{
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
      `
      document.head.appendChild(style)
    }
  
    function insertElement() {
      const footer = document.getElementById('vod_footer')
  
      const wrapper = document.createElement('div')
      wrapper.className = 'cp-speedy'
  
      const text = document.createElement('span')
      text.className = 'cp-text'
      text.textContent = '배속 : '
      wrapper.appendChild(text)
  
      const groupedButton = document.createElement('div')
      groupedButton.className = 'cp-grouped-button'
  
      const speeds = [1.00, 1.25, 1.5, 1.75, 2]
      speeds.forEach((speed, index) => {
        const button = document.createElement('button')
        if (index == 0) {
          button.className = 'selected'
        }
        button.textContent = speed
        button.addEventListener('click', handleButtonClick)
        groupedButton.appendChild(button)
      })
  
      wrapper.appendChild(groupedButton)
      footer.appendChild(wrapper)
    }
  
    function handleButtonClick(e) {
      const target = e.currentTarget || e.target
      const buttons = [...document.querySelectorAll('.cp-grouped-button > button')]
      buttons.forEach((button) => button.className = (target === button) ? setPlaySpeed(button.textContent) || 'selected' : '')
    }
  
    function setPlaySpeed(speed) {
      jwplayer().setPlaybackRate(Number(speed))
    }
  
    insertStyle()
    insertElement()
    console.log('Video Plugin!')
  })()