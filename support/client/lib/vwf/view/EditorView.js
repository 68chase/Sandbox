"use strict";
define(["module", "version", "vwf/view", "vwf/view/editorview/alertify.js-0.3.9/src/alertify","vwf/view/editorview/Menubar", "vwf/view/editorview/WindowResize","vwf/view/editorview/_PermissionsManager", "vwf/view/editorview/InputSetup", "vwf/view/editorview/SaveLoadTimer", "vwf/view/editorview/TouchHandler", "vwf/view/editorview/SidePanel", "vwf/view/editorview/Toolbar", "vwf/view/editorview/ChatSystemGUI", "vwf/view/editorview/PrimitiveEditor", "vwf/view/editorview/MaterialEditor", "vwf/view/editorview/Notifier", "vwf/view/editorview/ScriptEditor", "vwf/view/editorview/Editor", "vwf/view/editorview/_3DRIntegration", "vwf/view/editorview/InventoryManager", "vwf/view/editorview/HeirarchyManager",  "vwf/view/editorview/DataManager", "vwf/view/editorview/UserManager", "vwf/view/editorview/help"], function (module, version, view)
{
	return view.load(module,
	{
		// == Module Definition ====================================================================
		initialize: function ()
		{
			
			
			$(document.head).append('<link rel="stylesheet" type="text/css" href="vwf/view/editorview/ddsmoothmenu.css" />');
			$(document.head).append('<link rel="stylesheet" type="text/css" href="vwf/view/editorview/ddsmoothmenu-v.css" />')
			$(document.head).append('<link rel="stylesheet" type="text/css" href="vwf/view/editorview/Editorview.css" />')
			$(document.head).append('<link rel="stylesheet" type="text/css" href="vwf/view/editorview/alertify.js-0.3.9/themes/alertify.core.css" />')
			$(document.head).append('<link rel="stylesheet" type="text/css" href="vwf/view/editorview/alertify.js-0.3.9/themes/alertify.bootstrap.css" />')
			
			$(document.body).append($.get('vwf/view/editorview/menus.html',
			{
				async: false,
				datatype: 'text'
			}).responseText);
			$(document.head).append('<script src="vwf/model/threejs/helvetiker_regular.typeface.js"></script>');
			$(document.head).append('<script src="vwf/model/threejs/tinyxmlw3cdom.js"></script>');
			$(document.head).append('<script src="vwf/model/threejs/tinyxmlsax.js"></script>');
			$(document.head).append('<script src="vwf/model/threejs/tinyxmlxpath.js"></script>');
			
			if (!window._EditorInitialized)
			{
				jQuery.extend(
				{
					parseQuerystring: function ()
					{
						var nvpair = {};
						var qs = window.location.search.replace('?', '');
						var pairs = qs.split('&');
						$.each(pairs, function (i, v)
						{
							var pair = v.split('=');
							nvpair[pair[0]] = pair[1];
						});
						return nvpair;
					}
				});
				if ($.parseQuerystring().Edit != 'false')
				{
					window._EditorInitialized = true;
					console.log('initialize Index-vwf');
					var data = $.ajax('vwf/view/editorview/menus.html',
					{
						async: false,
						dataType: 'html'
					}).responseText;
					$(document.body).append(data);
					$(document.head).append('<script type="text/javascript" src="vwf/view/editorview/ddsmoothmenu.js"></script>');
					require("vwf/view/editorview/SidePanel").initialize();
					//initialize the primitive editor
					window._Editor = require("vwf/view/editorview/Editor").getSingleton();
					//initialize the primitive editor
					window._PrimitiveEditor = require("vwf/view/editorview/PrimitiveEditor").getSingleton();
					//initialize the Material editor
					window._MaterialEditor = require("vwf/view/editorview/MaterialEditor").getSingleton();
					window._MaterialEditor.hide();
					window._Notifier = require("vwf/view/editorview/Notifier").getSingleton();
					window._ScriptEditor = require("vwf/view/editorview/ScriptEditor").getSingleton();;
					window._ModelLibrary = require("vwf/view/editorview/_3DRIntegration").getSingleton();
					window._InventoryManager = require("vwf/view/editorview/InventoryManager").getSingleton();;
					window.HierarchyManager = require("vwf/view/editorview/HeirarchyManager").getSingleton();;
					window._PermissionsManager = require("vwf/view/editorview/_PermissionsManager").getSingleton();
					window._DataManager = require("vwf/view/editorview/DataManager").getSingleton();;
					window._UserManager = require("vwf/view/editorview/UserManager").getSingleton();;
					window.alertify = require("vwf/view/editorview/alertify.js-0.3.9/src/alertify");
					require("vwf/view/editorview/help").getSingleton();
					$(document.head).append('<script type="text/javascript" src="vwf/view/editorview/PainterTool.js"></script>');
					$(document.head).append('<script type="text/javascript" src="vwf/view/editorview/AlignTool.js"></script>');
					$(document.head).append('<script type="text/javascript" src="vwf/view/editorview/SplineTool.js"></script>');
					$(document.head).append('<script type="text/javascript" src="vwf/view/editorview/TerrainTool.js"></script>');
					$(document.head).append('<script type="text/javascript" src="vwf/view/editorview/jquery.qtip-1.0.0-rc3.min.js"></script>');
					$(document.head).append('<script type="text/javascript" src="vwf/view/editorview/sha256.js"></script>');
					$(document.head).append('<script type="text/javascript" src="vwf/view/editorview/jquery.ui.touch-punch.min.js"></script>');
					$(document.head).append('<script type="text/javascript" src="vwf/view/editorview/beautify.module.js"></script>');
					
					$('input[type="text"]').keypress(function(e){e.stopImmediatePropagation();});
					
					//  $(document).ready(function(){
					//	});
				}
			}
		},
		createdNode: function (nodeID, childID, childExtendsID, childImplementsIDs, childSource, childType, childURI, childName, callback /* ( ready ) */ )
		{},
		initializedNode: function (nodeID, childID)
		{
			if ($.parseQuerystring().Edit != 'false' && childID == 'index-vwf')
			{
				_Editor.initialize();
				InitializeEditor();
			}
			if (window._Editor && childID != 'index-vwf')
			{
				if (window._Editor.createNodeCallback != null)
				{
					window._Editor.CallCreateNodeCallback(childID, nodeID);
				}
			}
		},
		createdProperty: function (nodeID, propertyName, propertyValue)
		{},
		initializedProperty: function (nodeID, propertyName, propertyValue)
		{},
		deletedNode: function (nodeID)
		{
			if (window._Editor && _Editor.SelectedVWFID == nodeID)
			{
				_Editor.SelectObject(null);
			}
		},
		satProperty: function (nodeID, propertyName, propertyValue)
		{
			if (window._Editor && _Editor.isSelected(nodeID) && propertyName == _Editor.transformPropertyName)
			{
				_Editor.updateBoundsTransform(nodeID);
				_Editor.waitingForSet.splice(_Editor.waitingForSet.indexOf(nodeID), 1);
				if (_Editor.waitingForSet.length == 0)
				{
					_Editor.updateGizmoLocation();
					_Editor.updateGizmoSize();
					_Editor.updateGizmoOrientation(false);
				}
			}
		},
		createdMethod: function (nodeID, methodName, methodParameters, methodBody)
		{},
		calledMethod: function (nodeID, methodName, methodParameters)
		{},
		createdEvent: function (nodeID, eventName, eventParameters)
		{},
		firedEvent: function (nodeID, eventName, eventParameters)
		{},
		executed: function (nodeID, scriptText, scriptType)
		{},
	});
});

function InitializeEditor()
{
	document._UserManager = _UserManager;
	$('#vwf-root').css('overflow', 'hidden');
	$(document.body).css('font-size', '10px');
	$('#tabs').css('z-index', '101');
	$('#AvatarChoice').buttonset();
	$('#vwf-root').attr('tabindex', '0');
	vwf.logger.level = 6;
	if (document.Players)
	{
		for (var i = 0; i < document.Players.length; i++)
		{
			_UserManager.PlayerCreated(document.Players[i]);
		}
	}
	$('#sidepanel').css('height', $(window).height() - ($('#statusbar').height() + $('#toolbar').height() + $('#smoothmenu1').height()) + 'px')
	$('#sidepanel').jScrollPane();
	require("vwf/view/editorview/Toolbar").initialize();
	require("vwf/view/editorview/InputSetup").initialize();
	require("vwf/view/editorview/Menubar").initialize();
	require("vwf/view/editorview/WindowResize").initialize();
	require("vwf/view/editorview/SaveLoadTimer").initialize();
	
	require("vwf/view/editorview/TouchHandler").initialize();
	require("vwf/view/editorview/ChatSystemGUI").initialize();
	$(document.body).css('overflow', 'hidden');
	//	$('body *').not(':has(input)').not('input').disableSelection();
	//	$('#vwf-root').enableSelection();
	//	$('#vwf-root').parent().enableSelection();
	//	$('#vwf-root').parent().parent().enableSelection();
	//	$('#index-vwf').enableSelection();
	//	$('* :not(input)').disableSelection();
	
	
}

function PlayerDeleted(e)
{
	$("#" + e + "label").remove();
}

function GUID()
{
	var S4 = function ()
	{
		return Math.floor(Math.random() * 0x10000 /* 65536 */ ).toString(16);
	};
	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
