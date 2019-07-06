let dataUrl;
let loadedImage = false;

function convert(img) {
    if (img.type.startsWith('image/')) {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');

        let image = new Image();
        let reader = new FileReader();
        reader.onloadend = function () {
            image.onload = () => {
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
                clear();
                document.getElementById("resultDiv").appendChild(canvas);

                dataUrl = canvas.toDataURL(img.type);

                let result = document.createElement("p");
                result.innerHTML = dataUrl

                document.getElementById("resultDiv").appendChild(result);
                document.getElementById("save").hidden = false;
                loadedImage = true;
            }
            image.src = reader.result;
        }
        reader.readAsDataURL(img);
    } else if (img.type === "text/plain") {
        let reader = new FileReader();
        let image = new Image();
        reader.onloadend = function () {
            image.onload = () => {
                clear();
                document.getElementById("resultDiv").appendChild(image);
                dataUrl = reader.result;

                let result = document.createElement("p");
                result.innerHTML = dataUrl

                document.getElementById("resultDiv").appendChild(result);
                document.getElementById("save").hidden = false;
                loadedImage = false;
            }
            image.src = reader.result;
        }
        reader.readAsText(img);
    }
    
}

function save() {
    if (loadedImage) {
        let text = dataUrl,
        blob = new Blob([text], { type: 'text/plain' }),
        anchor = document.createElement('a');
    
        anchor.download = "result.txt";
        anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
        anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
        anchor.click();
    } else {
        let ImageURL = dataUrl;
        let block = ImageURL.split(";");

        let contentType = block[0].split(":")[1];
        let realData = block[1].split(",")[1];

        let blob = b64toBlob(realData, contentType);
        let ext = ImageURL.split(';')[0].match(/jpeg|png|gif|svg/)[0];

        //let blob = new Blob([dataUrl], {type: contentType}),
        let anchor = document.createElement('a');
        anchor.download = "result." + ext;
        anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
        anchor.dataset.downloadurl = [contentType, anchor.download, anchor.href].join(':');
        anchor.click();
    }
}

function clear() {
    let doc = document.getElementById("resultDiv");
    while (doc.firstChild) {
        doc.removeChild(doc.firstChild);
    }
}

function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        let byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, {type: contentType});
    return blob;
}