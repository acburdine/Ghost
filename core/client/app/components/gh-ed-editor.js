import Ember from 'ember';
import EditorAPI from 'ghost/mixins/ed-editor-api';
import EditorShortcuts from 'ghost/mixins/ed-editor-shortcuts';
import EditorScroll from 'ghost/mixins/ed-editor-scroll';
import ghostPaths from 'ghost/utils/ghost-paths';

export default Ember.TextArea.extend(EditorAPI, EditorShortcuts, EditorScroll, {
    focus: false,

    /**
     * Tell the controller about focusIn events, will trigger an autosave on a new document
     */
    focusIn: function () {
        this.sendAction('onFocusIn');
    },

    /**
     * Sets the focus of the textarea if needed
     */
    setFocus: function () {
        if (this.get('focus')) {
            this.$().val(this.$().val()).focus();
        }
    },

    /**
     * Sets up properties at render time
     */
    didInsertElement: function () {
        this._super();

        this.setFocus();

        this.sendAction('setEditor', this);

        Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
    },

    afterRenderEvent: function () {
        if (this.get('focus') && this.get('focusCursorAtEnd')) {
            this.setSelection('end');
        }
    },

    /**
     * Disable editing in the textarea (used while an upload is in progress)
     */
    disable: function () {
        var textarea = this.get('element');
        textarea.setAttribute('readonly', 'readonly');
    },

    /**
     * Binds the paste and drop events on the editor
     */
    attachFileHandler: function() {

        var self = this;

        this.$().fileupload().fileupload('option', {
            url: Ghost.apiRoot + '/uploads/',
            pasteZone: this.$(),
            dropZone: this.$(),
            paramName: 'uploadimage',
            add: function(e, data) {
                console.log('add', data, e);
                data.submit();
            },
            paste: function(e, data) {
                self.$().fileupload('add', {files: data.files});
                e.preventDefault();
            },
            done: function(e, data) {
                var selection = self.getSelection();
                self.replaceSelection('![image](' + data.result + ')', selection.start, selection.end, 'collapseToEnd');
            }
        })
    }.on('didInsertElement'),

    /**
     * Reenable editing in the textarea
     */
    enable: function () {
        var textarea = this.get('element');
        textarea.removeAttribute('readonly');
    }
});
