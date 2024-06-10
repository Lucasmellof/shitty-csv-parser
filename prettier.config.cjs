/**
 * {@type require('prettier').Config}
 */
module.exports = {
	useTabs: true,
	singleQuote: false,
	trailingComma: "none",
	printWidth: 120,
	bracketSameLine: false,
	semi: true,
	quoteProps: "as-needed",
	endOfLine: "lf",
	importOrder: [
		// external packages
		"<THIRD_PARTY_MODULES>",

		// internal packages
		"^@/",
		"^~/",
		"",
		// relative
		"^[../]",
		"^[./]"
	],
	importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
	importOrderTypeScriptVersion: "4.4.0",
	tailwindFunctions: ["clsx", "cn", "twMerge"],
	plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"]
};
