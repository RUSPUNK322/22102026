import SqliteLinker from '../db/sqlite';
export default class ItemService{
    constructor(){
        this.link = new SqliteLinker();
    }
    async getAll({ids}){
        let res;
        if(isEmpty(ids) || ids.length===0){
            res = await this.link.all('select*from item');
        }
        else{
             res =await this.link.all(`
            select*from item
            wherte id in (${this.link.createPlaceholders(ids)})`, ids);
        }
        return res; 
    }
    async getOne(id){
        return this.getAll({ids:id});
    }
    async SoftDelete(id){
        await this.link.run(`
            update item
            set is_deleted = true
            where id=?`,[id])
    }
    async update(id,{
        name,
        properties,
        status,
        location_id,
        current_location_id,
        category_id,
    }){
        
        const block = this.link.createSetBlock({
                name,
                properties,
                status,
                location_id,
             current_location_id,
                category_id
            })
    }
    async create({
        name,
        properties,
        status,
        location_id,
        current_location_id,
        category_id
    }){
        const value = [
              name,
        properties,
        status,
        location_id,
        current_location_id,
        category_id
        ];
        const {lastId} = await link.run(
            `
            insert into item
            values (${this.link.createPlaceholders(values)})`, values
        );
        return this.getOne(lastId);
    }
}