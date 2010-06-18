This is a tutorial that will introduce adding basic multi-language support to 
apps, using the Media Downloader app covered in [another tutorial](http://github.com/bittorrent/apps-sdk/tree/master/doc/tutorials/media_downloader.md).

If you haven't covered the earlier tutorial, the code that this tutorial 
starts with is found in the [Media Downloader example](http://github.com/bittorrent/apps-sdk/tree/master/examples/media_downloader).

A general Guide to Generating .po Files from .js Files
For open-source multi-language support, GNU gettext and Portable Object (PO) 
files are the gold standard; for this tutorial we are only interested in a few 
programs which extract translatable strings from code and process them into 
machine-readable format.

The xgettext program is capable of extracting translatable strings from code 
written in a variety of languages, but Javascript is not among them. 
Fortunately, the xgettext parsers for Python and Perl work handily on .js 
files as well.
 
Given .js files with gettext-formatted strings (enclose your strings in _() or
gettext()), set the language option to Python via:
	% xgettext -L python [inputfiles]...
	
Save the generated .po file as .pot for use as a translation template. 
Create language-specific .po files in whatever tool you please, then 
generate machine-readable .mo files using the command:
	% msgfmt -o filename.mo filename.po
	
Many tools like Poedit automatically generate .mo files for you; Wordpress 
has a good guide to specific editing tools which is available through 
[the Wordpress Codex](http://codex.wordpress.org/Translating_WordPress)

Of course, once you have these files you have to get them back into 
Javascript; read on to see one way of using jQuery/JSON 
to do so.

Updating media_downloader with multi-language support
Start by making sure that you have a working version of the media_downloader 
app; test the code in a browser using 'apps serve' and in the uTorrent 
client using 'apps package'

The first thing to is update our project and correctly format the code we 
already have. We'll be using a jQuery gettext plugin which supports dynamic 
loading of new language files within a .btapp. Run the following to add it 
to your project:
	% apps add --file=http://...gettext.js

Format all of the strings in index.js so that gettext can parse them; sadly, 
the version of sprintf already in use elsewhere in our code overrides the 
gettext standard _ shorthand, so enclose strings in $.gt.gettext("string"). 
If you use a different sprintf, go ahead and use the _ shorthand.

Before: $("<button class='play'>Play</button>").appendTo(container).click(function() {
After:  $("<button class='play'>"+$.gt.gettext("Play")+"</button>").appendTo(container).click(function() {

There are only three translatable strings in index.js right now; two 
notification messages and 'Play' for downloaded files. Let's make 
things more interesting and add some stuff to display the current 
language and the other options. 

First, add a display container to the top of your index.html file:
	<div id="lang"><span id="current"></span><span id="other"></span></div>
	
And set the initial language to English by adding this line at the beginning 
of $(document).ready:
	$("head").append('<link id="lang" rel="gettext" href="lang/en/en.json" lang="en">');

We'll have to reorganize the language container every time a new language is chosen 
to show the options in the right language, of course. So let's make a list of 
our language options and create a function to print them all out.
	function render_languagebar(){
		var langs = {"fr":$.gt.gettext("French"), "en":$.gt.gettext("English"), "ja":$.gt.gettext("Japanese")}
		var link = $("link#lang");
		$("#other").html("");
		$.each(langs, function(i, item){
			if(i==link.attr("lang")) $("#current").html(sprintf($.gt.gettext("Current language: %s"), item));
			else $("#other").append(" <a class=\"lang\" href=# name=\""+i+"\">"+item+"</a> ");
		});
	}
	
Note that, at the time we call this function, we want to have set the current
the language so that the labels evaluate correctly. 

We'll set the language any time we click a link with the 'lang' class. Add 
this code at the end of $(document).ready:
	  render_languagebar();
	  $("a.lang").live('click', function(){
		  var lang = $(this).attr("name");
		  var link = $("link#lang");
		  link.attr("lang", lang);
		  link.attr("href", "lang/"+lang+"/"+lang+".js");
		  $.gt.load();
		  $.gt.setLang(lang);
		  render_languagebar();
	  });
	  
the .live() function ensures that this code is attached to any new links we 
create, since they are destroyed and recreated every time we choose the 
language.

Now that we're pretty confident that we've laid out all the strings we'll 
need, let's internationalize them. Our end goal is to create JSON files for 
each language with strings and translations laid out as key-value pairs. 
Here's what my fr.js looks like, for example:

{
"": "header text", 
"Play": "Lire", 
"Japanese": "Japonais", 
"French": "Français", 
"There was a problem adding the torrent.": "Il y avait un problème en ajoutant le torrent.", 
"Current language: %s": "Langage courant: %s", 
"Adding a torrent, please be patient...": "Ajout d'un torrent, patientez s'il vous plaît.", 
"English": "Anglais"
}

And ja.js:

{
"": "header text", 
"Play": "再生する", 
"Japanese": "日本語", 
"French": "フランス語", 
"There was a problem adding the torrent.": "トレントダウンロードは失敗しました。未知のエラー", 
"Current language: %s": "選択した言語: %s", 
"Adding a torrent, please be patient...": "トレント内容を読み込み中です。しばらくお待ちください。", 
"English": "英語"
}

First, create a .pot file from your code using xgettext. Unix/Linux users will 
already have this program installed; Windows users can install Cygwin for 
access to all gettext utilities or do a quick search for 'windows gettext'. 
In any case, run the following command from the lib directory:
	% xgettext -L python index.js
	
Rename the resulting messages.po file as media_downloader.pot. Create a 'lang' 
directory in your top-level media_downloader folder where all of your 
translation files will live and copy over the .pot file. 

Open the .pot in your favorite .po editor (Poedit is a popular option) and 
create as many translations as you please. Save the resulting .po and .mo 
files in your lang directory.

To generate the JSON for each language, run the following command from the 
media_downloader file:
	% apps localize
	
Your translation files will be copied into an organized directory structure 
and your .mo files will be converted into JSON. The localize command can use 
a different directory name with the --dir= option; lang is the default. 
Your original translation files are kept in the lang directory by default; 
to remove them, use the -r option:
	% apps localize -r
	
Note that this command asusmes your .mo files have the same name as their 
respective .po files, which is true for Poedit-generated files.

Confirm that your .js files look like those in Option 1 above, then check your 
code using apps serve. You should see the language bar rendering in the 
browser and the language should automatically change when you click a language 
link. When you click on a torrent link, the notification message should also 
display in the right language.