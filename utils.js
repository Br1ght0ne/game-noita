const path = require("path");

function isModXML(file) {
  path.basename(file).toLowerCase() === "mod.xml";
}

module.exports = {
  isModXML
};
