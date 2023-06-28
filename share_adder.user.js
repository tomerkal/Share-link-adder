// ==UserScript==
// @name         Share link adder
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Add the Share button next to "Other Answers" in relevant review queues
// @author       Tomer Kalish
// @match        https://*.stackoverflow.com/review/*
// @exclude      *://chat.stackoverflow.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @updateURL    https://github.com/tomerkal/Share-link-adder/raw/main/share_adder.user.js
// @downloadURL  https://github.com/tomerkal/Share-link-adder/raw/main/share_adder.user.js
// ==/UserScript==

(new MutationObserver(check)).observe(document.querySelector(".js-review-content"), {childList: true, subtree: true});

function check(changes, observer) {
    if(document.querySelector('#panel-answers')) {
        observer.disconnect();
        'use strict';

        // Iterate over "Other answers"
        const answers_panel = document.querySelector('#panel-answers');
        const answers = answers_panel.getElementsByClassName('answer');
        for (let i = 0; i < answers.length; i++) {
            // Get the answer ID
            const answer = answers[i];
            const answer_id = answer.getAttribute("data-answerid");

            // Create the link
            const a = document.createElement('a');
            a.setAttribute('href', "/a/".concat(answer_id));
            a.setAttribute('rel', "nofollow");
            a.setAttribute('itemprop', "url");
            a.setAttribute('class', "js-share-link js-gps-track");
            a.setAttribute('title', "Short permalink to this answer");
            a.setAttribute('data-controller', "se-share-sheet s-popover");
            a.setAttribute('data-se-share-sheet-title', "Share a link to this answer");
            a.setAttribute('data-se-share-sheet-post-type', "answer");
            a.setAttribute('data-se-share-sheet-social', "facebook twitter devto");
            a.setAttribute('data-s-popover-placement', "bottom-start");
            a.setAttribute('aria-controls', "se-share-sheet-0");
            a.setAttribute('data-action', " s-popover#toggle se-share-sheet#preventNavigation s-popover:show->se-share-sheet#willShow s-popover:shown->se-share-sheet#didShow");
            a.setAttribute('aria-expanded', "false");
            a.innerHTML = "Share";

            // Add the a element to the answer object
            answer.querySelector(".post-layout > .answercell > .mt24 > .ai-start > .mr16 > .js-post-menu").appendChild(a);
        }
    }
}
