// ==UserScript==
// @id             iitc-sak-@alessandromodica
// @name           IITC plugin: sak-swissarmyknife-release
// @category       Strategia
// @version        5.9.9.20170421.4001
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      http://alessandromodica.com/ingress/sak.user.js
// @downloadURL    http://alessandromodica.com/ingress/sak.user.js
// @description    Un coltellino svizzero per chi gioca a ingress. Attualmente supporta: 1- report attivita' e conversazioni on the fly 2- report delle attivita' e dei guardian di uno specifico player 3- blacklisting per inibire l'uso del plugin a specifici giocatori
// @include        https://*.ingress.com/intel*
// @include        http://*.ingress.com/intel*
// @match          https://*.ingress.com/intel*
// @match          http://*.ingress.com/intel*
// @match          http://alessandromodica.com/ingress/handler.php*
// @match          https://alessandromodica.com/ingress/handler.php*
// @grant          none
// @author         kmtnck
// ==/UserScript==

function wrapper(plugin_info) {

    //XXX: Metodo per caricare in modo asincrono gli script	
    // from https://github.com/chriso/load.js
    /* Copyright (c) 2010 Chris O'Hara <cohara87@gmail.com>. MIT Licensed */
    function asyncLoadScript(a)
    {
        return function(b,c)
        {
            var d=document.createElement("script");
            d.type="text/javascript",d.src=a,d.onload=b,d.onerror=c,d.onreadystatechange=function()
            {
                var a=this.readyState;
                if(a==="loaded"||a==="complete")d.onreadystatechange=null,b()
                    },head.insertBefore(d,head.firstChild)
        }
    }
    (function(a)
     {

        a=a||{};
        var b={},c,d;c=function(a,d,e)
        {
            var f=a.halt=!1;
            a.error=function(a)
            {throw a},a.next=function(c)
            {
                c&&(f=!1);
                if(!a.halt&&d&&d.length)
                {
                    var e=d.shift(),g=e.shift();
                    f=!0;try{b[g].apply(a,[e,e.length,g])}catch(h){a.error(h)}}return a
            };
            for(var g in b)
            {
                if(typeof a[g]=="function")continue;
                (function(e)
                 {
                    a[e]=function()
                    {
                        var g=Array.prototype.slice.call(arguments);
                        if(e==="onError")
                        {
                            if(d)return b.onError.apply(a,[g,g.length]),a;
                            var h={};
                            return b.onError.apply(h,[g,g.length]),c(h,null,"onError")
                        }return g.unshift(e),d?(a.then=a[e],d.push(g),f?a:a.next()):c({},[g],e)
                    }
                })(g)
            }return e&&(a.then=a[e]),a.call=function(b,c)
            {
                c.unshift(b),d.unshift(c),a.next(!0)
            },a.next()
        },d=a.addMethod=function(d)
        {
            var e=Array.prototype.slice.call(arguments),f=e.pop();
            for(var g=0,h=e.length;g<h;g++)
                typeof e[g]=="string"&&(b[e[g]]=f);--h||(b["then"+d.substr(0,1).toUpperCase()+d.substr(1)]=f),c(a)
        },d("chain",
            function(a)
            {
            var b=this,c=function()
            {
                if(!b.halt)
                {
                    if(!a.length)return b.next(!0);
                    try{null!=a.shift().call(b,c,b.error)&&c()}catch(d){b.error(d)}
                }
            };
            c()
        }),d("run",
             function(a,b)
             {
            var c=this,d=function()
            {
                c.halt||--b||c.next(!0)
            },e=function(a)
            {
                c.error(a)
            };
            for(var f=0,g=b;!c.halt&&f<g;f++)null!=a[f].call(c,d,e)&&d()
                }),d("defer",
                     function(a)
                     {
            var b=this;
            setTimeout(function()
                       {
                b.next(!0)
            },a.shift())
        }),
            d("onError",
              function(a,b)
              {
            var c=this;this.error=function(d)
            {
                c.halt=!0;
                for(var e=0;e<b;e++)a[e].call(c,d)
                    }
        })
    })(this);
    var head=document.getElementsByTagName("head")[0]||document.documentElement;
    addMethod("load",
              function(a,b)
              {
        for(var c=[],d=0;d<b;d++)
            (function(b)
             {
                c.push(asyncLoadScript(a[b]))
            }
            )(d);
        this.call("run",c)
    });
    // ------------------------------------------------------------------------------------------------------

    // ensure plugin framework is there, even if iitc is not yet loaded
    if (typeof window.plugin !== 'function')
        window.plugin = function() {
        };

    // metodo di default
    window.plugin.sak = function() {
    };
    window.plugin.sak.chat = function() {
    };

    window.plugin.sak.MapDataRequest = function() {
    };

	window.plugin.sak.cloudbookmark = function(){
		
	};

	window.plugin.sak.signatureSak = function(){};

	window.plugin.sak.playerTracker = function(){};
	
	

	window.plugin.sak.rootpath = "https://alessandromodica.com/ingress/";
    window.plugin.sak.endpointsak = window.plugin.sak.rootpath+"handler.php";
	window.plugin.sak.mediasak = window.plugin.sak.rootpath+"media/";

    window.plugin.sak.setupSak = function()
    {
        //Costanti parametriche del Sak Client
        window.plugin.sak.versione = "5.9.9.20170421.4001";

        //inizializzazione parametri niantic personalizzati
        window.portalDetail = window.plugin.sak.portalDetail;
        window.plugin.sak.portalDetail.get = window.plugin.sak.portalDetailGet;
        window.portalDetail.isFresh = window.plugin.sak.portalDetailIsFresh;
        window.plugin.sak.cache = new DataCache();
        window.portalDetail.request = window.plugin.sak.portalDetailRequest;
        window.renderPortalDetails = window.plugin.sak.renderPortalDetails;
        window.selectPortal = window.plugin.sak.selectPortal;
        window.handleResponse = window.plugin.sak.handleResponse;
        window.renderUpdateStatus = window.plugin.sak.renderUpdateStatus;
        window.postAjax = window.plugin.sak.postAjax;
        window.MapDataRequest.prototype.sendTileRequest = window.plugin.sak.MapDataRequest.prototype.sendTileRequest;
        window.MapDataRequest.prototype.handleResponse = window.plugin.sak.MapDataRequest.prototype.handleResponse;
        window.MapDataRequest.prototype.pushRenderQueue = window.plugin.sak.MapDataRequest.prototype.pushRenderQueue;
		
		
		
		window.runHooks = window.plugin.sak.runHooks;
        window.plugin.sak.extractFromStock();

        window.plugin.sak.chat.setupPosting();

        //iniecting css e js custom
        headHTML = document.getElementsByTagName('head')[0].innerHTML;
        headHTML += '<link rel="stylesheet" type="text/css" href="'+window.plugin.sak.mediasak+'style.css?random'+random+'" />';
        headHTML += '<link rel="stylesheet" type="text/css" href="'+window.plugin.sak.mediasak+'style-gui.css?random'+random+'" />';
        headHTML +=	'<link rel="stylesheet" type="text/css" href="'+window.plugin.sak.mediasak+'extreme/responsivetables.css?random'+random+'" />';

		document.getElementsByTagName('head')[0].innerHTML = headHTML;


        if (window.isSmartphone())
            console.log('Avviata versione Android Mobile!');
        else
            console.log('Avviata versione Desktop!');

        window.chat.requestFaction = window.plugin.sak.chat.requestFaction;
        window.chat.requestPublic = window.plugin.sak.chat.requestPublic;
        window.chat.requestAlerts = window.plugin.sak.chat.requestAlerts;
        window.chat.getChatPortalName = window.plugin.sak.chat.getChatPortalName;

        window.chat.writeDataToHash = window.plugin.sak.chat.writeDataToHash;

        console.log("Override request dei messaggi faction, public e alerts eseguito .");

        window.plugin.sak.setupLayerCSS();
		window.plugin.sak.signatureSak.setupMetaGoogleSignIn();

        window.plugin.sak.levelLayerGroup = new L.LayerGroup();
        window.addLayerGroup('Geographic Information Sak', window.plugin.sak.levelLayerGroup, true);


        console.log("Rendering console interfaccia eseguito ..");
        window.plugin.sak.checkIntegrity();
        console.log("Procedura di avvio riconoscimento e login utente eseguito ...");

        window.addHook('mapDataRefreshEnd', window.plugin.sak.refreshPortalDataSAK);


        window.addHook('portalDetailLoaded', window.plugin.sak.sendPortalInfo);
        window
            .addHook('portalDetailsUpdated',
                     window.plugin.sak.sendPortalInfo);
        console.log("Aggancio evento invio informazioni portale eseguito ....");

        $(document).off('click');
        $(document).on('click', '.nickname', function(event) {
            return window.plugin.sak.chat.nicknameClicked(event, $(this).text());
        });

		if(window.plugin.bookmarks != undefined)
		{
			console.info("Individuato il plugin dei bookmarks. Provvedo a eseguire l'override per la sincronizzazione cloud");
			//window.plugin.bookmarks.saveStorage = window.plugin.sak.cloudbookmark.saveStorage;
			//window.plugin.bookmarks.saveStorageBox = window.plugin.sak.cloudbookmark.saveStorageBox;
			//window.plugin.bookmarks.loadStorageBox = window.plugin.sak.cloudbookmark.loadStorageBox;
			
			window.plugin.bookmarks.switchStarPortal = window.plugin.sak.cloudbookmark.switchStarPortal;
			
			//XXX: disattivato l'override del reset sincronizzato sul cloud per valutare migliorie ergonomiche affinchè non avvengano reset cloud involontari
			window.plugin.bookmarks.optReset = window.plugin.sak.cloudbookmark.optReset;
			$("#containersincronizzazione").show();
			//caricamento dei bookmarks con sincronizzazione sul cloud sak
			
			//window.plugin.sak.cloudbookmark.syncSakStorage('syncronize','oneway');
			
			//window.plugin.bookmarks.loadStorageBox();
			//window.plugin.bookmarks.saveStorage();
		    //window.plugin.bookmarks.refreshBkmrks();
			//window.plugin.bookmarks.addAllStars();
			//window.plugin.bookmarks.loadList('portals');
			//window.plugin.bookmarks.setupContent();
			//window.plugin.bookmarks.setupCSS();

		}
		else
			console.info("Il plugin dei bookmarks non è stato trovato.");

        window.plugin.sak.chat.activeRequestOverride();

	
		
		$('#googleSignOut').hide();

        console.info(">>> Configurazione del SAK avvenuto con successo!! <<<");
    }

	window.plugin.sak.renderAutocomplete = function(idInputText,listObj)
	{
		  $( function() {
			  
			var availableTags = [
			  "ActionScript",
			  "AppleScript",
			  "Asp",
			  "BASIC",
			  "C",
			  "C++",
			  "Clojure",
			  "COBOL",
			  "ColdFusion",
			  "Erlang",
			  "Fortran",
			  "Groovy",
			  "Haskell",
			  "Java",
			  "JavaScript",
			  "Lisp",
			  "Perl",
			  "PHP",
			  "Python",
			  "Ruby",
			  "Scala",
			  "Scheme"
			];

			$("#"+idInputText).autocomplete({
			  source: listObj
			});
			
		  } );
  
	}

	window.plugin.sak.hookSearchNickname = function(idInputText)
	{

		console.info("Aggancio hook autocomplete per il componente "+idInputText);
		 $("#"+idInputText).bind('keyup',function(){

			if($("#"+idInputText).val().length >= 2 ){
				window.plugin.sak.listaPlayers(idInputText);
			}
			else
				window.plugin.sak.boxplayers.remove();	
		 
		 /*$("#boxplayer-"+idInputText).find("li").each(function(){
			 
			if($("#"+idInputText).val().length >= 2 ){
				if( $(this).is(":contains('"+ $("#"+idInputText).val() + "')") )
					$(this).show();//.css('display','inline');
				else
					$(this).hide();//.css('display','none');
		    }
			else{
			 $(this).css('display','none');
		   }
		   
		 });*/
		 
	   });			 
	}

    
	//metodo principale per chiamare il server sak nei vari casi di sincronizzazione
    window.plugin.sak.cloudbookmark.syncToCloud = function(objBookmark, paction) {
	
            var tipo = "SyncBookmarks";
            window.plugin.sak.countcalls = window.plugin.sak.countcalls + 1;
            window.plugin.sak.ledSak = 'green';
            $("#countcalls").css('color',window.plugin.sak.ledSak);
            $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

            var cipher = window.plugin.sak.getCipher();
			
			if(paction != 'syncronize')
				console.info('Sincronizzazione bookmarks guid '+objBookmark.guid);
			else
			{
				console.info('Sincronizzazione lista bookmarks :');
				console.info(objBookmark);
			}
			
            var inforequest = $
            .post(
                window.plugin.sak.endpointsak,
                {
                    context : "syncbookmark",
                    objplayer : JSON.stringify(window.PLAYER),
                    hashscript : cipher,
					data : JSON.stringify(objBookmark),
					action : paction
                },
                function(data) {
					
					console.info(data);
					if(paction == 'add')
						console.info('Bookmark salvato con successo!!');
					else if(paction == 'remove')
						console.info('Bookmark rimosso con successo!!');
					else if(paction == 'syncronize')
					{
						$.each(data.listObjToClient, function(i, cObj) {
							
							var latlng = cObj['lat']+","+cObj['lon'];
							
							var dataToSync = {};
							dataToSync.latlng = latlng;
							dataToSync.guid = cObj['guid'];
							dataToSync.titolo = cObj['titolo'];
							
							var checkBk = false;
							var dataLocale = window.plugin.sak.cloudbookmark.getPortalBookmarks();
							$.each(dataLocale, function(j, cbLocal) {
								
								if(cbLocal.guid == cObj['guid'])
								{
									checkBk = true;

									return;
								}
							
							});

							if(!checkBk)
							{								
								console.info("Bookmark "+cObj['titolo']+" sincronizzato in locale");
								plugin.bookmarks.addPortalBookmark(cObj['guid'],latlng,cObj['titolo']);
							}
						});
						
						console.info('Bookmarks sincronizzati con successo!!');
					}
						
					window.plugin.bookmarks.refreshBkmrks();
					
                    window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                    $('#countcalls').html(
                        window.plugin.sak.countcalls);
                    if(window.plugin.sak.countcalls > 0)
                        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

                })
            .fail(
                function(xhr, textStatus, errorThrown) {
                    console.log(xhr.statusText);
                    console.log(xhr.responseText);
                    console.log(textStatus);
                    console.error(error);
                    window.plugin.sak.getFailError(xhr,textStatus, "SyncBookmarks");
                    window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                    $('#countcalls').html(
                        window.plugin.sak.countcalls);
                    if(window.plugin.sak.countcalls > 0)
                        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);
                    //alert
                    console.error("Anomalia di comunicazione! SyncBookmarks fallito");
                });
	}
	
    window.plugin.sak.alertConfirmSyncToSak = function(actionsync)
    {	
        var messageConfirm = 
            "<table>\
			<tr><th>Tutti i bookmarks saranno cancellati in locale e sul server. Sei sicuro di procedere?</th></tr>\
			<tr><th>Se non vuoi applicare la sincronizzazione, annulla questa operazione e disattiva la sincronizzazione on demand.</th></tr>\
			</table>";

        var buttons = {};		
        buttons["OK"] = function() {
            $(this).dialog("close");
			console.log("Sincronizzazione oggetti sul cloud avviato");
			window.plugin.sak.cloudbookmark.syncSakStorage(actionsync);
			window.plugin.sak.cloudbookmark.submitReset();
			
        }
        buttons["Annulla"] = function() {
            console.log("Sincronizzazione oggetti annullato!");
            $(this).dialog("close");
        };
		
        dialog({
            title: 'Conferma sincronizzazione',
            html: messageConfirm,
            buttons: buttons
        });		
    }
	
  window.plugin.sak.cloudbookmark.optReset = function() {
	
	if(window.plugin.sak.supportedFlipFlop['enablesyncbookmarksak'])
	{
		window.plugin.sak.alertConfirmSyncToSak('removelist');	
	}
	else
	{
		var promptAction = confirm('All bookmarks will be deleted. Are you sure?', '');
    
		if(promptAction) {
			window.plugin.sak.cloudbookmark.submitReset ();
		}
	}
	
	//var messaggio = 'All bookmarks will be deleted. Are you sure?'
    /*var promptAction = confirm('All bookmarks will be deleted. Are you sure?', '');
    
	if(promptAction) {
      
      delete localStorage[window.plugin.bookmarks.KEY_STORAGE];
      window.plugin.bookmarks.createStorage();
      
      window.plugin.bookmarks.refreshBkmrks();
      window.runHooks('pluginBkmrksEdit', {"target": "all", "action": "reset"});
      console.log('BOOKMARKS: reset all bookmarks');
      window.plugin.bookmarks.optAlert('Successful. ');
    }*/
  }
  
  window.plugin.sak.cloudbookmark.submitReset = function()
  {
      delete localStorage[window.plugin.bookmarks.KEY_STORAGE];
      window.plugin.bookmarks.createStorage();
      
      window.plugin.bookmarks.refreshBkmrks();
      window.runHooks('pluginBkmrksEdit', {"target": "all", "action": "reset"});
      console.log('BOOKMARKS: reset all bookmarks');
      window.plugin.bookmarks.optAlert('Successful. ');	  
  }
  
  
  //Override del metodo originale in cui è stato iniettata la chiamata al sak nei casi in cui si aggiunge o rimuove un preferito sul cloud.
  //per policy il cloud viene allineato in tempo reale all'interazione col click (valutare se si vuole disattivare questa opzione)
  window.plugin.sak.cloudbookmark.switchStarPortal = function(guid) {
    if(guid == undefined) guid = window.selectedPortal;

    // If portal is saved in bookmarks: Remove this bookmark
    var bkmrkData = window.plugin.bookmarks.findByGuid(guid);
    if(bkmrkData) {
      var list = window.plugin.bookmarks.bkmrksObj['portals'];
      delete list[bkmrkData['id_folder']]['bkmrk'][bkmrkData['id_bookmark']];
      $('.bkmrk#'+bkmrkData['id_bookmark']+'').remove();

	  if(window.plugin.sak.supportedFlipFlop['enablesyncbookmarksak'])
	  {
		  console.log("---> E' stato rimosso il bookmarks del portale con guid "+guid);
		  var data = {};
		  data.guid = guid;
		  window.plugin.sak.cloudbookmark.syncToCloud(data, 'remove');
	  }
	  
      window.plugin.bookmarks.saveStorage();
      window.plugin.bookmarks.updateStarPortal();

      window.runHooks('pluginBkmrksEdit', {"target": "portal", "action": "remove", "folder": bkmrkData['id_folder'], "id": bkmrkData['id_bookmark'], "guid":guid});
      console.log('BOOKMARKS: removed portal ('+bkmrkData['id_bookmark']+' situated in '+bkmrkData['id_folder']+' folder)');
    }
    // If portal isn't saved in bookmarks: Add this bookmark
    else{
      // Get portal name and coordinates
      var p = window.portals[guid];
      var ll = p.getLatLng();

  	if(window.plugin.sak.supportedFlipFlop['enablesyncbookmarksak'])
	{
  	  console.log("---> E' stato salvato il bookmarks del portale con guid "+guid);
	  var data = {};
	  data.guid = guid;
	  data.title = p.options.data.title;
	  data.lat = ll.lat;
	  data.lon = ll.lng;
	  window.plugin.sak.cloudbookmark.syncToCloud(data, 'add');
	  console.log("Info boomarks: guid: "+guid+", Nome portale : "+p.options.data.title+" coordinate: "+ll.lat+","+ll.lng);
	}

      plugin.bookmarks.addPortalBookmark(guid, ll.lat+','+ll.lng, p.options.data.title);
    }
  }
  
  // Metodo che permette la sincronizzazione univoca o biunivoca dei preferiti
  // oneway --> aggiorna i preferiti locali con quelli presenti nel cloud sak
  // twoway --> aggiorna in entrambe le direzioni i preferiti sul cloud: aggiunge sul cloud i preferiti in locale se non presenti e aggiorna in locale i preferiti dal cloud non presenti.
  window.plugin.sak.cloudbookmark.syncSakStorage = function(typeSync, direction) {
	  
	  if(direction == null)
	  {
		  direction = 'twoway';
	  }
	  
    var dataLocal = [];
	
	console.log("---> E' stato caricata la lista dei bookmarks : ");
	var dataToSend = [];
	//solo nel caso twoway viene recuperata la lista dai preferiti locali da inviare al sak, altrimenti vuoto
	if(direction == 'twoway')
	{
		dataToSend = window.plugin.sak.cloudbookmark.getPortalBookmarks();
	}
	
	window.plugin.sak.cloudbookmark.syncToCloud(dataToSend, typeSync);
	
	console.log("<--- storage locale sincronizzato con successo");
  }


  //Metodo che recupera i preferiti dei portali (quelli delle mappe non è gestito)
  window.plugin.sak.cloudbookmark.getPortalBookmarks  = function() {
	  
	var bkmrksObj = JSON.parse(localStorage[plugin.bookmarks.KEY_STORAGE]);
	var dataLocal = window.plugin.bookmarks.bkmrksObj['portals']['idOthers']['bkmrk'];
	
	var dataResult = [];

	$.each(dataLocal, function(j, cBkmr) {
		dataResult.push(cBkmr);
	});
	
	return dataResult;
	
  }
  
  // Update the localStorage
  //questo metodo permette di salvare i preferiti nel cloud 
  //NON USATO
  /*window.plugin.sak.cloudbookmark.saveStorage = function() {
    localStorage[plugin.bookmarks.KEY_STORAGE] = JSON.stringify(window.plugin.bookmarks.bkmrksObj);
	
	//XXX: override bookmark.
	console.log("---> E' stato salvata la lista dei bookmarks : ");
	console.log(window.plugin.bookmarks.bkmrksObj);
	console.log("<--- storage locale sincronizzato con successo");
  }	*/

  /*window.plugin.sak.cloudbookmark.saveStorageBox = function() {
    localStorage[plugin.bookmarks.KEY_STATUS_BOX] = JSON.stringify(window.plugin.bookmarks.statusBox);
  }*/
  
  /*window.plugin.sak.cloudbookmark.loadStorageBox = function() {
    window.plugin.bookmarks.statusBox = JSON.parse(localStorage[plugin.bookmarks.KEY_STATUS_BOX]);
  }*/
  
	// ------------------------
    // ------------------------
    //METODI POSIZIONABILI SU sak_scripts.js
    // ------------------------
    // ------------------------

    /*
		Metodo che visualizza sulla mappa tutti i portali censiti dal SAK con un opportuno segnalino colorato.
*/
    window.plugin.sak.analyzePortalSAK = function()	{

        window.plugin.sak.deployDataSakPortal(true);
    }

    window.plugin.sak.analyzeCaratteristichePortal = function()	{

        window.plugin.sak.deployCaratteristichePortal(true);
    }
	
	window.plugin.sak.analyzeInfluenzaFazionePortal = function()	{

      window.plugin.sak.deployCaratteristichePortal(true,'influenzadominante');
    }
	
    window.plugin.sak.selectProfiloCaratteristiche = function()
    {
        var categoria = $( "#selectCaratteristiche option:selected" ).val();
        console.log("Categoria caratteristiche portali scelta: "+categoria);
        //window.plugin.sak.categoriaSakGis	 = categoria;
        window.plugin.sak.deleteRenderPortaliSAK();
		
        if(categoria == 'caratteristicheportali')
		{
			$("#influenzadominantesection").hide();
			$("#caratteristicheportalisection").show();
			
		}
        else if(categoria == 'influenzadominante')
        {
			$("#influenzadominantesection").show();
			$("#caratteristicheportalisection").hide();
        }
        else
        {
            $("#influenzadominantesection").hide();
            $("#caratteristicheportalisection").hide();
        }
		
    }	

    window.plugin.sak.refreshPortalDataSAK = function()	{

        if(window.plugin.sak.canScanGis('censimento'))
            window.plugin.sak.deployDataSakPortal(true);

		//XXX: disattivati i refresh automatici per il tracciamento e incisività a causa dei loro tempi macchina lunghi. 
        /*if(window.plugin.sak.canScanGis('tracciamentoplayer') && $('#inputtracciaplayer').val() != "")
            window.plugin.sak.analyzeTrackPlayer();

        if(window.plugin.sak.canScanGis('incisivitaplayer') && $('#inputincisivitaplayer').val() != "")
            window.plugin.sak.analyzeIncisivitaPlayer();*/

        //if(window.plugin.sak.canScanGis('caratteristicheportali'))
        //    window.plugin.sak.analyzeCaratteristichePortal();
		
    }

    window.plugin.sak.canScanGis = function(contesto)
    {
        var esito = false;
        if(window.plugin.sak.categoriaSakGis == contesto && window.plugin.sak.enableSakGIS)
        {
            esito = true;
        }

        return esito;
    }

    window.plugin.sak.deployDataSakPortal = function(isRender)
    {
        //XXX: reset della lista dei portali censiti dalla chiamata precedente
		$.each(window.plugin.sak.temiCensimento, function(j, cKey) {
	       $("#"+cKey).text("");
		});	
				
        var displayBounds = map.getBounds();
        var portaliToAnalyze = [];
        $.each(window.portals, function(i, portal) 
               {
            // eliminate offscreen portals (selected, and in padding)
            if(!displayBounds.contains(portal.getLatLng())) 
            {
            }
            else
            {
                //window.plugin.sak.checkExistPortal(portal,window.plugin.sak.addPortalNotCensed,false);
                portaliToAnalyze.push(portal.options.guid);
            }

        });

        window.plugin.sak.portaliNonCensiti = {};
        window.plugin.sak.getPortaliCensiti(portaliToAnalyze, isRender); 

    }
	
    window.plugin.sak.deployCaratteristichePortal = function(isRender, contesto)
    {
        //XXX: reset della lista dei portali censiti dalla chiamata precedente
		$.each(window.plugin.sak.temiCaratteristiche, function(j, cKey) {
	       $("#"+cKey).text("");
		});	
				
        var displayBounds = map.getBounds();
        var portaliToAnalyze = [];
        $.each(window.portals, function(i, portal) 
               {
            // eliminate offscreen portals (selected, and in padding)
            if(!displayBounds.contains(portal.getLatLng())) 
            {
            }
            else
            {
                //window.plugin.sak.checkExistPortal(portal,window.plugin.sak.addPortalNotCensed,false);
                portaliToAnalyze.push(portal.options.guid);
            }

        });

        window.plugin.sak.caratteristichePortali = {};
        window.plugin.sak.getCaratteristichePortali(portaliToAnalyze, isRender, contesto); 

    }

    /* ----------------------------------------------------------------------------------------------------------------------------- */
    /* ------------------- metodi di sperimentazione per la interrogazione automatica di oggetti tematizzati ----------------------- */
    /* -----------------------------------------------------------------------------------------------       ----------------------- */

    window.plugin.sak.deployTematizePortal = function()
    {
        var displayBounds = map.getBounds();
        $.each(window.portals, function(i, portal) 
               {
            var guid = portal.options.guid;
            // eliminate offscreen portals (selected, and in padding)
            if(!displayBounds.contains(portal.getLatLng())) 
            {
            }
            else
            {
                if(portal.options.datasak != undefined)
                {
                    var tematize = portal.options.datasak.classTematize;
                    if(window.plugin.sak.portaliToRegister[tematize] == null)
                    {
                        window.plugin.sak.portaliToRegister[tematize] = {};
                    }
                    window.plugin.sak.portaliToRegister[tematize][guid] = window.portals[guid];
                }
            }
        });
    }
	
    window.plugin.sak.deployTematizeCaratteristichePortal = function()
    {
        var displayBounds = map.getBounds();
		window.plugin.sak.caratteristichePortali["list"] = {};
        $.each(window.portals, function(i, portal) 
               {
            var guid = portal.options.guid;
            // eliminate offscreen portals (selected, and in padding)
            if(!displayBounds.contains(portal.getLatLng())) 
            {
            }
            else
            {
                if(portal.options.datacaratteristiche != undefined)
                {
                    var tematize = portal.options.datacaratteristiche.classTematize;
                    if(window.plugin.sak.caratteristichePortali[tematize] == null)
                    {
                        window.plugin.sak.caratteristichePortali[tematize] = {};
                    }
                    window.plugin.sak.caratteristichePortali[tematize][guid] = window.portals[guid];
					window.plugin.sak.caratteristichePortali["list"][guid] = window.portals[guid];
                }
            }
        });
    }

    window.plugin.sak.deployTematizeTrackPlayer = function()
    {
        var displayBounds = map.getBounds();
        window.plugin.sak.tracciamentoPlayer["list"] = {};

        $.each(window.portals, function(i, portal) 
               {
            var guid = portal.options.guid;
            if(!displayBounds.contains(portal.getLatLng())) 
            {
            }
            else
            {
                if(portal.options.datatrack != undefined)
                {
                    var tematize = portal.options.datatrack.classTematize;
                    if(window.plugin.sak.tracciamentoPlayer[tematize] == null)
                    {
                        window.plugin.sak.tracciamentoPlayer[tematize] = {};
                    }
                    window.plugin.sak.tracciamentoPlayer[tematize][guid] = window.portals[guid];
                    window.plugin.sak.tracciamentoPlayer["list"][guid] = window.portals[guid];
                }
            }
        });
    }
	
    window.plugin.sak.removeDataGis = function()
    {
        $.each(window.portals, function(i, portal) 
        {
			portal.options.datatrack = null;
			portal.options.datasak = null;
			portal.options.dataincisivita = null;
			portal.options.datacaratteristiche = null;
        });
		//reset del mapping dei layer gis 
		window.plugin.sak.mappingLngLatTematize = {};
    }
	
    window.plugin.sak.deployTematizeIncisivitaPlayer = function()
    {
        var displayBounds = map.getBounds();
        window.plugin.sak.incisivitaPlayer["list"] = {};

        $.each(window.portals, function(i, portal) 
               {
            var guid = portal.options.guid;
            if(!displayBounds.contains(portal.getLatLng())) 
            {
            }
            else
            {
                if(portal.options.dataincisivita != undefined)
                {
                    var tematize = portal.options.dataincisivita.classTematize;
                    if(window.plugin.sak.incisivitaPlayer[tematize] == null)
                    {
                        window.plugin.sak.incisivitaPlayer[tematize] = {};
                    }
                    window.plugin.sak.incisivitaPlayer[tematize][guid] = window.portals[guid];
                    window.plugin.sak.incisivitaPlayer["list"][guid] = window.portals[guid];
                }
            }
        });
    }	

    window.plugin.sak.registerNotCensedPortalNIA = function()	{
        $.each(window.plugin.sak.portaliNonCensiti, function(i, portal) {
            window.plugin.sak.renderPortalDetails(portal.options.guid);
        });
    }

    /* ----------------------------------------------------------------------------------------------------------------------------- */
    /* ------------------- metodi di sperimentazione per la interrogazione automatica di oggetti tematizzati ----------------------- */
    /* -----------------------------------------------------------------------------------------------       ----------------------- */

	window.plugin.sak.addMappingCoordTematize = function(latlng,classTematize)
	{
	
		if(window.plugin.sak.mappingLngLatTematize[classTematize] == null)
		{
			window.plugin.sak.mappingLngLatTematize[classTematize] = [];
		}
		
		window.plugin.sak.mappingLngLatTematize[classTematize].push(latlng);
	}
	
	/*
	window.plugin.sak.mappingLngLatTematize
	*/
	
    window.plugin.sak.addDataPortal = function(guid,dataPortal)
    {
        dataPortal.guid = guid;
        window.plugin.sak.portaliToMultiSend.push(dataPortal);
    }

    window.plugin.sak.addPortalNotCensed = function(guid)
    {
        var displayBounds = map.getBounds();
        var candidate = window.portals[guid];
        if(displayBounds.contains(candidate.getLatLng())) 
        {
            var datasak = {};
            datasak.classTematize = "sak-shadow-white";
            candidate.options.datasak = datasak;
            window.plugin.sak.portaliNonCensiti[guid] = candidate;
            //XXX: inserimento tra i portali da registrare
            if(window.plugin.sak.portaliToRegister[datasak.classTematize] == null)
            {
                window.plugin.sak.portaliToRegister[datasak.classTematize] = {};
            }
            window.plugin.sak.portaliToRegister[datasak.classTematize][guid] = window.portals[guid];
        }
    }

	window.plugin.sak.InjectCaratteristichePortale = function(guid,data, contesto)
	{
		if(contesto == undefined)
			contesto = "caratteristicheportali";

        var p = window.portals[guid];

        if(p != undefined)
        {
            p.options.datacaratteristiche = data;
            window.plugin.sak.setTematize(p.options,contesto);
        }
        else
            console.warn("Il guid "+guid+" non è piu renderizzabile su mappa.");		
	}
    
	window.plugin.sak.InjectDataPortal = function(guid, data)
    {
        //console.log("Iniezione dei dati SAK sul portale "+window.portals[guid].options.guid+" !");
        var p = window.portals[guid];

        if(p != undefined)
        {
            p.options.datasak = data;
            window.plugin.sak.setTematize(p.options,"censimento");
        }
        else
            console.warn("Il guid "+guid+" non è piu renderizzabile su mappa.");
    }

    window.plugin.sak.InjectDataTrack = function(guid, data)
    {
        var p = window.portals[guid];
        if(p != null)
        {
            p.options.datatrack = data;
            window.plugin.sak.setTematize(p.options,"tracciamento");
        }
    }
	
	window.plugin.sak.InjectDataIncisivita = function(guid, data)
    {
        var p = window.portals[guid];
        if(p != null)
        {
            p.options.dataincisivita = data;
            window.plugin.sak.setTematize(p.options,"incisivita");
        }
    }

    window.plugin.sak.alertConfirmGis = function(categoria,classTematize)
    {	
        count = Object.keys(window.plugin.sak.portaliToRegister[classTematize]).length;
        var messageConfirm = 
            "<table><tr><th>Sono stati trovati sulla mappa <blink>"+count+"</blink> portali di categoria "+categoria+"!</th></tr><tr><th>Vuoi aggiornarli ?</th></tr><tr><th>Eccessive richieste contemporanee potrebbero insospettire.</th></tr><tr><th><b>Fai attenzione!</b></th></tr></table>";

        var buttons = {};		
        buttons["OK"] = function() {
            $(this).dialog("close");
            var callbackStartRecPortal = function()	
            {
                //$('#esitoclient').html('Contatto NIA in corso...');
				window.plugin.sak.setTextConsole( 'Contatto NIA in corso...', 'consoleclient');	
				
                window.plugin.sak.registerTematizePortalNIA
                (Object.keys(window.plugin.sak.portaliToRegister[classTematize]));
                window.plugin.sak.portaliToRegister[classTematize] = {};
            };
            window.plugin.sak.mutexSak(callbackStartRecPortal,1,10);
        }
        buttons["Annulla"] = function() {
            console.log("Aggiornamento portali annullato!");
            $(this).dialog("close");
        };
        dialog({
            title: 'Conferma interrogazione',
            html: messageConfirm,
            buttons: buttons
        });		
    }

    window.plugin.sak.selectCategoria = function()
    {
        var categoria = $( "#categoriesection option:selected" ).val();
        console.log("Categoria gis scelta: "+categoria);
        window.plugin.sak.categoriaSakGis	 = categoria;
        window.plugin.sak.deleteRenderPortaliSAK();
        if(window.plugin.sak.categoriaSakGis == 'censimento')
        {
            $("#consolecensimento").show();
            $("#tracksection").hide();
			$("#incisivitasection").hide();
			$("#containercaratteristicheportalisection").hide();
			
            if(window.plugin.sak.canScanGis('censimento'))
                window.plugin.sak.analyzePortalSAK();
        }
        else if(window.plugin.sak.categoriaSakGis == 'tracciamentoplayer')
        {
            $("#consolecensimento").hide();
			$("#incisivitasection").hide();
			$("#containercaratteristicheportalisection").hide();
            $("#tracksection").show();
        }
        else if(window.plugin.sak.categoriaSakGis == 'incisivitaplayer')
        {
            $("#consolecensimento").hide();
            $("#tracksection").hide();
			$("#containercaratteristicheportalisection").hide();
			$("#incisivitasection").show();

        }
		else if(window.plugin.sak.categoriaSakGis == 'caratteristicheportali')
		{
            $("#consolecensimento").hide();
            $("#tracksection").hide();
			$("#incisivitasection").hide();
			$("#containercaratteristicheportalisection").show();
			
		}
        else
        {
            $("#consolecensimento").hide();
            $("#tracksection").hide();
			$("#incisivitasection").hide();
			$("#containercaratteristicheportalisection").hide();
        }
    }

    window.plugin.sak.enableDisableGis = function()
    {
        if(!window.plugin.sak.enableSakGIS)
        {
            window.plugin.sak.enableSakGIS = true;
            window.plugin.sak.nameenablegis = "Disattiva ambiente gis";

            var consoleGis = $("#consolegis");
            consoleGis.show();
        }
        else
        {
            window.plugin.sak.enableSakGIS = false;
            window.plugin.sak.nameenablegis = "Attiva ambiente gis";

            window.plugin.sak.deleteRenderPortaliSAK();			
            var consoleGis = $("#consolegis");
            consoleGis.hide();

            //$("#consolecensimento").show();
            //$("#onprogress").hide();

        }
    }

	window.plugin.sak.enableDisableSakAvanzate = function()
	{
        if(!window.plugin.sak.enableSakavanzate)
        {
            window.plugin.sak.enableSakavanzate = true;
            window.plugin.sak.nameenablesakavanzate = "Chiudi console Sakadvance";

            var consolesakoogle = $("#containerAvanzate");
            consolesakoogle.show();
        }
        else
        {
            window.plugin.sak.enableSakavanzate = false;
            window.plugin.sak.nameenablesakavanzate = "Apri console Sakadvance";

            var consolesakoogle = $("#containerAvanzate");
            consolesakoogle.hide();
        }	
		
	}
	
    window.plugin.sak.enableDisableSakaction = function()
    {
        if(!window.plugin.sak.enableSakaction)
        {
            window.plugin.sak.enableSakaction = true;
            window.plugin.sak.nameenableSakaction = "Chiudi console Sakaction";

            var consolesakoogle = $("#consolesakaction");
            consolesakoogle.show();
        }
        else
        {
            window.plugin.sak.enableSakaction = false;
            window.plugin.sak.nameenableSakaction = "Apri console Sakaction";

            var consolesakoogle = $("#consolesakaction");
            consolesakoogle.hide();
        }	
    }

    window.plugin.sak.enableDisableSakoogle = function()
    {
        if(!window.plugin.sak.enableSakoogle)
        {
            window.plugin.sak.enableSakoogle = true;
            window.plugin.sak.nameenablesakoogle = "Chiudi console Sakoogle";

            var consolesakoogle = $("#consolericerca");
            consolesakoogle.show();
        }
        else
        {
            window.plugin.sak.enableSakoogle = false;
            window.plugin.sak.nameenablesakoogle = "Apri console Sakoogle";

            var consolesakoogle = $("#consolericerca");
            consolesakoogle.hide();

            //$("#consolecensimento").show();
            //$("#onprogress").hide();

        }
    }

	window.plugin.sak.disableRenderLayer = function(nameLayer,callBackAnalyze)
	{
		var value = window.plugin.sak.flipFlopGeneric(nameLayer);

		var prefixClassTema = nameLayer.split('-',1);
		var classTema = nameLayer.replace(prefixClassTema+"-","");
        
		window.plugin.sak.flipFlopRenderGis(value, classTema);
		
		//window.plugin.sak.deleteRenderPortaliSAK(classTema);

		//XXX: il checkbox nascondi visualizza d'ora in poi sarà legato al rendering dei dati già presi.
		//dati nuovi possono essere richiesti con esplicito click.
		/*if(!value)
			callBackAnalyze();*/
	}
    //XXX: provoca delle regressioni con la versione mobile. capire perchè!
    /*window.plugin.sak.disableRenderRecenti = function()
    {
        window.plugin.sak.flipFlopGeneric('disablerecenti');
		
        window.plugin.sak.deleteRenderPortaliSAK('sak-shadow-green');
        window.plugin.sak.analyzePortalSAK();
    }*/

    /*window.plugin.sak.disableRenderAggiornati = function()
    {
        window.plugin.sak.flipFlopGeneric('disableaggiornati');
		
        window.plugin.sak.deleteRenderPortaliSAK('sak-shadow-azure');
        window.plugin.sak.analyzePortalSAK();
    }*/

    window.plugin.sak.renderSectionGis = function()
    {
        var containerSection = 		$("<div id='containergis'>");
        var buttonSwithOffGis = $("<div class=\"onoffswitch\"><input type=\"checkbox\" onclick=\"window.plugin.sak.enableDisableGis()\" name=\"onoffswitch\" class=\"onoffswitch-checkbox\" id=\"enablesakgis\" > <label class=\"onoffswitch-label\" for=\"enablesakgis\">  <span class=\"onoffswitch-inner\"></span> <span class=\"onoffswitch-switch\"></span>  </label> </div></br>");
        containerSection
            .append(buttonSwithOffGis);

        var section = $("<div id='consolegis'>").hide();

        /*var onprogress = $("<div id='onprogress' class='sak-onprogress'>\
    <table><tbody><tr><td></td><td></td><td></td><td></td><td></td></tr></tbody></table>\
    <table><tbody><tr><td></td><td></td><td></td><td></td><td></td></tr></tbody></table>\
    <table><tbody><tr><td></td><td></td><td></td><td></td><td></td></tr></tbody></table>\
    <table><tbody><tr><td></td><td></td><td></td><td></td><td></td></tr></tbody></table>\
    <table><tbody><tr><td></td><td></td><td></td><td></td><td></td></tr></tbody></table>\
    <table><tbody><tr><td></td><td></td><td></td><td></td><td></td></tr></tbody></table>\
    <table><tbody><tr><td></td><td></td><td></td><td></td><td></td></tr></tbody></table>\
	</div>");*/
        /*	$("#tableID").find('tbody')
    .append($('<tr>')
        .append($('<td>')
            .append($('<img>')
                .attr('src', 'img.png')
                .text('Image cell')
            )
        )
    );*/

        //var onprogress = $("<div id='onprogress' >Attendere invio in corso...</div>");
        //onprogress.hide();
        containerSection.append(section);
        //containerSection.append(onprogress);

        /*
		<input type="text" id="inputsearchportal" size="40" placeholder="Ricerca portali dal titolo" name="titolo" onkeypress="window.plugin.sak.searchPortals(event);">
		*/
        section
            .append(
            $("<a id='removerender'>").attr("onclick",
                                            "window.plugin.sak.deleteRenderPortaliSAK();").text(
                "Rimuovi la tematizzazione")).append("<br>")
            .append("<br>")

        var categorieSection = $("<div id='categoriesection'>");
        categorieSection.append($("<select id=\"selectCategoria\" onchange='window.plugin.sak.selectCategoria();' class='sakselect' >\
<option value=\"\">Seleziona...</option>\
<option value=\"censimento\">Censimento portali</option>\
<option value=\"caratteristicheportali\">Caratteristiche portali</option>\
<option value=\"tracciamentoplayer\">Tracciamento player</option>\
<option value=\"incisivitaplayer\">Incisivita player</option>\
</select>"));

   	    section.append(categorieSection);
        section.append("<br>");

		 var incisivitaSection = $("<div id='incisivitasection'>");
        incisivitaSection.hide();

        incisivitaSection
            .append(
            $("<a id='incisivitaplayer'>").attr("onclick",
                                             "window.plugin.sak.analyzeIncisivitaPlayer();").text(
                "Traccia incisivita del giocatore"))
            .append(
            $("<div class=\"ui-widget\" style='z-index: 2500;' ><input type='text' id='inputincisivitaplayer' placeholder='Traccia nickname'></div>")
        )
            .append("<br>")
            .append("<br>")
            .append("<b>Legenda incisivita</b>");
        var tableReportGis = $
        (
            "<table id='legendatracking' >\
<tr><td>Nascondi</td></tr>\
<tr><td><input type='checkbox' \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiIncisivitaPlayer[0]+"');\" ></td><td><span style='color: white;'>Dominatore</span></td><td>\
<span id='"+window.plugin.sak.temiIncisivitaPlayer[0]+"' ></span></td></tr>\
<tr><td><input type='checkbox' \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiIncisivitaPlayer[1]+"');\" ></td><td><span style='color: red;'>Conquistatore</span></td><td>\
<span id='"+window.plugin.sak.temiIncisivitaPlayer[1]+"' ></span></td></tr>\
<tr><td><input type='checkbox' \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiIncisivitaPlayer[2]+"');\" ></td><td><span style='color: orange;'>Ranger</span></td><td>\
<span id='"+window.plugin.sak.temiIncisivitaPlayer[2]+"' ></span></td></tr>\
<tr><td><input type='checkbox' \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiIncisivitaPlayer[3]+"');\" ></td><td><span style='color: green;'>Guerriero</span></td><td>\
<span id='"+window.plugin.sak.temiIncisivitaPlayer[3]+"' ></span></td></tr>\
<tr><td><input type='checkbox' \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiIncisivitaPlayer[4]+"');\" ></td><td><span style='color: #0099ff;'>Soldato</span></td><td>\
<span id='"+window.plugin.sak.temiIncisivitaPlayer[4]+"' ></span></td></tr>\
<tr><td><input type='checkbox' \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiIncisivitaPlayer[5]+"');\" ></td><td><span style='color: yellow;'>Supporto</span></td><td>\
<span id='"+window.plugin.sak.temiIncisivitaPlayer[5]+"' ></span></td></tr>\
<tr><td><input type='checkbox' \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiIncisivitaPlayer[6]+"');\" ></td><td><span style='color: fuchsia;'>Assaltatore</span></td><td>\
<span id='"+window.plugin.sak.temiIncisivitaPlayer[6]+"' ></span></td></tr>\
<tr><td><input type='checkbox' \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiIncisivitaPlayer[7]+"');\" ></td><td><span style='color: LIGHTSKYBLUE;'>Combattente</span></td><td>\
<span id='"+window.plugin.sak.temiIncisivitaPlayer[7]+"' ></span></td></tr>\
<tr><td><input type='checkbox' \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiIncisivitaPlayer[8]+"');\" ></td><td><span style='color: SPRINGGREEN;'>Miliziano</span></td><td>\
<span id='"+window.plugin.sak.temiIncisivitaPlayer[8]+"' ></span></td></tr>\
<tr><td><input type='checkbox' \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiIncisivitaPlayer[9]+"');\" ></td><td><span style='color: TOMATO;'>Oppositore</span></td><td>\
<span id='"+window.plugin.sak.temiIncisivitaPlayer[9]+"' ></span></td></tr>\
<tr><td><input type='checkbox' \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiIncisivitaPlayer[10]+"');\" ></td><td><span style='color: SLATEGRAY;'>Sogno di rivalsa</span></td><td>\
<span id='"+window.plugin.sak.temiIncisivitaPlayer[10]+"' ></span></td></tr>\
<tr><td><input type='checkbox' \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiIncisivitaPlayer[11]+"');\" ></td><td><span style='color: PALEGOLDENROD;'>Causa persa</span></td><td>\
<span id='"+window.plugin.sak.temiIncisivitaPlayer[11]+"' ></span></td></tr>\
<tr><td><input type='checkbox' \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiIncisivitaPlayer[12]+"');\" ></td><td><span style='color: SILVER;'>Equilibrio</span></td><td>\
<span id='"+window.plugin.sak.temiIncisivitaPlayer[12]+"' ></span></td></tr>\
<tr><td><input type='checkbox' \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiIncisivitaPlayer[13]+"');\" ></td><td><span style='color: SANDYBROWN;'>Traccia geografica</span></td><td>\
<span id='"+window.plugin.sak.temiIncisivitaPlayer[13]+"' ></span></td></tr>\
</table>"
        );	

        incisivitaSection.append(tableReportGis);				
        section.append(incisivitaSection);

		 var containerCaratteristichePortaliSection = $("<div id='containercaratteristicheportalisection'>");
        containerCaratteristichePortaliSection.hide();

        var profiliCaratteristicheSection = $("<div id='profilicaratteristichesection'>");
        profiliCaratteristicheSection.append($("<select id=\"selectCaratteristiche\" onchange='window.plugin.sak.selectProfiloCaratteristiche();' class='sakselect' >\
<option value=\"\">Seleziona...</option>\
<option value=\"caratteristicheportali\">Peculiarità</option>\
<option value=\"influenzadominante\">Influenza dominante</option>\
</select>" ));

		containerCaratteristichePortaliSection.append(profiliCaratteristicheSection).append("</br>").append("<br/>");

		 var caratteristichePortaliSection = $("<div id='caratteristicheportalisection'>");
        caratteristichePortaliSection.hide();
        caratteristichePortaliSection
            .append(
            $("<a >").attr("onclick",
                                             "window.plugin.sak.analyzeCaratteristichePortal();").text(
                "Traccia peculiarità"))
            .append("<br>")
            .append("<br>")
            .append("<b>Legenda peculiarità portali</b>");

        var tableReportGis = $
        (
            "<table id='legendacaratteristiche' >\
<tr><td>Nascondi</td></tr>\
<tr><td><input type='checkbox'  \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiCaratteristiche[0]+"');\" ></td><td><span style='color: white;'>Conteso (captured)</span></td><td>\
<span id='"+window.plugin.sak.temiCaratteristiche[0]+"' ></span></td></tr>\
\
<tr><td><input type='checkbox' \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiCaratteristiche[1]+"');\" ></td><td><span style='color: red;'>Subisce distruzione reso</span></td><td>\
<span id='"+window.plugin.sak.temiCaratteristiche[1]+"' ></span></td></tr>\
\
<tr><td><input type='checkbox'  \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiCaratteristiche[2]+"');\" ></td><td><span style='color: orange;'>Ottiene deploy di reso</span></td><td>\
<span id='"+window.plugin.sak.temiCaratteristiche[2]+"' ></span></td></tr>\
\
<tr><td><input type='checkbox'  \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiCaratteristiche[3]+"');\" ></td><td><span style='color: green;'>Si presta a tanti link: Link Star</span></td><td>\
<span id='"+window.plugin.sak.temiCaratteristiche[3]+"' ></span></td></tr>\
\
<tr><td><input type='checkbox'  \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiCaratteristiche[4]+"');\" ></td><td><span style='color: #0099ff;'>Tende a porsi a faro di coperte: ControlField Star</span></td><td>\
<span id='"+window.plugin.sak.temiCaratteristiche[4]+"' ></span></td></tr>\
\
<tr><td><input type='checkbox'  \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiCaratteristiche[5]+"');\" ></td><td><span style='color: yellow;'>I field su cui poggiano sono instabili</span></td><td>\
<span id='"+window.plugin.sak.temiCaratteristiche[5]+"' ></span></td></tr>\
\
<tr><td><input type='checkbox'  \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiCaratteristiche[6]+"');\" ></td><td><span style='color: fuchsia;'>I link tendono a essere distrutti.</span></td><td>\
<span id='"+window.plugin.sak.temiCaratteristiche[6]+"' ></span></td></tr>\
\
</table>"
        );	
        caratteristichePortaliSection.append(tableReportGis);				

		
		containerCaratteristichePortaliSection.append(caratteristichePortaliSection);
		
		 var influenzaDominanzaPortaliSection = $("<div id='influenzadominantesection'>");
        influenzaDominanzaPortaliSection.hide();
        influenzaDominanzaPortaliSection
            .append(
            $("<a >").attr("onclick",
                                             "window.plugin.sak.analyzeInfluenzaFazionePortal();").text(
                "Traccia influenza dominante"))
            .append("<br>")
            .append("<br>")
            .append("<b>Legenda dominanza portali</b>");
/*
						if(incisivita > 50.00)
									tematize = "sak-shadow-blue1";
						else if(incisivita > 15.00 && incisivita <= 50.00)
									tematize = "sak-shadow-blue2";
						else if(incisivita > 5.00 && incisivita <= 15.00)
									tematize = "sak-shadow-blue3";
						else if(incisivita < 5.00)


<tr><td><input type='checkbox'  \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiInfluenzaDominanza[4]+"');\" ></td><td><span style='color: #4f4fe5;'>Resistenza tra 1% e il 5%</span></td><td>\
<span id='"+window.plugin.sak.temiInfluenzaDominanza[4]+"' ></span></td></tr>\
\
<tr><td><input type='checkbox'  \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiInfluenzaDominanza[5]+"');\" ></td><td><span style='color: #9292ee;'>Resistenza al di sotto dell'1%</span></td><td>\
<span id='"+window.plugin.sak.temiInfluenzaDominanza[5]+"' ></span></td></tr>\


<tr><td><input type='checkbox'  \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiInfluenzaDominanza[10]+"');\" ></td><td><span style='color: #5bff5b;'>Illuminati tra 1% e il 5%</span></td><td>\
<span id='"+window.plugin.sak.temiInfluenzaDominanza[10]+"' ></span></td></tr>\
\
<tr><td><input type='checkbox'  \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiInfluenzaDominanza[11]+"');\" ></td><td><span style='color: #b1ffb1;'>Illuminati al di sotto dell'1%</span></td><td>\
<span id='"+window.plugin.sak.temiInfluenzaDominanza[11]+"' ></span></td></tr>\
							
							*/
        var tableReportGis = $
        (
            "<table id='legendacaratteristiche' style='border-radius: 10px;; background: -webkit-linear-gradient(top, #FFD47A 0%,#1E425C 75%);  ' >\
<tr><td>Nascondi</td></tr>\
<tr><td><input type='checkbox'  \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiInfluenzaDominanza[0]+"');\" ></td><td><span style='color: #0000a0;'>Resistenza oltre il 50%</span></td><td>\
<span id='"+window.plugin.sak.temiInfluenzaDominanza[0]+"' ></span></td></tr>\
\
<tr><td><input type='checkbox'  \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiInfluenzaDominanza[1]+"');\" ></td><td><span style='color: #0000c7;'>Resistenza tra il 15% e il 50%</span></td><td>\
<span id='"+window.plugin.sak.temiInfluenzaDominanza[1]+"' ></span></td></tr>\
\
<tr><td><input type='checkbox'  \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiInfluenzaDominanza[2]+"');\" ></td><td><span style='color: #0000f8;'>Resistenza tra il 5% e il 15%</span></td><td>\
<span id='"+window.plugin.sak.temiInfluenzaDominanza[2]+"' ></span></td></tr>\
\
<tr><td><input type='checkbox'  \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiInfluenzaDominanza[3]+"');\" ></td><td><span style='color: #3636ff;'>Resistenza sotto il 5%</span></td><td>\
<span id='"+window.plugin.sak.temiInfluenzaDominanza[3]+"' ></span></td></tr>\
\
\
\
<tr><td><input type='checkbox'  \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiInfluenzaDominanza[6]+"');\" ></td><td><span style='color: #008f00;'>Illuminati oltre il 50%</span></td><td>\
<span id='"+window.plugin.sak.temiInfluenzaDominanza[6]+"' ></span></td></tr>\
<tr><td><input type='checkbox'  \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiInfluenzaDominanza[7]+"');\" ></td><td><span style='color: #00b200;'>Illuminati tra il 15% e il 50%</span></td><td>\
<span id='"+window.plugin.sak.temiInfluenzaDominanza[7]+"' ></span></td></tr>\
\
<tr><td><input type='checkbox'  \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiInfluenzaDominanza[8]+"');\" ></td><td><span style='color: #00de00;'>Illuminati tra il 5% e il 15%</span></td><td>\
<span id='"+window.plugin.sak.temiInfluenzaDominanza[8]+"' ></span></td></tr>\
\
<tr><td><input type='checkbox'  \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiInfluenzaDominanza[9]+"');\" ></td><td><span style='color: #16ff16;'>Illuminati sotto il 5%</span></td><td>\
<span id='"+window.plugin.sak.temiInfluenzaDominanza[9]+"' ></span></td></tr>\
\
<tr><td><input type='checkbox'  \
		onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiInfluenzaDominanza[12]+"');\" ></td><td><span style='color: white;'>Neutrale</span></td><td>\
<span id='"+window.plugin.sak.temiInfluenzaDominanza[12]+"' ></span></td></tr>\
\
</table>"
        );	
        influenzaDominanzaPortaliSection.append(tableReportGis);	

		containerCaratteristichePortaliSection.append(influenzaDominanzaPortaliSection);
		
		
        section.append(containerCaratteristichePortaliSection);		
		
		
        var trackSection = $("<div id='tracksection'>");
        trackSection.hide();

        trackSection
            .append(
            $("<a id='tracciaplayer'>").attr("onclick",
                                             "window.plugin.sak.analyzeTrackPlayer();").text(
                "Traccia giocatore sulla mappa"))
            .append(
            $("<div class=\"ui-widget\" style='z-index: 2500;'><input type='text' id='inputtracciaplayer' placeholder='Traccia nickname'></div>")
        )
            .append("<br>")
            .append("<br>")
            .append("<b>Legenda tracciamento</b>");
                /*

Di rado				white da 1 a 5
Ogni tanto			red	  da 5 a 15
Spesso				orange da 15 a 30
Abitudinario		green da 30 a 100
Ben presidiato		azure
Catturato			
			*/
        var tableReportGis = $
        (
            "<table id='legendatracking' >\
<tr><td>Nascondi</td></tr>\
<tr><td><input type='checkbox' onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiTrackPlayer[0]+"');\" /></td><td><span style='color: white;'>Di rado</span></td><td>\
<span id='"+window.plugin.sak.temiTrackPlayer[0]+"' ></span></td></tr>\
<tr><td><input type='checkbox' onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiTrackPlayer[1]+"');\" /></td><td><span style='color: red;'>Ogni tanto</span></td><td>\
<span id='"+window.plugin.sak.temiTrackPlayer[1]+"' ></span></td></tr>\
<tr><td><input type='checkbox' onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiTrackPlayer[2]+"');\" /></td><td><span style='color: orange;'>Spesso</span></td><td>\
<span id='"+window.plugin.sak.temiTrackPlayer[2]+"' ></span></td></tr>\
<tr><td><input type='checkbox' onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiTrackPlayer[3]+"');\" /></td><td><span style='color: green;'>Abitudinario</span></td><td>\
<span id='"+window.plugin.sak.temiTrackPlayer[3]+"' ></span></td></tr>\
<tr><td><input type='checkbox' onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiTrackPlayer[4]+"');\" /></td><td><span style='color: #0099ff;'>Ben presidiato</span></td><td>\
<span id='"+window.plugin.sak.temiTrackPlayer[4]+"' ></span></td></tr>\
<tr><td><input type='checkbox' onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiTrackPlayer[5]+"');\" /></td><td><span style='color: GRAY;'>Catturato</span></td><td>\
<span id='"+window.plugin.sak.temiTrackPlayer[5]+"' ></span></td></tr>\
<tr><td><input type='checkbox' onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiTrackPlayer[6]+"');\" /></td><td><span style='color: SANDYBROWN;'>Traccia geografica\
</span></td><td><span id='"+window.plugin.sak.temiTrackPlayer[6]+"' ></span></td></tr>\
</table>"
        );	

        trackSection.append(tableReportGis);				
        section.append(trackSection);


        var censimentoSection = $("<div id='consolecensimento'>");
        censimentoSection.hide();

        censimentoSection
            .append(
            $("<a id='rendercensiti'>").attr("onclick",
                                             "window.plugin.sak.analyzePortalSAK();").text(
                "Traccia i portali censiti"))
            .append("<br>")
			.append("<b>Legenda censimento portali</b>")

		//var tableConsoleCensimento = $("<table id='consolecensimento' />");
        //tableConsoleCensimento.hide();
        var tableConsoleCensimento = $
        (
            "<table id='legendacensimento' >\
<tr><td>Nascondi</td></tr>\
<tr><td><input type='checkbox' onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiCensimento[0]+"');\" /></td><td><span style='color: white;'>Sconosciuti</span></td><td><a onclick=\"window.plugin.sak.alertConfirmGis('sconosciuti','sak-shadow-white');\">\
<span id='"+window.plugin.sak.temiCensimento[0]+"'/></a></td></tr>\
<tr><td><input type='checkbox' onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiCensimento[1]+"');\" /></td><td><span style='color: red;'>Obsoleti</span></td><td><a onclick=\"window.plugin.sak.alertConfirmGis('obsoleti','sak-shadow-red');\">\
<span id='"+window.plugin.sak.temiCensimento[1]+"'/></a></td></tr>\
<tr><td><input type='checkbox' onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiCensimento[2]+"');\" /></td><td><span style='color: orange;'>Meno recenti</span></td><td><a onclick=\"window.plugin.sak.alertConfirmGis('meno recenti','sak-shadow-orange');\">\
<span id='"+window.plugin.sak.temiCensimento[2]+"'/></a></td></tr>\
<tr><td><input type='checkbox' id='disablerecenti' onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiCensimento[3]+"');\" ></td><td><span style='color: green;'>Recenti</span></td><td><a onclick=\"window.plugin.sak.alertConfirmGis('recenti','sak-shadow-green');\">\
<span id='"+window.plugin.sak.temiCensimento[3]+"'/></a></td></tr>\
<tr><td><input type='checkbox' id='disableaggiornati' onclick=\"window.plugin.sak.disableRenderLayer('"+window.plugin.sak.temiCensimento[4]+"');\" ></td><td><span style='color: #0099ff;'>Appena aggiornati</span></td><td>\
<span style='color: #0099ff;' id='"+window.plugin.sak.temiCensimento[4]+"'/></td></tr>\
</table>"
        );	

        censimentoSection.append(tableConsoleCensimento);
        section.append(censimentoSection);
        section.append("<br>");

        return containerSection;

    }

	window.plugin.sak.temiCaratteristiche = 
	[
	"reportcaratt-sak-shadow-white",
	"reportcaratt-sak-shadow-red",
	"reportcaratt-sak-shadow-orange",
	"reportcaratt-sak-shadow-green",
	"reportcaratt-sak-shadow-azure",
	"reportcaratt-sak-shadow-yellow",
	"reportcaratt-sak-shadow-fuchsia"
	];
	
	window.plugin.sak.temiInfluenzaDominanza = 
	[
	"reportinfldom-sak-shadow-blue1",
	"reportinfldom-sak-shadow-blue2",
	"reportinfldom-sak-shadow-blue3",
	"reportinfldom-sak-shadow-blue4",
	"reportinfldom-sak-shadow-blue5",
	"reportinfldom-sak-shadow-blue6",
	"reportinfldom-sak-shadow-green1",
	"reportinfldom-sak-shadow-green2",
	"reportinfldom-sak-shadow-green3",
	"reportinfldom-sak-shadow-green4",
	"reportinfldom-sak-shadow-green5",
	"reportinfldom-sak-shadow-green6",
	"reportinfldom-sak-shadow-white"
	];
	
	window.plugin.sak.temiCensimento = 
	[
	"reportcens-sak-shadow-white",
	"reportcens-sak-shadow-red",
	"reportcens-sak-shadow-orange",
	"reportcens-sak-shadow-green",
	"reportcens-sak-shadow-azure"
	];
	
	window.plugin.sak.temiTrackPlayer = 
	[
	"reporttrack-sak-shadow-white",
	"reporttrack-sak-shadow-red",
	"reporttrack-sak-shadow-orange",
	"reporttrack-sak-shadow-green",
	"reporttrack-sak-shadow-azure",
	"reporttrack-sak-shadow-GRAY",
	"reporttrack-sak-shadow-SANDYBROWN"
	];

	window.plugin.sak.temiIncisivitaPlayer = 
	[
	"reportincisivita-sak-shadow-white",
	"reportincisivita-sak-shadow-red",
	"reportincisivita-sak-shadow-orange",
	"reportincisivita-sak-shadow-green",
	"reportincisivita-sak-shadow-azure",
	"reportincisivita-sak-shadow-yellow",
	"reportincisivita-sak-shadow-fuchsia",
	"reportincisivita-sak-shadow-LIGHTSKYBLUE",
	"reportincisivita-sak-shadow-SPRINGGREEN",
	"reportincisivita-sak-shadow-TOMATO",
	"reportincisivita-sak-shadow-SLATEGRAY",
	"reportincisivita-sak-shadow-PALEGOLDENROD",
	"reportincisivita-sak-shadow-SILVER",
	"reportincisivita-sak-shadow-SANDYBROWN"
	];
	
	
    window.plugin.sak.renderPortaliSAK = function(currentGuid, categoria, latLng) {
        //XXX: le istruzioni seguenti saranno incapsulati in un metodo ad hoc!!
        //console.log("Avvio render dell'icona ...");
        var SQUARE_SIZE = L.Browser.mobile ? (window.plugin.sak.ICON_SIZE + 3) * window.plugin.sak.MOBILE_SCALE
        : (window.plugin.sak.ICON_SIZE + 3);

        //var portalPoints = {};
        var p = window.portals[currentGuid];
        if(p != null)
        {
            if (p._map ) {  // only consider portals added to the map, and that have a level set
                window.plugin.sak.removeLabel(currentGuid);

                var classTematize;
                switch(categoria) {
                    case "censimento":
                        classTematize = p.options.datasak.classTematize;
                        break;
                    case "tracciamentoplayer":
                        classTematize = p.options.datatrack.classTematize;
                        break;
                    case "incisivitaplayer":
                        classTematize = p.options.dataincisivita.classTematize;
                        break;
                    case "caratteristicheportali":
                        classTematize = p.options.datacaratteristiche.classTematize;
                        break;
                }
                window.plugin.sak.addLabel(currentGuid, window.portals[currentGuid].getLatLng(), classTematize);
				
				window.plugin.sak.addMappingCoordTematize(window.portals[currentGuid].getLatLng(),classTematize);
            }	
        }
        else
        {

            if(categoria == 'tracciamentoplayer' || categoria == 'incisivitaplayer')
            {
				var classTematize = "reportincisivita-sak-shadow-SANDYBROWN";
				if(categoria == 'tracciamentoplayer')
					classTematize = "reporttrack-sak-shadow-SANDYBROWN";
				
                var isEnable = true;
                if(window.plugin.sak.supportedFlipFlop[classTematize])
                {
                    isEnable = false;
                }
				if(isEnable)
				{
					window.plugin.sak.removeLabelCoordinata(latLng);
					var classTematize = "sak-shadow-SANDYBROWN";
					window.plugin.sak.addLabelCoordinata(latLng, classTematize, categoria);
					
					window.plugin.sak.addMappingCoordTematize(latLng,classTematize);
				}
            }

        }
    }

    window.plugin.sak.analyzeTrackPlayer = function()	{

		$.each(window.plugin.sak.temiTrackPlayer, function(j, cKey) {
	       $("#"+cKey).text("");
		});	
				
        window.plugin.sak.getTracciamentoPlayer($('#inputtracciaplayer').val(),null,null,true);
    }

    window.plugin.sak.getTracciamentoPlayer = function(cPlayer, cGuid, cForceData, isRender)
    {
        if(isRender == null)
            isRender = false;

        var tipo = "TrackPlayer";
        //registra chiamata sul contatore
        window.plugin.sak.countcalls = window.plugin.sak.countcalls + 1;
        window.plugin.sak.ledSak = 'green';
        $("#countcalls").css('color',window.plugin.sak.ledSak);
        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);
        window.plugin.sak.countiitccalls = window.plugin.sak.countiitccalls +1;
        $('#countiitccalls').html(window.plugin.sak.countiitccalls+" Track "+cPlayer);
        //recupera il cipher per autenticarsi con il server
        var cipher = window.plugin.sak.getCipher();

        var keysTematize = Object.keys(window.plugin.sak.tracciamentoPlayer);

        if(cPlayer == "")
        {
            alert("Devi selezionare un nickname!");
            return false;
        }

        console.debug("Avvio tracciamento attività del giocatore "+cPlayer);
        $('#esitoclient').html('Interroga tracciamento attività del giocatore '+cPlayer);					

        var inforequest = $
        .post(
            window.plugin.sak.endpointsak,
            {
                context : "tracciamentoplayer",
                objplayer : JSON.stringify(window.PLAYER),
                player : cPlayer,
                guid : cGuid,
                forcedata : cForceData,
                hashscript : cipher
            },
            function(data) {
                $('#esitoclient').html('Tracciamento giocatore '+cPlayer+' completata');					

				//rimozione dati json sui portlai
				window.plugin.sak.removeDataGis();
				//rimozione identificativi su mappa
                window.plugin.sak.deleteRenderPortaliSAK();
				//reset lista dei portali tracciati
				window.plugin.sak.tracciamentoPlayer = {};

				
                //XXX: reset della lista dei portali censiti dalla chiamata precedente
                console.info("Risultato tracciamento del "+cPlayer);
                console.info(data);
                
                $.each(data.resultTracciamento, function(i, acObj) {
					var cObj = acObj[0];
					
					var isEnable = true;
				
                    window.plugin.sak.InjectDataTrack(cObj.guid, cObj);
                    
					var checkFlipFlop = window.plugin.sak.supportedFlipFlop["reporttrack-"+cObj.classTematize];
					if(checkFlipFlop === undefined)
						checkFlipFlop = false;
						
                    if(checkFlipFlop)
                    {
                            isEnable = false;
                    }
					
					if(isRender && isEnable)
                    {
                        var latLng = {};
                        if(cObj.coordinate != undefined)
                        {
                            var arrayCoord = cObj.coordinate.split(',');
                            latLng.lat = arrayCoord[0];
                            latLng.lon = arrayCoord[1];
                            window.plugin.sak.renderPortaliSAK(cObj.guid, "tracciamentoplayer", latLng);
                        }
                        else
                            console.warn("Attenzione non sono state trovate le coordinate dell'azione sul tracciamento di "+cPlayer);
                    }

                    //associare un css class a seconda il lastmodified e per ciascun portale associare lo storico. valutare la bontà del window.portals
                });

                //XXX: l'obiettivo di questo metodo è popolare gli array dei portali tematizzati da registrare
                window.plugin.sak.deployTematizeTrackPlayer();

                var keysTematize = Object.keys(window.plugin.sak.tracciamentoPlayer);
                console.log("Temi trovati: "+keysTematize);			
				
				$.each(keysTematize, function(j, cKey) {

                    var count = Object.keys(window.plugin.sak.tracciamentoPlayer[cKey]).length;

                    var cClass = cKey;

                    if(count > 0)
                        $("#reporttrack-"+cClass).text(" "+count+" trovati!");
                    else
                        $("#reporttrack-"+cClass).text("");

                });


                //deregistrazione dalla chiamate attive
                window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                $('#countcalls').html(window.plugin.sak.countcalls);
                if(window.plugin.sak.countcalls > 0)
                    $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);
                window.plugin.sak.countiitccalls = window.plugin.sak.countiitccalls -1;
                $('#countiitccalls').html(window.plugin.sak.countiitccalls);
                if(window.plugin.sak.countiitccalls > 0)
                    $('#countiitccalls').html(window.plugin.sak.countiitccalls+" Track "+cPlayer);

                //var callback = function(){ $('#esitoclient').html('idle...');};
				var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
                window.plugin.sak.mutexSak(callback);

                /*var callback2 = function(){ $('#esitoclient').html('');};
								window.plugin.sak.mutexSak(callback2,5);*/

            })
        .fail(
            function(xhr, textStatus, errorThrown) {
                console.log(xhr.statusText);
                console.log(xhr.responseText);
                console.log(textStatus);
                console.error(error);
                window.plugin.sak.getFailError(xhr,textStatus, "Tracciamento player");

                window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                $('#countcalls').html(window.plugin.sak.countcalls);
                if(window.plugin.sak.countcalls > 0)
                    $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);
                window.plugin.sak.countiitccalls = window.plugin.sak.countiitccalls -1;
                $('#countiitccalls').html(window.plugin.sak.countiitccalls);
                if(window.plugin.sak.countiitccalls > 0)
                    $('#countiitccalls').html(window.plugin.sak.countiitccalls+" Track "+cPlayer);

                //alert
                console.error("Anomalia di comunicazione! Recupero del tracciamento player fallito!!");
            });		

    }

    window.plugin.sak.getCaratteristichePortali = function(listPortalToCheck, isRender, contesto)
    {
        if(isRender == null)
            isRender = false;

        var tipo = "CaratteristichePortali";

        window.plugin.sak.countcalls = window.plugin.sak.countcalls + 1;
        window.plugin.sak.ledSak = 'green';
        $("#countcalls").css('color',window.plugin.sak.ledSak);
        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);
        window.plugin.sak.countiitccalls = window.plugin.sak.countiitccalls +1;
        $('#countiitccalls').html(window.plugin.sak.countiitccalls+" "+tipo);

        //recupera il cipher per autenticarsi con il server
        var cipher = window.plugin.sak.getCipher();
		
        $('#esitoclient').html('Interroga caratteristiche portali...');					
        console.debug('Interroga caratteristiche portali...');					

        var inforequest = $
        .post(
            window.plugin.sak.endpointsak,
            {
                context : "caratteristicheportali",
                objplayer : JSON.stringify(window.PLAYER),
                listPortal : JSON.stringify(listPortalToCheck),
                hashscript : cipher
            },
            function(data) {
				

				window.plugin.sak.removeDataGis();
                window.plugin.sak.deleteRenderPortaliSAK();
                window.plugin.sak.caratteristichePortali = {};

                console.info('Risultato caratteristiche portali:');	
                console.info(data);

                var normalizeClass;
                $.each(data.payload, function(i, cObj) {

                    var isEnable = true;

                    window.plugin.sak.InjectCaratteristichePortale(cObj.guid, cObj, contesto);
					
					var checkFlipFlop = window.plugin.sak.supportedFlipFlop["reportcaratt-"+cObj.classTematize];
					if(checkFlipFlop === undefined)
						checkFlipFlop = false;
						
                    if(checkFlipFlop)
                    {
                            isEnable = false;
                    }
                    
                    if(isRender && isEnable)
                    {
                        window.plugin.sak.renderPortaliSAK(cObj.guid, "caratteristicheportali");
                    }

                    //associare un css class a seconda il lastmodified e per ciascun portale associare lo storico. valutare la bontà del window.portals
                });
				

                //XXX: l'obiettivo di questo metodo è popolare gli array dei portali tematizzati da registrare
                window.plugin.sak.deployTematizeCaratteristichePortal();

                var keysTematize = Object.keys(window.plugin.sak.caratteristichePortali);
                console.log("Temi trovati: "+keysTematize);
                
				var prefixcarat = "reportcaratt";
				if(contesto == 'influenzadominante')
					prefixcarat = 'reportinfldom';
				
				$.each(keysTematize, function(j, cKey) {

                    var count = Object.keys(window.plugin.sak.caratteristichePortali[cKey]).length;

                    var cClass = cKey;
				
                    if(count > 0)
                        $("#"+prefixcarat+"-"+cClass).text(" "+count+" trovati!");
                    else
                        $("#"+prefixcarat+"-"+cClass).text("");

                });

                window.plugin.sak.semaphorerefresh = true;
                $('#esitoclient').html('Scansione caratteristiche portali completata');	

                window.plugin.sak.countiitccalls = window.plugin.sak.countiitccalls -1;
                $('#countiitccalls').html(window.plugin.sak.countiitccalls);
                if(window.plugin.sak.countiitccalls > 0)
                    $('#countiitccalls').html(window.plugin.sak.countiitccalls+" "+tipo);

                //var callback = function(){ $('#esitoclient').html('idle...');};
				var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
                window.plugin.sak.mutexSak(callback);

                //deregistrazione dalla chiamate attive
                window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                $('#countcalls').html(window.plugin.sak.countcalls);
                if(window.plugin.sak.countcalls > 0)
                    $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

            })
        .fail(
            function(xhr, textStatus, errorThrown) {
                console.log(xhr.statusText);
                console.log(xhr.responseText);
                console.log(textStatus);
                console.error(error);
                window.plugin.sak.getFailError(xhr,textStatus, "Recupero caratteristiche portali");

                window.plugin.sak.countiitccalls = window.plugin.sak.countiitccalls -1;
                $('#countiitccalls').html(window.plugin.sak.countiitccalls);
                if(window.plugin.sak.countiitccalls > 0)
                    $('#countiitccalls').html(window.plugin.sak.countiitccalls+" "+tipo);

                //var callback = function(){ $('#esitoclient').html('idle...');};
				var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
                window.plugin.sak.mutexSak(callback);

                //deregistrazione dalla chiamate attive
                window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                $('#countcalls').html(window.plugin.sak.countcalls);
                if(window.plugin.sak.countcalls > 0)
                    $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

                //alert
                console.error("Anomalia di comunicazione! Recupero caratteristiche portali fallito!!");
            });		
	}

    window.plugin.sak.getPortaliCensiti = function(listPortalToCheck, isRender)
    {
        //XXX: svuotamento delle informazioni gis sulla mappa
        //

        if(isRender == null)
            isRender = false;

        var tipo = "Censimento";
        //registra chiamata sul contatore
        window.plugin.sak.countcalls = window.plugin.sak.countcalls + 1;
        window.plugin.sak.ledSak = 'green';
        $("#countcalls").css('color',window.plugin.sak.ledSak);
        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);
        window.plugin.sak.countiitccalls = window.plugin.sak.countiitccalls +1;
        $('#countiitccalls').html(window.plugin.sak.countiitccalls+" "+tipo);

        //recupera il cipher per autenticarsi con il server
        var cipher = window.plugin.sak.getCipher();

        $('#esitoclient').html('Interroga portali censiti...');					
        console.debug('Interroga portali censiti...');					
        var inforequest = $
        .post(
            window.plugin.sak.endpointsak,
            {
                context : "portalicensiti",
                objplayer : JSON.stringify(window.PLAYER),
                listPortal : JSON.stringify(listPortalToCheck),
                hashscript : cipher
            },
            function(data) {
				
				window.plugin.sak.removeDataGis();
                window.plugin.sak.deleteRenderPortaliSAK();
                window.plugin.sak.portaliToRegister = {};

                console.info('Risultato censimento:');	
                console.info(data);

                var normalizeClass;
                $.each(data.listObj, function(i, cObj) {


                    window.plugin.sak.InjectDataPortal(cObj.guid, cObj);

                    var isEnable = true;
                    if(window.plugin.sak.supportedFlipFlop['reportcens-'+cObj.classTematize])
                    {
                            isEnable = false;
                    }

                    if(isRender && isEnable)
                    {
                        window.plugin.sak.renderPortaliSAK(cObj.guid, "censimento");
                    }

                    //associare un css class a seconda il lastmodified e per ciascun portale associare lo storico. valutare la bontà del window.portals
                });

                $.each(data.notCensedList, function(i, cGuid) {

					var isEnable = true;
				
                    window.plugin.sak.InjectDataPortal(cGuid, {});

					if(window.plugin.sak.supportedFlipFlop['reportcens-sak-shadow-white'])
                    {
                        //if(normalizeClass == 'sak-shadow-green')
                            isEnable = false;
                    }
					
                    window.plugin.sak.addPortalNotCensed(cGuid);

                    if(isRender && isEnable)
                    {
                        window.plugin.sak.renderPortaliSAK(cGuid, "censimento");
                    }

                    //associare un css class a seconda il lastmodified e per ciascun portale associare lo storico. valutare la bontà del window.portals
                });

                //XXX: l'obiettivo di questo metodo è popolare gli array dei portali tematizzati da registrare
                window.plugin.sak.deployTematizePortal();

                var keysTematize = Object.keys(window.plugin.sak.portaliToRegister);
                console.log("Temi trovati: "+keysTematize);
                $.each(keysTematize, function(j, cKey) {

                    var count = Object.keys(window.plugin.sak.portaliToRegister[cKey]).length;

                    var cClass = cKey;

                    if(count > 0)
                        $("#reportcens-"+cClass).text(" "+count+" trovati!");
                    else
                        $("#reportcens-"+cClass).text("");

                });


                window.plugin.sak.semaphorerefresh = true;
                $('#esitoclient').html('Scansione censimento completata');	

                window.plugin.sak.countiitccalls = window.plugin.sak.countiitccalls -1;
                $('#countiitccalls').html(window.plugin.sak.countiitccalls);
                if(window.plugin.sak.countiitccalls > 0)
                    $('#countiitccalls').html(window.plugin.sak.countiitccalls+" Censimento");

                //var callback = function(){ $('#esitoclient').html('idle...');};
				var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
                window.plugin.sak.mutexSak(callback);

                //deregistrazione dalla chiamate attive
                window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                $('#countcalls').html(window.plugin.sak.countcalls);
                if(window.plugin.sak.countcalls > 0)
                    $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);


                /*var callback2 = function(){ $('#esitoclient').html('');};
								window.plugin.sak.mutexSak(callback2,5);*/

            })
        .fail(
            function(xhr, textStatus, errorThrown) {
                console.log(xhr.statusText);
                console.log(xhr.responseText);
                console.log(textStatus);
                console.error(error);
                window.plugin.sak.getFailError(xhr,textStatus, "Recupero dei portali censiti");

                window.plugin.sak.countiitccalls = window.plugin.sak.countiitccalls -1;
                $('#countiitccalls').html(window.plugin.sak.countiitccalls);
                if(window.plugin.sak.countiitccalls > 0)
                    $('#countiitccalls').html(window.plugin.sak.countiitccalls+" Censimento");

                //var callback = function(){ $('#esitoclient').html('idle...');};
				var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
                window.plugin.sak.mutexSak(callback);

                //deregistrazione dalla chiamate attive
                window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                $('#countcalls').html(window.plugin.sak.countcalls);
                if(window.plugin.sak.countcalls > 0)
                    $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

                //alert
                console.error("Anomalia di comunicazione! Recupero dei portali censiti fallito!!");
            });

    }	

	window.plugin.sak.analyzeIncisivitaPlayer = function()	{

        //XXX: reset della lista dei portali censiti dalla chiamata precedente
		$.each(window.plugin.sak.temiIncisivitaPlayer, function(j, cKey) {
	       $("#"+cKey).text("");
		});	
				
        window.plugin.sak.getIncisivitaPlayer($('#inputincisivitaplayer').val(),null,null,true);
    }
	
	 window.plugin.sak.getIncisivitaPlayer = function(cPlayer, cGuid, cForceData, isRender)
    {
		//XXX: svuotamento delle informazioni gis sulla mappa
        //window.plugin.sak.deleteRenderPortaliSAK();	

        if(isRender == null)
            isRender = false;

        var tipo = "IncisivitaPlayer";
        //registra chiamata sul contatore
        window.plugin.sak.countcalls = window.plugin.sak.countcalls + 1;
        window.plugin.sak.ledSak = 'green';
        $("#countcalls").css('color',window.plugin.sak.ledSak);
        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);
        window.plugin.sak.countiitccalls = window.plugin.sak.countiitccalls +1;
        $('#countiitccalls').html(window.plugin.sak.countiitccalls+" Incisivita "+cPlayer);
        //recupera il cipher per autenticarsi con il server
        var cipher = window.plugin.sak.getCipher();

        var keysTematize = Object.keys(window.plugin.sak.incisivitaPlayer);

        if(cPlayer == "")
        {
            alert("Devi selezionare un nickname!");
            return false;
        }

        console.debug("Avvio analisi incisivita del giocatore "+cPlayer);
        $('#esitoclient').html('Interroga incisività attività del giocatore '+cPlayer);					

        var inforequest = $
        .post(
            window.plugin.sak.endpointsak,
            {
                context : "incisivitaplayer",
                objplayer : JSON.stringify(window.PLAYER),
                player : cPlayer,
                guid : cGuid,
                hashscript : cipher
            },
            function(data) {
                $('#esitoclient').html('Analisi incisivita giocatore '+cPlayer+' completata');	

                //XXX: reset della lista dei portali censiti dalla chiamata precedente
				/*$.each(window.plugin.sak.temiIncisivitaPlayer, function(j, cKey) {
				       $("#"+cKey).text("");
				});*/					
				window.plugin.sak.removeDataGis();
                window.plugin.sak.deleteRenderPortaliSAK();
                window.plugin.sak.incisivitaPlayer = {};

                var keysTematize = Object.keys(window.plugin.sak.incisivitaPlayer);
                console.info("Risultato incisivita del "+cPlayer);
                console.info(data);

                /*console.log("Temi da rimuovere: "+keysTematize);
                $.each(keysTematize, function(j, cKey) {
                    var cClass = cKey;

                    $("#reportincisivita-"+cClass).text("");
                });*/


                $.each(data.payload, function(i, cObj) {

                    window.plugin.sak.InjectDataIncisivita(cObj.guid, cObj);

					var isEnable = true;
					if(window.plugin.sak.supportedFlipFlop['reportincisivita-'+cObj.classTematize])
                    {
                            isEnable = false;
                    }
					
                    if(isRender && isEnable)
                    {
                        var latLng = {};
                        if(cObj.coordinate != undefined)
                        {
                            var arrayCoord = cObj.coordinate.split(',');
                            latLng.lat = arrayCoord[0];
                            latLng.lon = arrayCoord[1];
                            window.plugin.sak.renderPortaliSAK(cObj.guid, "incisivitaplayer", latLng);
                        }
                        else
                            console.warn("Attenzione non sono state trovate le coordinate dell'azione sull'incisivita di "+cPlayer);
                    }
                });

				//var temiTotali = Object.keys(window.plugin.sak.temiIncisivitaPlayer);
				/*$.each(window.plugin.sak.temiIncisivitaPlayer, function(j, cKey) {
				       $("#"+cKey).text("");
				});*/

                //XXX: l'obiettivo di questo metodo è popolare gli array dei portali tematizzati da registrare
                window.plugin.sak.deployTematizeIncisivitaPlayer();

                var keysTematize = Object.keys(window.plugin.sak.incisivitaPlayer);
                console.log("Temi trovati: "+keysTematize);
				
                $.each(keysTematize, function(j, cKey) {

                    var count = Object.keys(window.plugin.sak.incisivitaPlayer[cKey]).length;

                    var cClass = cKey;

                    if(count > 0)
                        $("#reportincisivita-"+cClass).text(" "+count+" trovati!");
                    else
                        $("#reportincisivita-"+cClass).text("");

                });


                //deregistrazione dalla chiamate attive
                window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                $('#countcalls').html(window.plugin.sak.countcalls);
                if(window.plugin.sak.countcalls > 0)
                    $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

                window.plugin.sak.countiitccalls = window.plugin.sak.countiitccalls -1;
                $('#countiitccalls').html(window.plugin.sak.countiitccalls);
                if(window.plugin.sak.countiitccalls > 0)
                    $('#countiitccalls').html(window.plugin.sak.countiitccalls+" Track "+cPlayer);

                //var callback = function(){ $('#esitoclient').html('idle...');};
				var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
                window.plugin.sak.mutexSak(callback);

            })
        .fail(
            function(xhr, textStatus, errorThrown) {
                console.log(xhr.statusText);
                console.log(xhr.responseText);
                console.log(textStatus);
                console.error(error);
                window.plugin.sak.getFailError(xhr,textStatus, "Incisivita player");

                window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                $('#countcalls').html(window.plugin.sak.countcalls);
                if(window.plugin.sak.countcalls > 0)
                    $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

                window.plugin.sak.countiitccalls = window.plugin.sak.countiitccalls -1;
                $('#countiitccalls').html(window.plugin.sak.countiitccalls);
                if(window.plugin.sak.countiitccalls > 0)
                    $('#countiitccalls').html(window.plugin.sak.countiitccalls+" Track "+cPlayer);

                //var callback = function(){ $('#esitoclient').html('idle...');};
				var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
                window.plugin.sak.mutexSak(callback);

                //alert
                console.error("Anomalia di comunicazione! Recupero del incisivita player fallito!!");
            });				
	}
	
    // ------------------------
    // ------------------------
    // ------------------------
    // Metodi personalizzati per eseguire le chiamate al server
    // ------------------------
    // ------------------------
    // ------------------------

    // invia le informazioni del portale selezionato alla banca dati hostata sul
    // window.runHooks ('portalDetailLoaded', {guid:guid, success:success,
    // details:data});
    // runHooks('portalDetailsUpdated', {guid: guid, portal: portal,
    // portalDetails: details, portalData: data});
    window.plugin.sak.waitnextsendportal = false;
    //window.plugin.sak.enqueuesensportal = new Array();

    window.plugin.sak.renderDettaglioPortale = function(payload,dataDecadimento)
    {


        // creazione dei container per visualizzare le
        // informazioni del portale e innestarli nel div del
        // portaldetails
        // recupero del container del dettaglio portale
        var containerdetailportalsak = $("#containerdetailportalsak");
        // innesto container informazioni indirizzo e data
        // cattura portale
        var datasak = payload;
        if(window.portals[datasak.guid] != null)
        {
            //var datasak = data.datiinseriti;
            if(window.portals[datasak.guid].options != null)
            {
                window.portals[datasak.guid].options.datasak = datasak;
            }
            else
                console.warn("Il guid ["+datasak.guid+"] non risulta visualizzato sulla mappa corrente.");
        }
        else
        {

            console.warn("I dettagli del portale non sono stati trovati ["+datasak.guid+"].");
            //$('#anomaliaserver').html($('<label label >Attenzione: I dettagli del portale non sono stati trovati.</label>'));//html(friendlymsg);
            //var callback = function(){ $('#anomaliaserver').html(''); };
            //window.plugin.sak.mutexSak(callback);										
        }


        var datatrack = null;
        if(window.plugin.sak.tracciamentoPlayer["list"] != null)
        {
            var ptrack = window.plugin.sak.tracciamentoPlayer["list"][datasak.guid];
            if(ptrack != null)
                datatrack = ptrack.options.datatrack;
        }
		
		var dataincisivita = null;
        if(window.plugin.sak.incisivitaPlayer["list"] != null)
        {
            var ptrack = window.plugin.sak.incisivitaPlayer["list"][datasak.guid];
            if(ptrack != null)
                dataincisivita = ptrack.options.dataincisivita;
        }
		
		var datacaratteristiche = null;
        if(window.plugin.sak.caratteristichePortali["list"] != null)
        {
            var pcaratteristiche = window.plugin.sak.caratteristichePortali["list"][datasak.guid];
            if(pcaratteristiche != null)
                datacaratteristiche = pcaratteristiche.options.datacaratteristiche;
        }

        var sezioneGisPortaleSak = $("<div id=\"containeraddress\" class=\"sakdetailportal\"/>");
        var sezioneInfoPortaleSak = $("<div id=\"containerinfosak\" class=\"sakdetailportal\"/>");
        var sezioneMainPortaleSak = $("<div id=\"containermain\" class=\"sakdetailportal\" style='font-size: smaller;'/>");

        sezioneMainPortaleSak.empty();

        var consoleDettaglio = $
        (
            "<br/>\
<label  id='datacaptureportale' /><br/>\
<label  id='timelapsecaptureportale' /><br/>\
<label  id='dataUltimaModifica' /><br/>\
<div  id='linkgmaps' />\
<label style='color: #ffce00;' >Indirizzo:</label><br/>\
<div class=\"sakaddressportal\" id='addressportale' style='min-height: 30px;'/><br/>\
"
        );

        if(datatrack != null)
        {
            console.info("Ci sono i dati di tracciamento "+datatrack.player);
            console.info("Frequenza: "+datatrack.frequenza);
            console.info("Coefficiente: "+datatrack.coefficiente);
            console.info("Presidiabilita: "+datatrack.presidiabilita);

            var info = datatrack.frequenza;
            if(datatrack.frequenza == -1)
            {
                var info = "Proprietario";
            }

            "<a id='inputlifecapture' value='"+window.plugin.sak.namelifecapture+"' onclick=\"window.plugin.sak.getLifeCapture();if(window.isSmartphone())$('#inputlifecapture').hide()\" >"+window.plugin.sak.namelifecapture+"</a>"
            var infoTracciamento = $
            (
                "<br/>\
<fieldset><legend>Info tracciamento "+datatrack.player+"</legend>\
<label style='color: #ffce00;' >Frequenza: </label>\
<a id='inputlifecaptureplayer' value='trackplayer' onclick=\"window.plugin.sak.getLifeCapture('"+datasak.guid+"','"+datatrack.player+"');\"  >\
<span ><label>"+info+"</label></span></fieldset></br>\
</a>"
            );									

            sezioneGisPortaleSak.append(infoTracciamento);
        }
		
		if(dataincisivita != null)
        {
            console.info("Ci sono i dati di tracciamento "+dataincisivita.player);
            console.info("Fazione Dominante: "+dataincisivita.dominante);
			console.info("Grado di dominazione: "+dataincisivita.dominanza);
			console.info("Grado incisivita: "+dataincisivita.gradoincisivita);
            console.info("Percentuale incisivita: "+dataincisivita.percentualeincisivita);

            var infoIncisivita = $
            (
                "<br/>\
<fieldset><legend>Info incisività di "+dataincisivita.player+"</legend>\
<a id='inputlifecaptureplayer' value='trackplayer' onclick=\"window.plugin.sak.getLifeCapture('"+dataincisivita.guid+"','"+dataincisivita.player+"');\"  >\
<span ><label>"+dataincisivita.gradoincisivita+"</label></span></a><br/>\
<label style='color: #ffce00;' >Percentuale azioni di "+dataincisivita.player+": </label>\
<span ><label>"+dataincisivita.percentualeincisivita+" %</label></span><br/>\
<label style='color: #ffce00;' >Fazione dominante: </label>\
<span ><label>"+dataincisivita.dominante+"</label></span><br/>\
<label style='color: #ffce00;' >Scarto di incisività della fazione: </label>\
<span ><label>"+dataincisivita.dominanza+" %</label></span><br/>\
<br/>\
</fieldset></br>\
"
            );									

            sezioneGisPortaleSak.append(infoIncisivita);
        }

		if(datacaratteristiche != null)
        {
			var caratteristiche = datacaratteristiche.caratteristiche;
			
            console.info("Fazione Dominante: "+caratteristiche.dominante);
			console.info("Grado di dominanza: "+caratteristiche.dominanza+" %");
			console.info("Influenza Resistenza: "+caratteristiche.resincisivita+" %");
			console.info("Influenza Illuminati: "+caratteristiche.enlincisivita+" %");
			
			var statistiche = datacaratteristiche.statistiche;
			
			var influenzares = (caratteristiche.resincisivita);
			var influenzaenl = (caratteristiche.enlincisivita);
			var influenzaportale = (caratteristiche.totaleincisivita);
			
			if(caratteristiche.dominante != 'NEUTRAL')
			{
				influenzares = parseFloat(influenzares).toFixed(0);
				influenzaenl = parseFloat(influenzaenl).toFixed(0);
				
				influenzares = (influenzares % 100)+" %";
				influenzaenl = (influenzaenl % 100)+" %";
					
			}
			else
			{
				influenzares = 'Non valutabile';
				influenzaenl = 'Non valutabile';
			}
			
            var infoCaratteristiche = $
            (
                "<fieldset><legend>Peculiarità del portale "+caratteristiche.titolo+"</legend>\
<span ><label>Fazione Dominante: </label><label style='color: #ffce00;'>"+caratteristiche.dominante+"</label></span></a><br/>\
<span ><label>Coefficiente di dominanza: </label><label style='color: #ffce00;'>"+parseFloat(caratteristiche.bonusdominanza).toFixed(2)+"</label></span></a><br/>\
<span ><label>Influenza Resistenza: </label><label style='color: #ffce00;'>"+influenzares+"</label></span></a><br/>\
<span ><label>Influenza Illuminati: </label><label style='color: #ffce00;'>"+influenzaenl+"</label></span></a><br/>\
</fieldset></br>\
");									
			sezioneGisPortaleSak.append(infoCaratteristiche);
			
			var statsAzioni = $("<div id='idstatscaratteristicaportale' ></div>")
			var fieldsetStatsAzioni = $("<fieldset><legend>Classifica azioni</legend>");
			
			$.each(statistiche, function(i,cStats) {
						var tipoAzione = cStats.descactionplayer;
						var occorrenzaAzione = cStats.occorrenza;
						var tagStat = $("<label>"+occorrenzaAzione+" "+tipoAzione+"</label><br/>");
						statsAzioni.append(tagStat);
			});

			fieldsetStatsAzioni.append(statsAzioni)
            sezioneGisPortaleSak.append(fieldsetStatsAzioni);
        }
		
        var linkStorico = $
        (
            "<p ><b>Dettaglio SAK<br/><span>"+datasak.titolo+"</span></b></p><a id='inputlifecapture' value='"+window.plugin.sak.namelifecapture+"' onclick=\"window.plugin.sak.getLifeCapture();\" >"+window.plugin.sak.namelifecapture+"</a>"
        );
        sezioneInfoPortaleSak.append(linkStorico);
        sezioneInfoPortaleSak.append(consoleDettaglio);

        sezioneMainPortaleSak.append(sezioneInfoPortaleSak);
        sezioneMainPortaleSak.append(sezioneGisPortaleSak);

        containerdetailportalsak.html(sezioneMainPortaleSak);

        var lastmodified = "Non disponibile";
        if(datasak.lastmodifiedformatted != null)
        {
            lastmodified = datasak.lastmodifiedformatted
        }
        $("#dataUltimaModifica")
            .text(
            "Data ultima modifica: "
            + lastmodified);

        $("#addressportale").text(datasak.indirizzo);
        if (!$("#aLinkGmaps").length) {
            $("#linkgmaps")
                .append(
                $("<a id='aLinkGmaps' target='blank' href='"
                  + datasak.datagis.linkGmaps 
                  + "'>Visualizza su Gmaps</a>"));
        }
        var capturetime = "Non disponibile";
        if(datasak.capturetime != '0000-00-00 00:00:00')
        {

            capturetime = datasak.capturetimeformatted;
        }
        $("#datacaptureportale")
            .text(
            "Data cattura stimata: "
            + capturetime);
        if (datasak.capturetime != '0000-00-00 00:00:00')
            $("#timelapsecaptureportale").text(
                "Durata cattura: " + datasak.tempotrascorso);
        else
            $("#timelapsecaptureportale").text(
                "Durata cattura: Non disponibile");

        $("#timelapsecaptureportale").append($("<br/>")).append($("<label id='datadecadimento' />").text("Data decadimento: "+dataDecadimento));

    }

    window.plugin.sak.renderConsultaOggettiSpeciali = function(data, keysearch)
    {
        var idcontainerresults = "#"+window.plugin.sak.containerdatafromserver;

        $(idcontainerresults).empty();
        $(idcontainerresults).append($("<span id='close' onclick=\"$('"+idcontainerresults+"').empty();$('"+idcontainerresults+"').hide()\">x</span>"));

        if(keysearch == '')
        {
            keysearch = 'qualsiasi giocatore';	
        }

        //creazione del table di riepilogo della ricerca
        var divCriteria = $("<span id='tbCriteria' />").addClass("sakcriteria resultcriteria").text("Risultati oggetti speciali deployati da "+keysearch);
        //tableCriteria.append("<tr />").append("<th />").addClass("sakcriteria resultcriteria").text("Risultati portali per il criterio "+keysearch);
        //creazione table dei risultati di ricerca
        var linkreportistica = $("<a id='reportisticadeplyspeciali'>").attr("value",
                                                                            "Scarica report").attr("onclick",
                                                                                                   "window.plugin.sak.downloadblob()").addClass("sakbody")
        .text("Scarica report");
        var linkhidereport = $("<a id='removereportisticadeployspeciali'>").attr("value",
                                                                                 "Rimuovi risultati").attr("onclick",
                                                                                                           "$('"+idcontainerresults+"').empty();$('"+idcontainerresults+"').hide()")
        .text("Rimuovi risultati").addClass("sakbody");
        divCriteria.append($("<br/>")).append(linkhidereport).append($("<br />")).append(linkreportistica);
        //tableContainer.append(linkreportistica);

        var criteria = keysearch;

        var tableContainer = $("<table id='chatpublic' />").addClass("saktable-container");
        var arrayResult = data;
        divCriteria.append("<br/>").append($("<span>").addClass("sakcriteria resultcriteria").text("Deploy oggetti speciali"));
        $(idcontainerresults).append(divCriteria);

        if(arrayResult == null || arrayResult.length == 0)
            tableContainer.append("<tr><th class='table-alignl table-width35'><span >Nessun risultato trovato</span></th></tr>");
        else
        {

            for (i = 0; i < arrayResult.length; i++) {

                var cObj = arrayResult[i];

                var portale = cObj.portale;
                //console.log(cObj);

                var titolo = portale.titolo;
                var indirizzo = portale.indirizzo;
                //var tipoazione = cObj.tipoazione;
                var lat = portale.datagis.lat;
                var lon = portale.datagis.lon;
                var faction = cObj.giocatore.faction;
                var parseDate = cObj.istante;//cObj.data+" "+cObj.ora;
                var tipoDeploy = cObj.tipodeploy;
                var player = cObj.giocatore.player;
                //var lastmodified = cObj.lastmodified;

                var hidePortale = false;
                if(lat == undefined || lat == "")
                {
                    hidePortale = true;
                }

                if(!hidePortale)
                    linkIntel = $("<a />").addClass("saka").attr("onclick","window.plugin.sak.selectPortalByLatLng("+lat+","+ lon+");return false").attr("href","/intel?ll="+lat+","+lon+"&z=15").text("Intel Map");
                else
                    linkIntel = "Non disponibile";

                //var isvalid = cObj.isvalid; 
                var riassunto = "Alle ore "+cObj.ora+" del "+cObj.data+" è stato deployato l'oggetto speciale <b>"+tipoDeploy+"</b> da <b>"+player+"</b> sul portale <b>"+titolo+"</b> nei pressi di <a class='saka' onclick='window.plugin.sak.selectPortalByLatLng("+lat+","+ lon+");return false' href='/intel?ll="+lat+","+lon+"&z=15' >"+indirizzo+" </a>";
                /*			if(isvalid != 1)
					textvalido = "L'owner attuale è "+owner+" , è stato immunizzato "+capturetime+" ("+tempotrascorso+") ,ma NON ha resonatori deployati";
	*/

                var factionstyle = "nia";
                if(faction == 'RESISTANCE' || faction == 'R')
                    factionstyle = "res";
                else if(faction == 'ENLIGHTENED' || faction == 'E')
                    factionstyle = "enl";

                var currentTableTitolo = $("<table />").addClass("table-title livrea"+factionstyle);
                var contentTitolo = $("<tr />").append($("<td />").addClass("table-title-td logo-"+factionstyle+" titolo").text(titolo));
                currentTableTitolo.append(contentTitolo);
                currentTableTitolo.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").html(riassunto)));
                currentTableTitolo.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").append($("<a onclick=\"$('#currentOggettoSpeciale"+i+"').toggle();\" />").text("Visualizza"))));

                var currentTableDataPortale =  $("<table id='currentOggettoSpeciale"+i+"' />").addClass("table-content livrea"+factionstyle+" occorrenza");

                currentTableDataPortale.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").text("Data deploy: ")).append($("<td />").addClass("table-alignl table-width35").text(parseDate)));
                currentTableDataPortale.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").text("Oggetto deployato: ")).append($("<td />").addClass("table-alignl table-width35").text(tipoDeploy)));

                if(cObj.pathimage != "" && cObj.pathimage != undefined)
                {
                    var currentTrDataImage = $("<tr />");
                    var dataImage = $("<td colspan='2' />").append("<img width='150' src='"+cObj.pathimage+"' />");
                    currentTrDataImage.append(dataImage);
                    currentTableDataPortale.append(currentTrDataImage);
                }

                currentTableDataPortale.append($("<tr />").append($("<th colspan='2' />").addClass("table-alignl table-width35").text("Informazioni geografiche")));
                var currentTrDataIndirizzo = $("<tr />");
                var dataIndirizzo = $("<td />").addClass("table-alignl table-width35").text(indirizzo);
                currentTrDataIndirizzo.append(dataIndirizzo);

                var dataIntelMap = $("<td />").addClass("table-alignl table-width35").append(linkIntel);
                currentTrDataIndirizzo.append(dataIntelMap);
                currentTableDataPortale.append(currentTrDataIndirizzo);

                if(!hidePortale)
                {
                    var currentTrDataGmaps = $("<tr />");
                    currentTrDataGmaps.append($("<td />").addClass("table-alignl table-width35").text("["+lat+"]["+lon+"]"));
                    var linkGmaps = $("<a />").addClass("saka").attr("target", "blank").attr("href","https://maps.google.com/maps?q="+lat+","+lon).text("Gmaps");
                    var dataGmaps = $("<td />").addClass("table-alignl table-width35").append(linkGmaps);
                    currentTrDataGmaps.append(dataGmaps);
                    currentTableDataPortale.append(currentTrDataGmaps);
                }

                var linkStorico = $(
                    "<a id='inputlifecapture'>")
                .attr(
                    "value",
                    window.plugin.sak.namelifecapture)
                .attr(
                    "onclick",
                    "window.plugin.sak.getLifeCapture('"+cObj.guid+"');if(window.isSmartphone())$('#inputlifecapture').hide()")
                .text(
                    window.plugin.sak.namelifecapture);

                if (!window.isSmartphone())
                    currentTableDataPortale.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").append(linkStorico)));						

                tableContainer.append(currentTableTitolo);
                tableContainer.append(currentTableDataPortale.hide());
            }

        }

        var divScrollable = $("<div >").addClass('container-current-result');
        divScrollable.append(tableContainer);
        $(idcontainerresults).append(divScrollable);


        $(idcontainerresults).addClass("sakbody");
    }

    window.plugin.sak.renderConsultaGuardians = function(data, keysearch)
    {
        var idcontainerresults = "#"+window.plugin.sak.containerdatafromserver;
        var multiTable = $("<div class='container-current-result'/>");

        $(idcontainerresults).empty();
        $(idcontainerresults).append($("<span id='close' onclick=\"$('"+idcontainerresults+"').empty();$('"+idcontainerresults+"').hide()\">x</span>"));
        if(keysearch == '')
        {
            keysearch = 'qualsiasi giocatore';	
        }

        //creazione del table di riepilogo della ricerca
        var divCriteria = $("<div id='tbCriteria' />").addClass("sakcriteria resultcriteria").text("Risultati guardians per "+keysearch);
        //creazione table dei risultati di ricerca
        var linkreportistica = $("<a id='reportisticaguardians'>").attr("value",
                                                                        "Scarica report").attr("onclick",
                                                                                               "window.plugin.sak.downloadblob()").addClass("sakbody")
        .text("Scarica report");
        var linkhidereport = $("<a id='removerisultatiguardians'>").attr("value",
                                                                         "Rimuovi risultati").attr("onclick",
                                                                                                   "$('"+idcontainerresults+"').empty();$('"+idcontainerresults+"').hide()")
        .text("Rimuovi risultati").addClass("sakbody");
        divCriteria.append($("<br/>")).append(linkhidereport).append($("<br />")).append(linkreportistica);
        $(idcontainerresults).append(divCriteria);

        var tableContainer = $("<table id='guardianbycaptured' />").addClass("saktable-container");
        multiTable.append("<br/>");		
        multiTable.append($("<div>").addClass("sakcriteria resultcriteria").text("Potenziali guardians stimati dalle azioni di cattura"));
        var arrayResult = data['guardianstimati'];
        if(arrayResult == null || arrayResult.length == 0)
            tableContainer.append("<tr><th class='table-alignl table-width35'><span >Nessun risultato trovato</span></th></tr>");
        else
        {

            multiTable.append($("<a onclick=\"$('#guardianbycaptured').toggle();\" />").text("Visualizza"));

            for (i = 0; i < arrayResult.length; i++) {
                var cObj = arrayResult[i];
                //console.log(cObj);
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

                var hideElapsed = false;
                if(predictcapturetime != '0000-00-00 00:00:00')
                {
                    predictcapturetime = cObj.capturetimeformatted;

                    //predictcapturetime = window.plugin.sak.dateFormat(/*parseDate.toDateString()*/Date.parse(predictcapturetime), "dddd, dS mmmm, yyyy, h:MM:ss TT");
                }
                else
                {
                    predictcapturetime = "Non disponibile";
                    hideElapsed = true;
                }

                //var isvalid = cObj.isvalid; 
                var riassunto = "L'owner attuale è <b>"+player+"</b>, è stato catturato il <b>"+predictcapturetime+"</b> ("+tempotrascorso+").";// L'attendibilità è "+attendibilita;
                //if(isvalid != 1)
                //	textvalido = "L'owner attuale è "+player+" è stato catturato "+predictcapturetime+" ("+tempotrascorso+"), ma NON ha resonatori deployati. L'attendibilità è "+attendibilita;


                var factionstyle = "nia";
                if(faction == 'RESISTANCE' || faction == 'R')
                    factionstyle = "res";
                else if(faction == 'ENLIGHTENED'  || faction == 'E')
                    factionstyle = "enl";

                var currentTableTitolo = $("<table />").addClass("table-title livrea"+factionstyle);
                var contentTitolo = $("<tr />").append($("<td />").addClass("table-title-td logo-"+factionstyle+" titolo").text(titolo));
                currentTableTitolo.append(contentTitolo);
                currentTableTitolo.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").html(riassunto)));
                currentTableTitolo.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").append($("<a onclick=\"$('#currentCapturedPortal"+i+"').toggle();\" />").text("Visualizza"))));

                var currentTableDataPortale =  $("<table id='currentCapturedPortal"+i+"'/>").addClass("table-content livrea"+factionstyle+" occorrenza");

                if(portale.pathimage != "" && portale.pathimage != undefined)
                {
                    var currentTrDataImage = $("<tr />");
                    var dataImage = $("<td colspan='2' />").append("<img width='150' src='"+portale.pathimage+"' />");
                    currentTrDataImage.append(dataImage);
                    currentTableDataPortale.append(currentTrDataImage);
                }

                if(lastmodified != '0000-00-00 00:00:00')
                {
                    //var lastmodified = new Date(lastmodified).toLocaleString();

                    //lastmodified = window.plugin.sak.dateFormat(/*parseDate.toDateString()*/Date.parse(lastmodified), "dddd, dS mmmm, yyyy, h:MM:ss TT");
                }
                currentTableDataPortale.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").text("Ultimo aggiornamento: ")).append($("<td />").addClass("table-alignl table-width35").text(lastmodified)));
                currentTableDataPortale.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").text("Reporter: ")).append($("<td />").addClass("table-alignl table-width35").text(reporter)));

                //currentTableDataPortale.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").text("Attendibilità: ")).append($("<td />").addClass("table-alignl table-width35").text(attendibilita)));


                //currentTableDataPortale.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").text("Owner attuale: ")).append($("<td />").addClass("table-alignl table-width35").text(owner)));
                currentTableDataPortale.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").text("Owner attuale: ")).append($("<td />").addClass("table-alignl table-width35").text(player)));
                currentTableDataPortale.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").text("Data cattura stimata: ")).append($("<td />").addClass("table-alignl table-width35").text(predictcapturetime)));
                currentTableDataPortale.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").text("Data cattura registrata: ")).append($("<td />").addClass("table-alignl table-width35").text(predictcapturetime)));
                if(!hideElapsed)
                    currentTableDataPortale.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").text("Tempo trascorso: ")).append($("<td />").addClass("table-alignl table-width35").text(tempotrascorso)));


                /*currentTableDataPortale.append($("<tr />").append($("<th colspan='2'/>").addClass("table-alignl table-width35").text("Ultimo Owner")));
			var currentTrDataOwner = $("<tr />");
			var dataOwner = $("<td />").addClass("table-alignl table-width35").text(lastowner);
			currentTrDataOwner.append(dataOwner);
			var dataCaptureTime = $("<td />").addClass("table-alignl table-width35").append(manualpredictcapturetime);
			currentTrDataOwner.append(dataCaptureTime);
			currentTableDataPortale.append(currentTrDataOwner);*/

                currentTableDataPortale.append($("<tr />").append($("<th colspan='2' />").addClass("table-alignl table-width35").text("Informazioni geografiche")));
                var currentTrDataIndirizzo = $("<tr />");
                var dataIndirizzo = $("<td />").addClass("table-alignl table-width35").text(indirizzo);
                currentTrDataIndirizzo.append(dataIndirizzo);

                var linkIntel = $("<a />").addClass("saka").attr("onclick","window.plugin.sak.selectPortalByLatLng("+lat+","+ lon+");return false").attr("href","/intel?ll="+lat+","+lon+"&z=15").text("Intel Map");
                var dataIntelMap = $("<td />").addClass("table-alignl table-width35").append(linkIntel);
                currentTrDataIndirizzo.append(dataIntelMap);
                currentTableDataPortale.append(currentTrDataIndirizzo);

                var currentTrDataGmaps = $("<tr />");
                currentTrDataGmaps.append($("<td />").addClass("table-alignl table-width35").text("["+lat+"]["+lon+"]"));
                var linkGmaps = $("<a />").addClass("saka").attr("target", "blank").attr("href","https://maps.google.com/maps?q="+lat+","+lon).text("Gmaps");
                var dataGmaps = $("<td />").addClass("table-alignl table-width35").append(linkGmaps);
                currentTrDataGmaps.append(dataGmaps);
                currentTableDataPortale.append(currentTrDataGmaps);

                var linkStorico = $(
                    "<a id='inputlifecapture'>")
                .attr(
                    "value",
                    window.plugin.sak.namelifecapture)
                .attr(
                    "onclick",
                    "window.plugin.sak.getLifeCapture('"+portale.guid+"');if(window.isSmartphone())$('#inputlifecapture').hide()")
                .text(
                    window.plugin.sak.namelifecapture);

                if (!window.isSmartphone())
                    currentTableDataPortale.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").append(linkStorico)));						


                tableContainer.append(currentTableTitolo);
                tableContainer.append(currentTableDataPortale.hide());



                //console.log(titolo+" "+indirizzo+" "+lat+" "+lon);
            }
        }
        multiTable.append(tableContainer);

        var tableContainer = $("<table id='guardianByInteract'/>").addClass("saktable-container");
        multiTable.append("<br/>");
        multiTable.append($("<div>").addClass("sakcriteria resultcriteria").text("Potenziali guardian in base alla informazione owner corrente del portale"));
        var arrayResult = data['guardianinteract'];
        if(arrayResult == null || arrayResult.length == 0)
            tableContainer.append("<tr><th class='table-alignl table-width35'><span >Nessun risultato trovato</span></th></tr>");
        else
        {

            multiTable.append($("<a onclick=\"$('#guardianByInteract').toggle();\" />").text("Visualizza"));

            for (i = 0; i < arrayResult.length; i++) {
                var cObj = arrayResult[i];
                //console.log(cObj);
                var portale = cObj.portale;

                var titolo = portale.titolo;
                var indirizzo = portale.indirizzo;
                //var tipoazione = cObj.tipoazione;
                var lat = portale.datagis.lat;
                var lon = portale.datagis.lon;
                var faction = cObj.giocatore.faction;
                var owner = cObj.giocatore.player;
                var capturetime = portale.capturetime;
                var lastmodified = portale.lastmodifiedformatted;
                var tempotrascorso = cObj.tempotrascorso;
                var reporter = cObj.reporter;

                //var isvalid = cObj.isvalid; 
                var riassunto = "L'owner attuale è <b>"+owner+"</b>";
                //if(isvalid != 1)
                //	textvalido = "L'owner attuale è "+owner+" ma NON ha resonatori deployati";

                var factionstyle = "nia";
                if(faction == 'RESISTANCE' || faction == 'R')
                    factionstyle = "res";
                else if(faction == 'ENLIGHTENED' || faction == 'E')
                    factionstyle = "enl";


                var currentTableTitolo = $("<table />").addClass("table-title livrea"+factionstyle);
                var contentTitolo = $("<tr />").append($("<td />").addClass("table-title-td logo-"+factionstyle+" titolo").text(titolo));
                currentTableTitolo.append(contentTitolo);
                currentTableTitolo.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").html(riassunto)));
                currentTableTitolo.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").append($("<a onclick=\"$('#currentManualPortal"+i+"').toggle();\" />").text("Visualizza"))));


                var currentTableDataPortale =  $("<table id='currentManualPortal"+i+"'/>").addClass("table-content livrea"+factionstyle+" occorrenza");

                if(cObj.pathimage != "" && cObj.pathimage != undefined)
                {
                    var currentTrDataImage = $("<tr />");
                    var dataImage = $("<td colspan='2' />").append("<img width='150' src='"+cObj.pathimage+"' />");
                    currentTrDataImage.append(dataImage);
                    currentTableDataPortale.append(currentTrDataImage);
                }

                var hideElapsed = false;
                if(capturetime != '0000-00-00 00:00:00')
                {
                    capturetime = cObj.capturetimeformatted;

                    //capturetime = window.plugin.sak.dateFormat(Date.parse(capturetime), "dddd, dS mmmm, yyyy, h:MM:ss TT");
                }
                else
                {
                    capturetime = "Non disponibile";
                    hideElapsed = true;
                }

                if(lastmodified != '0000-00-00 00:00:00')
                {
                    //var lastmodified = new Date(lastmodified).toLocaleString();;

                    //lastmodified = window.plugin.sak.dateFormat(Date.parse(lastmodified), "dddd, dS mmmm, yyyy, h:MM:ss TT");
                }

                currentTableDataPortale.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").text("Ultimo aggiornamento: ")).append($("<td />").addClass("table-alignl table-width35").text(lastmodified)));
                currentTableDataPortale.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").text("Reporter: ")).append($("<td />").addClass("table-alignl table-width35").text(reporter)));
                currentTableDataPortale.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").text("Owner attuale: ")).append($("<td />").addClass("table-alignl table-width35").text(owner)));
                currentTableDataPortale.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").text("Data cattura stimata: ")).append($("<td />").addClass("table-alignl table-width35").text(capturetime)));
                if(!hideElapsed)
                    currentTableDataPortale.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").text("Tempo trascorso: ")).append($("<td />").addClass("table-alignl table-width35").text(tempotrascorso)));

                currentTableDataPortale.append($("<tr />").append($("<th colspan='2' />").addClass("table-alignl table-width35").text("Informazioni geografiche")));
                var currentTrDataIndirizzo = $("<tr />");
                var dataIndirizzo = $("<td />").addClass("table-alignl table-width35").text(indirizzo);
                currentTrDataIndirizzo.append(dataIndirizzo);

                var linkIntel = $("<a />").addClass("saka").attr("onclick","window.plugin.sak.selectPortalByLatLng("+lat+","+ lon+");return false").attr("href","/intel?ll="+lat+","+lon+"&z=15").text("Intel Map");
                var dataIntelMap = $("<td />").addClass("table-alignl table-width35").append(linkIntel);
                currentTrDataIndirizzo.append(dataIntelMap);
                currentTableDataPortale.append(currentTrDataIndirizzo);

                var currentTrDataGmaps = $("<tr />");
                currentTrDataGmaps.append($("<td />").addClass("table-alignl table-width35").text("["+lat+"]["+lon+"]"));
                var linkGmaps = $("<a />").addClass("saka").attr("target", "blank").attr("href","https://maps.google.com/maps?q="+lat+","+lon).text("Gmaps");
                var dataGmaps = $("<td />").addClass("table-alignl table-width35").append(linkGmaps);
                currentTrDataGmaps.append(dataGmaps);
                currentTableDataPortale.append(currentTrDataGmaps);

                var linkStorico = $(
                    "<a id='inputlifecapture'>")
                .attr(
                    "value",
                    window.plugin.sak.namelifecapture)
                .attr(
                    "onclick",
                    "window.plugin.sak.getLifeCapture('"+portale.guid+"');if(window.isSmartphone())$('#inputlifecapture').hide()")
                .text(
                    window.plugin.sak.namelifecapture);

                if (!window.isSmartphone())
                    currentTableDataPortale.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").append(linkStorico)));						

                tableContainer.append(currentTableTitolo);
                tableContainer.append(currentTableDataPortale.hide());

                //console.log(titolo+" "+indirizzo+" "+lat+" "+lon);
            }
        }
        multiTable.append(tableContainer);		



        var arrayResult = data['guardianvirus'];
        multiTable.append("<br/>").append($("<div>").addClass("sakcriteria resultcriteria").text("Portals Held by Virus"));
        var esitonoresult = "Nessun risultato trovato";

        var tableContainer = $("<table id='guardianByVirus' />").addClass("saktable-container");
        if(arrayResult == null || arrayResult.length == 0)
            tableContainer.append("<tr><th class='table-alignl table-width35'><span >"+esitonoresult+"</span></th></tr>");
        else
        {

            multiTable.append($("<a onclick=\"$('#guardianByVirus').toggle();\" />").text("Visualizza"));


            for (i = 0; i < arrayResult.length; i++) {

                var cObj = arrayResult[i];
                var portale = cObj.portale;

                var titolo = portale.titolo;
                var indirizzo = portale.indirizzo;
                //var tipoazione = cObj.tipoazione;
                var lat = portale.datagis.lat;
                var lon = portale.datagis.lon;
                var faction = cObj.giocatore.faction;
                var owner = cObj.giocatore.player;
                var capturetime = portale.capturetime;
                var lastmodified = portale.lastmodifiedformatted;
                var tempotrascorso = cObj.tempotrascorso;

                var hideElapsed = false;
                if(capturetime != '0000-00-00 00:00:00')
                {

                    capturetime = cObj.capturetimeformatted;

                    //capturetime = window.plugin.sak.dateFormat(Date.parse(capturetime), "dddd, dS mmmm, yyyy, h:MM:ss TT");
                }
                else
                {
                    capturetime = "Non disponibile";
                    hideElapsed = true;
                }


                //var isvalid = cObj.isvalid; 
                var riassunto = "L'owner attuale è <b>"+owner+"</b> ed è stato immunizzato il <b>"+capturetime+"</b> ("+tempotrascorso+")";
                //if(isvalid != 1)
                //	textvalido = "L'owner attuale è "+owner+" , è stato immunizzato "+capturetime+" ("+tempotrascorso+") ,ma NON ha resonatori deployati";


                var factionstyle = "nia";
                if(faction == 'RESISTANCE' || faction == 'R')
                    factionstyle = "res";
                else if(faction == 'ENLIGHTENED' || faction == 'E')
                    factionstyle = "enl";

                var currentTableTitolo = $("<table />").addClass("table-title livrea"+factionstyle);
                var contentTitolo = $("<tr />").append($("<td />").addClass("table-title-td logo-"+factionstyle+" titolo").text(titolo));
                currentTableTitolo.append(contentTitolo);
                currentTableTitolo.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").html(riassunto)));
                currentTableTitolo.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").append($("<a onclick=\"$('#currentVirusPortal"+i+"').toggle();\" />").text("Visualizza"))));

                var currentTableDataPortale =  $("<table id='currentVirusPortal"+i+"' />").addClass("table-content livrea"+factionstyle+" occorrenza");

                if(portale.pathimage != "" && portale.pathimage != undefined)
                {
                    var currentTrDataImage = $("<tr />");
                    var dataImage = $("<td colspan='2' />").append("<img width='150' src='"+portale.pathimage+"' />");
                    currentTrDataImage.append(dataImage);
                    currentTableDataPortale.append(currentTrDataImage);
                }


                if(lastmodified != '0000-00-00 00:00:00')
                {

                    //var lastmodified = new Date(lastmodified).toLocaleString();;

                    //lastmodified = window.plugin.sak.dateFormat(Date.parse(lastmodified), "dddd, dS mmmm, yyyy, h:MM:ss TT");
                }

                currentTableDataPortale.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").text("Ultimo aggiornamento: ")).append($("<td />").addClass("table-alignl table-width35").text(lastmodified)));
                currentTableDataPortale.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").text("Owner attuale: ")).append($("<td />").addClass("table-alignl table-width35").text(owner)));
                currentTableDataPortale.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").text("Data cattura stimata: ")).append($("<td />").addClass("table-alignl table-width35").text(capturetime)));
                if(!hideElapsed)
                    currentTableDataPortale.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").text("Tempo trascorso: ")).append($("<td />").addClass("table-alignl table-width35").text(tempotrascorso)));

                currentTableDataPortale.append($("<tr />").append($("<th colspan='2' />").addClass("table-alignl table-width35").text("Informazioni geografiche")));
                var currentTrDataIndirizzo = $("<tr />");
                var dataIndirizzo = $("<td />").addClass("table-alignl table-width35").text(indirizzo);
                currentTrDataIndirizzo.append(dataIndirizzo);

                var linkIntel = $("<a />").addClass("saka").attr("onclick","window.plugin.sak.selectPortalByLatLng("+lat+","+ lon+");return false").attr("href","/intel?ll="+lat+","+lon+"&z=15").text("Intel Map");
                var dataIntelMap = $("<td />").addClass("table-alignl table-width35").append(linkIntel);
                currentTrDataIndirizzo.append(dataIntelMap);
                currentTableDataPortale.append(currentTrDataIndirizzo);

                var currentTrDataGmaps = $("<tr />");
                currentTrDataGmaps.append($("<td />").addClass("table-alignl table-width35").text("["+lat+"]["+lon+"]"));
                var linkGmaps = $("<a />").addClass("saka").attr("target", "blank").attr("href","https://maps.google.com/maps?q="+lat+","+lon).text("Gmaps");
                var dataGmaps = $("<td />").addClass("table-alignl table-width35").append(linkGmaps);
                currentTrDataGmaps.append(dataGmaps);
                currentTableDataPortale.append(currentTrDataGmaps);

                var linkStorico = $(
                    "<a id='inputlifecapture'>")
                .attr(
                    "value",
                    window.plugin.sak.namelifecapture)
                .attr(
                    "onclick",
                    "window.plugin.sak.getLifeCapture('"+portale.guid+"');if(window.isSmartphone())$('#inputlifecapture').hide()")
                .text(
                    window.plugin.sak.namelifecapture);

                if (!window.isSmartphone())
                    currentTableDataPortale.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").append(linkStorico)));						

                tableContainer.append(currentTableTitolo);
                tableContainer.append(currentTableDataPortale.hide());
            }

        }

        multiTable.append(tableContainer);

        $(idcontainerresults).append(multiTable);

        $(idcontainerresults).addClass("sakbody");

    }
    // chiama il servizio per il recupero della lista guardians


    //renderizza le informazioni delle attività di un giocatore selezionato
    window.plugin.sak.renderConsultaAttivita = function(data, keysearch)
    {
        var idcontainerresults = "#"+window.plugin.sak.containerdatafromserver;
        var multiTable = $("<div class='container-current-result'/>");

        $(idcontainerresults).empty();
        $(idcontainerresults).append($("<span id='close' onclick=\"$('"+idcontainerresults+"').empty();$('"+idcontainerresults+"').hide()\">x</span>"));

        if(keysearch == '')
        {
            keysearch = 'qualsiasi giocatore';	
        }

        //creazione del table di riepilogo della ricerca
        var divCriteria = $("<div id='tbCriteria' />").addClass("sakcriteria resultcriteria").text("Risultati attività di gioco di "+data.headerRicerca);
        //tableCriteria.append("<tr />").append("<th />").addClass("sakcriteria resultcriteria").text("Risultati portali per il criterio "+keysearch);
        //creazione table dei risultati di ricerca
        var linkreportistica = $("<a id='reportisticaattivita'>").attr("value",
                                                                       "Scarica report").attr("onclick",
                                                                                              "window.plugin.sak.downloadblob()").addClass("sakbody")
        .text("Scarica report");
        var linkhidereport = $("<a id='removereportisticaattivita'>").attr("value",
                                                                           "Rimuovi risultati").attr("onclick",
                                                                                                     "$('"+idcontainerresults+"').empty();$('"+idcontainerresults+"').hide()")
        .text("Rimuovi risultati").addClass("sakbody");
        divCriteria.append($("<br/>")).append(linkhidereport).append($("<br />")).append(linkreportistica);
        //tableContainer.append(linkreportistica);

        var criteria = data.headerRicerca;

        var tableContainer = $("<table id='chatpublic' />").addClass("saktable-container");
        $(idcontainerresults).append(divCriteria);

        multiTable.append("<br/>").append($("<div>").addClass("sakcriteria resultcriteria").text("Conversazioni in chat pubblica"));
        var arrayResult = data['msgpublic'];
        if(arrayResult == null || arrayResult.length == 0)
            tableContainer.append("<tr><th class='table-alignl table-width35'><span >Nessun risultato trovato</span></th></tr>");
        else
        {

            multiTable.append($("<a onclick=\"$('#chatpublic').toggle();\" />").text("Visualizza"));

            for (i = 0; i < arrayResult.length; i++) {
                var cObj = arrayResult[i];
                //console.log(cObj);

                var conversazione = cObj.messaggio;
                //var tipoazione = cObj.tipoazione;
                var mittente = cObj.giocatore.player;
                var faction = cObj.giocatore.faction;

                var parseDate = new Date(cObj.data+" "+cObj.ora);

                var parseIstante = cObj.istante;//cObj.data+" "+cObj.ora;cObj.data+" "+cObj.ora;// window.plugin.sak.dateFormat(/*parseDate.toDateString()*/Date.parse(cObj.data+" "+cObj.ora), "dddd, dS mmmm, yyyy, h:MM:ss TT");

                var riassunto =  conversazione;//"@"+mittente+" scrive: "+conversazione;
                var factionstyle = "nia";
                if(faction == 'RESISTANCE' || faction == 'R')
                    factionstyle = "res";
                else if(faction == 'ENLIGHTENED' || faction == 'E')
                    factionstyle = "enl";


                var currentTableTitolo = $("<table />").addClass("table-title livrea"+factionstyle);
                var contentTitolo = $("<tr />").append($("<td />").addClass("table-title-td logo-"+factionstyle+" titolo").text(parseIstante));
                currentTableTitolo.append(contentTitolo);
                currentTableTitolo.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").html(riassunto)));

                tableContainer.append(currentTableTitolo);

            }
        }
        multiTable.append(tableContainer);


        multiTable.append("<br/>");
        var tableContainer = $("<table id='chatfazione' />").addClass("saktable-container");
        var arrayResult = data['msgfaction'];
        multiTable.append($("<div>").addClass("sakcriteria resultcriteria").text("Conversazioni in chat faction"));

        if(arrayResult == null || arrayResult.length == 0)
            tableContainer.append("<tr><th class='table-alignl table-width35'><span >Nessun risultato trovato</span></th></tr>");
        else
        {

            multiTable.append($("<a onclick=\"$('#chatfazione').toggle();\" />").text("Visualizza"));

            for (i = 0; i < arrayResult.length; i++) {
                var cObj = arrayResult[i];
                //console.log(cObj);

                var conversazione = cObj.messaggio;
                var mittente = cObj.giocatore.player;
                var faction = cObj.giocatore.faction;
                //var tipoazione = cObj.tipoazione;

                var parseDate = new Date(cObj.data+" "+cObj.ora);

                var parseIstante = cObj.istante;//cObj.data+" "+cObj.ora;cObj.data+" "+cObj.ora;// window.plugin.sak.dateFormat(/*parseDate.toDateString()*/Date.parse(cObj.data+" "+cObj.ora), "dddd, dS mmmm, yyyy, h:MM:ss TT");

                var riassunto =  conversazione;//"@"+mittente+" scrive: "+conversazione;
                var factionstyle = "nia";
                if(faction == 'RESISTANCE' || faction == 'R')
                    factionstyle = "res";
                else if(faction == 'ENLIGHTENED' || faction == 'E')
                    factionstyle = "enl";


                var currentTableTitolo = $("<table />").addClass("table-title livrea"+factionstyle);
                var contentTitolo = $("<tr />").append($("<td />").addClass("table-title-td logo-"+factionstyle+" titolo").text(parseIstante));
                currentTableTitolo.append(contentTitolo);
                currentTableTitolo.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").html(riassunto)));

                tableContainer.append(currentTableTitolo);

            }
        }
        multiTable.append(tableContainer);




        multiTable.append("<br/>");
        var tableContainer = $("<table id='attivitagioco'/>").addClass("saktable-container");
        var arrayResult = data['attivita'];
        multiTable.append($("<div>").addClass("sakcriteria resultcriteria").text("Azioni di gioco"));

        if(arrayResult == null || arrayResult.length == 0)
            tableContainer.append("<tr><th class='table-alignl table-width35'><span >Nessun risultato trovato</span></th></tr>");
        else
        {

            multiTable.append($("<a onclick=\"$('#attivitagioco').toggle();\" />").text("Visualizza"));

            for (i = 0; i < arrayResult.length; i++) {
                var cObj = arrayResult[i];
                //console.log(cObj);

                var tipoazione = cObj.tipoazione;

                if(tipoazione == 'ACTION_GAME')
                {
                    var azione = cObj.azione;
                    var faction = cObj.giocatore.faction;
                    var indirizzo = cObj.indirizzo;
                    var istante = cObj.istante;//cObj.data+" "+cObj.ora;
                    var player = cObj.giocatore.player;
                    var gis = cObj.portaleorigine.gis;

                    var parseDate = new Date(istante);

                    var parseIstante = istante;//window.plugin.sak.dateFormat(/*parseDate.toDateString()*/Date.parse(istante), "dddd, dS mmmm, yyyy, h:MM:ss TT");

                    azione = window.plugin.sak.replaceAlertMessage(azione,player);
                    var riassunto = "";
                    riassunto = "<b>"+azione+"</b> in <a onclick=\"window.plugin.sak.selectPortalByLatLng("+gis.lat+","+gis.lon+");return false;\" >"+indirizzo+"</a>";

                    /*if(tipoazione == 'ALERT')
				{
					riassunto = "<b>"+azione+"</b>";
				}
				else
				{
					riassunto = "<b>"+azione+"</b> in <a onclick=\"window.plugin.sak.selectPortalByLatLng("+gis.lat+","+gis.lon+");return false;\" >"+indirizzo+"</a>";
				}*/

                    var factionstyle = "nia";
                    if(faction == 'RESISTANCE'  || faction == 'R')
                        factionstyle = "res";
                    else if(faction == 'ENLIGHTENED' || faction == 'E')
                        factionstyle = "enl";

                    var currentTableTitolo = $("<table />").addClass("table-title livrea"+factionstyle);
                    var contentTitolo = $("<tr />").append($("<td />").addClass("table-title-td logo-"+factionstyle+" titolo").text(parseIstante));
                    currentTableTitolo.append(contentTitolo);
                    currentTableTitolo.append($("<tr />").append($("<td >"+riassunto+"</td>").addClass("table-alignl table-width35")));//.text(riassunto)));

                    tableContainer.append(currentTableTitolo);
                }
                //tableContainer.append(currentTableDataPortale.hide());
            }
        }
        multiTable.append(tableContainer);

        $(idcontainerresults).append(multiTable);

        $(idcontainerresults).addClass("sakbody");

    }

    window.plugin.sak.renderLifeCapture = function(data)
    {
        var idcontainerresults = "#"+window.plugin.sak.containerdatafromserver;
        var multiTable = $("<div class='container-current-result'/>");

        $(idcontainerresults).empty();
        $(idcontainerresults).append($("<span id='close' onclick=\"$('"+idcontainerresults+"').empty();$('"+idcontainerresults+"').hide()\">x</span>"));

        var titolo = data.portale.titolo;

        var divCriteria = $("<div id='tbCriteria' />").addClass("sakcriteria resultcriteria").html("Storico azioni del portale <a onclick=\"window.plugin.sak.selectPortalByLatLng("+data.portale.datagis.lat+","+data.portale.datagis.lon+");return false;\" >"+titolo+"</a");

        var linkreportistica = $("<a id='reportisticastorico'>").attr("value",
                                                                      "Scarica report").attr("onclick",
                                                                                             "window.plugin.sak.downloadblob()").addClass("sakbody")
        .text("Scarica report");

        var linkhidereport = $("<a id='removerisultatiportali'>").attr("value",
                                                                       "Rimuovi risultati").attr("onclick",
                                                                                                 "$('"+idcontainerresults+"').empty();$('"+idcontainerresults+"').hide()")
        .text("Rimuovi risultati").addClass("sakbody");
        divCriteria.append($("<br/>")).append(linkhidereport).append($("<br />")).append(linkreportistica);
        $(idcontainerresults).append(divCriteria);

        multiTable.append($("<div>").addClass("sakcriteria resultcriteria").text("Storico azioni captured"));
        var tableContainer = $("<table id='storicocaptured'/>").addClass("saktable-container");
        //XXX: gestire visualizzazione azioni captured e tutte le altre azioni
        //$current["player"].";".$current["faction"].";".$current["azione"].";".$current["data"].";".$current["ora"]
        var arrayResult = data['storicocaptured'];

        if(arrayResult == null || arrayResult.length == 0)
            tableContainer.append("<tr><th class='table-alignl table-width35'><span >Nessun risultato trovato</span></th></tr>");
        else
        {
            multiTable.append($("<a onclick=\"$('#storicocaptured').toggle();\" />").text("Visualizza"));

            for (i = 0; i < arrayResult.length; i++) {

                var cObj = arrayResult[i];


                var player = cObj.giocatore.player;
                var faction = cObj.giocatore.faction;
                var azione = cObj.azione;
                //var tipoazione = cObj.tipoazione;
                //azione = azione.replace()
                //var faction = cObj.faction;
                var parseDate = new Date(cObj.data+" "+cObj.ora);
                var dataazione = window.plugin.sak.dateFormat(Date.parse(parseDate), "dddd, dS mmmm, yyyy, h:MM:ss TT");

                var factionstyle = "nia";
                if(faction == 'R' || faction == 'RESISTANCE')
                    factionstyle = "res";
                else if(faction == 'E' || faction == 'ENLIGHTENED')
                    factionstyle = "enl";

                azione = window.plugin.sak.replaceAlertMessage(azione,player);
                var riassunto = "<b>"+azione+"</b> at <b>"+dataazione+"</b>";//+" at "+parseIstante;

                var currentTableTitolo = $("<table />").addClass("table-title livrea"+factionstyle);
                //var contentTitolo = $("<tr />").append($("<td />").addClass("table-title-td logo-"+factionstyle+" titolo").text(titolo));
                //currentTableTitolo.append(contentTitolo);
                currentTableTitolo.append($("<tr />").append($("<td >"+riassunto+"</td>").addClass("table-alignl table-width35")));//.text(riassunto)));

                tableContainer.append(currentTableTitolo);
            }

        }
        multiTable.append(tableContainer);

        multiTable.append($("<div>").addClass("sakcriteria resultcriteria").text("Storico azioni"));
        var tableContainer = $("<table id='otheractions'/>").addClass("saktable-container");
        var arrayResult = data['storicoactions'];
        if(arrayResult == null || arrayResult.length == 0)
            tableContainer.append("<tr><th class='table-alignl table-width35'><span >Nessun risultato trovato</span></th></tr>");
        else
        {
            multiTable.append($("<a onclick=\"$('#otheractions').toggle();\" />").text("Visualizza"));

            for (i = 0; i < arrayResult.length; i++) {

                var cObj = arrayResult[i];


                var player = cObj.giocatore.player;
                var faction = cObj.giocatore.faction;
                var azione = cObj.azione;
                //var tipoazione = cObj.tipoazione;
                var parseDate = new Date(cObj.data+" "+cObj.ora);
                var dataazione = window.plugin.sak.dateFormat(Date.parse(parseDate), "dddd, dS mmmm, yyyy, h:MM:ss TT");

                var factionstyle = "nia";
                if(faction == 'R' || faction == 'RESISTANCE')
                    factionstyle = "res";
                else if(faction == 'E' || faction == 'ENLIGHTENED')
                    factionstyle = "enl";

                //<b>"+player+"</b> has just 
                azione = window.plugin.sak.replaceAlertMessage(azione,player);
                var riassunto = "<b>"+azione+"</b> at "+dataazione;//+" at "+parseIstante;

                var currentTableTitolo = $("<table />").addClass("table-title livrea"+factionstyle);
                //var contentTitolo = $("<tr />").append($("<td />").addClass("table-title-td logo-"+factionstyle+" titolo").text(titolo));
                //currentTableTitolo.append(contentTitolo);
                currentTableTitolo.append($("<tr />").append($("<td >"+riassunto+"</td>").addClass("table-alignl table-width35")));//.text(riassunto)));

                tableContainer.append(currentTableTitolo);
            }

        }
        multiTable.append(tableContainer);

        $(idcontainerresults).append(multiTable);

        $(idcontainerresults).addClass("sakbody");
    }

    window.plugin.sak.replaceAlertMessage = function(azione, player)
    {
        if(azione.indexOf("Your") !== -1)
        {
            azione = window.plugin.sak.replaceAll(azione,
                                                  "Your", "The");
        }

        return azione;
    }

    window.plugin.sak.renderSearchPortali = function(data, keysearch)
    {
        var idcontainerresults = "#"+window.plugin.sak.containerdatafromserver;
        var multiTable = $("<div class='container-current-result'/>");

        $(idcontainerresults).empty();
        $(idcontainerresults).append($("<span id='close' onclick=\"$('"+idcontainerresults+"').empty();$('"+idcontainerresults+"').hide()\">x</span>"));

        if(keysearch == '')
        {
            keysearch = 'qualsiasi portale';	
        }

        //creazione del table di riepilogo della ricerca
        var divCriteria = $("<div id='tbCriteria' />").addClass("sakcriteria resultcriteria").text("Risultati per "+keysearch);
        //tableCriteria.append("<tr />").append("<th />").addClass("sakcriteria resultcriteria").text("Risultati portali per il criterio "+keysearch);


        //creazione table dei risultati di ricerca
        var tableContainer = $("<table />").addClass("saktable-container");

        var linkreportistica = $("<a id='reportisticaportali'>").attr("value",
                                                                      "Scarica report").attr("onclick",
                                                                                             "window.plugin.sak.downloadblob()").addClass("sakbody")
        .text("Scarica report");

        var linkhidereport = $("<a id='removerisultatiportali'>").attr("value",
                                                                       "Rimuovi risultati").attr("onclick",
                                                                                                 "$('"+idcontainerresults+"').empty();$('"+idcontainerresults+"').hide()")
        .text("Rimuovi risultati").addClass("sakbody");

        divCriteria.append($("<br/>")).append(linkhidereport).append($("<br />")).append(linkreportistica);
        $(idcontainerresults).append(divCriteria);

        var arrayResult = data;

        for (i = 0; i < arrayResult.length; i++) {
            var cObj = arrayResult[i];

            var titolo = cObj.titolo;
            var indirizzo = cObj.indirizzo;
            var lat = cObj.datagis.lat;
            var lon = cObj.datagis.lon;
            var faction = cObj.giocatore.faction;
            var owner = cObj.giocatore.player;
            var capturetime = cObj.capturetimeformatted;

            var factionstyle = "nia";
            if(faction == 'R')
                factionstyle = "res";
            else if(faction == 'E')
                factionstyle = "enl";

            var currentTableTitolo = $("<table />").addClass("table-title livrea"+factionstyle);
            var contentTitolo = $("<tr />").append($("<td />").addClass("table-title-td logo-"+factionstyle+" titolo").text(titolo));
            currentTableTitolo.append(contentTitolo);
            currentTableTitolo.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").append($("<a onclick=\"$('#currentPortal"+i+"').toggle();\" />").text("Visualizza"))));

            var currentTableDataPortale =  $("<table id='currentPortal"+i+"'/>").addClass("table-content livrea"+factionstyle+" occorrenza");

            if(cObj.pathimage != "" && cObj.pathimage != undefined)
            {
                var currentTrDataImage = $("<tr />");
                var dataImage = $("<td colspan='2' />").append("<img width='150' src='"+cObj.pathimage+"' />");
                currentTrDataImage.append(dataImage);
                currentTableDataPortale.append(currentTrDataImage);
            }

            var currentTrDataOwner = $("<tr />");
            var dataOwner = $("<td />").addClass("table-alignl table-width35").text(owner);
            currentTrDataOwner.append(dataOwner);

            //var parseDate = new Date(capturetime);
            //capturetime = window.plugin.sak.dateFormat(Date.parse(capturetime)/*parseDate.toDateString()*/, "dddd, dS mmmm, yyyy, h:MM:ss TT");
            var dataCaptureTime = $("<td />").addClass("table-alignl table-width35").append(capturetime);
            currentTrDataOwner.append(dataCaptureTime);
            currentTableDataPortale.append(currentTrDataOwner);

            var currentTrDataIndirizzo = $("<tr />");
            var dataIndirizzo = $("<td />").addClass("table-alignl table-width35").text(indirizzo);
            currentTrDataIndirizzo.append(dataIndirizzo);

            var linkIntel = $("<a />").addClass("saka").attr("onclick","window.plugin.sak.selectPortalByLatLng("+lat+","+ lon+");return false").attr("href","/intel?ll="+lat+","+lon+"&z=15").text("Intel Map");
            var dataIntelMap = $("<td />").addClass("table-alignl table-width35").append(linkIntel);
            currentTrDataIndirizzo.append(dataIntelMap);
            currentTableDataPortale.append(currentTrDataIndirizzo);

            var currentTrDataGmaps = $("<tr />");
            currentTrDataGmaps.append($("<td />").addClass("table-alignl table-width35").text("["+lat+"]["+lon+"]"));
            var linkGmaps = $("<a />").addClass("saka").attr("target", "blank").attr("href","https://maps.google.com/maps?q="+lat+","+lon).text("Gmaps");
            var dataGmaps = $("<td />").addClass("table-alignl table-width35").append(linkGmaps);
            currentTrDataGmaps.append(dataGmaps);
            currentTableDataPortale.append(currentTrDataGmaps);

            var linkStorico = $(
                "<a id='inputlifecapture'>")
            .attr(
                "value",
                window.plugin.sak.namelifecapture)
            .attr(
                "onclick",
                "window.plugin.sak.getLifeCapture('"+cObj.guid+"');if(window.isSmartphone())$('#inputlifecapture').hide()")
            .text(
                window.plugin.sak.namelifecapture);

            if (!window.isSmartphone())
                currentTableDataPortale.append($("<tr />").append($("<td />").addClass("table-alignl table-width35").append(linkStorico)));						


            tableContainer.append(currentTableTitolo);
            tableContainer.append(currentTableDataPortale.hide());

        }



        //$(idcontainerresults).hide();
        //$(idcontainerresults).empty();

        multiTable.append(tableContainer);
        $(idcontainerresults).append(multiTable);

        $(idcontainerresults).addClass("sakbody");

    }	

	window.plugin.sak.players = [];
	
	window.plugin.sak.boxplayers = null;
	
    window.plugin.sak.listaPlayers = function(idInputText) {
	
            var tipo = "ListaPlayers";
            window.plugin.sak.countcalls = window.plugin.sak.countcalls + 1;
            window.plugin.sak.ledSak = 'green';
            $("#countcalls").css('color',window.plugin.sak.ledSak);
            $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

            var cipher = window.plugin.sak.getCipher();

            //keysearch = window.plugin.sak.chat.securityReplace(keysearch);
			var valueinput = $("#"+idInputText).val();
			
            console.info('Recupero lista players...');
            var inforequest = $
            .post(
                window.plugin.sak.endpointsak,
                {
                    context : "listaplayers",
                    objplayer : JSON.stringify(window.PLAYER),
                    hashscript : cipher,
					searcher : valueinput
                },
                function(data) {

                    console.info('Recupero lista players completato!!');
                    console.info(data);
					
					window.plugin.sak.players = data.payload;
					var availablePlayer = [];
					$.each(window.plugin.sak.players, function(i,cP){
						availablePlayer.push(cP.player);
					});
					
					$("#boxplayer-"+idInputText).remove();
					window.plugin.sak.boxplayers = $("<div name='listPlayers' id='boxplayer-"+idInputText+"' />");
					//window.plugin.sak.boxplayers.empty();

					$.each(window.plugin.sak.players, function(g,cObj) {
						var value = cObj.player;
						var tagLi = $("<p>"+value+"</p>").show();
						window.plugin.sak.boxplayers.append(tagLi);
					});
					$("#"+idInputText).after(window.plugin.sak.boxplayers);

					//window.plugin.sak.renderAutocomplete(idInputText,availablePlayer);
					
					/*$("#"+idInputText).autocomplete({
						source: availablePlayer
					});*/
	
					
					//var tagBox = window.plugin.sak.boxplayers.clone();
					//tagBox.attr('id',   "boxplayer-"+idInputText);
					
                    window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                    $('#countcalls').html(
                        window.plugin.sak.countcalls);
                    if(window.plugin.sak.countcalls > 0)
                        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

                })
            .fail(
                function(xhr, textStatus, errorThrown) {
                    console.log(xhr.statusText);
                    console.log(xhr.responseText);
                    console.log(textStatus);
                    console.error(error);
                    window.plugin.sak.getFailError(xhr,textStatus, "Recupero players");
                    window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                    $('#countcalls').html(
                        window.plugin.sak.countcalls);
                    if(window.plugin.sak.countcalls > 0)
                        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);
                    //alert
                    console.error("Anomalia di comunicazione! Recupero players fallita");
                });
	}

    window.plugin.sak.consultaDeploySpeciali = function(e) {

        var characterCode; // literal character code will be stored in this
        // variable

        if(e != undefined)
        {
            if (e && e.which) { // if which property of event object is supported
                // (NN4)
                e = e
                characterCode = e.which; // character code is contained in NN4's
                // which property
            } else {
                e = event
                characterCode = e.keyCode; // character code is contained in IE's
                // keyCode property
            }
        }
        else
            characterCode = 13;

        if (characterCode == 13) { // if character code is equal to ascii 13
            // (if enter key)
            // alert("TODO: da implementare . Titolo da
            // cercare"+$('#inputsearchportal').val());

            var keysearch = $('#inputdeployspeciali').val();

            var msgconsole = "Ricerca oggetti speciali per qualsiasi giocatore...";
            if(keysearch != '')
                msgconsole = "Ricerca oggetti speciali per " + keysearch + "...";

            console.debug(msgconsole);
            $('#esitoclient').html(
                msgconsole);

            var tipo = "ConsultaSpecialDeploy";
            window.plugin.sak.countcalls = window.plugin.sak.countcalls + 1;
            window.plugin.sak.ledSak = 'green';
            $("#countcalls").css('color',window.plugin.sak.ledSak);
            $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

            var cipher = window.plugin.sak.getCipher();

            //keysearch = window.plugin.sak.chat.securityReplace(keysearch);

            var inforequest = $
            .post(
                window.plugin.sak.endpointsak,
                {
                    context : "consultadeployspeciali",
                    objplayer : JSON.stringify(window.PLAYER),
                    player : keysearch,
                    hashscript : cipher
                },
                function(data) {

                    console.info('Ricerca deploy speciali eseguita con successo!!');
                    console.info(data);
                    $('#esitoclient').html(
                        'Ricerca eseguita con successo!!');

                    window.plugin.sak.currentData = data.payload.report;
                    //rendering html per visualizzare i risultati della ricerca
                    window.plugin.sak.renderConsultaOggettiSpeciali(data.payload.json, keysearch);

                    //-------------- controllo visibilità finestre risultati----------------
                    $("#"+window.plugin.sak.containerdatafromserver).show();
                    //-------------- controllo visibilità finestre risultati----------------

                    $('#inputdeployspeciali').val('');
                    window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                    $('#countcalls').html(
                        window.plugin.sak.countcalls);
                    if(window.plugin.sak.countcalls > 0)
                        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

                    //var callback = function(){ $('#esitoclient').html('idle...');};
					var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
                    window.plugin.sak.mutexSak(callback);
                    /*var callback2 = function(){ $('#esitoclient').html('');};
								window.plugin.sak.mutexSak(callback2,5);*/

                })
            .fail(
                function(xhr, textStatus, errorThrown) {
                    console.log(xhr.statusText);
                    console.log(xhr.responseText);
                    console.log(textStatus);
                    console.error(error);
                    window.plugin.sak.getFailError(xhr,textStatus, "Recupero oggetti speciali");
                    window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                    $('#countcalls').html(
                        window.plugin.sak.countcalls);
                    if(window.plugin.sak.countcalls > 0)
                        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

                    //var callback = function(){ $('#esitoclient').html('idle...');};
					var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
                    window.plugin.sak.mutexSak(callback);

                    //alert
                    console.error("Anomalia di comunicazione! Ricerca oggetti speciali fallita");
                });
        }
        /*
		 * else{ }
		 */
        return false; // return false to the event handler
    }

    window.plugin.sak.consultaGuardians = function(e) {

        var characterCode; // literal character code will be stored in this
        // variable

        if(e != undefined)
        {
            if (e && e.which) { // if which property of event object is supported
                // (NN4)
                e = e
                characterCode = e.which; // character code is contained in NN4's
                // which property
            } else {
                e = event
                characterCode = e.keyCode; // character code is contained in IE's
                // keyCode property
            }
        }
        else
            characterCode = 13;

        if (characterCode == 13) { // if character code is equal to ascii 13
            // (if enter key)
            var currentLoc = null;
            //if (!window.isSmartphone())
            currentLoc	= window.plugin.sak.gisCurrentMap();

            // alert("TODO: da implementare . Titolo da
            // cercare"+$('#inputsearchportal').val());

            var keysearch = $('#inputconsultaguardians').val();

            var msgconsole = "Ricerca guardians per qualsiasi giocatore...";
            if(keysearch != '')
                msgconsole = "Ricerca guardians per " + keysearch + "...";

            console.debug(msgconsole);
            $('#esitoclient').html(
                msgconsole);

            var tipo = "ConsultaGuardians";
            window.plugin.sak.countcalls = window.plugin.sak.countcalls + 1;
            window.plugin.sak.ledSak = 'green';
            $("#countcalls").css('color',window.plugin.sak.ledSak);
            $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

            var cipher = window.plugin.sak.getCipher();

            //keysearch = window.plugin.sak.chat.securityReplace(keysearch);

            if(window.plugin.sak.prossimitaguardian)
                window.plugin.sak.raggioProssimitaGuardians = $("#inputraggioprossimitaguardians").val();

            var inforequest = $
            .post(
                window.plugin.sak.endpointsak,
                {
                    context : "consultaguardians",
                    objplayer : JSON.stringify(window.PLAYER),
                    player : keysearch,
                    hashscript : cipher,
                    currentLocation : JSON.stringify(currentLoc),
                    prossimitaguardian: window.plugin.sak.prossimitaguardian,
                    raggioProssimita : window.plugin.sak.raggioProssimitaGuardians
                },
                function(data) {

                    console.info('Ricerca guardians eseguita con successo!!');
                    console.info(data);
                    $('#esitoclient').html(
                        'Ricerca eseguita con successo!!');

                    window.plugin.sak.currentData = data.payload.report;
                    //rendering html per visualizzare i risultati della ricerca
                    window.plugin.sak.renderConsultaGuardians(data.payload.json, keysearch);

                    //-------------- controllo visibilità finestre risultati----------------
                    $("#"+window.plugin.sak.containerdatafromserver).show();
                    //-------------- controllo visibilità finestre risultati----------------

                    // var d = new Date();
                    // var filename =
                    // keysearch+"_guardians_"+"_"+d.getTime()+".csv";

                    // alert(inforequest.getResponseHeader('Content-Disposition'));

                    /*
								 * var blob=new Blob([data]); var
								 * link=document.createElement('a');
								 * link.href=window.URL.createObjectURL(blob);
								 * link.download=filename; link.click();
								 */
                    /*var blob = new Blob([ plaintext ], {
									type : "application/plain"
								});
								var url = window.URL.createObjectURL(blob);
								a = document.createElement('a');
								a.href = url;
								a.download = filename;
								document.body.appendChild(a);
								a.click();
								setTimeout(function() {
									document.body.removeChild(a);
									window.URL.revokeObjectURL(url);
								}, 100);*/

                    $('#inputconsultaguardians').val('');
                    window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                    $('#countcalls').html(
                        window.plugin.sak.countcalls);
                    if(window.plugin.sak.countcalls > 0)
                        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

                    //var callback = function(){ $('#esitoclient').html('idle...');};
					var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
                    window.plugin.sak.mutexSak(callback);
                    /*var callback2 = function(){ $('#esitoclient').html('');};
							window.plugin.sak.mutexSak(callback2,5);*/

                })
            .fail(
                function(xhr, textStatus, errorThrown) {
                    console.log(xhr.statusText);
                    console.log(xhr.responseText);
                    console.log(textStatus);
                    console.error(error);
                    window.plugin.sak.getFailError(xhr,textStatus, "Recupero guardians");
                    window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                    $('#countcalls').html(
                        window.plugin.sak.countcalls);
                    if(window.plugin.sak.countcalls > 0)
                        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

                    //var callback = function(){ $('#esitoclient').html('idle...');};
					var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
                    window.plugin.sak.mutexSak(callback);
                    //alert
                    console.error("Anomalia di comunicazione! Ricerca guardians fallita");
                });
        }
        /*
		 * else{ }
		 */
        return false; // return false to the event handler
    }

    // chiama il servizio per il recupero delle attività del giocatore cercato
    window.plugin.sak.getIstantanea = function(pidreport) {

        // alert("TODO: da implementare . Titolo da
        // cercare"+$('#inputsearchportal').val());

        var tipo = "Istantanea";

        console.debug("Recupero report istantanea codice : " + pidreport + "...");
        $('#esitoclient').html(
            "Recupero report istantanea codice " + pidreport
            + " in corso...");
        window.plugin.sak.countcalls = window.plugin.sak.countcalls + 1;
        window.plugin.sak.ledSak = 'green';
        $("#countcalls").css('color',window.plugin.sak.ledSak);
        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

        var cipher = window.plugin.sak.getCipher();

        var inforequest = $
        .post(
            window.plugin.sak.endpointsak,
            {
                context : "istantanea",
                objplayer : JSON.stringify(window.PLAYER),
                idreport : pidreport,
                hashscript : cipher
            },
            function(data) {

                var filename = data.filename;
                var idreport = data.idreport;
                var plaintext = data.plaintext;
                var resultData = data.resultData;
                console.info(resultData);

                console
                    .info('Recupero istantanea eseguito con successo!!');
                console.info(data);

                $('#esitoclient').html(
                    'Recupero report eseguito con successo!!');

                // var d = new Date();
                // var filename =
                // pidreport+"_istantanea_"+"_"+d.getTime()+".csv";

                // alert(inforequest.getResponseHeader('Content-Disposition'));

                /*
							 * var blob=new Blob([plaintext]); //var blob=new
							 * Blob([data]); var
							 * link=document.createElement('a');
							 * link.href=window.URL.createObjectURL(blob);
							 * link.download=filename; link.click();
							 */

                var blob = new Blob([ plaintext ], {
                    type : "application/plain"
                });
                var url = window.URL.createObjectURL(blob);
                a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                setTimeout(function() {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 100);
                window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                $('#countcalls').html(window.plugin.sak.countcalls);
                if(window.plugin.sak.countcalls > 0)
                    $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

                //var callback = function(){ $('#esitoclient').html('idle...');};
				var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
                window.plugin.sak.mutexSak(callback);
                /*var callback2 = function(){ $('#esitoclient').html('');};
							window.plugin.sak.mutexSak(callback2,5);*/

            })
        .fail(
            function(xhr, textStatus, errorThrown) {
                console.log(xhr.statusText);
                console.log(xhr.responseText);
                console.log(textStatus);
                console.error(error);
                window.plugin.sak.getFailError(xhr,textStatus, "Recupero portali");
                window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                $('#countcalls').html(window.plugin.sak.countcalls);
                if(window.plugin.sak.countcalls > 0)
                    $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

                //var callback = function(){ $('#esitoclient').html('idle...');};
				var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
                window.plugin.sak.mutexSak(callback);
                //alert
                console.error("Anomalia di comunicazione! Ricerca portale fallita");

            });

        /*
		 * else{ }
		 */
        return true; // return false to the event handler
    }

    // chiama il servizio per il recupero delle attività del giocatore cercato
    window.plugin.sak.consultaAttivita = function(e) {

        var characterCode; // literal character code will be stored in this
        // variable

        if(e != undefined)
        {
            if (e && e.which) { // if which property of event object is supported
                // (NN4)
                e = e
                characterCode = e.which; // character code is contained in NN4's
                // which property
            } else {
                e = event
                characterCode = e.keyCode; // character code is contained in IE's
                // keyCode property
            }
        }
        else
            characterCode = 13;

        if (characterCode == 13) { // if character code is equal to ascii 13
            // (if enter key)

            // alert("TODO: da implementare . Titolo da
            // cercare"+$('#inputsearchportal').val());

           

            var keysearch = $('#inputconsultaattivita').val();
            var periodotemporale = $("#selectDiffGiorni").val();
           
			window.plugin.sak.getAttivita(keysearch,periodotemporale);
		    /*
			console.debug("Ricerca attività del player " + keysearch + "...");
            $('#esitoclient').html(
                "Ricerca attività del player " + keysearch + "...");
            window.plugin.sak.countcalls = window.plugin.sak.countcalls + 1;
            window.plugin.sak.ledSak = 'green';
            $("#countcalls").css('color',window.plugin.sak.ledSak);
            $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

            var cipher = window.plugin.sak.getCipher();

            //keysearch = window.plugin.sak.chat.securityReplace(keysearch);

            var inforequest = $
            .post(
                window.plugin.sak.endpointsak,
                {
                    context : "consultalogger",
                    objplayer : JSON.stringify(window.PLAYER),
                    players : keysearch,
                    periodogiorni : periodotemporale,
                    hashscript : cipher
                },
                function(data) {

                    console.info('Ricerca attivita giocatore eseguita con successo!!');
                    console.info(data);
                    $('#esitoclient').html(
                        'Ricerca eseguita con successo!!');

                    window.plugin.sak.currentData = data.payload.report;

                    //rendering html per visualizzare i risultati della ricerca
                    window.plugin.sak.renderConsultaAttivita(data.payload.json, keysearch);

                    //-------------- controllo visibilità finestre risultati----------------
                    $("#"+window.plugin.sak.containerdatafromserver).show();
                    //-------------- controllo visibilità finestre risultati----------------

                    //window.plugin.sak.downloadblob();

                    $('#inputconsultaattivita').val('');
                    window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                    $('#countcalls').html(
                        window.plugin.sak.countcalls);
                    if(window.plugin.sak.countcalls > 0)
                        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

                    //var callback = function(){ $('#esitoclient').html('idle...');};
					var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
                    window.plugin.sak.mutexSak(callback);
                })
            .fail(
                function(xhr, textStatus, errorThrown) {
                    console.log(xhr.statusText);
                    console.log(xhr.responseText);
                    console.log(textStatus);
                    console.error(error);
                    window.plugin.sak.getFailError(xhr,textStatus, "Recupero attività giocatore");
                    //alert
                    console.error("Anomalia di comunicazione! Ricerca attività fallita");
                    window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                    $('#countcalls').html(
                        window.plugin.sak.countcalls);
                    if(window.plugin.sak.countcalls > 0)
                        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

                    //var callback = function(){ $('#esitoclient').html('idle...');};
					var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
                    window.plugin.sak.mutexSak(callback);

                });
				*/
        }
        /*
		 * else{ }
		 */
        return false; // return false to the event handler
    }
	
	window.plugin.sak.getAttivita = function(keysearch, periodotemporale)
	{
			var tipo = "AttivitaPlayer";
			console.debug("Ricerca attività del player " + keysearch + "...");
            $('#esitoclient').html(
                "Ricerca attività del player " + keysearch + "...");
            window.plugin.sak.countcalls = window.plugin.sak.countcalls + 1;
            window.plugin.sak.ledSak = 'green';
            $("#countcalls").css('color',window.plugin.sak.ledSak);
            $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

            var cipher = window.plugin.sak.getCipher();

            //keysearch = window.plugin.sak.chat.securityReplace(keysearch);

            var inforequest = $
            .post(
                window.plugin.sak.endpointsak,
                {
                    context : "consultalogger",
                    objplayer : JSON.stringify(window.PLAYER),
                    players : keysearch,
                    periodogiorni : periodotemporale,
                    hashscript : cipher
                },
                function(data) {

                    console.info('Ricerca attivita giocatore eseguita con successo!!');
                    console.info(data);
                    $('#esitoclient').html(
                        'Ricerca eseguita con successo!!');

                    window.plugin.sak.currentData = data.payload.report;

                    //rendering html per visualizzare i risultati della ricerca
                    window.plugin.sak.renderConsultaAttivita(data.payload.json, keysearch);

                    //-------------- controllo visibilità finestre risultati----------------
                    $("#"+window.plugin.sak.containerdatafromserver).show();
                    //-------------- controllo visibilità finestre risultati----------------

                    //window.plugin.sak.downloadblob();

                    $('#inputconsultaattivita').val('');
                    window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                    $('#countcalls').html(
                        window.plugin.sak.countcalls);
                    if(window.plugin.sak.countcalls > 0)
                        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

                    //var callback = function(){ $('#esitoclient').html('idle...');};
					var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
                    window.plugin.sak.mutexSak(callback);
                    /*var callback2 = function(){ $('#esitoclient').html('');};
								window.plugin.sak.mutexSak(callback2,5);*/

                })
            .fail(
                function(xhr, textStatus, errorThrown) {
                    console.log(xhr.statusText);
                    console.log(xhr.responseText);
                    console.log(textStatus);
                    console.error(error);
                    window.plugin.sak.getFailError(xhr,textStatus, "Recupero attività giocatore");
                    //alert
                    console.error("Anomalia di comunicazione! Ricerca attività fallita");
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

    // chiama il servizio per cercare i portali con la chiave di ricerca sul
    // titolo
    window.plugin.sak.searchPortals = function(e) {

        var characterCode; // literal character code will be stored in this
        // variable

        if(e != undefined)
        {
            if (e && e.which) { // if which property of event object is supported
                // (NN4)
                e = e
                characterCode = e.which; // character code is contained in NN4's
                // which property
            } else {
                e = event
                characterCode = e.keyCode; // character code is contained in IE's
                // keyCode property
            }
        }
        else
            characterCode = 13;

        if (characterCode == 13) { // if character code is equal to ascii 13
            // (if enter key)
            var currentLoc = null;
            //if (!window.isSmartphone())
            currentLoc	= window.plugin.sak.gisCurrentMap();

            var keysearch = $('#inputsearchportal').val();

            var msgconsole = "Ricerca portali con qualsiasi titolo...";
            if(keysearch != '')
                msgconsole = "Ricerca portali col titolo " + keysearch + "...";

            console.debug(msgconsole);
            $('#esitoclient').html(msgconsole);

            var tipo = "RicercaPortali";

            window.plugin.sak.countcalls = window.plugin.sak.countcalls + 1;
            window.plugin.sak.ledSak = 'green';
            $("#countcalls").css('color',window.plugin.sak.ledSak);
            $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

            var cipher = window.plugin.sak.getCipher();



            //keysearch = window.plugin.sak.chat.securityReplace(keysearch);

            if(window.plugin.sak.prossimitaportali)
                window.plugin.sak.raggioProssimitaPortali = $("#inputraggioprossimitaportali").val();

            var inforequest = $
            .post(
                window.plugin.sak.endpointsak,
                {
                    context : "searchportale",
                    objplayer : JSON.stringify(window.PLAYER),
                    titolo : keysearch,
                    hashscript : cipher,
                    currentLocation : JSON.stringify(currentLoc),
                    prossimitaportali : window.plugin.sak.prossimitaportali,
                    raggioProssimita : window.plugin.sak.raggioProssimitaPortali
                },
                function(data) {

                    window.plugin.sak.currentData = data.payload.report;

                    console.info('Ricerca portali eseguita con successo!!');
                    console.info(data);
                    $('#esitoclient').html(
                        'Ricerca eseguita con successo!!');

                    //rendering html per visualizzare i risultati della ricerca
                    window.plugin.sak.renderSearchPortali(data.payload.json, keysearch);

                    //-------------- controllo visibilità finestre risultati----------------
                    $("#"+window.plugin.sak.containerdatafromserver).show();
                    //-------------- controllo visibilità finestre risultati----------------

                    $('#inputsearchportal').val('');
                    window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                    $('#countcalls').html(
                        window.plugin.sak.countcalls);
                    if(window.plugin.sak.countcalls > 0)
                        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

                    //var callback = function(){ $('#esitoclient').html('idle...'); };
					var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
                    window.plugin.sak.mutexSak(callback);								
                    /*
								var callback2 = function(){ $('#esitoclient').html('');};
								window.plugin.sak.mutexSak(callback2,5);
								*/

                })
            .fail(
                function(xhr, textStatus, errorThrown) {
                    console.log(xhr.statusText);
                    console.log(xhr.responseText);
                    console.log(textStatus);
                    console.error(error);
                    window.plugin.sak.getFailError(xhr,textStatus, "Recupero portali");
                    window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                    $('#countcalls').html(
                        window.plugin.sak.countcalls);
                    if(window.plugin.sak.countcalls > 0)
                        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

                    //var callback = function(){ $('#esitoclient').html('idle...'); };
					var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
                    window.plugin.sak.mutexSak(callback);								
                    //alert
                    console.error("Si e' verificato un errore di comunicazione! Ricerca portale fallita");
                });
        }
        /*
		 * else{ }
		 */
        return false; // return false to the event handler
    }

    // chiama il servizio per ottenere la lista dei captured sul portale
    // selezionato
    window.plugin.sak.getLifeCapture = function(cGuid, cTrackPlayer ) {

        if(cGuid === undefined)
        {
            data = window.plugin.sak.datiPortaleCorrente;
            cGuid = data.guid;
        }

        if (cGuid === null) {
            alert("Nessun portale selezionato!");
            return false;
        }

        console.debug("Richiesta storico...");// + title);
        if(cTrackPlayer != null)
        {
            $('#esitoclient').html('Estrazione azioni sul giocatore '+cTrackPlayer+' in corso...');
        }
        else
        {
            $('#esitoclient').html('Richiesta storico in corso...');
        }

        var tipo = "StoricoPortale";

        var address = "attualmente non disponibile";// p.descriptiveText.map.ADDRESS;
        window.plugin.sak.countcalls = window.plugin.sak.countcalls + 1;
        window.plugin.sak.ledSak = 'green';
        $("#countcalls").css('color',window.plugin.sak.ledSak);
        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

        var cipher = window.plugin.sak.getCipher();

        var inforequest = $
        .post(
            window.plugin.sak.endpointsak,
            {
                context : "lifecapture",
                objplayer : JSON.stringify(window.PLAYER),
                guid : cGuid,
                trackplayer : cTrackPlayer,
                hashscript : cipher
            },
            function(data) {

                window.plugin.sak.currentData = data;


                $("#inputlifecapture").attr("value",
                                            window.plugin.sak.namelifecapture);
                console.info("Storico del portale recuperato con successo.");
                console.info(data);

                $('#esitoclient').html(
                    'Storico recuperato con successo');



                var titolo = data.payload.json.portale.titolo;

                //rendering html per visualizzare i risultati della ricerca
                window.plugin.sak.renderLifeCapture(data.payload.json);

                //-------------- controllo visibilità finestre risultati----------------
                $("#"+window.plugin.sak.containerdatafromserver).show();
                //-------------- controllo visibilità finestre risultati----------------

                window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                $('#countcalls').html(window.plugin.sak.countcalls);
                if(window.plugin.sak.countcalls > 0)
                    $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

                //var callback = function(){ $('#esitoclient').html('idle...'); };
                var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
				window.plugin.sak.mutexSak(callback);								
                /*var callback2 = function(){ $('#esitoclient').html('');};
							window.plugin.sak.mutexSak(callback2,5);*/

            })
        .fail(
            function(xhr, textStatus, errorThrown) {
                console.log(xhr.statusText);
                console.log(xhr.responseText);
                console.log(textStatus);
                console.error(error);
                window.plugin.sak.getFailError(xhr,textStatus, "Recupero storico");
                window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                $('#countcalls').html(window.plugin.sak.countcalls);
                if(window.plugin.sak.countcalls > 0)
                    $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

                //var callback = function(){ $('#esitoclient').html('idle...'); };
                var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
				window.plugin.sak.mutexSak(callback);								
                //alert
                console.error("Anomalia di comunicazione! Storico portale non recuperato");
            });

    }

    /*
	Sezioni disponibili:
	ricercaattivita
	ricercaguardian
	ricercaportali
	ricercaoggettispeciali

	*/
    window.plugin.sak.selectRicerca = function()
    {
        var sezione = $( "#ricercasection option:selected" ).val();

        console.log("Ricerca scelta: "+sezione);
        window.plugin.sak.sezionericerca	 = sezione;

        if(window.plugin.sak.sezionericerca == '')
        {
            $("#containerSearchPortali").hide();
            $("#containerSearchOggettiSpeciali").hide();
            $("#containerSearchAttivita").hide();
            $("#containerSearchGuardians").hide();

        }
        else if(window.plugin.sak.sezionericerca == 'containerSearchPortali')
        {
            $("#containerSearchPortali").show();

            $("#containerSearchOggettiSpeciali").hide();
            $("#containerSearchAttivita").hide();
            $("#containerSearchGuardians").hide();

        }
        else if(window.plugin.sak.sezionericerca == 'containerSearchOggettiSpeciali')
        {
            $("#containerSearchOggettiSpeciali").show();

            $("#containerSearchPortali").hide();
            $("#containerSearchAttivita").hide();
            $("#containerSearchGuardians").hide();
        }
        else if(window.plugin.sak.sezionericerca == 'containerSearchAttivita')
        {
            $("#containerSearchAttivita").show();

            $("#containerSearchOggettiSpeciali").hide();
            $("#containerSearchPortali").hide();
            $("#containerSearchGuardians").hide();
        }
        else if(window.plugin.sak.sezionericerca == 'containerSearchGuardians')
        {
            $("#containerSearchGuardians").show();

            $("#containerSearchAttivita").hide();
            $("#containerSearchOggettiSpeciali").hide();
            $("#containerSearchPortali").hide();
        }

    }

    /*
	Qui di seguito sono implementate funzionalità legate al censimento automatico e alla visualizzazione di dati dal database su mappa!
*/
    window.plugin.sak.getPortalLinks = function(guid) {

        var links = { in: [], out: [] };

        $.each(window.links, function(g,l) {
            var d = l.options.data;

            if (d.oGuid == guid) {
                links.out.push(g);
            }
            if (d.dGuid == guid) {
                links.in.push(g);
            }
        });

        return links;
    }

    /*
		Metodo per il recupero dei field presenti in mappa
		Per ora non è utilizzato!
	*/
    window.plugin.sak.getCurrentFields = function()
    {
        for (var guid in window.fields) {
            var f = fields[guid];

            // NOTE: our geodesic polys can have lots of intermediate points. the bounds calculation hasn't been optimised for this
            // so can be particularly slow. a simple bounds check based on corner points will be good enough for this check
            var lls = f.getLatLngs();
            var fieldBounds = L.latLngBounds([lls[0],lls[1]]).extend(lls[2]);

            console.log(f);
            /*if (!bounds.intersects(fieldBounds)) {
			  this.deleteFieldEntity(guid);
			  count++;
			}*/
        }
        //		console.log('Render: deleted '+count+' fields by bounds');
    }

    //---------------------- procedure per estrapolare i cicli temporali dei check point --------------------------------

    // use own namespace for plugin
    window.plugin.sak.scoreCycleTimes = function() {};

    window.plugin.sak.scoreCycleTimes.CHECKPOINT = 5*60*60; //5 hours per checkpoint
    window.plugin.sak.scoreCycleTimes.CYCLE = 7*25*60*60; //7 25 hour 'days' per cycle


    window.plugin.sak.scoreCycleTimes.setup  = function() {

    };

    window.plugin.sak.scoreCycleTimes.getScoreCycle = function() {

		//window.plugin.sak.handshakenia();

        // checkpoint and cycle start times are based on a simple modulus of the timestamp
        // no special epoch (other than the unix timestamp/javascript's 1970-01-01 00:00 UTC) is required

        // when regional scoreboards were introduced, the first cycle would have started at 2014-01-15 10:00 UTC - but it was
        // a few checkpoints in when scores were first added

        var now = new Date().getTime();

        var cycleStart = Math.floor(now / (window.plugin.sak.scoreCycleTimes.CYCLE*1000)) * (window.plugin.sak.scoreCycleTimes.CYCLE*1000);
        var cycleEnd = cycleStart + window.plugin.sak.scoreCycleTimes.CYCLE*1000;

        var checkpointStart = Math.floor(now / (window.plugin.sak.scoreCycleTimes.CHECKPOINT*1000)) * (window.plugin.sak.scoreCycleTimes.CHECKPOINT*1000);
        var checkpointEnd = checkpointStart + window.plugin.sak.scoreCycleTimes.CHECKPOINT*1000;


        var formatRow = function(label,time) {
            var timeStr = unixTimeToString(time,true);
            timeStr = timeStr.replace(/:00$/,''); //FIXME: doesn't remove seconds from AM/PM formatted dates

            return '<tr><td>'+label+'</td><td>'+timeStr+'</td></tr>';
        };

        var html = '<table>'
        + formatRow('Cycle start', cycleStart)
        + formatRow('Previous checkpoint', checkpointStart)
        + formatRow('Next checkpoint', checkpointEnd)
        + formatRow('Cycle end', cycleEnd)
        + '</table>';

        var result = {inizioCiclo: cycleStart, precedenteCheckpoint: checkpointStart, successivoCheckpoint: checkpointEnd, fineCiclo: cycleEnd};

        //$('#score_cycle_times_display').html(html);

        alert("Dati cicli checkpoint attuali: <br/>"+html);

        return result;
        //setTimeout ( window.plugin.sak.scoreCycleTimes.update, checkpointEnd-now);
    };

    // ------------------------
    // ------------------------
    // ------------------------
    // ------------------------


    //-----------------------------------------------
    //-----------------------------------------------
    //Metodi di setup e configurazione
    //-----------------------------------------------
    //-----------------------------------------------

    //Costanti parametriche del Sak Client
    window.plugin.sak.versione = "definita dal setup SAK";	

    window.plugin.sak.nameenablegis = "Attiva ambiente gis";
    window.plugin.sak.enableSakaction = false;
    window.plugin.sak.nameenableSakaction = "Apri console Sakaction";
    window.plugin.sak.enableSakoogle = false;
    window.plugin.sak.nameenablesakoogle = "Apri console Sakoogle";
    window.plugin.sak.enableSakavanzate = false;
    window.plugin.sak.nameenablesakavanzate = "Apri console Sakadvance";

    //variabile di attivazione ambiente gis
    //di default l'intel è impostata con la visualizzazione originale
    //l'attivazione della visualizzazione gis deve prevedere la seguente logica di regole:
    // a) un parametro booleano discrimina i due ambienti . Solo l'ambiente gis avrà delle interazioni, mentre l'ambiente originale avrà il minor numero di referenze possibili
    // b) l'attivazione dell'ambiente gis deve prevedere un evento di default che in futuro potrà essere facilmente modificabile
    //		il default della prima release prevede il rendering costante di tutti i pallozzi gis. A prescindere se avviene una interazione automatica o manuale
    // c) a fronte del punto b l'attivazione dell'ambiente gis a fine caricamento visualizza tutti i portali riconosciuti dal sak indipendentemente dal periodo di ultimo censimento
    //		il rendering è colorato a seconda il periodo.
    // d) qualsiasi interazione di click manuale o automatico sia in lettura che scrittura, il rendering è attivato 
    // e) l'opzione rimuovi portali dal layer si limita a "cancellare" la lavagna, avendo il rendering automatico sempre attivo
    // f) il punto f riprende quanto indicato al punto a, ossia se avviene l'attivazione dell'ambiente originale, avviene il reset della lavagna come al punto e con il rendering disattivato fino a quando non viene riattivato l'ambiente gis
    window.plugin.sak.enableSakGIS = false;
    window.plugin.sak.categoriaSakGis = null;

    //qui sono elencati tutti i portali non censiti dal SAK e che verranno interrogati automaticamente
    window.plugin.sak.portaliNonCensiti = {};
    window.plugin.sak.portaliToRegister = {};
    window.plugin.sak.caratteristichePortali = {};
    window.plugin.sak.tracciamentoPlayer = {};
    window.plugin.sak.incisivitaPlayer = {};
	
	window.plugin.sak.mappingLngLatTematize = {};
	


    window.plugin.sak.portaliToMultiSend = [];

    window.plugin.sak.nameinvia = "In attesa...";
    window.plugin.sak.namescanportals = "Esegui scan sui portali censiti dal SAK";
    window.plugin.sak.resetreports = "Rimuovi reports";
    window.plugin.sak.namescaricareport = "Ottieni report";
    window.plugin.sak.namesuspendreg = "Sospendi registrazione";
    window.plugin.sak.namemulticallloggerchat = "Invia actions al server ad ogni scrollata";
    window.plugin.sak.namebuilderwaypoints = "Calcola percorso di navigazione";
    window.plugin.sak.nameautocompletenickname = "Disabilita il completamento del nickname in chat";
    window.plugin.sak.nameoverridemaxtsgetplext = "Richiedi azioni di gioco da una data specifica";

    window.plugin.sak.namesendmessagechat= "Anti GAFFE. Disabilita l'invio di messaggi in chat";
    window.plugin.sak.nameclearchat= "Svuota le azioni di gioco nella chat";
    window.plugin.sak.nameguardiansvirus = "Recupera lista guardians presi da virus";
    window.plugin.sak.namelifecapture = "Storico azioni del portale";
    window.plugin.sak.datiPortaleCorrente;
    // attiva il check per stampare sulla chat all il contentsend effettivamente
    // inviato, pronto per essere accodatoalle richieste nia successive.
    // lo scopo è permettere di navigare in profondità il log, rimuovendo le
    // azioni più recenti.
    // la modalità è consigliabile attivarla con cautela
    window.plugin.sak.autoSendOnScroll;
    window.plugin.sak.autoSendOnChangeBB;
    window.plugin.sak.countcalls = 0;
    window.plugin.sak.countniacalls = 0;
    window.plugin.sak.countiitccalls = 0;
    window.plugin.sak.countcallsgis = 0;
    window.plugin.sak.countdetailportal = 0;
    window.plugin.sak.countcallsactions = 0;
    window.plugin.sak.countportaldetailcalls  = 0;


    window.plugin.sak.labelTitle = "SAK Tools Desktop";
    window.plugin.sak.disclaimer = '<i>This site and the scripts are not officially affiliated with Ingress or Niantic Labs at Google. Using these scripts is likely to be considered against the Ingress Terms of Service. Any use is at your own risk.</i><br/><br/>';

    window.plugin.sak.sezionericerca = null;

    window.plugin.sak.chat.ignoreActions = 0;
    window.plugin.sak.chat.paddingFilter = 0;

    window.plugin.sak.containerdatafromserver = "containerdatafromserver";
    window.plugin.sak.nameenablefilter = "Attiva filtro";


    //window.plugin.sak.findheldbyvirus = false;
    window.plugin.sak.prossimitaportali = false;	
    window.plugin.sak.prossimitaguardian = false;
    window.plugin.sak.raggioProssimitaPortali = 5;
    window.plugin.sak.raggioProssimitaGuardians = 5;
    window.plugin.sak.urlroutewaypoints = false;
    window.plugin.sak.autocompletenickname = false;
    window.plugin.sak.sendmessagechat = false;
    window.plugin.sak.sendmessagechat = false;
    window.plugin.sak.overridemaxtsgetplext = false;
    /*
	Controlli sul filtro chat
	*/
    window.plugin.sak.chat.enableFilter = false;
    window.plugin.sak.chat.filterAlerts = false;	
    window.plugin.sak.chat.filterMessage = false;
    window.plugin.sak.chat.filterReso = false;
    window.plugin.sak.chat.filterLinks = false;
    window.plugin.sak.chat.filterCaptured = false;
    window.plugin.sak.chat.filterControlField = false;
    window.plugin.sak.chat.filterPlayer = false;
    window.plugin.sak.chat.filterSpam = true;
    /*
	Token per identificare i filtri
	*/
    window.plugin.sak.chat.tokenAlerts = "Your";
    window.plugin.sak.chat.tokenChat = "[public]";
    window.plugin.sak.chat.tokenChat2 = "[faction]";
    window.plugin.sak.chat.tokenReso = "Resonator";
    window.plugin.sak.chat.tokenLinks = "linked";
    window.plugin.sak.chat.tokenLinks2 = "Link";
    window.plugin.sak.chat.tokenControlFields = "Control Field";
    window.plugin.sak.chat.tokenCaptured = "captured";



    // -----------------------------------
    // -----------------------------------
    // -----------------------------------
    // -----------------------------------




    /*
	Metodo per costruire l'url del percorso gmaps con waypoint intermedi.
	La funzione permette di costruire l'url fino a quando non è invocato con il booleano isFinished o isReset.
	Il primo finalizza l'url aggiungendo a inizio url le coordinate della posizione corrente del giocatore (avviene in questa fase per gestire il caso in si stà impostando il percorso in movimento)
	Il secondo resetta l'intero percorso riportando lo stato a quello iniziale.
	Deve esserci almeno un waypoint selezionato affinchè possa essere calcolato il percorso.
*/
    window.plugin.sak.urlwaypoint = "";
    window.plugin.sak.countwaypoint = 0;
    window.plugin.sak.CONSTPATHROUTESWAYPOINTS = "https://www.google.it/maps/dir";
    window.plugin.sak.listWaypoints = [];
    window.plugin.sak.onceAlertWaypoints = true;
    window.plugin.sak.ledNia = "white";
    window.plugin.sak.ledSak = "white";

    // configuratore dell'interfaccia gui del plugin su iitc
    window.plugin.sak.hookSuspendreg = function() {

        if (window.plugin.sak.suspendreg) {
            window.plugin.sak.suspendreg = false;
            window.plugin.sak.namesuspendreg = "Sospendi registrazione";
        } else {
            window.plugin.sak.suspendreg = true;
            window.plugin.sak.namesuspendreg = "Avvia registrazione";
        }

        $('#buttonsuspendreg').attr("value", window.plugin.sak.namesuspendreg)
            .attr("onclick", "window.plugin.sak.hookSuspendreg();").text(
            window.plugin.sak.namesuspendreg);

    }

	window.plugin.sak.signatureSak.renderGoogleButton = function()
	{
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

		 if (!window.isSmartphone())
			return uiButtonGoogle;
		else
			return "<div>"+uriGoogleSignIn+"</div>";
	}

	window.plugin.sak.setupGUISak = function()
	{
		var injectsak = $("<div id='sectionsak' style='font-size: smaller;' />");
		console.info("--->> Injecting html gui sak ...");
		injectsak.load
		(
			window.plugin.sak.rootpath+'templates/sakgui.php?skin=legacy',
		function () 
		{
				window.plugin.sak.setupSak();
        }
		);
		$('#toolbox').append(injectsak);
		
		//window.plugin.sak.setupSak();

	}

    window.plugin.sak.setupUIMain = function() {

        var lblTitle = window.plugin.sak.labelTitle;
        var linkUpdate = "<a id='linkplugin' href='"+window.plugin.sak.rootpath+"sak.user.js'><span  >Aggiorna plugin</span></a>";

        if(window.isSmartphone())
        {
            lblTitle = "SAKm Tools Android";
        }

        if(window.plugin.sak.isbeta)
        {
            lblTitle = lblTitle + " bEta";
            linkUpdate = "<a id='linkplugin' href='"+window.plugin.sak.rootpath+"sak.beta.user.js'><span  >Aggiorna plugin</span></a>";
        }
        window.plugin.sak.labelTitle = lblTitle;

        var enableViewSak = $("<a id='enableView'  >").attr("value",
                                                            "toggle Sak").attr("onclick",
                                                                               "$(\"#sectionsak\").toggle();").text(
            "toggle Sak");
        $('#toolbox').append(enableViewSak);
        var sectionsak = $("<div id='sectionsak' style='font-size: smaller;'>");
        //if (window.isSmartphone())
        //	window.plugin.sak.labelTitle = lblTitle;

        //XXX: creazione di una sezione ad hoc nel portaldetails in modo da sovrascriverla e customizzarla come uno vuole
        $("#redeem").before("<div id='containerdetailportalsak' style='font-size: smaller; color: DEEPSKYBLUE ' />");
        //$("<div id='#containerdetailportalsak' style='font-size: smaller;' />").appendToWithIndex($('#sidebar'),4);


        var containerdisclaimer = $(
            "<img alt=\"SAK Logo\" height=\"50\" width=\"90\" src=\""+window.plugin.sak.mediasak+"saklogo_h.png\" />\
<label id='disclaimer'>"+window.plugin.sak.disclaimer+"</label>\
<div id='containerdisclaimer'>\
<br/>"+linkUpdate+"<br/>\
<a id='helponline' target='blank' href='"+window.plugin.sak.rootpath+"saktoolsguide.html'><span  >Guida all'uso</span></a></div>\
<label id='descniacountcalls' >Richieste NIA: </label>\
<label id='countniacalls' style='color: "+window.plugin.sak.ledNia+"' >"+window.plugin.sak.countniacalls+"</label>\
<br>\
<label id='desccountcalls' >Richieste SAK: </label>\
<label id='countcalls' style='color: "+window.plugin.sak.ledSak+"' >"+window.plugin.sak.countcalls+"</label>\
<br>\
<label id='descniacountcalls' >Rendering in corso </label>\
<label id='countiitccalls' >"+window.plugin.sak.countiitccalls+"</label>\
<br/>");

        var registration = $("<div id='registration' /><div id='risposteregistrazione' style='color: white; '/><div id='esitoregistrazione' style='color: GOLD; '/>");
        //var containerrequest = $("<br/><label id='desccountcalls'>Richieste attive:</label><label id='countcalls'>"+window.plugin.sak.countcalls+"</label></br>");



        var sectionsakaction = $
        (
            "<div id='consolesakaction'>\
<table>\
<tr><td><a id='buttonsuspendreg' onclick='window.plugin.sak.hookSuspendreg();'>"+window.plugin.sak.namesuspendreg+"</a></td></tr>\
<tr><td><input type='checkbox' id='enablemulticallloggerchat' onclick=\"window.plugin.sak.flipFlopGeneric('enablemulticallloggerchat');\">\
<span>"+window.plugin.sak.namemulticallloggerchat+"</span>\
</td></tr>\
<tr><td><a id='buttoninvia' >"+window.plugin.sak.nameinvia+"</a><br/><a id='linkviewstats' onclick=\"$('#statsinviodati').toggle();$('#statsinviodatitotale').toggle();\" >View/Hide statistiche</a></td></tr>\
<tr><td><div id='statsinviodati'/></td></tr>\
<tr><td><div id='statsinviodatitotale'/></td></tr>\
</table>\
</div>"
        );
        //<tr><td><a id='buttoninvia' onclick='window.plugin.sak.writeLog();'>"+window.plugin.sak.nameinvia+"</a></td></tr>\

        var ctrlWaypoint = $
        (
            "<a id='confirmroutewaypoint' onclick='window.plugin.sak.buildRouteWaypoint(null,null, true, false);'>Calcola percorso GPS</a><br/>\
<a id='resetroutewaypoint' onclick='window.plugin.sak.buildRouteWaypoint(null,null, false, true);' >Annulla calcolo GPS</a><br/>\
<span id='urlroutefinished' /><div id='elencowaypoints' /><br/>"
        );

        var sectiongps = $("<div id='consolegps'>");

        var consolewaypoint = $("<div id='consolewaypoint' >").hide();

        var sectiongis = window.plugin.sak.renderSectionGis();


        var containersak = $(
            "<fieldset><legend><b id='titleAndVersion'>"+window.plugin.sak.labelTitle + " -"+window.plugin.sak.versione+"<b/></legend>\
<div id='mainapplication'></div>\
</fieldset>");


        consolewaypoint.append(ctrlWaypoint);
        sectiongps.append($("<div><input type='checkbox' id='checkroutewaypoints'  onclick=\"window.plugin.sak.flipFlopCheckBox('urlroutewaypoints');\" ><span >"+window.plugin.sak.namebuilderwaypoints+"</span></div>"));
        sectiongps.append(consolewaypoint);

	
        sectionsak.append(containersak);



        // in questa sezione si possono aggiungere tutti gli input per chiamare
        // i metodi jquery per interrogare il server con nuovi tracciati dati

        var sectionsearch = $("<div id='consolericerca'>");
        //sectionsearch.hide();

        var categorieSection = $("<div id='ricercasection'>");

        categorieSection.append($("<select id=\"selectRicerca\" onchange='window.plugin.sak.selectRicerca();' class='sakselect' >\
<option value=\"\">Seleziona ricerca...</option>\
<option value=\"containerSearchPortali\">Portali</option>\
<option value=\"containerSearchOggettiSpeciali\">Oggetti speciali</option>\
<option value=\"containerSearchAttivita\">Attività giocatore</option>\
<option value=\"containerSearchGuardians\">Potenziali Guardian</option>\
</select>"
                                 ));

        sectionsearch.append(categorieSection);
        sectionsearch.append("<br>");

        var ricercaportali = 
            $(
"<div id='containerSearchPortali'>\
<a id='avviaricercaportali' onclick='window.plugin.sak.searchPortals();'><span  >Ricerca...</span></a><br/>\
<input type='text' id='inputsearchportal' size='40' placeholder='Ricerca portali dal titolo' name='titolo' onkeypress='window.plugin.sak.searchPortals(event);'>\
<br/>\
<input type='checkbox' id='checkprossimitaportali' onclick='window.plugin.sak.flipFlopCheckBox(\"prossimitaportali\");'>\
<span>Trova in prossimità di <input type='text' id='inputraggioprossimitaportali' size='2' name='raggioProssimita' value='5'/> km</span>\
</div>\
"
            ).hide();

        var ricercaoggettispeciali = 
            $(
"\
<div id='containerSearchOggettiSpeciali'><div class=\"ui-widget\" style='z-index: 2500;'>\
<a id='avviaricercaoggettispeciali' onclick='window.plugin.sak.consultaDeploySpeciali();'><span>Ricerca...</span></a><br/>\
<input type='text' id='inputdeployspeciali' size='40' placeholder='Ricerca oggetti speciali deployati da un giocatore' name='titolo' onkeypress='window.plugin.sak.consultaDeploySpeciali(event);'>\
</div>\
</div>"
            ).hide();

      var ricercaattivita = 
            $(
                "<div id='containerSearchAttivita'>\
<div class=\"ui-widget\" style='z-index: 2500;' >\
<a id='avviaricercaattivita' onclick='window.plugin.sak.consultaAttivita()'><span  >Ricerca...</span><br/></a>\
<input type='text' id='inputconsultaattivita' size='40' placeholder='Richiedi report base del player' name='player' onkeypress='window.plugin.sak.consultaAttivita(event);'>\
<br/>\
<select id='selectDiffGiorni' class='sakselect' name='periodogiorni' >\
<option value=\"1\">Ultime 24 ore</option>\
<option value=\"7\">Ultima settimana</option>\
<option value=\"10\" selected >Ultimi 10 giorni</option>\
<option value=\"30\">Ultimo mese</option>\
<option value=\"60\">Ultimi due mesi</option>\
<option value=\"180\">Ultimi sei mesi</option>\
<option value=\"360\">Ultimi anno</option>\
<option value=\"tutto\">Intero periodo</option>\
</select>\
</div>"
            ).hide();
  
        var ricercaguardians = 
            $(
"<div id='containerSearchGuardians'>\
<div class=\"ui-widget\" style='z-index: 2500;' >\
<a id='avviaricercaportali' onclick='window.plugin.sak.consultaGuardians();'><span  >Ricerca...</span></a><br/>\
<input type='text' id='inputconsultaguardians' size='40' placeholder='Richiedi lista guardians del player' name='player' onkeypress='window.plugin.sak.consultaGuardians(event);'>\
</div>\
<input type='checkbox' id='checkprossimitaguardian' onclick='window.plugin.sak.flipFlopCheckBox(\"prossimitaguardian\");'>\
<span>Trova in prossimità di <input type='text' id='inputraggioprossimitaguardians' size='2' name='raggioProssimita' value='5'/> km</span>\
</div>\
"
            ).hide();

		containersak.append($("<div id='welcomeuser' />"));
		containersak.append(window.plugin.sak.signatureSak.renderGoogleButton());
        containersak.append(containerdisclaimer);
        containersak.append(registration);
		
        /*
		Integrazione filtro chat
		*/
        if (!window.isSmartphone())
        {


            var sectionFilterChat = $(" <span id=\"filterchat\"> \
<span><input id=\"filterSpam\" type=\"checkbox\" onclick=\"window.plugin.sak.flipFlopCheckBox('filterSpam');\" checked='true' />Attiva antispam</span>\
<span><input id=\"enableFilter\" type=\"checkbox\" onclick=\"window.plugin.sak.flipFlopCheckBox('enableFilter');\"/>"+window.plugin.sak.nameenablefilter+"</span>\
</span>");	

/*
<span><a id='injectscroll' href='#' onclick='window.plugin.sak.injectPaddingScroll();' >Inject text</a></span>\
*/
			var sectionFilterDetail = $(
"<div id=\"sectionFilterChat\">\
<span >\
<span>Ignorati: <label id=\"ignoreActions\" /></label></span> <span> - </span>\
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

			//XXX: aggiunta dell'evento toggle class per la l'expand della chat quando il filtro è attivato
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

            containersak.append(sectionFilterChatMobile);
        }

        if(console !== undefined)
            console.log("Aggiunto il filtro antispam!");



        //XXX: temporaneamente dismesso per capire la fattibilità della funzionalità di richiesta azioni specificando una data on demand
        //containersak.append($("<div><input type='checkbox' id='overridemaxtsgetplext'  onclick=\"window.plugin.sak.flipFlopCheckBox('overridemaxtsgetplext');\" ><span >"+window.plugin.sak.nameoverridemaxtsgetplext+"</span></div>"));
        //containersak.append($("<div class='saktable-container' id='timeStampMaxGetPlext'><span >Scegli la data:</span><input type='text' id='plextdatapicker'></div>"));
		containersak.append("</br>");
                var console = $("<div style='min-height: 100px;' class='skin-console' id='consoleoutput' >\
<div id='esitoautenticazione' style='color: GOLDENROD;' class='consoleautenticazione text'/>\
<div id='esitoclient' style='color: ROYALBLUE;'/>\
<div id='esitoserver' style='color: DEEPSKYBLUE; '/>\
<div id='anomaliaclient' style='color: ORANGERED; '/>\
<div id='anomaliaserver' style='color: INDIANRED; '/>\
<div id='fatalerror' style='color: CRIMSON; background-color: black;'/>\
</div>");

        containersak.append(console);
		containersak.append("</br>");
		containersak.append(sectiongis);
        sectionsearch
            .append(ricercaportali)
            .append(ricercaoggettispeciali)
            .append(ricercaattivita)
            .append(ricercaguardians)
            .append("<br/>");
        var buttonSwithOff = $("<div class=\"onoffswitch2\"><input type=\"checkbox\" onclick=\"window.plugin.sak.enableDisableSakoogle()\" name=\"onoffswitch2\" class=\"onoffswitch2-checkbox\" id=\"enablesakoogle\" > <label class=\"onoffswitch2-label\" for=\"enablesakoogle\">  <span class=\"onoffswitch2-inner\"></span> <span class=\"onoffswitch2-switch\"></span>  </label> </div></br>");
        containersak
            .append(buttonSwithOff);
        containersak.append(sectionsearch);
        sectionsearch.hide();

        var buttonSwithOff4 = $("<div class=\"onoffswitch4\"><input type=\"checkbox\" onclick=\"window.plugin.sak.enableDisableSakAvanzate()\" name=\"onoffswitch4\" class=\"onoffswitch4-checkbox\" id=\"enablesavanzate\" > <label class=\"onoffswitch4-label\" for=\"enablesavanzate\">  <span class=\"onoffswitch4-inner\"></span> <span class=\"onoffswitch4-switch\"></span>  </label> </div></br>");
        containersak
            .append(buttonSwithOff4);
        sectionsakaction.append($("<div id='containeristantanea'><a id=\"resetreports\" onclick=\"$('.reports').remove();$('resetreports').hide()\">"+window.plugin.sak.resetreports+"</a></div>"));
		
		var sectionAvanzate = $("<div id='containerAvanzate' ></div>");
		sectionAvanzate.append($("<div><a id='getcheckpoint' target='blank' onclick='window.plugin.sak.scoreCycleTimes.getScoreCycle()'><span  >Richiedi Score Checkpoint</span></a></div>")).append("<br/>");

        sectionAvanzate.append($("\
		<div id='containersincronizzazione'>\
		<fieldset>\
		<legend>Sincronizzazione Bookmarks con il cloud SAK...</legend>\
		<a onclick=\"window.plugin.sak.cloudbookmark.syncSakStorage('syncronize','twoway');\"><span>Sincronizza col cloud Sak</span></a>\
		</br>\
		<input type='checkbox' id='attivasyncloudbookmarks'  onclick=\"window.plugin.sak.flipFlopGeneric('enablesyncbookmarksak');\" /><span >Attiva sincronizzazione on demand</span>\
		</fieldset>\
		</div>\
		").hide());
        sectionAvanzate.append($("<div><input type='checkbox' id='autocompletenickname'  checked='true' onclick=\"window.plugin.sak.flipFlopCheckBox('autocompletenickname');\" /><span >"+window.plugin.sak.nameautocompletenickname+"</span></div>"));
        sectionAvanzate.append($("<div><input type='checkbox' id='sendmessagechat'  checked='true' onclick=\"window.plugin.sak.flipFlopCheckBox('sendmessagechat');\" /><span >"+window.plugin.sak.namesendmessagechat+"</span></div>"));
        sectionAvanzate.append(sectiongps).append("<br/>");

		containersak.append(sectionAvanzate);
		sectionAvanzate.hide();

        var buttonSwithOff3 = $("<div class=\"onoffswitch3\"><input type=\"checkbox\" onclick=\"window.plugin.sak.enableDisableSakaction()\" name=\"onoffswitch3\" class=\"onoffswitch3-checkbox\" id=\"enablesaction\" > <label class=\"onoffswitch3-label\" for=\"enablesaction\">  <span class=\"onoffswitch3-inner\"></span> <span class=\"onoffswitch3-switch\"></span>  </label> </div></br>");
        containersak
            .append(buttonSwithOff3);
        containersak.append(sectionsakaction);
        sectionsakaction.hide();
		

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
                            "<div ><p style='color: orange;'>Server SAK non raggiungibile!</p> <p style='color: yellow;'>Il plugin è in modalità offline.</p></div>\
<div id='linktrusturl'>\
<a target='blank' href='"+window.plugin.sak.rootpath+"abilitahttps.html'>Possibili soluzioni</a>\
</div>"));
                    isappend = true;
                }
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
            containersak.append($("<div id='"+window.plugin.sak.containerdatafromserver+"'>"));
        }


        //container generico per visualizzare i risultati dal server (le response delle varie richieste)
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
        $('#toolbox').append(sectionsak);

        $('#sectionFilterChat').hide();
        $('#sectionFilterChatMobile').hide();

        $("#timeStampMaxGetPlext").hide();
        $( function() {
            $( "#plextdatapicker" ).datepicker();
        } );

    }

    // inizializzazione del plugin durante la fase di setuping di iitc
    var setup = function() {

		//window.plugin.sak.setupUIMain();
        //XXX: scommentare dopo il consolidamento della gui nuova
        //XXX: scommentare dopo aver consolidato la gui nuova
		window.plugin.sak.setupGUISak();
		/*$( document ).ready(function() {
			setupRenderGui();
		});*/

    }
	
	var setupRenderGui = function()
	{
	
						$('#sectionsak').before("<a id='enableView'  value='toggle Sak' onclick='$(\"#sectionsak\").toggle();'>toggle Sak</a>");
						$("#redeem").before("<div id='containerdetailportalsak' style='font-size: smaller; color: skyblue ' />");
		
		
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
							//.draggable({ 	
													//impostazione cursore di spostamento al momento del trascinamento
							//						cursor: "move", 
							//						containment: '#dashboard',
							//						start: function(e, ui) {
							//						if ($(e.originalEvent.target).is(".scroll"))
							//							e.preventDefault();
							//						}
							//					}).css("position", "absolute");
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
						 
						$('#statsinviodati').hide();
						$('#statsinviodatitotale').hide();
						$("#resetreports").hide();

						$('#sectionFilterChat').hide();
						$('#sectionFilterChatMobile').hide();

						$("#timeStampMaxGetPlext").hide();
						$( function() {
							$( "#plextdatapicker" ).datepicker();
						} );
						var googlesignin = $(window.plugin.sak.signatureSak.renderGoogleButton());
						
						$('#containerosignin').append(googlesignin);					
		


	}
	

    setup.info = plugin_info; // add the script info data to the function as a
    // property
    if (!window.bootPlugins)
        window.bootPlugins = [];
    window.bootPlugins.push(setup);
    // if IITC has already booted, immediately run the 'setup' function
    if (window.iitcLoaded && typeof setup === 'function')
        setup();
    var random = Math.floor((Math.random() * 1000) + 1);

    //-------------------------------------------------------------------------------------------------------------------

    //-----------------------------------------------
    //-----------------------------------------------
    //-----------------------------------------------
    //-----------------------------------------------

    window.plugin.sak.removeWaypoints = function(idWaypoint, guid)
    {

        var cIndex = 0;
        $.each(window.plugin.sak.listWaypoints, function(i, identity) 
               {
            // eliminate offscreen portals (selected, and in padding)
            if(guid == identity.guid) 
            {
                cIndex = i;
                return;
            }
        });

        $("#"+idWaypoint).remove();
        window.plugin.sak.listWaypoints.splice(cIndex,1);
        window.plugin.sak.countwaypoint = window.plugin.sak.countwaypoint-1;
    }

    window.plugin.sak.buildRouteWaypoint = function(portale, guid, isFinished, isReset)
    {

        if(isReset)
        {
            window.plugin.sak.urlwaypoint = "";
            $('#goroutewaypoints').attr('href',window.plugin.sak.urlwaypoint);
            $("#goroutewaypoints").remove();
            $('#urlroutefinished').hide();
            $('#elencowaypoints').empty();
            window.plugin.sak.countwaypoint = 0;
            window.plugin.sak.listWaypoints = [];
            //var myPosition = window.plugin.sak.getPosition();
            //window.plugin.sak.urlwaypoint = "";
            //alert("Calcolo waypoints resettato!");
        }
        else
        {
            if(!isFinished)
            {
                var lat = portale.latE6/1E6;
                var lon = portale.lngE6/1E6;

                console.info("Avvio creazione waypoint gps con coordinate : ["+lat+"]["+lon+"]");



                $
                    .post(
                    window.plugin.sak.endpointsak,
                    {
                        context : "REVERSEGEOCODING",
                        lat : lat,
                        lon : lon
                    },
                    function(data) {
                        var indirizzo = data.address;

                        var canAdd = true;
                        $.each(window.plugin.sak.listWaypoints, function(i, identity) 
                               {
                            // eliminate offscreen portals (selected, and in padding)
                            if(portale.title == identity.title) 
                            {
                                //portaliToAnalyze.push(portal.options.guid);
                                canAdd = false;
                                return canAdd;
                            }
                            else
                            {
                            }
                        });

                        if(canAdd)
                        {

                            if(window.plugin.sak.countwaypoint < 15)
                            {
                                window.plugin.sak.countwaypoint = window.plugin.sak.countwaypoint+1;	
                                $('#elencowaypoints').append("<div id='selectWaypoint"+window.plugin.sak.countwaypoint+"'><label><b>Waypoint "+window.plugin.sak.countwaypoint+": "+portale.title+"</b><br/>"+indirizzo+"</label><div><a onclick=\"window.plugin.sak.removeWaypoints('selectWaypoint"+window.plugin.sak.countwaypoint+"', '"+guid+"');\" >Rimuovi</a></div></div>");

                                var wp = {};
                                wp.title = portale.title;
                                wp.guid = guid;
                                wp.lat = lat;
                                wp.lon = lon;

                                window.plugin.sak.listWaypoints.push(wp);
                                //window.plugin.sak.urlwaypoint += "/"+lat+","+lon;
                            }
                            else
                            {
                                if(!window.plugin.sak.onceAlertWaypoints)
                                {
                                    window.plugin.sak.onceAlertWaypoints = true;
                                }
                                else
                                {
                                    console.info("E' stato raggiunto il numero massimo di waypoints!");
                                    alert("E' stato raggiunto il numero massimo di waypoints!");
                                    window.plugin.sak.onceAlertWaypoints = false;
                                }

                            }

                        }

                    }
                )
                    .fail(
                    function(xhr, textStatus, errorThrown) {
                        console.log(xhr.statusText);
                        console.log(xhr.responseText);
                        console.log(textStatus);
                        console.error(error);
                        $('#elencowaypoints').append("<label><b>Waypoint "+window.plugin.sak.countwaypoint+" : "+portale.title+"</b> Errore decodifica indirizzo!</label>").append("<br/>");
                    });


            }
            else
            {
                if(window.plugin.sak.countwaypoint > 0)
                {

                    window.plugin.sak.urlwaypoint = "";
                    $.each(window.plugin.sak.listWaypoints, function(i, identity) 
                           {
                        window.plugin.sak.urlwaypoint += "/"+identity.lat+","+identity.lon;
                    });

                    var myPosition = window.plugin.sak.getPosition();
                    var finalUrlWaypoint = "/"+myPosition.center.lat+","+myPosition.center.lng + window.plugin.sak.urlwaypoint;
                    //window.plugin.sak.urlwaypoint = "/"+myPosition.center.lat+","+myPosition.center.lng + window.plugin.sak.urlwaypoint;

                    var resulturl = window.plugin.sak.CONSTPATHROUTESWAYPOINTS+finalUrlWaypoint;

                    console.info("Calcolo percorso gps con l'url ["+resulturl+"]");
                    $('#goroutewaypoints').remove();

                    var urlroutewaypoints =	$("<a id='goroutewaypoints' target='blank'>").attr("value",
                                                                                               'Avvia percorso sul navigatore').text(
                        'Avvia percorso sul navigatore').attr('href',resulturl);

                    alert("Calcolato il percorso con inizio alle coordinate: ["+myPosition.center.lat+";"+myPosition.center.lng+"]");										

                    $('#urlroutefinished').append(urlroutewaypoints);
                    $('#urlroutefinished').show();
                }
                else
                {
                    console.info("Non è stato indicato alcun waypoint.");
                    alert("Non è stato indicato alcun waypoint!");
                }

            }
        }

    }


    //Algoritmo Antispam
    window.plugin.sak.chat.listSpam = 
        [
        "ingress-store.com",
        "xmps.biz",
        "shop-ingress.com",
        "ingressfarm.com",
        "ingress-shop.net",
        "ingintems.net",
        "allforingress.ecwid.com",
        "ingress-store.net",
        "www.ingressitemsbuy.com",
        "vk.com/in_farm",
        "ingress-items-buy.com"
    ]

    window.plugin.sak.chat.checkSpam = function(message)
    {
        var canAddMsg = true;

        $.each(window.plugin.sak.chat.listSpam, function(i, blackitem) 
               {
            if(
                message.indexOf(blackitem) !== -1 
            )
            {
                canAddMsg = false;
            }
        });

        return canAddMsg;
    }

    window.plugin.sak.chat.checkFilter = function(msg, nick)
    {
        var canAddMsg = true;

        if(window.plugin.sak.chat.filterSpam)
        {
            var trimMsg = msg.toLowerCase();
            canAddMsg = window.plugin.sak.chat.checkSpam(trimMsg);
        }

        if(window.plugin.sak.chat.enableFilter)
        {
            if(!window.plugin.sak.chat.filterAlerts)
            {
                if(msg.indexOf(window.plugin.sak.chat.tokenAlerts) !== -1)
                    canAddMsg = false;
            }

            if(!window.plugin.sak.chat.filterMessage)
            {
                if(msg.indexOf(window.plugin.sak.chat.tokenChat) !== -1 || msg.indexOf(window.plugin.sak.chat.tokenChat2) !== -1)
                    canAddMsg = false;
            }
            if(!window.plugin.sak.chat.filterCaptured)
            {
                if(msg.indexOf(window.plugin.sak.chat.tokenCaptured) !== -1)
                    canAddMsg = false;
            }
            if(!window.plugin.sak.chat.filterControlField)
            {
                if(msg.indexOf(window.plugin.sak.chat.tokenControlFields) !== -1)
                    canAddMsg = false;
            }
            if(!window.plugin.sak.chat.filterLinks)
            {
                if(msg.indexOf(window.plugin.sak.chat.tokenLinks) !== -1 || msg.indexOf(window.plugin.sak.chat.tokenLinks2) !== -1)
                    canAddMsg = false;
            }
            if(!window.plugin.sak.chat.filterReso)
            {
                if(msg.indexOf(window.plugin.sak.chat.tokenReso) !== -1)
                    canAddMsg = false;
            }

            if(window.plugin.sak.chat.filterPlayer)
            {
                var innerCan = canAddMsg;

                canAddMsg = false;

                var searchPlayer = $("#searchLoggerPlayer").val();
                searchPlayer = searchPlayer.replace('@','');
                var splitPlayer = searchPlayer.split(" ");

                for (var i = 0; i <= splitPlayer.length-1; i++) { 

                    var cP = splitPlayer[i];
                    cP = cP.trim();

                    if(cP != "")
                    {
                        if(nick.indexOf(cP) !== -1)
                        {
                            canAddMsg = true;
                        }
                    }

                }

                canAddMsg = innerCan && canAddMsg;
            }
        }

        return canAddMsg;

    }

    //--------------------------------------
    //--------------------------------------
    //UTILITY
    //--------------------------------------
    //--------------------------------------

    // converts a javascript time to a precise date and time (optionally with millisecond precision)
    // formatted in ISO-style YYYY-MM-DD hh:mm:ss.mmm - but using local timezone
    window.plugin.sak.unixTimeToDateTimeString = function(time, millisecond) {
        if(!time) return null;
        var d = new Date(typeof time === 'string' ? parseInt(time) : time);
        return d.getFullYear()+'-'+zeroPad(d.getMonth()+1,2)+'-'+zeroPad(d.getDate(),2)
            +' '+zeroPad(d.getHours(),2)+':'+zeroPad(d.getMinutes(),2)+':'+zeroPad(d.getSeconds(),2)+(millisecond?'.'+zeroPad(d.getMilliseconds(),3):'');
    }

    window.plugin.sak.cleanDom = function(contentToSend) {

        console.log("Pulizia del dom html dagli errori xml");

        contentToSendEscaped = window.plugin.sak.replaceAll(contentToSend,
                                                            "&lt;small class=&quot;milliseconds&quot;&gt;", "{}");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "&lt;/small&gt;/g", "{}");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "<small class=&quot;milliseconds&quot;>",
            "{}");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "</small>", "{}");

        // XXX: elimina un malformed error xml
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped,
            "<span style=&quot;color: rgb(0, 136, 255)&quot;>", "{}");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped,
            "<span style=&quot;color: rgb(3, 220, 3)&quot;>", "{}");

        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "\n", "");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "\r", "");

        // '</span> Min player level: <span
        // style=&quot;display:inline-block;padding:4px;color:white;background-color:#FECE5A&quot;';
        contentToSendEscaped = window.plugin.sak
            .replaceAll(
            contentToSendEscaped,
            '</span>Min player level: <span style=&quot;display:inline-block;padding:4px;color:white;background-color:#FECE5A&quot;>1</span>',
            "{}");
        contentToSendEscaped = window.plugin.sak
            .replaceAll(
            contentToSendEscaped,
            "</span>Min player level: <span style=&quot;display:inline-block;padding:4px;color:white;background-color:#9627F4&quot;>8</span>",
            "{}");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, ">1</span>\"", "{}\"");

        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "\",=\"\"", "=\"\"");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, ",=\"\"", "=\"\"");

        // contentToSendEscaped =
        // window.plugin.sak.replaceAll(contentToSendEscaped,"[0-9]+=","anumber=");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "\"=\"\"", "=\"\"");

        // contentToSendEscaped =
        // window.plugin.sak.replaceAll(contentToSendEscaped,"[0-9]+=\"\"","");
        // contentToSendEscaped =
        // window.plugin.sak.replaceAll(contentToSendEscaped,"[\d]+=\"\"","");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "[\d]+\-.=\"\"", "");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "[\d]+.=\"\"", "");

        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, '[\d]+=""', "");
        contentToSendEscaped = contentToSendEscaped.replace(new RegExp(
            '[\d]+=\"\"', 'g'), '');

        // XXX: situazione speciale per togliere gli attributi numerici
        // (malformed xml)
        // contentToSendEscaped = contentToSendEscaped.replace(new
        // RegExp("[\d]+=\"\"", 'g'), "");
        contentToSendEscaped = window.plugin.sak
            .replaceAll(
            contentToSendEscaped,
            "</span>Min player level: <span style=&quot;display:inline-block;padding:4px;color:white;background-color:#FECE5A&quot;{}",
            "");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "title=\"<span\"", "title=\"");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "title=\"<span", "title=\"");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "Guessed player level: <span", "{}");

        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "Guessed player level: <span", "{}");

        contentToSendEscaped = window.plugin.sak
            .replaceAll(
            contentToSendEscaped,
            "style=&quot;display:inline-block;padding:4px;color:white;background-color:#EB26CD&quot;>1</span>",
            "{}");
        contentToSendEscaped = window.plugin.sak
            .replaceAll(
            contentToSendEscaped,
            "style=&quot;display:inline-block;padding:4px;color:white;background-color:#EB26CD&quot;>2</span>",
            "{}");
        contentToSendEscaped = window.plugin.sak
            .replaceAll(
            contentToSendEscaped,
            "style=&quot;display:inline-block;padding:4px;color:white;background-color:#EB26CD&quot;>3</span>",
            "{}");
        contentToSendEscaped = window.plugin.sak
            .replaceAll(
            contentToSendEscaped,
            "style=&quot;display:inline-block;padding:4px;color:white;background-color:#EB26CD&quot;>4</span>",
            "{}");
        contentToSendEscaped = window.plugin.sak
            .replaceAll(
            contentToSendEscaped,
            "style=&quot;display:inline-block;padding:4px;color:white;background-color:#EB26CD&quot;>5</span>",
            "{}");
        contentToSendEscaped = window.plugin.sak
            .replaceAll(
            contentToSendEscaped,
            "style=&quot;display:inline-block;padding:4px;color:white;background-color:#EB26CD&quot;>6</span>",
            "{}");
        contentToSendEscaped = window.plugin.sak
            .replaceAll(
            contentToSendEscaped,
            "style=&quot;display:inline-block;padding:4px;color:white;background-color:#EB26CD&quot;>7</span>",
            "{}");
        contentToSendEscaped = window.plugin.sak
            .replaceAll(
            contentToSendEscaped,
            "style=&quot;display:inline-block;padding:4px;color:white;background-color:#EB26CD&quot;>8</span>",
            "{}");

        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "<Fi_294>", "{}");

        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "&nbsp;", " ");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "</span>Min player level: <span", " ");

        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "color:#C124E0&quot;>1</span>", "{}");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "color:#C124E0&quot;>2</span>", "{}");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "color:#C124E0&quot;>3</span>", "{}");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "color:#C124E0&quot;>4</span>", "{}");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "color:#C124E0&quot;>5</span>", "{}");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "color:#C124E0&quot;>6</span>", "{}");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "color:#C124E0&quot;>7</span>", "{}");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "color:#C124E0&quot;>8</span>", "{}");

        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "#9627F4&quot;>1</span>", "{}");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "#9627F4&quot;>2</span>", "{}");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "#9627F4&quot;>3</span>", "{}");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "#9627F4&quot;>4</span>", "{}");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "#9627F4&quot;>5</span>", "{}");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "#9627F4&quot;>6</span>", "{}");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "#9627F4&quot;>7</span>", "{}");
        contentToSendEscaped = window.plugin.sak.replaceAll(
            contentToSendEscaped, "#9627F4&quot;>8</span>", "{}");

        console.log("Pulizia del dom html avvenuto con successo!!");

        return contentToSendEscaped;

    }

    window.plugin.sak.xml2json = function (xml) {
        try {
            var obj = {};
            if (xml.children.length > 0) {
                for (var i = 0; i < xml.children.length; i++) {
                    var item = xml.children.item(i);
                    var nodeName = item.nodeName;

                    if (typeof (obj[nodeName]) == "undefined") {
                        obj[nodeName] = window.plugin.sak.xml2json(item);
                    } else {
                        if (typeof (obj[nodeName].push) == "undefined") {
                            var old = obj[nodeName];

                            obj[nodeName] = [];
                            obj[nodeName].push(old);
                        }
                        obj[nodeName].push(window.plugin.sak.xml2json(item));
                    }
                }
            } else {
                obj = xml.textContent;
            }
            return obj;
        } catch (e) {
            console.log(e.message);
        }
    }	

    window.plugin.sak.base64Decode = function (data) {
        //  discuss at: http://phpjs.org/functions/base64_decode/
        // original by: Tyler Akins (http://rumkin.com)
        // improved by: Thunder.m
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        //    input by: Aman Gupta
        //    input by: Brett Zamir (http://brett-zamir.me)
        // bugfixed by: Onno Marsman
        // bugfixed by: Pellentesque Malesuada
        // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        //   example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
        //   returns 1: 'Kevin van Zonneveld'
        //   example 2: base64_decode('YQ===');
        //   returns 2: 'a'

        var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
            ac = 0,
            dec = '',
            tmp_arr = [];

        if (!data) {
            return data;
        }

        data += '';

        do { // unpack four hexets into three octets using index points in b64
            h1 = b64.indexOf(data.charAt(i++));
            h2 = b64.indexOf(data.charAt(i++));
            h3 = b64.indexOf(data.charAt(i++));
            h4 = b64.indexOf(data.charAt(i++));

            bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

            o1 = bits >> 16 & 0xff;
            o2 = bits >> 8 & 0xff;
            o3 = bits & 0xff;

            if (h3 == 64) {
                tmp_arr[ac++] = String.fromCharCode(o1);
            } else if (h4 == 64) {
                tmp_arr[ac++] = String.fromCharCode(o1, o2);
            } else {
                tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
            }
        } while (i < data.length);

        dec = tmp_arr.join('');

        return dec.replace(/\0+$/, '');
    }

    window.plugin.sak.base64Encode = function(data) {
        // discuss at: http://phpjs.org/functions/base64_encode/
        // original by: Tyler Akins (http://rumkin.com)
        // improved by: Bayron Guevara
        // improved by: Thunder.m
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: Rafal Kukawski (http://kukawski.pl)
        // bugfixed by: Pellentesque Malesuada
        // example 1: base64_encode('Kevin van Zonneveld');
        // returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
        // example 2: base64_encode('a');
        // returns 2: 'YQ=='

        var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc = '', tmp_arr = [];

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
            tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3)
                + b64.charAt(h4);
        } while (i < data.length);

        enc = tmp_arr.join('');

        var r = data.length % 3;

        return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
    }

    window.plugin.sak.dateFormat = function () {
        var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g,
            pad = function (val, len) {
                val = String(val);
                len = len || 2;
                while (val.length < len) val = "0" + val;
                return val;
            };

        // Regexes and supporting functions are cached through closure
        return function (date, mask, utc) {
            var dF = window.plugin.sak.dateFormat;

            // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
            if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
                mask = date;
                date = undefined;
            }

            // Passing date through Date applies Date.parse, if necessary
            date = date ? new Date(date) : new Date;
            if (isNaN(date)) throw SyntaxError("invalid date");

            mask = String(dF.masks[mask] || mask || dF.masks["default"]);

            // Allow setting the utc argument via the mask
            if (mask.slice(0, 4) == "UTC:") {
                mask = mask.slice(4);
                utc = true;
            }

            var	_ = utc ? "getUTC" : "get",
                d = date[_ + "Date"](),
                D = date[_ + "Day"](),
                m = date[_ + "Month"](),
                y = date[_ + "FullYear"](),
                H = date[_ + "Hours"](),
                M = date[_ + "Minutes"](),
                s = date[_ + "Seconds"](),
                L = date[_ + "Milliseconds"](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                    d:    d,
                    dd:   pad(d),
                    ddd:  dF.i18n.dayNames[D],
                    dddd: dF.i18n.dayNames[D + 7],
                    m:    m + 1,
                    mm:   pad(m + 1),
                    mmm:  dF.i18n.monthNames[m],
                    mmmm: dF.i18n.monthNames[m + 12],
                    yy:   String(y).slice(2),
                    yyyy: y,
                    h:    H % 12 || 12,
                    hh:   pad(H % 12 || 12),
                    H:    H,
                    HH:   pad(H),
                    M:    M,
                    MM:   pad(M),
                    s:    s,
                    ss:   pad(s),
                    l:    pad(L, 3),
                    L:    pad(L > 99 ? Math.round(L / 10) : L),
                    t:    H < 12 ? "a"  : "p",
                    tt:   H < 12 ? "am" : "pm",
                    T:    H < 12 ? "A"  : "P",
                    TT:   H < 12 ? "AM" : "PM",
                    Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                    o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                };

            return mask.replace(token, function ($0) {
                return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
            });
        };
    }();

    // Some common format strings
    window.plugin.sak.dateFormat.masks = {
        "default":      "ddd mmm dd yyyy HH:MM:ss",
        shortDate:      "d/m/yy",
        mediumDate:     "d mmm, yyyy",
        longDate:       "d mmmm, yyyy",
        fullDate:       "mmmm d, dddd, yyyy",
        shortTime:      "h:MM TT",
        mediumTime:     "h:MM:ss TT",
        longTime:       "h:MM:ss TT Z",
        isoDate:        "yyyy-mm-dd",
        isoTime:        "HH:MM:ss",
        isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
        isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    };

    // Internationalization strings
    window.plugin.sak.dateFormat.i18n = {
        dayNames: [
            "Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab",
            "Domenica", "Lunedi", "Martedi", "Mercoledi", "Giovedi", "Venerdi", "Sabato"
        ],
        monthNames: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
        ]
    };	


    window.plugin.sak.escapeRegExp = function(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }
    window.plugin.sak.replaceAll = function(str, find, replace) {
        return str.replace(
            new RegExp(window.plugin.sak.escapeRegExp(find), 'g'), replace);
    }

    //XXX: da normalizzare e parametrizzare con le class temi supportati
    window.plugin.sak.currentData;
    window.plugin.sak.downloadblob = function()
    {
        var data = window.plugin.sak.currentData;

        var filename = data.filename;
        var plaintext = data.plaintext;

        console.log("Download report "+filename);
        var blob = new Blob([ plaintext ], {
            type : "application/plain"
        });

        var url = window.URL.createObjectURL(blob);
        a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }


    window.plugin.sak.getPosition = function() {
        if(window.plugin.sak.getURLParam('latE6') && window.plugin.sak.getURLParam('lngE6')) {
            console.log("mappos: reading email URL params");
            var lat = parseInt(window.plugin.sak.getURLParam('latE6'))/1E6 || 0.0;
            var lng = parseInt(window.plugin.sak.getURLParam('lngE6'))/1E6 || 0.0;
            var z = parseInt(window.plugin.sak.getURLParam('z')) || 17;
            return {center: new L.LatLng(lat, lng), zoom: z};
        }

        if(window.plugin.sak.getURLParam('ll')) {
            console.log("mappos: reading stock Intel URL params");
            var lat = parseFloat(window.plugin.sak.getURLParam('ll').split(",")[0]) || 0.0;
            var lng = parseFloat(window.plugin.sak.getURLParam('ll').split(",")[1]) || 0.0;
            var z = parseInt(window.plugin.sak.getURLParam('z')) || 17;
            return {center: new L.LatLng(lat, lng), zoom: z};
        }

        if(window.plugin.sak.readCookie('ingress.intelmap.lat') && window.plugin.sak.readCookie('ingress.intelmap.lng')) {
            console.log("mappos: reading cookies");
            var lat = parseFloat(window.plugin.sak.readCookie('ingress.intelmap.lat')) || 0.0;
            var lng = parseFloat(window.plugin.sak.readCookie('ingress.intelmap.lng')) || 0.0;
            var z = parseInt(window.plugin.sak.readCookie('ingress.intelmap.zoom')) || 17;

            if(lat < -90  || lat > 90) lat = 0.0;
            if(lng < -180 || lng > 180) lng = 0.0;

            return {center: new L.LatLng(lat, lng), zoom: z};
        }

        setTimeout("window.map.locate({setView : true});", 50);

        return {center: new L.LatLng(0.0, 0.0), zoom: 1};
    };

    //funzione che ritorna le coordinate correnti della mappa IITC visualizzata
    //verrà utilizzata per recuperare le coordinate con le quali calcolare i portali di prossimità
    //per sapere i portali di prossimità della propria locazione, è sufficiente prima posizionare la mappa sulla corrente posizione e poi interrogare
    window.plugin.sak.gisCurrentMap = function()
    {
        //var result = map.locate({setView : false, maxZoom: 13});
        //var currentLocation = result.getCenter();//result._initialCenter;

        var myPosition = window.plugin.sak.getPosition();
        var dataGis = {lat : myPosition.center.lat, lng : myPosition.center.lng};

        //var dataGis = {lat : currentLocation.lat, lng : currentLocation.lng};

        return dataGis;

    }


    window.plugin.sak.daysBetween = function( date1, date2 ) {
        //Get 1 day in milliseconds
        var one_day=1000*60*60*24;

        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;

        // Convert back to days and return
        return Math.round(difference_ms/one_day); 
    }

    window.plugin.sak.secMinBetween = function(date1,date2)
    {
        var result = {};
        var diff = Math.abs(new Date(date2) - new Date(date1));
        result.milliSecond = diff;
        result.seconds = Math.floor(diff/1000);
        result.minutes = Math.floor((diff/1000)/60);

        return result;
    }


    window.plugin.sak.getFailError = function(xhr,textStatus, fase)
    {
        console.log("Errore intercettato:");
        console.log(xhr);
        var isFatal = false;

        var msg = xhr.statusText + " " + xhr.responseText
        + " " + textStatus;
        //+ errorThrown;

        var errorPattern = "SQLSTATE[42000] [1226]";
        var infoSuspendReg = "La registrazione delle azioni è stata disabilitata";
        var persistMsg = false;
        if(msg.indexOf(errorPattern) !== -1)
        {
            //inibisce la registrazione quando richiesto dall'utente
            window.plugin.sak.suspendreg = true;
            window.plugin.sak.suspendsendportal = true;
            window.plugin.sak.namesuspendreg = "Avvia registrazione";
            //msg = "Errore del server ["+errorPattern+"] durante l'accesso alle risorse del SAK. "+infoSuspendReg;
            msg = "Errore del server durante l'accesso alle risorse del SAK. "+infoSuspendReg;
            
			isFatal = true;
        }

        //alert
        var friendlymsg = "Anomalia di comunicazione! Errore durante la fase di "+fase+" ["
        + msg+"]";
        friendlymsg = friendlymsg + ". Verificare l'abilitazione https oppure riprovare. Per supporto inviare una email a <a href='mailto:kmtnck@alessandromodica.com'>kmtnck@alessandromodica.com</a>";							
        $('#esitoclient').html('idle...');

        if(isFatal)
        {
            //$('#fatalerror').append($('<label label >'+friendlymsg+'</label>'));//html(friendlymsg);
			window.plugin.sak.setTextConsole( '<label label >'+friendlymsg+'</label>', 'consolefatalerror');	
			
        }
        else
        {
            //$('#anomaliaserver').html($('<label label >'+friendlymsg+'</label>'));//html(friendlymsg);
            //var callback = function(){ $('#anomaliaserver').html(''); };

			window.plugin.sak.setTextConsole( '<label label >'+friendlymsg+'</label>', 'consoleaserver');	
			var callback = function(){ window.plugin.sak.setTextConsole( '', 'consoleaserver');	 };

            window.plugin.sak.mutexSak(callback,1,10000);										
        }

        console.error(friendlymsg);

        window.plugin.sak.ledSak = 'red';
        $("#countcalls").css('color',window.plugin.sak.ledSak);


    };


    //--------------------------------------
    //--------------------------------------
    //--------------------------------------
    //--------------------------------------



    //--------------------------------------
    //--------------------------------------
    // Metodi SAK principali
    //--------------------------------------
    //--------------------------------------

    /*
	Tabella di verità sui livelli massimi di energia e percentuale di decadimento

	1	1000	150

	2	1500	225

	3	2000	300

	4	2500	375

	5	3000	450

	6	4000	600

	7	5000	750

	8	6000	900

	*/
    window.plugin.sak.matrixenergyreso = {
        "resonatori":[
            {"livello":"1", "maxenergy":"1000", "decadimento": "150"}, 
            {"livello":"2", "maxenergy":"1500", "decadimento": "225"}, 
            {"livello":"3", "maxenergy":"2000", "decadimento": "300"}, 
            {"livello":"4", "maxenergy":"2500", "decadimento": "375"}, 
            {"livello":"5", "maxenergy":"3000", "decadimento": "450"}, 
            {"livello":"6", "maxenergy":"4000", "decadimento": "600"}, 
            {"livello":"7", "maxenergy":"5000", "decadimento": "750"}, 
            {"livello":"8", "maxenergy":"6000", "decadimento": "900"}
        ]
    };

    window.plugin.sak.calcolaDataDecadimento = function(data)
    {
        console.log("Avvio calcolo data decadimento");

        var resonators = data.resonators;

        var currentDate = new Date();
        var today = currentDate.getDate();

        var maxdays = 0;
        for (i = 0; i < resonators.length; i++)
        {
            /*
			energy:5100
			level:8
			owner:"kmtnck"
			*/
            var level = resonators[i].level;
            var energy = resonators[i].energy;
            var maxenergy;
            var decadimento;
            for (j = 0; j < window.plugin.sak.matrixenergyreso.resonatori.length; j++)
            {
                var cLevel = window.plugin.sak.matrixenergyreso.resonatori[j].livello;
                if(level == cLevel)
                {
                    maxenergy = window.plugin.sak.matrixenergyreso.resonatori[j].maxenergy;
                    decadimento = window.plugin.sak.matrixenergyreso.resonatori[j].decadimento;
                    break;
                }
            }

            var days = 0;
            var hasenergy = energy;
            //console.log("Energia attuale: "+hasenergy);

            while(hasenergy > 0)
            {
                hasenergy = hasenergy - decadimento;
                days = days+1;
                //console.log("Energia rimanente: "+hasenergy);
            }

            if(days > maxdays)
                maxdays = days;

            if(maxdays >= 7)
                break;

        }

        console.info("Giorni rimanenti prima del decadimento: "+maxdays);

        currentDate.setDate(currentDate.getDate() + maxdays);

        return currentDate.toLocaleString();		
    }

    /*
Metodo per inviare le informazioni del portale al server
*/
    window.plugin.sak.prevRenderGuid = "";

    window.plugin.sak.sendPortalInfo = function(data) {

        if(window.plugin.sak.suspendsendportal)
            return false;

        if(window.plugin.sak.prevRenderGuid == data.guid)
        { 
            return false; 
        }
        else
        {
            window.plugin.sak.prevRenderGuid = data.guid
        }

        // inibisco l'invio dati se devi registrarti
        /*if (window.plugin.sak.mustRegister)
			return false;*/
        var isSended = false;

        var p;
        if (data.details != null)
            p = data.details;
        else
            p = data.portalDetails;

        window.plugin.sak.datiPortaleCorrente = data;



        var title = p.title;
        var owner = p.owner;
        var capturedTime = p.capturedTime;

        var dataDecadimento = window.plugin.sak.calcolaDataDecadimento(p);
        console.info("Data stimata per il decadimento del portale "+title+": "+dataDecadimento+" ["+data.guid+"]");

        var team = "non disponibile";
        if (p.team != null)
            team = p.team;

        var struttura = {};

        struttura.mods = p.mods;
        struttura.resonators = p.resonators;

        //costruzione dell'url del percorso con i waypoint impostati selezionando i portali
        if(window.plugin.sak.urlroutewaypoints)
        {
            window.plugin.sak.buildRouteWaypoint(p,data.guid, false, false);
        }

        console.info("> > > Intermedio rendering a 3 passaggi del portale " + title);
        console.info(">>> START rendering ...");
        console.info("Rendering portale " + title);
        $('#esitoclient').html('Rendering portale '+title+' ...');

        // $('#inputlifecapture').show();

        var address = "attualmente non disponibile";// p.descriptiveText.map.ADDRESS;
        var isValid = window.plugin.sak.checkreso(owner, p.resonators);
        //window.plugin.sak.countcalls = window.plugin.sak.countcalls + 1;
        //$('#countcalls').html(window.plugin.sak.countcalls);
        window.plugin.sak.countiitccalls = window.plugin.sak.countiitccalls +1;
        $('#countiitccalls').html(window.plugin.sak.countiitccalls);

        window.plugin.sak.countcallsgis = window.plugin.sak.countcallsgis + 1;

        var tipo = "PortalInfo";

        window.plugin.sak.countcalls = window.plugin.sak.countcalls + 1;
        window.plugin.sak.ledSak = 'green';
        $("#countcalls").css('color',window.plugin.sak.ledSak);
        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

        /*
		 * var scarabocchio = window.plugin.sak.scarabocchio; var source =
		 * window.plugin.sak.base64Encode(scarabocchio); var passcode =
		 * window.plugin.sak.passcode;
		 */
        var cipher = window.plugin.sak.getCipher();// window.plugin.sak.MD5.calcMD5(passcode+source);

        // replace per rinominare la stringa "poker" in "p_ker" in modo da
        // bypassare il vincolo di sicurezza definito dal provider
        //owner = window.plugin.sak.chat.securityReplace(owner);
        //title = window.plugin.sak.chat.securityReplace(title);

        var cGuid = data.guid;

        var currentLinks = window.getPortalLinks(cGuid);

        //window.plugin.sak.waitnextsendportal = true;
        $.post(
            window.plugin.sak.endpointsak,
            {
                context : "infoportale",
                objplayer : JSON.stringify(window.PLAYER),
                nickname : owner,
                guid : cGuid,
                capturetime : capturedTime,
                faction : team,
                lat : p.latE6,
                lon : p.lngE6,
                title : title,
                valid : isValid,
                address : address,
                currentLinks : currentLinks,
                nickReporter : window.PLAYER.nickname,
                hashscript : cipher,
                datadecadimento : dataDecadimento,
                pathimage : p.image,
                structurePortal : JSON.stringify(struttura)
            },
            function(data) {

                $('#esitoserver').html('Rendering Portale '+title+' completato!');
                console.info(data);
                console.info("> > > tutto ok  ");
                console.info("<<< END step rendering ");

                //window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                //$('#countcalls').html(window.plugin.sak.countcalls);
                window.plugin.sak.countcallsgis = window.plugin.sak.countcallsgis - 1;

                window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                $('#countcalls').html(window.plugin.sak.countcalls);
                if(window.plugin.sak.countcalls > 0)
                    $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

                window.plugin.sak.countiitccalls = window.plugin.sak.countiitccalls - 1;
                $('#countiitccalls').html(window.plugin.sak.countiitccalls);

                /*if (window.plugin.sak.mustRegister) {
                    $('#registration')
                        .html(
                        '<fiedlset>Agente '
                        + window.PLAYER.nickname
                        + ' la registrazione è avvenuta con successo! Enjoy You!</fieldset>');
                    $('#consolericerca').show();
                    var callback = function(){ $('#registration').html('');};
                    window.plugin.sak.mutexSak(callback);
                }*/						

                //if(window.plugin.sak.categoriaSakGis == 'censimento')
                //	window.plugin.sak.deleteRenderSinglePortalSAK(cGuid);
                var portale = window.portals[cGuid];
                if(portale != null)
                    window.plugin.sak.renderDettaglioPortale(data.payload,dataDecadimento);

                //var callback = function(){ $('#esitoclient').html('idle...');$('#esitoserver').html('idle...');};
				var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	window.plugin.sak.setTextConsole( 'idle...', 'consoleserver'); };
                window.plugin.sak.mutexSak(callback);
                /*var callback2 = function(){ $('#esitoclient').html('');$('#esitoserver').html('');};
							window.plugin.sak.mutexSak(callback2,5);*/

                if(window.plugin.sak.countiitccalls == 0)
                {
                    window.plugin.sak.prevRenderGuid = "";

                    var callback = function(){$('#esitoserver').html('');};
                    window.plugin.sak.mutexSak(callback);

                    if(window.plugin.sak.canScanGis('censimento'))
                    {
                        window.plugin.sak.analyzePortalSAK();
                    }
                }							

            })
            .fail(
            function(xhr, textStatus, errorThrown) {
                console.log(xhr.statusText);
                console.log(xhr.responseText);
                console.log(textStatus);
                console.error(error);
                window.plugin.sak.getFailError(xhr,textStatus, "Invio info portali");
                console.info("> > > qualcosa è andato storto :( ");
                console.info("<<< FAIL step rendering ");

                window.plugin.sak.countcallsgis = window.plugin.sak.countcallsgis - 1;

                window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                $('#countcalls').html(window.plugin.sak.countcalls);
                if(window.plugin.sak.countcalls > 0)
                    $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

                window.plugin.sak.countiitccalls = window.plugin.sak.countiitccalls - 1;
                $('#countiitccalls').html(window.plugin.sak.countiitccalls);


                //alert
                console.error("Anomalia di comunicazione! Rendering portale fallita");
            });
    }

    // parametri "annotation" per la funzione writelog
    window.plugin.sak.CONST_LIMIT = 500;
    //window.plugin.sak.CONST_LIMIT_PLEXT = 1000; 
    window.plugin.sak.limiteActions = window.plugin.sak.CONST_LIMIT;
    window.plugin.sak.suspendreg = false;
    window.plugin.sak.suspendsendportal = false;

    window.plugin.sak.countinserted = 0;
    window.plugin.sak.countignored = 0;
    window.plugin.sak.countduplicate = 0;
    window.plugin.sak.countrows = 0;
    window.plugin.sak.countfields = 0;
    window.plugin.sak.countlink = 0;
    window.plugin.sak.countcaptured = 0;
    window.plugin.sak.countnotifiche = 0;
    window.plugin.sak.countconversazione = 0;
    window.plugin.sak.countresodestroy = 0;
    window.plugin.sak.countenl = 0;
    window.plugin.sak.countres = 0;
    window.plugin.sak.waitnextcall = false;
    //window.plugin.sak.onceCallLoggerchat = true;
    window.plugin.sak.payloadToWaiting = [];
    window.plugin.sak.registra = function(payloadPlext,contextplext)
    {

        //inibisce la registrazione quando richiesto dall'utente
        if (window.plugin.sak.suspendreg) {
            return false;
        }

        console.info(">>>> Avvio registrazione azioni verso il server SAK...");
        var newPayloadPlext = [];
        for(i=0;i<= payloadPlext.length-1;i++)
        {
            var cPlext = payloadPlext[i];
            var plextType = cPlext[2]["plext"]["plextType"];

            var markup = cPlext[2]["plext"]["markup"];

            var nickname = "";
            switch (plextType) {
                case 'SYSTEM_BROADCAST':
                    nickname = markup[0][1]["plain"];
                    break;
                case 'SYSTEM_NARROWCAST':
                    nickname = markup[3][1]["plain"];
                    break;
                case 'PLAYER_GENERATED':
                    nickname = markup[1][1]["plain"];
                    if(nickname == '[secure] ')
                    {
                        nickname = $markup[1][0]["plain"];
                    }
                    break;
                default:
                    break;
            }
            var msg = cPlext[2]["plext"]["text"];

            var canAddMsg = true;
            canAddMsg = window.plugin.sak.chat.checkFilter(msg,nickname);

            if(canAddMsg)
            {
                newPayloadPlext.push(cPlext);
            }
        }

        //console.log("Stream testo del payload: ["+JSON.stringify(newPayloadPlext)+"]")
        //accodo i dati in un array globale che verrà inviato e svuotato ad ogni chiamata valida
        window.plugin.sak.payloadToWaiting = window.plugin.sak.payloadToWaiting.concat(newPayloadPlext);


        //la registrazione è inibita se è già in corso una registrazione

        if(window.plugin.sak.supportedFlipFlop['enablemulticallloggerchat'])
            if(window.plugin.sak.waitnextcall)
            {
                return false;
            }

        var friendlyMsg = 'Avvio registrazioni azioni';




        //format data e ora
        for (i = 0; i <= window.plugin.sak.payloadToWaiting.length-1; i++) { 

            var cPlext = window.plugin.sak.payloadToWaiting[i];
            var rawTime = cPlext[1];
            var actiontime = window.plugin.sak.unixTimeToDateTimeString(rawTime, true);
            cPlext[3] = actiontime;
        }



        var countActions = window.plugin.sak.payloadToWaiting.length;
        //window.plugin.sak.limiteActions = countActions;

        console.log("Stanno per essere inviati al server "
                    + countActions
                    + " actions di gioco.");

        friendlyMsg = friendlyMsg+". Stanno per essere inviati al server "
            + countActions
            + " actions di gioco.";


        var msgLink = "";
        if(window.plugin.sak.supportedFlipFlop['enablemulticallloggerchat'])
        {
            msgLink = "Invio di "+countActions+" actions in corso...";
        }
        else
        {
            msgLink = "Invio di multiple azioni in corso...";
        }

        window.plugin.sak.countcalls = window.plugin.sak.countcalls + 1;
        window.plugin.sak.countcallsactions = window.plugin.sak.countcallsactions +1;
        $("#buttoninvia").attr("value",
                               msgLink).text(
            msgLink);

        var tipo = "RegistraActions";

        window.plugin.sak.ledSak = 'green';
        $("#countcalls").css('color',window.plugin.sak.ledSak);
        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

        /*console.log("Limite actions inviabili settato a "
				+ window.plugin.sak.limiteActions);*/


        var cipher = window.plugin.sak.getCipher();

        $('#esitoclient').html(friendlyMsg);

        var serializePayload = JSON.stringify(window.plugin.sak.payloadToWaiting);
        console.log("---> Dati NIA da inviare al SAK :");
        //console.log(serializePayload);

        window.plugin.sak.payloadToWaiting.length = 0;
        window.plugin.sak.payloadToWaiting = [];

        window.plugin.sak.waitnextcall = true;

        $
            .post(
            window.plugin.sak.endpointsak,
            {
                context : "registra",
                objplayer : JSON.stringify(window.PLAYER),
                detailcontext : contextplext,
                payloadActions : serializePayload,
                hashscript : cipher
                //limiteactions : window.plugin.sak.limiteActions,
            },
            function(data) {

                window.plugin.sak.waitnextcall = false;

                // di norma è settato a true, ed è la negazione
                // del mustRegister
                /*if (window.plugin.sak.mustRegister) {
                    $('#registration')
                        .html(
                        '<fiedlset>Agente '
                        + window.PLAYER.nickname
                        + ' la registrazione è avvenuta con successo! Enjoy You!</fieldset>');
                    $('#consolericerca').show();

                    var callback = function(){ $('#registration').html(''); };
                    window.plugin.sak.mutexSak(callback);								
                }*/

                if (data.codecontrol > 0) {
                    if (!window.isSmartphone())
                        $('#containeristantanea')
                            .append(
                            $(
                                "<div id='istantanea"
                                + data.idreport
                                + "'>")
                            .append(
                                $(
                                    "<a class='reports'>")
                                .attr(
                                    "value",
                                    window.plugin.sak.namescaricareport)
                                .attr(
                                    "onclick",
                                    "window.plugin.sak.getIstantanea("
                                    + data.idreport
                                    + ");$('#istantanea"
                                    + data.idreport
                                    + "').remove();")
                                .text(
                                    window.plugin.sak.namescaricareport
                                    + " codice: "
                                    + data.idreport)));
                    else
                        $('#containeristantanea')
                            .append(
                            $(
                                "<div id='istantanea"
                                + data.idreport
                                + "'>")
                            .append(
                                $(
                                    "<label class='reports'>")
                                .html(
                                    "Il report codice: "
                                    + data.idreport
                                    + " è stato registrato")));
                }

                //window.plugin.sak.CONST_LIMIT_PLEXT = data.maxload;
                //window.plugin.sak.limiteActions = window.plugin.sak.CONST_LIMIT_PLEXT;

                window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                window.plugin.sak.countcallsactions = window.plugin.sak.countcallsactions -1;
                $('#countcalls').html(
                    window.plugin.sak.countcalls);
                if(window.plugin.sak.countcalls > 0)
                    $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);
                $('#resetreports').show();
                if (window.plugin.sak.countcallsactions == 0)
                    $("#buttoninvia").attr("value",
                                           window.plugin.sak.nameinvia).text(
                        window.plugin.sak.nameinvia);

                // è a true solo dopo la prima volta che si è
                // registrato
                //$('#statsinviodati').show();
                $('#linkviewstats').show();


                $('#statsinviodati').html(
                    "<span ><br/><b>Statistiche invio del report "
                    + data.idreport + "</b><br/>"
                    + data.esito+"</span>");

                window.plugin.sak.countinserted = window.plugin.sak.countinserted
                    + data.statistiche.countinserted;
                window.plugin.sak.countignored = window.plugin.sak.countignored
                    + data.statistiche.countignored;
                window.plugin.sak.countduplicate = window.plugin.sak.countduplicate
                    + data.statistiche.countduplicate;
                window.plugin.sak.countrows = window.plugin.sak.countrows
                    + data.statistiche.countrows;
                window.plugin.sak.countfields = window.plugin.sak.countfields
                    + data.statistiche.countfields;
                window.plugin.sak.countlink = window.plugin.sak.countlink
                    + data.statistiche.countlink;
                window.plugin.sak.countcaptured = window.plugin.sak.countcaptured
                    + data.statistiche.countcaptured;
                window.plugin.sak.countnotifiche = window.plugin.sak.countnotifiche
                    + data.statistiche.countnotifiche;
                window.plugin.sak.countconversazione = window.plugin.sak.countconversazione
                    + data.statistiche.countconversazione;
                window.plugin.sak.countresodestroy = window.plugin.sak.countresodestroy
                    + data.statistiche.countresodestroy;
                window.plugin.sak.countenl = window.plugin.sak.countenl
                    + data.statistiche.countenl;
                window.plugin.sak.countres = window.plugin.sak.countres
                    + data.statistiche.countres;

                var msgConsole = "Non sono state registrate azioni.";
                if(data.idreport != undefined)
                {
                    var msgConsole = "<span >Dati inviati al server correttamente!<br/>La sessione "+data.idreport+" ha registrato "+data.statistiche.countinserted+" azioni di gioco!<br/> In totale sono stati registrati "+window.plugin.sak.countinserted+" azioni di gioco!</span>";
                }

                console
                    .log(msgConsole);
                $('#esitoserver').html(msgConsole);

                var statistichetotali = "<span ><b>Statistiche invio della sessione</b><br/>Salvate: "
                + window.plugin.sak.countinserted;
                statistichetotali = statistichetotali
                    + "<br/>di cui";
                statistichetotali = statistichetotali
                    + "<br/>Control fields: "
                    + window.plugin.sak.countfields;
                statistichetotali = statistichetotali
                    + "<br/>Link: "
                    + window.plugin.sak.countlink;
                statistichetotali = statistichetotali
                    + "<br/><b>Catturati</b>: "
                    + window.plugin.sak.countcaptured;
                statistichetotali = statistichetotali
                    + "<br/>Notifiche: "
                    + window.plugin.sak.countnotifiche;
                statistichetotali = statistichetotali
                    + "<br/>Conversazioni: "
                    + window.plugin.sak.countconversazione;
                statistichetotali = statistichetotali
                    + "<br/>Resonator distrutti: "
                    + window.plugin.sak.countresodestroy;
                statistichetotali = statistichetotali
                    + "<br/>Totale ignorati: "
                    + window.plugin.sak.countignored;
                statistichetotali = statistichetotali
                    + "<br/>Totale duplicati: "
                    + window.plugin.sak.countduplicate;
                statistichetotali = statistichetotali
                    + "<br/>Resonator distrutti: "
                    + window.plugin.sak.countresodestroy;
                statistichetotali = statistichetotali
                    + "<br/><br/><span style='color:#0088FF' >Resistenza : "
                    + window.plugin.sak.countres+"</span>";
                statistichetotali = statistichetotali
                    + "<br/><span style='color:#03DC03' >Illuminati: "
                    + window.plugin.sak.countenl+"</span></span>";

                //$('#statsinviodatitotale').show();
                $('#statsinviodatitotale').html(
                    statistichetotali);

                //var callback = function(){ $('#esitoclient').html('idle...'); $('#esitoserver').html('idle...'); };
				var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	window.plugin.sak.setTextConsole( 'idle...', 'consoleserver'); };
                
                window.plugin.sak.mutexSak(callback,5,1000);	

                console.info("<<<< Registrazione azioni completata!");

                /*var callback2 = function(){ $('#esitoclient').html('');$('#esitoserver').html('');};
							window.plugin.sak.mutexSak(callback2,5);*/

            })
            .fail(
            function(xhr, textStatus, errorThrown) {
                window.plugin.sak.waitnextcall = false;

                console.log(xhr.statusText);
                console.log(xhr.responseText);
                console.log(textStatus);
                console.error(error);

                window.plugin.sak.getFailError(xhr,textStatus, "Registrazione azioni");
                $("#buttoninvia").attr("value",
                                       window.plugin.sak.nameinvia).text(
                    window.plugin.sak.nameinvia);
                window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                window.plugin.sak.countcallsactions = window.plugin.sak.countcallsactions -1;
                $('#countcalls').html(
                    window.plugin.sak.countcalls);
                if(window.plugin.sak.countcalls > 0)
                    $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

            });

        // -----------------------------------------------------------------
        // -----------------------------------------------------------------
        // -----------------------------------------------------------------
        // -----------------------------------------------------------------

        return true;		
    }


    // PORTAL DETAILS MAIN ///////////////////////////////////////////////
    // main code block that renders the portal details in the sidebar and
    // methods that highlight the portal in the map view.

    // highlights portal with given GUID. Automatically clears highlights
    // on old selection. Returns false if the selected portal changed.
    // Returns true if it's still the same portal that just needs an
    // update.
    window.plugin.sak.selectPortal = function(guid) {
        var update = selectedPortal === guid;
        var oldPortalGuid = selectedPortal;
        selectedPortal = guid;

        var oldPortal = portals[oldPortalGuid];
        var newPortal = portals[guid];

        // Restore style of unselected portal
        if(!update && oldPortal) setMarkerStyle(oldPortal,false);

        // Change style of selected portal
        if(newPortal) {
            setMarkerStyle(newPortal, true);

            if (map.hasLayer(newPortal)) {
                newPortal.bringToFront();
            }
        }

        setPortalIndicators(newPortal);

        window.runHooks('portalSelected', {selectedPortalGuid: guid, unselectedPortalGuid: oldPortalGuid});
        return update;
    };	

    window.plugin.sak.dataniaqueue = [];
    window.plugin.sak.dataniaretryqueue = [];

    //usato per temporizzare il refresh durante il caricamento delle entità grafiche di iitc
    window.plugin.sak.semaphorerefresh = true;
    window.plugin.sak.semaphoreentities = true;

    window.plugin.sak.semaphoreinitsend = false;
    //semaforo per avviare la chiamata al server niantic per ricevere il payload del guid. E' il semaforo di partenza.
    window.plugin.sak.semaphorenia = false;
    //semaforo per avviare la chiamata al server sak. è verde quando il semaforo nia è rosso
    window.plugin.sak.semaphoresak = false;
    //semaforo per avviare le chiamate per le fasi di rendering e visualizzazione a schermo dei dati. Il metodo è conclusivo e può essere ripetuto iteritamente o con ricorsione.
    window.plugin.sak.semaphorerender = false;
    window.plugin.sak.CONST_LIMIT_SENDSAK = 500;

    window.plugin.sak.mutexSak = function(callback, delay, interval)
    {
        if(interval == null)
            interval = 1000;
        if(delay == null)
            delay = 2;

        var countRetry = 0;
        var lock = false;
        var setAndLock = null;
        function mutex() { // a function called 'wait'
            if (countRetry == delay && lock) {
                callback();
                clearInterval(setAndLock); // stops the	 function being called again.
                lock = false;
                console.debug("Mutex generica concluso al retry "+countRetry);
            } else {
                countRetry++;
                console.debug("Mutex generica in attesa... "+countRetry);
                lock = true;
            }

        }
        if (!lock)
            setAndLock = setInterval(mutex, interval);	
    }

    window.plugin.sak.mutexSakPlext = function(callback, paramData)
    {
        var	interval = 10;
        var	delay = 1;

        var countRetry = 0;
        var lock = false;
        var setAndLock = null;
        function mutex() { // a function called 'wait'
            if (countRetry == delay && lock) {
                callback(paramData);
                clearInterval(setAndLock); // stops the	 function being called again.
                lock = false;
                console.debug("Mutex Plext concluso al retry "+countRetry);
            } else {
                countRetry++;
                console.debug("Mutex Plext in attesa... "+countRetry);
                lock = true;
            }

        }
        if (!lock)
            setAndLock = setInterval(mutex, interval);	
    }
    window.plugin.sak.mutexSemaphoreInitSend = function(callback)
    {
        var	interval = 1000;
        var	delay = 2;

        var countRetry = 0;
        var lock = false;
        var setAndLock = null;
        function mutex() { // a function called 'wait'
            if (window.plugin.sak.semaphoreinitsend && lock) {
                callback();
                clearInterval(setAndLock); // stops the	 function being called again.
                lock = false;
                console.debug("Mutex InitSendToSak concluso al retry "+countRetry);
            } else {
                countRetry++;
                console.debug("Mutex InitSendToSak in attesa... "+countRetry);
                lock = true;
            }

        }
        if (!lock)
            setAndLock = setInterval(mutex, interval);	
    }
    window.plugin.sak.mutexSemaphoreNia = function(callback)
    {
        var	interval = 100;
        var	delay = 2;

        var countRetry = 0;
        var lock = false;
        var setAndLock = null;
        function mutex() { // a function called 'wait'
            if (window.plugin.sak.semaphorenia && lock) {
                callback();
                clearInterval(setAndLock); // stops the	 function being called again.
                lock = false;
                console.debug("Mutex NIA concluso al retry "+countRetry);
            } else {
                countRetry++;
                console.debug("Mutex NIA in attesa... "+countRetry);
                lock = true;
            }

        }
        if (!lock)
            setAndLock = setInterval(mutex, interval);	
    }
    window.plugin.sak.mutexSemaphoreSak = function(callback)
    {
        var	interval = 1000;
        var	delay = 2;

        var countRetry = 0;
        var lock = false;
        var setAndLock = null;
        function mutex() { // a function called 'wait'
            if (window.plugin.sak.semaphoresak && lock) {
                callback();
                clearInterval(setAndLock); // stops the	 function being called again.
                lock = false;
                console.debug("Mutex SendSak concluso al retry "+countRetry);

            } else {
                countRetry++;
                console.debug("Mutex SendSak in attesa... "+countRetry);
                lock = true;
            }

        }
        if (!lock)
            setAndLock = setInterval(mutex, interval);	
    }	
    window.plugin.sak.mutexSemaphoreRender = function(callback)
    {
        var	interval = 100;
        var	delay = 2;

        var countRetry = 0;
        var lock = false;
        var setAndLock = null;
        var finishRetry = 0;
        function mutex() { // a function called 'wait'
            if (window.plugin.sak.semaphorerender && lock) {
                callback();
                clearInterval(setAndLock); // stops the	 function being called again.
                lock = false;
                console.debug("Mutex Render concluso al retry "+countRetry);
            } else {
                countRetry++;
                console.debug("Mutex Render in attesa... "+countRetry)
                lock = true;
            }

        }
        if (!lock)
            setAndLock = setInterval(mutex, interval);	
    }

    window.plugin.sak.mutexSakEntities = function(callback)
    {
        var	interval = 10;
        var	delay = 1;

        var countRetry = 0;
        var lock = false;
        var setAndLock = null;
        function mutex() { // a function called 'wait'
            if (window.plugin.sak.semaphoreentities && lock) {
                callback();
                clearInterval(setAndLock); // stops the	 function being called again.
                lock = false;
                console.debug("Mutex Entities concluso al retry "+countRetry);
            } else {
                countRetry++;
                console.debug("Mutex Entities in attesa... "+countRetry);
                lock = true;
            }

        }
        if (!lock)
            setAndLock = setInterval(mutex, interval);	
    }	
    //XXX: Punto cruciale per far eseguire in concorrenza l'intera registrazione portali
    //considerare la seguente logica:
    //fase chiamate nia -- popolamento dei dati nia in un array ad hoc
    //fase chiamate sak -- uso dell'array popolato dalle chiamate nia getportaldetail per inserire i dati sul sak
    //fase chiamate sak per il rendering iitc -- uso della stessa lista per interrogare il sak con i dati sak aggiornati per il rendering su mappa
    window.plugin.sak.registerTematizePortalNIA = function(guids)	{

        window.plugin.sak.semaphoreinitsend = true;
        window.plugin.sak.semaphorerender = false;

        console.log("--> Avvio registrazione portali sul server SAK");

        var callbackrender = function()
        {
            //window.plugin.sak.deleteRenderPortaliSAK();
            window.plugin.sak.refreshPortalDataSAK();
        }

        window.plugin.sak.mutexSemaphoreRender(callbackrender);

        if(guids.length == 0)
        {
            window.plugin.sak.semaphorerender = true;
            //window.plugin.sak.semaphorenia = true;
            //$('#esitoclient').html('Dati inviati correttamente.');
			window.plugin.sak.setTextConsole( 'Dati inviati correttamente.', 'consoleclient');	
				
        }
        else
        {
            var callbackStartSendToSak = function()
            {

                var packToSend = [];
                var constantBucket = window.plugin.sak.CONST_LIMIT_SENDSAK;
                var index = 0;
                var bucketAvailable = Math.floor(guids.length / constantBucket); //500 è una costante che definisce il numero massimo di oggetti per lista da inviare sequenzialmente al sistema di registrazione

                for(var i = 0; i <= bucketAvailable; i++)
                {
                    packToSend[i] = [];
                }

                var packCount = 0;
                $.each(guids, function(i, cguid) {

                    packCount++;

                    if(packCount > constantBucket)
                    {
                        index = index + 1;
                        packCount = 0;
                    }

                    packToSend[index].push(cguid);

                });


                //$('#esitoclient').html('Richiesta NIA sui dati dei portali selezionati.');
				window.plugin.sak.setTextConsole( 'Richiesta NIA sui dati dei portali selezionati in esecuzione', 'consoleclient');	
								
                $.each(packToSend, function(i, cbucket) {

                    var guids = cbucket;

                    var callbacknextbucket = function()
                    {
                        window.plugin.sak.semaphoreinitsend = false;
                        window.plugin.sak.semaphorenia = false;

                        $.each(guids, function(i, cguid) {


                            //$('#esitoclient').html('Richiesta NIA sul codice id: '+cguid);

                            //OLD: obsoleto sistema di rendering da dismettere
                            //window.plugin.sak.renderPortalDetails(portal.options.guid);

                            //XXX: chiamata rendering dopo aggiornamento. 
                            //window.plugin.sak.updatePortalDetails(portal.options.guid);

                            //XXX: esegue in sequenza l'aggiornamento senza il rendering e aggiorna il censimento su mappa
                            //candidato a essere il nuovo algoritmo
                            window.plugin.sak.getPortalDetailNiaRequest(cguid);
                        });


                        var callbacknia = function(){
                            //$('#esitoclient').html('Richiesta NIA terminata!!');
                            //var callback = function(){ $('#esitoclient').html('idle...');};
							window.plugin.sak.setTextConsole( 'Richiesta NIA terminata!!', 'consoleclient');	
							var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };
				
                            window.plugin.sak.mutexSak(callback);
                            window.plugin.sak.updateAllPortal();
                            window.plugin.sak.semaphoreinitsend = true;
                        };

                        window.plugin.sak.mutexSemaphoreNia(callbacknia);	
                    }

                    window.plugin.sak.mutexSemaphoreInitSend(callbacknextbucket);

                });

            }
            window.plugin.sak.mutexSak(callbackStartSendToSak);
        }
    }

    //callback istanziata ad un livello sopra del ciclo invio	
    window.plugin.sak.updateAllPortal = function()
    {
        window.plugin.sak.semaphoresak = false;

        console.info(">>> Avvio registrazione massiva dei portali censiti...");
        /*$.each(window.plugin.sak.dataniaqueue, function(i, dataportal) {

		window.plugin.sak.insertdataportale(dataportal.cGuid,dataportal.data.result);
	});*/
        window.plugin.sak.insertmultidataportale();

        /*var callBackRender = function(dataportal)
	{
		$.each(window.plugin.sak.dataniaqueue, function(i, dataportal) {
		console.log(">>> Rendering massivo dei portali coi dati SAK ...");
			window.plugin.sak.handleResponse(dataportal.cGuid,dataportal.data, true); 			
		});

		window.plugin.sak.dataniaqueue = [];
		window.plugin.sak.semaphorerender = false;
	};*/

        var callbackrefreshdatasak = function()
        {

            window.plugin.sak.dataniaqueue = [];

            //if(window.plugin.sak.dataniaretryqueue.length > 0)
            //{
            console.log("Ritento aggiornamento portali scartati...");
            //$('#esitoclient').html('Ritento aggiornamento portali scartati...');
            //var callback = function(){ $('#esitoclient').html('idle...');};
			window.plugin.sak.setTextConsole( 'Ritento aggiornamento portali scartati...', 'consoleclient');	
			var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');	 };

            window.plugin.sak.mutexSak(callback);


            var guids = [];
            for(var i=0; i<window.plugin.sak.dataniaretryqueue.length ; i++)
            {
                var cData = window.plugin.sak.dataniaretryqueue[i];

                guids.push(cData.cGuid);
            }
            window.plugin.sak.registerTematizePortalNIA(guids);
            window.plugin.sak.dataniaretryqueue = [];
            //window.plugin.sak.updateAllPortal();
            //}

        }


        window.plugin.sak.mutexSemaphoreSak(callbackrefreshdatasak);	  

    }

    window.plugin.sak.getPortalDetailNiaRequest = function(guid) {
        //if (!requestQueue[guid]) {
        //  requestQueue[guid] = true;

        window.plugin.sak.postAjax
        (
            'getPortalDetails',
            {guid:guid},
            function(data,textStatus,jqXHR)
            { 
                var dataPortal = {};
                dataPortal.cGuid = guid;
                dataPortal.data = data;
                window.plugin.sak.dataniaqueue.push(dataPortal);

                if(window.plugin.sak.countportaldetailcalls == 0)
                {
                    window.plugin.sak.semaphorenia = true;
                }


            },
            function() {

                if(window.plugin.sak.countportaldetailcalls == 0)
                {
                    window.plugin.sak.semaphorenia = true;
                }
                //window.plugin.sak.handleResponse(guid, undefined, false); 

            }
        );
        //}

    }

    window.plugin.sak.updatePortalDetails = function(guid) {
        window.plugin.sak.portalDetailRequest(guid);
    }
    window.plugin.sak.insertdataportale = function(cGuid, data)
    {
        console.info(">>>> Avvio procedura aggiornamento e rendering del portale con guid: " + cGuid);
        console.info(">>>> START >>>>");
        console.info("Invio dettagli del portale con guid: " + cGuid);
        if(data != null)
            $('#esitoclient').html('Invio dettagli del portale '+data[8]+' ...');
        else
        {
            //$('#anomaliaclient').html('Il portale ['+data.cGuid+'] non ha dati disponibili, pertanto verrà scartato.').css("color","yellow");
            //var callback = function(){ $('#anomaliaclient').html(''); };
            
			window.plugin.sak.setTextConsole( 'Il portale ['+data.cGuid+'] non ha dati disponibili, pertanto verrà scartato.', 'consoleaclient');	
			var callback = function(){ window.plugin.sak.setTextConsole( '', 'consoleaclient');	 };
			
			window.plugin.sak.mutexSak(callback);								

            return false;
        }

        var tipo = "UpdatePortal";
        window.plugin.sak.countcalls = window.plugin.sak.countcalls + 1;
        window.plugin.sak.ledSak = 'green';
        $("#countcalls").css('color',window.plugin.sak.ledSak);
        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

        window.plugin.sak.countcallsgis = window.plugin.sak.countcallsgis + 1;

        window.plugin.sak.countdetailportal = window.plugin.sak.countdetailportal +1;

        //window.plugin.sak.waitnextsendportal = true;
        $.post(
            window.plugin.sak.endpointsak,
            {
                context : "insertdataportale",
                objplayer : JSON.stringify(window.PLAYER),
                detailportal : JSON.stringify(data),
                guid : cGuid
            },
            function(data) {

                //$('#esitoserver').html('Portale '+cGuid+' aggiornato!');
				window.plugin.sak.setTextConsole( 'Portale '+cGuid+' aggiornato!', 'consoleserver');	
                
				console.info("> > > BIM BUM BAM ESITO SAK > > >");
                console.info("Dati inseriti: ");
                console.info(data.datimemorizzati);
                console.info(">  > tutto ok... ");
                console.info("<<<< END <<<<");
                if(window.plugin.sak.categoriaSakGis == 'censimento')
                    window.plugin.sak.deleteRenderSinglePortalSAK(cGuid);

                window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                $('#countcalls').html(window.plugin.sak.countcalls);
                if(window.plugin.sak.countcalls > 0)
                    $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);
                window.plugin.sak.countcallsgis = window.plugin.sak.countcallsgis - 1;
                window.plugin.sak.countdetailportal = window.plugin.sak.countdetailportal -1;

                /*if (window.plugin.sak.mustRegister) {
                    $('#registration')
                        .html(
                        '<fiedlset>Agente '
                        + window.PLAYER.nickname
                        + ' la registrazione è avvenuta con successo! Enjoy You!</fieldset>');
                    $('#consolericerca').show();

                    var callback = function(){ $('#registration').html('');};
                    window.plugin.sak.mutexSak(callback);
                }	*/					


                //var callback = function(){ $('#esitoclient').html('idle...');$('#esitoserver').html('idle...');};
				var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient'); };
				
                window.plugin.sak.mutexSak(callback);

                if(window.plugin.sak.countdetailportal == 0)
                {
                    window.plugin.sak.semaphorerender = true;
                }							

            })
            .fail(
            function(xhr, textStatus, errorThrown) {

                console.log(xhr.statusText);
                console.log(xhr.responseText);
                console.log(textStatus);
                console.error(error);
                window.plugin.sak.getFailError(xhr,textStatus, "Invio dettaglio portali");

                console.info(">  > qualcosa è andato storto :(  ");
                console.info("<<<< FAIL <<<<");

                window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                $('#countcalls').html(window.plugin.sak.countcalls);
                if(window.plugin.sak.countcalls > 0)
                    $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);
                window.plugin.sak.countcallsgis = window.plugin.sak.countcallsgis - 1;
                window.plugin.sak.countdetailportal = window.plugin.sak.countdetailportal -1;

                //alert
                console.error("Anomalia di comunicazione! Invio info portale fallita");
            });
    }

    window.plugin.sak.insertmultidataportale = function()
    {

        console.info(">>>> Avvio procedura aggiornamento e rendering dei portali selezionati.");
        console.info(">>>> START >>>>");

        var listdetailstosend = [];
        $.each(window.plugin.sak.dataniaqueue, function(i, dataportal) {

            if(dataportal.data.result != null)
            {			
                console.log("---> Dati portale pronto all'invio...");
                console.log(dataportal);
                listdetailstosend.push(dataportal);
            }
            else
            {
                console.log("---> Alcuni portali non hanno dati disponibili da inviare al SAK. Verrano reinterrogati successivamente.");
                
				//$('#anomaliaclient').html('Alcuni portali non hanno dati disponibili da inviare al Sak, pertanto verrà scartato in questo invio.').css("color","yellow");
                //var callback = function(){ $('#anomaliaclient').html(''); };
				window.plugin.sak.setTextConsole( 'Alcuni portali non hanno dati disponibili da inviare al Sak, pertanto verrà scartato in questo invio.', 'consoleaclient');	
				var callback = function(){ window.plugin.sak.setTextConsole( '', 'consoleaclient');	 };

                window.plugin.sak.mutexSak(callback);
                window.plugin.sak.dataniaretryqueue.push(dataportal);			
            }
        });

        var tipo = "MultiUpdatePortal";
        window.plugin.sak.countcalls = window.plugin.sak.countcalls + 1;	
        window.plugin.sak.countcallsgis = window.plugin.sak.countcallsgis + 1;	
        window.plugin.sak.countdetailportal = window.plugin.sak.countdetailportal +1;
        console.log(listdetailstosend);
        window.plugin.sak.ledSak = 'green';
        $("#countcalls").css('color',window.plugin.sak.ledSak);
        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

        $.post(
            window.plugin.sak.endpointsak,
            {
                context : "insertmultidataportale",
                objplayer : JSON.stringify(window.PLAYER),
                detailsportal : JSON.stringify(listdetailstosend)
            },
            function(data) {

                //$('#esitoserver').html('Portali selezionati aggiornati con successo!');
				window.plugin.sak.setTextConsole( 'Portali selezionati aggiornati con successo!', 'consoleserver');
                console.info("> > > BIM BUM BAM ESITO SAK > > >");
                console.info(data);
                console.info(">  > tutto ok... ");
                console.info("<<<< END <<<<");
                /*if(window.plugin.sak.categoriaSakGis == 'censimento')
							{
								window.plugin.sak.deleteRenderPortaliSAK();	
							}*/

                window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                $('#countcalls').html(window.plugin.sak.countcalls);
                if(window.plugin.sak.countcalls > 0)
                    $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);
                window.plugin.sak.countcallsgis = window.plugin.sak.countcallsgis - 1;
                window.plugin.sak.countdetailportal = window.plugin.sak.countdetailportal - 1;

                //var callback = function(){ $('#esitoclient').html('idle...');$('#esitoserver').html('idle...');};
				var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');window.plugin.sak.setTextConsole( 'idle...', 'consoleserver');	 };

                window.plugin.sak.mutexSak(callback,1,5000);

                if(window.plugin.sak.countdetailportal == 0)
                {
                    window.plugin.sak.semaphoresak = true;
                }							

            })
            .fail(
            function(xhr, textStatus, errorThrown) {

                console.log(xhr.statusText);
                console.log(xhr.responseText);
                console.log(textStatus);
                console.error(error);
                window.plugin.sak.getFailError(xhr,textStatus, "Invio dettaglio portali");

                console.info(">  > qualcosa è andato storto :(  ");
                console.info("<<<< FAIL <<<<");

                window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                $('#countcalls').html(window.plugin.sak.countcalls);
                if(window.plugin.sak.countcalls > 0)
                    $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);
                window.plugin.sak.countcallsgis = window.plugin.sak.countcallsgis - 1;
                window.plugin.sak.countdetailportal = window.plugin.sak.countdetailportal - 1;

                //var callback = function(){ $('#esitoclient').html('idle...');$('#esitoserver').html('idle...');};
				var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');window.plugin.sak.setTextConsole( 'idle...', 'consoleserver');	 };

                window.plugin.sak.mutexSak(callback,1,5000);

                if(window.plugin.sak.countdetailportal == 0)
                {
                    window.plugin.sak.semaphoresak = true;
                }							
                //alert
                console.error("Anomalia di comunicazione! Invio info portale fallita");
            });	

    }

    //window.plugin.sak.disableRecenti = false;
    //window.plugin.sak.disableAggiornati = false;


	window.plugin.sak.injectPaddingScroll = function()
	{
        window.plugin.sak.chat.paddingFilter = 0;
	}
	
    window.plugin.sak.resetChatArea = function()
    {

		window.plugin.sak.chat.paddingFilter = 0;
	 
        //XXX: reset dell'area di chat
        var b = clampLatLngBounds(map.getBounds());
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

	window.plugin.sak.supportedFlipFlop = 
	{
	 enablemulticallloggerchat : true,
	 enablesyncbookmarksak : false,
	 disablerecenti : false,
	 disableaggiornati : false,
	 prossimitaportali : false,
	 prossimitaguardian : false,
	 autocompletenickname : false,
	 sendmessagechat : false
	};
	
	window.plugin.sak.flipFlopGeneric = function(idFlipFlop)
	{
			if(window.plugin.sak.supportedFlipFlop[idFlipFlop] == null || !window.plugin.sak.supportedFlipFlop[idFlipFlop])
			{
				window.plugin.sak.supportedFlipFlop[idFlipFlop] = true;
			}
			else
				window.plugin.sak.supportedFlipFlop[idFlipFlop] = false;
			
			return window.plugin.sak.supportedFlipFlop[idFlipFlop];
	}
	
	window.plugin.sak.checkExpand = false;
	window.plugin.sak.toggleFilterArea = function()
	{
		//$("#chat").toggleClass('expand');
		//$("#chat").toggleClass('shrink');
		if(!window.plugin.sak.checkExpand)
			window.plugin.sak.checkExpand = true;
		else
			window.plugin.sak.checkExpand = false;
		
		if(window.plugin.sak.chat.enableFilter)
        {
			if(window.plugin.sak.checkExpand)
			{
				$("#chat").addClass('chatExpandCustom');
			}
			else
				$("#chat").removeClass('chatExpandCustom');
				
		}
		else
		{
			if(window.plugin.sak.checkExpand)
			{
				$("#chat").removeClass('chatExpandCustom');
				$("#chat").addClass('toggle expand');
			}
			else
			{
				$("#chat").addClass('toggle shrink');
			}

		}
	}
	
    window.plugin.sak.flipFlopCheckBox = function(typecheckbox) {

        console.log("Avviato il checkbox per "+typecheckbox);

        switch (typecheckbox) {


            case 'enableFilter':

                window.plugin.sak.resetChatArea();

                if(window.plugin.sak.chat.enableFilter)
                {
                    window.plugin.sak.chat.enableFilter = false;
                    window.plugin.sak.nameenablefilter = "Attiva filtro";

                    $("#sectionFilterChat").hide();
                    $('#sectionFilterChatMobile').hide();
					$("#chatcontrols").removeClass('chatControlAdapt');
					$("#chatcontrols").addClass('chatControlOri');

					if(window.plugin.sak.checkExpand)
					{
						$("#chat").removeClass('chatExpandCustom');
						$("#chat").addClass('toggle expand');
					}
					
                }
                else
                {
                    window.plugin.sak.chat.ignoreActions = 0;
                    window.plugin.sak.chat.enableFilter = true;
                    window.plugin.sak.nameenablefilter = "Disattiva filtro";
                    $("#sectionFilterChat").show();
                    $('#sectionFilterChatMobile').show();
					$("#chatcontrols").removeClass('chatControlOri');
					$("#chatcontrols").addClass('chatControlAdapt');
					
					if(window.plugin.sak.checkExpand)
					{
						$("#chat").addClass('chatExpandCustom');
						$("#chat").removeClass('toggle expand');
					}

                }

                break;
            case 'filterAlerts':

                window.plugin.sak.resetChatArea();

                if(window.plugin.sak.chat.filterAlerts)
                {
                    window.plugin.sak.chat.filterAlerts = false;
                }
                else
                {
                    window.plugin.sak.chat.filterAlerts = true;
                    window.plugin.sak.chat.ignoreActions = 0;
                }

                break;
            case 'filterMessage':

                window.plugin.sak.resetChatArea();

                if(window.plugin.sak.chat.filterMessage)
                {
                    window.plugin.sak.chat.filterMessage = false;
                }
                else
                {
                    window.plugin.sak.chat.ignoreActions = 0;
                    window.plugin.sak.chat.filterMessage = true;
                }

                break;

            case 'filterReso':

                window.plugin.sak.resetChatArea();

                if(window.plugin.sak.chat.filterReso)
                {
                    window.plugin.sak.chat.filterReso = false;
                }
                else
                {
                    window.plugin.sak.chat.ignoreActions = 0;
                    window.plugin.sak.chat.filterReso = true;
                }

                break;
            case 'filterLinks':

                window.plugin.sak.resetChatArea();

                if(window.plugin.sak.chat.filterLinks)
                {
                    window.plugin.sak.chat.filterLinks = false;
                }
                else
                {
                    window.plugin.sak.chat.ignoreActions = 0;
                    window.plugin.sak.chat.filterLinks = true;
                }

                break;
            case 'filterCaptured':

                window.plugin.sak.resetChatArea();

                if(window.plugin.sak.chat.filterCaptured)
                {
                    window.plugin.sak.chat.filterCaptured = false;
                }
                else
                {
                    window.plugin.sak.chat.ignoreActions = 0;
                    window.plugin.sak.chat.filterCaptured = true;
                }

                break;
            case 'filterControlField':

                window.plugin.sak.resetChatArea();

                if(window.plugin.sak.chat.filterControlField)
                {
                    window.plugin.sak.chat.filterControlField = false;
                }
                else
                {
                    window.plugin.sak.chat.ignoreActions = 0;
                    window.plugin.sak.chat.filterControlField = true;
                }

                break;
            case 'filterPlayer':

                window.plugin.sak.resetChatArea();

                if(window.plugin.sak.chat.filterPlayer)
                {
                    window.plugin.sak.chat.filterPlayer = false;

                    /*
				Disabilitazione del filtro su alcune actions
				*/
                    $("#filterControlField").prop( "checked", false );
                    window.plugin.sak.chat.filterControlField = false;

                    $("#filterCaptured").prop( "checked", false );
                    window.plugin.sak.chat.filterCaptured = false;

                    $("#filterLinks").prop( "checked", false );
                    window.plugin.sak.chat.filterLinks = false;

                    $("#filterReso").prop( "checked", false );
                    window.plugin.sak.chat.filterReso = false;

                    $("#filterMessage").prop( "checked", false );
                    window.plugin.sak.chat.filterMessage = false;				
                }
                else
                {
                    window.plugin.sak.chat.ignoreActions = 0;
                    window.plugin.sak.chat.filterPlayer = true;

                    /*
				Abilitazione del filtro su alcune actions
				*/
                    $("#filterControlField").prop( "checked", true );
                    window.plugin.sak.chat.filterControlField = true;

                    $("#filterCaptured").prop( "checked", true );
                    window.plugin.sak.chat.filterCaptured = true;

                    $("#filterLinks").prop( "checked", true );
                    window.plugin.sak.chat.filterLinks = true;

                    $("#filterReso").prop( "checked", true );
                    window.plugin.sak.chat.filterReso = true;

                    $("#filterMessage").prop( "checked", true );
                    window.plugin.sak.chat.filterMessage = true;
                }


                break;
            case 'filterSpam':

                window.plugin.sak.resetChatArea();

                if(window.plugin.sak.chat.filterSpam)
                {
                    window.plugin.sak.chat.filterSpam = false;
                }
                else
                {
                    window.plugin.sak.chat.ignoreActions = 0;
                    window.plugin.sak.chat.filterSpam = true;
                }

                break;	
			case 'urlroutewaypoints':

                if (window.plugin.sak.urlroutewaypoints) {
                    window.plugin.sak.urlroutewaypoints = false;


                    $("#goroutewaypoints").remove();
                    window.plugin.sak.urlwaypoint = "";
                    window.plugin.sak.countwaypoint = 0;
                    $('#goroutewaypoints').attr('href',window.plugin.sak.urlwaypoint);
                    $('#urlroutefinished').hide();
                    $('#elencowaypoints').empty();

                    $('#consolewaypoint').hide();

                } else {
                    window.plugin.sak.urlroutewaypoints = true;

                    $('#consolewaypoint').show();
                }	

                break;	
            case 'overridemaxtsgetplext':

                if(window.plugin.sak.overridemaxtsgetplext)
                {
                    window.plugin.sak.overridemaxtsgetplext = false;
                    $("#timeStampMaxGetPlext").hide();
                }
                else
                {
                    window.plugin.sak.overridemaxtsgetplext = true;
                    $("#timeStampMaxGetPlext").show();
                }

                break;				
            default:

                break;
           /* case 'enablemulticallloggerchat':

                if(window.plugin.sak.onceCallLoggerchat)
                {
                    window.plugin.sak.onceCallLoggerchat = false;
                }
                else
                    window.plugin.sak.onceCallLoggerchat = true;

                break;
            case 'disablerecenti':

                if (window.plugin.sak.disableRecenti) {
                    window.plugin.sak.disableRecenti = false;

                } else {
                    window.plugin.sak.disableRecenti = true;
                }

                break;
            case 'disableaggiornati':

                if (window.plugin.sak.disableAggiornati) {
                    window.plugin.sak.disableAggiornati = false;

                } else {
                    window.plugin.sak.disableAggiornati = true;
                }

                break;	*/			
            case 'prossimitaportali':

                if (window.plugin.sak.prossimitaportali) {
                    window.plugin.sak.prossimitaportali = false;

                } else {
                    window.plugin.sak.prossimitaportali = true;
                }	

                break;
            case 'prossimitaguardian':

                if (window.plugin.sak.prossimitaguardian) {
                    window.plugin.sak.prossimitaguardian = false;

                } else {
                    window.plugin.sak.prossimitaguardian = true;
                }
                break;
            case 'autocompletenickname':
                if(window.plugin.sak.autocompletenickname)
                {
                    window.plugin.sak.autocompletenickname = false;
                }
                else
                {
                    window.plugin.sak.autocompletenickname = true;
                }
                break;
            case 'sendmessagechat':

                if(window.plugin.sak.sendmessagechat)
                {
                    window.plugin.sak.sendmessagechat = false;
                }
                else
                {
                    window.plugin.sak.sendmessagechat = true;
                }
                break;				
        }

    }

    // il metodo si limita a controllare se il giocatore owned del portale
    // selezionato ha almeno un resonatore deployato
    window.plugin.sak.checkreso = function(e, t) {
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


    //--------------------------------------
    //--------------------------------------
    //--------------------------------------
    //--------------------------------------


    //--------------------------------------
    //--------------------------------------
    //Metodi IITC in OVERRIDE
    //--------------------------------------
    //--------------------------------------


    /// PORTAL DETAIL //////////////////////////////////////
    // code to retrieve the new portal detail data from the servers

    // NOTE: the API for portal detailed information is NOT FINAL
    // this is a temporary measure to get things working again after a major change to the intel map
    // API. expect things to change here

    //-----------------------------------------------------------------------------
    // Metodi in override per accedere all'oggetto DataCache.
    // usato dall'intel per accedere ai dati dei portali memorizzati
    //-----------------------------------------------------------------------------

    window.plugin.sak.cache;// = window.DataCache;
    var requestQueue = {};

    window.plugin.sak.portalDetail = function() {};

    window.plugin.sak.portalDetailSetup = function() {
        window.plugin.sak.cache = new DataCache();

        window.plugin.sak.cache.startExpireInterval(20);
    }

    window.plugin.sak.portalDetailGet = function(guid) {
        return window.plugin.sak.cache.get(guid);
    }

    window.plugin.sak.portalDetailIsFresh = function(guid) {
        return window.plugin.sak.cache.isFresh(guid);
    }

    window.plugin.sak.renderUpdateStatus = function() {
        var progress = 1;

        // portal/limk level display

        var zoom = map.getZoom();
        zoom = getDataZoomForMapZoom(zoom);
        var tileParams = getMapZoomTileParameters(zoom);

        var t = '<span class="help portallevel" title="Indicates portal levels/link lengths displayed.  Zoom in to display more.">';

        if (tileParams.hasPortals) {
            // zoom level includes portals (and also all links/fields)
            if(!window.isSmartphone()) // space is valuable
                t += '<b>portals</b>: ';
            if(tileParams.level === 0)
                t += '<span id="loadlevel">all</span>';
            else
                t += '<span id="loadlevel" style="background:'+COLORS_LVL[tileParams.level]+'">L'+tileParams.level+(tileParams.level<8?'+':'') + '</span>';
        } else {
            if(!window.isSmartphone()) // space is valuable
                t += '<b>links</b>: ';

            if (tileParams.minLinkLength > 0)
                t += '<span id="loadlevel">&gt;'+(tileParams.minLinkLength>1000?tileParams.minLinkLength/1000+'km':tileParams.minLinkLength+'m')+'</span>';
            else
                t += '<span id="loadlevel">all links</span>';
        }

        t +='</span>';


        // map status display
        t += ' <span class="map"><b>map</b>: ';

        if (window.mapDataRequest) {
            var status = window.mapDataRequest.getStatus();

            var valueProgress = 0;
            // status.short - short description of status
            // status.long - longer description, for tooltip (optional)
            // status.progress - fractional progress (from 0 to 1; -1 for indeterminate) of current state (optional)
            if (status.long)
                t += '<span class="help" title="'+status.long+'">'+status.short+'</span>';
            else
                t += '<span>'+status.short+'</span>';

            if (status.progress !== undefined) {

                valueProgress = Math.floor(status.progress*100);

                var random = Math.floor((Math.random() * 5) + 1);
                console.log("---> Stato di caricamento mappa: "+valueProgress+"% scarto casuale "+random);

                if(valueProgress > -1)
                {
                    var content = $('#countniacalls').html();
                    content = content+" "+valueProgress+"%";
                    $('#countniacalls').html(content);
                }

                if(valueProgress % (10+random) == 0 && window.plugin.sak.semaphorerefresh)
                {
                    window.plugin.sak.semaphorerefresh = false;
                    console.log("---> Intermedio al "+valueProgress+"%");
                    window.plugin.sak.mutexSak(window.plugin.sak.refreshPortalDataSAK,1,5);
                }
                else
                    window.plugin.sak.semaphorerefresh = false;

                if(status.progress !== -1)
                    t += ' '+valueProgress+'%';
                progress = status.progress;


            }
        } else {
            // no mapDataRequest object - no status known
            t += '...unknown...';
        }

        t += '</span>';

        //request status
        if (window.activeRequests.length > 0)
            t += ' ' + window.activeRequests.length + ' requests';
        if (window.failedRequestCount > 0)
            t += ' <span style="color:#f66">' + window.failedRequestCount + ' failed</span>'


            //it's possible that updating the status bar excessively causes some performance issues. so rather than doing it
            //immediately, delay it to the next javascript event loop, cancelling any pending update
            // will also cause any browser-related rendering to occur first, before the status actually updates

            if (window.renderUpdateStatusTimer_) clearTimeout(window.renderUpdateStatusTimer_);

        window.renderUpdateStatusTimer_ = setTimeout ( function() {
            window.renderUpdateStatusTimer_ = undefined;

            $('#innerstatus').html(t);
            //$('#updatestatus').click(function() { startRefreshTimeout(10); });
            //. <a style="cursor: pointer" onclick="startRefreshTimeout(10)" title="Refresh">⟳</a>';

            if(progress == 1 && window.activeRequests.length > 0) {
                // we don't know the exact progress, but we have requests (e.g. chat) running, so show it as indeterminate.
                progress = -1;
            }

            if (typeof android !== 'undefined' && android && android.setProgress)
                android.setProgress(progress);
        }, 0);

    }

    window.plugin.sak.handleResponse = function(guid, data, success) {
        delete requestQueue[guid];



        if (!data || data.error || !data.result) {
            success = false;
        }

        if (success) {

            var dict = decodeArray.portalDetail(data.result);

            // entity format, as used in map data
            var ent = [guid,dict.timestamp,data.result];

            window.plugin.sak.cache.store(guid,dict);

            //FIXME..? better way of handling sidebar refreshing...

            //if (guid == selectedPortal) {
            window.plugin.sak.renderPortalDetails(guid);
            //}

            window.runHooks ('portalDetailLoaded', {guid:guid, success:success, details:dict, ent:ent});

        } else {
            if (data && data.error == "RETRY") {
                // server asked us to try again
                window.plugin.sak.portalDetailRequest(guid);
            } else {
                window.runHooks ('portalDetailLoaded', {guid:guid, success:success});
            }
        }

    }

    window.plugin.sak.renderPortalDetails = function(guid) {
        window.plugin.sak.selectPortal(window.portals[guid] ? guid : null);

        if (guid && !portalDetail.isFresh(guid)) {
            window.plugin.sak.portalDetailRequest(guid);
        }

        // TODO? handle the case where we request data for a particular portal GUID, but it *isn't* in
        // window.portals....

        if(!window.portals[guid]) {
            urlPortal = guid;
            $('#portaldetails').html('');
            if(isSmartphone()) {
                $('.fullimg').remove();
                $('#mobileinfo').html('<div style="text-align: center"><b>tap here for info screen</b></div>');
            }
            return;
        }

        var portal = window.portals[guid];
        var data = portal.options.data;
        var details = portalDetail.get(guid);

        // details and data can get out of sync. if we have details, construct a matching 'data'
        if (details) {
            data = getPortalSummaryData(details);
        }


        var modDetails = details ? '<div class="mods">'+getModDetails(details)+'</div>' : '';
        var miscDetails = details ? getPortalMiscDetails(guid,details) : '';
        var resoDetails = details ? getResonatorDetails(details) : '';

        //TODO? other status details...
        var statusDetails = details ? '' : '<div id="portalStatus">Loading details...</div>';


        var img = fixPortalImageUrl(details ? details.image : data.image);
        var title = (details && details.title) || (data && data.title) || '(untitled)';

        var lat = data.latE6/1E6;
        var lng = data.lngE6/1E6;

        var imgTitle = title+'\n\nClick to show full image.';


        // portal level. start with basic data - then extend with fractional info in tooltip if available
        var levelInt = (teamStringToId(data.team) == TEAM_NONE) ? 0 : data.level;
        var levelDetails = levelInt;
        if (details) {
            levelDetails = getPortalLevel(details);
            if(levelDetails != 8) {
                if(levelDetails==Math.ceil(levelDetails))
                    levelDetails += "\n8";
                else
                    levelDetails += "\n" + (Math.ceil(levelDetails) - levelDetails)*8;
                levelDetails += " resonator level(s) needed for next portal level";
            } else {
                levelDetails += "\nfully upgraded";
            }
        }
        levelDetails = "Level " + levelDetails;


        var linkDetails = [];

        var posOnClick = 'window.showPortalPosLinks('+lat+','+lng+',\''+escapeJavascriptString(title)+'\')';
        var permalinkUrl = '/intel?ll='+lat+','+lng+'&z=17&pll='+lat+','+lng;

        if (typeof android !== 'undefined' && android && android.intentPosLink) {
            // android devices. one share link option - and the android app provides an interface to share the URL,
            // share as a geo: intent (navigation via google maps), etc

            var shareLink = $('<div>').html( $('<a>').attr({onclick:posOnClick}).text('Share portal') ).html();
            linkDetails.push('<aside>'+shareLink+'</aside>');

        } else {
            // non-android - a permalink for the portal
            var permaHtml = $('<div>').html( $('<a>').attr({href:permalinkUrl, title:'Create a URL link to this portal'}).text('Portal link') ).html();
            linkDetails.push ( '<aside>'+permaHtml+'</aside>' );

            // and a map link popup dialog
            var mapHtml = $('<div>').html( $('<a>').attr({onclick:posOnClick, title:'Link to alternative maps (Google, etc)'}).text('Map links') ).html();
            linkDetails.push('<aside>'+mapHtml+'</aside>');

        }

        $('#portaldetails')
            .html('') //to ensure it's clear
            .attr('class', TEAM_TO_CSS[teamStringToId(data.team)])
            .append(
            $('<h3>').attr({class:'title'}).text(title),

            $('<span>').attr({
                class: 'close',
                title: 'Close [w]',
                onclick:'window.plugin.sak.renderPortalDetails(null); if(isSmartphone()) show("map");',
                accesskey: 'w'
            }).text('X'),

            // help cursor via ".imgpreview img"
            $('<div>')
            .attr({class:'imgpreview', title:imgTitle, style:"background-image: url('"+img+"')"})
            .append(
                $('<span>').attr({id:'level', title: levelDetails}).text(levelInt),
                $('<img>').attr({class:'hide', src:img})
            ),

            modDetails,
            miscDetails,
            resoDetails,
            statusDetails,
            '<div class="linkdetails">' + linkDetails.join('') + '</div>'
        );

        // only run the hooks when we have a portalDetails object - most plugins rely on the extended data
        // TODO? another hook to call always, for any plugins that can work with less data?
        if (details) {
            window.runHooks('portalDetailsUpdated', {guid: guid, portal: portal, portalDetails: details, portalData: data});
        }
    };	


    window.plugin.sak.portalDetailRequest = function(guid) {
        if (!requestQueue[guid]) {
            requestQueue[guid] = true;

            window.plugin.sak.postAjax
            (
                'getPortalDetails',
                {guid:guid},
                function(data,textStatus,jqXHR)
                { 
                    window.plugin.sak.insertdataportale(guid,data.result);

                    window.plugin.sak.handleResponse(guid, data, true); 

                },
                function() {
                    window.plugin.sak.handleResponse(guid, undefined, false); 

                }
            );
        }

    }

window.plugin.sak.datahandshake = {};
	
window.plugin.sak.handshakenia = function()
{
	var versionStr = niantic_params.CURRENT_VERSION;

	/*
	{nemesisSoftwareVersion="2017-02-14T16:24:12Z 6d9735dee320 opt",deviceSoftwareVersion="1.114.0"}
	*/

	var params = {};

	params.nemesisSoftwareVersion = "2017-02-14T16:24:12Z 6d9735dee320 opt";
	params.deviceSoftwareVersion = "1.114.0";

	var post_data = JSON.stringify(params);


	console.info(">>> Parametri request verso server App Ingress ...");
	console.info("---> url : https://m-dot-betaspike.appspot.com/handshake");
	console.info(params);
	console.info("<<< Fine analisi parametri chiamata App Ingress !");

	$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('User-Agent','Nemesis(gzip)');
    }
});
	
	$.ajax({
      url:"https://m-dot-betaspike.appspot.com/handshake",
      type:'POST',
      contentType:'application/json',
      dataType:'json',
      headers: { 
        'User-Agent' : 'Nemesis(gzip)'
      },
	  beforeSend: function(req) {
		  req.setRequestHeader('User-Agent','Nemesis(gzip)');
		},	  
      data:{ nemesisSoftwareVersion: "2017-02-14T16:24:12Z 6d9735dee320 opt", deviceSoftwareVersion: "1.114.0" },
 	  success: [window.plugin.sak.onSuccessApiIngress],
	  error: [window.plugin.sak.onErrorApiIngress],
    });
	
	
	/*$.ajax ({
    url: "https://m-dot-betaspike.appspot.com/handshake",
    type: "POST",
    headers: {
        'User-Agent' : 'Nemesis(gzip)'
    },
	data: post_data,
    dataType: "json",
    contentType: "application/json",
    success: function(){
        console.info("Chiamata avvenuta con successo!");
    },
	error: function(){
		console.info("Chiamata andata in errore!");
	}
	});*/
	
	/*var result = $.ajax({
    url: 'https://m-dot-betaspike.appspot.com/handshake',
    type: 'POST',
    dataType: 'json',
    param: post_data,
    success: [window.plugin.sak.onSuccessInventory],
    error: [window.plugin.sak.onErrorInventory],
    contentType: 'application/json;',
	headers: {
			"user-agent": 'Nemesis(gzip)'  //for object property name, use quoted notation shown in second
		},	
    beforeSend: function(req) {
      req.setRequestHeader('user-agent',"Nemesis(gzip)");
    }
  });*/
  
  


}

  window.plugin.sak.onErrorApiIngress = function(jqXHR, textStatus, errorThrown) {

	console.info(">>> Si è verificato un errore durante l'accesso alle chiamate riservate al gioco Ingress");
	console.info(jqXHR);
	console.info(textStatus);
	console.info(errorThrown);

  };

  window.plugin.sak.onSuccessApiIngress = function(data, textStatus, jqXHR) {

	console.info(">>> Accesso alle chiamate Ingress avvenuto con successo!!");
	console.info(jqXHR);
	console.info(textStatus);
	console.info(data);
	
	window.plugin.sak.datahandshake = data;

  };
	
window.plugin.sak.getInventory = function()
{
	var versionStr = niantic_params.CURRENT_VERSION;
	data = {player: 'test'};

	var post_data = JSON.stringify($.extend({}, data, {v: versionStr}));


	var action = 'getInventory';


	console.info(">>> Parametri request verso server Niantic ...");
	console.info("---> url : ["+'/r/'+action+"]");
	console.info("---> data : ["+post_data+"]");
	console.info("---> context : ");
	console.info(data);
	console.info("---> X-CSRFToken : ["+window.plugin.sak.readCookie('csrftoken')+"]");
	console.info("<<< Fine analisi parametri chiamata Niantic !");

	var result = $.ajax({
    url: 'rpc/playerUndecorated/'+action,
    type: 'POST',
    data: post_data,
    context: data,
    dataType: 'json',
    success: [window.plugin.sak.onSuccessInventory],
    error: [window.plugin.sak.onErrorInventory],
    contentType: 'application/json; charset=utf-8',
    beforeSend: function(req) {
      req.setRequestHeader('X-CSRFToken', window.plugin.sak.readCookie('csrftoken'));
    }
  });

}



    //-----------------------------------------------------------------------------
    //-----------------------------------------------------------------------------


    //-----------------------------------------------------------------------------
    //-----------------------------------------------------------------------------
    //                  Set funzioni per accedere alle chiamate Niantic 
    // posts AJAX request to Ingress API.
    // action: last part of the actual URL, the rpc/dashboard. is
    //         added automatically
    // data: JSON data to post. method will be derived automatically from
    //       action, but may be overridden. Expects to be given Hash.
    //       Strings are not supported.
    // success: method to call on success. See jQuery API docs for avail-
    //          able arguments: http://api.jquery.com/jQuery.ajax/
    // error: see above. Additionally it is logged if the request failed.
    window.plugin.sak.postAjax = function(action, data, successCallback, errorCallback) {
        // state management functions... perhaps should be outside of this func?

        //var callbackSendReqNia = function()
        //{
        if(action == 'getPortalDetails')
        {
            window.plugin.sak.countportaldetailcalls = window.plugin.sak.countportaldetailcalls  + 1;
        }

        var tipo = window.plugin.sak.replaceAll(action,"get", "");
        window.plugin.sak.countniacalls = window.plugin.sak.countniacalls + 1;
        $('#countniacalls').html(window.plugin.sak.countniacalls+" "+tipo);


        //  var remove = function(data, textStatus, jqXHR) { window.requests.remove(jqXHR); };
        //  var errCnt = function(jqXHR) { window.failedRequestCount++; window.requests.remove(jqXHR); };

        if (window.latestFailedRequestTime && window.latestFailedRequestTime < Date.now()-120*1000) {
            // no errors in the last two minutes - clear the error count
            window.failedRequestCount = 0;
            window.latestFailedRequestTime = undefined;
        }

        var onError = function(jqXHR, textStatus, errorThrown) {
            window.requests.remove(jqXHR);
            window.failedRequestCount++;

            window.latestFailedRequestTime = Date.now();

            window.plugin.sak.countniacalls = window.plugin.sak.countniacalls - 1;
            var countnia = window.plugin.sak.countniacalls;
            if(countnia > 0)
                countnia = window.plugin.sak.countniacalls+" "+tipo;
            $('#countniacalls').html(countnia);

            window.plugin.sak.ledNia = 'red';
            $("#countniacalls").css('color',window.plugin.sak.ledNia);

            if(action == 'getPortalDetails')
            {
                window.plugin.sak.countportaldetailcalls = window.plugin.sak.countportaldetailcalls  - 1;
            }

            // pass through to the user error func, if one exists
            if (errorCallback) {
                errorCallback(jqXHR, textStatus, errorThrown);
            }
        };

        var onSuccess = function(data, textStatus, jqXHR) {
            window.requests.remove(jqXHR);

            if(action == 'getPortalDetails')
            {
                window.plugin.sak.countportaldetailcalls = window.plugin.sak.countportaldetailcalls  - 1;
            }
            window.plugin.sak.countniacalls = window.plugin.sak.countniacalls - 1;
            var countnia = window.plugin.sak.countniacalls;
            if(countnia > 0)
                countnia = window.plugin.sak.countniacalls+" "+tipo;
            $('#countniacalls').html(countnia);

            //$('#countniacalls').html(window.plugin.sak.countniacalls+" "+tipo);

            // the Niantic server can return a HTTP success, but the JSON response contains an error. handle that sensibly
            if (data && data.error && data.error == 'out of date') {
                window.failedRequestCount++;
                // let's call the error callback in thos case...
                if (errorCallback) {

                    window.plugin.sak.ledNia = 'red';
                    $("#countniacalls").css('color',window.plugin.sak.ledNia);

                    errorCallback(jqXHR, textStatus, "data.error == 'out of date'");
                }

                window.plugin.sak.outOfDateUserPrompt();
            } else {

                window.plugin.sak.ledNia = 'green';
                $("#countniacalls").css('color',window.plugin.sak.ledNia);

                successCallback(data, textStatus, jqXHR);
            }
        };

        // we set this flag when we want to block all requests due to having an out of date CURRENT_VERSION
        if (window.blockOutOfDateRequests) {
            window.failedRequestCount++;
            window.latestFailedRequestTime = Date.now();

            // call the error callback, if one exists
            if (errorCallback) {
                // NOTE: error called on a setTimeout - as it won't be expected to be synchronous
                // ensures no recursion issues if the error handler immediately resends the request
                setTimeout(function(){errorCallback(null, undefined, "window.blockOutOfDateRequests is set");}, 10);
            }
            return;
        }

        var versionStr = niantic_params.CURRENT_VERSION;
        var post_data = JSON.stringify($.extend({}, data, {v: versionStr}));

        console.log(">>> Parametri request verso server Niantic ...");
        console.log("---> url : ["+'/r/'+action+"]");
        console.log("---> data : ["+post_data+"]");
        console.log("---> context : ");
        console.log(data);
        console.log("---> X-CSRFToken : ["+window.plugin.sak.readCookie('csrftoken')+"]");
        console.log("<<< Fine analisi parametri chiamata Niantic !");

        var result = $.ajax({
            url: '/r/'+action,
            type: 'POST',
            data: post_data,
            context: data,
            dataType: 'json',
            success: [onSuccess],
            error: [onError],
            contentType: 'application/json; charset=utf-8',
            beforeSend: function(req) {
                req.setRequestHeader('X-CSRFToken', window.plugin.sak.readCookie('csrftoken'));
            }
        });
        result.action = action;

        console.log(result);
        requests.add(result);

        return result;

        //}

        //window.plugin.sak.mutexSak(callbackSendReqNia,1,100);

    }

    window.plugin.sak.outOfDateUserPrompt = function()
    {
        // we block all requests while the dialog is open. 
        if (!window.blockOutOfDateRequests) {
            window.blockOutOfDateRequests = true;

            dialog({
                title: 'Reload IITC',
                html: '<p>IITC is using an outdated version code. This will happen when Niantic update the standard intel site.</p>'
                +'<p>You need to reload the page to get the updated changes.</p>'
                +'<p>If you have just reloaded the page, then an old version of the standard site script is cached somewhere.'
                +'In this case, try clearing your cache, or waiting 15-30 minutes for the stale data to expire.</p>',
                buttons: {
                    'RELOAD': function() {
                        if (typeof android !== 'undefined' && android && android.reloadIITC) {
                            android.reloadIITC();
                        } else {
                            window.location.reload();
                        }
                    }
                },
                close: function(event, ui) {
                    delete window.blockOutOfDateRequests;
                }

            });


        }

    };

    // as of 2014-08-14, Niantic have returned to minifying the javascript. This means we no longer get the nemesis object
    // and it's various member objects, functions, etc.
    // so we need to extract some essential parameters from the code for IITC to use

    //Override parametri niantic
    window.plugin.sak.niantic_params = {};

    window.plugin.sak.extractFromStock = function() {
        window.plugin.sak.niantic_params = {}

        console.log(">>>> Recupero personalizzato dei parametri Niantic in corso...");

        // extract the former nemesis.dashboard.config.CURRENT_VERSION from the code
        var reVersion = new RegExp('"X-CSRFToken".*[a-z].v="([a-f0-9]{40})";');

        var minified = new RegExp('^[a-zA-Z$][a-zA-Z$0-9]?$');

        for (var topLevel in window) {
            if (minified.test(topLevel)) {
                // a minified object - check for minified prototype entries

                var topObject = window[topLevel];
                if (topObject && topObject.prototype) {

                    // the object has a prototype - iterate through the properties of that
                    for (var secLevel in topObject.prototype) {
                        if (minified.test(secLevel)) {
                            // looks like we've found an object of the format "XX.prototype.YY"...
                            var item = topObject.prototype[secLevel];

                            if (item && typeof(item) == "function") {
                                // a function - test it against the relevant regular expressions
                                var funcStr = item.toString();

                                var match = reVersion.exec(funcStr);
                                if (match) {
                                    console.log('Found former CURRENT_VERSION in '+topLevel+'.prototype.'+secLevel);
                                    window.plugin.sak.niantic_params.CURRENT_VERSION = match[1];
                                    console.log("---> Corrente versione Niantic: "+window.plugin.sak.niantic_params.CURRENT_VERSION);

                                }
                            }
                        }
                    }

                } //end 'if .prototype'

                if (topObject && Array.isArray && Array.isArray(topObject)) {
                    // find all non-zero length arrays containing just numbers
                    if (topObject.length>0) {
                        var justInts = true;
                        for (var i=0; i<topObject.length; i++) {
                            if (typeof(topObject[i]) !== 'number' || topObject[i] != parseInt(topObject[i])) {
                                justInts = false;
                                break;
                            }
                        }
                        if (justInts) {

                            // current lengths are: 17: ZOOM_TO_LEVEL, 14: TILES_PER_EDGE
                            // however, slightly longer or shorter are a possibility in the future

                            if (topObject.length >= 12 && topObject.length <= 18) {
                                // a reasonable array length for tile parameters
                                // need to find two types:
                                // a. portal level limits. decreasing numbers, starting at 8
                                // b. tiles per edge. increasing numbers. current max is 36000, 9000 was the previous value - 18000 is a likely possibility too

                                if (topObject[0] == 8) {
                                    // check for tile levels
                                    var decreasing = true;
                                    for (var i=1; i<topObject.length; i++) {
                                        if (topObject[i-1] < topObject[i]) {
                                            decreasing = false;
                                            break;
                                        }
                                    }
                                    if (decreasing) {
                                        console.log ('int array '+topLevel+' looks like ZOOM_TO_LEVEL: '+JSON.stringify(topObject));
                                        window.plugin.sak.niantic_params.ZOOM_TO_LEVEL = topObject;
                                        console.log("---> Levello di zoom corrente: "+window.plugin.sak.niantic_params.ZOOM_TO_LEVEL);
                                    }
                                } // end if (topObject[0] == 8)

                                // 2015-06-25 - changed to top value of 64000, then to 32000 - allow for them to restore it just in case
                                if (topObject[topObject.length-1] >= 9000 && topObject[topObject.length-1] <= 64000) {
                                    var increasing = true;
                                    for (var i=1; i<topObject.length; i++) {
                                        if (topObject[i-1] > topObject[i]) {
                                            increasing = false;
                                            break;
                                        }
                                    }
                                    if (increasing) {
                                        console.log ('int array '+topLevel+' looks like TILES_PER_EDGE: '+JSON.stringify(topObject));
                                        window.plugin.sak.niantic_params.TILES_PER_EDGE = topObject;
                                        console.log("---> Titolo per Edge corrente: "+window.plugin.sak.niantic_params.TILES_PER_EDGE);
                                    }

                                } //end if (topObject[topObject.length-1] == 9000) {

                            }
                        }
                    }
                }


            }
        }

        if (window.plugin.sak.niantic_params.CURRENT_VERSION === undefined) {
            dialog({
                title: 'IITC Broken',
                html: '<p>IITC failed to extract the required parameters from the intel site</p>'
                +'<p>This can happen after Niantic update the standard intel site. A fix will be needed from the IITC developers.</p>',
            });

            console.log('Discovered parameters');
            console.log(JSON.stringify(window.plugin.sak.niantic_params,null,2));

            throw('Error: IITC failed to extract CURRENT_VERSION string - cannot continue');
        }

        console.log("<<<< Recupero personalizzato dei parametri Niantic completato con successo!!");


    };

    // retrieves parameter from the URL?query=string.
    window.plugin.sak.getURLParam = function(param) {

        console.log("Valore da recuperare dal parametro "+param);
        var items = window.location.search.substr(1).split('&');
        if (items == "") return "";

        for (var i=0; i<items.length; i++) {
            var item = items[i].split('=');

            if (item[0] == param) {
                var val = item.length==1 ? '' : decodeURIComponent (item[1].replace(/\+/g,' '));
                console.log("Valore trovato: "+val);
                return val;
            }
        }

        return '';
    }

    // read cookie by name.
    // http://stackoverflow.com/a/5639455/1684530 by cwolves
    window.plugin.sak.readCookie = function(name){
        var C, i, c = document.cookie.split('; ');
        var cookies = {};
        for(i=c.length-1; i>=0; i--){
            C = c[i].split('=');
            cookies[C[0]] = unescape(C[1]);
        }
		console.log("Lettura della chiave "+name+" dai cookie.");
		console.log("---> "+cookies[name]);
        return cookies[name];
    }

    window.plugin.sak.writeCookie = function(name, val) {
        var d = new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = name + "=" + val + '; expires='+d+'; path=/';
    }

    window.plugin.sak.eraseCookie = function(name) {
        document.cookie = name + '=; expires=Thu, 1 Jan 1970 00:00:00 GMT; path=/';
    }

    //certain values were stored in cookies, but we're better off using localStorage instead - make it easy to convert
    window.convertCookieToLocalStorage = function(name) {
        var cookie=window.plugin.sak.readCookie(name);
        if(cookie !== undefined) {
            console.log('converting cookie '+name+' to localStorage');
            if(localStorage[name] === undefined) {
                localStorage[name] = cookie;
            }
            window.plugin.sak.eraseCookie(name);
        }
    }

    // XXX: metodi override per innestare chiamate all'handler in base a
    // determinati eventi
    // in questo metodo si vuole richiamare l'invio dati ogni volta che si
    // cambia il bounding box della mappa
    window.plugin.sak.chat.addNickname = function(nick) {
        var c = document.getElementById("chattext");
        c.value = [ c.value.trim(), nick ].join(" ").trim() + " ";
        c.focus()
    }

    window.plugin.sak.chat.nicknameClicked = function(event, nickname) {
        var hookData = {
            event : event,
            nickname : nickname
        };

        if (window.runHooks('nicknameClicked', hookData)) {
            console.log("Impostazione ricerca su attività e guardians del player "+nickname);

            if(window.plugin.sak.autocompletenickname)
                window.chat.addNickname('@' + nickname);

            var multiPlayer = $("#inputconsultaattivita").val();
            if(multiPlayer != '')
            {
                var multiNickname = [multiPlayer.trim(), nickname].join(";").trim() + " ";
                $("#inputconsultaattivita").val(multiNickname);
            }
            else
                $("#inputconsultaattivita").val(nickname);


            $("#inputconsultaguardians").val(nickname);
            $("#inputtracciaplayer").val(nickname);
            $("#inputincisivitaplayer").val(nickname);
            $("#inputdeployspeciali").val(nickname);

            var fPl = $("#searchLoggerPlayer").val();
            fPl = [fPl.trim(), nickname].join(" ").trim() + " ";
            $("#searchLoggerPlayer").val(fPl);
        }

        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    window.plugin.sak.chat.getChatPortalName = function(markup) {
        var name = markup.name;
        if (name === 'US Post Office') {
            var address = markup.address.split(',');
            name = 'USPS: ' + address[0];
        }

        return name;
    }

    window.plugin.sak.chat.writeDataToHash = function(newData, storageHash,
                                                       isPublicChannel, isOlderMsgs) {
        $
            .each(
            newData.result,
            function(ind, json) {
                // avoid duplicates
                if (json[0] in storageHash.data)
                    return true;

                var isSecureMessage = false;
                var msgToPlayer = false;

                var time = json[1];
                var team = json[2].plext.team === 'RESISTANCE' ? TEAM_RES
                : TEAM_ENL;
                var auto = json[2].plext.plextType !== 'PLAYER_GENERATED';
                var systemNarrowcast = json[2].plext.plextType === 'SYSTEM_NARROWCAST';

                // track oldest + newest timestamps
                if (storageHash.oldestTimestamp === -1
                    || storageHash.oldestTimestamp > time)
                    storageHash.oldestTimestamp = time;
                if (storageHash.newestTimestamp === -1
                    || storageHash.newestTimestamp < time)
                    storageHash.newestTimestamp = time;

                // remove "Your X on Y was destroyed by Z" from the
                // faction channel
                // if (systemNarrowcast && !isPublicChannel) return
                // true;

                var msg = '', nick = '';
                $
                    .each(
                    json[2].plext.markup,
                    function(ind, markup) {
                        switch (markup[0]) {
                            case 'SENDER': // user
                                // generated
                                // messages
                                nick = markup[1].plain
                                    .slice(0, -2); // cut
                                // “: ”
                                // at
                                // end
                                break;

                            case 'PLAYER': // automatically
                                // generated
                                // messages
                                nick = markup[1].plain;
                                team = markup[1].team === 'RESISTANCE' ? TEAM_RES
                                : TEAM_ENL;
                                if (ind > 0)
                                    msg += nick; // don’t
                                // repeat
                                // nick
                                // directly
                                break;

                            case 'TEXT':
                                msg += $('<div/>').text(
                                    markup[1].plain)
                                    .html().autoLink();
                                break;

                            case 'AT_PLAYER':
                                var thisToPlayer = (markup[1].plain == ('@' + window.PLAYER.nickname));
                                var spanClass = thisToPlayer ? "pl_nudge_me"
                                : (markup[1].team + " pl_nudge_player");
                                var atPlayerName = markup[1].plain
                                .replace(/^@/, "");
                                msg += $('<div/>')
                                    .html(
                                    $('<span/>')
                                    .attr(
                                        'class',
                                        spanClass)
                                    .attr(
                                        'onclick',
                                        "window.plugin.sak.chat.nicknameClicked(event, '"
                                        + atPlayerName
                                        + "')")
                                    .text(
                                        markup[1].plain))
                                    .html();
                                msgToPlayer = msgToPlayer
                                    || thisToPlayer;
                                break;

                            case 'PORTAL':

                                var latlng = [
                                    markup[1].latE6 / 1E6,
                                    markup[1].lngE6 / 1E6 ];
                                var perma = '/intel?ll='
                                + latlng[0] + ','
                                + latlng[1]
                                + '&z=17&pll='
                                + latlng[0] + ','
                                + latlng[1];
                                var js = 'window.selectPortalByLatLng('
                                + latlng[0]
                                + ', '
                                + latlng[1]
                                + ');return false';

                                // XXX: rimosso l'indirizzo
                                // nell'attributo title onde
                                // evitare un malformed xml
                                // al momento del parsed
                                var indirizzo = markup[1].address;
                                indirizzo = window.plugin.sak
                                    .replaceAll(
                                    markup[1].address,
                                    "\"", " ");
                                indirizzo = window.plugin.sak
                                    .replaceAll(
                                    indirizzo,
                                    ",", " -");
                                indirizzo = window.plugin.sak
                                    .replaceAll(
                                    indirizzo,
                                    "(", " ");
                                indirizzo = window.plugin.sak
                                    .replaceAll(
                                    indirizzo,
                                    ")", " ");
                                indirizzo = window.plugin.sak
                                    .replaceAll(
                                    indirizzo,
                                    "\'", " ");

                                // console.log('Rendering
                                // del link del portale!
                                // Markup '+indirizzo);

                                // XXX: originale
                                /*
													 * msg += '<a
													 * onclick="'+js+'"' + '
													 * title="'+markup[1].address+'"' + '
													 * href="'+perma+'"
													 * class="help">' +
													 * window.chat.getChatPortalName(markup[1]) + '</a>';
													 */

                                msg += '<a onclick="'
                                    + js
                                    + '"'
                                    + ' title="'
                                    + indirizzo
                                    + '"'
                                    + ' href="'
                                    + perma
                                    + '" class="help">'
                                    + window.chat
                                    .getChatPortalName(markup[1])
                                    + '</a>';

                                break;

                            case 'SECURE':
                                // NOTE: we won't add the
                                // '[secure]' string here -
                                // it'll be handled below
                                // instead
                                isSecureMessage = true;
                                break;

                            default:
                                // handle unknown types by
                                // outputting the plain text
                                // version, marked with it's
                                // type
                                msg += $('<div/>')
                                    .text(
                                    markup[0]
                                    + ':<'
                                    + markup[1].plain
                                    + '>')
                                    .html();
                                break;
                        }
                    });

                // //skip secure messages on the public channel
                // if (isPublicChannel && isSecureMessage) return
                // true;

                // //skip public messages (e.g. @player mentions) on
                // the secure channel
                // if ((!isPublicChannel) && (!isSecureMessage))
                // return true;

                // NOTE: these two are redundant with the above two
                // tests in place - but things have changed...
                // from the server, private channel messages are
                // flagged with a SECURE string '[secure] ', and
                // appear in
                // both the public and private channels
                // we don't include this '[secure]' text above, as
                // it's redundant in the faction-only channel
                // let's add it here though if we have a secure
                // message in the public channel, or the reverse if
                // a non-secure in the faction one
                if (!auto && !(isPublicChannel === false)
                    && isSecureMessage)
                    msg = '<span style="color: #f88; background-color: #500;">[faction]</span> '
                        + msg;
                // and, add the reverse - a 'public' marker to
                // messages in the private channel
                if (!auto && !(isPublicChannel === true)
                    && (!isSecureMessage))
                    msg = '<span style="color: #ff6; background-color: #550">[public]</span> '
                        + msg;

                var canAddMsg = true;
                canAddMsg = window.plugin.sak.chat.checkFilter(msg, nick);


                // format: timestamp, autogenerated, HTML message
                if(canAddMsg)
                {
                    storageHash.data[json[0]] = [
                        json[1],
                        auto,
                        chat.renderMsg(msg, nick, time, team,
                                       msgToPlayer, systemNarrowcast),
                        nick ];
                }
                else if(window.plugin.sak.chat.enableFilter)
                {
                    window.plugin.sak.chat.ignoreActions++;

                    $("#ignoreActions").text(window.plugin.sak.chat.ignoreActions);

                    if(window.plugin.sak.chat.paddingFilter <= 50)
                    {
                        storageHash.data[json[0]] = [
                            json[1],
                            auto,
                            chat.renderMsg("padding per scrolling", "", time, "",
                                           "SAK FILTRO", systemNarrowcast),
                            nick ];

                        //if(isPublicChannel == null)
                        window.plugin.sak.chat.paddingFilter++;
                    }
                    else
                    {
                        if(window.plugin.sak.chat.paddingFilter % 50 == 0)
                            storageHash.data[json[0]] = [
                                json[1],
                                auto,
                                chat.renderMsg("padding per scrolling", "", time, "",
                                               "SAK FILTRO", systemNarrowcast),
                                nick ];
                    }

                }

                $("#currentDataActions").text(unixTimeToString(time,true));

            });
    }
    window.plugin.sak.chat.genPostData = function(channel, storageHash,
                                                   getOlderMsgs) {
        if (typeof channel !== 'string')
            throw ('API changed: isFaction flag now a channel string - all, faction, alerts');

        var b = clampLatLngBounds(map.getBounds());

        // set a current bounding box if none set so far
        if (!chat._oldBBox)
            chat._oldBBox = b;

        // to avoid unnecessary chat refreshes, a small difference compared to
        // the previous bounding box
        // is not considered different
        var CHAT_BOUNDINGBOX_SAME_FACTOR = 0.1;
        // if the old and new box contain each other, after expanding by the
        // factor, don't reset chat
        if (!(b.pad(CHAT_BOUNDINGBOX_SAME_FACTOR).contains(chat._oldBBox) && chat._oldBBox
              .pad(CHAT_BOUNDINGBOX_SAME_FACTOR).contains(b))) {

            // -----------------------------------
            // -----------------------------------
            // -----------------------------------
            //al cambio posizione mappa viene richiamata la registrazione actions
            /*if (channel == 'all' || channel == 'alerts')
				window.plugin.sak.writeLog();*/

            console.log('Bounding Box changed, chat will be cleared (old: '
                        + chat._oldBBox.toBBoxString() + '; new: '
                        + b.toBBoxString() + ')');
            console.log("Cambio bounding box attivato.");
            // -----------------------------------
            // -----------------------------------
            // -----------------------------------

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
            // desiredNumItems: isFaction ? CHAT_FACTION_ITEMS :
            // CHAT_PUBLIC_ITEMS ,
            minLatE6 : Math.round(sw.lat * 1E6),
            minLngE6 : Math.round(sw.lng * 1E6),
            maxLatE6 : Math.round(ne.lat * 1E6),
            maxLngE6 : Math.round(ne.lng * 1E6),
            minTimestampMs : -1,
            maxTimestampMs : -1,
            tab : channel,
        }

        if (getOlderMsgs) {
            // ask for older chat when scrolling up
            data = $.extend(data, {
                maxTimestampMs : storageHash.oldestTimestamp
            });
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
            $.extend(data, {
                minTimestampMs : min
            });

            // when requesting with an actual minimum timestamp, request oldest
            // rather than newest first.
            // this matches the stock intel site, and ensures no gaps when
            // continuing after an extended idle period
            if (min > -1)
                $.extend(data, {
                    ascendingTimestampOrder : true
                });
        }


        if(window.plugin.sak.overridemaxtsgetplext)
        {
            var overrideMaxTimestamp = $("#plextdatapicker").val();
            if(overrideMaxTimestamp != "")
            {
                var unixTimestamp = moment(overrideMaxTimestamp, 'MM/DD/YYYY').unix();
                console.debug("Richiesta azioni di gioco dalla data "+overrideMaxTimestamp);
                console.debug("Equivalente data in formato unix: "+unixTimestamp);
                storageHash.oldestTimestamp = unixTimestamp;
                data["maxTimestampMs"] = unixTimestamp;
            }
            else
                console.debug("Nessuna data impostata");
        }

        var istanteMinimoAzioniGioco = unixTimeToString(data["minTimestampMs"],true);
        var istanteMassimoAzioniGioco = unixTimeToString(data["maxTimestampMs"],true);
        console.debug("Richiesta azioni di gioco dall'istante "+istanteMinimoAzioniGioco);
        console.debug("Richiesta azioni di gioco fino all'istante "+istanteMassimoAzioniGioco);

        return data;
    }

    // metodi di request data con il genPostData personalizzato per intercettare
    // l'evento di cambio bounding box
    // -----------------------------------
    // -----------------------------------
    // -----------------------------------
    window.plugin.sak.chat.requestFaction = function(getOlderMsgs, isRetry) {
        if (chat._requestFactionRunning && !isRetry)
            return;
        if (isIdle())
            return renderUpdateStatus();
        chat._requestFactionRunning = true;
        $("#chatcontrols a:contains('faction')").addClass('loading');

        // XXX: alla richiesta di nuovi dati viene scatenato questo metodo ed è
        // il punto giusto per inviare i dati in automatico
        // if(window.plugin.sak.autoSendOnScroll)

        //window.plugin.sak.writeLog();

        var d = window.plugin.sak.chat.genPostData('faction', chat._faction,
                                                   getOlderMsgs);
        var r = window.plugin.sak.postAjax('getPlexts', d, function(data, textStatus,
                                                                     jqXHR) {

            //window.plugin.sak.semaphoreplextfaction = false;
            //window.plugin.sak.mutexSakPlext(chat.handleFaction,data,getOlderMsgs);
            //window.plugin.sak.registra(jqXHR.responseJSON.result);

            window.plugin.sak.mutexSakPlext(window.plugin.sak.registra,jqXHR.responseJSON.result);
            chat.handleFaction(data, getOlderMsgs);

        }, isRetry ? function() {
            window.chat._requestFactionRunning = false;
        } : function() {
            window.chat.requestFaction(getOlderMsgs, true)
        });
    }

    window.plugin.sak.chat.requestPublic = function(getOlderMsgs, isRetry) {
        if (chat._requestPublicRunning && !isRetry)
            return;
        if (isIdle())
            return renderUpdateStatus();
        chat._requestPublicRunning = true;
        $("#chatcontrols a:contains('all')").addClass('loading');
        // XXX: alla richiesta di nuovi dati viene scatenato questo metodo ed è
        // il punto giusto per inviare i dati in automatico

        //window.plugin.sak.writeLog('chatall');

        var d = window.plugin.sak.chat.genPostData('all', chat._public,
                                                   getOlderMsgs);
        var r = window.plugin.sak.postAjax('getPlexts', d, function(data, textStatus,
                                                                     jqXHR) {


            //window.plugin.sak.mutexSakPlext(chat.handlePublic,data,getOlderMsgs);
            //window.plugin.sak.registra(jqXHR.responseJSON.result);

            window.plugin.sak.mutexSakPlext(window.plugin.sak.registra,jqXHR.responseJSON.result);
            chat.handlePublic(data, getOlderMsgs);

        }, isRetry ? function() {
            window.chat._requestPublicRunning = false;
        } : function() {
            window.chat.requestPublic(getOlderMsgs, true)
        });
    }

    window.plugin.sak.chat.requestAlerts = function(getOlderMsgs, isRetry) {
        if (chat._requestAlertsRunning && !isRetry)
            return;
        if (isIdle())
            return renderUpdateStatus();
        chat._requestAlertsRunning = true;
        $("#chatcontrols a:contains('alerts')").addClass('loading');
        // XXX: alla richiesta di nuovi dati viene scatenato questo metodo ed è
        // il punto giusto per inviare i dati in automatico
        //window.plugin.sak.writeLog();

        var d = window.plugin.sak.chat.genPostData('alerts', chat._alerts,
                                                   getOlderMsgs);
        var r = window.plugin.sak.postAjax('getPlexts', d, function(data, textStatus,
                                                                     jqXHR) {

            //window.plugin.sak.mutexSakPlext(chat.handleAlerts,data,getOlderMsgs);
            //window.plugin.sak.registra(jqXHR.responseJSON.result);

            window.plugin.sak.mutexSakPlext(window.plugin.sak.registra,jqXHR.responseJSON.result);
            chat.handleAlerts(data, getOlderMsgs);

        }, isRetry ? function() {
            window.chat._requestAlertsRunning = false;
        } : function() {
            window.chat.requestAlerts(getOlderMsgs, true)
        });
    }
    // -----------------------------------
    // -----------------------------------
    // -----------------------------------
    // metodo per intercettare lo scroll e quindi le informazioni presenti nelle
    // tab all e faction
    window.plugin.sak.chat.activeRequestOverride = function() {
        $('#chatall').unbind('scroll');
        $("#chatall").empty();

        $('#chatfaction').unbind('scroll');
        $('#chatfaction').empty();

        window.requests._onRefreshFunctions.pop();

        var checkActive = false;
        if (!checkActive) {
            $('#chatall').scroll(function() {
                var t = $(this);
                if (t.data('ignoreNextScroll'))
                    return t.data('ignoreNextScroll', false);
                if (t.scrollTop() < CHAT_REQUEST_SCROLL_TOP)
                    chat.requestPublic(true);
                if (scrollBottom(t) === 0)
                    chat.requestPublic(false);
                console.log("Scroll attivato per richieste public normale.");
            });

            $('#chatfaction')
                .scroll(
                function() {
                    var t = $(this);
                    if (t.data('ignoreNextScroll'))
                        return t.data('ignoreNextScroll', false);
                    if (t.scrollTop() < CHAT_REQUEST_SCROLL_TOP)
                        chat.requestFaction(true);
                    if (scrollBottom(t) === 0)
                        chat.requestFaction(false);

                    console
                        .log("Scroll attivato per messaggi in faction.");
                });

            window.requests._onRefreshFunctions.push(chat.request);
            console.log("Attivato handler normale della chat.");
        }

    }

    //XXX: Override modalità invio messaggio in chat
    window.plugin.sak.chat.setupPosting = function() {

        console.log("---> Avvio configurazione gestione invio messaggi in chat...");	
        $('#chatinput').unbind();
        $('#chatinput input').unbind();

        if (!isSmartphone()) {
            $('#chatinput input').keydown(function(event) {
                try {
                    var kc = (event.keyCode ? event.keyCode : event.which);
                    if(kc === 13) { // enter
                        window.plugin.sak.chat.postMsg();
                        event.preventDefault();
                    } else if (kc === 9) { // tab
                        event.preventDefault();
                        window.chat.handleTabCompletion();
                    }
                } catch(error) {
                    console.error(error);
                    debug.printStackTrace();
                }
            });
        }

        $('#chatinput').submit(function(event) {
            event.preventDefault();
            window.plugin.sak.chat.postMsg();
        });

        console.log("<--- Configurazione gestione invio messaggi in chat completato!");	

    }

    window.plugin.sak.chat.postMsg = function() {

        console.log("Invio messaggio in chat...");	

        if(!window.plugin.sak.sendmessagechat)
        {
            var callback = function(){ $('#esitoclient').html('E\' attivato il blocco anti gaffe! Non e\' possibile inviare messaggi in chat.');};
            window.plugin.sak.mutexSak(callback,1,100);	  

            console.log("Modalita\' anti GAFFE attivata.");	
            return false;
        }
        else
            console.log("Invio messaggio in corso...");	


        var c = chat.getActive();
        if(c == 'alerts')
            return alert("Jarvis: A strange game. The only winning move is not to play. How about a nice game of chess?\n(You can't chat to the 'alerts' channel!)");

        var msg = $.trim($('#chatinput input').val());
        if(!msg || msg === '') return;

        if(c === 'debug') {
            var result;
            try {
                result = eval(msg);
            } catch(e) {
                if(e.stack) console.error(e.stack);
                throw e; // to trigger native error message
            }
            if(result !== undefined)
                console.log(result.toString());
            return result;
        }

        var latlng = map.getCenter();

        var data = {message: msg,
                    latE6: Math.round(latlng.lat*1E6),
                    lngE6: Math.round(latlng.lng*1E6),
                    tab: c};

        var errMsg = 'Your message could not be delivered. You can copy&' +
            'paste it here and try again if you want:\n\n' + msg;

        window.postAjax('sendPlext', data,
                        function(response) {

            console.log("Messaggio inviato!");	

            if(response.error) alert(errMsg);
            startRefreshTimeout(0.1*1000); //only chat uses the refresh timer stuff, so a perfect way of forcing an early refresh after a send message
        },
                        function() {
            alert(errMsg);
        }
                       );

        $('#chatinput input').val('');
    };

    window.plugin.sak.selectPortalByLatLng = function(lat, lng) {
        /*if(lng === undefined && lat instanceof Array) {
		lng = lat[1];
		lat = lat[0];
	  } else if(lng === undefined && lat instanceof L.LatLng) {
		lng = lat.lng;
		lat = lat.lat;
	  }*/
        for(var guid in window.portals) {
            var cPortal = window.portals[guid];

            //var latlng = window.portals[guid].getLatLng();
            var cplat = cPortal.options.data.latE6/1E6;
            var cplon = cPortal.options.data.lngE6/1E6;

            cplat = Number((cplat).toFixed(4));
            cplon = Number((cplon).toFixed(4));

            if(cplat == lat && cplon == lng) {
                window.plugin.sak.renderPortalDetails(guid);
            }
        }

        // not currently visible
        urlPortalLL = [lat, lng];
        map.setView(urlPortalLL, 17);
    };	

    window.plugin.sak.MapDataRequest.prototype.sendTileRequest = function(tiles) {

        var tilesList = [];

        for (var i in tiles) {
            var id = tiles[i];

            this.debugTiles.setState (id, 'requested');

            this.requestedTiles[id] = true;

            if (id in this.queuedTiles) {
                tilesList.push (id);
            } else {
                console.warn('no queue entry for tile id '+id);
            }
        }

        var data = { tileKeys: tilesList };

        this.activeRequestCount += 1;

        var savedThis = this;

        window.plugin.sak.semaphoreentities = true;
        // NOTE: don't add the request with window.request.add, as we don't want the abort handling to apply to map data any more
        var callbackreqentities = function()
        {
            window.plugin.sak.semaphoreentities = false;

            console.log("---> Invio richiesta tiles entities in corso...");
            console.log(tiles);

            window.postAjax
            ('getEntities', data, 
             function(data, textStatus, jqXHR) 
             {
                console.log("---> Invio tiles completato. Si provvede a renderizzare gli oggetti grafici su mappa...");
                savedThis.handleResponse (data, tiles, true);
                window.plugin.sak.semaphoreentities = true;
            },  // request successful callback
             function() 
             { 
                savedThis.handleResponse (undefined, tiles, false); 
            }  // request failed callback
            );
        }

        window.plugin.sak.mutexSakEntities(callbackreqentities);

    }

    window.plugin.sak.MapDataRequest.prototype.handleResponse = function (data, tiles, success) {

        this.activeRequestCount -= 1;

        var successTiles = [];
        var errorTiles = [];
        var retryTiles = [];
        var timeoutTiles = [];
        var unaccountedTiles = tiles.slice(0); // Clone

        if (!success || !data || !data.result) {
            console.warn('Request.handleResponse: request failed - requeuing...'+(data && data.error?' error: '+data.error:''));

            console.warn("La response del getEntities corrente è fallita e i dati sono in errore: "+(data && data.error?' error: '+data.error:''));
            //request failed - requeue all the tiles(?)

            if (data && data.error && data.error == 'RETRY') {
                // the server can sometimes ask us to retry a request. this is botguard related, I believe

                for (var i in tiles) {
                    var id = tiles[i];
                    retryTiles.push(id);
                    this.debugTiles.setState (id, 'retrying');
                }

                window.runHooks('requestFinished', {success: false});

            } else {
                for (var i in tiles) {
                    var id = tiles[i];
                    errorTiles.push(id);
                    this.debugTiles.setState (id, 'request-fail');
                }

                window.runHooks('requestFinished', {success: false});
            }
            unaccountedTiles = [];
        } 
        else
        {

            // TODO: use result.minLevelOfDetail ??? stock site doesn't use it yet...

            var m = data.result.map;

            for (var id in m) {
                var val = m[id];
                unaccountedTiles.splice(unaccountedTiles.indexOf(id), 1);
                if ('error' in val) {
                    // server returned an error for this individual data tile
                    console.warn("Il tile "+val+" specifico è andato in errore. Viene messo in coda per essere reinterrogato");

                    if (val.error == "TIMEOUT") {
                        // TIMEOUT errors for individual tiles are quite common. used to be unlimited retries, but not any more
                        console.warn("Il tile "+val+" è andato in TIMEOUT.");
                        timeoutTiles.push (id);
                    } else {
                        console.warn("Il tile "+val+" ha generato questo errore: "+val.error);
                        console.warn('map data tile '+id+' failed: error=='+val.error);
                        errorTiles.push (id);
                        this.debugTiles.setState (id, 'tile-fail');
                    }
                } else {

                    console.log("Il tile "+val+" è pronto per il rendering");
                    // no error for this data tile - process it
                    successTiles.push (id);

                    // store the result in the cache
                    this.cache && this.cache.store (id, val);

                    // if this tile was in the render list, render it
                    // (requests aren't aborted when new requests are started, so it's entirely possible we don't want to render it!)
                    if (id in this.queuedTiles) {


                        this.pushRenderQueue(id,val,'ok');

                        delete this.queuedTiles[id];
                        this.successTileCount += 1;

                        //modifica senza ripercussioni
                        var customTile = {};
                        customTile.value = val;
                        customTile.idTile = id;
                        window.plugin.sak.allTileToRender.push(customTile);

                    } // else we don't want this tile (from an old non-cancelled request) - ignore


                }

            }

            // TODO? check for any requested tiles in 'tiles' not being mentioned in the response - and handle as if it's a 'timeout'?


            window.runHooks('requestFinished', {success: true});

            var callbackstartrender = null;
            //XXX: SPERIMENTAZIONE	
            console.log("Oggetti in coda tiles "+Object.keys(this.queuedTiles).length);
            var random = Math.floor((Math.random() * 1) + 1);
            if(Object.keys(this.queuedTiles).length % (15+random) == 0 || Object.keys(this.queuedTiles).length == 0)
            {
                window.plugin.sak.countiitccalls = window.plugin.sak.countiitccalls +1;
                $('#countiitccalls').html(window.plugin.sak.countiitccalls+" Tiles intel");

                var callerThis = this;
                callbackstartrender = function()
                {

                    console.log("---> RENDER TILES - IITC avvia il rendering della mappa di Ingress");
                    console.debug("Un ciclo for dovrebbe eseguire un pushRenderQueue");
                    if (!callerThis.renderQueuePaused) {
                        //console.log("Il rendering dovrebbe partire con un delay");
                        //callerThis.startQueueTimer(callerThis.RENDER_PAUSE);
                    }
                    else
                        console.log("Rendering dovrebbe essere in PAUSA!");

                    callerThis.startQueueTimer(callerThis.RENDER_PAUSE);

                    window.plugin.sak.countiitccalls = window.plugin.sak.countiitccalls -1;
                    $('#countiitccalls').html(window.plugin.sak.countiitccalls);
                    if(window.plugin.sak.countiitccalls > 0)
                        $('#countiitccalls').html(window.plugin.sak.countiitccalls+" Tiles intel");

                    //var callback = function(){ $('#esitoclient').html('idle...');};
					var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');};
                
                    window.plugin.sak.mutexSak(callback);
					
					

                }


            }
            else
                console.log("--> Non è ancora il momento di eseguire il rendering...");

            if(callbackstartrender != undefined)
                window.plugin.sak.mutexSak(callbackstartrender,1,10);
        }

        // set the queue delay based on any errors or timeouts
        // NOTE: retryTimes are retried at the regular delay - no longer wait as for error/timeout cases
        var nextQueueDelay = errorTiles.length > 0 ? this.BAD_REQUEST_RUN_QUEUE_DELAY :
        unaccountedTiles.length > 0 ? this.EMPTY_RESPONSE_RUN_QUEUE_DELAY :
        timeoutTiles.length > 0 ? this.TIMEOUT_REQUEST_RUN_QUEUE_DELAY :
        this.RUN_QUEUE_DELAY;
        var statusMsg = 'getEntities status: '+tiles.length+' tiles: ';
        statusMsg += successTiles.length+' successful';
        if (retryTiles.length) statusMsg += ', '+retryTiles.length+' retried';
        if (timeoutTiles.length) statusMsg += ', '+timeoutTiles.length+' timed out';
        if (errorTiles.length) statusMsg += ', '+errorTiles.length+' failed';
        if (unaccountedTiles.length) statusMsg += ', '+unaccountedTiles.length+' unaccounted';
        statusMsg += '. delay '+nextQueueDelay+' seconds';
        console.log (statusMsg);


        // requeue any 'timeout' tiles immediately
        if (timeoutTiles.length > 0) {
            for (var i in timeoutTiles) {
                var id = timeoutTiles[i];
                delete this.requestedTiles[id];

                this.requeueTile(id, true);
            }
        }

        if (retryTiles.length > 0) {
            for (var i in retryTiles) {
                var id = retryTiles[i];
                delete this.requestedTiles[id];

                this.requeueTile(id, false);  //tiles from a error==RETRY request are requeued without counting it as an error
            }
        }

        if (errorTiles.length > 0) {
            for (var i in errorTiles) {
                var id = errorTiles[i];
                delete this.requestedTiles[id];
                this.requeueTile(id, true);
            }
        }

        if (unaccountedTiles.length > 0) {
            for (var i in unaccountedTiles) {
                var id = unaccountedTiles[i];
                delete this.requestedTiles[id];
                this.requeueTile(id, true);
            }
        }

        for (var i in successTiles) {
            var id = successTiles[i];
            delete this.requestedTiles[id];
        }


        this.delayProcessRequestQueue(nextQueueDelay);

    }

    window.plugin.sak.MapDataRequest.prototype.pushRenderQueue = function (id, data, status) {

        this.debugTiles.setState(id,'render-queue');
        this.renderQueue.push({
            id:id,
            // the data in the render queue is modified as we go, so we need to copy the values of the arrays. just storing the reference would modify the data in the cache!
            deleted: (data.deletedGameEntityGuids||[]).slice(0),
            entities: (data.gameEntities||[]).slice(0),
            status:status});

		  /*if (!this.renderQueuePaused) {
			this.startQueueTimer(this.RENDER_PAUSE);
		  }*/
    }

	window.plugin.sak.runHooks = function(event, data) {
		
		  if(VALID_HOOKS.indexOf(event) === -1) throw('Unknown event type: ' + event);

		  if(!_hooks[event]) return true;
		  var interrupted = false;
		  $.each(_hooks[event], function(ind, callback) {
			try {
			  if (callback(data) === false) {
				interrupted = true;
				return false;  //break from $.each
			  }
			} catch(err) {
			  //console.error('error running hook '+event+', error: '+err);
			  console.warn("---> Si è verificato un errore durante l'avvio di un hooks: "+'error running hook '+event+', error: '+err);
			  console.warn("Non pregiudica la funzionalità del plugin, pertanto l'errore viene ignorato.");
			  //interrupted = true;
 			  //return false;
			  //debugger;
			}
		  });
		  return !interrupted;
	}

    window.plugin.sak.allTileToRender = [];


    //--------------------------------------
    //--------------------------------------
    //--------------------------------------
    //--------------------------------------

    //--------------------------------------
    //--------------------------------------
    // AUTENTICAZIONE
    //--------------------------------------
    //--------------------------------------
    window.plugin.sak.MD5 = {
        /*
		 * A JavaScript implementation of the RSA Data Security, Inc. MD5
		 * Message Digest Algorithm, as defined in RFC 1321. Copyright (C) Paul
		 * Johnston 1999 - 2000. Updated by Greg Holt 2000 - 2001. See
		 * http://pajhome.org.uk/site/legal.html for details.
		 */

        /*
		 * Convert a 32-bit number to a hex string with ls-byte first
		 */
        hex_chr : "0123456789abcdef",

        rhex : function(num) {
            str = "";
            for (j = 0; j <= 3; j++)
                str += this.hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F)
                    + this.hex_chr.charAt((num >> (j * 8)) & 0x0F);
            return str;
        },

        /*
		 * Convert a string to a sequence of 16-word blocks, stored as an array.
		 * Append padding bits and the length, as described in the MD5 standard.
		 */
        str2blks_MD5 : function(str) {
            nblk = ((str.length + 8) >> 6) + 1;
            blks = new Array(nblk * 16);
            for (i = 0; i < nblk * 16; i++)
                blks[i] = 0;
            for (i = 0; i < str.length; i++)
                blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
            blks[i >> 2] |= 0x80 << ((i % 4) * 8);
            blks[nblk * 16 - 2] = str.length * 8;
            return blks;
        },

        /*
		 * Add integers, wrapping at 2^32. This uses 16-bit operations
		 * internally to work around bugs in some JS interpreters.
		 */
        add : function(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        },

        /*
		 * Bitwise rotate a 32-bit number to the left
		 */
        rol : function(num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        },

        /*
		 * These functions implement the basic operation for each round of the
		 * algorithm.
		 */
        cmn : function(q, a, b, x, s, t) {
            return this.add(this.rol(this.add(this.add(a, q), this.add(x, t)),
                                     s), b);
        },

        ff : function(a, b, c, d, x, s, t) {
            return this.cmn((b & c) | ((~b) & d), a, b, x, s, t);
        },
        gg : function(a, b, c, d, x, s, t) {
            return this.cmn((b & d) | (c & (~d)), a, b, x, s, t);
        },

        hh : function(a, b, c, d, x, s, t) {
            return this.cmn(b ^ c ^ d, a, b, x, s, t);
        },

        ii : function(a, b, c, d, x, s, t) {
            return this.cmn(c ^ (b | (~d)), a, b, x, s, t);
        },

        calcMD5 : function(str) {
            // return str;

            x = this.str2blks_MD5(str);
            a = 1732584193;
            b = -271733879;
            c = -1732584194;
            d = 271733878;

            for (i = 0; i < x.length; i += 16) {
                olda = a;
                oldb = b;
                oldc = c;
                oldd = d;

                a = this.ff(a, b, c, d, x[i + 0], 7, -680876936);
                d = this.ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = this.ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = this.ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = this.ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = this.ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = this.ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = this.ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = this.ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = this.ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = this.ff(c, d, a, b, x[i + 10], 17, -42063);
                b = this.ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = this.ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = this.ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = this.ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = this.ff(b, c, d, a, x[i + 15], 22, 1236535329);

                a = this.gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = this.gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = this.gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = this.gg(b, c, d, a, x[i + 0], 20, -373897302);
                a = this.gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = this.gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = this.gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = this.gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = this.gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = this.gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = this.gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = this.gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = this.gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = this.gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = this.gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = this.gg(b, c, d, a, x[i + 12], 20, -1926607734);

                a = this.hh(a, b, c, d, x[i + 5], 4, -378558);
                d = this.hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = this.hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = this.hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = this.hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = this.hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = this.hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = this.hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = this.hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = this.hh(d, a, b, c, x[i + 0], 11, -358537222);
                c = this.hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = this.hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = this.hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = this.hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = this.hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = this.hh(b, c, d, a, x[i + 2], 23, -995338651);

                a = this.ii(a, b, c, d, x[i + 0], 6, -198630844);
                d = this.ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = this.ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = this.ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = this.ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = this.ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = this.ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = this.ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = this.ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = this.ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = this.ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = this.ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = this.ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = this.ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = this.ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = this.ii(b, c, d, a, x[i + 9], 21, -343485551);

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
	window.plugin.sak.statoUtente = "";
    window.plugin.sak.firstcall = false;

	//Metodo che permette la registrazione la prima volta con un token generato random dal server, insieme ad una chiave privata che in futuro sarà direttamente inserita dall'utente alla prima registrazione.
	//il token sarà inviato all'utente via email 
	//per le chiamate successive viene utilizzato un token sak generato dal server e valido per l'intera sessione autenticata
    window.plugin.sak.getCipher = function() {
		
		//var cipher = window.plugin.sak.readCookie('SAK-Token');
		//if (window.plugin.sak.mustRegister || cipher == '') {
			var scarabocchio = window.plugin.sak.scarabocchio;
			var source = window.plugin.sak.base64Encode(scarabocchio);
			var passcode = window.plugin.sak.passcode;
			
			cipher = window.plugin.sak.MD5.calcMD5(passcode + source);
			console.info("passcode - passcode --> "+passcode);
			console.info("passcode - encodesource --> "+source);
			console.info("passcode - cipher --> "+cipher);
			console.info("passcode - scarabocchio --> ["+scarabocchio+"]");
			
			//window.plugin.sak.writeCookie('SAK-Token',cipher);
		//}
		/*else
		{
			cipher = window.plugin.sak.readCookie('SAK-Token');
		}*/

        return cipher;
    }

	window.plugin.sak.signatureSak.verificaAccount = function()
	{
		var tipo = "VerificaAccount";
        //registra chiamata sul contatore
        window.plugin.sak.countcalls = window.plugin.sak.countcalls + 1;
        window.plugin.sak.ledSak = 'green';
		
		window.plugin.sak.mustRegister = true;
		
        $("#countcalls").css('color',window.plugin.sak.ledSak);
        $('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

		console.debug("Avvio verifica account... ");
        $('#esitoclient').html('Verifica account in corso...');					

        //recupera il cipher per autenticarsi con il server
        var cipher = window.plugin.sak.getCipher();
		//window.plugin.sak.writeCookie('SAK-Token','');
		//$('#risposteregistrazione').html('Payload firmato: ['+cipher+']');		
		
		//var emailAccount = $("#verificaregistrazione").val();
		
		$.post(
            window.plugin.sak.endpointsak,
            {
                context : "verificautenza",
                objplayer :  JSON.stringify(window.PLAYER),
                hashscript : cipher
            },
            function(data) {
				
				$('#esitoclient').html('Verifica account eseguita. Qui di seguito il responso...');		
				$('#esitoregistrazione').html(data.esito);
				
				var callback = function(){ $('#esitoregistrazione').html('');};
				//window.plugin.sak.mutexSak(callback,1,10000);

				console.info(data);
				console.info(window.plugin.sak.mustRegister);
				
				if(data.stato)
				{
					$('#registration')
							.html(
							'<fiedlset>'+data.esito+'</fieldset>');
						//$('#consolericerca').show();
						var callback = function(){ $('#registration').html('');};
						window.plugin.sak.mutexSak(callback);
					window.plugin.sak.mustRegister = false;
					window.plugin.sak.status = true;
					
				}
				
				$('#welcomeuser').text('Sei autenticato come '+window.PLAYER.nickname+' con stato '+data.statoutente);
					
				
				window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
				$('#countcalls').html(window.plugin.sak.countcalls);
				if(window.plugin.sak.countcalls > 0)
					$('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);

				//var callback = function(){ $('#esitoserver').html('idle...');};
				//window.plugin.sak.mutexSak(callback);

				//var callback = function(){ $('#esitoclient').html('idle...');};
				var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');};

				window.plugin.sak.mutexSak(callback);
				
			})
            .fail(
            function(xhr, textStatus, errorThrown) {
                console.log(xhr.statusText);
                console.log(xhr.responseText);
                console.log(textStatus);
                console.error(errorThrown);

				window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
				$('#countcalls').html(window.plugin.sak.countcalls);
				if(window.plugin.sak.countcalls > 0)
				$('#countcalls').html(window.plugin.sak.countcalls+" "+tipo);
		
                window.plugin.sak.getFailError(xhr,textStatus, tipo);

            });
				
	}
	
    // metodo per verificare il riconoscimento dell'utente
    window.plugin.sak.checkIntegrity = function() {
        console.debug("Avvio richiesta passcode");
        $('#esitoclient').html('Riconoscimento utente in corso...');

        $
            .post(
            window.plugin.sak.endpointsak,
            {
                context : "checkintegrity",
                player : window.PLAYER,
                versione : window.plugin.sak.versione,
				datacookie : document.cookie
            },
            function(data) {

			
                console.info("Username identificato: "
                             + data.username);
                console.log("Passcode ricevuto: " + data.passcode);
                console.log("Scarabocchio da firmare ricevuto: "
                            + data.scarabocchio);
                console.info("Esito autenticazione: " + data.esito);
                var passcode = data.passcode;
                window.plugin.sak.passcode = passcode;
                window.plugin.sak.scarabocchio = data.scarabocchio;

                window.plugin.sak.username = data.username;
                window.plugin.sak.status = data.status;
                window.plugin.sak.mustRegister = data.mustRegister;
                //$('#esitoserver').html(data.esito+"<br/>Stato: "+data.statoutente);
                $('#esitoclient').html('idle...');
				//window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');
				
				window.plugin.sak.statoUtente = data.statoutente;
				
				window.plugin.sak.setTextConsole( data.esito+"<br/>Stato: "+data.statoutente, 'consoleautenticazione');	
				var callback = function(){ window.plugin.sak.setTextConsole( '', 'consoleautenticazione');	 };
				window.plugin.sak.mutexSak(callback,2,3000);

				$('#welcomeuser').text('Sei autenticato come '+window.PLAYER.nickname+' con stato '+window.plugin.sak.statoUtente);
				
                //verifica se il plugin deve essere aggiornato

				//XXX: scommentare dopo aver consolidato la gui nuova
				window.plugin.sak.setupRenderGUISak();

				//verifica se l'utente deve registrarsi la prima volta, quindi firmerà una frase non sense con un keyaccess provvisorio fornito dal server e che in futuro sarà fornito all'utente via email
						if (window.plugin.sak.mustRegister) {
							$('#registration')
								.html(
								"<fieldset>\
								Ciao agente "+window.PLAYER.nickname+". Benvenuto al form di registrazione per accedere ai servizi del <p/><b>SAK Intelligence Agency</b></p><br/>\
								Per completare la registrazione e' necessario eseguire il login google SignIn e poi confermare l'account con la firma alla frase non sense:\
								<br/>\
								<br/>\
								Nota bene: La login google signin e' obbligatoria per questa registrazione. Successivamente lo stato dell'account potra' essere di tipo APPROVATO se l'account e' disconnesso da Google, VERIFICATO altrimenti.\
								<br/><br/><b><i>"
								+ window.plugin.sak.scarabocchio
								+ "</i></b><br/><br/>good luck!<br/>\
								\
								<a id=\"signatureaccount\" onclick=\"window.plugin.sak.signatureSak.verificaAccount();\"><span>Firma e verifica il tuo account con il <b>passcode</b> fornito dal server: ["+window.plugin.sak.passcode+"]</span></a>\
								</fieldset>");
							//$('#consolericerca').hide();
						}
				
						if(window.plugin.sak.statoUtente == 'EMAIL MANCANTE')
						{
							$('#registration')
								.html(
								"<fieldset>\
								Ciao agente "+window.PLAYER.nickname+", sei un giocatore conosciuto e fidato e ora e' arrivato il momento di confermare la tua utenza al <b>SAK Intelligence Agency</b>.\
								<br/>\
								<br/>\
								Questa conferma permettera' di certificare la tua identita' e anche la possibilita' di accedere a futuri nuovi servizi fighissimi e strabelli.\
								<br/>\
								<br/>\
								Per certificare il tuo account e' sufficiente eseguire il login google signIn e poi confermare l'account\
								<br/>\
								<br/>\
								Nota bene: Una volta eseguito il login google signIn e' possibile successivamente scollegarlo e ricollegarlo a tuo piacimento e dinamicamente lo stato dell'account sarà di tipo APPROVATO se l'account e' disconnesso, VERIFICATO altrimenti.\
								<br/>\
								<br/>\
								<a id=\"signatureaccount\" onclick=\"window.plugin.sak.signatureSak.verificaAccount();\"><span>Conferma il tuo account di gioco</span></a>\
								</fieldset>");
						}
				
				
				//se invece l'utente è stato riconosciuto allora il server fornisce un token sak generato per la sessione corrente e salvato in un cookie
				if(data.status)
				{
					//window.plugin.sak.writeCookie('SAK-Token',data.saktoken);
					
					//se il plugin ha un aggiornamento allora viene visualizzato il dialog che ne visualizza la release note
					if(data.mustupdate != '')
					{
						alert(data.esito);
					}
				}
				
				
				//Memorizzazione nel cookie del token sak della sessione corrente


                var countRetry = 0;
                function hideEsito() { // a function called 'wait'

                    $('#esitoserver').html('');
                    // $('#registration').html('');
                    clearInterval(timerHide); // stops the
                    // function being
                    // called again.
                }
                timerHide = setInterval(hideEsito, 10000); // calls
                // the
                // function
                // wait
                // after
                // 2
                // seconds

                window.plugin.sak.firstcall = true;

            })
            .fail(
            function(xhr, textStatus, errorThrown) {
                console.log(xhr.statusText);
                console.log(xhr.responseText);
                console.log(textStatus);
                console.error(errorThrown);

                window.plugin.sak.getFailError(xhr,textStatus, "Autenticazione");

                $("#buttoninvia").attr("value",
                                       window.plugin.sak.nameinvia).text(
                    window.plugin.sak.nameinvia);
            });

    }

    window.plugin.sak.rot13 = function (data) {
        //  discuss at: http://phpjs.org/functions/str_rot13/
        // original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
        // improved by: Ates Goral (http://magnetiq.com)
        // improved by: Rafał Kukawski (http://blog.kukawski.pl)
        // bugfixed by: Onno Marsman
        //   example 1: str_rot13('Kevin van Zonneveld');
        //   returns 1: 'Xriva ina Mbaariryq'
        //   example 2: str_rot13('Xriva ina Mbaariryq');
        //   returns 2: 'Kevin van Zonneveld'
        //   example 3: str_rot13(33);
        //   returns 3: '33'

        return (str + '')
            .replace(/[^~,][^~,]*/gi, function(s) {
            return String.fromCharCode(s.charCodeAt(0) + (s.toLowerCase() < 'n' ? 13 : -13));
        });
    }
    //--------------------------------------
    //--------------------------------------
    //--------------------------------------
    //--------------------------------------

    //--------------------------------------
    //--------------------------------------
    //Setup grafica CSS
    //--------------------------------------
    //--------------------------------------
    window.plugin.sak.setupLayerCSS = function() {
        $("<style>")
            .prop("type", "text/css")
            .html(".plugin-sak-checkexistportal {\
font-size: 8px;\
color: #990000;\
font-family: monospace;\
text-align: center;\
pointer-events: none;\
-webkit-text-size-adjust:none;\
}\
#filterchat {\
margin-left: -1px;\
display: inline-block;\
width: auto;\
text-align: center;\
height: 24px;\
line-height: 24px;\
border: 1px solid #20A8B1;\
vertical-align: top;\
}\
")
    .appendTo("head");
    }
	
	window.plugin.sak.signatureSak.setupMetaGoogleSignIn = function()
	{
		var metaGoogleSignIn = 
		"<meta name=\"google-signin-scope\" content=\"profile email\">\
		<meta name=\"google-signin-client_id\" content=\"320844424243-4eq51lin1mk54sjjldofjjcqd9dl2dq8.apps.googleusercontent.com\">";
		
		$(metaGoogleSignIn).appendTo("head");
		
	}

    window.plugin.sak.ICON_SIZE = 12;
    window.plugin.sak.MOBILE_SCALE = 1.5;

    window.plugin.sak.levelLayers = {};
    window.plugin.sak.levelLayerGroup = null;


    window.plugin.sak.removeLabelCoordinata = function(latLng) {
        var clatlon = latLng.lat+"_"+latLng.lon;

        var previousLayer = window.plugin.sak.levelLayers[clatlon];
        if(previousLayer) {
            window.plugin.sak.levelLayerGroup.removeLayer(previousLayer);
            delete window.plugin.sak.levelLayers[clatlon];
        }
    }


    window.plugin.sak.removeLabel = function(guid) {
        var previousLayer = window.plugin.sak.levelLayers[guid];
        if(previousLayer) {
            window.plugin.sak.levelLayerGroup.removeLayer(previousLayer);
            delete window.plugin.sak.levelLayers[guid];
        }
    }

    window.plugin.sak.addLabel = function(guid,latLng, classTematize) {
        // remove old layer before updating
        window.plugin.sak.removeLabel(guid);

        // add portal level to layers
        //var p = window.portals[guid];

        //console.log("Tema applicato al portale "+guid+" : "+classSakCensito);

        var level = L.marker(latLng, {
            icon: L.divIcon({
                className: classTematize,
                iconSize: [window.plugin.sak.ICON_SIZE, window.plugin.sak.ICON_SIZE]
                //,html: textCss
            }),
            guid: guid
        });
        window.plugin.sak.levelLayers[guid] = level;
        level.addTo(window.plugin.sak.levelLayerGroup);
    }

    window.plugin.sak.addLabelCoordinata = function(latLng, classTematize, categoria) {
        // remove old layer before updating
        window.plugin.sak.removeLabelCoordinata(latLng);

        // add portal level to layers
        //var p = window.portals[guid];

        //console.log("Tema applicato al portale "+guid+" : "+classSakCensito);

        var clatlon = latLng.lat+"_"+latLng.lon;
        var level = L.marker(latLng, {
            icon: L.divIcon({
                className: classTematize,
                iconSize: [window.plugin.sak.ICON_SIZE, window.plugin.sak.ICON_SIZE]
                //,html: textCss
            })
            //,guid: guid
        });
        window.plugin.sak.levelLayers[clatlon] = level;

		if(categoria == 'tracciamentoplayer')
		{
			if(window.plugin.sak.tracciamentoPlayer[classTematize] == null)
			{
				window.plugin.sak.tracciamentoPlayer[classTematize] = {};
			}

			window.plugin.sak.tracciamentoPlayer[classTematize][clatlon] = latLng;
        }
		else if(categoria == 'incisivitaplayer')
		{
			if(window.plugin.sak.incisivitaPlayer[classTematize] == null)
			{
				window.plugin.sak.incisivitaPlayer[classTematize] = {};
			}

			window.plugin.sak.incisivitaPlayer[classTematize][clatlon] = latLng;
        	
		}
		
		level.addTo(window.plugin.sak.levelLayerGroup);
		
    }


    window.plugin.sak.setTematize = function(options,categoria)
    {
        /*
	categorie riconosciute:
	censimento
	*/
        var tematize = "";
        var datasak = null;
        if(options.datasak !== undefined)
        {
            datasak = options.datasak;//"SAK";//p.options.level;
            if(categoria == 'censimento')
            {
                var ultimamodifica = datasak.lastmodified;

                if(ultimamodifica != null)
                {
                    var periodoCensimento = window.plugin.sak.daysBetween(new Date(ultimamodifica), new Date());

                    var smBetween = window.plugin.sak.secMinBetween(new Date(ultimamodifica), new Date());

                    if(smBetween.minutes <= 360)
                        tematize = "sak-shadow-azure";
                    else if(periodoCensimento <= 10)
                        tematize = "sak-shadow-green";
                    else if(periodoCensimento > 10 && periodoCensimento <= 60)
                        tematize = "sak-shadow-orange";
                    else
                        tematize = "sak-shadow-red"

                        datasak.classTematize = tematize;
                }
                else
                    tematize = "sak-shadow-white";

            }

        }

        if(options.datatrack !== undefined)
        {
            var datatrack = options.datatrack;

            if(categoria == 'tracciamento')
            {
                var frequenza = datatrack.frequenza;
                var presidiabilita = datatrack.presidiabilita;

                if(datatrack.classTematize == null)
                {
                    if(presidiabilita == 'owner')
                    {
                        tematize = "sak-shadow-GRAY";
                    }
                }
                /*

Di rado				white da 1 a 5
Ogni tanto			red	  da 5 a 15
Spesso				orange da 15 a 30
Abitudinario		green da 30 a 100
Ben presidiato		azure
Catturato			
			*/
                //XXX: qui definire la granularità dei colori da applicare ad ogni valore di presidiabilità
                if(presidiabilita >= 0.0002 && presidiabilita <= 0.0050)
                    tematize = "sak-shadow-white";
                else if(presidiabilita > 0.0050 && presidiabilita <= 0.0465)
                    tematize = "sak-shadow-red";
                else if(presidiabilita > 0.0465 && presidiabilita <= 0.1860)
                    tematize = "sak-shadow-orange";
                else if(presidiabilita >= 0.1860 && presidiabilita <= 2.0090)
                    tematize = "sak-shadow-green";
                else if(presidiabilita > 2.0090)
                    tematize = "sak-shadow-azure"

                    datatrack.classTematize = tematize;

            }
        }
		
		if(options.datacaratteristiche !== undefined)
		{
			var datacaratteristiche = options.datacaratteristiche;

			if(categoria == 'caratteristicheportali')
            {
				
				//var generale = datacaratteristiche.caratteristiche;
				var statsazioni = datacaratteristiche.statistiche;
				var maxoccorrenzaazione = statsazioni[0];
				
				//var occorrenza = maxoccorrenzaazione.occorrenza;
				var actionplayer = maxoccorrenzaazione.actionplayer;
				//informazioni peculiari per tematizzare le caratteristiche su mappa
				//occorrenza tipo azione player piu usata
				//dominanza
				//dominante
				//classifica occorrenze azioni
				switch (actionplayer) {
                case 'C':
                    tematize = "sak-shadow-white";
                    break;
                case 'DR':
                    tematize = "sak-shadow-red";
                    break;
                case 'DPR':
                    tematize = "sak-shadow-orange";
                    break;
                case 'CL':
                    tematize = "sak-shadow-green";
                    break;
                case 'DF':
                    tematize = "sak-shadow-yellow";
                    break;
                case 'CF':
                    tematize = "sak-shadow-azure";
                    break;
                case 'DL':
                    tematize = "sak-shadow-fuchsia";
                    break;
				default:
                    break;
				}
                    datacaratteristiche.classTematize = tematize;
					
			}
			else if(categoria == 'influenzadominante')
			{
				var data = datacaratteristiche.caratteristiche;
					console.debug("Fazione Dominante: "+data.dominante);
					console.debug("Grado di dominanza: "+data.dominanza+" %");
					console.debug("Influenza Resistenza: "+data.resincisivita+" %");
					console.debug("Influenza Illuminati: "+data.enlincisivita+" %");
					
					var dominanza = data.dominanza;
					var dominante = data.dominante;
					
					if(dominante == 'RESISTANCE')
					{
						var incisivita = data.resincisivita;

						var incisivita = (incisivita);
						//incisivita = incisivita.replace('.',',');
						incisivita = parseFloat(incisivita).toFixed(2);//Number(incisivita);
						
						
						if(incisivita > 50.00)
									tematize = "sak-shadow-blue1";
						else if(incisivita > 15.00 && incisivita <= 50.00)
									tematize = "sak-shadow-blue2";
						else if(incisivita > 5.00 && incisivita <= 15.00)
									tematize = "sak-shadow-blue3";
						else if(incisivita < 5.00)
									tematize = "sak-shadow-blue4";
							//else if(incisivita > 5.00 && incisivita <= 12.00)
						/*else if(incisivita > 1.00 && incisivita <= 5.00)
									tematize = "sak-shadow-blue5";
						else if(incisivita < 1.00)
									tematize = "sak-shadow-blue6";*/
						
						
					}
					else if(dominante == 'ENLIGHTENED')
					{
						var incisivita = data.enlincisivita;
						//incisivita = incisivita.replace('.',',');
						
						var incisivita = (incisivita);
						
						incisivita = parseFloat(incisivita).toFixed(2);					
						
						if(incisivita > 50.00)
									tematize = "sak-shadow-green1";
						else if(incisivita > 15.00 && incisivita <= 50.00)
									tematize = "sak-shadow-green2";
						else if(incisivita > 5.00 && incisivita <= 15.00)
									tematize = "sak-shadow-green3";
						else if(incisivita < 5.00 )
									tematize = "sak-shadow-green4";
						//else if(incisivita > 5.00 && incisivita <= 12.00)
						/*			tematize = "sak-shadow-green4";
						else if(incisivita > 1.00 && incisivita <= 5.00)
									tematize = "sak-shadow-green5";
						else if(incisivita < 1.00)
									tematize = "sak-shadow-green6";*/
					}
					else
					{
						tematize = "sak-shadow-white";
					}
					
					datacaratteristiche.classTematize = tematize;
			}
		}
		
		//TODO: incisivita
		if(options.dataincisivita !== undefined)
        {
            var dataincisivita = options.dataincisivita;

            if(categoria == 'incisivita')
            {
                var valoreincisivita = dataincisivita.valoreincisivita;
				
				switch (valoreincisivita) {
                case '0':
                    tematize = "sak-shadow-white";
                    break;
                case '1':
                    tematize = "sak-shadow-red";
                    break;
                case '2':
                    tematize = "sak-shadow-orange";
                    break;
                case '3':
                    tematize = "sak-shadow-green";
                    break;
                case '4':
                    tematize = "sak-shadow-azure";
                    break;
                case '5':
                    tematize = "sak-shadow-yellow";
                    break;
                case '6':
                    tematize = "sak-shadow-fuchsia";
                    break;
                case '7':
                    tematize = "sak-shadow-LIGHTSKYBLUE";
                    break;
                case '8':
                    tematize = "sak-shadow-SPRINGGREEN";
                    break;
                case '9':
                    tematize = "sak-shadow-TOMATO";
                    break;
                case '10':
                    tematize = "sak-shadow-SLATEGRAY";
                    break;
                case '11':
                    tematize = "sak-shadow-PALEGOLDENROD";
                    break;
               case '12':
                    tematize = "sak-shadow-SILVER";
                    break;
					default:
                    break;
            }
                    dataincisivita.classTematize = tematize;

            }
        }

    }

	window.plugin.sak.flipFlopRenderGis = function(valueFlipFlop, classTematize)
	{

		if(valueFlipFlop)
		{
			for(var cLevel in window.plugin.sak.levelLayers)
			{
				var cLayer = window.plugin.sak.levelLayers[cLevel];

				//XXX: procedura di eliminazione
				//se esplicitata la class da eliminare, si elimina solo quella
				//altrimenti sono rimossi tutti
				var canRemove = true;

				if(classTematize != null)
				{
					canRemove = false;

					if(cLayer._icon != null)
					{
						var cClass = cLayer._icon.className;
						if(cClass.indexOf(classTematize) != -1)
							canRemove = true;
					}
				}
				if(canRemove)
				{
					window.plugin.sak.levelLayerGroup.removeLayer(cLayer);
					delete window.plugin.sak.levelLayers[cLevel];
				}
			}
		}
		else
		{
			
			var listCoordinate = window.plugin.sak.mappingLngLatTematize[classTematize];
			$.each(listCoordinate, function(j, cLtng) {
			   window.plugin.sak.addLabelCoordinata(cLtng, classTematize);
			});	
			
		}
	
	
	}
	
    window.plugin.sak.deleteRenderPortaliSAK = function(classTematize) 
    {

        //reset della lista dei portali tracciati
        window.plugin.sak.tracciamentoPlayer["list"] = {};
        window.plugin.sak.incisivitaPlayer["list"] = {};
		window.plugin.sak.caratteristichePortali["list"] = {};
		

		if(classTematize == null)
		{
			$.each(window.plugin.sak.temiTrackPlayer, function(j, cKey) {
			   $("#"+cKey).text("");
			});	

			//XXX: reset della lista dei portali censiti dalla chiamata precedente
			$.each(window.plugin.sak.temiCaratteristiche, function(j, cKey) {
			   $("#"+cKey).text("");
			});	
			
			//XXX: reset della lista dei portali censiti dalla chiamata precedente
			$.each(window.plugin.sak.temiCensimento, function(j, cKey) {
			   $("#"+cKey).text("");
			});	

			//XXX: reset della lista dei portali censiti dalla chiamata precedente
			$.each(window.plugin.sak.temiIncisivitaPlayer, function(j, cKey) {
			   $("#"+cKey).text("");
			});					
		}

        for(var cLevel in window.plugin.sak.levelLayers)
        {
            var cLayer = window.plugin.sak.levelLayers[cLevel];

            //XXX: procedura di eliminazione
            //se esplicitata la class da eliminare, si elimina solo quella
            //altrimenti sono rimossi tutti
            var canRemove = true;

            if(classTematize != null)
            {
                canRemove = false;

                if(cLayer._icon != null)
                {
                    var cClass = cLayer._icon.className;
                    if(cClass.indexOf(classTematize) != -1)
                        canRemove = true;
                }
            }
            if(canRemove)
            {
                window.plugin.sak.levelLayerGroup.removeLayer(cLayer);
                delete window.plugin.sak.levelLayers[cLevel];
            }
        }

    }

    //XXX: potrebbe creare delle regressioni sulla versione mobile. capire perchè
    window.plugin.sak.deleteRenderSinglePortalSAK = function(guid) 
    {
        var cObjLayer = window.plugin.sak.levelLayers[guid];

        if(cObjLayer != undefined)
        {
            window.plugin.sak.levelLayerGroup.removeLayer(cObjLayer);
            delete window.plugin.sak.levelLayers[cObjLayer];
        }

    }

    //--------------------------------------
    //--------------------------------------
    //--------------------------------------
    //--------------------------------------

    //XXX: Metodi obsoleti

    //XXX: OBSOLETO
    window.plugin.sak.writeLog = function(overridechannel) {

        //inibisce la registrazione quando richiesto dall'utente
        if (window.plugin.sak.suspendreg) {
            return false;
        }

        //la registrazione è inibita se è già in corso una registrazione

        if(window.plugin.sak.supportedFlipFlop['enablemulticallloggerchat'])
            if(window.plugin.sak.waitnextcall)
                return false;


        //definizione del contesto di registrazione
        var contextlogtosend = "chatalerts";

        if ($('#chatfaction').css('display') == "block")
            contextlogtosend = "chatfaction";
        else if ($('#chatall').css('display') == "block")
            contextlogtosend = "chatall";
        else if ($('#chatalerts').css('display') == "block")
            contextlogtosend = "chatalerts";

        //impone il contesto di registrazione se passato in input
        if (overridechannel == 'chatall')
            contextlogtosend = overridechannel;

        //contenuto html del contesto chat da registrare
        var contentToSend = $("#" + contextlogtosend).html();

        //notifica all'utente che l'area della chat è vuota o disattivata (quando la modalità privacy è attiva)
        if (contentToSend == null || contentToSend == "") {

            $("#buttoninvia").attr("value", window.plugin.sak.nameinvia).text(
                window.plugin.sak.nameinvia);
            /*$('#anomaliaclient')
					.html("L'area di chat risulta disattivata o vuota");*/

            var callback = function(){ $('#anomaliaclient').html(''); };
            window.plugin.sak.mutexSak(callback);								

            return false;
        } else {

            console.debug("Invio informazioni del tab " + contextlogtosend);
            var friendlyMsg = 'Invio informazioni del tab ' + contextlogtosend;

            // analisi dom xml lato javascript
            // soffre di mismatching encoding. è usato solo per fornire counting
            // a lato server è inviato il plaintext grezzo.
            try {

                //pulizia del contenuto html dai caratteri non validi per la definizione del dom
                contentToSendEscaped = window.plugin.sak
                    .cleanDom(contentToSend);

                //contentToSendEscaped = window.plugin.sak.chat.securityReplace(contentToSendEscaped);

                //istanza del dom xml del contenuto html
                var xmlContent = $.parseXML(contentToSendEscaped);

                //recupero delle righe tr della table della chat da registrare
                //$("tr").filter(":contains('continuo a filtrare')").remove();
                var result = $(xmlContent).find("tr");

                //si controlla che il numero delle righe tr siano minori del limite, altrimenti vengono eliminate a partire dall'ultima
                /*for (var i = 0; i < result.length; i++) {
						var trCurrent = result[i];
						var textContent = trCurrent.childNodes[2].innerHTML;
						if(textContent.indexOf('continuo a filtrare') !== -1)
						{
							//trCurrent.remove();
							$(xmlContent).remove(trCurrent);
						}
					}*/

                if (result.length > window.plugin.sak.limiteActions) {


                    var deltaActions = result.length
                    - window.plugin.sak.limiteActions;
                    console.log("Superato il limite di "
                                + window.plugin.sak.limiteActions
                                + " actions (trovate " + result.length
                                + "). Stanno per essere rimosse le " + deltaActions
                                + " actions in coda.");


                    for (var i = 0; i < deltaActions; i++) {
                        $(xmlContent).find("tr").remove(":last");
                    }

                    var mustEqualLimit = $(xmlContent).find("tr");
                    console.log("Actions volute : "
                                + window.plugin.sak.limiteActions
                                + " . Actions trovate: " + mustEqualLimit.length);

                    friendlyMsg = friendlyMsg+". Actions volute : "
                        + window.plugin.sak.limiteActions
                        + " . Actions trovate: " + mustEqualLimit.length;

                    var oSerializer = new XMLSerializer();
                    contentToSend = oSerializer.serializeToString(xmlContent);
                }

                console.log("Stanno per essere inviati al server "
                            + $(xmlContent).find("tr").length
                            + " actions di gioco.");

                friendlyMsg = friendlyMsg+". Stanno per essere inviati al server "
                    + $(xmlContent).find("tr").length
                    + " actions di gioco.";
            } catch (err) {

                console.log("Errore durante il parsing content: "
                            + contentToSendEscaped);

                $('#anomaliaclient').html("Errore durante il parsing content: "
                                          + contentToSendEscaped);
                friendlyMsg = "";
                //alert
                console.log("WARNING: Non è stato possibile analizzare i dati che stanno per essere inviati.\nPertanto non è possibile controllare il numero delle azioni. Se i dati sono elevati potrebbe fallire l'invio");
            }


            var msgLink = "";
            if(window.plugin.sak.supportedFlipFlop['enablemulticallloggerchat'])
            {
                msgLink = "Invio di "+$(xmlContent).find("tr").length+" actions " + contextlogtosend + " in corso...";
            }
            else
            {
                msgLink = "Invio di multiple azioni " + contextlogtosend + " in corso...";
            }

            window.plugin.sak.countcalls = window.plugin.sak.countcalls + 1;
            window.plugin.sak.countcallsactions = window.plugin.sak.countcallsactions +1;
            $("#buttoninvia").attr("value",
                                   msgLink).text(
                msgLink);

            window.plugin.sak.ledSak = 'green';
            $("#countcalls").css('color',window.plugin.sak.ledSak);
            $('#countcalls').html(window.plugin.sak.countcalls);

            console.log("Limite actions inviabili settato a "
                        + window.plugin.sak.limiteActions);

            // -----------------------------------------------------------------
            // -----------------------------------------------------------------
            // -----------------------------------------------------------------
            // -----------------------------------------------------------------
            var cipher = window.plugin.sak.getCipher();

            var contentBase64 = window.plugin.sak.base64Encode(contentToSend);

            //contentToSend = window.plugin.sak.chat.securityReplace(contentToSend,true);
            var contentToJson = window.plugin.sak.xml2json(xmlContent);
            //var contentToJsonBase64 = window.plugin.sak.base64Encode(contentToSend);
            //console.log(xmlContent);

            $('#esitoclient').html(friendlyMsg);

            window.plugin.sak.waitnextcall = true;
            $
                .post(
                window.plugin.sak.endpointsak,
                {
                    context : "loggerchat",
                    objplayer : JSON.stringify(window.PLAYER),
                    detailcontext : contextlogtosend,
                    content : contentToSend,
                    contentbase64 : contentBase64,
                    hashscript : cipher,
                    limiteactions : window.plugin.sak.limiteActions
                },
                function(data) {
                    // alert(data.idreport);
                    // window.plugin.sak.download(data);
                    window.plugin.sak.waitnextcall = false;
                    // di norma è settato a true, ed è la negazione
                    // del mustRegister
                   /* if (window.plugin.sak.mustRegister) {
                        $('#registration')
                            .html(
                            '<fiedlset>Agente '
                            + window.PLAYER.nickname
                            + ' la registrazione è avvenuta con successo! Enjoy You!</fieldset>');
                        $('#consolericerca').show();

                        var callback = function(){ $('#registration').html(''); };
                        window.plugin.sak.mutexSak(callback);								
                    }*/

                    console.log(data.esitocodifica);

                    if (data.codecontrol > 0) {
                        if (!window.isSmartphone())
                            $('#containeristantanea')
                                .append(
                                $(
                                    "<div id='istantanea"
                                    + data.idreport
                                    + "'>")
                                .append(
                                    $(
                                        "<a class='reports'>")
                                    .attr(
                                        "value",
                                        window.plugin.sak.namescaricareport)
                                    .attr(
                                        "onclick",
                                        "window.plugin.sak.getIstantanea("
                                        + data.idreport
                                        + ");$('#istantanea"
                                        + data.idreport
                                        + "').remove();")
                                    .text(
                                        window.plugin.sak.namescaricareport
                                        + " codice: "
                                        + data.idreport)));
                        else
                            $('#containeristantanea')
                                .append(
                                $(
                                    "<div id='istantanea"
                                    + data.idreport
                                    + "'>")
                                .append(
                                    $(
                                        "<label class='reports'>")
                                    .html(
                                        "Il report codice: "
                                        + data.idreport
                                        + " è stato registrato")));
                    }

                    console
                        .log("Dati inviati al server correttamente!");
                    console
                        .log("Il server ha impostato il limite di caricamento a "
                             + data.maxload + " azioni.");

                    $('#esitoserver').html("Dati inviati al server correttamente! Il server ha impostato il limite di caricamento a " + data.maxload + " azioni.");												

                    window.plugin.sak.CONST_LIMIT = data.maxload;
                    window.plugin.sak.limiteActions = window.plugin.sak.CONST_LIMIT;

                    window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                    window.plugin.sak.countcallsactions = window.plugin.sak.countcallsactions -1;
                    $('#countcalls').html(
                        window.plugin.sak.countcalls);
                    $('#resetreports').show();
                    if (window.plugin.sak.countcallsactions == 0)
                        $("#buttoninvia").attr("value",
                                               window.plugin.sak.nameinvia).text(
                            window.plugin.sak.nameinvia);

                    // è a true solo dopo la prima volta che si è
                    // registrato
                    //$('#statsinviodati').show();
                    $('#linkviewstats').show();

                    $('#statsinviodati').html(
                        "<span ><br/><b>Statistiche invio del report "+ data.idreport + "</b><br/>"+ data.esito+"</span>");

                    window.plugin.sak.countinserted = window.plugin.sak.countinserted
                        + data.statistiche.countinserted;
                    window.plugin.sak.countignored = window.plugin.sak.countignored
                        + data.statistiche.countignored;
                    window.plugin.sak.countduplicate = window.plugin.sak.countduplicate
                        + data.statistiche.countduplicate;
                    window.plugin.sak.countrows = window.plugin.sak.countrows
                        + data.statistiche.countrows;
                    window.plugin.sak.countfields = window.plugin.sak.countfields
                        + data.statistiche.countfields;
                    window.plugin.sak.countlink = window.plugin.sak.countlink
                        + data.statistiche.countlink;
                    window.plugin.sak.countcaptured = window.plugin.sak.countcaptured
                        + data.statistiche.countcaptured;
                    window.plugin.sak.countnotifiche = window.plugin.sak.countnotifiche
                        + data.statistiche.countnotifiche;
                    window.plugin.sak.countconversazione = window.plugin.sak.countconversazione
                        + data.statistiche.countconversazione;
                    window.plugin.sak.countresodestroy = window.plugin.sak.countresodestroy
                        + data.statistiche.countresodestroy;
                    window.plugin.sak.countenl = window.plugin.sak.countenl
                        + data.statistiche.countenl;
                    window.plugin.sak.countres = window.plugin.sak.countres
                        + data.statistiche.countres;

                    var statistichesessione = "<span ><b>Statistiche invio della sessione</b> Salvate: "+ window.plugin.sak.countinserted+"</span>";

                    var statistichetotali = 
                        "<span ><br/>di cui";
                    statistichetotali = statistichetotali
                        + "<br/>Control fields: "
                        + window.plugin.sak.countfields;
                    statistichetotali = statistichetotali
                        + "<br/>Link: "
                        + window.plugin.sak.countlink;
                    statistichetotali = statistichetotali
                        + "<br/><b>Catturati</b>: "
                        + window.plugin.sak.countcaptured;
                    statistichetotali = statistichetotali
                        + "<br/>Notifiche: "
                        + window.plugin.sak.countnotifiche;
                    statistichetotali = statistichetotali
                        + "<br/>Conversazioni: "
                        + window.plugin.sak.countconversazione;
                    statistichetotali = statistichetotali
                        + "<br/>Resonator distrutti: "
                        + window.plugin.sak.countresodestroy;
                    statistichetotali = statistichetotali
                        + "<br/><br/><p style='color:#0088FF' >Resistenza : "
                        + window.plugin.sak.countres+"</p>";
                    statistichetotali = statistichetotali
                        + "<br/><p style='color:#03DC03' >Illuminati: "
                        + window.plugin.sak.countenl+"</p></span>";

                    //$('#statsinviodatitotale').show();
                    $('#statsinviodatitotale').html(statistichesessione+
                                                    statistichetotali);

                    //var callback = function(){ $('#esitoclient').html('idle...'); $('#esitoserver').html('idle...'); };
					var callback = function(){ window.plugin.sak.setTextConsole( 'idle...', 'consoleclient');window.plugin.sak.setTextConsole( 'idle...', 'consoleserver');};

                    window.plugin.sak.mutexSak(callback,5,1000);								
                    /*var callback2 = function(){ $('#esitoclient').html('');$('#esitoserver').html('');};
							window.plugin.sak.mutexSak(callback2,5);*/

                })
                .fail(
                function(xhr, textStatus, errorThrown) {
                    console.log(xhr.statusText);
                    console.log(xhr.responseText);
                    console.log(textStatus);
                    console.error(error);

                    window.plugin.sak.waitnextcall = false;
                    window.plugin.sak.getFailError(xhr,textStatus, "Registrazione azioni");
                    $("#buttoninvia").attr("value",
                                           window.plugin.sak.nameinvia).text(
                        window.plugin.sak.nameinvia);
                    window.plugin.sak.countcalls = window.plugin.sak.countcalls - 1;
                    window.plugin.sak.countcallsactions = window.plugin.sak.countcallsactions -1;
                    $('#countcalls').html(
                        window.plugin.sak.countcalls);

                });

            // -----------------------------------------------------------------
            // -----------------------------------------------------------------
            // -----------------------------------------------------------------
            // -----------------------------------------------------------------

            return true;
        }
    }
    window.plugin.sak.chat.securityReplace = function(texttoreplace, isDom) {
        var textToValidate = texttoreplace.toLowerCase();

        var textResult;

        if (textToValidate.indexOf("poker") >= 0) {
            console.log("Trovata la parola poker nel contenuto html");
            if(!isDom)
                textResult = window.plugin.sak.replaceAll(textToValidate, "poker",
                                                          "p_ker");
            else
                textResult = window.plugin.sak.replaceAll(textToValidate, "poker",
                                                          "rek_p_");


            console.log("Contenuto ripulito dalla parola vietata: "+textResult);
        } else
            textResult = texttoreplace;

        return textResult;

    }	

    //----------------------------------------------------------------------------------------------
	load(window.plugin.sak.rootpath+'scripts/sak_ui.js?'+random);//.thenRun(window.boot);	

} // wrapper end

// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script)
    info.script = {
        version : GM_info.script.version,
        name : GM_info.script.name,
        description : GM_info.script.description
    };
script.appendChild(document.createTextNode('(' + wrapper + ')('
                                           + JSON.stringify(info) + ');'));


(document.body || document.head || document.documentElement)
    .appendChild(script);

