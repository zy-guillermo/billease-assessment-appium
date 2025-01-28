const { remote } = require('webdriverio');

//appium --allow-insecure chromedriver_autodownload --base-path /wd/hub

(async () => {
    let chromeDriver, appDriver;  // Declare both drivers to access them later
    try {
        // Step 1: Launch Chrome Browser Session
        const chromeCapabilities = {
            platformName: 'Android',
            'appium:deviceName': 'RRCTC04MBSN',
            browserName: 'Chrome',
            'appium:automationName': 'UiAutomator2'
        };

        chromeDriver = await remote({
            path: '/wd/hub',
            port: 4723,
            capabilities: chromeCapabilities,
        });

        // Step 2: Open Billease Website in Chrome
        await chromeDriver.url('https://billease.ph/');
        console.log('Billease website opened.');

        // Step 3: Click the "Log In" Button on the Website
        const hamburgerMenu = await chromeDriver.$('svg.h-6.w-6.fill-current.text-white');
        await hamburgerMenu.click();
        console.log('Clicked hamburger menu.');

        const loginButton = await chromeDriver.$('a.ml-2.mt-8.w-40.h-8.bg-secondary');
        await loginButton.click();
        console.log('Clicked Log In button.');

        // Step 4: Wait for Redirection (Add delay to make sure it's fully loaded)
        await chromeDriver.pause(5000);

        // Step 5: Clean Up Chrome Session
        await chromeDriver.deleteSession();
        console.log('Chrome session ended.');

        // Step 6: Add delay to ensure Chrome session is fully terminated
        await new Promise(resolve => setTimeout(resolve, 2000));  // Wait for 2 seconds

        // Step 7: Start a New Appium Session for Billease App
        const appCapabilities = {
            platformName: 'Android',
            'appium:deviceName': 'RRCTC04MBSN',
            'appium:automationName': 'UiAutomator2',
            'appium:appPackage': 'ph.billeasev2.mobile',  // Appium-specific capability
            'appium:appActivity': 'ph.billeasev2.mobile.MainActivity',  // Appium-specific capability
            'appium:noReset': true,
            'appium:fullReset': false
        };

        appDriver = await remote({
            path: '/wd/hub',
            port: 4723,
            capabilities: appCapabilities,
        });

        console.log('Appium session started for Billease app.');

        // Step 8: Validate the Login Screen on the Billease App
        const emailField = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/input_username")');
        const passwordField = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/input_password")');
        const loginSubmit = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/main_login")');

        // Perform field validation
        await emailField.setValue('');
        const emailError = await appDriver.$('android=new UiSelector().text("Required Field")');
        console.log('Email validation displayed:', await emailError.isDisplayed());

        await emailField.setValue('invalid_email');
        const invalidEmailError = await appDriver.$('android=new UiSelector().text("Invalid email or mobile")');
        console.log('Invalid email validation displayed:', await invalidEmailError.isDisplayed());

        // Clean Up Appium Session
        await appDriver.deleteSession();
        console.log('Test completed successfully!');
    } catch (err) {
        console.error('Error:', err.message);
    }
})();
