(function () {
  const data = {
    status: null
  };
  function init() {
    chrome.runtime.sendMessage({ type: "FBParser_Activate" });
    if (!isExceptAddress()) {
      return
    }
    start();
  }

  function getStatus(request, _sender, callback) {
    if ('FBParser_GetStatus' === request.type) {
      callback(data.status);
    }
  }

  function prepareAddress() {
    let canBeUpdated = false;
    const url = new URL(window.location.href);
    const currentSorting = url.searchParams.get('sorting_setting');
    if ('CHRONOLOGICAL' !== currentSorting) {
      url.searchParams.set('sorting_setting', 'CHRONOLOGICAL');
      canBeUpdated = true;
    }
    const currentStatus = url.searchParams.get('fbparser_process');
    if ('true' !== currentStatus) {
      url.searchParams.set('fbparser_process', 'true');
      canBeUpdated = true;
    }
    if (canBeUpdated) {
      window.location.href = url;
    }
  }

  function isExceptAddress() {
    const url = new URL(window.location.href);
    const currentSorting = url.searchParams.get('sorting_setting');
    const currentStatus = url.searchParams.get('fbparser_process');
    return 'CHRONOLOGICAL' === currentSorting && 'true' === currentStatus;
  }

  function process(request, _sender) {
    if ('FBParser_Start' === request.type) {
      if (!isExceptAddress()) {
        prepareAddress();
        return
      }
      start();
    }
  }

  function start() {
    data.status = 'Processing';
    // parsing data and send to backend
  }

  chrome.runtime.onMessage.addListener(process);
  chrome.runtime.onMessage.addListener(getStatus);
  init();
})();