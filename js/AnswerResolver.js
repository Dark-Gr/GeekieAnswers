var correctIconURL;
var showSolutionButton;

var showCorrectMarkButton;
var correctAnswerMark;
var correctChoiceText;

function getCorrectChoice() {
    var itemElement = document.getElementsByClassName("item")[0];
    var item = angular.element(itemElement).scope();

    return item.item.correctChoiceId;
}

function getChoices() {
    var choices = document.getElementsByClassName("item")[0].getElementsByClassName("choices")[0].children;
    return choices;
}

function markCorrectChoice() {
    var correctChoice = getCorrectChoice();
    var choices = getChoices();

    for(var i = 0; i < choices.length; i++) {
        var choiceElement = choices[i];
        var choiceId = angular.element(choiceElement).scope().choice.id;

        if(choiceId == correctChoice) {
            createMark(choiceElement);
            break;
        }
    } 

    var isSolutionVisible = angular.element(document.getElementsByClassName("item")[0]).scope().isSolutionVisible();
    if(!isSolutionVisible) showSolutionButton.innerHTML = "Mostrar solução";
    else showSolutionButton.innerHTML = "Esconder solução";
}

function addShowSolutionButton() {
    var title = document.getElementsByClassName("step")[0];
    var button = document.createElement("button");

    button.innerHTML = "Mostrar solução";
    button.onclick = toggleSolution;

    button.style = "background: none; border: 2px solid rgb(59, 209, 99); padding: 0; color: rgb(59, 209, 99); border-radius: 5px; width: 150px; height: 25px; font-family: Arial, Helvetica, sans-serif; font-size: 16px; margin-top: 20px;";
    button.onmouseover = function(ev) {
        button.style = "background: none; border: 2px solid rgb(50, 179, 84); padding: 0; color: rgb(50, 179, 84); border-radius: 5px; width: 150px; height: 25px; font-family: Arial, Helvetica, sans-serif; font-size: 16px; margin-top: 20px;";
    }
    button.onmouseleave = function(ev) {
        button.style = "background: none; border: 2px solid rgb(59, 209, 99); padding: 0; color: rgb(59, 209, 99); border-radius: 5px; width: 150px; height: 25px; font-family: Arial, Helvetica, sans-serif; font-size: 16px; margin-top: 20px;";
    }

    showSolutionButton = button;
    title.appendChild(button);
}

function addToggleCorrectAnswerMark() {
    var title = document.getElementsByClassName("step")[0];
    var button = document.createElement("button");

    button.innerHTML = "Mostrar resposta";
    button.onclick = toggleMark;

    button.style = "margin-left: 15px; background: none; border: 2px solid rgb(59, 209, 99); padding: 0; color: rgb(59, 209, 99); border-radius: 5px; width: 150px; height: 25px; font-family: Arial, Helvetica, sans-serif; font-size: 16px; margin-top: 20px;";
    button.onmouseover = function(ev) {
        button.style = "margin-left: 15px; background: none; border: 2px solid rgb(50, 179, 84); padding: 0; color: rgb(50, 179, 84); border-radius: 5px; width: 150px; height: 25px; font-family: Arial, Helvetica, sans-serif; font-size: 16px; margin-top: 20px;";
    }
    button.onmouseleave = function(ev) {
        button.style = "margin-left: 15px; background: none; border: 2px solid rgb(59, 209, 99); padding: 0; color: rgb(59, 209, 99); border-radius: 5px; width: 150px; height: 25px; font-family: Arial, Helvetica, sans-serif; font-size: 16px; margin-top: 20px;";
    }

    showCorrectMarkButton = button;
    title.append(button);
}

function createMark(parent) {
    var div = document.createElement("div");
    var correctIcon = document.createElement("img");
    var text = document.createElement("p");

    div.id = "correctAnswerMark";

    div.appendChild(correctIcon);
    div.appendChild(text);

    text.innerHTML = "Resposta correta";
    correctIcon.src = correctIconURL;

    correctChoiceText = getOptionText(parent);

    text.style = "color: rgb(59, 209, 99); font-family: Arial, Helvetica, sans-serif; font-size: 16px; display: inline-block; margin-top: -1px;";
    correctIcon.style = "width: 20px; height: 20px; margin-right: 6px; margin-left: 12px; margin-top: -2px;";
    div.style = "border: 2px solid rgb(59, 209, 99); width: 180px; height: 24px; border-radius: 5px; position: relative; margin-top: -36px; margin-left: " + (getOptionTextSize(parent) + 200) + "px;";

    div.classList.add("ng-hide");

    correctAnswerMark = div;
    parent.appendChild(div);
}

function resetSolutionVisiblitiy() {
    var isVisible = angular.element(document.getElementsByClassName("item")[0]).scope().isSolutionVisible();
    var obj = document.getElementsByClassName("item")[0].getElementsByClassName("solution");
    var solution = obj[obj.length - 1]; 
    if(!isVisible) { 
        solution.classList.add("ng-hide"); 
        showSolutionButton.innerHTML = "Mostrar solução";
    }
}

function toggleSolution() {
    var obj = document.getElementsByClassName("item")[0].getElementsByClassName("solution");
    var solution = obj[obj.length - 1]; 

    if(solution.classList.contains("ng-hide")) {
        solution.classList.remove("ng-hide");
        showSolutionButton.innerHTML = "Esconder solução";
    } else {
        solution.classList.add("ng-hide");
        showSolutionButton.innerHTML = "Mostrar solução";
    }
}

function toggleMark() {
    if(!correctAnswerMark) return;

    if(correctAnswerMark.classList.contains("ng-hide")) {
        correctAnswerMark.classList.remove("ng-hide");
        correctChoiceText.style = "color: rgb(59, 209, 99) !important;";
        showCorrectMarkButton.innerHTML = "Esconder Resposta";
    } else {
        correctAnswerMark.classList.add("ng-hide");
        correctChoiceText.style = "";
        showCorrectMarkButton.innerHTML = "Mostrar resposta";
    }
}

function getOptionTextSize(optionElement) {
    return getOptionText(optionElement).getBoundingClientRect().width;
}

function getOptionText(choice) {
    var text = choice.getElementsByClassName("geekieui-custom-form")[0].getElementsByClassName("radio-container")[0].getElementsByClassName("radio")[0].getElementsByClassName("content")[0].children[0];
    return text;
}

function showCorrectAnswer() {
    if(angular && document.getElementsByClassName("item")[0] && document.getElementsByClassName("item")[0].getElementsByClassName("choices")[0]) {
        var questions = document.getElementsByClassName("geekieui-lo-step-item");
        for(var i = 0; i < questions.length; i++) {
            questions[i].onclick = function() {
                setTimeout(showCorrectAnswer, 251);
            };
        }

        document.getElementsByClassName("fixed-footer")[0].getElementsByClassName("next")[0].onclick = function() {
            setTimeout(showCorrectAnswer, 251);
        };
        
        document.getElementsByClassName("fixed-footer")[0].getElementsByClassName("previous")[0].onclick = function() {
            setTimeout(showCorrectAnswer, 251);
        };

        resetSolutionVisiblitiy();
        markCorrectChoice();
    };
}

document.addEventListener("CorrectIconULRReceive", function(e) {
    correctIconURL = e.detail;
    if(angular && document.getElementsByClassName("item")[0] && document.getElementsByClassName("item")[0].getElementsByClassName("choices")[0]) {
        addShowSolutionButton();
        addToggleCorrectAnswerMark();
    }
    showCorrectAnswer();
});