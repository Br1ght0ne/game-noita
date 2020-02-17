const path = require("path");

export function isModXML(file) {
  path.basename(file).toLowerCase() === "mod.xml";
}
