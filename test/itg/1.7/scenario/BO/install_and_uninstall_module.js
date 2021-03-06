'use strict';
var should = require('should');
var common = require('../../common.webdriverio');
var globals = require('../../globals.webdriverio.js');
var exit_welcome = false;
var green_validation_is_visible = false;
var red_validation_is_visible = false;
var modal_confirm_uninstall_is_visible = false;
var uninstall_red_validation_is_visible = false;
var only_filename = __filename.slice(__dirname.length + 1, -3);


describe('The Install of a Module and its Uninstall', function () {


    common.initMocha.call(this);

    before(function (done) {
        this.selector = globals.selector;
        this.client.call(done);
    });

    process.on('uncaughtException', common.take_screenshot);
    process.on('ReferenceError', common.take_screenshot);

    after(common.after);

    describe('Log in in Back Office', function (done) {
        it('should log in successfully in BO', function (done) {
            global.fctname = this.test.title;
            this.client
                .signinBO()
                .isVisible(this.selector.exit_welcome).then(function (isVisible) {
                exit_welcome = isVisible;
            })
                .waitForExist(this.selector.menu, 90000)
                .call(done);
        });
    });

    describe('Install module', function (done) {
        it('should go to the module', function (done) {
            global.fctname = this.test.title;

            if (exit_welcome) {
                this.client
                    .waitForExist(this.selector.exit_welcome, 90000)
                    .click(this.selector.exit_welcome);
            }
            this.client
                .pause(5000)
                .click(this.selector.modules_menu)
                .waitForExist(this.selector.modules_page_loaded, 90000)
                .call(done);
        });

        it('should click on install button', function (done) {
            global.fctname = this.test.title;

            this.client
                .setValue(this.selector.modules_search, module_tech_name)
                .click(this.selector.modules_search_button)
                .waitForExist('//div[@data-tech-name="' + module_tech_name + '" and not(@style)]', 90000)
                .click('//div[@data-tech-name="' + module_tech_name + '" and not(@style)]//button[@data-confirm_modal="module-modal-confirm-' + module_tech_name + '-install"]')
                .pause(2000)
                .isVisible(this.selector.red_validation).then(function (isVisible) {
                red_validation_is_visible = isVisible;
            })
                .pause(1000)
                .isVisible(this.selector.green_validation).then(function (isVisible) {
                green_validation_is_visible = isVisible;
            })
                .call(done);
        });

        it('should check the installation', function (done) {
            global.fctname = this.test.title;
            if (red_validation_is_visible) {
                this.client
                    .getText(this.selector.red_validation).then(function (text) {
                    done(new Error(text));
                })
            } else if (green_validation_is_visible) {
                done();
            } else {
                done();
            }
        });
    });

    describe('Uninstall module', function (done) {
        it('should go to the module and click on uninstall button', function (done) {
            global.fctname = this.test.title;
            if (red_validation_is_visible) {
                done(new Error("Unavailable module"));
            } else {
                this.client
                    .click(this.selector.modules_installed)
                    .waitForExist(this.selector.modules_page_loaded, 90000)
                    .setValue(this.selector.modules_search, module_tech_name)
                    .click(this.selector.modules_search_button)
                    .waitForExist('//div[@data-tech-name="' + module_tech_name + '" and not(@style)]', 90000)
                    .click('//div[@data-tech-name="' + module_tech_name + '" and not(@style)]//button[@class="btn btn-primary-outline  dropdown-toggle light-button"]')
                    .waitForExist('//div[@data-tech-name="' + module_tech_name + '" and not(@style)]//button[@class="dropdown-item module_action_menu_uninstall"]', 90000)
                    .click('//div[@data-tech-name="' + module_tech_name + '" and not(@style)]//button[@class="dropdown-item module_action_menu_uninstall"]')
                    .pause(2000)
                    .isVisible('//*[@id="module-modal-confirm-' + module_tech_name + '-uninstall" and @class="modal modal-vcenter fade in"]//a[@class="btn btn-primary uppercase module_action_modal_uninstall"]').then(function (isVisible) {
                    modal_confirm_uninstall_is_visible = isVisible;
                })
                    .pause(5000)
                    .isVisible(this.selector.red_validation).then(function (isVisible) {
                    uninstall_red_validation_is_visible = isVisible;
                })
                    .isVisible(this.selector.green_validation).then(function (isVisible) {
                    green_validation_is_visible = isVisible;
                })
                    .call(done);

            }

        });

        it('should check the uninstall', function (done) {
            global.fctname = this.test.title;
            if (red_validation_is_visible) {
                done(new Error("Unavailable module"));
            } else {
                if (modal_confirm_uninstall_is_visible) {
                    this.client
                        .click('//*[@id="module-modal-confirm-' + module_tech_name + '-uninstall" and @class="modal modal-vcenter fade in"]//a[@class="btn btn-primary uppercase module_action_modal_uninstall"]')
                        .call(done);
                }
                if (uninstall_red_validation_is_visible) {
                    this.client
                        .getText(this.selector.red_validation).then(function (text) {
                        done(new Error(text));
                    })
                } else if (green_validation_is_visible) {
                    this.client.call(done);
                }

            }
        });
    })

    describe('Log out in Back Office', function (done) {
        it('should log out successfully in BO', function (done) {
            global.fctname = this.test.title;
            this.client
                .signoutBO()
                .call(done);
        });
    });

});