**billease-assessment-appium**

script file = billease.js

Replace Device Name - line 21 and 28

**Terminal - Appium Server Config**

appium --allow-insecure chromedriver_autodownload --base-path /wd/hub

**Terminal command for running appium test**

npx mocha billease.js --reporter spec

