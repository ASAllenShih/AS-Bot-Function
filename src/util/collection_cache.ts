import { Collection } from 'discord.js';
interface CollectionCacheConfig {
	ttl: number | undefined;
}
class CollectionCache {
	private collection: Collection<any, any> = new Collection<any, any>();
	private timeouts: Collection<any, NodeJS.Timeout> = new Collection<any, NodeJS.Timeout>();
	private config: CollectionCacheConfig;
	constructor(config: CollectionCacheConfig) {
		this.config = config;
	}
	public get(key: any): any {
		return this.collection.get(key);
	}
	public delete(key: any): boolean {
		if (this.timeouts.has(key)) {
			clearTimeout(this.timeouts.get(key));
			this.timeouts.delete(key);
		}
		return this.collection.delete(key);
	}
	public set(key: any, value: any, ttl?: number): void {
		this.collection.set(key, value);
		if (this.timeouts.has(key)) {
			clearTimeout(this.timeouts.get(key));
		}
		this.timeouts.set(key, setTimeout(() => {
			this.timeouts.delete(key);
			this.collection.delete(key);
		}, (ttl ?? this.config.ttl ?? 0) * 1000));
	}
	public has(key: any): boolean {
		return this.collection.has(key);
	}
	public clear(): void {
		this.collection.clear();
		this.timeouts.forEach((timeout) => {
			clearTimeout(timeout);
		});
		this.timeouts.clear();
	}
	public size(): number {
		return this.collection.size;
	}
	public keys(): MapIterator<any> {
		return this.collection.keys();
	}
	public values(): MapIterator<any> {
		return this.collection.values();
	}
	public entries(): MapIterator<any> {
		return this.collection.entries();
	}
	public forEach(callbackfn: (value: any, key: any, map: Map<any, any>) => void): void {
		this.collection.forEach(callbackfn);
	}
	public map(callbackfn: (value: any, key: any, collection: Collection<any, any>) => any): any[] {
		return this.collection.map(callbackfn);
	}
	public filter(callbackfn: (value: any, key: any, collection: Collection<any, any>) => boolean): Collection<any, any> {
		return this.collection.filter(callbackfn);
	}
	public find(callbackfn: (value: any, key: any, collection: Collection<any, any>) => boolean): any {
		return this.collection.find(callbackfn);
	}
	public some(callbackfn: (value: any, key: any, collection: Collection<any, any>) => boolean): boolean {
		return this.collection.some(callbackfn);
	}
	public every(callbackfn: (value: any, key: any, collection: Collection<any, any>) => boolean): boolean {
		return this.collection.every(callbackfn);
	}
}
export {
	CollectionCache,
};