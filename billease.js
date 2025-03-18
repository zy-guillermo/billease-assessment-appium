const { remote } = require('webdriverio');
const { expect } = require('chai');

// Helper function to initialize a WebDriver session
async function initializeDriver(capabilities) {
    return await remote({
        path: '/wd/hub',
        port: 4723,
        capabilities
    });
}

describe('Billease Automation Test Suite', function () {
    this.timeout(60000);

    let chromeDriver;
    let appDriver;

    const chromeCapabilities = {
        platformName: 'Android',
        'appium:deviceName': 'RFCY21E99ZD',
        browserName: 'Chrome',
        'appium:automationName': 'UiAutomator2',
    };

    const appCapabilities = {
        platformName: 'Android',
        'appium:deviceName': 'RFCY21E99ZD',
        'appium:automationName': 'UiAutomator2',
        'appium:appPackage': 'ph.billeasev2.mobile', 
        'appium:appActivity': 'ph.billeasev2.mobile.MainActivity', 
        'appium:noReset': true,
        'appium:fullReset': false,
    };

    before(async () => {
        chromeDriver = await initializeDriver(chromeCapabilities);
    });

    after(async () => {
        if (chromeDriver) await chromeDriver.deleteSession();
        if (appDriver) await appDriver.deleteSession();
    });

    it('should open BillEase website and click Login from menu', async () => {        
        await chromeDriver.url('https://billease.ph/');
        const hamburgerMenu = await chromeDriver.$('svg.h-6.w-6.fill-current.text-white');
        await hamburgerMenu.click();

        const loginButton = await chromeDriver.$('a.ml-2.mt-8.w-40.h-8.bg-secondary');
        await loginButton.click();

        await chromeDriver.pause(5000);
        expect(await chromeDriver.getUrl()).to.include('billease.ph');
    });

    it('should be redirected to Billease app', async () => {
        appDriver = await initializeDriver(appCapabilities);
        expect(appDriver).to.exist;
    });

    it('should validate login fields', async () => {
        const passwordField = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/input_password")');
        expect(await passwordField.isDisplayed()).to.be.true;
        const loginSubmit = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/main_login")');
        expect(await loginSubmit.isDisplayed()).to.be.true;

        // Perform field validation
        const emailField = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/input_username")');
        await emailField.setValue(' ');
        const emailError = await appDriver.$('android=new UiSelector().text("Required field")');
        expect(await emailError.isDisplayed()).to.be.true;

        await emailField.setValue('invalid_email');
        const invalidEmailError = await appDriver.$('android=new UiSelector().text("Invalid email or mobile")');
        expect(await invalidEmailError.isDisplayed()).to.be.true;
        expect(await passwordField.isDisplayed()).to.be.true;
        expect(await loginSubmit.isDisplayed()).to.be.true;
    });

    it('should proceed to Forgot Password page and validate fields', async () => {
        const forgot = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/forgot_password")');
        await forgot.click();

        const reset = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/reset_password_reset")');
        expect(await reset.isDisplayed()).to.be.true;

        // Perform field validation
        const email = await appDriver.$('android=new UiSelector().text("Enter mobile/email")');
        await email.setValue('invalid_email');

        const emailError = await appDriver.$('android=new UiSelector().text("Please enter a valid email or mobile number.")');
        expect(await emailError.isDisplayed()).to.be.true;

        const cancel = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/reset_password_cancel")');
        expect(await cancel.isDisplayed()).to.be.true;
        await cancel.click();
    });

    it('should proceed to sign-up page and validate fields', async () => {
        const register = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/create_account")');
        await register.click();

        const email = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/sign_up_email_text")');
        const mobile = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/sign_up_mobile_text")');
        const checkBox = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/checkBox")');
        const checkBoxText = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/checkBoxText")');
        expect(await checkBoxText.isDisplayed()).to.be.true;
        const signUp = await appDriver.$('android=new UiSelector().resourceId("ph.billeasev2.mobile:id/sign_up")');

        await email.setValue('invalid');
        await mobile.setValue('####');
        await checkBox.click();
        await signUp.click();

        const emailError = await appDriver.$('android=new UiSelector().text("Invalid email address")');
        expect(await emailError.isDisplayed()).to.be.true;
    });
});
