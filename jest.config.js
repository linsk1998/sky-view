module.exports = {
	"testRegex": "./jest/.*\\.(js|ts|tsx)$",
	"transform": {
		"^.+\\.tsx?$": "ts-jest"
	},
	"globals": {
		"ts-jest": {
			"tsConfig": "./tsconfig.json"
		}
	}
};