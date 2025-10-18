import {Repository, DeepPartial, FindOptionsWhere, ObjectLiteral} from 'typeorm';
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";
import {NotFoundException} from "@nestjs/common";

export class BaseService<T extends ObjectLiteral> {
    constructor(private readonly repository: Repository<T>) {}

    async findOrCreate(where: FindOptionsWhere<T>, entity: DeepPartial<T>): Promise<T> {
        let found = await this.repository.findOne({ where });
        if (!found)
            return this.repository.save(entity);

        return found;
    }

    async find(where: FindOptionsWhere<T>, relations: any): Promise<T[]> {
        if (!where)
            throw new NotFoundException('No criteria provided to find items');

        return await this.repository.find({ where, relations });
    }

    async findAll(): Promise<T[]> {
        return await this.repository.find();
    }

    async findById(id: number): Promise<T> {
        if (!id)
            throw new NotFoundException('Item not found');
        const found= await this.repository.findOne({ where: { id } as any });
        if (!found)
            throw new NotFoundException('Item not found');
        return found;
    }

    async create(entity: DeepPartial<T>): Promise<T> {
        return this.repository.save(entity);
    }

    async update(id: number, entity: QueryDeepPartialEntity<T>): Promise<T> {
        const found = await this.findById(id);
        if (!found){
            throw new NotFoundException('Item not found');
        }

        await this.repository.update(id, entity);
        return this.findById(id);
    }

    async delete(id: number): Promise<void> {
        const found = await this.findById(id);
        if (!found){
            throw new NotFoundException('Item not found');
        }
        await this.repository.delete(id);
    }
}