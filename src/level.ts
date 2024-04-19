import { EventEmitter } from 'eventemitter3';
import type { EntityJSON } from './entity.js';
import { Entity } from './entity.js';

export interface LevelJSON {
	entities: EntityJSON[];
}

export class Level extends EventEmitter<{
	tick: [];
}> {
	public entities: Set<Entity> = new Set();

	public constructor(public readonly id: string) {
		super();
	}

	public tick() {
		for (const entity of this.entities) {
			entity.update();
		}
		this.emit('tick');
	}

	public getEntityByID(id: string): Entity {
		for (const entity of this.entities) {
			if (entity.id == id) {
				return entity;
			}
		}
	}

	public toJSON(): LevelJSON {
		return {
			entities: [...this.entities].map(entity => entity.toJSON()),
		};
	}

	public fromJSON(json: LevelJSON) {
		this.entities = new Set(json.entities.map(entity => Entity.FromJSON(entity, this)));
	}
}
