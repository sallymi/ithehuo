$(function(){
    $('#input-id').fileinput({
        // initialPreview: ["<img src='http://placehold.it/80/77CCDD/66BBCC' class='file-preview-image'>",
        // "<img src='http://placehold.it/80/77CCDD/66BBCC' class='file-preview-image'>",
        // "<img src='http://placehold.it/80/77CCDD/66BBCC' class='file-preview-image'>",
        // "<img src='http://placehold.it/80/77CCDD/66BBCC' class='file-preview-image'>"],
        // initialPreviewConfig: [
        //     {caption: 'profile.jpg', width: '80px', url: '#'},
        //     {caption: 'profile.jpg', width: '80px', url: '#'},
        //     {caption: 'profile.jpg', width: '80px', url: '#'},
        //     {caption: 'profile.jpg', width: '80px', url: '#'}
        // ],
        uploadUrl: '#',
        allowedFileExtensions : ['jpg', 'png','gif'],
        overwriteInitial: true,
        maxFileSize: 1000,
        maxFilesNum: 10,
        //allowedFileTypes: ['image', 'video', 'flash'],
        slugCallback: function(filename) {
            return filename.replace('(', '_').replace(']', '_');
        }
    });
})