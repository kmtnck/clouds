// ==UserScript==
// @id             iitc-sak-@alessandromodica
// @name           IITC plugin: sak-swissarmyknife-release
// @category       Strategia
// @version        2.0.0.20160218.0000
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      http://dominioatuascelta/ingress/sak.user.js
// @downloadURL    http://dominioatuascelta/ingress/sak.user.js
// @description    Un coltellino svizzero per chi gioca a ingress. Attualmente supporta: 1- report attivita' e conversazioni on the fly 2- report delle attivita' e dei guardian di uno specifico player 3- blacklisting per inibire l'uso del plugin a specifici giocatori
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @match          http://dominioatuascelta/ingress*
// @grant          none
// @author         kmtnck
// ==/UserScript==

function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if(typeof window.plugin !== 'function') window.plugin = function() {};
    
	//metodo di default
    window.plugin.sak = function () {};
    window.plugin.sak.chat = function () {};
	
	//XXX: metodi override per innestare chiamate all'handler in base a determinati eventi
	//in questo metodo si vuole richiamare l'invio dati ogni volta che si cambia il bounding box della mappa
window.plugin.sak.chat.genPostData = function(channel, storageHash, getOlderMsgs) {
  if (typeof channel !== 'string') throw ('API changed: isFaction flag now a channel string - all, faction, alerts');

  var b = clampLatLngBounds(map.getBounds());

  // set a current bounding box if none set so far
  if (!chat._oldBBox) chat._oldBBox = b;

  // to avoid unnecessary chat refreshes, a small difference compared to the previous bounding box
  // is not considered different
  var CHAT_BOUNDINGBOX_SAME_FACTOR = 0.1;
  // if the old and new box contain each other, after expanding by the factor, don't reset chat
  if (!(b.pad(CHAT_BOUNDINGBOX_SAME_FACTOR).contains(chat._oldBBox) && chat._oldBBox.pad(CHAT_BOUNDINGBOX_SAME_FACTOR).contains(b))) {
	  
	  
	//-----------------------------------
	//-----------------------------------
	//-----------------------------------
    //alert("Il bounding box è cambiato. Invio i dati prima del refresh");
	//if(window.plugin.sak.autoSendOnChangeBB)
		if(channel == 'all' || channel == 'alerts')
		window.plugin.sak.writeLog();
    console.log('Bounding Box changed, chat will be cleared (old: '+chat._oldBBox.toBBoxString()+'; new: '+b.toBBoxString()+')');
	//-----------------------------------
	//-----------------------------------
	//-----------------------------------

    $('#chat > div').data('needsClearing', true);

    // need to reset these flags now because clearing will only occur
    // after the request is finished – i.e. there would be one almost
    // useless request.
    chat._faction.data = {};
    chat._faction.oldestTimestamp = -1;
    chat._faction.newestTimestamp = -1;

    chat._public.data = {};
    chat._public.oldestTimestamp = -1;
    chat._public.newestTimestamp = -1;

    chat._alerts.data = {};
    chat._alerts.oldestTimestamp = -1;
    chat._alerts.newestTimestamp = -1;

    chat._oldBBox = b;
  }

  var ne = b.getNorthEast();
  var sw = b.getSouthWest();
  var data = {
//    desiredNumItems: isFaction ? CHAT_FACTION_ITEMS : CHAT_PUBLIC_ITEMS ,
    minLatE6: Math.round(sw.lat*1E6),
    minLngE6: Math.round(sw.lng*1E6),
    maxLatE6: Math.round(ne.lat*1E6),
    maxLngE6: Math.round(ne.lng*1E6),
    minTimestampMs: -1,
    maxTimestampMs: -1,
    tab: channel,
  }

  if(getOlderMsgs) {
    // ask for older chat when scrolling up
    data = $.extend(data, {maxTimestampMs: storageHash.oldestTimestamp});
  } else {
    // ask for newer chat
    var min = storageHash.newestTimestamp;
    // the initial request will have both timestamp values set to -1,
    // thus we receive the newest desiredNumItems. After that, we will
    // only receive messages with a timestamp greater or equal to min
    // above.
    // After resuming from idle, there might be more new messages than
    // desiredNumItems. So on the first request, we are not really up to
    // date. We will eventually catch up, as long as there are less new
    // messages than desiredNumItems per each refresh cycle.
    // A proper solution would be to query until no more new results are
    // returned. Another way would be to set desiredNumItems to a very
    // large number so we really get all new messages since the last
    // request. Setting desiredNumItems to -1 does unfortunately not
    // work.
    // Currently this edge case is not handled. Let’s see if this is a
    // problem in crowded areas.
    $.extend(data, {minTimestampMs: min});
    // when requesting with an actual minimum timestamp, request oldest rather than newest first.
    // this matches the stock intel site, and ensures no gaps when continuing after an extended idle period
    if (min > -1) $.extend(data, {ascendingTimestampOrder: true});
  }
  return data;
}

//metodi di request data con il genPostData personalizzato per intercettare l'evento di cambio bounding box
//-----------------------------------
//-----------------------------------
//-----------------------------------
window.plugin.sak.chat.requestFaction = function(getOlderMsgs, isRetry) {
  if(chat._requestFactionRunning && !isRetry) return;
  if(isIdle()) return renderUpdateStatus();
  chat._requestFactionRunning = true;
  $("#chatcontrols a:contains('faction')").addClass('loading');

 //XXX: alla richiesta di nuovi dati viene scatenato questo metodo ed è il punto giusto per inviare i dati in automatico
 //if(window.plugin.sak.autoSendOnScroll)
	//window.plugin.sak.writeLog(); 
  
  var d = window.plugin.sak.chat.genPostData('faction', chat._faction, getOlderMsgs);
  var r = window.postAjax(
    'getPlexts',
    d,
    function(data, textStatus, jqXHR) { chat.handleFaction(data, getOlderMsgs); },
    isRetry
      ? function() { window.chat._requestFactionRunning = false; }
      : function() { window.chat.requestFaction(getOlderMsgs, true) }
  );
}

window.plugin.sak.chat.requestPublic = function(getOlderMsgs, isRetry) {
  if(chat._requestPublicRunning && !isRetry) return;
  if(isIdle()) return renderUpdateStatus();
  chat._requestPublicRunning = true;
  $("#chatcontrols a:contains('all')").addClass('loading');
 //XXX: alla richiesta di nuovi dati viene scatenato questo metodo ed è il punto giusto per inviare i dati in automatico
 //if(window.plugin.sak.autoSendOnScroll)
	window.plugin.sak.writeLog('chatall'); 

  var d = window.plugin.sak.chat.genPostData('all', chat._public, getOlderMsgs);
  var r = window.postAjax(
    'getPlexts',
    d,
    function(data, textStatus, jqXHR) { chat.handlePublic(data, getOlderMsgs); },
    isRetry
      ? function() { window.chat._requestPublicRunning = false; }
      : function() { window.chat.requestPublic(getOlderMsgs, true) }
  );
}

window.plugin.sak.chat.requestAlerts = function(getOlderMsgs, isRetry) {
  if(chat._requestAlertsRunning && !isRetry) return;
  if(isIdle()) return renderUpdateStatus();
  chat._requestAlertsRunning = true;
  $("#chatcontrols a:contains('alerts')").addClass('loading');
 //XXX: alla richiesta di nuovi dati viene scatenato questo metodo ed è il punto giusto per inviare i dati in automatico
// if(window.plugin.sak.autoSendOnScroll)
	window.plugin.sak.writeLog(); 

  var d = window.plugin.sak.chat.genPostData('alerts', chat._alerts, getOlderMsgs);
  var r = window.postAjax(
    'getPlexts',
    d,
    function(data, textStatus, jqXHR) { chat.handleAlerts(data, getOlderMsgs); },
    isRetry
      ? function() { window.chat._requestAlertsRunning = false; }
      : function() { window.chat.requestAlerts(getOlderMsgs, true) }
  );
}
//-----------------------------------
//-----------------------------------
//-----------------------------------
//metodo per intercettare lo scroll e quindi le informazioni presenti nelle tab all e faction
window.plugin.sak.chat.activeRequestOverride = function()
{
		$( '#chatall').unbind( 'scroll' );
		$( "#chatall").empty();

		$( '#chatfaction').unbind( 'scroll' );
		$( '#chatfaction').empty();

    	window.requests._onRefreshFunctions.pop();
		
		var checkActive = false;
		if(!checkActive)
		{
		  $('#chatall').scroll(function() {
			var t = $(this);
			if(t.data('ignoreNextScroll')) return t.data('ignoreNextScroll', false);
			if(t.scrollTop() < CHAT_REQUEST_SCROLL_TOP) chat.requestPublic(true);
			if(scrollBottom(t) === 0) chat.requestPublic(false);
			console.log("Scroll attivato per richieste public normale.");
			$('#esitoclient').html('> Scroll nella chat all rilevato <');
			var countRetry = 0;
			var lock = false;
			function mutex() {                // a function called 'wait'
				
				if(countRetry == 1 && lock)
				{
					$('#esitoclient').html('');
					clearInterval(setAndLock); //stops the function being called again.
					lock = false;
				}
				else
				{
					countRetry++;
					lock = true;
				}
			
			}

			if(!lock)
			setAndLock = setInterval(mutex, 500); // calls the function wait after 2 seconds			
			
			
		  });
		  
		$('#chatfaction').scroll(function() {
			var t = $(this);
			if(t.data('ignoreNextScroll')) return t.data('ignoreNextScroll', false);
			if(t.scrollTop() < CHAT_REQUEST_SCROLL_TOP) chat.requestFaction(true);
			if(scrollBottom(t) === 0) chat.requestFaction(false);
			
			console.log("Scroll attivato per messaggi in faction.");
			$('#esitoclient').html('> Scroll nella chat faction rilevato <');
			var countRetry = 0;
			var lock = 0;
			function mutex() {                // a function called 'wait'
				
				if(countRetry == 1 && lock)
				{
					$('#esitoclient').html('');
					clearInterval(setAndLock); //stops the function being called again.
					lock = false;
				}
				else
				{
					countRetry++;
					lock = true;
				}
			
			}

		if(!lock)			
			setAndLock = setInterval(mutex, 500); // calls the function wait after 2 seconds			
			
		  });		  
		  
		  window.requests._onRefreshFunctions.push(chat.request);
		  console.log("Attivato handler normale della chat.");		  
		}
		
}

	/*
	Metodi mutex utilizzati per gestire la concorrenza delle chiamate post nel visualizzare i messaggi a consolle
	*/
	/*window.plugin.sak.mutex.auth = function(limit){
		
		if(window.plugin.sak.firstcall || countRetry == limit)
			{
				if(!window.plugin.sak.status && !window.plugin.sak.mustRegister)
				{
					sectionreport
					.append
					(
					$("<br/><a target='blank' id='linktrusturl'>")
								.attr("href","http://dominioatuascelta/ingress/abilitahttps.html")
								.html("Abilitazione endpoint SAK")
					);
				}
				clearInterval(setAndLock); //stops the function being called again.
			}
			else
				countRetry++;
		
	}
	
	window.plugin.sak.mutex.infoportale = function(limit){
		if(countRetry == limit && lock)
				{
					$('#esitoclient').html('');
					clearInterval(setAndLock); //stops the function being called again.
					lock = false;
					
				}
				else
				{
					countRetry++;
					lock = true;
				}
	}
	
	window.plugin.sak.mutex.scrolltrigger = function(limit){
		
		if(countRetry == limit)
				{
					$('#esitoclient').html('');
					clearInterval(setAndLock); //stops the function being called again.
				}
				else
				{
					countRetry++;
				}
				
	}*/

//------------------------
//------------------------
//------------------------
// Metodi personalizzati per eseguire le chiamate al server 
//------------------------
//------------------------
//------------------------

//invia le informazioni del portale selezionato alla banca dati hostata sul dominio dominioatuascelta
//window.runHooks ('portalDetailLoaded', {guid:guid, success:success, details:data});
//runHooks('portalDetailsUpdated', {guid: guid, portal: portal, portalDetails: details, portalData: data});
window.plugin.sak.sendPortalInfo = function (data) {
		$('#esitoserver').html('');
		window.plugin.sak.datiPortaleCorrente = data;
		
        var p;
		if(data.details != null)
			p = data.details;
        else
			p = data.portalDetails;
			
		var title = p.title;
        var owner = p.owner;
        var capturedTime = p.capturedTime;

        var team = "non disponibile";
        if(p.team != null)
            team = p.team;

        console.log("Invio informazioni del portale "+title);
		$('#esitoclient').html('Invio dati del portale in corso...');
		
		$('#inputlifecapture').show();
        
        var address = "attualmente non disponibile";//p.descriptiveText.map.ADDRESS;
        var isValid = window.plugin.sak.checkreso(owner, p.resonators);
		window.plugin.sak.countcalls = window.plugin.sak.countcalls+1;
		$('#countcalls').html(window.plugin.sak.countcalls);

        $.post(window.plugin.sak.endpointsak,{
			context : "infoportale",
			objplayer : JSON.stringify(window.PLAYER),
            nickname: owner,
            guid: data.guid,
            capturetime: capturedTime,
            faction: team,
            lat: p.latE6,
            lon: p.lngE6,
            title: title,
            valid: isValid,
            address: address,
            nickReporter: window.PLAYER.nickname
	        },
            function(data) {
                $("#addressportale").text(data.address);
				$("#datacaptureportale").text("Data cattura stimata: "+data.datecapture);
				if(data.datecapture != '0000-00-00 00:00:00')
					$("#timelapsecaptureportale").text("Durata: "+data.timelapse);
				else
					$("#timelapsecaptureportale").text("Durata: Non disponibile");
					
				$('#esitoclient').html('Invio completato!');
				window.plugin.sak.countcalls = window.plugin.sak.countcalls-1;
				$('#countcalls').html(window.plugin.sak.countcalls);

			var countRetry = 0;
			var lock = false;
			function mutex() {                // a function called 'wait'

				if(countRetry == 2 && lock)
				{
					$('#esitoclient').html('');
					clearInterval(setAndLock); //stops the function being called again.
					lock = false;
					
				}
				else
				{
					countRetry++;
					lock = true;
				}
			
			}
			if(!lock)
				setAndLock = setInterval(mutex, 500); // calls the function wait after 2 seconds	
			
	        }
         ).fail(function(xhr, textStatus, errorThrown) {
				console.log(xhr.statusText); 
				console.log(xhr.responseText);
				console.log(textStatus);
				console.log(error);
				$('#esitoclient').html('ERRORE del server ['+error+']: Lettura info portale fallita');
				window.plugin.sak.countcalls = window.plugin.sak.countcalls-1;
				$('#countcalls').html(window.plugin.sak.countcalls);
				alert("Si è verificato un errore di comunicazione! Lettura info portale fallita");
			});		
    }

//chiama il servizio per il recupero della lista guardians	
window.plugin.sak.consultaGuardians = function (e) {

	var characterCode; //literal character code will be stored in this variable

	if(e && e.which){ //if which property of event object is supported (NN4)
	e = e
	characterCode = e.which; //character code is contained in NN4's which property
	}
	else{
	e = event
	characterCode = e.keyCode; //character code is contained in IE's keyCode property
	}

	if(characterCode == 13){ //if character code is equal to ascii 13 (if enter key)

		//alert("TODO: da implementare . Titolo da cercare"+$('#inputsearchportal').val());

		var keysearch = $('#inputconsultaguardians').val();
		console.log("Ricerca attività del player "+keysearch+"...");
		$('#esitoclient').html("Ricerca guardians del player "+keysearch+"...");
		window.plugin.sak.countcalls = window.plugin.sak.countcalls+1;
		$('#countcalls').html(window.plugin.sak.countcalls);
       var inforequest = $.post(window.plugin.sak.endpointsak,{
			context : "consultaguardians",
			objplayer : JSON.stringify(window.PLAYER),
            player: keysearch
	        },
            function(data) {
				
				console.log('Ricerca eseguita con successo!!');
				$('#esitoclient').html('Ricerca eseguita con successo!!');

				var d = new Date();
				var filename = keysearch+"_guardians_"+"_"+d.getTime()+".csv";
				
				//alert(inforequest.getResponseHeader('Content-Disposition'));
				
				/*var blob=new Blob([data]);
				var link=document.createElement('a');
				link.href=window.URL.createObjectURL(blob);
				link.download=filename;
				link.click();*/
				var blob = new Blob([data], {type: "application/plain"});
				var url = window.URL.createObjectURL(blob);
				a = document.createElement('a');
				a.href = url;
				a.download = filename;
				document.body.appendChild(a);
				a.click();
				setTimeout(function(){
					document.body.removeChild(a);
					window.URL.revokeObjectURL(url);  
				}, 100);				

				$('#inputconsultaguardians').val('');
				window.plugin.sak.countcalls = window.plugin.sak.countcalls-1;
				$('#countcalls').html(window.plugin.sak.countcalls);


			var countRetry = 0;
			lock = false;
			function mutex() {                // a function called 'wait'
				if(countRetry == 4  && lock)
				{
					$('#esitoclient').html('');
					clearInterval(setAndLock); //stops the function being called again.
					lock = false;
				}
				else
				{
					countRetry++;
					lock = true;
				}
			
			}
			if(!lock)
			setAndLock = setInterval(mutex, 1000); // calls the function wait after 2 seconds			   
			
	        }
         ).fail(function(xhr, textStatus, errorThrown) {
				console.log(xhr.statusText); 
				console.log(xhr.responseText);
				console.log(textStatus);
				console.log(error);
				$('#esitoclient').html('ERRORE del server ['+error+']: Ricerca guardians fallita');
				window.plugin.sak.countcalls = window.plugin.sak.countcalls-1;
				$('#countcalls').html(window.plugin.sak.countcalls);
				alert("Si è verificato un errore di comunicazione! Ricerca non disponibile");
			});		
		}
	/*	else{
		}
	*/
		return false; //return false to the event handler
	}	
	

//chiama il servizio per il recupero delle attività del giocatore cercato	
window.plugin.sak.getIstantanea = function (pidreport) {

		//alert("TODO: da implementare . Titolo da cercare"+$('#inputsearchportal').val());

		console.log("Recupero report istantanea codice : "+pidreport+"...");
		$('#esitoclient').html("Recupero report istantanea codice "+pidreport+" in corso...");
		window.plugin.sak.countcalls = window.plugin.sak.countcalls+1;
		$('#countcalls').html(window.plugin.sak.countcalls);
		var inforequest = $.post(window.plugin.sak.endpointsak,{
			context : "istantanea",
			objplayer : JSON.stringify(window.PLAYER),
            idreport: pidreport
	        },
            function(data) {
				
				var filename = data.filename;
				var idreport = data.idreport;
				var plaintext = data.plaintext;
				var resultData = data.resultData;
				console.log(resultData);
				
				console.log('Recupero report eseguito con successo!!');
				$('#esitoclient').html('Recupero report eseguito con successo!!');

				//var d = new Date();
				//var filename = pidreport+"_istantanea_"+"_"+d.getTime()+".csv";
				
				//alert(inforequest.getResponseHeader('Content-Disposition'));
				
				/*var blob=new Blob([plaintext]);
				//var blob=new Blob([data]);
				var link=document.createElement('a');
				link.href=window.URL.createObjectURL(blob);
				link.download=filename;
				link.click();*/

				var blob = new Blob([plaintext], {type: "application/plain"});
				var url = window.URL.createObjectURL(blob);
				a = document.createElement('a');
				a.href = url;
				a.download = filename;
				document.body.appendChild(a);
				a.click();
				setTimeout(function(){
					document.body.removeChild(a);
					window.URL.revokeObjectURL(url);  
				}, 100);  	
				window.plugin.sak.countcalls = window.plugin.sak.countcalls-1;
				$('#countcalls').html(window.plugin.sak.countcalls);


			var countRetry = 0;
			lock = false;
			function mutex() {                // a function called 'wait'
				if(countRetry == 4  && lock)
				{
					$('#esitoclient').html('');
					clearInterval(setAndLock); //stops the function being called again.
					lock = false;
				}
				else
				{
					countRetry++;
					lock = true;
				}
			
			}
			if(!lock)
			setAndLock = setInterval(mutex, 1000); // calls the function wait after 2 seconds			   
			
	        }
         ).fail(function(xhr, textStatus, errorThrown) {
				console.log(xhr.statusText); 
				console.log(xhr.responseText);
				console.log(textStatus);
				console.log(error);
				$('#esitoclient').html('ERRORE del server ['+error+']: Ricerca portale fallita');
				window.plugin.sak.countcalls = window.plugin.sak.countcalls-1;
				$('#countcalls').html(window.plugin.sak.countcalls);
				alert("Si è verificato un errore di comunicazione! Ricerca non disponibile");
				
			});		

	/*	else{
		}
	*/
		return true; //return false to the event handler
	}	

//chiama il servizio per il recupero delle attività del giocatore cercato	
window.plugin.sak.consultaAttivita = function (e) {

	var characterCode; //literal character code will be stored in this variable

	if(e && e.which){ //if which property of event object is supported (NN4)
	e = e
	characterCode = e.which; //character code is contained in NN4's which property
	}
	else{
	e = event
	characterCode = e.keyCode; //character code is contained in IE's keyCode property
	}

	if(characterCode == 13){ //if character code is equal to ascii 13 (if enter key)

		//alert("TODO: da implementare . Titolo da cercare"+$('#inputsearchportal').val());

		var keysearch = $('#inputconsultaattivita').val();
		console.log("Ricerca attività del player "+keysearch+"...");
		$('#esitoclient').html("Ricerca attività del player "+keysearch+"...");
		window.plugin.sak.countcalls = window.plugin.sak.countcalls+1;
		$('#countcalls').html(window.plugin.sak.countcalls);
		var inforequest = $.post(window.plugin.sak.endpointsak,{
			context : "consultalogger",
			objplayer : JSON.stringify(window.PLAYER),
            player: keysearch
	        },
            function(data) {
				
				console.log('Ricerca eseguita con successo!!');
				$('#esitoclient').html('Ricerca eseguita con successo!!');

				var d = new Date();
				var filename = keysearch+"_search_"+"_"+d.getTime()+".csv";
				
				//alert(inforequest.getResponseHeader('Content-Disposition'));
				
				/*var blob=new Blob([data]);
				var link=document.createElement('a');
				link.href=window.URL.createObjectURL(blob);
				link.download=filename;
				link.click();*/
				var blob = new Blob([data], {type: "application/plain"});
				var url = window.URL.createObjectURL(blob);
				a = document.createElement('a');
				a.href = url;
				a.download = filename;
				document.body.appendChild(a);
				a.click();
				setTimeout(function(){
					document.body.removeChild(a);
					window.URL.revokeObjectURL(url);  
				}, 100);
				
				$('#inputconsultaattivita').val('');
				window.plugin.sak.countcalls = window.plugin.sak.countcalls-1;
				$('#countcalls').html(window.plugin.sak.countcalls);
				
			var countRetry = 0;
			lock = false;
			function mutex() {                // a function called 'wait'
				if(countRetry == 4  && lock)
				{
					$('#esitoclient').html('');
					clearInterval(setAndLock); //stops the function being called again.
					lock = false;
				}
				else
				{
					countRetry++;
					lock = true;
				}
			
			}
			if(!lock)
			setAndLock = setInterval(mutex, 1000); // calls the function wait after 2 seconds			   
			
	        }
         ).fail(function(xhr, textStatus, errorThrown) {
				console.log(xhr.statusText); 
				console.log(xhr.responseText);
				console.log(textStatus);
				console.log(error);
				$('#esitoclient').html('ERRORE del server ['+error+']: Ricerca portale fallita');
				alert("Si è verificato un errore di comunicazione! Ricerca non disponibile");
				window.plugin.sak.countcalls = window.plugin.sak.countcalls-1;
				$('#countcalls').html(window.plugin.sak.countcalls);
				
			});		
		}
	/*	else{
		}
	*/
		return false; //return false to the event handler
	}
	
//chiama il servizio per cercare i portali con la chiave di ricerca sul titolo
window.plugin.sak.searchPortals = function (e) {

	var characterCode; //literal character code will be stored in this variable

	if(e && e.which){ //if which property of event object is supported (NN4)
	e = e
	characterCode = e.which; //character code is contained in NN4's which property
	}
	else{
	e = event
	characterCode = e.keyCode; //character code is contained in IE's keyCode property
	}

	if(characterCode == 13){ //if character code is equal to ascii 13 (if enter key)

		//alert("TODO: da implementare . Titolo da cercare"+$('#inputsearchportal').val());

		console.log("Ricerca dei portali in corso...");
		$('#esitoclient').html("Ricerca dei portali in corso...");
		var keysearch = $('#inputsearchportal').val();
		window.plugin.sak.countcalls = window.plugin.sak.countcalls+1;
		$('#countcalls').html(window.plugin.sak.countcalls);
		

       var inforequest = $.post(window.plugin.sak.endpointsak,{
			context : "searchportale",
			objplayer : JSON.stringify(window.PLAYER),
            titolo: keysearch
	        },
            function(data) {
				
				console.log('Ricerca eseguita con successo!!');
				$('#esitoclient').html('Ricerca eseguita con successo!!');

				var d = new Date();
				var filename = keysearch+"_search_"+"_"+d.getTime()+".csv";
				
				//alert(inforequest.getResponseHeader('Content-Disposition'));
				
				/*var blob=new Blob([data]);
				var link=document.createElement('a');
				link.href=window.URL.createObjectURL(blob);
				link.download=filename;
				link.click();*/
				var blob = new Blob([data], {type: "application/plain"});
				var url = window.URL.createObjectURL(blob);
				a = document.createElement('a');
				a.href = url;
				a.download = filename;
				document.body.appendChild(a);
				a.click();
				setTimeout(function(){
					document.body.removeChild(a);
					window.URL.revokeObjectURL(url);  
				}, 100);

				$('#inputsearchportal').val('');
				window.plugin.sak.countcalls = window.plugin.sak.countcalls-1;
				$('#countcalls').html(window.plugin.sak.countcalls);

				var countRetry = 0;
			lock = false;
			function mutex() {                // a function called 'wait'
				if(countRetry == 4  && lock)
				{
					$('#esitoclient').html('');
					clearInterval(setAndLock); //stops the function being called again.
					lock = false;
				}
				else
				{
					countRetry++;
					lock = true;
				}
			
			}
			if(!lock)
			setAndLock = setInterval(mutex, 1000); // calls the function wait after 2 seconds			   
			
	        }
         ).fail(function(xhr, textStatus, errorThrown) {
				console.log(xhr.statusText); 
				console.log(xhr.responseText);
				console.log(textStatus);
				console.log(error);
				$('#esitoclient').html('ERRORE del server ['+error+']: Ricerca portale fallita');
				window.plugin.sak.countcalls = window.plugin.sak.countcalls-1;
				$('#countcalls').html(window.plugin.sak.countcalls);
				alert("Si è verificato un errore di comunicazione! Ricerca non disponibile");
			});		
		}
	/*	else{
		}
	*/
		return false; //return false to the event handler
	}

//chiama il servizio per ottenere la lista dei captured sul portale selezionato	
window.plugin.sak.getLifeCapture = function () {
		
		data = window.plugin.sak.datiPortaleCorrente;

		if(data == null)
		{
			alert("Nessun portale selezionato!");
			return false;
		}

        var p;
		if(data.details != null)
			p = data.details;
        else
			p = data.portalDetails;
			
		var title = p.title;
        var owner = p.owner;
        var capturedTime = p.capturedTime;

        var team = "non disponibile";
        if(p.team != null)
            team = p.team;

        console.log("Richiesta storico del portale "+title);
		$('#esitoclient').html('Richiesta storico in corso...');

        
        var address = "attualmente non disponibile";//p.descriptiveText.map.ADDRESS;
        var isValid = window.plugin.sak.checkreso(owner, p.resonators);
		window.plugin.sak.countcalls = window.plugin.sak.countcalls+1;
		$('#countcalls').html(window.plugin.sak.countcalls);

        var inforequest = $.post(window.plugin.sak.endpointsak,{
			context : "lifecapture",
			objplayer : JSON.stringify(window.PLAYER),
            nickname: owner,
            guid: data.guid,
            capturetime: capturedTime,
            faction: team,
            lat: p.latE6,
            lon: p.lngE6,
            title: title,
            valid: isValid,
            address: address,
            nickReporter: window.PLAYER.nickname
	        },
            function(data) {
                $("#inputlifecapture").attr("value",window.plugin.sak.namelifecapture);
				console.log("Storico del portale "+title+" recuperato con successo.");
				$('#esitoclient').html('Storico recuperato con successo');

				var d = new Date();
				var filename = title+"_lifecapture_"+"_"+d.getTime()+".csv";
				
				//alert(inforequest.getResponseHeader('Content-Disposition'));
				
				/*var blob=new Blob([data]);
				var link=document.createElement('a');
				link.href=window.URL.createObjectURL(blob);
				link.download=filename;
				link.click();*/
				var blob = new Blob([data], {type: "application/plain"});
				var url = window.URL.createObjectURL(blob);
				a = document.createElement('a');
				a.href = url;
				a.download = filename;
				document.body.appendChild(a);
				a.click();
				setTimeout(function(){
					document.body.removeChild(a);
					window.URL.revokeObjectURL(url);  
				}, 100);				
				window.plugin.sak.countcalls = window.plugin.sak.countcalls-1;
				$('#countcalls').html(window.plugin.sak.countcalls);

			var countRetry = 0;
			lock = false;
			function mutex() {                // a function called 'wait'
				if(countRetry == 4  && lock)
				{
					$('#esitoclient').html('');
					clearInterval(setAndLock); //stops the function being called again.
					lock = false;
				}
				else
				{
					countRetry++;
					lock = true;
				}
			
			}
			if(!lock)
			setAndLock = setInterval(mutex, 1000); // calls the function wait after 2 seconds			   
			
	        }
         ).fail(function(xhr, textStatus, errorThrown) {
				console.log(xhr.statusText); 
				console.log(xhr.responseText);
				console.log(textStatus);
				console.log(error);
				$('#esitoclient').html('ERRORE del server ['+error+']: Storico non disponibile');
				window.plugin.sak.countcalls = window.plugin.sak.countcalls-1;
				$('#countcalls').html(window.plugin.sak.countcalls);				
				alert("Si è verificato un errore di comunicazione! Storico portale non recuperato");
			});
        
			
    }

	
//parametri "annotation" per la funzione writelog
window.plugin.sak.CONST_LIMIT = 500;
window.plugin.sak.limiteActions = window.plugin.sak.CONST_LIMIT;
window.plugin.sak.limiteActions = window.plugin.sak.CONST_LIMIT;
window.plugin.sak.suspendreg = false;
window.plugin.sak.writeLog = function(overridechannel) {

		if(window.plugin.sak.suspendreg)
		{
			return false;
		}
		
        var contextlogtosend = "chatalerts";
        
        if( $('#chatfaction').css('display') == "block" )
        	contextlogtosend = "chatfaction";
        else if( $('#chatall').css('display') == "block" )
        	contextlogtosend = "chatall";
        else if( $('#chatalerts').css('display') == "block" )
        	contextlogtosend = "chatalerts";
        
		if(overridechannel == 'chatall')
			contextlogtosend = overridechannel;
		
        var contentToSend = $("#"+contextlogtosend).html();
        
        if(contentToSend == null || contentToSend == "" /*&& !window.plugin.sak.mustRegister*/)
        {
       		$("#buttoninvia").attr("value",window.plugin.sak.nameinvia).text(window.plugin.sak.nameinvia);
        	$('#esitoclient').html("L'area di chat risulta disattivata o vuota");
			//alert("L'area di chat risulta disattivata o vuota");
			var countRetry = 0;
			lock = false;
			function mutex() {                // a function called 'wait'
				if(countRetry == 2  && lock)
				{
					$('#esitoclient').html('');
					clearInterval(setAndLock); //stops the function being called again.
					lock = false;
				}
				else
				{
					countRetry++;
					lock = true;
				}
			
			}
			if(!lock)
			setAndLock = setInterval(mutex, 1000); // calls the function wait after 2 seconds
		
            
			return false;
        }
        else
        {
        
		console.log("Invio informazioni del tab "+contextlogtosend);

		
		//analisi dom xml lato javascript
		//soffre di mismatching encoding. è usato solo per fornire counting
		//a lato server è inviato il plaintext grezzo.
		try{

				contentToSendEscaped = window.plugin.sak.replaceAll(contentToSend,"&lt;small class=&quot;milliseconds&quot;&gt;","{}");
				contentToSendEscaped = window.plugin.sak.replaceAll(contentToSendEscaped,"&lt;/small&gt;/g","{}");
				contentToSendEscaped = window.plugin.sak.replaceAll(contentToSendEscaped,"<small class=&quot;milliseconds&quot;>","{}");
				contentToSendEscaped = window.plugin.sak.replaceAll(contentToSendEscaped,"</small>","{}");

			var xmlContent = $.parseXML(contentToSendEscaped);
			var result = $(xmlContent).find("tr");

			if(result.length > window.plugin.sak.limiteActions)
			{
				var deltaActions = result.length - window.plugin.sak.limiteActions;
				console.log("Superato il limite di "+window.plugin.sak.limiteActions+" actions (trovate "+result.length+"). Stanno per essere rimosse le "+deltaActions+" actions in coda.");
				
				for(var i=0;i<deltaActions;i++)
				{
					$(xmlContent).find("tr").remove(":last");
				}

				var mustEqualLimit = $(xmlContent).find("tr");
				console.log("Actions volute : "+window.plugin.sak.limiteActions+" . Actions trovate: "+mustEqualLimit.length);		

				window.plugin.sak.limiteActions = window.plugin.sak.limiteActions/2;

				if(window.plugin.sak.limiteActions < window.plugin.sak.CONST_LIMIT/5)
					window.plugin.sak.limiteActions = window.plugin.sak.CONST_LIMIT;
				
				var oSerializer = new XMLSerializer();
				contentToSend = oSerializer.serializeToString(xmlContent);
			}
			
			console.log("Stanno per essere inviati al server "+$(xmlContent).find("tr").length+ " actions di gioco.");

		}		
		catch(err) {
			
			console.log("Errore durante il parsing content."+err.message);
			alert("WARNING: Non è stato possibile analizzare i dati che stanno per essere inviati.\nPertanto non è possibile controllare il numero delle azioni. Se i dati sono elevati potrebbe fallire l'invio");
		}

		var scarabocchio = window.plugin.sak.scarabocchio;
		var source = window.plugin.sak.base64Encode(scarabocchio);
		var passcode = window.plugin.sak.passcode;
		var cipher = window.plugin.sak.MD5.calcMD5(passcode+source);

		window.plugin.sak.countcalls = window.plugin.sak.countcalls+1;
		$("#buttoninvia").attr("value","Invio in corso actions "+contextlogtosend+"...").text("Invio in corso actions "+contextlogtosend+"...");
		$('#countcalls').html(window.plugin.sak.countcalls);

		$('#esitoserver').html('');
		//= window.plugin.sak.getSource();
           $.post(window.plugin.sak.endpointsak,{
			context : "loggerchat",
			objplayer : JSON.stringify(window.PLAYER),
            detailcontext: contextlogtosend,
            content: contentToSend,
            hashscript: cipher,
            formato: "csv"},
            function(data) {
               // alert(data.idreport);
            //window.plugin.sak.download(data);
			
			

			//di norma è settato a true, ed è la negazione del mustRegister
			if(window.plugin.sak.mustRegister)
			{
				$('#registration').html('<fiedlset>Agente '+window.PLAYER.nickname+' la registrazione è avvenuta con successo! Enjoy You!</fieldset>');
				var countRetry = 0;
				var lock = false;
				function mutex() {                // a function called 'wait'
					
					if(countRetry == 2 && lock)
					{
						$('#registration').html('');
						clearInterval(setAndLock); //stops the function being called again.
						lock = false;
					}
					else
					{
						countRetry++;
						lock = true;
					}
				
				}

				if(!lock)
				setAndLock = setInterval(mutex, 1000);				
			}
		
            /*var getteristantanea = $("<form id='istantanea"+data.idreport+"' class='reports' method='post'>");
            getteristantanea.attr("action",window.plugin.sak.endpointsak);
            getteristantanea
            .append($("<input type='hidden' name='context'>").attr("value","istantanea"))
            .append($("<input type='hidden' name='idreport' >").attr("value",data.idreport))
			.append($("<input type='hidden' name='objplayer'>").attr("value",JSON.stringify(window.PLAYER)))            
            .append($("<input type='hidden' name='hashscript' >").attr("value",cipher))
            .append
            (
            $("<a id='buttonreport'>").attr("value",window.plugin.sak.namescaricareport).attr("onclick","$('#buttonreport');$('#istantanea"+data.idreport+"').submit();$('#istantanea"+data.idreport+"').remove();").text(window.plugin.sak.namescaricareport+" codice: "+data.idreport)
            );*/

            //$('#containeristantanea').append(getteristantanea);
			if(data.codecontrol > 0)
			{
			if(!window.isSmartphone())
				$('#containeristantanea').append
				(
				$("<div id='istantanea"+data.idreport+"'>").append($("<a class='reports'>").attr("value",window.plugin.sak.namescaricareport).attr("onclick","window.plugin.sak.getIstantanea("+data.idreport+");$('#istantanea"+data.idreport+"').remove();").text(window.plugin.sak.namescaricareport+" codice: "+data.idreport)
				));
			else
				$('#containeristantanea').append
				(
				$("<div id='istantanea"+data.idreport+"'>").append($("<label class='reports'>").html("Il report codice: "+data.idreport+" è stato registrato")
				));
			}

			console.log("Dati inviati al server correttamente!");
			console.log("Il server ha impostato il limite di caricamento a "+data.maxload+" azioni.")
			window.plugin.sak.CONST_LIMIT = data.maxload;
			window.plugin.sak.limiteActions= window.plugin.sak.CONST_LIMIT;
			
			window.plugin.sak.countcalls = window.plugin.sak.countcalls-1;
			$('#countcalls').html(window.plugin.sak.countcalls);
			$('#resetreports').show();
       		if(window.plugin.sak.countcalls == 0)
				$("#buttoninvia").attr("value",window.plugin.sak.nameinvia).text(window.plugin.sak.nameinvia);

			//è a true solo dopo la prima volta che si è registrato
			$('#statsinviodati').html(data.esito);
			var countRetryStats = 0;
			var lockStats = false;
			function mutexStats() {                // a function called 'wait'

				
				if(countRetryStats == 10 && lockStats)
				{
					$('#statsinviodati').html('');
					clearInterval(setAndLockStats); //stops the function being called again.
					lockStats = false;
					
				}
				else
				{
					countRetryStats++;
					lockStats = true;
				}
			
			}
			if(!lockStats)
				setAndLockStats = setInterval(mutexStats, 1000); // calls the function wait after 2 seconds						
			
            }
           ).fail(function(xhr, textStatus, errorThrown) {
				console.log(xhr.statusText); 
				console.log(xhr.responseText);
				console.log(textStatus);
				console.log(error);
				//alert("Si è verificato un errore di comunicazione! Verificare l'abilitazione https oppure riprovare. Per supporto inviare una email a kmtnck@dominioatuascelta");
				$('#esitoserver').html("Si è verificato un errore di comunicazione! Verificare l'abilitazione https oppure riprovare. Per supporto inviare una email a kmtnck@dominioatuascelta");
				$("#buttoninvia").attr("value",window.plugin.sak.nameinvia).text(window.plugin.sak.nameinvia);
				window.plugin.sak.countcalls = window.plugin.sak.countcalls-1;
				$('#countcalls').html(window.plugin.sak.countcalls);

			});

        return true;
        }
}
	
//il metodo si limita a controllare se il giocatore owned del portale selezionato ha almeno un resonatore deployato
window.plugin.sak.checkreso = function (e, t) {
        try {
            for (var n = 0; n < t.length; n++) {
                if (t[n].owner.toLowerCase() == e.toLowerCase()) {
                    return 1;
                }
            }
            return 0;
        } catch (r) {
            return 0;
        }
    }

//----------------------------------
window.plugin.sak.MD5 =  
{
        /*
         * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
         * Digest Algorithm, as defined in RFC 1321.
         * Copyright (C) Paul Johnston 1999 - 2000.
         * Updated by Greg Holt 2000 - 2001.
         * See http://pajhome.org.uk/site/legal.html for details.
         */
        
        /*
         * Convert a 32-bit number to a hex string with ls-byte first
         */
        hex_chr : "0123456789abcdef",
        
        rhex : function(num)
        {
          str = "";
          for(j = 0; j <= 3; j++)
            str += this.hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
                   this.hex_chr.charAt((num >> (j * 8)) & 0x0F);
          return str;
        },
        
        /*
         * Convert a string to a sequence of 16-word blocks, stored as an array.
         * Append padding bits and the length, as described in the MD5 standard.
         */
        str2blks_MD5 : function(str)
        {
          nblk = ((str.length + 8) >> 6) + 1;
          blks = new Array(nblk * 16);
          for(i = 0; i < nblk * 16; i++) blks[i] = 0;
          for(i = 0; i < str.length; i++)
            blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
          blks[i >> 2] |= 0x80 << ((i % 4) * 8);
          blks[nblk * 16 - 2] = str.length * 8;
          return blks;
        },

        /*
         * Add integers, wrapping at 2^32. This uses 16-bit operations internally 
         * to work around bugs in some JS interpreters.
         */
        add : function(x, y)
        {
          var lsw = (x & 0xFFFF) + (y & 0xFFFF);
          var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
          return (msw << 16) | (lsw & 0xFFFF);
        },

        /*
         * Bitwise rotate a 32-bit number to the left
         */
        rol : function(num, cnt)
        {
          return (num << cnt) | (num >>> (32 - cnt));
        },

        /*
         * These functions implement the basic operation for each round of the
         * algorithm.
         */
        cmn : function(q, a, b, x, s, t)
        {
          return this.add(this.rol(this.add(this.add(a, q), this.add(x, t)), s), b);
        },
        
        ff : function(a, b, c, d, x, s, t)
        {
          return this.cmn((b & c) | ((~b) & d), a, b, x, s, t);
        },
        gg : function(a, b, c, d, x, s, t)
        {
          return this.cmn((b & d) | (c & (~d)), a, b, x, s, t);
        },
        
        hh : function(a, b, c, d, x, s, t)
        {
          return this.cmn(b ^ c ^ d, a, b, x, s, t);
        },
        
        ii : function(a, b, c, d, x, s, t)
        {
          return this.cmn(c ^ (b | (~d)), a, b, x, s, t);
        },        
        
        calcMD5 : function(str)
        {
            //return str;
            
            x = this.str2blks_MD5(str);
              a =  1732584193;
              b = -271733879;
              c = -1732584194;
              d =  271733878;
            
              for(i = 0; i < x.length; i += 16)
              {
                olda = a;
                oldb = b;
                oldc = c;
                oldd = d;
            
                a = this.ff(a, b, c, d, x[i+ 0], 7 , -680876936);
                d = this.ff(d, a, b, c, x[i+ 1], 12, -389564586);
                c = this.ff(c, d, a, b, x[i+ 2], 17,  606105819);
                b = this.ff(b, c, d, a, x[i+ 3], 22, -1044525330);
                a = this.ff(a, b, c, d, x[i+ 4], 7 , -176418897);
                d = this.ff(d, a, b, c, x[i+ 5], 12,  1200080426);
                c = this.ff(c, d, a, b, x[i+ 6], 17, -1473231341);
                b = this.ff(b, c, d, a, x[i+ 7], 22, -45705983);
                a = this.ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
                d = this.ff(d, a, b, c, x[i+ 9], 12, -1958414417);
                c = this.ff(c, d, a, b, x[i+10], 17, -42063);
                b = this.ff(b, c, d, a, x[i+11], 22, -1990404162);
                a = this.ff(a, b, c, d, x[i+12], 7 ,  1804603682);
                d = this.ff(d, a, b, c, x[i+13], 12, -40341101);
                c = this.ff(c, d, a, b, x[i+14], 17, -1502002290);
                b = this.ff(b, c, d, a, x[i+15], 22,  1236535329);    
            
                a = this.gg(a, b, c, d, x[i+ 1], 5 , -165796510);
                d = this.gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
                c = this.gg(c, d, a, b, x[i+11], 14,  643717713);
                b = this.gg(b, c, d, a, x[i+ 0], 20, -373897302);
                a = this.gg(a, b, c, d, x[i+ 5], 5 , -701558691);
                d = this.gg(d, a, b, c, x[i+10], 9 ,  38016083);
                c = this.gg(c, d, a, b, x[i+15], 14, -660478335);
                b = this.gg(b, c, d, a, x[i+ 4], 20, -405537848);
                a = this.gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
                d = this.gg(d, a, b, c, x[i+14], 9 , -1019803690);
                c = this.gg(c, d, a, b, x[i+ 3], 14, -187363961);
                b = this.gg(b, c, d, a, x[i+ 8], 20,  1163531501);
                a = this.gg(a, b, c, d, x[i+13], 5 , -1444681467);
                d = this.gg(d, a, b, c, x[i+ 2], 9 , -51403784);
                c = this.gg(c, d, a, b, x[i+ 7], 14,  1735328473);
                b = this.gg(b, c, d, a, x[i+12], 20, -1926607734);
                
                a = this.hh(a, b, c, d, x[i+ 5], 4 , -378558);
                d = this.hh(d, a, b, c, x[i+ 8], 11, -2022574463);
                c = this.hh(c, d, a, b, x[i+11], 16,  1839030562);
                b = this.hh(b, c, d, a, x[i+14], 23, -35309556);
                a = this.hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
                d = this.hh(d, a, b, c, x[i+ 4], 11,  1272893353);
                c = this.hh(c, d, a, b, x[i+ 7], 16, -155497632);
                b = this.hh(b, c, d, a, x[i+10], 23, -1094730640);
                a = this.hh(a, b, c, d, x[i+13], 4 ,  681279174);
                d = this.hh(d, a, b, c, x[i+ 0], 11, -358537222);
                c = this.hh(c, d, a, b, x[i+ 3], 16, -722521979);
                b = this.hh(b, c, d, a, x[i+ 6], 23,  76029189);
                a = this.hh(a, b, c, d, x[i+ 9], 4 , -640364487);
                d = this.hh(d, a, b, c, x[i+12], 11, -421815835);
                c = this.hh(c, d, a, b, x[i+15], 16,  530742520);
                b = this.hh(b, c, d, a, x[i+ 2], 23, -995338651);
            
                a = this.ii(a, b, c, d, x[i+ 0], 6 , -198630844);
                d = this.ii(d, a, b, c, x[i+ 7], 10,  1126891415);
                c = this.ii(c, d, a, b, x[i+14], 15, -1416354905);
                b = this.ii(b, c, d, a, x[i+ 5], 21, -57434055);
                a = this.ii(a, b, c, d, x[i+12], 6 ,  1700485571);
                d = this.ii(d, a, b, c, x[i+ 3], 10, -1894986606);
                c = this.ii(c, d, a, b, x[i+10], 15, -1051523);
                b = this.ii(b, c, d, a, x[i+ 1], 21, -2054922799);
                a = this.ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
                d = this.ii(d, a, b, c, x[i+15], 10, -30611744);
                c = this.ii(c, d, a, b, x[i+ 6], 15, -1560198380);
                b = this.ii(b, c, d, a, x[i+13], 21,  1309151649);
                a = this.ii(a, b, c, d, x[i+ 4], 6 , -145523070);
                d = this.ii(d, a, b, c, x[i+11], 10, -1120210379);
                c = this.ii(c, d, a, b, x[i+ 2], 15,  718787259);
                b = this.ii(b, c, d, a, x[i+ 9], 21, -343485551);
            
                a = this.add(a, olda);
                b = this.add(b, oldb);
                c = this.add(c, oldc);
                d = this.add(d, oldd);
              }
              return this.rhex(a) + this.rhex(b) + this.rhex(c) + this.rhex(d);
		}
    }
    
window.plugin.sak.passcode = null;
window.plugin.sak.scarabocchio = null;
window.plugin.sak.username = null;
window.plugin.sak.status = false;
window.plugin.sak.mustRegister = false;
window.plugin.sak.firstcall = false;

//metodo per verificare il riconoscimento dell'utente
window.plugin.sak.checkIntegrity = function()
    {
        console.log("Avvio richiesta passcode");
		$('#esitoclient').html('Riconoscimento utente in corso...');

    
		$.post(window.plugin.sak.endpointsak
               ,
                {
                    context : "checkintegrity",
					player : window.PLAYER					
                },
                function(data) {

					console.log("Username identificato: "+data.username);
					console.log("Passcode ricevuto: "+data.passcode);
					console.log("Scarabocchio da firmare ricevuto: "+data.scarabocchio);
					console.log("Esito autenticazione: "+data.esito);
					var passcode = data.passcode;
					window.plugin.sak.passcode = passcode;
					window.plugin.sak.scarabocchio = data.scarabocchio;
					
					window.plugin.sak.username = data.username;
					window.plugin.sak.status = data.status;
					window.plugin.sak.mustRegister = data.mustRegister;
					$('#esitoserver').html(data.esito);
					$('#esitoclient').html('');

					if(window.plugin.sak.mustRegister)
					$('#registration').html("<fieldset>Invia i dati la prima volta per firmare questa frase non sense:<br/><br/><i>"+data.scarabocchio+"</i><br/><br/>good luck!</fieldset>");
					
					var countRetry = 0;
					function hideEsito() {                // a function called 'wait'
					
					$('#esitoserver').html('');
					//$('#registration').html('');
					clearInterval(timerHide); //stops the function being called again.
					}
					timerHide = setInterval(hideEsito, 10000); // calls the function wait after 2 seconds
					
					
					window.plugin.sak.firstcall = true;

                }
        	).fail(function(xhr, textStatus, errorThrown) {
				console.log(xhr.statusText); 
				console.log(xhr.responseText);
				console.log(textStatus);
				console.log(error);
				console.log(errorThrown);
				var msg = xhr.statusText+" "+xhr.responseText+" "+textStatus+" "+error+" "+errorThrown;
				/*$('#sectionsak').append
						(
						$("<div id='linktrusturl'/>")append
						.$("<a target='blank'>")
										.attr("href","http://dominioatuascelta/ingress/abilitahttps.html")
										.html("Abilitazione endpoint SAK")
						);*/
						
				alert("Si è verificato un errore di comunicazione! Si è verificato un problema durante l'autenticazione: "+msg);
				$("#buttoninvia").attr("value",window.plugin.sak.nameinvia).text(window.plugin.sak.nameinvia);
			});
    
    }
          
window.plugin.sak.base64Encode = function (data) {
          //  discuss at: http://phpjs.org/functions/base64_encode/
          // original by: Tyler Akins (http://rumkin.com)
          // improved by: Bayron Guevara
          // improved by: Thunder.m
          // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
          // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
          // improved by: Rafal Kukawski (http://kukawski.pl)
          // bugfixed by: Pellentesque Malesuada
          //   example 1: base64_encode('Kevin van Zonneveld');
          //   returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
          //   example 2: base64_encode('a');
          //   returns 2: 'YQ=='
        
          var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
          var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
            ac = 0,
            enc = '',
            tmp_arr = [];
        
          if (!data) {
            return data;
          }
        
          do { // pack three octets into four hexets
            o1 = data.charCodeAt(i++);
            o2 = data.charCodeAt(i++);
            o3 = data.charCodeAt(i++);
        
            bits = o1 << 16 | o2 << 8 | o3;
        
            h1 = bits >> 18 & 0x3f;
            h2 = bits >> 12 & 0x3f;
            h3 = bits >> 6 & 0x3f;
            h4 = bits & 0x3f;
        
            // use hexets to index into b64, and append result to encoded string
            tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
          } while (i < data.length);
        
          enc = tmp_arr.join('');
        
          var r = data.length % 3;
        
          return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
    }

window.plugin.sak.endpointsak = "https://dominioatuascelta/ingress/handler.php";
window.plugin.sak.nameinvia = "Invia dati";
window.plugin.sak.resetreports = "Rimuovi reports";
window.plugin.sak.namescaricareport = "Ottieni report";
window.plugin.sak.namesuspendreg = "Sospendi registrazione";
window.plugin.sak.namelifecapture = "Storico captured del portale corrente";
window.plugin.sak.datiPortaleCorrente;

window.plugin.sak.autoSendOnScroll;
window.plugin.sak.autoSendOnChangeBB;
window.plugin.sak.countcalls = 0;
	//configuratore dell'interfaccia gui del plugin su iitc
window.plugin.sak.hookSuspendreg = function(){
	
	if(window.plugin.sak.suspendreg)
	{
		window.plugin.sak.suspendreg = false;
		window.plugin.sak.namesuspendreg = "Sospendi registrazione";
	}
	else
	{
		window.plugin.sak.suspendreg = true;
		window.plugin.sak.namesuspendreg = "Avvia registrazione";
	}
	
	$('#buttonsuspendreg').attr("value",window.plugin.sak.namesuspendreg)
						  .attr("onclick","window.plugin.sak.hookSuspendreg();").text(window.plugin.sak.namesuspendreg);
	
	
}

window.plugin.sak.setupLink = function(){

		var registration = $("<br/><div id='registration' />");
		var sectionsak = $("<div id='sectionsak'>");
		var titolosak = "SAK Tools Desktop";
		if(window.isSmartphone())
			titolosak = "SAKm Tools Android/Mobile";
			
		var containersak = $("<fieldset>").append($("<legend>").text(titolosak +" - 2.0.0.20160216.0009"));
		containersak.append($("<label id='disclaimer'>").html('<i>This site and the scripts are not officially affiliated with Ingress or Niantic Labs at Google. Using these scripts is likely to be considered against the Ingress Terms of Service. Any use is at your own risk.</i><br/><br/>'));
		containersak.append($("<label id='desccountcalls'>").html('Richieste attive: '));
		containersak.append($("<label id='countcalls'>").html(window.plugin.sak.countcalls));
		containersak.append($("<br/>"));
		containersak.append(registration);
		containersak.append
        (
        $("<a id='resetreports'>")
                	.attr("value",window.plugin.sak.resetreports)
                    .attr("onclick","$('.reports').remove();$('resetreports').hide()").text(window.plugin.sak.resetreports).hide()
        )
		.append($("<br/>"))
		.append
        (
        $("<a id='buttonsuspendreg'>")
                	.attr("value",window.plugin.sak.namesuspendreg)
                    .attr("onclick","window.plugin.sak.hookSuspendreg();").text(window.plugin.sak.namesuspendreg)
        ).append($("<br/>"))
		.append
        (
        $("<a id='buttoninvia'>")
                	.attr("value",window.plugin.sak.nameinvia)
                    .attr("onclick","window.plugin.sak.writeLog();").text(window.plugin.sak.nameinvia)
        );/*.append(
		$("<input type='checkbox' id='autoScroll' onclick='window.plugin.sak.autoSendOnScroll = $('#autoScroll').is(':checked')'>").attr('value',window.plugin.sak.autoSendOnScroll).text('Invio allo scroll')
		);*/
		/*.append(
		$("<input type='checkbox' id='autoChangeBB' onclick='window.plugin.sak.autoSendOnChangeBB = $('#autoChangeBB').is(':checked')'>").attr('value',window.plugin.sak.autoSendOnChangeBB).text('Invio al cambio mappa')
		)
		;*/
		containersak.append($("<br/>"));
		sectionsak.append(containersak);
		//rimane vuoto per ora
		var esitoserver = $("<label id='esitoserver' />");
		var esitoclient = $("<label id='esitoclient' />");
		containersak.append(esitoserver);
		containersak.append($("<br/>"));
		containersak.append(esitoclient);
		//if(window.plugin.sak.mustRegister)
        var labelAddressPortale = $("<label style='color: #ffce00;' id='addressportale' />");
		containersak.append($("<br/>"));
        containersak.append(labelAddressPortale);
        var dataCapturePortal = $("<label id='datacaptureportale' />");
		containersak.append($("<br/>"));
        containersak.append(dataCapturePortal);
        var timelapsecaptureportale = $("<label id='timelapsecaptureportale' />");
		containersak.append($("<br/>"));
        containersak.append(timelapsecaptureportale);
        containersak.append($("<br/>"));

		//in questa sezione si possono aggiungere tutti gli input per chiamare i metodi jquery per interrogare il server con nuovi tracciati dati
        var sectionsearch = $("<div id='consolericerca'>");
		sectionsearch.append
        (
        $("<a id='inputlifecapture'>")
                	.attr("value",window.plugin.sak.namelifecapture)
                    .attr("onclick","window.plugin.sak.getLifeCapture();if(window.isSmartphone())$('#inputlifecapture').hide()").text(window.plugin.sak.namelifecapture).hide()
        ).append("<br>")
		.append
        (
        $("<input type='text' id='inputsearchportal' size='40'>")
                	.attr("placeholder","Ricerca portali dal titolo")
                    .attr("name","titolo")
                    .attr("onkeypress","window.plugin.sak.searchPortals(event);")
        ).append("<br>")
		.append
        (
        $("<input type='text' id='inputconsultaattivita' size='40'>")
                	.attr("placeholder","Richiedi report base del player")
                    .attr("name","player")
                    .attr("onkeypress","window.plugin.sak.consultaAttivita(event);")
        ).append("<br>")		
		.append
        (
        $("<input type='text' id='inputconsultaguardians' size='40'>")
                	.attr("placeholder","Richiedi lista guardians del player")
                    .attr("name","player")
                    .attr("onkeypress","window.plugin.sak.consultaGuardians(event);")
        ).append("<br>")		
		;
		var sectionreport = $("<form id='submitreport' method='post'>");
        sectionreport.attr("action",window.plugin.sak.endpointsak);
		
		var countRetry = 0;
		var lock = false;
		var isappend = false;
		function mutex() {                // a function called 'wait'
			if(/*window.plugin.sak.firstcall ||*/ countRetry == 7)
			{
				if(!isappend && !window.plugin.sak.status)
				{
					if(!window.plugin.sak.status /*&& !window.plugin.sak.mustRegister*/)
					{

						containersak
						.append
						(
						$("<div id='linktrusturl'/>").append(
										$("<a target='blank'>")
										.attr("href","http://dominioatuascelta/ingress/abilitahttps.html")
										.html("Abilitazione endpoint SAK"))
						);
						isappend = true;
					}
				}
				clearInterval(setAndLock); //stops the function being called again.
				lock = false;

			}
			else
			{
				countRetry++;
				lock = true;
			}
		
		}
		
		if(!lock)
		setAndLock = setInterval(mutex, 1000); // calls the function wait after 2 seconds
		
		
		var countRetryDisc = 0;
		var lockDiscl = false;
		function mutexDiscl() {                // a function called 'wait'
			if(countRetryDisc == 10 && lockDiscl)
			{
				clearInterval(setAndLockDiscl); //stops the function being called again.
				$('#disclaimer').html('');
				lockDiscl = false;

			}
			else{
				countRetryDisc++;
				lockDiscl = true;
			}
		
		}
		
		if(!lockDiscl)
			setAndLockDiscl = setInterval(mutexDiscl, 1000); // calls the function wait after 2 seconds
		
		if(!window.isSmartphone())
			containersak.append(sectionsearch);
		else{
				containersak.append($("<br/>"));
				containersak.append($('<div/>').text('Console di ricerca disattivata provvisoriamente per la versione Mobile'));
			}

		containersak.append(sectionreport);
		containersak.append($("<br/>"));
		containersak.append($("<div id='statsinviodati'>"));
		containersak.append($("<br/>"));
		containersak.append($("<div id='containeristantanea'>"));

        
		var sectionFilterFull = $("<div id='filterfull'><input id='activeFilter' type='checkbox' onclick=\"window.plugin.sak.chat.activeRequestOverride($('#activeFilter').is(':checked'))\"/>Attiva filtro chat (handle with care!)<div><input size=\"30\" id=\"filterinclude\" placeholder=\"Separa con una virgola gli utenti da visualizzare\" /></div></div>");
		//containersak.append(sectionFilterFull);
		
		$('#toolbox').append(sectionsak);
    }
    
	//inizializzazione del plugin durante la fase di setuping di iitc
var setup = function () {

		if(window.isSmartphone())
			console.log('Avviata versione Android Mobile!');
		else
			console.log('Avviata versione Desktop!');
		
		window.chat.requestFaction  = window.plugin.sak.chat.requestFaction;
		window.chat.requestPublic	= window.plugin.sak.chat.requestPublic;
		window.chat.requestAlerts	= window.plugin.sak.chat.requestAlerts;
        console.log("Override request dei messaggi faction, public e alerts eseguito .");

        window.plugin.sak.setupLink();
        console.log("Rendering console interfaccia eseguito ..");
        window.plugin.sak.checkIntegrity();
        console.log("Procedura di avvio riconoscimento e login utente eseguito ...");

		window.addHook('portalDetailLoaded', window.plugin.sak.sendPortalInfo);
		window.addHook('portalDetailsUpdated', window.plugin.sak.sendPortalInfo);
        console.log("Aggancio evento invio inforamzioni portale eseguito ....");
		//window.addHook('portalSelected', window.plugin.sak.sendPortalInfo);
		
		window.plugin.sak.chat.activeRequestOverride();
		
        console.log(">>> Configurazione del SAK avvenuto con successo!! <<<");
    }
	
	//permette l'azione submit tramite pressione del tasto enter sulla form dell'id desiderato
	/*window.plugin.sak.checkSubmit = function (e, idform)
	{
	   if(e && e.keyCode == 13)
	   {
    		var source = window.plugin.sak.getSource();
            $("#hash").val(source);
            $("#" + idform).submit();
            
	   }
	}*/
    
	/*
	Esegue la creazione del report (csv o html) del contenuto del tab selezionato tra i quattro disponibili nella sezione chat di iitc.
	Ogni richiesta report esegue una copia del contenuto nella banca dati hostata su dominioatuascelta, tramite i quali e' possibile ottenere lo storico di uno specifico player
	*/
	window.plugin.sak.escapeRegExp = function (str) {
			return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	}
	window.plugin.sak.replaceAll = function (str, find, replace) {
			return str.replace(new RegExp(window.plugin.sak.escapeRegExp(find), 'g'), replace);
	}

	
    
    setup.info = plugin_info; //add the script info data to the function as a property
    if(!window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(setup);
    // if IITC has already booted, immediately run the 'setup' function
    if(window.iitcLoaded && typeof setup === 'function') 
        setup();
} // wrapper end

// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) 
    info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);
