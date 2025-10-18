const fs = require("fs");
const path = require("path");

// 📌 1. Actualizar `versionCode` en Android (`build.gradle`)
const gradlePath = path.join(__dirname, "android", "app", "build.gradle");
let gradleConfig = fs.readFileSync(gradlePath, "utf8");

// Expresión regular para encontrar `versionCode`
const versionCodeRegex = /versionCode\s+(\d+)/;
const versionMatch = gradleConfig.match(versionCodeRegex);

if (versionMatch) {
    let versionCode = parseInt(versionMatch[1]) + 1; // Incrementar `versionCode`
    gradleConfig = gradleConfig.replace(versionCodeRegex, `versionCode ${versionCode}`);
    fs.writeFileSync(gradlePath, gradleConfig, "utf8");
    console.log(`✅ Nueva versionCode en Android: ${versionCode}`);
} else {
    console.error("❌ No se encontró versionCode en android/app/build.gradle");
    process.exit(1);
}

// 📌 2. Actualizar `CURRENT_PROJECT_VERSION` en iOS (`project.pbxproj`)
const pbxprojPath = path.join(__dirname, "ios", "App", "App.xcodeproj", "project.pbxproj");
let pbxprojConfig = fs.readFileSync(pbxprojPath, "utf8");

// Extraer la primera ocurrencia del número de versión
const currentProjectVersionRegex = /CURRENT_PROJECT_VERSION = (\d+);/;
const pbxprojMatch = pbxprojConfig.match(currentProjectVersionRegex);

if (pbxprojMatch) {
    let currentProjectVersion = parseInt(pbxprojMatch[1]) + 1; // Incrementar versión

    // Reemplazar todas las ocurrencias con la nueva versión
    pbxprojConfig = pbxprojConfig.replace(
        /CURRENT_PROJECT_VERSION = \d+;/g,
        `CURRENT_PROJECT_VERSION = ${currentProjectVersion};`
    );

    fs.writeFileSync(pbxprojPath, pbxprojConfig, "utf8");
    console.log(`✅ Nueva CURRENT_PROJECT_VERSION en iOS: ${currentProjectVersion}`);
} else {
    console.error("❌ No se encontró CURRENT_PROJECT_VERSION en ios/App/App.xcodeproj/project.pbxproj");
    process.exit(1);
}

console.log("🚀 Versiones actualizadas correctamente.");