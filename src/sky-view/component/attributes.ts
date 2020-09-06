
type Booleanish=boolean | 'false' | 'true';
type Align="left" | "right" | "center";


export interface ElementAttributes{
	tagName?:string;
	class?:string;
	className?:string;
	classList?:Array<string>;
	id?: string;
	itemProp?: string;
	itemScope?: boolean;
	itemType?: string;
	itemID?: string;
	itemRef?: string;
	slot?: string;
	unselectable?: 'on' | 'off';
}

export interface HTMLAttributes extends ElementAttributes{
	contentEditable?: Booleanish;
	//contextMenu?: string;
	dir?: string;
	//draggable?: Booleanish;//TODO
	hidden?: boolean;
	lang?: string;
	tabIndex?: number;
	title?: string;
	translate?: 'yes' | 'no';
	role?: string;
}
export interface DivAttributes extends ElementAttributes{
	align?:Align
}
interface LinkAttributes extends ElementAttributes{
	href?: string;
	hrefLang?: string;
	media?: string;
	ping?: string;
	rel?: 'alternate'|'stylesheet'|'start'|'next'|'prev'|'contents'|'index'|'glossary'|'copyright'|'chapter'|'section'|'subsection'|'appendix'|'help'|'bookmark'
	|'nofollow'|'noopener'|'noreferrer'|'licence'|'tag'|'friend'|string;
	shape?: 'default'|'rect'|'circle'|'poly';
	target?: '_blank'|'_self'|'_top'|'_parent'|string;
	type?: "text/html"|string;
}
export interface AnchorAttributes extends LinkAttributes{
	download?: any;
}
export interface AreaAttributes extends LinkAttributes{
	alt?: string;
	coords?: string;
}
export interface MapAttributes extends HTMLAttributes {
	name?: string;
}
interface MediaAttributes extends HTMLAttributes{
	autoPlay?: boolean;
	controls?: boolean;
	controlsList?:'nodownload'|'nofullscreen'|'noremoteplayback'|string;
	crossOrigin?:"anonymous"|"use-credentials";
	loop?: boolean;
	muted?: boolean;
	playsInline?: boolean;
	preload?: 'auto'|'metadata'|'none';
	src?: string;
}
export interface AudioAttributes extends MediaAttributes{
}
export interface VideoAttributes extends MediaAttributes{
	poster?: string;
	height?: number | string;
	width?: number | string;
	disablePictureInPicture?: boolean;
}
export interface SourceAttributes{
	media?: string;
	sizes?: string;
	src?: string;
	srcSet?: string;
	type?: string;
}
export interface TrackAttributes{
	default?: boolean;
	kind?: string;
	label?: string;
	src?: string;
	srcLang?: string;
}
export interface BGSoundAttributes{
	autoStart?:Booleanish;
	loop?: boolean;
}
interface ControlAttributes extends HTMLAttributes{
	accessKey?: string;
	autoFocus?: boolean;
	form?: string;
	disabled?:boolean;
	name?: string;
	value?: string | ReadonlyArray<string> | number;
}
export interface ListBoxAttributes extends SelectAttributes{
	multiple?: true;
}
export interface ComboBoxAttributes extends SelectAttributes{
	multiple?: false;
}
export interface SelectAttributes extends ControlAttributes{
	autoComplete?: string;
	multiple?: boolean;
	placeholder?: string;
	required?: boolean;
	size?: number;
}
export interface OptgroupAttributes{
	disabled?:boolean;
	label?: string;
}
export interface OptionAttributes{
	disabled?:boolean;
	label?: string;
	selected?: boolean;
	value?: string | ReadonlyArray<string> | number;
}
export interface TextInputAttributes extends ControlAttributes{
	autoComplete?: string;
	placeholder?: string;
	inputMode?: 'none'|'text'|'tel'|'url'|'email'|'numeric'|'decimal'|'search';
	enterkeyhint?:'enter'|'go'|'next'|'previous'|'search'|'send';
	maxLength?: number;
	minLength?: number;
	pattern?: string;
	readOnly?: boolean;
	required?: boolean;
	size?: number;
}
export interface TextareaAttributes extends TextInputAttributes{
	cols?: number;
	colSpan?: number;
	rows?: number;
	wrap?: 'soft'|'hard';
}
export interface TextBoxAttributes extends TextInputAttributes{
	list?: string;
}
export interface FileInputAttributes extends ControlAttributes{
	type?:"file";
	accept?:'image/*'|'image/png,image/jpeg,image/gif'|'video/*'|'audio/*'|string;
	capture?:'user'|'environment';
	multiple?: boolean;
	required?: boolean;
}
export interface NumberInputAttribute extends ControlAttributes{
	max?: number | string;
	min?: number | string;
	placeholder?: string;
	required?: boolean;
	step?: number | string;
}
export interface CheckBoxAttributes extends ControlAttributes{
	checked?: boolean;
}
export type RadioAttributes=CheckBoxAttributes;
export interface ButtonAttributes extends ControlAttributes{
	type:"button"|"submit"|"reset";
	value?: string | ReadonlyArray<string> | number;
}
export interface SubmitImageAttributes extends ImageAttributes{
	type:"image";
}
export interface SubmitAttributes extends ButtonAttributes{
	type:"submit";
	formAction?: string;
	formEncType?: string;
	formMethod?: string;
	formNoValidate?: boolean;
	formTarget?: string;
}
export type InputAttributes = TextInputAttributes|FileInputAttributes|CheckBoxAttributes|ButtonAttributes;

export interface IFrameAttributes extends HTMLAttributes{
	allow?: string;
	allowFullScreen?: boolean;
	allowTransparency?: boolean;
	frameBorder?: number | string;
	height?: number | string;
	loading?: "eager" | "lazy";
	marginHeight?: number;
	marginWidth?: number;
	name?: string;
	sandbox?: string;
	scrolling?:'yes'|'no'|string;
	seamless?: boolean;
	src?: string;
	srcDoc?: string;
	width?: number | string;
}
export interface FormAttributes extends HTMLAttributes{
	acceptCharset:"UTF-8"|"ISO-8859-1"|string;
	action?: string;
	autoComplete?: string;
	encType?:"application/x-www-form-urlencoded"|"multipart/form-data"|"text/plain";
	method?: "GET"|"POST";
	name?: string;
	noValidate?: boolean;
	target?: '_blank'|'_self'|'_top'|'_parent'|string;
}
export interface FieldsetAttributes extends HTMLAttributes{
	disabled?:boolean;
	form?: string;
	name?: string;
}
export interface LabelAttribute extends HTMLAttributes{
	form?: string;
	for:string;
}
export interface ImageAttributes extends HTMLAttributes{
	alt?: string;
	border?:number|string;
	crossOrigin?:"anonymous"|"use-credentials";
	decoding?:'sync'|'async'|'auto';
	height?: number | string;
	loading?: "eager" | "lazy";
	isMap?:boolean;
	sizes?: string;
	src?: string;
	srcSet?: string;
	useMap?: string;
	width?: number | string;
}
export interface TableAttributes extends HTMLAttributes{
	background?: string;
	bgcolor?: string;
	cellPadding?: number | string;
	cellSpacing?: number | string;
	summary?: string;
}
export interface TDAttributes extends HTMLAttributes{
	align?: "left" | "center" | "right" | "justify" | "char";
	colSpan?: number;
	headers?: string;
	rowSpan?: number;
}
export interface THAttributes extends TDAttributes{
	scope?:'col'|'row'|'colgroup'|'rowgroup';
}
export interface ColGroupAttributes extends HTMLAttributes{
	bgcolor?: string;
	span?: number;
}
export interface ColAttributes extends HTMLAttributes{
	bgcolor?: string;
	span?: number;
	width?: number | string;
}
export interface TBodyAttributes extends HTMLAttributes{
	bgcolor?: string;
}
export interface TFootAttributes extends HTMLAttributes{
	bgcolor?: string;
}
export interface TRAttributes extends HTMLAttributes{
	bgcolor?: string;
}
export interface HRAttributes extends HTMLAttributes{
	color?: string;
}
export interface OLAttribute extends HTMLAttributes{
	reversed?: boolean;
	start?: number;
	type?: '1' | 'a' | 'A' | 'i' | 'I';
}
export interface LiAttributes extends HTMLAttributes{
	value?: number;
}
export interface DialogAttributes extends HTMLAttributes {
	open?: boolean;
}
export interface CanvasAttributes extends HTMLAttributes{
	height?: number | string;
	width?: number | string;
}
export interface MeterAttribute extends HTMLAttributes{
	high?: number;
	low?: number;
	max?: number | string;
	min?: number | string;
	optimum?: number;
	value?: string | ReadonlyArray<string> | number;
}
export interface ProgressAttribute extends HTMLAttributes{
	max?: number | string;
	value?: string | ReadonlyArray<string> | number;
}
export interface MarqueeAttributes extends HTMLAttributes{
	bgcolor?: string;
	loop?: boolean;
}
export interface DetailsAttributes extends HTMLAttributes{
	open?: boolean;
}
export interface ObjectAttributes extends HTMLAttributes{
	classID?: string;
	data?: string;
	name?: string;
	height?: number | string;
	type?: string;
	useMap?: string;
	width?: number | string;
}
export interface ParamAttributes extends HTMLAttributes{
	name?: string;
	value?: string | ReadonlyArray<string> | number;
}
export interface EmbedAttributes extends HTMLAttributes{
	height?: number | string;
	src?: string;
	type?: "application/x-shockwave-flash"|"image/svg+xml"|"application/pdf"|"audio/mp3"|string;
	width?: number | string;
	wmode?:'window'|'opaque'|'transparent'|string;
}

export interface BlockquoteAttributes extends HTMLAttributes{
	cite?: string;
}
export interface QAttributes extends HTMLAttributes{
	cite?: string;
}
export interface DelAttributes extends HTMLAttributes{
	cite?: string;
	dateTime?: string;
}
export interface InsAttributes extends HTMLAttributes{
	cite?: string;
	dateTime?: string;
}
export interface FontAttributes extends HTMLAttributes{
	color?: string;
}
export interface TimeAttributes extends HTMLAttributes{
	dateTime?: string;
	pubdate?: boolean;
}

export interface SlotAttributes {
	name?: string;
}