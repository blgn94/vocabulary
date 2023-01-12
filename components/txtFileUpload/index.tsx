import React from "react";

const txtFileUploader = () => {

    const showFile = () => {
        if(window.File && window.FileReader && window.FileList && window.Blob) {
            let preview = document.getElementById('show-text');
            const file = document.querySelector('input[type=file]').files[0];
            const reader = new FileReader();
            const textFile = /text.*/;
            if (file.type.match(textFile)) {
                reader.onload = (event) => {
                    // preview.innerHTML = event.target?.result;
                    const array = event.target?.result;
                    array?.toString().split("\n").map((item, key) => {
                        preview.innerHTML += `<p>${item}<br/></p>`
                    })
                }
            }
            else {
                preview.innerHTML = "<span class='error'>It doesn't seem to be a text file!</span>";
            }
            reader.readAsText(file);
        }
        else {
            alert("Your browser is too old to support HTML5 File API");
        }
    }

    return (
        <div>
            <input type="file" onChange={showFile}></input>
        </div>
    );
}

export default txtFileUploader;