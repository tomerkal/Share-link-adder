// ==UserScript==
// @name         Share link adder
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Add the Share button next to "Other Answers" in relevant review queues
// @author       Tomer Kalish
// @match        https://*.stackoverflow.com/review/*
// @match        https://*.stackexchange.com/*
// @match        https://*.askubuntu.com/*
// @match        https://*.superuser.com/*
// @match        https://*.serverfault.com/*
// @match        https://*.mathoverflow.net/*
// @match        https://*.stackapps.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @updateURL    https://github.com/tomerkal/Share-link-adder/raw/main/share_adder.user.js
// @downloadURL  https://github.com/tomerkal/Share-link-adder/raw/main/share_adder.user.js
// ==/UserScript==

(new MutationObserver(check)).observe(document.querySelector(".js-review-content"), {childList: true, subtree: true});

function check(changes, observer) {
    if(document.querySelector('#panel-answers')) {
        observer.disconnect();
        'use strict';

        // Get the max share sheet index
        const popovers = document.querySelectorAll('[id ^= "se-share-sheet-"]');
        let indexes = [];
        Array.prototype.forEach.call(popovers, callback);

        function callback(element, iterator) {
            indexes.push(parseInt(element.id.match(/\d+/)[0], 10));
        }
        const last_index = Math.max.apply(null, indexes)
        let share_index = last_index + 1
        
        // Iterate over "Other answers"
        const answers_panel = document.querySelector('#panel-answers');
        const answers = answers_panel.getElementsByClassName('answer');
        for (let i = 0; i < answers.length; i++) {
            // Get the answer ID
            const answer = answers[i];
            const answer_id = answer.getAttribute("data-answerid");

            // Create the anchor div
            const anchor = document.createElement('div');
            anchor.setAttribute('class', "d-flex gs8 s-anchors s-anchors__muted fw-wrap");

            // Create the flex div
            const flex = document.createElement('div');
            flex.setAttribute('class', "flex--item");

            // Create the link
            const a = document.createElement('a');
            a.setAttribute('href', "/a/".concat(answer_id));
            a.setAttribute('rel', "nofollow");
            a.setAttribute('itemprop', "url");
            a.setAttribute('class', "js-share-link js-gps-track");
            a.setAttribute('title', "Short permalink to this answer");
            a.setAttribute('data-gps-track', "post.click({ item: 2, priv: 17, post_type: 2 })");
            a.setAttribute('data-controller', "se-share-sheet s-popover");
            a.setAttribute('data-se-share-sheet-title', "Share a link to this answer");
            a.setAttribute('data-se-share-sheet-post-type', "answer");
            a.setAttribute('data-se-share-sheet-social', "facebook twitter devto");
            a.setAttribute('data-se-share-sheet-location', "2");
            a.setAttribute('data-se-share-sheet-license-url', "https%3a%2f%2fcreativecommons.org%2flicenses%2fby-sa%2f4.0%2f");
            a.setAttribute('data-se-share-sheet-license-name', "CC BY-SA 4.0");
            a.setAttribute('data-s-popover-placement', "bottom-start");
            a.setAttribute('aria-controls', "se-share-sheet-".concat(share_index.toString()));
            a.setAttribute('data-action', " s-popover#toggle se-share-sheet#preventNavigation s-popover:show->se-share-sheet#willShow s-popover:shown->se-share-sheet#didShow");
            a.setAttribute('aria-expanded', "false");
            a.innerHTML = "Share";

            flex.appendChild(a);

            // Create the pop over div
            const popover = document.createElement('div');
            popover.setAttribute('class', "s-popover z-dropdown s-anchors s-anchors__default");
            popover.setAttribute('style', 'width: unset; max-width: 28em;');
            popover.setAttribute('id', 'se-share-sheet-'.concat(share_index.toString()));
            share_index = share_index + 1;

            // Create the arrow
            const arrow = document.createElement('div');
            arrow.setAttribute('class', "s-popover--arrow");
            popover.appendChild(arrow);

            // Create title div
            const title = document.createElement('div');
            const title_label = document.createElement('label');
            title_label.setAttribute('for', 'share-sheet-input-se-share-sheet-0');
            const title_span = document.createElement('span');
            title_span.setAttribute('class', 'js-title fw-bold');
            title_span.innerHTML = 'Share a link to this answer';
            const subtitle_span = document.createElement('span');
            subtitle_span.setAttribute('class', 'js-subtitle');
            title_label.appendChild(title_span);
            title_label.appendChild(subtitle_span);
            title.appendChild(title_label);
            popover.appendChild(title);

            // Create input div
            const link_div = document.createElement('div');
            link_div.setAttribute('class', 'my8');
            const link_input = document.createElement('input');
            link_input.setAttribute('class', 'js-input s-input wmn3 sm:wmn-initial bc-black-200 bg-white fc-dark');
            link_input.setAttribute('readonly', '');
            link_input.setAttribute('type', 'text');
            link_input.setAttribute('id', 'share-sheet-input-se-share-sheet-0');
            link_div.appendChild(link_input);
            popover.appendChild(link_div);

            // Create buttons div
            const buttons = document.createElement('div');
            buttons.setAttribute('class', 'd-flex jc-space-between ai-center mbn4');
            const copy_link = document.createElement('button');
            copy_link.setAttribute('class', 'js-copy-link-btn s-btn s-btn__link js-gps-track');
            copy_link.setAttribute('data-gps-track', '');
            copy_link.innerHTML = "Copy link";
            const license = document.createElement('a');
            license.setAttribute('class', 'js-license s-block-link w-auto d-none');
            license.setAttribute('href', 'https://creativecommons.org/licenses/by-sa/4.0/');
            license.setAttribute('rel', 'license');
            license.setAttribute('target', '_blank');
            license.setAttribute('title', 'The current license for this post: CC BY-SA 4.0');
            license.innerHTML = "CC BY-SA 4.0";
            const social = document.createElement('div');
            social.setAttribute('class', 'js-social-container d-none');
            buttons.appendChild(copy_link);
            buttons.appendChild(license);
            buttons.appendChild(social);
            popover.appendChild(buttons);

            flex.appendChild(popover);
            anchor.appendChild(flex);
            answer.querySelector(".post-layout > .answercell > .mt24 > .ai-start > .mr16 > .js-post-menu").appendChild(anchor);
        }
        observer.observe(document.querySelector(".js-review-content"), {attributes: true})
    }
}
