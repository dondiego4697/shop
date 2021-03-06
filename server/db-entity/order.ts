import {toFinite} from 'lodash';
import {Entity, PrimaryGeneratedColumn, Column, OneToMany, AfterLoad, ManyToOne, JoinColumn} from 'typeorm';
import {OrderPosition, User, OrderStatusHistory} from '$db-entity/entities';
import {DbTable} from '$db-entity/tables';

interface Data {
    sdek: string;
}

export enum OrderStatus {
    CREATED = 'CREATED', // создан, но не оплачен
    CONFIRMED = 'CONFIRMED', // оплачен
    IN_DELIVERY = 'IN_DELIVERY',
    FINISHED = 'FINISHED'
}

export enum OrderResolution {
    SUCCESS = 'SUCCESS',
    CANCELLED = 'CANCELLED', // Со стороны пользователя
    ANNULATED = 'ANNULATED' // Со стороны сервиса
}

@Entity({name: DbTable.ORDER})
export class Order {
    @AfterLoad()
    _convertNumerics() {
        this.id = toFinite(this.id);
        this.userId = toFinite(this.userId);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => OrderPosition, (position) => position.order)
    orderPositions: OrderPosition[];

    @OneToMany(() => OrderStatusHistory, (status) => status.order)
    orderStatusesHistory: OrderStatusHistory[];

    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    user: User;

    @Column({name: 'user_id'})
    userId: number;

    @Column({name: 'public_id'})
    publicId: string;

    @Column({type: 'jsonb'})
    data: Data;

    @Column({name: 'client_phone'})
    clientPhone: string;

    @Column({name: 'delivery_address'})
    deliveryAddress: string;

    @Column({nullable: true, name: 'delivery_comment'})
    deliveryComment?: string;

    @Column({name: 'delivery_date'})
    deliveryDate: Date;

    @Column()
    status: OrderStatus;

    @Column({nullable: true})
    resolution?: OrderResolution;

    @Column({name: 'created_at'})
    createdAt: Date;
}
