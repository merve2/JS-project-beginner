export class StorageManager{
    static save(key,data){
        try{
            localStorage.setItem(key,JSON.stringify(data));
    }catch (error){
      console.error('veri kaydedilemedi:',error);
     }
    }

    static load(key){
        try{
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error){
            console.error('veri yüklenemedi:', error);
            return null;
        }
    }

static remove (key){
    try{
    localStorage.removeItem(key);
}  catch(error){
    console.error('veri silinemedi: ',error);
}
}
}
