
class ContenedorMongo{
    constructor(model){
        this.model = model 
    }

    async getAll(){
        try{
            const result = await this.model.find()
            return result
        } catch (error) {
        return `Hubo un error ${error}`
        }
    }

    async save(doc){
        try{
            const list = await this.model.find()
            const exist = list.length
            if (exist !== 0){
                const lastIdAdded = await this.model.find({},{_id:1}).sort({_id:-1}).limit(1)
                const id = lastIdAdded[0]._id
                const newDoc={
                    _id: id+1,
                    ...doc
                }
                await this.model.insertMany(newDoc)
                return("Creado con exito")
            }else{
                const newDoc ={
                    _id: 1,
                    ...doc
                }
                await this.model.insertMany(newDoc)
                return("Creado con exito")
            }
            

        }catch (error) {
            return `Hubo un error ${error}`
        }
    }

    async getById(id){
        try{
            const result = await this.model.find({_id: id})
            return result
        }catch (error) {
            return `Hubo un error ${error}`
        }
    }

    async deleteById(id){
        try{
            await this.model.deleteOne({_id: id})
        }catch (error) {
            return `Hubo un error ${error}`
        }
    }

    async updateById(id, body){
        try{
            await this.model.deleteOne({_id:id})
            const newBody ={
                _id: id,
                ...body
            }
            await this.model.insertMany(newBody)
            const result = await this.model.find()
            return result
        }catch (error) {
            return `Hubo un error ${error}`
        }
    }
    async addProduct(id, product){
        try{
            await this.model.updateOne({_id: id},{
            $push : {products : product[0]}})
            return "Producto agregado con exito"
        }catch (error) {
            return `Hubo un error ${error}`
        }
    }
    async removeProduct(id, product){
        try{
            await this.model.updateOne({_id: id},{
                $pull : {products : product[0]}})
        }catch (error) {
            return `Hubo un error ${error}`
        }
    }

    async saveOrder(cart, email){
        try{
            const list = await this.model.find()
            const exist = list.length
            if(exist !== 0){
                const lastIdAdded = await this.model.find({},{_id:1}).sort({_id:-1}).limit(1)
                const id = lastIdAdded[0]._id
                const order ={
                    _id: id+1, 
                    timestamp:cart[0].timestamp,
                    products:cart[0].products,
                    email:email
                }
                await this.model.insertMany(order)
            }else{
                const order ={
                    _id: 1, 
                    timestamp:cart[0].timestamp,
                    products:cart[0].products,
                    email:email
                }
                await this.model.insertMany(order)
            }
            return ("OK")
        }catch(error){
            return `Hubo un error ${error}`
        }

    }


    async getByCategory(category){
        try{
            const result = await this.model.find({category:category})
            console.log(result)
            if(result){
                return result
            }else{
                return "No existen productos de esa categoria"
            }
        }catch(error){
            return `Hubo un error ${error}`
        }
    }

}
export {ContenedorMongo}