---
layout: default
title: Internationalization
---

This is a tutorial that will introduce adding basic multi-language support to
apps, using the Media Downloader app covered in [another tutorial](media_downloader.html).

If you haven't covered the earlier tutorial, the code that this tutorial
starts with is found in the [Media Downloader example](media_downloader.html).

# A general Guide to Generating .po Files from .js Files

For open-source multi-language support, GNU gettext and Portable Object (PO)
files are the gold standard; for this tutorial we are only interested in a few
programs which extract translatable strings from code and process them into
machine-readable format.

The xgettext program is capable of extracting translatable strings from code
written in a variety of languages, but Javascript is not among
them. Fortunately, the xgettext parsers for Python and Perl work handily on .js
files as well.

Given .js files with gettext-formatted strings (enclose your strings in
gettext()), set the language option to Python via:

    % xgettext -L python [inputfiles]...

Save the generated .po file as .pot for use as a translation template.
Create language-specific .po files in whatever tool you please, then
generate machine-readable .mo files using the command:

    % msgfmt -o filename.mo filename.po

Many tools like Poedit automatically generate .mo files for you; Wordpress
has a good guide to specific editing tools which is available through
[the Wordpress Codex](http://codex.wordpress.org/Translating_WordPress)

# Updating media_downloader with multi-language support

Start by making sure that you have a working version of the media_downloader
app; test the code in a browser using `apps serve` and in the uTorrent
client using `apps package`

The first thing to is update our project and correctly format the code we
already have. We'll be using an extension of the bt obejct which supports 
dynamic loading of new language files within a .btapp. Run the following to 
add it to your project:

    % apps add --file=http://...gettext.js

Format all of the strings in index.js so that gettext can parse them; enclose
strings in `bt.Gettext.gettext("string")`.

- Before

    $("<button class='play'>Play</button>").appendTo(container).click(
        function() {

- After

    $("<button class='play'>"+bt.Gettext.gettext("Play")+"</button>").appendTo(
        container).click(function() {

There are only three translatable strings in index.js right now; two
notification messages and 'Play' for downloaded files. Let's make
things more interesting and add code to display the current
language and the other options.

First, add a display container to the top of your `html/index.html` file:

    <div id="lang"><span id="current"></span><span id="other"></span></div>

Create an object containing your language options at the top of `index.js`:

	var languages = {"fr":"French", "en":"English", "ja":"Japanese"};
	
All of the language-specific links, text, etc. will be generated from 
this list, so you can easily add a new language without changing the following 
code.

Generate the links for each language by adding the following to 
`$(document).ready()`:

  var link_template = ["link", {"class":"lang", "rel":"gettext", "href":"lang/"+"{{l}}"+"/"+"{{l}}"+".po", "lang":"{{l}}"}];
  $.each(languages, function(i, item){
	$("head").append($(JUP.html({ l:i }, link_template)));
  });

We'll have to reorganize the language container every time a new language is
chosen to show the options in the right language, of course. This function 
will handle printing out all of the options:

function render_languagebar(){
	$("#other").html("");
	$.each(languages, function(i, item){
		if(i==bt.Gettext.lang){
			var langstr = bt.Gettext.gettext(item);
			$("#current").html(bt.Gettext.gettext("Current language: %s", langstr));
		}else $("#other").append(" <a class=\"lang\" href=# name=\""+i+"\">"+bt.Gettext.gettext(item)+"</a> ");
	});
}

Note that, at the time we call this function, we want to have set the current
language so that the labels evaluate correctly.

We'll set the language any time we click a link with the 'lang' class. Add
this code at the end of `$(document).ready()`:

    bt.Gettext.initialize();
    bt.Gettext.lang = 'en';
    render_languagebar();
    $("a.lang").live('click', function(){
    	var lang = $(this).attr("name");
	    bt.Gettext.lang = lang;
	    render_languagebar();
    });

The `.live()` function ensures that this code is attached to any new links we
create, since they are destroyed and recreated every time we choose the
language.

Now that we're pretty confident that we've laid out all the strings we'll
need, let's internationalize them. 

First, create a .pot file from your code using xgettext. Unix/Linux users will
already have this program installed; Windows users can install Cygwin for
access to all gettext utilities or do a quick search for 'windows gettext'.
In any case, run the following command from the lib directory:

    % xgettext -L python index.js

Rename the resulting `messages.po` file as `media_downloader.pot`. Create a
`lang` directory in your top-level media_downloader folder where all of your
translation files will live and copy over the .pot file.

Open the .pot in your favorite .po editor (Poedit is a popular option) and
create as many translations as you please. Save the resulting .po and .mo
files in your lang directory.

Finally, run the following command from the media_downloader file:

    % apps localize

Your translation files will be copied into an organized directory structure. 
The localize command can use a different directory name with the --dir= 
option; lang is the default. Your original translation files are kept in the lang 
directory by default; to remove them, use the -r option:

    % apps localize -r
	
Note that this command asusmes your .mo files have the same name as their
respective .po files, which is true for Poedit-generated files.

Confirm that the localize command worked successfully, then check your
code using apps serve. You should see the language bar rendering in the
browser and the language should automatically change when you click a language
link. When you click on a torrent link, the notification message should also
display in the right language.
