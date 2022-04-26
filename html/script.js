var enabledOption = document.getElementById("enabled-checkbox");
var autoAnswerOption = document.getElementById("auto-answer-checkbox");

function loadOptions() {
    chrome.storage.sync.get(["enabled", "autoAnswer"], function(result) {
        console.log(result);
        enabledOption.checked = result.enabled;
        autoAnswerOption.checked = result.autoAnswer;
    });
}

function saveOptions() {
    var data = {
        enabled: enabledOption.checked,
        autoAnswer: autoAnswerOption.checked
    };

    chrome.storage.sync.set(data);
}

enabledOption.onchange = saveOptions;
autoAnswerOption.onchange = saveOptions;

loadOptions();