import { pick, randomHex } from 'utilium';
import type { Level } from './level.js';

export interface Point {
	x: number;
	y: number;
}

export interface EntityJSON {
	id: string;
	name?: string;
	parent?: string;
	children: string[];
	position: Point;
	rotation: Point;
	scale: Point;
}

const copy = ['id', 'name', 'position', 'rotation', 'scale'] as const;

export class Entity {
	public name?: string;

	public parent?: Entity;
	public children: Set<Entity> = new Set();

	public position: Point;
	public rotation: Point;
	public scale: Point;

	protected _level: Level;
	public get level(): Level {
		return this._level;
	}
	public set level(value: Level) {
		if (value === this._level) {
			return;
		}
		if (this._level) {
			this._level.entities.delete(this);
		}
		value.entities.add(this);
		this._level = value;
	}

	public constructor(
		public readonly id = randomHex(32),
		level: Level
	) {
		this.level = level;
	}

	public toJSON(): EntityJSON {
		return {
			...pick(this, copy),
			parent: this.parent?.id,
			children: [...this.children].map(child => child.id),
		};
	}

	public fromJSON(json: EntityJSON) {
		Object.assign(this, pick(json, copy));
		this.parent = this.level.getEntityByID(json.parent);
		this.children = new Set(json.children.map(child => this.level.getEntityByID(child)));
	}

	public static FromJSON(json: EntityJSON, level: Level): Entity {
		const entity = new Entity(json.id, level);
		entity.fromJSON(json);
		return entity;
	}
}
