import fs from "fs-extra";

(async () => {
  const sources = ["./artifacts", "./typechain"];

  const destinations = ["../client/contracts", "../server/src/contracts"];

  for (const destination of destinations) {
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination);
    } else {
      fs.emptyDirSync(destination);
      fs.mkdirSync(`${destination}/artifacts`);
      fs.mkdirSync(`${destination}/typechain`);
    }
  }

  for (const source of sources) {
    for (const destination of destinations) {
      fs.copy(source, `${destination}/${source.split("./")[1]}`, (err) => {
        if (err) {
          console.log("An error occurred while copying the folder.");
          return console.error(err);
        }
      });
    }
  }
  return;
})();
