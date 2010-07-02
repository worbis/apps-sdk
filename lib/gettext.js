/**
 * gettext.js ( http://code.google.com/p/gettext-js/ )
 *
 * @author     Maxime Haineault, 2007 (max@centdessin.com)
 * @version    0.1.0
 * @licence    M.I.T
 * @example:
 *
 *   Gettext.lang = 'de';
 *   Gettext.gettext('hello %s','world');
 *   _('hello %s','world');
 *
 */

if (typeof(bt) == 'undefined') window.bt = {};

_.extend(bt, { Gettext: Class.extend({

  init: function(lang) {
    var sysLang = navigator.language || navigator.systemLanguage;
    sysLang=sysLang.toLowerCase().substr(0,2);
    this.lang         = lang || sysLang || 'en';
    this.debug        = false;
    this.LCmessages   = {};
    this.links        = [];
    this.linksPointer = 0;
    this.currentFetch = false;
    var links = new Array();
	var gt = this;
    $('link').each(function(idx, link){
      if (link.rel == 'gettext' && $(link).attr("href") && link.lang){
	    links[idx] = [link.lang, $(link).attr("href")];
		gt.include(link.lang, $(link).attr("href"));
      }
    });
    this.links = links;
  },

  gettext: function() {
    if (!arguments || arguments.length < 1 || !RegExp) return;
    var str      = arguments[0];
    arguments[0] = null;
    arguments = Array.prototype.slice.call(arguments);
    arguments = arguments.slice(1);

    if (arguments.length == 1 && typeof arguments[0] == 'object') {
      arguments = arguments[0];
    }
    var strReg = new RegExp('%', 'g');
    hasTokens = strReg.exec(str);
    if (hasTokens && hasTokens.length != arguments.length) {
      return;
    }

    // Try to find translated string
    if (this.LCmessages[this.lang] && $.inArray(str, this.LCmessages[this.lang].msgid) != -1) {
      str = this.LCmessages[this.lang].msgstr[$.inArray(str, this.LCmessages[this.lang].msgid)];
    }

    var re  = /([^%]*)%('.|0|\x20)?(-)?(\d+)?(\.\d+)?(%|b|c|d|u|f|o|s|x|X)(.*)/; //'
    var a   = b = [], i = 0, numMatches = 0;
    while (a = re.exec(str)) {
      var leftpart   = a[1], pPad  = a[2], pJustify  = a[3], pMinLength = a[4];
      var pPrecision = a[5], pType = a[6], rightPart = a[7];
      numMatches++;
      if (pType == '%') subst = '%';
      else {
	var param = arguments[i];
	var pad   = '';
	if (pPad && pPad.substr(0,1) == "'") pad = leftpart.substr(1,1);
	else if (pPad) pad = pPad;
	var justifyRight = true;
	if (pJustify && pJustify === "-") justifyRight = false;
	var minLength = -1;
	if (pMinLength) minLength = parseInt(pMinLength);
	var precision = -1;
	if (pPrecision && pType == 'f') precision = parseInt(pPrecision.substring(1));
	var subst = param;
	if (pType == 'b')      subst = parseInt(param).toString(2);
	else if (pType == 'c') subst = String.fromCharCode(parseInt(param));
	else if (pType == 'd') subst = parseInt(param) ? parseInt(param) : 0;
	else if (pType == 'u') subst = Math.abs(param);
	else if (pType == 'f') subst = (precision > -1) ? Math.round(parseFloat(param) * Math.pow(10, precision)) / Math.pow(10, precision): parseFloat(param);
	else if (pType == 'o') subst = parseInt(param).toString(8);
	else if (pType == 's') subst = param;
	else if (pType == 'x') subst = ('' + parseInt(param).toString(16)).toLowerCase();
	else if (pType == 'X') subst = ('' + parseInt(param).toString(16)).toUpperCase();
      }
      str = leftpart + subst + rightPart;
      i++;
    }
    return str;
  },

  include: function(lang, href) {
    this.currentFetch  = lang;
    var data  = btapp.resource(href);
    this.LCmessages[this.currentFetch] = this.parse(data);
    this.currentFetch = false;
  },

  parse: function(str) {
    // #  translator-comments
    // #. extracted-comments
    // #: reference...
    // #, flag...
    // #| msgid previous-untranslated-string
    // msgid untranslated-string
    // msgstr translated-string

    rgx_msg  = new RegExp(/(^#[\:\.,~|\s]\s?)+/gm);
    function clean(str) {
      return str.replace(rgx_msg,'').replace("msgid ", "").replace("msgstr ", "").replace(/\"/g,'');
    }

    po        = str.split("\n");
    head      = [];
    msgids    = [];
    strings   = [];
    obs       = [];
    tpls      = [];
    curMsgid  = -1;
    output    = { header: [], contexts: [], msgid: [], msgidplurals: [], references: [], flags: [], msgstr: [], obsoletes: [], previousUntranslateds: [], previousUntranslatedsPlurals: [] };

    for(x=0, cnt=po.length; x<cnt; ++x) {
      if (po[x].substring(0,1) == '#') {
	switch (po[x].substring(1,2)) {
	  // translator-comments
	case ' ':
	  // top comments
	  if (curMsgid == 0) output.header.push(po[x]);
	  break;

	  // references
	case ':':
	  if(typeof output.references[curMsgid] == 'undefined') output.references[curMsgid] = [];
	  output.references[curMsgid].push(clean(po[x]));
	  break;

	  // msgid previous-untranslated-string
	case '|':
	  if(typeof output.previousUntranslateds[curMsgid] == 'undefined') output.previousUntranslateds[curMsgid] = [];
	  // previous-untranslated-string-plural
	  if (po[x].substring(3,15) == 'msgid_plural') {
	    output.previousUntranslateds[curMsgid].push(clean(po[x]));
	  }
	  else {
	    output.previousUntranslatedsPlurals[curMsgid].push(clean(po[x]));
	  }
	  break;

	  // flags
	case ',':
	  if(typeof output.flags[curMsgid] == 'undefined') output.flags[curMsgid] = [];
	  output.flags[curMsgid].push(clean(po[x]));
	  break;

	  // obsoletes
	case '~':
	  if (po[x].substring(3,9) == 'msgid ') {
	    curMsgid++;
	    if(typeof output.msgid[curMsgid] == 'undefined') output.msgid[curMsgid] = [];
	    output.msgid[curMsgid]= clean(po[x]);
	    output.obsoletes.push(curMsgid);
	  }
	  else if (po[x].substring(3,10) == 'msgstr ') {
	    if(typeof output.msgstr[curMsgid] == 'undefined')    output.msgstr[curMsgid] = [];
	    output.msgstr[curMsgid]= clean(po[x]);
	  }
	  break;
	}
      }
      else {
	// untranslated-string
	if (po[x].substring(0,6) == 'msgid ') {
	  if (po[x].substring(6,8) != '""')  {
	    curMsgid++;
	    if(typeof output.msgid[curMsgid] != 'object') output.msgid[curMsgid] = [];
	    output.msgid[curMsgid]=clean(po[x]);
	  }
	}

	// untranslated-string-plural
	if (po[x].substring(0,13) == 'msgid_plural ') {
	  if (!output.msgidplurals[curMsgid]) output.msgidplurals[curMsgid] = [];
	  output.msgidplurals[curMsgid].push(clean(po[x]));
	}

	// translated-string
	if (po[x].substring(0,6) == 'msgstr') {
	  if (po[x].substring(8,10) != '""')  {
	    // translated-string-case-n
	    if (po[x].substring(6,7) == '[') {}
	    else {
	      if (!output.msgstr[curMsgid]) output.msgstr[curMsgid] = [];
	      output.msgstr[curMsgid]=clean(po[x]);
	    }
	  }
	}

	// context
	if (po[x].substring(0,7) == 'msgctxt ') {
	  if (!output.contexts[curMsgid]) output.contexts[curMsgid] = [];
	  output.contexts[curMsgid].push(clean(po[x]));
	}
      }
    }
    return output;
  }
})});
