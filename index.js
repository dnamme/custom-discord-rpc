const RPC = require("discord-rpc");
const readline = require("readline");

const rpc = new RPC.Client({
    transport: "ipc"
});
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});



var currentActivity = {};

rl.on("line", (line) => {
    var args = line.split(" ");
    var cmd = args.shift();

    if(cmd == "set")
        setActivity(findArgs(args));
    else if(cmd == "edit")
        editActivity(findArgs(args));
    else if(cmd == "clear")
        clearActivity();
    // else if(cmd == "idle")
    //     setIdle();
});

process.on("beforeExit", () => { console.log("beforeExit"); clearActivity() });

function findArgs(args) {try{
    var output = {};

    var buildingDetails = false;
    var buildingState = false;
    var buildingStartTimestamp = false;
    var buildingEndTimestamp = false;

    var set_meeting = false;
    var set_class = false;
    var set_watching = false;
    for(var i = 0; i < args.length; i++) {
        var arg = args[i];

        if(arg.startsWith("-") && !arg.startsWith("--")) {
            arg = arg.substring(1);

            if(buildingDetails) buildingDetails = false;
            else if(buildingState) buildingState = false;

            if(arg == "top") {
                buildingDetails = true;
                output.details = "";
            } else if(arg == "bot") {
                buildingState = true;
                output.state = "";
            } else if(arg == "ts")
                buildingStartTimestamp = true;
            else if(arg == "tr") {
                buildingEndTimestamp = true;
            } else if(arg == "idle") {
                output.largeImageKey = "idle";
                output.largeImageText = "Idle";
                output.details = "Idle";
            } else if(arg == "meeting") set_meeting = true;
            else if(arg == "class") set_class = true;
            else if(arg == "watching") set_watching = true;
        } else if(arg.startsWith("--")) {
            arg = arg.substring(2);

            if(set_meeting) {
                output.details = "In a meeting...";
                if(arg == "discord") {
                    //
                } else if(arg == "meet") {
                    //
                } else if(arg == "zoom") {
                    //
                }
            }
        } else {
            if(buildingDetails) output.details += (output.details.length > 0 ? " " : "") + arg;
            else if(buildingState) output.state += (output.state.length > 0 ? " " : "") + arg;
            else if(buildingStartTimestamp) {
                buildingStartTimestamp = false;
                output.startTimestamp = Date.now();
                if(arg != "now") {
                    var timeSplit = arg.split(".");
                    var mult = 1;
                    var time = 0;
                    for(var ii = 0; ii < timeSplit.length; ii++) {
                        // 0 = sec, 1 = min, 2 = hr, 3+ = ignored
                        time += mult * parseInt(timeSplit[timeSplit.length - 1 - ii]);
                        switch(ii) {
                            case 0:
                            case 1: mult *= 60; break;
                            case 2: mult *= 24; break;
                            default: break;
                        }
                    }

                    output.startTimestamp -= time * 1000;
                }
            }
        }
    }

    if(buildingDetails)
        output.details = buildString;
    else if(buildingState)
        output.state = buildString;


    return output;
}catch(error){console.log(error);}}

rpc.on("ready", () => setIdle());
rpc.login({ clientId: "794909260257558529" })
    .then(s => console.log("Logged in."))
    .catch(e => console.error(e));


function updateActivity() {
    console.log(`Updating activity: ${JSON.stringify(currentActivity)}`);
    rpc.setActivity(currentActivity).catch((e) => console.log(e));
}

function clearActivity() {
    currentActivity = {};
    rpc.clearActivity().then(() => console.log("Cleared activity."), (error) => console.log(error));
}

function setActivity(formattedArgs) {
    currentActivity = formattedArgs;
    currentActivity.largeImageKey = "idle";
    updateActivity();
}

function editActivity(formattedArgs) {
    var keys = Object.keys(formattedArgs);

    for(var i = 0; i < keys.length; i++)
        currentActivity[keys[i]] = formattedArgs[keys[i]];

    console.log(formattedArgs);

    updateActivity();
}

function setIdle() {
    currentActivity = {
        largeImageKey: "idle",
        largeImageText: "Idle", 
        details: "Idle"
    };
    updateActivity();
}

/*
static void UpdatePresence()
{
    DiscordRichPresence discordPresence;
    memset(&discordPresence, 0, sizeof(discordPresence));
    discordPresence.state = "Playing Solo";
    discordPresence.details = "Competitive";
    discordPresence.startTimestamp = 1507665886;
    discordPresence.endTimestamp = 1507665886;
    discordPresence.largeImageText = "Numbani";
    discordPresence.smallImageText = "Rogue - Level 100";
    discordPresence.partyId = "ae488379-351d-4a4f-ad32-2b9b01c91657";
    discordPresence.partySize = 1;
    discordPresence.partyMax = 5;
    discordPresence.joinSecret = "MTI4NzM0OjFpMmhuZToxMjMxMjM= ";
    Discord_UpdatePresence(&discordPresence);
}

-idle
-meeting
-class
-watching

    --discord | --zoom | --meet

    -ts now
    -ts 1.40.60
    -ts 2021.1.3.11.40
    -tr 1.40.60
        now | year.month.day.24hour.minute.second

    -top Top Text Here
    -bot Bottom Text Here
    -val 4
    -max 10
*/