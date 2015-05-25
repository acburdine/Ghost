import UploadUi from 'ghost/assets/lib/upload-ui';

var upload;

upload = function (options) {
    var settings = $.extend({
        progressbar: true,
        editor: false,
        fileStorage: true
    }, options);

    return this.each(function () {

        var $dropzone = $(this),
            ui;

        ui = new UploadUi($dropzone, settings);
        this.uploaderUi = ui;
        ui.init();
    });
};

export default upload;
