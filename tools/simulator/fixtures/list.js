/*
 * Testing fixtures for settings
 *
 * This ends up being used by simulator/api.js. For each call to getSettings,
 * the next element of the list will be fetched. If the end of the list has
 * been reached, it will just move back to the front again. 
 *
 * Copyright(c) 2010 BitTorrent Inc.
 * License: ************
 */

_(btapp.fn).extend({
  _label: [["ubuntu", 1]],
  _torrents: [
    ["98C5C361D0BE5F2A07EA8FA5052E5AA48097E7F6",201,
     "ubuntu-9.10-desktop-i386.iso",723488768,1000,683642880,138821632,203,
     8659,54,102395,"ubuntu",4,899,0,1072,126323,-1,0,"","","Seeding",
     "e1bcab6"],
    ["58ACA632A9F68427A8AC8F58CAFA7A72CA067DBA",201,"osol-0906-x86.iso",
     709871616,25,18219008,0,0,1641,985999,1510,"",0,161,14,14,918907,1,
     691652608,"","","Downloading","e3ffc92"],
    ["2AD27E42B949A9F2D19510FD18C32B438186AD61",201,"Fedora-12-i686-Live",
     685769820,0,0,0,0,46,157,25398882,"",0,152,1,1,65536,2,685769820,"","",
     "Downloading","e406844"]
  ],
  _rssfeeds: [
     [1,true,true,false,true,0,
      "Recent Additions|http://torrent.ibiblio.org/feed.php?" +
      "blockId=1&type=rss20",1269284259,[
       ["Epidemic GNU/Linux 3.1 i686","Epidemic GNU/Linux 3.1 (i686)",
        "http://torrent.ibiblio.org/doc/176",0,0,1266840144,0,0,0,1,false,
        false],
       ["PC/OS WebStation 10","PC/OS WebStation 10",
        "http://torrent.ibiblio.org/doc/175",0,0,1262934122,0,0,0,1,false,
        false],
       ["CDlinux-0 6 2","CDlinux-0.6.2","http://torrent.ibiblio.org/doc/169",
        0,0,1236647883,0,0,0,1,false,false],
       ["CDlinux-0 9 2","CDlinux-0.9.2","http://torrent.ibiblio.org/doc/168",
        0,0,1236623946,0,0,0,1,false,false],
       ["WP Clipart 7.1","WP Clipart 7.1","http://torrent.ibiblio.org/doc/167",
        0,0,1232721039,0,0,0,1,false,false],
       ["EnGarde Secure Community 3.0.22 x86 64",
        "EnGarde Secure Community 3.0.22 (x86_64)",
        "http://torrent.ibiblio.org/doc/166",0,0,1228829763,0,0,0,1,false,
        false],
       ["EnGarde Secure Community 3.0.22 i686",
        "EnGarde Secure Community 3.0.22 (i686)",
        "http://torrent.ibiblio.org/doc/165",0,0,1228829691,0,0,0,1,false,
        false],
       ["PC/OS 2009 OpenDesktop","PC/OS 2009 OpenDesktop",
        "http://torrent.ibiblio.org/doc/163",0,0,1227144568,0,0,0,1,false,
        false],
       ["OpenOffice-3 0","OpenOffice-3.0","http://torrent.ibiblio.org/doc/162",
        0,0,1224775592,0,0,0,1,false,false],
       ["VCL-vm-1 6","VCL-vm-1.6","http://torrent.ibiblio.org/doc/161",0,0,
        1224771145,0,0,0,1,false,false],
       ["EnGarde Secure Community 3.0.21 x86 64",
        "EnGarde Secure Community 3.0.21 (x86_64)",
        "http://torrent.ibiblio.org/doc/160",0,0,1223384995,0,0,0,1,false,
        false],
       ["EnGarde Secure Community 3.0.21 i686",
        "EnGarde Secure Community 3.0.21 (i686)",
        "http://torrent.ibiblio.org/doc/159",0,0,1223384920,0,0,0,1,false,
        false],
       ["EnGarde Secure Community 3.0.20 x86 64",
        "EnGarde Secure Community 3.0.20 (x86_64)",
        "http://torrent.ibiblio.org/doc/158",0,0,1219150637,0,0,0,1,false,
        false],
       ["EnGarde Secure Community 3.0.20 i686",
        "EnGarde Secure Community 3.0.20 (i686)",
        "http://torrent.ibiblio.org/doc/157",0,0,1219150574,0,0,0,1,false,
        false],
       ["Eclipse SDK 3.4 Ganymede","Eclipse SDK 3.4 (Ganymede)",
        "http://torrent.ibiblio.org/doc/155",0,0,1214398931,0,0,0,1,false,
        false],
       ["Eclipse 3.4 Ganymede","Eclipse 3.4 (Ganymede)",
        "http://torrent.ibiblio.org/doc/154",0,0,1214140614,0,0,0,1,false,
        false],
       ["PC/OS Open Server System 2008","PC/OS Open Server System 2008",
        "http://torrent.ibiblio.org/doc/153",0,0,1213591495,0,0,0,1,false,
        false],
       ["PC/OS OpenWorkstation 2008: Lite","PC/OS OpenWorkstation 2008: Lite",
        "http://torrent.ibiblio.org/doc/152",0,0,1213591420,0,0,0,1,false,
        false],
       ["PC/OS OpenWorkstation 2008","PC/OS OpenWorkstation 2008",
        "http://torrent.ibiblio.org/doc/151",0,0,1213591204,0,0,0,1,false,
        false],
       ["PC/OS Minimal Install CD","PC/OS Minimal Install CD",
        "http://torrent.ibiblio.org/doc/148",0,0,1207112490,0,0,0,1,false,
        false]]]],
  _rssfilters: [[1,1,"New Filter","","","",-1,-1,"",0,0,0,0,"",true,false]]
});
