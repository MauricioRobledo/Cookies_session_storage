import fs from "fs"

// Crea un archivo donde se agregan los url de las fotos de perfil de cada usuario con su id 
export const agregarAvatar = async(id, avatar)=>{
    const newAvatar = {
        id:id,
        avatar:avatar
    }
    if(fs.existsSync("./src/public/avatars/avatar.txt")){
    const contenido = await fs.promises.readFile("./src/public/avatars/avatar.txt","utf8");
    const avatars = JSON.parse(contenido);
    avatars.push(newAvatar)
    await fs.promises.writeFile("./src/public/avatars/avatar.txt", JSON.stringify(avatars, null, 2));
    }else{
        await fs.promises.writeFile("./src/public/avatars/avatar.txt", JSON.stringify([newAvatar], null, 2));
    }
    
    
}
