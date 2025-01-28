const { remote } = require('webdriverio');

(async () => {
    try {
        // Chrome capabilities (simplified)
        const chromeCapabilities = {
            platformName: 'Android',
            'appium:deviceName': 'RRCTC04MBSN',
            browserName: 'Chrome',
            'appium:automationName': 'UiAutomator2',
        //     'appium:chromeOptions': {
        // args: ['--headless', '--disable-gpu', '--window-size=1920x1200'],
        //     },
        //    'appium:autoWebview': true, // Enables auto-switch to webview context for Chrome
        };

        const chromeDriver = await remote({
            path: '/wd/hub',
            port: 4723,
            capabilities: chromeCapabilities,
        });

        // Open Billease website
        await chromeDriver.url('https://billease.ph/');
        console.log('Billease website opened.');

        // Close the session after the test
        await chromeDriver.deleteSession();
    } catch (err) {
        console.error('Error:', err.message);
    }
})();

