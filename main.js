
function submitSearch(e) {
    console.log(document.getElementById("input-search").value);
    var apigClient = apigClientFactory.newClient();

    var params = {
        'q': document.getElementById("input-search").value,
    };

    apigClient.searchGet(params, {}, {})
        .then(function (result) {
            console.log("result",result);
            img_paths = result["data"]["imagePaths"];
            console.log("image_paths", img_paths)
            
            var div = document.getElementById("imgDiv");
            div.innerHTML = "";

            var j;
            for(j = 0; j < img_paths.length; j++) {
                img_ls = img_paths[j].split('/');
                img_name = img_ls[img_ls.length-1];
                div.innerHTML += '<figure><img src="' + img_paths[j] + 
                    '" style="width:25%"><figcaption>' 
                    + img_name + '</figcaption></figure>';
            }
        }).catch(function (result) {
            console.log(result);
        });
}

// submit voice is very like to the upload photo
function submitVoice(file) {

    console.log(file);
    console.log(file.type)
    var file_name = "Recording.wav";

    var apigClient = apigClientFactory.newClient();

    var additionalParams = {
        headers: {
            'Content-Type': file.type
        }
    }

    var url = "https://c0xy572rvg.execute-api.us-east-1.amazonaws.com/Stage1/upload/sz.photo-strorage/" + file_name
    axios.put(url, file, additionalParams).then(function(response) {

        var params = {
            'q': 'searchAudio',
        };        

        apigClient.searchGet(params, {}, {}).then(function (result) {
                checkResponse(result);
            }).catch(function (result) {
                console.log('Transcribe not done yet!')
            });

        console.log("Audio file uploaded: " + file_name);
               
    }).catch(function (result) {
        console.log("PUT audio file ERROR", result);
    });

    setTimeout(function() { 
        console.log('Transcribe almost done, please wait')
    }, 80000);


    // this timeout used to get the transcribe result, search and get photos paths
    setTimeout(function() { 
        params = {
             'q': 'getAudio',
        }
        apigClient.searchGet(params, {}, {}).then(function (result) {
                console.log("checkresponse result",result)
                img_paths = result["data"]["imagePaths"];
                console.log("image_paths", img_paths)


                var div = document.getElementById("imgDiv");
                div.innerHTML = "";

                var j;
                for(j = 0; j < img_paths.length; j++) {
                    img_ls = img_paths[j].split('/');
                    img_name = img_ls[img_ls.length-1];
                    div.innerHTML += '<figure><img src="' + img_paths[j] + 
                        '" style="width:25%"><figcaption>' 
                        + img_name + '</figcaption></figure>';
                }
                alert('Search successful!');
            }).catch(function (result) {
                alert("No photos found for your search or something went wrong. Please try again")
                console.log('Get Error:', result);
            }); 
    }, 70000);

}

function checkResponse(result) {
    console.log(result);
    if (result["data"]) {
        //var data = result["data"];
        var img_paths = result.data.imagePaths;
        var div = document.getElementById("imgDiv");
        div.innerHTML = "";

        var j;
        for(j = 0; j < img_paths.length; j++) {
            img_ls = img_paths[j].split('/');
            img_name = img_ls[img_ls.length-1];
            div.innerHTML += '<figure><img src="' + img_paths[j] + 
                '" style="width:25%"><figcaption>' + img_name + '</figcaption></figure>';
        }
    }
}


function submitPhoto(e) {

    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
      alert('The File APIs are not fully supported in this browser.');
      return;
    }

    var path = (document.getElementById("input-file").value).split("\\");
    var file_name = path[path.length-1];

    console.log(file_name);

    var file = document.getElementById("input-file").files[0];
    console.log(file);

    const reader = new FileReader();

    var apigClient = apigClientFactory.newClient();
    var params = {};

    // dont need ACAO and api key when sending request, but requires when getting response
    var additionalParams = {
        headers: {
            //'Access-Control-Allow-Origin': '*',
            'Content-Type': file.type
            // 'X-Api-Key': ''
        }
    }

    url = "https://c0xy572rvg.execute-api.us-east-1.amazonaws.com/Stage1/upload/sz.photo-strorage/" + file.name
    axios.put(url, file, additionalParams).then(response => {
        console.log(response)
        alert("Image uploaded: " + file.name);
    });
    
}
