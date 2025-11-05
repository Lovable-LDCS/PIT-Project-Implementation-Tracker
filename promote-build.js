import fs from "fs";
import path from "path";

const files = [
  { main: "src/main.js", test: "src/main_test.js" },
  { main: "src/renderer.js", test: "src/renderer_test.js" },
  { main: "src/preload.js", test: "src/preload_test.js" },
];

(async () => {
  try {
    const backupDir = path.resolve("./backup");
    const togglePath = path.resolve("./toggle.json");
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

    for (const f of files) {
      const mainFile = path.resolve(f.main);
      const testFile = path.resolve(f.test);

      if (!fs.existsSync(testFile)) { console.log(`❌ Test file not found: ${testFile}`); continue; }
      const testCode = fs.readFileSync(testFile, "utf8");
      if (!testCode.trim()) { console.log(`❌ Test file is empty: ${testFile}`); continue; }

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const backupFile = path.join(backupDir, `${f.main.replace('.js','')}_backup_${timestamp}.js`);
      if (fs.existsSync(mainFile)) {
        fs.copyFileSync(mainFile, backupFile);
        console.log(`🗄️  Backup created: ${backupFile}`);
      }

      const mainCode = fs.existsSync(mainFile) ? fs.readFileSync(mainFile, "utf8") : "";
      if (mainCode === testCode) { console.log(`✅ No differences for ${f.main}.`); continue; }

      fs.writeFileSync(mainFile, testCode);
      fs.writeFileSync(testFile, testCode);
      console.log(`🎯 ${f.main} updated from ${f.test}`);
    }

    if (fs.existsSync(togglePath)) {
      const toggle = JSON.parse(fs.readFileSync(togglePath, "utf8"));
      toggle.activeBuild = "main.js";
      fs.writeFileSync(togglePath, JSON.stringify(toggle, null, 2));
      console.log("🔁 Toggle switched back to main.js");
    }

    const logEntry = `[${new Date().toISOString()}] Promoted all test files → main files\n`;
    fs.appendFileSync("promotion.log", logEntry);
    console.log("🧾 Promotion logged successfully. 🚀 Build fully updated and protected.");

    process.exit(0);
  } catch (err) {
    console.error(`❌ Promotion failed: ${err && err.message ? err.message : String(err)}`);
    process.exit(1);
  }
})();


