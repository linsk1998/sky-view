
interface PropertyChangeEvent extends Event{
	propertyName:string,
	srcElement:Element
}
interface Document {
	attachEvent:void|((event:string,callback:Function)=>void)
}
interface WheelEvent{
	wheelDelta:number
}