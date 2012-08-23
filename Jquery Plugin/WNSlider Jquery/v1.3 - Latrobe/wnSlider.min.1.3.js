/**
*   WN Slider v1.3.1
*   @copyright (C) 2011 Wery Nguyen
*	@author nguyennt86@gmail.com
*   Seamless CMS	
*	Change Log:
*	@version v1.3.1	22/12/2011
*		+ Quick fix display error cause the title background fade to opacity 1 in IE.
*	@version v1.3.1	13/12/2011
*		+ Quick fix an error cause js to stop if rel or alt are not specified for the image.
*	@version v1.3	2/12/2011
*		+ Add pagingPosition below image option which show the paging below the images. Has prev/next/pause button wrap around the normal paging number
*		+ Add below-image css. refer to the stylesheet for more updated on styling (reuse a few components from jquery ui smoothless theme)
*		+ Ability to display title and abstract on the slider, add hyperlink to image and title <img src="link/to/src" title="the title" alt="the subtitle" rel="link to page" />
*	@version v1.2	17/11/2011
*		+ Add PagingNavigation & effect
*	@version v1.1	4/11/2011
*		+ Add more configuration: pagingType can be an image or none
*		+ Auto Rotate?
*		+ Styling fix for IE6
*	@version 1.0	20/10/2011
*/

eval(function(p,a,c,k,e,d){e=function(c){return c};if(!''.replace(/^/,String)){while(c--){d[c]=k[c]||c}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('(10($){$.91.90=10(6){8 68={54:"30-92",63:"93",69:67,52:95,46:89,65:"74",78:67,37:\'25-17\'};8 20;6=$.96(68,6);8 21=$(29);8 9=$(29).84("36");8 3=0;10 77(){5(6.37==\'70-17\'){21.12("<4 11=\'16\'></4>")}13 5(6.37=="25-17"){21.85("<4 11=\'16\' 19=\'25-17\'></4>")}21.12("<4 11=\'32\'></4>");21.12("<4 11=\'66\'></4>");21.12("<4 11=\'34\'></4>");21.61("36").88("87","59");5(9.23>0){8 26=9.86();8 18=26.28("18");8 14=26.28("14");8 22=26.28("44")==27?"":26.28("44");8 43=26.28("47")==27?"":26.28("47");$("#32").12("<2 15=\'"+22+"\'><36 18=\'"+18+"\' 39=\'100%\' 35=\'100%\' /></2>");$("#34").12("<4 11=\'56\'><2 15=\'"+22+"\' 19=\'58\'>"+14+"</2> <4>"+43+"</4> </4>")}5(6.63!="59"){94(8 24=0;24<9.23;24++){8 51=(24+1);5(6.63==="17"){51="&104;"}5(24!=3){$("#16").12("<2 19=\'30-40-41\' 14=\'"+24+"\'>"+51+"</2>")}13{$("#16").12("<2 19=\'30-40-41 42\' 14=\'"+24+"\'>"+51+"</2>")}}}$("#16").61("2").31(10(){$("#16").61("2").57("42");$(29).60("42");5(20!=27){83(20);20=62(38,6.52)}3=$(29).28(\'14\');5(3==0)3=9.23-1;13 3--;38()});5(6.69===67){5(6.37=="70-17"){21.12("<4 11=\'45\' 54=\'71:73; 107:72; 39:50%; 35:100%;\'><2 15=\'#\'></2></4>");21.12("<4 11=\'48\' 54=\'71:73; 105:72; 39:50%; 35:100%;\'><2 15=\'#\'></2></4>");$("4#45 2").31(10(){5(3===0)3=9.23-1;13 3--;33()});$("4#48 2").31(10(){5(3===9.23-1)3=0;13 3++;33()})}13 5(6.37=="25-17"){$(\'#16\').98("<2 11=\'45\' 19=\'25-17 30-40-41\' 15=\'#\'></2>");$(\'#16\').12("<2 11=\'48\' 19=\'25-17 30-40-41\' 15=\'#\'></2>");$(\'#16\').12("<2 11=\'81\' 19=\'25-17 30-40-41\' 15=\'#\'></2>");$("#45").31(10(106){5(3===0)3=9.23-1;13 3--;33();49 55});$("#48").31(10(){5(3===9.23-1)3=0;13 3++;33();49 55});$("#81").31(10(){5(20!=27){83(20);20=27;$(29).60(\'82-79\')}13{20=62(38,6.52);$(29).57(\'82-79\')}49 55})}}}10 33(){8 18=9[3].18;8 14=9[3].14;8 22=9[3].75[\'44\']!=27?9[3].75[\'44\'].103:"";8 43=9[3].47!=27?9[3].47:"";5(6.65==="74"){$("#32").64(6.46,10(){$("#32").53("<2 15=\'"+22+"\'><36 18=\'"+18+"\' 39=\'100%\' 35=\'100%\' /></2>");$("#32").76()});$("#34").64(6.46,10(){$("#34").53("<4 11=\'56\'><2 15=\'"+22+"\' 19=\'58\'>"+14+"</2> <4>"+43+"</4> </4>");$("#34").76()});$("#66").64(6.46,10(){$("#66").101(\'99\',0.7)})}13 5(6.65==="59"){$("#32").53("<2 15=\'"+22+"\'><36 18=\'"+18+"\' 39=\'100%\' 35=\'100%\' /></2>");$("#34").53("<4 11=\'56\'><2 15=\'"+22+"\' 19=\'58\'>"+14+"</2> <4>"+43+"</4> </4>")}$("#16 2").57("42");$("#16 2[14=\\""+3+"\\"]").60("42")}10 38(){8 80=0;5(3!=9.23-1){80=++3}13{3=0}33()}49 29.97(10(){77();5(6.78){20=62(38,6.52)}})}})(102);',10,108,'||a|currentIndex|div|if|options||var|imageList|function|id|append|else|title|href|wn_pager|image|src|class|timer|container|link|length|i|below|firstItem|null|attr|this|wn|click|wn_image|showCurrentImage|wn_title|height|img|pagingPosition|run|width|pager|item|active|subTitle|rel|wn_pre|animationSpeed|alt|wn_next|return||content|timerInterval|html|style|false|wn_title_label|removeClass|wn_title_header|none|addClass|children|setInterval|pagingType|fadeOut|effect|wn_title_background|true|defaults|pagingNavigation|above|position|0px|absolute|fade|attributes|fadeIn|init|autoRotate|state|nextImage|wn_pause|pause|clearInterval|find|after|first|display|css|500|wnSlider|fn|slider|number|for|6000|extend|each|prepend|normal||fadeTo|jQuery|value|nbsp|right|event|left'.split('|'),0,{}))
