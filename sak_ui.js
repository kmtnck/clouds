/*
In questo script saranno definiti tutti i metodi legati al rendering grafico
*/

// óóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóó
// TextScramble
// óóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóóó

class TextScramble {
  constructor(el) {
    this.el = el
    this.chars = '!<>-_\\/[]{}ÅE+*^?#________'
    this.update = this.update.bind(this)
  }
  setText(newText) {
	if(this.el != undefined)
	{
		const oldText = this.el.innerText
		const length = Math.max(oldText.length, newText.length)
		const promise = new Promise((resolve) => this.resolve = resolve)
		this.queue = []
		for (let i = 0; i < length; i++) {
		  const from = oldText[i] || ''
		  const to = newText[i] || ''
		  const start = Math.floor(Math.random() * 40)
		  const end = start + Math.floor(Math.random() * 40)
		  this.queue.push({ from, to, start, end })
		}
		cancelAnimationFrame(this.frameRequest)
		this.frame = 0
		this.update()
		return promise
	}
	else
	{
		console.error("Attenzione!! L'oggetto tag el non e definito. Capire a lato chiamante lo stato di caricamento del dom html ["+this.el+"]");
	}
  }
  update() {
    let output = ''
    let complete = 0
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar()
          this.queue[i].char = char
        }
        output += `<span class="dud">${char}</span>`
      } else {
        output += from
      }
    }
    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)]
  }
}

window.plugin.sak.textScramble = function(textToView,classSelectorConsole)
{
	var splitText = textToView.split(' ');
	var phrases = splitText;
	
	//var phrases = ['Neo,', 'sooner or later', 'you\'re going to realize', 'just as I did', 'that there\'s a difference', 'between knowing the path', 'and walking the path'];

	var el = document.querySelector('.'+classSelectorConsole);
	//var el = $("#"+idConsole);
	var fx = new TextScramble(el);

	var counter = 0;
	var next = function next() {
	  fx.setText(phrases[counter]).then(function () {
		setTimeout(next, 800);
	  });
	  counter = (counter + 1) % phrases.length;
	};

	next();
}

/*
Metodo per iniettare testo arricchito o semplice
*/
window.plugin.sak.setTextConsole = function(textToView,classSelectorConsole, isPlainText)
{
	if(isPlainText)
	{
		var arrayResult = $('#sectionsak').find('.'+classSelectorConsole);	
		arrayResult[0].innerHTML = textToView;
	}
	else
	{
		var el = document.querySelector('.'+classSelectorConsole);
		var fx = new TextScramble(el);
		fx.setText(textToView);
	}
}

	window.plugin.sak.signatureSak.renderOSignGoogle = function()
	{
		/*
		Per sconosciuti motivi in ambiente android mobile le variabili globali definite sul plugin principale non sono valorizzati al momento dell'esecuzione del render button google
		*/
		if(window.isSmartphone())
		{
			window.plugin.sak.rootpath = "https://alessandromodica.com/ingress/";
		}

		var uriGoogleSignIn = "<a href=\""+window.plugin.sak.rootpath+"osignin/login.html?nickname='"+window.PLAYER.nickname+"'\" target='blank' >Google SignIn Login ...</a>";

		var uiButtonGoogle =
					"\
			<div id='containerButtonGoogleSignIn' >\
			<div id=\"autorizzodp\">\
			<p>Eseguendo il login Google SignIn autorizzo il trattamento dei miei dati personali ai sensi del Decreto Legislativo 30 giugno 2003, n. 196 \"Codice in materia di protezione dei dati personali\"</p>\
			I dati personali forniti sono l'email e l'anagrafica (nome e cognome) associata all'account\
			</div>\
			<div id='googleSignIn' class=\"g-signin2\" data-onsuccess=\"onSignIn\" data-theme=\"dark\" />\
			<a id='googleSignOut' href=\"#\" onclick=\"signOut();\" >Disconnetti account...</a>\
			<br/>\
			<script src=\"https://apis.google.com/js/platform.js\" async defer></script>\
			<script>\
				function renderButton() {\
				  gapi.signin2.render('googleSignIn', {\
					'scope': 'profile email',\
					'width': 240,\
					'height': 50,\
					'longtitle': true,\
					'theme': 'dark',\
					'onsuccess': onSuccess,\
					'onfailure': onFailure\
				  });\
				}\
				  \
				  function onSignIn(googleUser) {\
					var profile = googleUser.getBasicProfile();\
					var authResponse = googleUser.getAuthResponse();\
					console.info(\"google user --- > \");\
					console.info(googleUser);\
					var payloadAuth = {};\
					payloadAuth.profiloUtente = profile;\
					payloadAuth.googleUser = googleUser;\
					payloadAuth.nickname = '"+window.PLAYER.nickname+"';\
					var id_token = googleUser.getAuthResponse().id_token;\
					var xhr = new XMLHttpRequest();\
					xhr.open('POST', '"+window.plugin.sak.endpointsak+"?context=outhsignin');\
					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');\
					xhr.onload = function() {\
					  console.info('Signed in as: ' + xhr.responseText);\
					  var data = JSON.parse(xhr.responseText);\
					  $('#autorizzodp').hide();\
					  $('#googleSignIn').hide();\
					  $('#googleSignOut').show();\
					  $('#welcomeuser').text('Sei autenticato come "+window.PLAYER.nickname+" con stato '+data.statoutente);\
					};\
					xhr.send('payloadAuth=' + JSON.stringify(payloadAuth));\
					console.info(\"ID Token: \" + id_token);\
				  };\
				  function signOut() {\
						var auth2 = gapi.auth2.getAuthInstance();\
						auth2.signOut().then(function () {\
						console.info('User signed out.');\
						var w3Param = auth2['currentUser']['Aia']['value']['w3'];\
						if(w3Param != null)\
						{\
							var email = w3Param['U3'];\
							var xhr = new XMLHttpRequest();\
							var nickname = '"+window.PLAYER.nickname+"';\
							xhr.open('POST', '"+window.plugin.sak.endpointsak+"?context=outhsignout&email='+email+'&nickname='+nickname);\
							xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');\
							xhr.onload = function() {\
							  console.info('Signed in as: ' + xhr.responseText);\
							  var data = JSON.parse(xhr.responseText);\
							  $('#googleSignIn').show();\
							  $('#googleSignOut').hide();\
							  $('#autorizzodp').show();\
							  $('#welcomeuser').text('Sei autenticato come "+window.PLAYER.nickname+" con stato '+ data.statoutente);\
							};xhr.send();\
							}\
						else\
						{	console.info(\"Nessuna istanza di autenticazione trovata.\");}\
					});}\
			</script>\
			</div>";

		//verifica compatibilita google signin su plugin non ufficiali
		compatibilityOsignGoogle = true;
		window.plugin.sak.msgWarnPlugin = "Sono stati trovati plugin legacy:<br/>"
		$.each(window.plugin.sak.compatibilityPluginOSignGoogle, function(j, cPlu) {
			var currentPlugin = window.plugin[cPlu];
			if(currentPlugin != undefined)
		    {
				window.plugin.sak.msgWarnPlugin += cPlu+"<br/>";
				compatibilityOsignGoogle = false;
			}
		});	

		console.warn(window.plugin.sak.msgWarnPlugin);
		
		 if (!window.isSmartphone() && compatibilityOsignGoogle)
		 {
			 return uiButtonGoogle;
		 }			 
		 else
		 {
			return "<div>"+uriGoogleSignIn+"</div>";
		 }
		 
	}

	window.plugin.sak.msgWarnPlugin = "";
	window.plugin.sak.compatibilityPluginOSignGoogle = 
	[
	"reswue",
	"okey",
	"is_loader"
	];

window.plugin.sak.setupRenderGUISak = function()
	{
	
						//window.plugin.sak.setTextConsole('This site and the scripts are not officially affiliated with Ingress or Niantic Labs at Google. Using these scripts is likely to be considered against the Ingress Terms of Service. Any use is at your own risk.','textDisclaimer');
						
						$('#sectionsak').before("<a id='enableView'  value='toggle Sak' onclick='$(\"#sectionsak\").toggle();'>toggle Sak</a>");
						$("#redeem").before("<div id='containerdetailportalsak' style='font-size: smaller; color: skyblue ' />");
						$("#titleAndVersion").html(window.plugin.sak.labelTitle + " -"+window.plugin.sak.versione);
		
						$("#consolewaypoint").hide();

						$("#consolericerca").hide();
						$("#containerSearchPortali").hide();
						$("#containerSearchOggettiSpeciali").hide();
						$("#containerSearchAttivita").hide();
						$("#containerSearchGuardians").hide();

						$("#containerAvanzate").hide();
						$("#containeristantanea").hide();

						$("#consolegis").hide();
						$("#consolesakaction").hide();
						
						
						$("#incisivitasection").hide();
						$("#containercaratteristicheportalisection").hide();
						
						$("#caratteristicheportalisection").hide();
						$("#influenzadominantesection").hide();
						$("#tracksection").hide();
						$("#consolecensimento").hide();
						

						//var sectionreport = $("<form id='submitreport' method='post'>");
								//sectionreport.attr("action", window.plugin.sak.endpointsak);
								var isappend = false;
								var callback = function(){ 

									if (!isappend && !window.plugin.sak.status) {
										if (!window.plugin.sak.status
											&& !window.plugin.sak.mustRegister) {

											$('#fatalerror')
												.append(
												$(
													"<div ><p style='color: orange;'>Server SAK non raggiungibile!</p> <p style='color: yellow;'>Il plugin e in modalita offline.</p></div>\
						<div id='linktrusturl'>\
						<a target='blank' href='"+window.plugin.sak.rootpath+"abilitahttps.html'>Possibili soluzioni</a>\
						</div>"));
											isappend = true;
										}
									}
									
						if(!window.plugin.sak.status)
						{
							$("#maincontroller").remove();
							console.info(" Stato di autorizzazione utente --> "+window.plugin.sak.status)
						}
						

									/*if(window.plugin.sak.mustRegister)
										window.plugin.sak.mustRegister = false;*/
							
								};
								window.plugin.sak.mutexSak(callback,7,1000);									

						var callback = function(){$('#disclaimer').html('');};
						window.plugin.sak.mutexSak(callback,10,1000);			

						if(!window.isSmartphone())
						{
							var divresult = $("<div id='"+window.plugin.sak.containerdatafromserver+"' ></div>").hide();
							$("#dashboard").css("position", "relative").append(divresult);

							divresult.addClass('resultdata resizable container-parent-result');
							divresult.resizable().css("position", "absolute")
							/*.draggable({ 	
													//impostazione cursore di spostamento al momento del trascinamento
													cursor: "move", 
													containment: '#dashboard',
													start: function(e, ui) {
													if ($(e.originalEvent.target).is(".scroll"))
														e.preventDefault();
													}
												}).css("position", "absolute");*/
								.draggable({

								cursor: "move", 
								containment: '#dashboard',
								start: function () {
									// cancel draggin while scrolling
									if ($(this).data("scrolled")) {
										$(this).data("scrolled", false).trigger("mouseup");
										return false;
									}
								}
							}).find("*").andSelf().scroll(function () {
								// Bind to the scroll event on current element, and all its children.

								// Prevent all draggable parents from dragging while they are scrolling
								$(this).parents(".ui-draggable").data("scrolled", true);
							});								
							//.resizable().draggable().css("position", "absolute");
						}
						else{
							$('#resultreport').append($("<div id='"+window.plugin.sak.containerdatafromserver+"'>"));
						}
								/*
								Integrazione filtro chat
								*/
								if (!window.isSmartphone())
								{


									var sectionFilterChat = $(" <span id=\"filterchat\"> \
						<span><input id=\"filterSpam\" type=\"checkbox\" onclick=\"window.plugin.sak.flipFlopCheckBox('filterSpam');\" checked='true' />Attiva antispam</span>\
						<span><input id=\"enableFilter\" type=\"checkbox\" onclick=\"window.plugin.sak.flipFlopCheckBox('enableFilter');\"/>"+window.plugin.sak.nameenablefilter+"</span>\
						</span>");	

									var sectionFilterDetail = $(
						"<div id=\"sectionFilterChat\">\
						<span >\
						<span>Ignorati: <label id=\"ignoreActions\" /></label><span> </span></span>\
						<span>Ora corrente: <label id=\"currentDataActions\" /></label></span>\
						<span><br/></span>\
						<span><input id=\"filterAlerts\" type=\"checkbox\" onclick=\"window.plugin.sak.flipFlopCheckBox('filterAlerts');\"/> Notifiche attacco</span>\
						<span><input id=\"filterMessage\" type=\"checkbox\" onclick=\"window.plugin.sak.flipFlopCheckBox('filterMessage');\"/> Messaggi</span>\
						<span><input id=\"filterReso\" type=\"checkbox\" onclick=\"window.plugin.sak.flipFlopCheckBox('filterReso');\"/> Resonatori</span>\
						<span><input id=\"filterCaptured\" type=\"checkbox\" onclick=\"window.plugin.sak.flipFlopCheckBox('filterCaptured');\" />Catturati</span>\
						<span><input id=\"filterLinks\" type=\"checkbox\" onclick=\"window.plugin.sak.flipFlopCheckBox('filterLinks');\"/> Links</span>\
						<span><input id=\"filterControlField\" type=\"checkbox\" onclick=\"window.plugin.sak.flipFlopCheckBox('filterControlField');\" />Fields</span>\
						<span><br/></span>\
						<span><input id=\"filterPlayer\" type=\"checkbox\" onclick=\"window.plugin.sak.flipFlopCheckBox('filterPlayer');\" />Giocatore</span>\
						<span><input id=\"searchLoggerPlayer\" type=\"text\" placeholder=\"@player1 player2 ecc...\" /></span>\
						</span>\
						</div>"
						);
									var chatControls = $("#chatcontrols");
									$('#chatcontrols ').css('left','0');

									chatControls.append(sectionFilterChat);
									chatControls.append(sectionFilterDetail);

									//XXX: aggiunta dell'evento toggle class per la l'expand della chat quando il filtro e attivato
									$('#chatcontrols a:first').on( "click", window.plugin.sak.toggleFilterArea);
									
									var divContainerResults = $("<span id=\'containeridentityresults\' ></span>");
									chatControls.append(divContainerResults);

								}
								else
								{
									var sectionFilterChatMobile = $(
										"<div><input id=\"filterSpam\" type=\"checkbox\" onclick=\"window.plugin.sak.flipFlopCheckBox('filterSpam');\" checked='true' />Attiva antispam</div>\
						<div><input id=\"enableFilter\" type=\"checkbox\" onclick=\"window.plugin.sak.flipFlopCheckBox('enableFilter');\"/>"+window.plugin.sak.nameenablefilter+"</div>\
						<div id=\"sectionFilterChatMobile\" >\
						<fieldset ><legend>Filtro chat mobile</legend> \
						<div>Ignorati: <label id=\"ignoreActions\" /></label></div>\
						<div>Ora corrente: <label id=\"currentDataActions\" /></label></div>\
						<div><input id=\"filterAlerts\" type=\"checkbox\" onclick=\"window.plugin.sak.flipFlopCheckBox('filterAlerts');\"/> Notifiche attacco</div>\
						<div><input id=\"filterMessage\" type=\"checkbox\" onclick=\"window.plugin.sak.flipFlopCheckBox('filterMessage');\"/> Messaggi</div>\
						<div><input id=\"filterReso\" type=\"checkbox\" onclick=\"window.plugin.sak.flipFlopCheckBox('filterReso');\"/> Resonatori</div>\
						<div><input id=\"filterCaptured\" type=\"checkbox\" onclick=\"window.plugin.sak.flipFlopCheckBox('filterCaptured');\" />Catturati</div>\
						<div><input id=\"filterLinks\" type=\"checkbox\" onclick=\"window.plugin.sak.flipFlopCheckBox('filterLinks');\"/> Links</div>\
						<div><input id=\"filterControlField\" type=\"checkbox\" onclick=\"window.plugin.sak.flipFlopCheckBox('filterControlField');\" />Fields</div>\
						<div><input id=\"filterPlayer\" type=\"checkbox\" onclick=\"window.plugin.sak.flipFlopCheckBox('filterPlayer');\" />Giocatore</div>\
						<div><input id=\"searchLoggerPlayer\" type=\"text\" placeholder=\"@player1 player2 ecc...\" /></div>\
						</fieldset>\
						</div>");		

									$('#filtrochat').append(sectionFilterChatMobile);
								}
								
								
						var containerDataServer = $("#"+window.plugin.sak.containerdatafromserver);
						containerDataServer.hide();
						$("#linkviewstats").hide();


						//container dove elencare i link per recuperare le instantanee
						var containerIstantanea = $("#containeristantanea");
						//aggiunta del link per rimuovere i reports
						/*containerIstantanea.append(
								$("<a id='resetreports'>").attr("value",
										window.plugin.sak.resetreports).attr("onclick",
										"$('.reports').remove();$('resetreports').hide()")
										.text(window.plugin.sak.resetreports).hide());*/
						/*
						 * containerIstantanea.append ($("<a id='resetreports'>")
						 * .attr("value",window.plugin.sak.resetreports)
						 * .attr("onclick","$('.reports').remove();$('resetreports').hide()").text(window.plugin.sak.resetreports));
						 */
						 
						 
						$('#statsinviodati').hide();
						$('#statsinviodatitotale').hide();
						$("#resetreports").hide();

						$('#sectionFilterChat').hide();
						$('#sectionFilterChatMobile').hide();

						$("#timeStampMaxGetPlext").hide();
						$( function() {
							$( "#plextdatapicker" ).datepicker();
						} );
						var googlesignin = $(window.plugin.sak.signatureSak.renderOSignGoogle());

						 if(!compatibilityOsignGoogle)
						 {
							$('#containerosignin').append(googlesignin).append("<div id='warnplugin'></div>");	
							$("#warnplugin").html(window.plugin.sak.msgWarnPlugin);
							var callback = function(){ $("#warnplugin").html(""); };
							window.plugin.sak.mutexSak(callback);
						 }
						 else
	 						$('#containerosignin').append(googlesignin);	

						
						
						//window.plugin.sak.listaPlayers();
						window.plugin.sak.hookSearchNickname("inputincisivitaplayer");
						window.plugin.sak.hookSearchNickname("inputtracciaplayer");
						window.plugin.sak.hookSearchNickname("inputdeployspeciali");
						window.plugin.sak.hookSearchNickname("inputconsultaattivita");
						window.plugin.sak.hookSearchNickname("inputconsultaguardians");	

						console.info("Stato utente :" +window.plugin.sak.status);
						if(!window.plugin.sak.status)
						{
							$("#maincontroller").remove();
							//$("#containerosignin").remove();
							$("#welcomeuser").remove();
							
							//override link guida utente
							
							
						}
						$('#helponline').attr('href',"https://alessandromodica.com/ingress/media/guida_utente_sak_599.pdf");
						
						if(window.plugin.playerTracker != undefined)
						{
							console.info("Individuato il plugin player tracker. Provvedo a eseguire l'override del drawdata personalizzato");
							
							window.plugin.playerTracker.drawData = window.plugin.sak.playerTracker.drawData
						}
						else
						{
							console.info("Non e stato trovato il plugin player tracker, pertanto non viene eseguito l'override del metodo drawdata personalizzato");
						}						

	}
	
var elem, context, timer;	
var textStrip = ['?', 'î‰', 'êº', 'Áå', 'à…', 'ãg', '‰à', 'û^', '?', 'öG', 'õõ', 'íÒ', '?'];
var stripCount = 60, stripX = new Array(), stripY = new Array(), dY = new Array(), stripFontSize = new Array();
var theColors = ['#cefbe4', '#81ec72', '#5cd646', '#54d13c', '#4ccc32', '#43c728'];

window.plugin.sak.effectMatrix = function(sectionId)
{

//var canvas = document.body.appendChild( document.createElement( 'canvas' ) ),
//var elem, context, timer;	

canvas = document.createElement('canvas');
canvas.id = 'matrixeffect';

//document.body.appendChild(canv); // adds the canvas to the body element
document.getElementById(sectionId).appendChild(canvas); // adds the canvas to #someBox


context = canvas.getContext( '2d' );
context.globalCompositeOperation = 'lighter';
//canvas.width = 340;
//canvas.height = 800;
draw();


for (var i = 0; i < stripCount; i++) {
    stripX[i] = Math.floor(Math.random()*1265);
    stripY[i] = -100;
    dY[i] = Math.floor(Math.random()*7)+3;
    stripFontSize[i] = Math.floor(Math.random()*16)+8;
}


	
}



function drawStrip(x, y) {
	
    for (var k = 0; k <= 20; k++) {
        var randChar = textStrip[Math.floor(Math.random()*textStrip.length)];
        if (context.fillText) {
            switch (k) {
            case 0:
                context.fillStyle = theColors[0]; break;
            case 1:
                context.fillStyle = theColors[1]; break;
            case 3:
                context.fillStyle = theColors[2]; break;
            case 7:
                context.fillStyle = theColors[3]; break;
            case 13:
                context.fillStyle = theColors[4]; break;
            case 17:
                context.fillStyle = theColors[5]; break;
            }
            context.fillText(randChar, x, y);
        }
        y -= stripFontSize[k];
    }
}

function draw() {
    // clear the canvas and set the properties
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.shadowOffsetX = context.shadowOffsetY = 0;
    context.shadowBlur = 8;
    context.shadowColor = '#94f475';
    
    for (var j = 0; j < stripCount; j++) {
        context.font = stripFontSize[j]+'px MatrixCode';
        context.textBaseline = 'top';
        context.textAlign = 'center';
        
        if (stripY[j] > 1358) {
            stripX[j] = Math.floor(Math.random()*canvas.width);
            stripY[j] = -100;
            dY[j] = Math.floor(Math.random()*7)+3;
            stripFontSize[j] = Math.floor(Math.random()*16)+8;
            drawStrip(stripX[j], stripY[j]);
        } else drawStrip(stripX[j], stripY[j]);
        
        stripY[j] += dY[j];
    }
  setTimeout(draw, 70);
}

window.plugin.sak.playerTracker = function(){};
//Override metodo che costruisce il popup del player tracker
window.plugin.sak.playerTracker.drawData = function() {
  var isTouchDev = window.isTouchDevice();

  var gllfe = plugin.playerTracker.getLatLngFromEvent;

  var polyLineByAgeEnl = [[], [], [], []];
  var polyLineByAgeRes = [[], [], [], []];

  var split = PLAYER_TRACKER_MAX_TIME / 4;
  var now = new Date().getTime();
  $.each(plugin.playerTracker.stored, function(plrname, playerData) {
    if(!playerData || playerData.events.length === 0) {
      console.warn('broken player data for plrname=' + plrname);
      return true;
    }

    // gather line data and put them in buckets so we can color them by
    // their age
    var playerLine = [];
    for(var i = 1; i < playerData.events.length; i++) {
      var p = playerData.events[i];
      var ageBucket = Math.min(parseInt((now - p.time) / split), 4-1);
      var line = [gllfe(p), gllfe(playerData.events[i-1])];

      if(playerData.team === 'RESISTANCE')
        polyLineByAgeRes[ageBucket].push(line);
      else
        polyLineByAgeEnl[ageBucket].push(line);
    }

    var evtsLength = playerData.events.length;
    var last = playerData.events[evtsLength-1];
    var ago = plugin.playerTracker.ago;

    // tooltip for marker - no HTML - and not shown on touchscreen devices
    var tooltip = isTouchDev ? '' : (playerData.nick+', '+ago(last.time, now)+' ago');

    // popup for marker
    var popup = $('<div>')
      .addClass('plugin-player-tracker-popup');
    $('<span>')
      .addClass('nickname ' + (playerData.team === 'RESISTANCE' ? 'res' : 'enl'))
      .css('font-weight', 'bold')
      .text(playerData.nick)
      .appendTo(popup);

    if(window.plugin.guessPlayerLevels !== undefined &&
       window.plugin.guessPlayerLevels.fetchLevelDetailsByPlayer !== undefined) {
      function getLevel(lvl) {
        return $('<span>')
          .css({
            padding: '4px',
            color: 'white',
            backgroundColor: COLORS_LVL[lvl],
          })
          .text(lvl);
      }

      var level = $('<span>')
        .css({'font-weight': 'bold', 'margin-left': '10px'})
        .appendTo(popup);

      var playerLevelDetails = window.plugin.guessPlayerLevels.fetchLevelDetailsByPlayer(plrname);
      level
        .text('Min level ')
        .append(getLevel(playerLevelDetails.min));
      if(playerLevelDetails.min != playerLevelDetails.guessed)
        level
          .append(document.createTextNode(', guessed level: '))
          .append(getLevel(playerLevelDetails.guessed));
    }

    popup
      .append('<br>')
      .append(document.createTextNode(ago(last.time, now)))
      .append('<br>')
      .append(plugin.playerTracker.getPortalLink(last));

    // show previous data in popup
    if(evtsLength >= 2) {
      popup
        .append('<br>')
        .append('<br>')
        .append(document.createTextNode('previous locations:'))
        .append('<br>');

      var table = $('<table>')
        .appendTo(popup)
        .css('border-spacing', '0');
      for(var i = evtsLength - 2; i >= 0 && i >= evtsLength - 10; i--) {
        var ev = playerData.events[i];
        $('<tr>')
          .append($('<td>')
            .text(ago(ev.time, now) + ' ago'))
          .append($('<td>')
            .append(plugin.playerTracker.getPortalLink(ev)))
          .appendTo(table);
      }
    }

    // calculate the closest portal to the player
    var eventPortal = []
    var closestPortal;
    var mostPortals = 0;
    $.each(last.ids, function(i, id) {
      if(eventPortal[id]) {
        eventPortal[id]++;
      } else {
        eventPortal[id] = 1;
      }
      if(eventPortal[id] > mostPortals) {
        mostPortals = eventPortal[id];
        closestPortal = id;
      }
    });

	
	//XXX: punto ideale in cui innestare l'interfaccia per innestare i link sulle azioni possibili sul giocatore selezionato
	console.info("Iniezione nel popup dei link rapidi SAK");
	window.plugin.playerTracker.buildGui(popup,playerData);
	
    // marker opacity
    var relOpacity = 1 - (now - last.time) / window.PLAYER_TRACKER_MAX_TIME
    var absOpacity = window.PLAYER_TRACKER_MIN_OPACITY + (1 - window.PLAYER_TRACKER_MIN_OPACITY) * relOpacity;

    // marker itself
    var icon = playerData.team === 'RESISTANCE' ?  new plugin.playerTracker.iconRes() :  new plugin.playerTracker.iconEnl();
    // as per OverlappingMarkerSpiderfier docs, click events (popups, etc) must be handled via it rather than the standard
    // marker click events. so store the popup text in the options, then display it in the oms click handler
    var m = L.marker(gllfe(last), {icon: icon, referenceToPortal: closestPortal, opacity: absOpacity, desc: popup[0], title: tooltip});
    m.addEventListener('spiderfiedclick', plugin.playerTracker.onClickListener);

    // m.bindPopup(title);

    if (tooltip) {
      // ensure tooltips are closed, sometimes they linger
      m.on('mouseout', function() { $(this._icon).tooltip('close'); });
    }

    playerData.marker = m;

    m.addTo(playerData.team === 'RESISTANCE' ? plugin.playerTracker.drawnTracesRes : plugin.playerTracker.drawnTracesEnl);
    window.registerMarkerForOMS(m);

    // jQueryUI doesnÅft automatically notice the new markers
    if (!isTouchDev) {
      window.setupTooltips($(m._icon));
    }
  });

  // draw the poly lines to the map
  $.each(polyLineByAgeEnl, function(i, polyLine) {
    if(polyLine.length === 0) return true;

    var opts = {
      weight: 2-0.25*i,
      color: PLAYER_TRACKER_LINE_COLOUR,
      clickable: false,
      opacity: 1-0.2*i,
      dashArray: "5,8"
    };

    $.each(polyLine,function(ind,poly) {
      L.polyline(poly, opts).addTo(plugin.playerTracker.drawnTracesEnl);
    });
  });
  $.each(polyLineByAgeRes, function(i, polyLine) {
    if(polyLine.length === 0) return true;

    var opts = {
      weight: 2-0.25*i,
      color: PLAYER_TRACKER_LINE_COLOUR,
      clickable: false,
      opacity: 1-0.2*i,
      dashArray: "5,8"
    };

    $.each(polyLine, function(ind,poly) {
      L.polyline(poly, opts).addTo(plugin.playerTracker.drawnTracesRes);
    });
  });
};


window.plugin.playerTracker.buildGui = function(popup, playerData)
{
		popup
		.append("<div><p><a href='#' onclick=\"window.plugin.sak.getStatistichePlayer('"+playerData.nick+"','COMPATTA');\">Richiedi statistiche...</a><br/>(since 14 feb 2017)<p>")
		.append('<span id="resultstats" />')
		.append("<p><a href='#' onclick=\"window.plugin.sak.getTopMostHeld('"+playerData.nick+"');\">Top 10 Held</a><p>")
		.append('<span id="resulttopmost" /></div>')
		.append("<p><a href='#' onclick=\"window.plugin.sak.getTopMostActivity('"+playerData.nick+"');\">Ultime 10 azioni</a><p>")
		.append('<span id="resulttopactivity" /></div>')
		
		;
	
}

//XXX:Qui di seguito sono definiti i metodi che chiamano il server.
//in futuro tutti i metodi che contattano il server saranno dichiarati in questo punto
window.plugin.sak.getStatistichePlayer = function(keysearch, in_modalita)
	{
			var tipo = "StatistichePlayer";
			console.info("Statistiche del player " + keysearch + "...");
            $('#esitoclient').html(
                "Recupero statistiche del player " + keysearch + "...");
            window.plugin.sak.countcalls = window.plugin.sak.countcalls + 1;
            window.plugin.sak.ledSak = 'green';
            $("#countcalls").css('color',window.plugin.sak.ledSak);
            $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

//            var cipher = window.plugin.sak.getCipher();

            //keysearch = window.plugin.sak.chat.securityReplace(keysearch);

            var inforequest = $
            .post(
                window.plugin.sak.endpointsak,
                {
                    context : "statisticheplayer"
                    ,objplayer : JSON.stringify(window.PLAYER)
                    ,player : keysearch
                    ,modalita : in_modalita
                },
                function(data) {

                    console.info('Statistiche giocatore eseguita con successo!!');
                    console.info(data);
                    $('#esitoclient').html(
                        'Recupero statistiche eseguito con successo!!');

                    var statistiche = data.payload;
					console.info(statistiche);

					var friendlyText = "";
				    $.each(data.payload.statistiche, function(i, cStat) {
						
						var descrizione = cStat.descactionplayer;
						var valore = cStat.occorrenza;
						friendlyText = friendlyText+" "+descrizione+" : "+valore+"<br/>";
						
					});
					
					$("#resultstats").html("<p>"+friendlyText+"<br/><i>powered by SAK</i></p>");
                    //rendering html per visualizzare i risultati della ricerca
                    //window.plugin.sak.renderConsultaAttivita(data.payload.json, keysearch);

                    //-------------- controllo visibilita finestre risultati----------------
                    //$("#"+window.plugin.sak.containerdatafromserver).show();
                    //-------------- controllo visibilita finestre risultati----------------

                    window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                    $('#countcalls').html(
                        window.plugin.sak.countcalls);
                    if(window.plugin.sak.countcalls > 0)
                        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);
                    var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
                    window.plugin.sak.mutexSak(callback);
                })
            .fail(
                function(xhr, textStatus, errorThrown) {
                    console.log(xhr.statusText);
                    console.log(xhr.responseText);
                    console.log(textStatus);
                    console.error(error);
                    window.plugin.sak.getFailError(xhr,textStatus, "Recupero statistiche giocatore");
                    //alert
                    console.error("Anomalia di comunicazione! Recupero statistiche giocatore fallita");
                    window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                    $('#countcalls').html(
                        window.plugin.sak.countcalls);
                    if(window.plugin.sak.countcalls > 0)
                        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);
                    //var callback = function(){ $('#esitoclient').html('idle...');};
					var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
                    window.plugin.sak.mutexSak(callback);

                });
	}
	
//XXX:Qui di seguito sono definiti i metodi che chiamano il server.
//in futuro tutti i metodi che contattano il server saranno dichiarati in questo punto
window.plugin.sak.getTopMostHeld = function(keysearch)
	{
			var tipo = "TopMostHeld";
			var msg = "Top ten dei potenziali guardian del player " + keysearch + "...";
			console.info(msg);
            $('#esitoclient').html(
                msg);
            window.plugin.sak.countcalls = window.plugin.sak.countcalls + 1;
            window.plugin.sak.ledSak = 'green';
            $("#countcalls").css('color',window.plugin.sak.ledSak);
            $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

//            var cipher = window.plugin.sak.getCipher();

            //keysearch = window.plugin.sak.chat.securityReplace(keysearch);

            var inforequest = $
            .post(
                window.plugin.sak.endpointsak,
                {
                    context : "topmostguardians"
                    ,objplayer : JSON.stringify(window.PLAYER)
                    ,player : keysearch
                },
                function(data) {

                    console.info('Top ten most held eseguita con successo!!');
                    console.info(data);
                    $('#esitoclient').html(
                        "Top ten dei potenziali guardian del player " + keysearch + " recuperato con successo!");

                    var topmosthelds = data.payload;
					console.info(topmosthelds);

					var friendlyText = "";
					var count = topmosthelds.length+1;
					for(var i=topmosthelds.length - 1; i >= 0; i--){
						cObj = topmosthelds[i];
						var portale = cObj.portale;
						
						var titolo = portale.titolo;
						var indirizzo = portale.indirizzo;
						var lat = portale.datagis.lat;
						var lon = portale.datagis.lon;
						var faction = cObj.giocatore.faction;
						var lastmodified = portale.lastmodifiedformatter;
						var player = cObj.giocatore.player;
						var predictcapturetime = portale.capturetime;
						var tempotrascorso = cObj.tempotrascorso;
						var reporter = cObj.reporter;
				
						var linkGmaps = $("<a />").addClass("saka").attr("target", "blank").attr("href","https://maps.google.com/maps?q="+lat+","+lon).text("Gmaps");
						var linkIntel = $("<a />").addClass("saka").attr("onclick","window.plugin.sak.selectPortalByLatLng("+lat+","+ lon+");return false").attr("href","/intel?ll="+lat+","+lon+"&z=15").text("Intel Map");
						
						count = count-1;
						
						var descrizione = "<span title='"+indirizzo+"'>"+count+". - "+titolo+" - Giorni: "+tempotrascorso+"</span>";
						var valore = "<span><a class='saka' target='blank' href='/intel?ll="+lat+","+lon+"&z=15\' >Intel</a> - <a class='saka' target='blank'  href='https://maps.google.com/maps?q='+lat+','+lon >Gmaps</a></span>";
						friendlyText = descrizione+" "+valore+"<br/>"+friendlyText;
					}
					
					if(topmosthelds.length == 0)
						friendlyText = "Nessun risultato trovato ";
					$("#resulttopmost").html("<p style='font-size: smaller;'>"+friendlyText+"<div style='font-size: smaller;'><a class='saka' onclick=\"$(\'#inputconsultaguardians\').val(\'"+keysearch+"\');window.plugin.sak.consultaGuardians();\" >Piu dettagli</a></div>"+"<br/><i>powered by SAK</i></p>");
                    window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                    $('#countcalls').html(
                        window.plugin.sak.countcalls);
                    if(window.plugin.sak.countcalls > 0)
                        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);
                    var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
                    window.plugin.sak.mutexSak(callback);
                })
            .fail(
                function(xhr, textStatus, errorThrown) {
                    console.log(xhr.statusText);
                    console.log(xhr.responseText);
                    console.log(textStatus);
                    console.error(error);
                    window.plugin.sak.getFailError(xhr,textStatus, "Recupero statistiche giocatore");
                    //alert
                    console.error("Anomalia di comunicazione! Recupero statistiche giocatore fallita");
                    window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                    $('#countcalls').html(
                        window.plugin.sak.countcalls);
                    if(window.plugin.sak.countcalls > 0)
                        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);
                    //var callback = function(){ $('#esitoclient').html('idle...');};
					var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
                    window.plugin.sak.mutexSak(callback);

                });
	}	
	
	
	//XXX:Qui di seguito sono definiti i metodi che chiamano il server.
//in futuro tutti i metodi che contattano il server saranno dichiarati in questo punto
window.plugin.sak.getTopMostActivity = function(keysearch)
	{
			var tipo = "TopMostActivity";
			var msg = "Ultime 10 azioni del player " + keysearch + "...";
			console.info(msg);
            $('#esitoclient').html(
                msg);
            window.plugin.sak.countcalls = window.plugin.sak.countcalls + 1;
            window.plugin.sak.ledSak = 'green';
            $("#countcalls").css('color',window.plugin.sak.ledSak);
            $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

//            var cipher = window.plugin.sak.getCipher();

            //keysearch = window.plugin.sak.chat.securityReplace(keysearch);

            var inforequest = $
            .post(
                window.plugin.sak.endpointsak,
                {
                    context : "topattivita"
                    ,objplayer : JSON.stringify(window.PLAYER)
                    ,player : keysearch
                },
                function(data) {

                    console.info('Ultime 10 attivita recuperate con successo!!');
                    console.info(data);
                    $('#esitoclient').html(
                        "Top ten dei potenziali guardian del player " + keysearch + " recuperato con successo!");

                    var topmostattivita = data.payload;
					console.info(topmostattivita);

					var friendlyText = "";
					var count = topmostattivita.length+1;
					for(var i=topmostattivita.length - 1; i >= 0; i--){
						cObj = topmostattivita[i];
				
						//var portale = cObj.portale;
						var player = cObj.giocatore.player;
						var faction = cObj.giocatore.faction;
						var azione = cObj.azione;
						var indirizzo = cObj.indirizzo;
						var data = cObj.data;
						var ora = cObj.ora;
						var gis = cObj.portaleorigine.gis;						
						var lat = gis.lat;
						var lon = gis.lon;
						var istante = cObj.istante;
				
						var linkGmaps = $("<a />").addClass("saka").attr("target", "blank").attr("href","https://maps.google.com/maps?q="+lat+","+lon).text("Gmaps");
						var linkIntel = $("<a />").addClass("saka").attr("onclick","window.plugin.sak.selectPortalByLatLng("+lat+","+ lon+");return false").attr("href","/intel?ll="+lat+","+lon+"&z=15").text("Intel Map");
						
						count = count-1;
						
						var descrizione = "<span title='"+indirizzo+"'>"+count+". - "+istante+" "+azione+"</span>";
						var valore = "<span><a class='saka' target='blank' href='/intel?ll="+lat+","+lon+"&z=15\' >Intel</a> - <a class='saka' target='blank'  href='https://maps.google.com/maps?q='+lat+','+lon >Gmaps</a></span>";
						friendlyText = descrizione+" "+valore+"<br/>"+friendlyText;
					}
					
					if(topmostattivita.length == 0)
						friendlyText = "Nessun risultato trovato ";
					$("#resulttopactivity").html("<p style='font-size: smaller;'>"+friendlyText+"<div style='font-size: smaller;'><a class='saka' onclick=\"$(\'#inputconsultaattivita\').val(\'"+keysearch+"\');window.plugin.sak.consultaAttivita();\" >Piu dettagli</a></div>"+"<br/><i>powered by SAK</i></p>");

                    //-------------- controllo visibilita finestre risultati----------------
                    //$("#"+window.plugin.sak.containerdatafromserver).show();
                    //-------------- controllo visibilita finestre risultati----------------

                    window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                    $('#countcalls').html(
                        window.plugin.sak.countcalls);
                    if(window.plugin.sak.countcalls > 0)
                        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);
                    var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
                    window.plugin.sak.mutexSak(callback);
                })
            .fail(
                function(xhr, textStatus, errorThrown) {
                    console.log(xhr.statusText);
                    console.log(xhr.responseText);
                    console.log(textStatus);
                    console.error(error);
                    window.plugin.sak.getFailError(xhr,textStatus, "Recupero statistiche giocatore");
                    //alert
                    console.error("Anomalia di comunicazione! Recupero statistiche giocatore fallita");
                    window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                    $('#countcalls').html(
                        window.plugin.sak.countcalls);
                    if(window.plugin.sak.countcalls > 0)
                        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);
                    //var callback = function(){ $('#esitoclient').html('idle...');};
					var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
                    window.plugin.sak.mutexSak(callback);

                });
	}	
	
//XXX:Qui di seguito sono definiti i metodi che chiamano il server.
//in futuro tutti i metodi che contattano il server saranno dichiarati in questo punto
window.plugin.sak.getUserOnline = function()
	{
			var in_periodo = 60;
			var tipo = "UserOnline";
			var msg = "Richiesta utenti online ...";
			console.info(msg);
            $('#esitoclient').html(
                msg);
            window.plugin.sak.countcalls = window.plugin.sak.countcalls + 1;
            window.plugin.sak.ledSak = 'green';
            $("#countcalls").css('color',window.plugin.sak.ledSak);
            $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

            var inforequest = $
            .post(
                window.plugin.sak.endpointsak,
                {
                    context : "utenticonnessi"
                    ,objplayer : JSON.stringify(window.PLAYER)
                    ,periodo : in_periodo
                },
                function(data) {

                    console.info('Utenti online recuperati con successo!!');

                    $('#esitoclient').html(
                        "Utenti online recuperati con successo!!");

                    var useronline = data.payload;
					console.info(useronline);

					var friendlyText = "";
					var count = useronline.length+1;
					for(var i=useronline.length - 1; i >= 0; i--){
						cObj = useronline[i];
						
						count = count-1;
						
						var descrizione = cObj.descrizione;
						var dettaglio = cObj.dettaglio;
						
						var descrizione = "<tr><td><span title='"+dettaglio+"'>"+descrizione+"</span></td></tr>";
						friendlyText = descrizione+friendlyText;
						
					}
					console.log(friendlyText);
					
					if(useronline.length == 0)
						friendlyText = "Nessun utente connesso";

					$("#utentionline").html("<p style='font-size: smaller;'><div ><a class='saka' onclick=\"$(\'#utentionline\').html('');\" >Chiudi</a></div><table>"+friendlyText+"</table></p>");

                    window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                    $('#countcalls').html(
                        window.plugin.sak.countcalls);
                    if(window.plugin.sak.countcalls > 0)
                        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);
                    var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
                    window.plugin.sak.mutexSak(callback);
                })
            .fail(
                function(xhr, textStatus, errorThrown) {
                    console.log(xhr.statusText);
                    console.log(xhr.responseText);
                    console.log(textStatus);
                    console.error(error);
                    window.plugin.sak.getFailError(xhr,textStatus, "Utenti online");
                    //alert
                    console.error("Anomalia di comunicazione! Recupero Utenti online fallita");
                    window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                    $('#countcalls').html(
                        window.plugin.sak.countcalls);
                    if(window.plugin.sak.countcalls > 0)
                        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);
					var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
                    window.plugin.sak.mutexSak(callback);

                });
	}