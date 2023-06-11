const status = require("./NTSTATUS.js");
const connection = require("./connection.js");
async function setAddFolderInterface (param) {
    const result = await connection.setAddFolder(param);
    return result;
}
const folderView =async (param) => {
    var visible=0;
    //console.log(param);
    var part=param.address.split("/");
    if(part.length>2){
        return status.unsuccessful;
    }   
    if(!param.address.includes('All')){
        return status.unsuccessful;
    }
    visible=part.length;
    var html = '<div class="box" style = "margin-top: 20px;">';
    html += '<div class="row" style="height: max-content;">';
    html += '<div class="col-md-2">';
    if (visible==1) { 
        html += '<div class="simge add" data-registration-number="All/'+param.name+'">';
        html += '<i class="fa-solid fa-plus "></i>';
    } else { 
        html += '<div class="simge"> ';
    } 
    html += '</div></div>';
    if (visible==2) { 
        html += '<div class="col-md-10 cursor"><div data-registration-number="All/'+part[1]+"/"+ param.name+'"  onclick="makeRequest($(this).data("registration-number"))"> '+ param.name +'</div> </div> ';
    } else { 
        html += '<div class="col-md-10"> '+param.name+'</div> ';
    }
    html += '</div ></div > ';

    const result= await setAddFolderInterface(param);
    if(result==status.success){
        return html;
    }
    else{
        return status.unsuccessful;
    }

}
module.exports={
    folderView
}