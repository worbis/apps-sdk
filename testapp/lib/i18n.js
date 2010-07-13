var gt;
test('gt_init', function(){
	//language defined correctly
	//links loaded correctly
	//bt.resource exists
	//bt.resource doesn't exist
	//messages object populated correctly
	expect(2);
	
	$('head').append("<link rel='gettext' href='lang/test/test.po' lang='test'>");
	$('head').append("<link rel='gettext' href='lang/missing/missing.po' lang='missing'>");
	$('head').append("<link href='lang/ignore/ignore.po' lang='en'>");
	var l = 'test';
	gt = new bt.Gettext(l);
	gt.debug = true;
	equals(gt.lang, l, "Language set properly");
	equals(gt.links.length, 4, "Found two gettext links");
});
test('gt_gettext', function(){
	//Existing translation
	//No existing translation
	//Proper number of arguments
	//Improper number of arguments
	//Improper argument type
	expect(5);
	
	equals(gt.gettext("translate this"), "TRANSLATE THIS", "Found translation message");
	equals(gt.gettext("don't translate this"), "don't translate this", "Returned original string for nonexistent translation");
	
	var str_arg = "arg string";
	var char_arg = 97; //a
	var bad_char_arg = 'a';
	var signed_int = -5;
	
	var arg_msg = gt.gettext("string (%s), character(%c), signed int(%d)", str_arg, char_arg, signed_int);
	equals(arg_msg, "STRING (arg string), CHARACTER(a), SIGNED INT(-5)", "Handled arguments properly");
	
	var missing_arg_msg = gt.gettext("string (%s), character(%c), signed int(%d)", str_arg, signed_int);
	ok(!missing_arg_msg, "Returned empty string for missing args");
	
	var bad_arg_msg = gt.gettext("string (%s), character(%c), signed int(%d)", char_arg, bad_char_arg, str_arg);
	equals(bad_arg_msg, "STRING (97), CHARACTER(), SIGNED INT()", "Handled bad argument types without dying");

});