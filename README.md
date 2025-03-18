# billease-assessment-appium
script file = billease.js
You will need to update device name in line 12 of billease.js

**Terminal - Appium Server Config**

appium --allow-insecure chromedriver_autodownload --base-path /wd/hub

**Terminal command for running appium test**

npx mocha billease.js --reporter spec

