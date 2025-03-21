const fs = require("fs");
const path = require("path");
const {
	override,
	addDecoratorsLegacy,
	disableEsLint,
	addBundleVisualizer,
	addWebpackAlias,
	adjustWorkbox,
	addWebpackPlugin,
} = require("customize-cra");

function resolve(dir) {
	return path.join(__dirname, "..", dir);
}

const UnoCSS = require("@unocss/webpack").default;

const webpack = override(
	addWebpackAlias({
		"~": path.resolve(__dirname, "src"),
		"@": path.resolve(__dirname, "src"),
		src: path.resolve(__dirname, "src"),
		assets: path.resolve(__dirname, "src/assets"),
		gsap: path.resolve(__dirname, "src/libs/gsap-shockingly-green/esm"),
	}),
	addWebpackPlugin(require("unplugin-auto-import/webpack")({})),
	addWebpackPlugin(UnoCSS({})),
);

webpack.optimization = {
	realContentHash: true,
};

module.exports = {
	webpack,
	jest: function (config) {
		return config;
	},
	devServer: function (configFunction) {
		return function (proxy, allowedHost) {
			const config = configFunction(proxy, allowedHost);
			config.https = {
				key: fs.readFileSync("./key.pem"),
				cert: fs.readFileSync("./cert.pem"),
			};
			console.log(2000, config);
			return config;
		};
	},
	paths: function (paths, env) {
		return paths;
	},
};

// module.exports = {
// 	webpack: function (config, env) {
// 		config.module.rules = config.module.rules.map((rule) => {
// 			if (rule.oneOf instanceof Array) {
// 				rule.oneOf[rule.oneOf.length - 1].exclude = [
// 					/\.(js|mjs|zbin|cjs|jsx|ts|tsx)$/,
// 					/\.html$/,
// 					/\.json$/,
// 				];
// 				return rule;
// 			}
// 			return rule;
// 		});

// 		config.resolve.alias["~"] = resolve("src");
// 		config.resolve.alias["@"] = resolve("src");
// 		config.resolve.alias["assets"] = resolve("src/assets");
// 		config.resolve.alias["gsap"] = resolve(
// 			"src/libs/gsap-shockingly-green/esm",
// 		);

// 		return config;
// 	},
//
