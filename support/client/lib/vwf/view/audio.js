/*
 * WebRTC.js : Behaves as a wrapper for vwf/view/rtcObject
 * Maps simple 1:1 signal model to a broadcast model using target and sender ids
 */

define( [ "module", "vwf/view", "vwf/view/buzz/buzz.min"], function( module, view, buzz ) {


	//a simple structure to hold the BUZZ sound reference and position data
	function SoundSource()
	{
		this.id = null;
		this.sound = null;
		this.position = null;
		this.volume = 1;
		this.endrange = 100;
		this.startrange = 1;
		this.loop = false;
		
	}
	//Get the position of your source object
	//note: the 3D driver must keep track of this
	SoundSource.prototype.updateSourcePosition = function()
	{
		this.position = vwf.getProperty(this.id,'worldPosition');
	}
	//use inverse falloff, adjust the range parameters of the falloff curve by the "volume"
	//since HTML cant actually play it louder, but we can make it 'carry' farther
	SoundSource.prototype.updateVolume = function(camerapos)
	{
		var x = Vec3.distance(camerapos,this.position);
		x = Math.max(0,x);
		var v = this.volume;
		
		var vol = ((-x+v)/v) * ((-x+v)/v);
		this.sound.setVolume(Math.max(Math.min(vol,1),0) * 100 );
	}
	//the driver
	return view.load( module, {

		initialize : function()
		{
			this.buzz = require("buzz");
			this.sounds = {};
			this.soundSources = {};
			//set this up as a global, so that we can play a click to indicate GUI actions
			window._SoundManager = this;
			
		},
		//simple function for gui elements to play sounds
		playSound:function(url,volume)
		{
			this.calledMethod('index-vwf','playSound',[url,false,volume]);
		
		},
		calledMethod : function(id,name,params)
		{
			//if the scene played the sound, it has no position and just plays at full volume
			if(name == 'playSound' && id == 'index-vwf')
			{
				
				var url = params[0];
				var loop = params[1] || false;
				
				//cache the sound - can only be played simultainously by different nodes
				if(this.sounds[url])
				{
					this.sounds[url].play();
					if(loop)
					this.sounds[url].loop();
					else
					this.sounds[url].unloop();
				}
				else
				{
					var mySound = new this.buzz.sound(url,{
						autoplay: true,
						loop: loop
					});
					this.sounds[url] = mySound;
				
				}
				
			} 
			//Nodes that are not the scene use their position to adjust the volume
			else if(name == 'playSound')
			{
				var url = params[0];
				var loop = params[1] || false;
				var vol =  params[2] || 1;
				var soundid = id+url;
				var Sound = this.soundSources[soundid];
				//cache the sound - can only be played simultainously by different nodes
				if(!Sound)
				{
					var Sound = this.soundSources[soundid] = new SoundSource()
					Sound.id = id;
					Sound.url = url;
					Sound.loop = loop;
					Sound.volume = vol;
					Sound.sound = new this.buzz.sound(url,{
							autoplay: true,
							loop: loop
							
					});
				
					Sound.position = [0,0,0];
					window._dSound = Sound;
				}else
				{
					Sound.sound.play();
					if(loop)
					Sound.sound.loop();
					else
					Sound.sound.unloop();
					Sound.volume = vol;
				}
			}
			//pause the sound
			if(name == 'pauseSound')
			{
				var url = params[0];
				var soundid = id+url;
				var Sound = this.soundSources[soundid];
				if(Sound)
				Sound.sound.pause();
			}
			//stop the sound
			if(name == 'stopSound')
			{
				var url = params[0];
				var soundid = id+url;
				var Sound = this.soundSources[soundid];
				if(Sound)
				Sound.sound.stop();
			}
			//delete the sound completely - only use this if you sure the sound will not play again anytime soon.
			if(name == 'deleteSound')
			{
				var url = params[0];
				var soundid = id+url;
				var Sound = this.soundSources[soundid];
				if(Sound)
				{
					Sound.sound.stop();
					Sound.sound = null;
				}
				delete this.soundSources[soundid];
			}
		},
		//Update the sound volume based on the position of the camera and the position of the object
		ticked : function()
		{
			try{
			var cameraID = vwf.getProperty('index-vwf','activeCamera');
			if(!cameraID) return;
			
			var campos = vwf.getProperty('index-vwf','cameraPosition');
			for(var i in this.soundSources)
			{
				this.soundSources[i].updateSourcePosition();
				this.soundSources[i].updateVolume(campos);
			}
			}catch(e)
			{
			
			}
		
		},
		deletedNode: function(id)
		{
			for(var i in this.soundSources)
			{
				if(this.soundSources[i].id == id)
					delete this.soundSources[i];
			
			}
		}
	})
});
