const { initializeApp } = require("firebase/app");
const { getDatabase, ref, get, child, update, push } = require("firebase/database");
const { getAuth } = require("firebase/auth");
const status = require("./NTSTATUS.js");

const firebaseConfig = {
    

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const dbRef = ref(database);

const fetchData = async () => {
    try {
        const snapshot = await get(child(dbRef, 'titles/'));
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
        return -1;
    }
};
const getTexts = async (address) => {
    if (address.includes('/')) {
        try {
            const snapshot =await get(child(dbRef, 'titles/' + address));
                if (snapshot.exists()) {
                return snapshot.val();
            } else {
                return { status: status.unsuccessful };
            }
        }
        catch (error) {
            console.error(error);
            return { status: status.unsuccessful };
        } 
    } else {
        return { status: status.unsuccessful };
    }
};
const dataBaseTitleControl = async (param) => {
    console.log(param);
    try {
        const snapshot = await get(child(dbRef, 'titles'+param));
        if (snapshot.exists()) {
            return status.success;
        } else {
            return  status.unsuccessful;
        }
    } catch (error) {
        console.error(error);
        return  status.unsuccessful;;
    }
};
const setFolder = async (address) => {
    try {
        const ref = child(dbRef, 'titles/');
        await update(ref, {
            [address]:""
        });
        const snapshot = await get(ref);
        if (snapshot.exists()) {
            return status.success;
        } else {
            return status.unsuccessful;
        }
    } catch (error) {
        console.error(error);
        return status.unsuccessful;
    }
};

const setAddFolder = async (param) => {
    var result;
    try {
        if (!param || typeof param !== 'object' || !param.address || !param.name) {
            return status.unsuccessful;
        }      
        const cleanedAddress = param.address.replace("All", "");
        const resultControl=await dataBaseTitleControl(cleanedAddress + param.name);
        result=resultControl;
        console.log();
        if(result==status.unsuccessful){
        const resultSetFolder= await setFolder(cleanedAddress+"/"+param.name);
        return resultSetFolder;
    }
    } 
    catch (error) {
        return status.unsuccessful
    }
    return returnControl;
};
const setAddFile = async (name,lastOpenTest) => {
    const address=lastOpenTest+"/"+name;
    if(address.split("/").length!=3){
        return status.unsuccessful;
    }
    try {
        const ref = child(dbRef, 'titles/'+lastOpenTest+"/Texts");
        const result=await push(ref, {
            text:"",
            title:name
        });
        if (result) {
            return result.key;
        } else {
            return status.unsuccessful;
        }
    } catch (error) {
        console.error(error);
        return status.unsuccessful;
    }
};
const setUpdateNewTex = async (id,text,lastOpenTest) => {
    console.log(id,text,lastOpenTest);
    try {
        if (!id || !text || !lastOpenTest) {
            return status.unsuccessful;
        }     
        const result = await update(ref(database, 'titles/' + lastOpenTest + "/Texts/" + id), {
            text: text
        });
        if (result == null) {
            return status.success;
        } else {
            return status.unsuccessful;
        }
    } 
    catch (error) {
        console.error(error);
        return status.unsuccessful
    }
};

module.exports = {
    auth,
    database,
    fetchData,
    getTexts,
    setAddFolder,
    setAddFile,
    setUpdateNewTex
};
