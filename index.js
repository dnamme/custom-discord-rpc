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
    else if(cmd == "idle")
        setIdle();
});

process.on("beforeExit", () => { console.log("beforeExit"); clearActivity() });

function findArgs(args) {
    // var output = {};

    // for(var i = 0; i < args.length; i++) {
    //     var arg = args[i];
    // }

    // return output;
    return { details: "Top Text", state: "Bottom Text", partySize: 3, partyMax: 8 };
}

rpc.on("ready", () => setIdle());
rpc.login({ clientId: "794909260257558529" })
    .then(s => console.log("Logged in."))
    .catch(e => console.error(e));


function updateActivity() {
    rpc.setActivity(currentActivity).catch((e) => console.log(e));
}

function clearActivity() {
    currentActivity = {};
    rpc.clearActivity();
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

    updateActivity();
}

function setIdle() {
    currentActivity = {
        largeImageKey: "idle",
        largeImageText: "Idle", 
        state: "Idle"
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

    -ts --now (get time now)
    -ts 1.40.60
    -ts 2021.1.3.11.40
    -tr 1.40.60
        year.month.day.24hour.minute.second

    -top Top Text Here
    -bot Bottom Text Here
*/