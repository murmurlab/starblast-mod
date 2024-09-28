// Customizing the scoreboard or radar
// The built-in scoreboard or radar can be replaced by your own custom scoreboard/radar component. As soon as an UI component with id "scoreboard" or "radar_background" is created, you will be responsible for updating the scoreboard/radar. Your custom scoreboard/radar component does not have to include a position because it will automatically fill the area already reserved for the perspective UI Component.
let mine

game.modding.commands.restart = function(req) {
	game.modding.commands.stop()
	game.modding.commands.start()
	game.modding.commands.test()
  };

//   fetch('https://murmurlab.glitch.me/starblast/', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({  })
// });

verify_code = ship => {
	code = ship.custom.input_value
	// ship.gameover({
	// 	"Game closed": "Disconnected",
	// 	"Try to join more faster":"",
	//  });
	ship.intermission({
		"Authenticated":"Managed to run the mod",
		"Score":`${code}`
	});
	ship.set({
		idle:false,
		collider:true,
	})
	ship.setUIComponent(UIC_login_btn_1(ship))
	UIC_login_btn_handler(ship)

	return false
}

UIC_num_off = (ship) => {
	ship.custom.num_active = false
	for (let i = 0; i <= 9; i++)
		ship.setUIComponent(UIC_key_numeric({numkey: i, active:false}))
	echo(`num_active: ${ship.custom.num_active}`)
}

UIC_num_on = (ship) => {
	ship.custom.num_active = true
	for (let i = 0; i <= 9; i++)
		ship.setUIComponent(UIC_key_numeric({numkey: i, active:true}));
	echo(`num_active: ${ship.custom.num_active}`)
}

UIC_num_toggle = (ship, cb) => {
	if (ship.custom.num_active)
		ship.custom.controls.num_off(ship)
	else
		ship.custom.controls.num_on(ship)
	cb(ship.custom.num_active)
}

UIC_login_btn_0 = ({}) => {
	return {
		id: "UIC_login",
		position: [10, 50, 8, 14],
		clickable: true,
		shortcut: "V",
		visible: true,
		components: [
			{ type: "box", position: [0, 0, 100, 100], fill: "#456", stroke: "#CDE", width: 2 },
			{ type: "text", position: [10, 35, 80, 30], value: "verify (by murmurLAB)", color: "#CDE" },
			{ type: "text", position: [20, 70, 60, 20], value: "[1]", color: "#CDE" }
		]
	}
}

UIC_login_btn_1 = ship => {
	return {
		id: "UIC_login",
		position: [0, 0, 100, 100],
		clickable: true,
		shortcut: "V",
		visible: true,
		components: [
			{ type: "text", position: [25, 0, 30, 30], value: "enter secret code", color: "#CDE" },
			{ type: "text", position: [25, 10, 30, 30], value: ship.custom.overwrited({input_value: ship.custom.input_value}), color: "#CDE" },
		]
	}
}


UIC_key_numeric = ({
	numkey, active
}) => {
	return {
		id: "k" + numkey,
		position: [0, 0, 0, 0],
		clickable: active,
		shortcut: numkey.toString(),
		visible: false,
		components: []
	}	
}

// let overwrited = Array.from({length: 10, ..."__________", ...ship.custom.input_value}).toSpliced(5,0,"-").join("")


const UIC_login_btn_handler = (ship) => {
	ship.custom.controls.num_toggle(ship, e => {
		if (e) {
			ship.custom.num_input = true
			ship.setUIComponent(UIC_login_btn_1(ship))
		}
		else {
			ship.custom.num_input = false
			ship.setUIComponent(UIC_login_btn_0(ship));
		}
	})
	// 	ship.set({x:x,y:y,vx:0,vy:0,invulnerable:180}) ;
};




this.tick = function (game) {

	// if (game.step%60==0) // ensure this is done only once per second
	// {
	//   for (var i=0;i<game.ships.length;i++)
	//   {
	// 	var ship = game.ships[i] ;
	// 	if (!ship.custom.warp_button_installed)
	// 	{
	// 	  ship.custom.warp_button_installed = true; // use ship.custom to store custom values
	// 	  ship.setUIComponent(warp_button);
	// 	}
	//   }
	// }
};




let UI_Cs = new Array

UI_Cs.push(UIC_login_btn_0({}))
for (let i = 0; i <= 9; i++)
	UI_Cs.push(UIC_key_numeric({numkey: i, active: false}))




  
// DEFAULT ====================================================================================================================================================================
// DEFAULT ====================================================================================================================================================================
// DEFAULT ====================================================================================================================================================================
ship_defaults = (ship) => {

	return ({
		set: {
			idle:true,
			collider:false
		},
		setUIComponents: UI_Cs,
		custom: {
			controls: {
				num_off: UIC_num_off,
				num_on: UIC_num_on,
				num_toggle: UIC_num_toggle,
			},
			read_input: _read_passwd,
			num_active: false,
			num_input: false,
			input_value: "",
			input_count: 0,
			overwrited: ({input_value}) => Array.from({length: 10, ..."__________", ...input_value}).toSpliced(5,0,"-").join("")
		}
	})
}
// DEFAULT ====================================================================================================================================================================
// DEFAULT ====================================================================================================================================================================
// DEFAULT ====================================================================================================================================================================



objstr = a => JSON.stringify(a, (key, value) => {
	if (typeof value === 'object' && value !== null) {
		if (value instanceof Array) {
			return value.map(
				(item, index) => 
				(index === value.length - 1 ? 
					'circular reference' : item));
		}
		return { ...value, circular: 'circular reference' };
	}
	return value;
})


custom_set = (ship, options) => {

	if (!options) {
		echo("ship swawn with default set()")
	}
	echo("ship swawn with non-default set()")
	objstr(options)
	ship.set(options.set)
	options.setUIComponents.forEach(a_component => {
		echo(`comp load: ${a_component}`)
		ship.setUIComponent(a_component)
	});
	Object.assign(ship.custom, options.custom)
	// ship.custom = {
	// 	...ship.custom,
	// 	...options.custom,
	// }

}

shipJustSpawned = (ship) => {
	ship.custom.set(ship, ship.custom.defaults)
	ship.custom.num_active = false
	// ship.set({idle:true})
	// ship.setUIComponent(UIC_login_btn(ship));
	// ship.custom = {
	// 	input_mode: false,
	// 	input_value: "",
	// 	input_count: 0,
	// 	overwrited: ({input_value}) => Array.from({length: 10, ..."__________", ...input_value}).toSpliced(5,0,"-").join("")
	// }


}
// Object.assign([..."_____-_____"], [...ship.custom.input_value])

const event_match = new Map()

const _read_passwd = (ship, i) => {
	ship.custom.input_count++
	ship.custom.input_value += i.toString()
	ship.setUIComponent(UIC_login_btn_1(ship))
	echo(`index ${ship.custom.input_count}`)
	echo(i.toString())
	if (ship.custom.input_count >= 10) {
		ship.custom.input_count = 0;
		ship.custom.input_value = "";
		if (verify_code(ship)) {
			
		}
	}
}

const numkey_handler = (data, i) => {
	ship = data
	if (ship.custom.num_input)
		ship.custom.read_input(ship, i)
}






for (let i = 0; i <= 9; i++) {
	event_match.set("k"+i, (ship) => numkey_handler(ship, i))
}
event_match.set("UIC_login", ship => UIC_login_btn_handler(ship))
event_match.set("spawn_event", ship => shipJustSpawned(ship))


this.event = function (event, game) {
	switch (event.name) {
		case "ui_component_clicked": {
			event_match.get(event.id)(event.ship)
			break;
		}
		case "ship_spawned": {
			if (event.ship != null) {
				mine = event.ship // one player 
				event.ship.custom.defaults = ship_defaults(event.ship)
				event.ship.custom.set = custom_set
				event_match.get("spawn_event")(event.ship)
			}
			break;
		}
	}
};
