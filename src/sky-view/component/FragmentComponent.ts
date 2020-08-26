import { Component } from "../render/Component";

export abstract class FragmentComponent implements Component{
	renderTo(parent: Node): void {
		throw new Error("Method not implemented.");
	}
	destroy(): void {
		throw new Error("Method not implemented.");
	}
	on(name: string, callback: Function, thisArg?: any): void {
		throw new Error("Method not implemented.");
	}
	off(name: string, callback: Function): void {
		throw new Error("Method not implemented.");
	}
	emit(name: string, ...args: any[]): void {
		throw new Error("Method not implemented.");
	}
}
