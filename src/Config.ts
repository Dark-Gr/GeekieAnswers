var enabledOption = document.getElementById("enabled-checkbox") as HTMLInputElement;
var autoAnswerOption = document.getElementById("auto-answer-checkbox") as HTMLInputElement;

function loadOptions() {
    chrome.storage.sync.get(["enabled"], function(result) {
        if(!result || result == {} || !("enabled" in result)) {
            loadDefaultOptions();
            return;
        }

        enabledOption.checked = result.enabled;
        autoAnswerOption.checked = result.autoAnswer;
    });
}

function loadDefaultOptions() {
    var data = {
        enabled: true,
    };

    chrome.storage.sync.set(data);

    enabledOption.checked = true;
}

function saveOptions() {
    var data = {
        enabled: enabledOption.checked,
    };

    chrome.storage.sync.set(data);
}

loadOptions();

enabledOption.onchange = saveOptions;