import { Tag } from "./Tag";
import { Component } from "./Component";

export interface ComponentConstructor{
	new(props:any,children?:Tag[]):Component;
}