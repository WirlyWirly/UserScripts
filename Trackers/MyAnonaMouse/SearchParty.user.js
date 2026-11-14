// ==UserScript==
// @name 		MAM - SearchParty
// @author 		WirlyWirly
// @version     2.5
// @description It's a search party! 🥳 Custom search bars and quick-search icons throughout the site

// @match 		https://www.myanonamouse.net/*

// @icon 		https://www.myanonamouse.net/favicon.ico
// @namespace 	https://github.com/WirlyWirly
// @run-at 		document-end

// @require     https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/HelperScripts/gmcSettingsImportExport.js?raw=true
// @require     https://cdn.jsdelivr.net/gh/sizzlemctwizzle/GM_config@43fd0fe4de1166f343883511e53546e87840aeaf/gm_config.js

// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_listValues

// @homepage    https://github.com/WirlyWirly/UserScripts/blob/main/Trackers/MyAnonaMouse/SearchParty.user.js
// @updateURL   https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/MyAnonaMouse/SearchParty.user.js?raw=true
// @downloadURL https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/MyAnonaMouse/SearchParty.user.js?raw=true
// ==/UserScript==

// ----------------------------------- UserScript --------------------------------------

// =================================== CONFIG MENU ======================================

let configFrame = document.createElement('div')
document.body.appendChild(configFrame)

let reloadWindow = false
GM_config.init({
    'id': 'MAM_SearchParty',
    'frame': configFrame,
    'title': `
            <div id="MAM_SearchParty_headerTitleContainer">
                <a id="headerMainText" href="${GM_info.script.homepage}" target="_blank">SearchParty</a>
            </div>

            <div id="headerSubText">
                ★ Hover over settings for details ★ 
            </div>
    `,
    'fields': {
        // ------------------ Settings Import\Export ------------------

        'settingsImport' : {
            'label': 'Import Settings',
            'type': 'button',
            'click': () => { importGMConfigSettings(GM_config.id, GM_info.script.version) },
        },

        'settingsExport' : {
            'label': 'Export Settings',
            'type': 'button',
            'click': () => { exportGMConfigSettings('SearchParty', GM_config.id, GM_info.script.version) },
        },

        // ------------------ OPTIONS ------------------

        'authorIcons': {
            'label': 'Author Icons 🧑',
            'type': 'checkbox',
            'default': true,
            'title': 'Display quick-search icons for each author of a torrent'
        },
        'narratorIcons': {
            'label': 'Narrator Icons 🧑',
            'type': 'checkbox',
            'default': true,
            'title': 'Display quick-search icons for each narrator of a torrent'
        },
        'seriesIcons': {
            'label': 'Series Icons 📚',
            'type': 'checkbox',
            'default': true,
            'title': 'Display quick-search icons for each series of a torrent'
        },

        'oldSearchLinks': {
            'label': 'Old Search Links',
            'type': 'checkbox',
            'default': true,
            'title': "Replace various 'search.php' links (new search page) with 'browse.php' links (old search page)",
        },


        'iconsFontSize': {
            'label': 'Icon FontSize',
            'type': 'text',
            'default': '125%',
            'title': "The fontSize of the emoji icons; Any percentile or CSS 'font-size' value",
        },

        // ------------------ BANNER BARS ------------------

        'searchbar1Enabled': {
            'label': '',
            'type': 'checkbox',
            'default': true,
            'title': ''
        },
        'searchbar1Text': {
            'label': '',
            'type': 'text',
            'default': 'Torrents 🔍',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab",
            'sectin': ['Banner Bars']
        },
        'searchbar1URL': {
            'label': '',
            'type': 'text',
            'default': 'https://www.myanonamouse.net/tor/browse.php?tor[text]={SearchText}&tor[cat][]=0&tor[main_cat]=0',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },

        'searchbar2Enabled': {
            'label': '',
            'type': 'checkbox',
            'default': true,
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },
        'searchbar2Text': {
            'label': '',
            'type': 'text',
            'default': 'AudioBooks 🎧',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },
        'searchbar2URL': {
            'label': '',
            'type': 'text',
            'default': 'https://www.myanonamouse.net/tor/browse.php?tor[text]={SearchText}&tor[cat][]=0&tor[main_cat]=13',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },

        'searchbar3Enabled': {
            'label': '',
            'type': 'checkbox',
            'default': true,
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },
        'searchbar3Text': {
            'label': '',
            'type': 'text',
            'default': 'eBooks 📗',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },
        'searchbar3URL': {
            'label': '',
            'type': 'text',
            'default': 'https://www.myanonamouse.net/tor/browse.php?tor[text]={SearchText}&tor[cat][]=0&tor[main_cat]=14',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },

        'searchbar4Enabled': {
            'label': '',
            'type': 'checkbox',
            'default': true,
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },
        'searchbar4Text': {
            'label': '',
            'type': 'text',
            'default': 'Series 📚',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },
        'searchbar4URL': {
            'label': '',
            'type': 'text',
            'default': 'https://www.myanonamouse.net/tor/browse.php?tor[text]={SearchText}&tor[srchIn]=Series',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },

        'searchbar5Enabled': {
            'label': '',
            'type': 'checkbox',
            'default': true,
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },
        'searchbar5Text': {
            'label': '',
            'type': 'text',
            'default': 'Comics 🦸',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },
        'searchbar5URL': {
            'label': '',
            'type': 'text',
            'default': 'https://www.myanonamouse.net/tor/browse.php?tor[text]={SearchText}&tor[cat][]=61',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },

        'searchbar6Enabled': {
            'label': '',
            'type': 'checkbox',
            'default': true,
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },
        'searchbar6Text': {
            'label': '',
            'type': 'text',
            'default': 'Audible 🔗',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },
        'searchbar6URL': {
            'label': '',
            'type': 'text',
            'default': '#https://www.audible.com/search?keywords={SearchText}',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },

        'searchbar7Enabled': {
            'label': '',
            'type': 'checkbox',
            'default': true,
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },
        'searchbar7Text': {
            'label': '',
            'type': 'text',
            'default': 'Goodreads 🔗',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },
        'searchbar7URL': {
            'label': '',
            'type': 'text',
            'default': '#https://www.goodreads.com/search?q={SearchText}',
            'title': "The URL that will be opened when pressing Enter\n\nℹ️ The variable '{SearchText}' will be replaced with the text that was entered\n\nℹ️ Prepend the URL with a '#' to open the search in a new tab"
        },

    },
    "events": {
        "open": function (doc) {

            let panelStyle = this.frame.style
            panelStyle.inset = '2% 2% auto auto'
            panelStyle.width = '380px'
            panelStyle.height = 'auto'
            
            document.getElementById('MAM_SearchParty_wrapper').style.padding = '35px 16px 35px 16px'

            reloadWindow = false

            // Collapse Searchbar fields into a single row
            for (let i = 1; i <= 7; i++) {
                let checkboxRowElement = doc.getElementById(`MAM_SearchParty_field_searchbar${i}Enabled`).parentElement
                let searchTextElement = doc.getElementById(`MAM_SearchParty_field_searchbar${i}Text`)
                searchTextElement.setAttribute('style', 'margin: 2%; width: 30%')
                let searchURLElement = doc.getElementById(`MAM_SearchParty_field_searchbar${i}URL`)

                searchTextElement.parentElement.remove()
                searchURLElement.parentElement.remove()

                checkboxRowElement.appendChild(searchTextElement)
                checkboxRowElement.appendChild(searchURLElement)
            }
            // --- Settings Import\Export ---
            let exportButton = document.getElementById('MAM_SearchParty_field_settingsExport')
            exportButton.classList.add('saveclose_buttons')

            let importButton = document.getElementById('MAM_SearchParty_field_settingsImport')
            importButton.classList.add('saveclose_buttons')

            let buttonsHolderElement = document.getElementById('MAM_SearchParty_buttons_holder')
            buttonsHolderElement.appendChild(importButton)
            buttonsHolderElement.appendChild(exportButton)

            // Remove the now empty <div> elements
            for ( let emptyElement of document.getElementById('MAM_SearchParty').querySelectorAll('div.config_var:empty') ) {
                emptyElement.remove()
            }
            
            // --- Version Element ---
            let versionSVG = '<svg width="16" height="16" viewBox="0 0 98 96" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_730_27136)"><path d="M41.4395 69.3848C28.8066 67.8535 19.9062 58.7617 19.9062 46.9902C19.9062 42.2051 21.6289 37.0371 24.5 33.5918C23.2559 30.4336 23.4473 23.7344 24.8828 20.959C28.7109 20.4805 33.8789 22.4902 36.9414 25.2656C40.5781 24.1172 44.4062 23.543 49.0957 23.543C53.7852 23.543 57.6133 24.1172 61.0586 25.1699C64.0254 22.4902 69.2891 20.4805 73.1172 20.959C74.457 23.543 74.6484 30.2422 73.4043 33.4961C76.4668 37.1328 78.0937 42.0137 78.0937 46.9902C78.0937 58.7617 69.1934 67.6621 56.3691 69.2891C59.623 71.3945 61.8242 75.9883 61.8242 81.252L61.8242 91.2051C61.8242 94.0762 64.2168 95.7031 67.0879 94.5547C84.4102 87.9512 98 70.6289 98 49.1914C98 22.1074 75.9883 6.69539e-07 48.9043 4.309e-07C21.8203 1.92261e-07 -1.9479e-07 22.1074 -4.3343e-07 49.1914C-6.20631e-07 70.4375 13.4941 88.0469 31.6777 94.6504C34.2617 95.6074 36.75 93.8848 36.75 91.3008L36.75 83.6445C35.4102 84.2188 33.6875 84.6016 32.1562 84.6016C25.8398 84.6016 22.1074 81.1563 19.4277 74.7441C18.375 72.1602 17.2266 70.6289 15.0254 70.3418C13.877 70.2461 13.4941 69.7676 13.4941 69.1934C13.4941 68.0449 15.4082 67.1836 17.3223 67.1836C20.0977 67.1836 22.4902 68.9063 24.9785 72.4473C26.8926 75.2227 28.9023 76.4668 31.2949 76.4668C33.6875 76.4668 35.2187 75.6055 37.4199 73.4043C39.0469 71.7773 40.291 70.3418 41.4395 69.3848Z" fill="#FFFFFFF6"/></g><defs><clipPath id="clip0_730_27136"><rect width="98" height="96" fill="white"/></clipPath></defs></svg>'

            let versionElement = document.createElement('a')
            versionElement.classList = 'version_label reset'
            versionElement.title = 'Go to Homepage'
            versionElement.target = '_blank'
            versionElement.href = `${GM_info.script.homepage}`
            versionElement.innerHTML = `${versionSVG} Version ${GM_info.script.version}`

            doc.getElementById('MAM_SearchParty_buttons_holder').appendChild(versionElement)

            // Add success animation to save button
            let saveButton = doc.getElementById('MAM_SearchParty_saveBtn')
            saveButton.addEventListener('click', () => {
                saveButton.classList.add('success')
                setTimeout(() => saveButton.classList.remove('success'), 500)
            })

        },
        "save": function () {
            reloadWindow = true
            // Clear cached data when settings are saved
            GM_listValues().forEach(key => {
                if (key !== 'MAM_SearchParty') {
                    GM_setValue(key, null)
                }
            })
            console.log(`${GM_info.script.name}: Cleared cache data after settings change`)
        },
        "close": function () {
            if (reloadWindow) {
                if (this.frame) {
                    window.location.reload()
                } else {
                    setTimeout(() => {
                        window.location.reload()
                    }, 250)
                }
            }
        },
        "reset": function () {
            // Handle reset functionality
            if (typeof resetToDefaults === 'function') {
                resetToDefaults()
            }
        }
    },
    'css': `

        :root {

            /* ---------- PanelElement ---------- */
            --panelBackgroundColor: rgba(25, 29, 42, 0.64);
            --panelBorderColor: #2C3E50;
            --panelTextColor: #DDDDDD;

            /* ---------- HeaderText ---------- */
            --headerTextSize: 40px;
            --headerTextColor: #FFFFFF;
            --headerTextGlowColor: rgba(0, 124, 255, 0.60);
            --headerSubTextSize: 10px;
            --headerSubTextColor: #B7B7B7;

            /* ---------- InputFields ---------- */
            --inputFieldBackground: #FFFFFFE6;
            --inputFieldText: #191d2a;
            --inputFieldBorder: #ddd;
            --inputFieldInnerShadow: #949494;
            --inputFieldFocusShadow: #a8afbd;

            --checkboxCheckedBackground: #0060DF;
            --checkboxCheckedBorder: #4284FF;

            --inputFieldDisabledText: #525252;
            --inputFieldDisabledBackground: #8b8e94;
            --inputFieldDisabledBorder: #545454;

            /* ---------- GMConfig Fields ---------- */
            --labelFieldFontSize: 16px;

            /* ---------- SaveClose Buttons ---------- */
            --buttonClickedColor: #2B67A7;

        }

        #MAM_SearchParty {

            /* ---------- PanelElement ---------- */
            /* Set panel width, height, padding, and inset in open() */

            backdrop-filter: blur(9px);
            background: var(--panelBackgroundColor);
            border-radius: 10px;
            border: 1px solid var(--panelBorderColor) !important;
            box-shadow: 0px 0px 15px var(--panelBorderColor);
            line-height: 22px;
            max-height: 95%;
            max-width: 95%;
            overflow: auto scroll;
            position: fixed;
            touch-action: pan-x pan-y;

            * {
                /* ---------- AllFields ---------- */
                color: var(--panelTextColor);
                font-family: 'Roboto Condensed', arial, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 13px;
                font-weight: normal;
            }

            #headerMainText {
                /* ---------- MainHeader ---------- */
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-color: var(--headerTextColor);
                filter: brightness(110%);
                font-family: 'Lilita One', 'Roboto Condensed', arial, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: var(--headerTextSize);
                font-style: normal;
                font-weight: 400;
                padding: 0px 0px 5px 0px;
                text-decoration: none;
                text-shadow: 0 0 20px var(--headerTextGlowColor);
                user-select: none;
            }

            #headerSubText {
                /* ---------- SubHeader ---------- */
                color: var(--headerSubTextColor);
                cursor: default;
                font-size: var(--headerSubTextSize);
                margin: 0px auto auto auto;
            }

            select, textarea, input[type="text"], input[type="number"], input[type="checkbox"] {

                /* ---------- InputFields ---------- */
                background: var(--inputFieldBackground);
                border-radius: 3px;
                border: 1px solid var(--inputFieldBorder);
                box-shadow: 0 0 2px var(--inputFieldInnerShadow) inset;
                box-sizing: border-box;
                color: var(--inputFieldText);
                font-size: 13px;
                font-weight: 500;
                text-align: center;
                width: 65%;
                
                &:focus {
                    /* --- Focused --- */
                    border: 2px dashed var(--inputFieldFocusShadow) !important;
                    box-shadow: 0 0 2px var(--inputFieldInnerShadow) inset, 0 0 7px var(--inputFieldFocusShadow);
                    outline: none;
                }

                &:checked {
                    /* --- Checked --- */
                    background-color: var(--checkboxCheckedBackground);
                    border: 1px solid var(--checkboxCheckedBorder);
                }

            }

            .field_label {
            /* ---------- GMC Labels ---------- */
            color: var(--panelTextColor);
            margin-right: 6px;
            font-weight: normal;
            font-size: var(--labelFieldFontSize);
            }

            /* ---------- Save\Close Section ---------- */
            div:has( > button.saveclose_buttons) {

                align-items: center;
                column-gap: 14px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-template-rows: 1fr;
                margin-top: 14px;
                row-gap: 14px;
                text-align: center;
                width: 100%;

                .saveclose_buttons {
                    margin: unset;
                    background: var(--panelBorderColor);
                    border-radius: 5px;
                    border: 1px solid var(--panelBackgroundColor);
                    color: var(--panelTextColor);
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: normal;
                    padding-bottom: 6px !important;
                    padding-top: 6px !important;
                    padding: 15px 20px;
                    transition: background-color 0.2s ease, transform 0.2s ease;
                    will-change: background-color, transform;

                    &:hover {
                        background-color: var(--panelBorderColor);
                        transform: translateY(-3px);

                    }

                    &:active {
                        background-color: var(--buttonClickedColor);
                        box-shadow: 0 0px 15px var(--panelBorderColor);
                        transform: translateY(3px);
                    }

                }

                .version_label, .reset {
                    text-align: center;
                    
                    &:hover {
                        text-decoration: underline;
                    }
                }
                
                /* --- Column 1 --- */
                &[value="Save Settings"] {
                    grid-column: 1;
                    grid-row: 1;
                }

                &[value="Export Settings"] {
                    background: none;
                    grid-column: 1;
                    grid-row: 2;
                }

                .version_label {
                    grid-column: 1;
                    grid-row: 3;
                }

                /* --- Column 2 --- */
                &[title="Close window"] {
                    grid-column: 2;
                    grid-row: 1;
                }

                &[title="Import settings"] {
                    background: none;
                    grid-column: 2;
                    grid-row: 2;
                }

                .reset_holder {
                    grid-column: 2;
                    grid-row: 3;
                }

            }

        }


        #MAM_SearchParty .config_var {
            align-items: center;
            border-bottom: none;
            display: flex;
            flex-direction: row;
            justify-content: center;
            margin-bottom: 0px;
            margin-left: auto;
            margin-right: auto;
            margin-top: 6px;
            padding: 0px;
            text-align: left;
            max-width: 90%;
            width: 100%;
        }
        #MAM_SearchParty 
        #MAM_SearchParty .field_label.disabled {
            color: #B0BEC5;
        }

        #MAM_SearchParty input[type="checkbox"] {
            cursor: pointer;
            margin-right: 4px !important;
            width: 16px;
            height: 16px;
        }
        #MAM_SearchParty .reset {
            color: #95a5a6;
            text-decoration: none;
            user-select: none;
        }

        #MAM_SearchParty_field_iconsFontSize {
            width: 50px !important;
        }


        /* Tooltip styling */
        #MAM_SearchParty .field_label[title]:hover::after {
            content: attr(title);
            position: absolute;
            background: #2C3E50;
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 0.8em;
            max-width: 300px;
            z-index: 100;
            margin-top: 25px;
            left: 20px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }

        /* Animations */
        @keyframes pulse {
            0%, 100% {box-shadow: 0 0 6px 2px rgba(255, 128, 0, 0.5);}
            50% {box-shadow: 0 0 10px 4px rgba(255, 128, 0, 0.8);}
        }


        @font-face {
            font-family: 'Lilita One';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url(data:application/octet-stream;base64,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) format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }

    `
})

// Register the menu command to open settings
GM_registerMenuCommand('🛠️ Settings', () => {
    GM_config.open()
})

GM_config.open()

// =================================== CODE ======================================

const authorIcons = GM_config.get('authorIcons')
const narratorIcons = GM_config.get('narratorIcons')
const seriesIcons = GM_config.get('seriesIcons')

const iconsFontSize = GM_config.get('iconsFontSize')
const oldSearchLinks = GM_config.get('oldSearchLinks')

// ----------------------------------- SearchBars --------------------------------------

// The element that will hold the search bars, inserted below the site banner
let searchBarsRowElement = document.createElement('div')
searchBarsRowElement.setAttribute('class', 'flexbox fbCen')

let navBar = document.getElementById('preNav')
navBar.parentElement.insertBefore(searchBarsRowElement, navBar)

for ( let i = 1; i <=7 ; i++ ) {
    // Generate a searchbar for each enabled config 

    let itemEnabled = GM_config.get(`searchbar${i}Enabled`)
    let itemText = GM_config.get(`searchbar${i}Text`)
    let itemURL = GM_config.get(`searchbar${i}URL`)

    if ( itemEnabled == false ) {
        // This searchbar # is disabled, skip creation
        continue
    }

    let searchInput = document.createElement('input')
    searchInput.setAttribute('type', 'text') 
    searchInput.setAttribute('placeholder', itemText)
    searchInput.setAttribute('class', 'ac_combined ui-autocomplete-input')
    searchInput.setAttribute('autocomplete', 'off')
    searchInput.setAttribute('size', '15')
    searchInput.setAttribute('style', 'text-align: center; margin-top: 2pt; margin-bottom: 5pt; margin-right: 5pt')

    searchInput.addEventListener('keypress', function(event) {

        if (event.key == 'Enter') {

            let url = itemURL.replace(/({SearchText}|__SearchText__)/i, `${encodeURIComponent(this.value)}`)

            if ( itemURL.match(/^#/) ) {
                // Open the search in a new tab
                this.value = ''
                window.open(url.substring(1))

            } else {
                // Open the search in the current tab
                window.location = url
            }

        }

    })

    searchBarsRowElement.appendChild(searchInput)

}

function quickSearchIcons(hrefElements, hrefType) {
    // For the provided <a> elements, generate and append the appropriate quickSearch icons

    for ( let element of hrefElements ) {
        // Generate the appropriate type of search icons for each provided <a> element

        let searchId
        hrefType == 'series' ? searchId = element.href.match(/series=(\d+)/)[1] : null
        hrefType == 'author' ?  searchId = element.href.match(/author=(\d+)/)[1] : null
        hrefType == 'narrator' ? searchId = element.href.match(/narrator=(\d+)/)[1] : null

        
        if ( searchId == undefined ) {
            // There was no search id found for this element, cannot create quickSearch icons
            console.log('none')
            continue
        }

        let authorURLS = {
            // The URLS that a user can pick from after clicking on the author name
            'authorEbooks' : `https://www.myanonamouse.net/tor/browse.php?author=${searchId}&tor%5Bcat%5D%5B%5D=0&tor%5Bmain_cat%5D=14`,
            'authorAudiobooks' : `https://www.myanonamouse.net/tor/browse.php?author=${searchId}&tor%5Bcat%5D%5B%5D=0&tor%5Bmain_cat%5D=13`,
            'authorAll' : `https://www.myanonamouse.net/tor/browse.php?author=${searchId}&tor%5Bcat%5D%5B%5D=0`,
        }

        let narratorURLS = {
            // The URLS that a user can pick from after clicking on the narrator name
            'narratorAudiobooks': `https://www.myanonamouse.net/tor/browse.php?narrator=${searchId}&tor%5Bcat%5D%5B%5D=0&tor%5Bmain_cat%5D=13`,
        }

        let seriesURLS = {
            // The URLS that a user can pick from after clicking on the series name
            'seriesEbooks' : `https://www.myanonamouse.net/tor/browse.php?series=${searchId}&tor[cat][]=0&tor[main_cat]=14`,
            'seriesAudiobooks' : `https://www.myanonamouse.net/tor/browse.php?series=${searchId}&tor[cat][]=0&tor[main_cat]=13`,
            'seriesAll' : `https://www.myanonamouse.net/tor/browse.php?series=${searchId}&tor[cat][]=0&tor[main_cat]=0`,
        }


        if ( hrefType == 'author' ) {
            // Apply the quickSearch icons for authors

            for ( let key in authorURLS ) {

                let quickSearchElement = document.createElement('a')
                quickSearchElement.href = authorURLS[key]
                quickSearchElement.classList = 'MAM-SP-QuickSearchIcon'
                quickSearchElement.style.fontSize = iconsFontSize
        
                if ( key == 'authorAll' ) {
                    quickSearchElement.text = '🔍'
                } else if ( key == 'authorAudiobooks') {
                    quickSearchElement.text = '🎧'
                } else if ( key == 'authorEbooks') {
                    quickSearchElement.text = '📗'
                }

                element.insertAdjacentElement('afterend', quickSearchElement)
            }

        } else if ( hrefType == 'narrator' ) {
            // Apply the quickSearch icons for narrators

            for ( let key in narratorURLS ) {

                let quickSearchElement = document.createElement('a')
                quickSearchElement.href = narratorURLS[key]
                quickSearchElement.classList = 'MAM-SP-QuickSearchIcon'
                quickSearchElement.style.fontSize = iconsFontSize
        
                if ( key == 'narratorAudiobooks' ) {
                    quickSearchElement.text = '🔍'
                } 

                element.insertAdjacentElement('afterend', quickSearchElement)

            }

        } else if ( hrefType == 'series' ) {
            // Apply the quickSearch icons for narrators

            for ( let key in seriesURLS ) {

                let quickSearchElement = document.createElement('a')
                quickSearchElement.href = seriesURLS[key]
                quickSearchElement.classList = 'MAM-SP-QuickSearchIcon'
                quickSearchElement.style.fontSize = iconsFontSize
        
                if ( key == 'seriesAll' ) {
                    quickSearchElement.text = '🔍'
                } else if ( key == 'seriesAudiobooks') {
                    quickSearchElement.text = '🎧'
                } else if ( key == 'seriesEbooks') {
                    quickSearchElement.text = '📗'
                }

                element.insertAdjacentElement('afterend', quickSearchElement)

            }

        }
            
    }
}


function replaceBrowseLink(elements) {
    // For the provided <a> element, replace 'search.php' (new search page) with 'browse.php' (old search page)

    for ( let element of elements ) {
        element.href = element.href.replace('search\.php', 'browse\.php')
    }
}


pageURL = document.URL

if ( authorIcons || narratorIcons || seriesIcons ) {

    if ( pageURL.match(/\/tor\/browse\.php/) || pageURL.match(/myanonamouse\.net\/?$/) || pageURL.match(/\/tor\/search\.php/) || pageURL.match(/top10Tor\.php/) ) {
        // These pages require a MutationObserver
        // --- Bookmarks | Browse | Homepage | Search | Top10 ---

        let observer = new MutationObserver(function(mutations) {
            // Functionality to run when changes are detected to the target element

            try {

                // Query for all torrentRows in the target observer
                torrentRows = mutations[0]['target'].querySelectorAll('tr.torrentInfo')

                for ( let torrentRow of torrentRows ) {
                    // Loop through each individual torrentRow, adding search icons to each series of the torrent
                    
                    if ( authorIcons == true ) {
                        // Author quickSearch icons
                        let authorElements = torrentRow.querySelectorAll('a.author[href^="/tor/browse.php?author="], a.author[href^="/tor/search.php?author="]')
                        authorElements.length > 0 ? quickSearchIcons(authorElements, 'author') : null
                    }

                    if ( narratorIcons == true ) {
                        // Narrator quickSearch icons
                        let narratorElements = torrentRow.querySelectorAll('a.narrator[href^="/tor/browse.php?narrator="], a.narrator[href^="/tor/search.php?narrator="]')
                        narratorElements.length > 0 ? quickSearchIcons(narratorElements, 'narrator') : null
                    }

                    if ( seriesIcons == true ) {
                        // Series quickSearch icons
                        let seriesElements = torrentRow.querySelectorAll('a.series[href^="/tor/browse.php?series="], a.series[href^="/tor/search.php?series="]')
                        seriesElements.length > 0 ? quickSearchIcons(seriesElements, 'series') : null
                    }

                }

            } catch(error) {
                console.log(error)
                return

            }
        })

        let target = document.getElementById("ssr")
        let config = { childList: true }

        pageURL.match(/\/top10Tor\.php/) ? target = document.getElementById('top10') : null // Top 10

        // Monitor the target element for any changes
        observer.observe(target, config)

    } else if ( pageURL.match(/\/t\/\d+/) ) {
        // --- Details ---
        
        if ( authorIcons == true ) {
            // Author quickSearch icons
            let authorElements = document.querySelectorAll('#torDetMainCon a[href^="/tor/search.php?author="]')

            if ( authorElements.length > 0 ) {
                quickSearchIcons(authorElements, 'author')
                oldSearchLinks == true ? replaceBrowseLink(authorElements) : null
            }

        }

        if ( narratorIcons == true ) {
            // Narrator quickSearch icons
            let narratorElements = document.querySelectorAll('#torDetMainCon a[href^="/tor/search.php?narrator="]')

            if ( narratorElements.length > 0 ) {
                quickSearchIcons(narratorElements, 'narrator') 
                oldSearchLinks == true ? replaceBrowseLink(narratorElements) : null
            }
        }

        if ( seriesIcons == true ) {
            // Series quickSearch icons
            let seriesElements = document.querySelectorAll('#torDetMainCon a[href^="/tor/search.php?series="]')

            if ( seriesElements.length > 0 ) {
                quickSearchIcons(seriesElements, 'series')
                oldSearchLinks == true ? replaceBrowseLink(seriesElements) : null
            }

        }


    }
}

