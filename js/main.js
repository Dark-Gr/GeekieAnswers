var scriptPath = chrome.runtime.getURL("/js/AnswerResolver.js");
var scriptTag = document.createElement("script");
scriptTag.src = scriptPath;

chrome.storage.sync.get(["enabled"], function(result) {
    var enabled = true;

    if("enabled" in result) enabled = result.enabled;
    if(enabled) {
        scriptTag.onload = function() {
            var correctIcon = chrome.runtime.getURL("/img/correctIcon.png");
        
            var event = new CustomEvent("CorrectIconULRReceive", { detail: correctIcon });
            document.dispatchEvent(event);
        }
        
        document.head.appendChild(scriptTag);
    }
});