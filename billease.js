const { remote } = require('webdriverio');

describe('Billease Automation Test Suite', function () {
    this.timeout(60000); // Set the timeout for Appium actions to 60 seconds

    let chromeDriver;
    let appDriver;

    it('should launch Chrome mobile browser', async () => {
        const chromeCapabilities = {
            platformName: 'Android',
            'appium:deviceName': 'RRCTC04MBSN',
            browserName: 'Chrome',
            'appium:automationName': 'UiAutomator2',
        };

        chromeDriver = await remote({
            path: '/wd/hub',
            port: 4723,
            capabilities: chromeCapabilities,
        });
    });

    it('should open BillEase website and click Login from menu', async () => {        
        // Open Billease Website in Chrome
        await chromeDriver.url('https://billease.ph/');
        console.log('Billease website opened.');

        // Click the "Log In" Button on the Website
        const hamburgerMenu = await chromeDriver.$('svg.h-6.w-6.fill-current.text-white');
        await hamburgerMenu.click();
        console.log('Clicked hamburger menu.');

        const loginButton = await chromeDriver.$('a.ml-2.mt-8.w-40.h-8.bg-secondary');
        await loginButton.click();
        console.log('Clicked Log In button.');

        // Wait for Redirection
        await chromeDriver.pause(5000);
        console.log('Chrome test completed successfully!');

        // Clean Up Chrome Session
        await chromeDriver.deleteSession();
        console.log('Chrome session ended.');

        // Add delay to ensure Chrome session is fully terminated
        await new Promise(resolve => setTimeout(resolve, 2000));  // Wait for 2 seconds
    });

    it('should be redirected to Billease app', async () => {
        const appCapabilities = {
            platformName: 'Android',
            'appium:deviceName': 'RRCTC04MBSN',
            'appium:automationName': 'UiAutomator2',
            'appium:appPackage': 'ph.billeasev2.mobile', // Appium-specific capability
            'appium:appActivity': 'ph.billeasev2.mobile.MainActivity', // Appium-specific capability
            'appium:noReset': true,
            'appium:fullReset': false,
        };

        appDriver = await remote({
            path: '/wd/hub',
            port: 4723,
            capabilities: appCapabilities,
        });

        console.log('Appium session started for Billease app.');
    });

    it('should validate login fields', async () => {
        // Validate the Login Screen on the Billease App
        const emailField = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/input_username")');
        const passwordField = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/input_password")');
        const loginSubmit = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/main_login")');

        // Perform field validation
        await emailField.setValue(' ');
        const emailError = await appDriver.$('android=new UiSelector().text("Required Field")');
        console.log('Email validation displayed:', await emailError.isDisplayed());

        await emailField.setValue('invalid_email');
        const invalidEmailError = await appDriver.$('android=new UiSelector().text("Invalid email or mobile")');
        console.log('Invalid email validation displayed:', await invalidEmailError.isDisplayed());

        const forgot = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/forgot_password")');
        await forgot.click();
    });
    
    it('should proceed to Forgot Password page and validate fields', async () => {
        // Validate the Login Screen on the Billease App
        const title = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/password_lock_title")');
        const email = await appDriver.$('android=new UiSelector().text("Enter mobile/email")');
        const reset = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/reset_password_reset")');
        const cancel = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/reset_password_cancel")');

        // Perform field validation
        await email.setValue('invalid_email');
        const emailError = await appDriver.$('android=new UiSelector().text("Please enter a valid email or mobile number.")');
        console.log('Email validation displayed:', await emailError.isDisplayed());
        await cancel.click();
    });

    it('should proceed to sign-up page and validate fields', async () => {

        // Select SignUp button 
        const register = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/create_account")');
        await register.click();
        console.log('Clicked Sign Up button.');

        // Verify the Sign-up Screen on the Billease App
        const getStarted = await appDriver.$('android=new UiSelector().text("Let’s get started")');
        const email = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/sign_up_email_text")');
        const mobile = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/sign_up_mobile_text")');
        const checkBox = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/checkBox")');
        const checkBoxText = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/checkBoxText")');
        const signUp = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/sign_up")');

        // Validate fields
        await email.setValue('invalid');
        await mobile.setValue('####');
        await checkBox.click();
        await signUp.click();

        const emailError = await appDriver.$('android=new UiSelector().text("Invalid email address")');
        console.log('Email validation displayed:', await emailError.isDisplayed());
        await email.setValue('valid@test.com');
        await signUp.click();
        const mobileError = await appDriver.$('android=new UiSelector().text("Invalid number")');
        console.log('Invalid email validation displayed:', await mobileError.isDisplayed());
    });

     console.log('Billease app test completed successfully!');
});
