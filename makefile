main: build uninstall run

uninstall:
	 xcrun simctl uninstall booted org.reactjs.native.example.WebServerSpike || exit 0

run: 
	react-native run-ios --simulator="iPad Pro (12.9-inch)"

build: client/index.js
	npx webpack --config webpack.config.js --display-error-details --mode development
	
