//Import some assets from Vortex we'll need.
const path = require("path");
const { fs, log, util } = require("vortex-api");
const winapi = require("winapi-bindings");

const { isModXML } = require("./utils");

// Nexus Mods domain for the game. e.g. nexusmods.com/bloodstainedritualofthenight
const GAME_ID = "noita";

//Steam Application ID, you can get this from https://steamdb.info/apps/
const STEAMAPP_ID = 881100;

//GOG Application ID, you can get this from https://www.gogdb.org/
const GOGAPP_ID = 1310457090;

function main(context) {
  //This is the main function Vortex will run when detecting the game extension.

  context.registerGame({
    id: GAME_ID,
    name: "Noita",
    mergeMods: true,
    queryPath: findGame,
    supportedTools: [],
    queryModPath: () => "mods",
    logo: "gameart.jpg",
    executable: () => "noita.exe",
    requiredFiles: ["noita.exe", "mods/PLACE_MODS_HERE"],
    environment: {
      SteamAPPId: STEAMAPP_ID.toString()
    },
    details: {
      steamAppId: STEAMAPP_ID,
      gogAppId: GOGAPP_ID
    }
  });

  context.registerInstaller(
    "noita-mod",
    25,
    testSupportedContent,
    installContent
  );

  return true;
}

function findGame() {
  return util.steam
    .findByAppId(STEAMAPP_ID.toString())
    .then(game => game.gamePath);
}

function testSupportedContent(files, gameId) {
  let supported = gameId === GAME_ID && files.find(isModXML) !== undefined;

  // Test for a mod installer.
  if (
    supported &&
    files.find(
      file =>
        path.basename(file).toLowerCase() === "moduleconfig.xml" &&
        path.basename(path.dirname(file)).toLowerCase() === "fomod"
    )
  ) {
    supported = false;
  }

  // TODO: see requiredFiles
  return Promise.resolve({ supported, requiredFiles: [] });
}

function installContent(files) {
  const modXML = files.find(isModXML);
  const rootPath = path.dirname(modXML);

  // Remove anything that isn't in the rootPath.
  const filtered = files.filter(file => file.indexOf(rootPath) !== -1);

  const instructions = filtered.map(file => {
    return {
      type: "copy",
      source: file,
      destination: path.join(file.substr(idx))
    };
  });

  return Promise.resolve({ instructions });
}

module.exports = {
  default: main
};
