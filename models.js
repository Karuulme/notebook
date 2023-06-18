const status = require("./NTSTATUS.js");
const connection = require("./connection.js");
async function setAddFolderInterface (param) {
    const result = await connection.setAddFolder(param);
    return result;
}
const createPed=async (param)=>{
    var tirnak ="'";
    var html = '<div class="box" style = "margin-top: 20px;">';
    html += '<div class="row" style="height: max-content;">';
    html += '<div class="col-md-2">';
    if (param.visible==1) { 
        html += '<div class="simge add" data-registration-number="All/'+param.name+'">';
        html += '<i class="fa-solid fa-plus "></i>';
    } else { 
        html += '<div class="simge"> ';
    }
    html += '</div></div>';
    if (param.visible==2) { 
        html += '<div class="col-md-10 cursor"><div data-registration-number="'+param.part+"/"+ param.name+'"  onclick="makeRequest($(this).data('+tirnak+'registration-number'+tirnak+'))"> '+ param.name +'</div> </div> ';
    } else { 
        html += '<div class="col-md-10"> '+param.name+'</div> ';
    }
    html += '</div ></div > ';
    return html;
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
    var html=await createPed({visible:visible,name:param.name,part:part[1]});

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
