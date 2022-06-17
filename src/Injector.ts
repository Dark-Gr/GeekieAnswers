var scriptPath = chrome.runtime.getURL("/public/js/AnswerResolver.js");
var stylePath = chrome.runtime.getURL("/public/css/UIStyle.css");
var script = document.createElement("script");
var style = document.createElement("link");

script.src = scriptPath;

style.rel = "stylesheet";
style.href = stylePath;


chrome.storage.sync.get([ "enabled" ], function(result) { 
    var enabled = true;

    if("enabled" in result) enabled = result["enabled"];
    else chrome.storage.sync.set({ enabled: true });

    if(enabled) { // Check if extension is enabled before injecting it
        if(document.location.href.endsWith("homework") || document.location.href.endsWith("home") ||
        document.location.href.endsWith("explore") || document.location.href.endsWith("proficiency")) return;

        script.onload = function() {
            var correctMarkIcon = chrome.runtime.getURL("/public/img/correctIcon.png"); // Load the correct icon
        
            // Creates and dispatch the event to load the extension on the page
            var event = new CustomEvent("loadGeekieAnswers", { detail: { correctMarkIcon: correctMarkIcon } });
            document.dispatchEvent(event);
        }
        
        // Append the script to the page
        document.head.appendChild(style);
        document.body.appendChild(script);
    }
});