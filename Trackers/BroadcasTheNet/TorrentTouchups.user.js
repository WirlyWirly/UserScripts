// ==UserScript==
// @name	BTN - Torrent Touch-ups
// @author	WIRLYWIRLY
// @namespace	https://github.com/WirlyWirly
// @version 	0.4
// @description	Touch-up torrent listings to enhance user experience.

// @match   https://broadcasthe.net/torrents.php?id=*
// @icon	https://broadcasthe.net/favicon.ico

// @homepage	https://github.com/WirlyWirly/UserScripts/blob/main/Trackers/BroadcasTheNet/TorrentTouchups.user.js
// @updateURL	https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/BroadcasTheNet/TorrentTouchups.user.js?raw=true
// @downloadURL	https://raw.githubusercontent.com/WirlyWirly/UserScripts/main/Trackers/BroadcasTheNet/TorrentTouchups.user.js?raw=true

// @grant 		none
// @run-at 		document-end
// ==/UserScript==

var all_torrents = document.querySelectorAll("[id^='torrent_']")
for (i=0; torrent=all_torrents[i]; i++) {
    // Remove Elements
    var peers = torrent.getElementsByClassName('linkbox')[0]
    peers.parentNode.removeChild(peers)
    var sub_table = torrent.getElementsByTagName('table')[1]
    sub_table.parentNode.removeChild(sub_table)

    // Hide File-list
    var files_table = torrent.getElementsByTagName('table')[0]
    files_table.setAttribute('style', 'display: none')

    // File-list Toggle
    var files_click = document.createElement('div')
    files_click.className = 'colhead_dark'
    files_click.setAttribute("onClick", "this.nextSibling.style.display=''; this.style.display='none'")
    files_click.setAttribute('style', 'padding: 5px; border: 1px solid #3d3d3d')
    files_click.innerHTML = '<strong>Click to show Filelist</strong>'
    files_table.parentNode.insertBefore(files_click, files_table)

    // MediaInfo
    mediainfo = torrent.getElementsByTagName("blockquote")[1]

    // ------------------------------ General ------------------------------
    try {
        mi_g = mediainfo.innerHTML.match(/(General<br>[\s\S]+?)Video<br>/)[0]
    } catch {
        continue
    }

    try {
        mi_g_container = mi_g.match(/Format\s+[\:\s]+?([\w][\-\w\s]+)/)[1]
    } catch {
        mi_g_container = 'N/A'
    }
    try {
        mi_g_duration = mi_g.match(/Duration\s+[\:\s]+?([\w][\w\s]+)/)[1]
    } catch {
        mi_g_duration = 'N/A'
    }

    try {
        mi_g_filesize = mi_g.match(/File size\s+[\:\s]+?([\w][\w\s.]+)/)[1]
    } catch {
        mi_g_filesize = 'N/A'
    }

    // ------------------------------ Video ------------------------------
    try {
        mi_v = mediainfo.innerHTML.match(/(Video<br>[\s\S]+?)Audio<br>/)[0]
    } catch {
        continue
    }
    try {
        mi_v_codec = mi_v.match(/Format\s+[\:\s]+?([\w][\w\s]+)/)[1]
    } catch {
        mi_v_codec = 'N/A'
    }

    try {
        mi_v_resolution_w = mi_v.match(/Width\s+[\:\s]+?([\d][\d\s]+)/)[1].replace(/ /g, '')
        mi_v_resolution_h = mi_v.match(/Height\s+[\:\s]+?([\d][\d\s]+)/)[1].replace(/ /g, '')
    } catch {
        mi_v_resolution_w = 'none'
        mi_v_resolution_h = 'none'
    }

    try {
        mi_v_aspectratio = mi_v.match(/Display aspect ratio\s+[\:\s]+?([\w][\:\w\s]+)/)[1]
    } catch {
        mi_v_aspectratio = 'N/A'
    }
    try {
        mi_v_framerate = mi_v.match(/Frame rate\s+[\:\s]+?([\d][\.\w\s]+)/)[1]
    } catch {
        mi_v_framerate = 'N/A'
    }
    try {
        mi_v_bitrate = mi_v.match(/Bit rate\s+[\:\s]+?([\d][\.\/\w\s]+)/)[1].replace(/ /g, '')
    } catch {
        mi_v_bitrate = 'N/A'
    }

    // ------------------------------ Audio ------------------------------
    try {
        mi_a = mediainfo.innerHTML.match(/(Audio[\#\s\d]*<br>[\s\S]+)/)[0]
    } catch {
        continue
    }
    try {
        mi_a_codec = mi_a.match(/Format\s+[\:\s]+?([\w][\-\w\s]+)/)[1]
    } catch {
    	mi_a_codec = 'N/A'
    }

    try {
	    mi_a_channels = mi_a.match(/Channel\(s\)\s+[\:\s]+?([\w][\.\w\s]+)/)[1]
	} catch {
        mi_a_channels = 'N/A'
    }

    try {
        mi_a_language = mi_a.match(/Language\s+[\:\s]+([\w][\w\s]+)/)[1]
    } catch {
        mi_a_language = 'N/A'
    }

    try {
        mi_a_bitrate = mi_a.match(/Bit rate\s+[\:\s]+?([\d][\w\s]+)/)[1].replace(/ /g, '')
    } catch {
        mi_a_bitrate = 'N/A'
    }


    // ------------------------------ MediaInfo Overview HTML ------------------------------
    var table_string = "<table><tbody><tr><td><table style=\"border: none; box-shadow: none !important; margin-bottom: 0px !important;\"><tr class=\"colhead_dark\"><td style=\"text-align: center;\"><strong>General</strong></td></tr></table><table style=\"border: none; box-shadow: none !important; margin-bottom: 0px !important;\"><tbody><tr style=\"border: none !important;\"><td style=\"border: none !important; padding: 2px !important\">Container:</td><td style=\"border: none !important; padding: 2px !important\">-mi_g_container-</td></tr><tr style=\"border: none !important;\"><td style=\"border: none !important; padding: 2px !important\">Runtime:</td><td style=\"border: none !important; padding: 2px !important\">-mi_g_duration-</td></tr><tr style=\"border: none !important;\"><td style=\"border: none !important; padding: 2px !important\">Size:</td><td style=\"border: none !important; padding: 2px !important\">-mi_g_filesize-</td></tr></tbody></table></td><td><table style=\"border: none; box-shadow: none !important; margin-bottom: 0px !important;\"><tr class=\"colhead_dark\"><td style=\"text-align: center;\"><strong>Video</strong></td></tr></table><table style=\"border: none; box-shadow: none !important; margin-bottom: 0px !important;\"><tbody><tr style=\"border: none !important;\"><td style=\"border: none !important; padding: 2px !important\">Codec:</td><td style=\"border: none !important; padding: 2px !important\">-mi_v_codec-</td></tr><tr style=\"border: none !important;\"><td style=\"border: none !important; padding: 2px !important\">Resolution:</td><td style=\"border: none !important; padding: 2px !important\">-mi_v_resolution-</td></tr><tr style=\"border: none !important;\"><td style=\"border: none !important; padding: 2px !important\">Aspect Ratio:</td><td style=\"border: none !important; padding: 2px !important\">-mi_v_aspectratio-</td></tr><tr style=\"border: none !important;\"><td style=\"border: none !important; padding: 2px !important\">Frame rate:</td><td style=\"border: none !important; padding: 2px !important\">-mi_v_framerate-</td></tr><tr style=\"border: none !important;\"><td style=\"border: none !important; padding: 2px !important\">Bit rate:</td><td style=\"border: none !important; padding: 2px !important\">-mi_v_bitrate-</td></tr></tbody></table></td><td><table style=\"border: none; box-shadow: none !important; margin-bottom: 0px !important;\"><tr class=\"colhead_dark\"><td style=\"text-align: center;\"><strong>Audio</strong></td></tr></table><table style=\"border: none; box-shadow: none !important; margin-bottom: 0px !important;\"><tbody><tr style=\"border: none !important;\"><td style=\"border: none !important; padding: 2px !important\">Codec:</td><td style=\"border: none !important; padding: 2px !important\">-mi_a_codec-</td></tr><tr style=\"border: none !important;\"><td style=\"border: none !important; padding: 2px !important\">Channels:</td><td style=\"border: none !important; padding: 2px !important\">-mi_a_channels-</td></tr><tr style=\"border: none !important;\"><td style=\"border: none !important; padding: 2px !important\">Language:</td><td style=\"border: none !important; padding: 2px !important\">-mi_a_language-</td></tr><tr style=\"border: none !important;\"><td style=\"border: none !important; padding: 2px !important\">Bit rate:</td><td style=\"border: none !important; padding: 2px !important\">-mi_a_bitrate-</td></tr></tbody></table></td></tr></tbody></table>"


    // ------------------------------ Assign placeholders ------------------------------
    var table_string = table_string
        .replace('-mi_g_container-', mi_g_container)
    	.replace('-mi_g_duration-', mi_g_duration)
    	.replace('-mi_g_filesize-', mi_g_filesize)
    	.replace('-mi_v_codec-', mi_v_codec)
    	.replace('-mi_v_resolution-', mi_v_resolution_w + 'x' + mi_v_resolution_h)
    	.replace('-mi_v_aspectratio-', mi_v_aspectratio)
    	.replace('-mi_v_framerate-', mi_v_framerate)
    	.replace('-mi_v_bitrate-', mi_v_bitrate)
    	.replace('-mi_a_codec-', mi_a_codec)
    	.replace('-mi_a_channels-', mi_a_channels)
    	.replace('-mi_a_language-', mi_a_language)
    	.replace('-mi_a_bitrate-', mi_a_bitrate)


    // ------------------------------ Append Table ------------------------------
    var mi_table = document.createElement('div')
    mi_table.innerHTML = table_string
    files_click.parentNode.insertBefore(mi_table, files_click)
}
