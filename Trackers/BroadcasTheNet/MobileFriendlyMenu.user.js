// ==UserScript==
// @name	BTN - Mobile Friendly Menu
// @author	WIRLYWIRLY
// @namespace	https://github.com/WirlyWirly
// @version 	0.1

// @match   https://broadcasthe.net/*
// @icon	https://broadcasthe.net/favicon.ico

// @homepage	https://github.com/WirlyWirly/UserScripts/blob/main/Trackers/BroadcasTheNet/MobileFriendlyMenu.user.js
// @updateURL	https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/BroadcasTheNet/MobileFriendlyMenu.user.js?raw=true
// @downloadURL	https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/BroadcasTheNet/MobileFriendlyMenu.user.js?raw=true

// @description	Main menu buttons are made mobile friendly. Reccomended for use only on mobile devices.
// @run-at 		document-end
// ==/UserScript==

// Home
document.getElementById('nav_index').getElementsByTagName('a')[0].removeAttribute('href')

// TV Info
document.getElementById('nav_tv').getElementsByTagName('a')[0].removeAttribute('href')

// Torrents
document.getElementById('nav_torrent').getElementsByTagName('a')[0].removeAttribute('href')

// Community
document.getElementById('nav_community').getElementsByTagName('a')[0].removeAttribute('href')

// Help & Support
document.getElementById('nav_help').getElementsByTagName('a')[0].removeAttribute('href')

// Points Store
document.getElementById('nav_bonus').getElementsByTagName('a')[0].removeAttribute('href')

// Profile
document.getElementById('nav_user').getElementsByTagName('a')[0].removeAttribute('href')
